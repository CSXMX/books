# 00后学react hooks 

## 1. 前言

作为一名刚工作的校招萌新，一个00后，一个常年用vue2的，一个react小白，我对react hooks的学习并不深入，所以下面我将从一个初学者的角度，介绍使用react hooks必备的知识点和常见的一些“坑”。

## 2. react独立渲染

**结论：**理解react hooks的关键是要明白hooks组件的每一次渲染都是独立的，也就是说每一次render都会有一个独立的函数作用域。

**案例1：**

```jsx

export default function Login() {
    const [count,setCount] = useState(0);
    function changeCount(count){
        setTimeout(()=>{
            alert('count='+ count);
        },1000)
    }
    return (

    <div>
        <h1>count = {count}</h1>
        <button onClick={()=>setCount(count+1)}>count+1</button>
        <button onClick={()=>changeCount(count)}>alert </button>
    </div>

	)
}

```

点击第一个按钮，变量count就会加1。
点击第二个按钮，变量count的值就会在一秒后alert出来。

![img](https://pic4.58cdn.com.cn/nowater/lbgfe/image/n_v3d7f1a8772d754146bd90b70a5c2efd19.png)

如图所示，如果在这一秒内再次点击两下按钮1，就会发现count的值从4变成6，但是弹出的结果中count的值并没有发生变化，这就证明了前面的结论，count的值只与本次渲染有关，我们获取的并不是最新的值。



**案例2: ** 知道了react hooks的独立渲染后，我们就会想到每次渲染后函数的声明是重复的，所以如果函数组件内的state和props无相关性，可以直接把函数声明在组件的外部。【下面代码只是提供思路，并不是推荐写法】

```jsx
function changeCount(count){
	setTimeout(()=>{
		alert('count='+ count);
	},1000)
}
export default function Login() {
const [count,setCount] = useState(0);
	return (
      <div>
          <h1>count = {count}</h1>
          <button onClick={()=>setCount(count+1)}>count+1</button>
          <button onClick={()=>changeCount(count)}>alert </button>
      </div>
	)
}
```

**注意事项**

```jsx
<button onClick={()=>console.log(count)}>打印count</button>
```

​	根据某位同学的实习经历，他的mentor说像上面这种代码在组里项目是明令禁止的，无论组里项目是react hooks，还是类式组件。

​	其实这是案例1和案例2出现的共同问题，也就是这个功能看起来可以正常使用的箭头函数。如果每次渲染时都需要重新创建新的函数，即前面说的函数重复声明问题，那么根据垃圾回收机制，就需要对前面一个函数进行垃圾回收，这样就会对垃圾回收器造成一定负担。

​	在这一行代码中，button的属性存在一个箭头函数，例如当类式组件使用pureComponent纯组件进行性能优化时，那么这个button属性中的箭头函数就会让react认为每一次渲染都需要创建一个新的箭头函数，也就是说这样的写法会导致pureComponent完全失效，引起不必要的重复渲染。

​	至于解决办法，也很简单，把箭头函数提出去，类式组件提到render方法外面，函数组件就是提到函数外面。

**案例3**

```jsx
const changeCount = (count)=>{
	return ()=>{
		setTimeout(()=>{
			alert('count='+ count);
		},1000)
    }
}
export default function Login() {
	const [count,setCount] = useState(0);
	return (
      <div>
          <h1>count = {count}</h1>
          <button onClick={()=>setCount(count+1)}>count+1</button>
          <button onClick={changeCount(count)}>alert </button>
      </div>
	)
}
```

​	可以看到，案例3的代码并没有完全解决所谓的箭头函数问题，setCount函数为什么没有放在函数组件外呢？

hhhh，因为setCount并非普通函数，而是useState提供的，无法脱离函数组件本身。所以案例3的代码还不是最终的解决方案。



## 3. useState的异步更新问题

​	作为使用react的开发者，每次修改state的数据，都不会立即在页面上显示更新，更新后立即打印同样也显示的是修改前的值。
​	这是因为react的事件分为合成事件和原生事件，原生事件是同步的，合成事件和用的钩子函数的都是异步的，所以我们在调用setState的过程中不要试图去立即获取数据状态的变化。
​	在真实场景下我们使用setState修改数据时会依赖于旧的数据，这时通常采用setState的函数形式。这样，我们就相当于告诉react，count只是有一个递增状态，count值的变化不应该影响useEffect的值，也就可以让count从依赖项数组里去除，不会造成定时器的重复开启和清除。

```jsx
<button onClick={()=>setCount(count=>{
	return count + 1;
})}>count + 1</button>

```



## 4. useEffect、useMemo、useCallback三兄弟

**useEffect**

​	说到react hooks，真正在项目中最常用的其实只有useEffect和useState。上文提到hooks的每一次渲染都是独立的，那么一个hooks组件是如何把每一次渲染关联起来的呢？答案就是useEffect。
​	useEffect是一个可以让开发者在函数组件里执行副作用的hook，副作用是在每次组件渲染之后才会生效，第一个参数是要执行的函数体，第二个参数是一个依赖项数组。

结论：
1.第二个参数为空数组，首先渲染后会执行函数体。
2.第二个参数不写，每次渲染后会都会执行。
3.填了依赖项之后，只有依赖项发生改变才会执行。
4.useEffect的函数体可以返回一个函数，叫清除函数，作用是消除副作用，也就是在下一个effect执行之前，消除上一个effect。例如在useEffect里开一个定时器，如果不在清除函数中清除前面的定时器，就会造成组件的每次渲染都会新开一个定时器。



**useMemo**

​	在简单介绍useMemo之前，我们可以理解下memo，memo类似于类式组件中的pureComponent纯组件和componentShouldUpdate功能，会对传入的props进行一次对比，从而判断出组件是否需要重新渲染。

​	与useEffect写法很类似，第一个参数是callback函数，第二个参数是一个依赖项数组，根据数组里的依赖项是否发生变化来判断是否需要更新回调函数，这听起来是不是很像useEffect。区别在于useMemo是记录函数体的返回值，避免大量的重复计算，这与useEffect完全不同。

​	合理的使用useMemo是可以减少不必要的循环和重复计算，避免很多不必要的开销。



**useCallback**

​	useCallback与useMemo极其相似，唯一的不同点是useMemo返回的是函数运行的结果，useCallback返回是一个函数。经过useCallback包裹的函数，在依赖项不发生改变时，函数不会再次刷新，这就为我们前面案例1中描述的函数重复声明的问题提供了一个新的解决思路，用useCallback包裹函数。代码如下。

**案例4（推荐写法）:**

```jsx

export default function Login() {
	const [count,setCount] = useState(0);
    const sCount = useCallback((count) => {setCount(count+1)}, []);
  	const changeCount = useCallback((count)=>{
    	setTimeout(()=>{
    	    alert('count='+ count);
	    },1000)
    },[]);
    return (
      <div>
          <h1>count = {count}</h1>
          <button onClick={sCount(count)}>count + 1</button>
          <button onClick={changeCount(count)}>alert </button>
      </div>
    )
}
```

通过使用useCallback，依赖项为空数组，所以sCount函数只会在首次渲染时声明一次。







## 5. useRef的妙用

​	使用useRef 可以获取当前元素的所有属性，并且返回一个可变的ref对象，并且这个对象只有current属性，可以设置初始值。
​	除了获取对应的属性值外，useRef还有一个比较重要但很容易忽视的特性，那就是缓存数据。与之前学过的createRef不同的地方在于useRef每次返回的是相同的引用，ref对象的值发生改变，不会触发组件的重新渲染。
在封装一个自定义hooks时，根据2.1里提到的定时器案例，用useState实现变量的控制，获取变量并不是最新的，如果需要获取更新后的值则需要让整个组件重新渲染，在这种情况下，用useRef将会是一个不错的选择。为了随时确保获取的值是最新的，我们可以进行一个简单的封装。

```jsx
const useLastest = (value) =>{
	const ref = useRef(value);
	ref.current = value;
	return ref;
}
```

类似的，我们可以结合useEffect的特性，组件渲染后才会执行本次副作用。

```jsx
const usePrevious = (value) => {
  const ref = useRef(value);
  useEffect(()=>{
  		ref.current = value;
  },[value]);
	return ref.current;
};
```

所以return ref current指向的是value改变之前的值。
使用usePrevious，可以实现记录函数组件前一次渲染的state。

## 

## 6. useEffect的滥用

首先，copy一下react新官网的一句话。
​	If there is no external system involved (for example, if you want to update a component’s state when some props or state change), you shouldn’t need an Effect。
简单翻译一下，就是有这样一个场景。当props和state发生改变时，你需要更新组件的状态，这时不应该使用useEffect。



**提出一个场景**

​	当某个项目的一个函数组件接受到props时，并且需要根据props的值来计算一个变量时。一个react萌新直接在顶层用了一个函数，参数是props，计算出了变量值。

​	一个react"大佬"看后笑了笑，直言props很少改变，你这不是重复计算了？看我的！【了却前端天下事，赢得生前身后名，可怜小萌新！】

**萌新的写法：**

```jsx
function TodoList({ param1，param2 }) {
   const computedParam = func( param1, param2);
  .......
}
```

**“大佬”的写法：**


```jsx
function TodoList({ param1，param2 }) {
  const [computedParam, setComputedParam] = useState([]);
    useEffect(() => {
          setComputedParam( func( param1, param2));
  	}, [param1，param2]);
   .......
}
```

**"大佬"的错误：**

​	react官方认为useEffect处理的是组件渲染后的事情，如果在useEffect里再次执行了改变state的方法，那么react需要再进行一次渲染，也就是说react上一次的渲染，上一次对DOM的修改完全是不必要的，这就是重复渲染！

**我的写法：**

​	useMemo的返回值是函数体的返回结果，当param1，param2的值发生改变时，才会重新计算变量的值，这不就达到我们的要求了吗？

```jsx
function TodoList({ param1，param2 }) {
  const [computedParam, setComputedParam] = useState([]);
    const computedParam = useMemo(() => {
          return func( param1, param2);
  	}, [param1，param2]);
   .......
}
```

**具体案例推荐看react新官方文档：**
https://beta.reactjs.org/learn/you-might-not-need-an-effect

当你认真看了新官方文档后，你就会发现对于萌新的写法，react的评价是 在很多情况下，这段代码很好！

是的！即使存在重复计算的问题，但如果这只是一个复杂度较低的计算，那么你可能不需要useMemo，因为useMemo的使用也是有代价的，强行使用只会造成组件性能的下降。



## 7. 总结

1. 使用useState不追求立即获取修改后的值。
2. 标签上的事件绑定【极不推荐】采用箭头函数的形式，因为这会造成整个组件必定会重复渲染。
3. useEffect中不应该出现改变state的函数，因为这代表组件上一次渲染是完全不必要的，造成重复渲染问题。
4. useMemo记录的是函数体的返回值，useCallback记录的是函数本身，可以解决 使用react hooks的函数重复创建，并且不能把函数提取到函数组件外 的问题。
5. 不需要在Effects里来处理用户事件，因为在 Effect 运行时，您不知道用户做了什么（例如，单击了哪个按钮）。
6. useRef是一个神奇的工具，使用useRef 可以获取当前元素的所有属性，可以获取到最新的元素属性，并且ref对象的值发生改变，不会触发组件的重新渲染。
7. useMemo和useCallback的使用是有代价的，过度的使用可能会造成组件的性能还不如有重复计算或者重复创建函数的组件。







