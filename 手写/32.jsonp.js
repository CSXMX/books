// 创建一个全局的回调函数
function handleJSONPResponse(data) {
  console.log("JSONP Response Data: ", data);
  // 在这里处理获取到的数据
}
// 动态创建一个 <script> 元素来加载 JSONP 数据
function makeJSONPRequest(url) {
  // 生成一个唯一的回调函数名
  const callbackName = "jsonpCallback" + Math.round(Math.random() * 100000);
  // 将回调函数名添加到请求的 URL 中
  const script = document.createElement("script");
  script.src = url + "?callback=" + callbackName;
  // 将 <script> 元素添加到页面中
  document.body.appendChild(script);
  // 创建一个全局的回调函数来处理响应
  window[callbackName] = function (data) {
    handleJSONPResponse(data);
    // 响应处理完成后，删除回调函数和 <script> 元素
    delete window[callbackName];
    document.body.removeChild(script);
  };
}

// 发起 JSONP 请求
const jsonpUrl = "https://example.com/api/data";
makeJSONPRequest(jsonpUrl);
