#### Promise 是什么？
##### 理解
- 抽象表达：
  `Promise`是`JavaScript`中进行异步编程的新的解决方案
- 具体表达：
  - 从语法上来说：`Promise`是一个构造函数
  - 从功能上来说：`Promise`对象用来封装一个异步操作并且可以获取其结果

##### Promise 状态的改变
- `pending` => `resolved`
- `pending` => `rejected`
>  注意：只有这两种，且一个 Promise 对象只能改变一次
>  无论变为成功还是失败，都会有一个结果数据
>  成功的结果数据一般称为 value，失败的结果数据一般称为 reason

##### Promise 的基本流程
![image-20201109212453060.png](https://i.loli.net/2020/11/09/w7kWsGJBD1zovCX.png)

##### Promise 的基本使用
```javascript
// 创建一个promise对象
const promise = new Promise((resolve, reject) => {
  // 执行异步操作任务
  setTimeout(() => {
    const time = Date.now()
    // 成功，调用resolve()
    if (time % 2 == 0) {
      resolve('successData, time=' + time)
    } else {
      // 失败，调用reject()
      reject('errorData, time=' + time)
    }
  },1000)
})
promise.then(
  value => {  // 接收得到成功的value数据
    console.log('onResolved', value)
  },
  reason => {  // 接收失败的reason数据
    console.log('onRejected', reason)
  }
)
```
![截屏2020-11-09 下午9.56.25.png](https://i.loli.net/2020/11/09/TPof18hRisS2HOz.png)

#### 为什么要用 Promise？
##### 指定回调函数的方式更加灵活
- 旧的：必须在启动异步任务之前指定
- `promise`：启动异步任务 => 返回`promise`对象 => 给`promise`对象绑定回调函数(甚至可以在异步任务结束后指定/多个)
```javascript
// success
function successCallback (result) {
  console.log('File created successfully' + result)
}
// error
function errorCallback (error) {
  console.log('File creation failed' + error)
}
// 纯回调函数
createFileAsync (settings, successCallback, errorCallback) {
  // do something...
}

// Promise
const promise = createFileAsync (settings) {
  setTimeout(() => {
    promise.then(successCallback, errorCallback)
  }, 3000)
}
```

##### 支持链式调用，可以解决回调地狱的问题
- 回调地狱：回调函数嵌套调用，外部回调函数异步执行的结果为内部回调函数执行的条件
- 缺点：不便于阅读 / 不方便异常处理
- 解决方案：`Promise` 链式调用
- 终极解决方案：`async / await`
```javascript
// 回调地狱
doSth (function(result) {
  doSth2 (result, function(newResult) {
    doSth3(newResult, function(finalResult) {
      // do something...
    }, failureCallback)
  }, failureCallback)
}, failureCallback)

// Promise链式调用解决回调地狱
doSth().then(function(result) {
  return doSth2(result)
})
.then(function(newResult) {
  return doSth3(newResult)
})
.then(function(finalResult) {
  // do something...
})
.catch(failureCallback)

// 终极方案：async / await
async function request () {
  try {
    const result = await doSth()
    const newResult = await doSth2(result)
    const finalResult = await doSth3(newResult)
    // do something...
  } catch (err) {
    failureCallback(err)
  }
}
```