#### 如何改变 Promise 的状态？
- `resolve(value)`：如果当前状态为 pending 就会变为 resolved
- `reject(reason)`：如果当前状态为 pending 就会变为 rejected
- 抛出异常：如果当前是 pending 就会变为 rejected
```javascript
const promise = new Promise((resolve, reject) => {
  resolve('successData')  // pending => resolved
  reject('errorData')  // pending => rejected
  throw new Error('error...')  // pending => rejected
})
promsie.then(...).catch(...)
```
#### 一个 Promise 指定多个成功 / 失败的回调函数，都会调用吗？
- 当 Promise 改变为对应状态时都会调用

```javascript
const promise = Promise.resolve('successData')
promise.then(
  value => {console.log('value1', value)},  // value1 successData
  reason => {...}
)
promise.then(
  value => {console.log('value2', value)},  // value2 successData
  reason => {...}
)
```

#### 改变 Promise 状态和指定回调函数谁先谁后？
- 都有可能，正常情况下是先指定回调再改变状态，但也可以先改变状态再指定回调
- 先改变状态再指定回调
  - 在执行器中直接调用 `resolve() / reject()`
  - 延迟更长时间才调用 `then()`
- 什么时候才能得到数据？
  - 如果先指定回调，那么当状态改变时，回调函数就会调用，得到数据
  - 如果先改变状态，那么当指定回调时，回调函数就会调用，得到数据

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')  // 后改变状态(同时指定数据)，异步执行回调函数
  }, 1000)
})
promise.then(  // 先指定回调，保存当前指定的回调函数
  value => {
    console.log('value', value)
  },
  reason => {
    console.log('reason', reason)
  }
)
```
```javascript
const promise = new Promise((resolve, reject) => {
  resolve('success')  // 先改变状态(同时指定数据)
})
promise.then(  // 后指定回调，异步执行回调函数
  value => {
    console.log('value', value)
  },
  reason => {
    console.log('reason', reason)
  }
)
```
```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')  // 先改变状态(同时指定数据)
  }, 1000)
})
setTimeout(() => {
  p.then(  // 后指定回调，异步执行回调函数
    value => {
      console.log('value', value)
    },
    reason => {
      console.log('reason', reason)
    }
  )
}, 1100)
```

#### `promise.then()` 返回的新的 promise 的结果状态由什么决定？
- 简单来说：由 then() 指定的回调函数执行的结果决定
- 详细表达：
  - 如果抛出异常，新 promise 变为 rejected，reason 为抛出的异常
  - 如果返回的是非 promise 的任意值，新 promise 变为 resolved，value 为返回的值
  - 如果返回的是另一个新 promise，此 promise 的结果就会称为 新 promise 的结果

```javascript
new Promise((resolve, reject) => {
  resolve('success')
}).then(
  value => {
    console.log('onResolved', value)
    return '成功'
    // return Promise.resolve('成功')
    // return Promise.reject('失败')
    // throw new Error('失败')
  },
  reason => {
    console.log('onRejected', reason)
  }
).then(
  value => {
    console.log('onResolved1', value)
  },
  reason => {
    console.log('onRejected1', reason)
  }
)
```
![截屏2020-11-10 下午6.03.31.png](https://i.loli.net/2020/11/10/TSEeA8dl5VuBO7j.png)

#### Promise 如何串联多个任务？
- promise 的 `then()` 返回一个新的 promise，可以写成 `then()` 的链式调用
- 通过 `then()` 的链式调用串联多个同步 / 异步任务

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('执行任务1(async)')
    resolve(1)
  }, 1000)
}).then(
  value => {
    console.log('任务1的结果：', value)
    console.log('执行任务2(sync)')
    return 2
  }
).then(
  value => {
    console.log('任务2的结果：', value)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('执行任务3(async)')
        resolve(3)
      }, 1000)
    })
  }
).then(
  value => {
    console.log('任务3的结果：', value)
  }
)
```
![截屏2020-11-10 下午6.40.02.png](https://i.loli.net/2020/11/10/EvNMFjZugQhpcVS.png)

#### Promise 异常穿透
- 当使用 promise 的 `then()` 链式调用时，可以在最后指定失败的回调
- 前面任何操作出了异常，都会传到最后失败的回调中去处理

#### 中断 Promise 链
- 当使用 promise 的 `then()` 链式调用时，在中间中断，不再调用后面的回调函数
- 解决办法：在回调函数中返回一个 `pending` 状态的 promise 对象

```javascript
new Promise((resolve, reject) => {
  reject('error')
}).then(
  value => {
    console.log('onResolved1', value)
    // reason => { throw reason }
    // return Promise.reject(reason)
  }
).then(
  value => {
    console.log('onResolved2', value)
    // reason => { throw reason }
    // ...
  }
).then(
  value => {
    console.log('onResolved3', value)
    // reason => { throw reason }
    // ...
  }
).catch(
  reason => {
    console.log('onRejected', reason)  // 异常穿透，错误处理
  }
)
```
```javascript
new Promise((resolve, reject) => {
  reject('error')
}).then(
  value => {
    console.log('onResolved1', value)
  }
).then(
  value => {
    console.log('onResolved2', value)
  }
).catch(
  reason => {
    console.log('onRejected', reason)
    return new Promise(() => {})  // 返回一个pending的promise，中断promise链
  }
).then({
  value => {
    console.log('onResolved', value)  // 不执行
  }
})
```