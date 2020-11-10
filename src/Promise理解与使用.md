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

#### Promise 怎么用？
##### API
- Promise 构造函数 `Promise(excutor) {}`
  - `excutor` 函数：执行器 `(resolve, reject) => {}`
  - `resolve` 函数：内部定义成功时我们调用的函数 `value => {}`
  - `reject` 函数：内部定义失败时我们定义的函数 `reason => {}`
> excutor 会在 Promise 内部立即同步回调，异步操作在执行器中执行

- `Promise.prototype.then` 方法：`(onResolved, onRejected) => {}`
  - `onResolved` 函数：成功的回调函数 `value => {}`
  - `onRejected` 函数：失败的回调函数 `reason => {}`
> 指定用于得到成功 value 的成功回调和用于得到失败 reason 的失败回调

- `Promise.then.catch` 方法：`(onRejected) => {}`
  - `onRejected` 函数：失败的回调函数 `(reason) => {}`
> then 的语法糖，相当于 `then(undefined, onRejected)`

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('successData')
    // resolve('errorData')
  }, 1000)
}).then(
  value => {
    console.log('onResolved', value)  // onResolved successData
  },
  reason => {
    console.log('onRejected', reason)
  }
)
```

- `Promise.resolve()` 方法：`(value) => {}`
  - `value`：成功的数据或者Promise对象
> 返回一个成功 / 失败的 promise 对象

`Promise.reject()` 方法：`(reason) => {}`
  - `value`：失败的原因
> 返回一个失败的 promise 对象

```javascript
// 产生一个成功值为1的promise对象
const promsie1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
})
const promise2 = Promise.resolve(1)
const promise3 = Promise.reject(2)
promise1.then(value => {console.log(value)})  // 1
promise2.then(value => {console.log(value)})  // 1
// promise3.then(null, reason => {console.log(reason)})
promise3.catch(reason => {console.log(reason)})  // 2
```

`Promise.all()` 方法：`(promises) => {}`
  - `promises`：包含n个 promise 的数组
> 返回一个新的 promise 对象，只有所有的 promise 都成功才能成功，只要有一个失败了就直接失败

```javascript
...
const pAll = Promise.all([promise1, promise2, promise3])
// const pAll = Promise.all([promise1, promise2])
pAll.then(
  values => {
    console.log('all onResolved', values) // promise3失败，不执行
  },
  reason => {
    console.log('all onRejected', reason)  // all onRejected 3
  }
)
```

`Promise.race()` 方法：`(promises) => {}`
  - `promises`：包含n个 promise 的数组
> 返回一个新的 promise 对象，最快完成的 promise 的结果状态就是最终的结果状态

```javascript
...
const pRace = Promise.all([promise1, promise2, promise3])
// const pAll = Promise.all([promise1, promise2])
pAll.then(
  value => {
    console.log('race onResolved', value) // 最快完成的结果即最终结果
  },
  reason => {
    console.log('race onRejected', reason)
  }
)
```