// 浏览器加载图片
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      setTimeout(() => {
        resolve(url);
      }, 2000);
    };
    img.onerror = () => reject(url);
    img.src = url;
  });
}

// Node.js下载图片
const response = await fetch(img.url);
// 检查响应状态码
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
const filename = path.basename(img.url);
const pathName = path.join(__dirname, base + "/" + filename);
const blob = await response.blob();
// 创建可写流
const writer = fs.createWriteStream(pathName);
// 将Blob转换为可读流
blob.stream().pipe(writer);
// 监听完成事件
writer.on("finish", () => {
  metadata[filename] = {
    gender: img.gender,
    workType: img.workType,
    age: img.age,
  };
  // 将元数据写入到json文件中
  saveImgs(sourcePath, metadata);
  console.log(`保存成功：${pathName}.`);
});
