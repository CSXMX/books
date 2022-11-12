# 00后浅学Vite热更新

## 1. 梦开始的地方

https://cn.vitejs.dev/guide/why.html

根据Vite官方文档中所描述的内容，当我们开始构建越来越大型的应用时，Vite作为新一代的前端构建工具，依然可以保证极致的热更新速度，那么Vite究竟是如何做到的呢？

## 2. 理论基础

**(1)** 首先，Vite 通过在一开始将应用中的模块区分为 **依赖** 和 **源码** 两类，改进了开发服务器启动时间。

**依赖：**采用效率极高的ESbuild进行预构建。

**源码：**Vite 以 原生ESM方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

**(2) **在 Vite 中，HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活(大多数时候只是模块本身),使得无论应用大小如何，HMR 始终能保持快速更新。

**(3)**  Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 `304 Not Modified` 进行协商缓存，而依赖模块请求则会通过 `Cache-Control: max-age= 31536000, immutable` 进行强缓存，因此一旦被缓存它们将不需要再次请求。

## 3. 源码追寻

下面是我从Vite源码中提取的 与实现Vite热更新功能相关的部分代码。

```js
/*
src/node/server/index.js

chokidar是一个文件监听器的npm包，监听着目录下每一个文件的变化。
*/
const watcher = chokidar.watch(
    path.resolve(root),
    resolvedWatchOptions
) as FSWatcher

//某一文件发生改变时
watcher.on('change', async (file) => {
  //normalizePath函数，是将\替换成/，统一文件路径的格式
  file = normalizePath(file)
  //如果是package.json文件有变动，执行invalidatePackageData方法。
  if (file.endsWith('/package.json')) {
    return invalidatePackageData(packageCache, file)
  }
  // invalidate module graph cache on file change
  // 文件更改时使模块图缓存无效
  moduleGraph.onFileChange(file)
  if (serverConfig.hmr !== false) {
    try {
      //进入
      await handleHMRUpdate(file, server)
    } catch (err) {
      ws.send({
        type: 'error',
        err: prepareError(err)
      })
    }
  }
})

watcher.on('add', (file) => {
  handleFileAddUnlink(normalizePath(file), server)
})
watcher.on('unlink', (file) => {
  handleFileAddUnlink(normalizePath(file), server)
})

//根据函数名可推出功能：清除PackageCache里对应路径下的数据。
export function invalidatePackageData(
  packageCache: PackageCache,
  pkgPath: string
): void {
  packageCache.delete(pkgPath)
  const pkgDir = path.dirname(pkgPath)
  packageCache.forEach((pkg, cacheKey) => {
    if (pkg.dir === pkgDir) {
      packageCache.delete(cacheKey)
    }
  })
}

//node/server/moduleGrapth.ts
onFileChange(file: string): void {
  //
    const mods = this.getModulesByFile(file)
    if (mods) {
      const seen = new Set<ModuleNode>()
      mods.forEach((mod) => {
        this.invalidateModule(mod, seen)
      })
    }
}


// 处理失效模块的函数，将模块节点上的多个属性置空
invalidateModule(
  mod: ModuleNode,
  seen: Set<ModuleNode> = new Set(),
  timestamp: number = Date.now()
): void {
  // Save the timestamp for this invalidation, so we can avoid caching the result of possible already started
  // processing being done for this module
  mod.lastInvalidationTimestamp = timestamp
  // Don't invalidate mod.info and mod.meta, as they are part of the processing pipeline
  // Invalidating the transform result is enough to ensure this module is re-processed 	          
  // next time it is requested
  mod.transformResult = null
  mod.ssrTransformResult = null
  invalidateSSRModule(mod, seen)
}

function invalidateSSRModule(mod: ModuleNode, seen: Set<ModuleNode>) {
  if (seen.has(mod)) {
    return
  }
  seen.add(mod)
  mod.ssrModule = null
  mod.ssrError = null
  mod.importers.forEach((importer) => invalidateSSRModule(importer, seen))
}




```

```typescript
//热更新函数
export async function handleHMRUpdate(
  file: string,
  server: ViteDevServer
): Promise<void> {
  const { ws, config, moduleGraph } = server
  //根据文件路径获取文件名
  const shortFile = getShortName(file, config.root)
  const fileName = path.basename(file)

  const isConfig = file === config.configFile
  const isConfigDependency = config.configFileDependencies.some(
    (name) => file === name
  )
  const isEnv =
    config.inlineConfig.envFile !== false &&
    (fileName === '.env' || fileName.startsWith('.env.'))
  
  //配置文件、配置文件的依赖、环境变量文件 是否发生修改
  if (isConfig || isConfigDependency || isEnv) {
    // auto restart server 直接重启服务
    debugHmr(`[config change] ${colors.dim(shortFile)}`)
    config.logger.info(
      colors.green(
        `${path.relative(process.cwd(), file)} changed, restarting server...`
      ),
      { clear: true, timestamp: true }
    )
    try {
      await server.restart()
    } catch (e) {
      config.logger.error(colors.red(e))
    }
    return
  }

  debugHmr(`[file change] ${colors.dim(shortFile)}`)

  // vite客户端本身是没热更新的
  // (dev only) the client itself cannot be hot updated.
  if (file.startsWith(normalizedClientDir)) {
    //full-reload代表浏览器刷新页面
    ws.send({
      type: 'full-reload',
      path: '*'
    })
    return
  }
 
  // 获取文件关联的模块集合
  const mods = moduleGraph.getModulesByFile(file)

  // check if any plugin wants to perform custom HMR handling
  const timestamp = Date.now()
  // 定义一个热更新上下文
  const hmrContext: HmrContext = {
    file,
    timestamp,
    modules: mods ? [...mods] : [],
    read: () => readModifiedFile(file),
    server
  }

  for (const hook of config.getSortedPluginHooks('handleHotUpdate')) {
    const filteredModules = await hook(hmrContext)
    if (filteredModules) {
      //利用handleHotUpdate这个hook，得到受到该文件影响的模块数组
      hmrContext.modules = filteredModules
    }
  }

  //模块数据长度不为0
  if (!hmrContext.modules.length) {
    // html file cannot be hot updated
    
    // 如果修改html文件本身，直接页面刷新
    if (file.endsWith('.html')) {
      config.logger.info(colors.green(`page reload `) + colors.dim(shortFile), {
        clear: true,
        timestamp: true
      })
      ws.send({
        type: 'full-reload',
        path: config.server.middlewareMode
          ? '*'
          : '/' + normalizePath(path.relative(config.root, file))
      })
    } else {
      // loaded but not in the module graph, probably not js
      debugHmr(`[no modules matched] ${colors.dim(shortFile)}`)
    }
    return
  }
  // 进入热更新的核心代码，第二个参数是受到影响的模块数组
  updateModules(shortFile, hmrContext.modules, timestamp, server)
}

export function updateModules(
  file: string,
  modules: ModuleNode[],
  timestamp: number,
  { config, ws }: ViteDevServer
): void {
  //更新的列表
  const updates: Update[] = []
  //失效的模块集合
  const invalidatedModules = new Set<ModuleNode>()
  // 是否需要更新的标志
  let needFullReload = false

  for (const mod of modules) {
    //只处理失效模块的函数
    invalidate(mod, timestamp, invalidatedModules)
    if (needFullReload) {
      continue
    }

    const boundaries = new Set<{
      boundary: ModuleNode
      acceptedVia: ModuleNode
    }>()
    // propagateUpdate函数，计算是否存在死路
    const hasDeadEnd = propagateUpdate(mod, boundaries)
    if (hasDeadEnd) {
      //有死路直接跳过，准备刷新页面
      needFullReload = true
      continue
    }

    // 遍历边界，将信息记录下来
    updates.push(
      ...[...boundaries].map(({ boundary, acceptedVia }) => ({
        type: `${boundary.type}-update` as const,
        timestamp,
        path: normalizeHmrUrl(boundary.url),
        explicitImportRequired:
          boundary.type === 'js'
            ? isExplicitImportRequired(acceptedVia.url)
            : undefined,
        acceptedPath: normalizeHmrUrl(acceptedVia.url)
      }))
    )
  }

  // 直接刷新页面
  if (needFullReload) {
    config.logger.info(colors.green(`page reload `) + colors.dim(file), {
      clear: true,
      timestamp: true
    })
    ws.send({
      type: 'full-reload'
    })
    return
  }

  // 更新列表长度为0
  if (updates.length === 0) {
    debugHmr(colors.yellow(`no update happened `) + colors.dim(file))
    return
  }

  // 打印需要更新的模块路径
  config.logger.info(
    updates
      .map(({ path }) => colors.green(`hmr update `) + colors.dim(path))
      .join('\n'),
    { clear: true, timestamp: true }
  )
  // 发送给客户端消息，告知其更新的模块
  ws.send({
    type: 'update',
    updates
  })
}

export async function handleFileAddUnlink(
  file: string,
  server: ViteDevServer
): Promise<void> {
  const modules = [...(server.moduleGraph.getModulesByFile(file) || [])]

  modules.push(...getAffectedGlobModules(file, server))

  if (modules.length > 0) {
    updateModules(
      getShortName(file, server.config.root),
      unique(modules),
      Date.now(),
      server
    )
  }
}

function areAllImportsAccepted(
  importedBindings: Set<string>,
  acceptedExports: Set<string>
) {
  for (const binding of importedBindings) {
    if (!acceptedExports.has(binding)) {
      return false
    }
  }
  return true
}


// 判断死路，生成HMR边界
function propagateUpdate(
  node: ModuleNode,
  boundaries: Set<{
    boundary: ModuleNode
    acceptedVia: ModuleNode
  }>,
  currentChain: ModuleNode[] = [node]
): boolean /* hasDeadEnd */ {
  // #7561
  // if the imports of `node` have not been analyzed, then `node` has not
  // been loaded in the browser and we should stop propagation.
  if (node.id && node.isSelfAccepting === undefined) {
    debugHmr(
      `[propagate update] stop propagation because not analyzed: ${colors.dim(
        node.id
      )}`
    )
    return false
  }

  if (node.isSelfAccepting) {
    boundaries.add({
      boundary: node,
      acceptedVia: node
    })

    // additionally check for CSS importers, since a PostCSS plugin like
    // Tailwind JIT may register any file as a dependency to a CSS file.
    for (const importer of node.importers) {
      if (isCSSRequest(importer.url) && !currentChain.includes(importer)) {
        propagateUpdate(importer, boundaries, currentChain.concat(importer))
      }
    }

    return false
  }

  // A partially accepted module with no importers is considered self accepting,
  // because the deal is "there are parts of myself I can't self accept if they
  // are used outside of me".
  // Also, the imported module (this one) must be updated before the importers,
  // so that they do get the fresh imported module when/if they are reloaded.
   // 没有导入器的部分接受的模块被认为是自我接受的，
   // 因为交易是“我自己的某些部分我不能自我接受，如果他们在我之外使用“。
   // 另外，导入的模块（这个）必须在导入器之前更新，
   // 这样他们就可以在/如果重新加载时获得新导入的模块。
  if (node.acceptedHmrExports) {
    boundaries.add({
      boundary: node,
      acceptedVia: node
    })
  } else {
    
    // 没有依赖认为是死路
    if (!node.importers.size) {
      return true
    }

    // #3716, #3913
    // For a non-CSS file, if all of its importers are CSS files (registered via
    // PostCSS plugins) it should be considered a dead end and force full reload.
    if (
      !isCSSRequest(node.url) &&
      [...node.importers].every((i) => isCSSRequest(i.url))
    ) {
      return true
    }
  }

  for (const importer of node.importers) {
    const subChain = currentChain.concat(importer)
    // 生成hmr边界
    if (importer.acceptedHmrDeps.has(node)) {
      boundaries.add({
        boundary: importer,
        acceptedVia: node
      })
      continue
    }

    if (node.id && node.acceptedHmrExports && importer.importedBindings) {
      const importedBindingsFromNode = importer.importedBindings.get(node.id)
      if (
        importedBindingsFromNode &&
        areAllImportsAccepted(importedBindingsFromNode, node.acceptedHmrExports)
      ) {
        continue
      }
    }

    
    // 循环引用被认为是死路
    if (currentChain.includes(importer)) {
      // circular deps is considered dead end
      return true
    }

    // 递归调用
    if (propagateUpdate(importer, boundaries, subChain)) {
      return true
    }
  }
  return false
}
```

## 4. 回顾总结

其实上述就是Vite HMR 模块热替换中服务器端的代码。

从 Vite全局的角度总结一下：

1. Vite 本质是 一个基于HTTP 服务器框架connect 的node项目，利用自定义中间件的机制来拦截浏览器端对服务端的请求。[ https://github.com/vuejs/vue-dev-server，vue-dev-server据说是尤大大当年写的玩具vite，

   基于express，实现了vue的单文件编译，并将效果展示到浏览器端。 ]

2. ViteDevServer是一个connect实例，它携带着很多的信息，其中包括一个watcher（一个为 Vite hmr提供服务的文件监听器）。

3. 当服务端监听到文件变化时，触发watcher的change事件。

   如果文件是package.json，则清除缓存中的数据，否则就更新模块依赖图中的模块节点信息，也就是把transformResult、ssrTransformResult等属性置空。

   然后需要判断该路径下的文件类型。如果是vite的配置文件、配置文件的依赖、环境变量文件发生修改，则需要重启服务；如果是html文件或者客户端代码发生改变，则刷新页面，即location.reload().

   如果是其他文件，则通过执行handleHotUpdate这个钩子得到受到该文件影响的模块数组。

4. 然后执行updateModules这一核心方法，计算“边界”主要是遍历模块列表，更新模块的最近热更时间、置空 transformResult 字段，再根据热更客户端 API 的参数对模块的引用者（importers）做同样的更新；最后根据模块间是否存在循环引用等情况判断是否存在“死路”。

5. 根据是否存在“死路”，是的话就向客户端发送 full-reload 命令，否则的话就发送 update 命令；

6. 当我们在浏览器在打开 vite server 链接时，会加载 index.html 文件。加载过程会请求到 server 上的 indexHtmlMiddleawre 中间件，进而调用插件的 transformIndexHtml 钩子对 html 做转换，其中内置的 html 插件会将 @vite/client 写入到 index.html 。加载 @vite/client 会初始化客户端的 websocket 实例，监听服务端的消息，还定义 createHotContext 函数，并在每个使用了 HMR API 的模块中引入并调用该函数，这也是为什么我们能在模块中使用 import.meta.hot 等一系列 API 的根因。

7. 最后当客户端 websocket 接收到 update 或者 full-reload 指令时，会做出相应的动作。full-reload 会执行 location.reload ，update 收集并更新热更模块后动态加载模块资源，加载资源又会回到 server 的 transformMiddleware 做模块的 transform 和 moduleGraph 信息的更新，最终执行 accept(cb) 中的回调函数。

   ​

   总结原文链接：https://juejin.cn/post/7084610661057036296









