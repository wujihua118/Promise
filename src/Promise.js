/**
 * 自定义Promise函数模块：IIFE
 */

(function (window) {

  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'

  /**
   * Promise构造函数
   * excutor：执行器函数(同步执行)
   */
  function Promise (excutor) {
    let that = this  // 保存当前的promise对象
    that.status = PENDING  // 给promise对象指定status属性，初始值为pending
    that.data = undefined  // 给promise对象指定一个用于存储数据结果的属性
    that.callbacks = []  // 每个元素的结构：{ onResolved() {}, onRejected() {} }

    function resolve(value) {
      // 如果当前状态不是pending，直接结束
      if (that.status !== PENDING) return
      // 改变状态 pending => resolved
      that.status = RESOLVED
      // 保存value数据
      that.data = value
      // 如果有待执行的callback函数，立即异步执行回调函数onResolved
      if (that.callbacks.length > 0) {
        setTimeout(() => {  // 放入队列中执行(异步)
          that.callbacks.forEach(callbackObj => {
            callbackObj.onResolved(value)
          })
        })
      }
    }

    function reject(reason) {
      // 如果当前状态不是pending，直接结束
      if (that.status !== PENDING) return
      // 改变状态 pending => rejected
      that.status = REJECTED
      // 保存reason数据
      that.data = reason
      // 如果有待执行的callback函数，立即异步执行回调函数onRejected
      if (that.callbacks.length > 0) {
        setTimeout(() => {  // 放入队列中执行(异步)
          that.callbacks.forEach(callbackObj => {
            callbackObj.onRejected(reason)
          })
        })
      }
    }

    // 立即同步执行executor
    // 如果执行器抛出异常，要捕获异常进行处理
    // pending => rejected
    try {
      excutor(resolve, reject) 
    } catch (error) {
      reject(error)
    }
  }

  /**
  * Promise原型对象的then()方法
  * 接收两个参数：成功和失败的回调函数
  * 返回一个新的promise对象
  * 返回promise的结果由onResolved/onRejected执行的结果决定
  */
  Promise.prototype.then = function (onResolved, onRejected) {
    const that = this
    // 指定回调函数的默认值(必须是函数)
    onResolved = typeof onResolved === "function" ? onResolved : value => value
    onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason } 

    // 返回一个新的promise
    return new Promise((resolve, reject) => {

      function handler (cb) {
        const result = cb(that.data)
        try {
          if (result instanceof Promise) {   // 返回的是promise
            result.then(resolve, reject)
          } else {    // 返回的不是promise
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }

      if (that.status === RESOLVED) {   // 状态为resolved
        setTimeout(() => {
          handler(onResolved)
        })
      } else if (that.status === REJECTED) {    // 状态为rejected
        setTimeout(() => {
          handler(onRejected)
        })
      } else {    // 状态为pending，保存起来
        that.callbacks.push({
          onResolved () {
            handler(onResolved)
          },
          onRejected () {
            handler(onRejected)
          }
        })
      }
    })
  }

  /**
  * Promise原型对象的catch()方法
  * 接收一个参数：失败的回调函数
  * 返回一个新的promise对象
  */
  Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
  }

  /**
  * Promise函数对象的resolve()方法
  * 接收一个参数：成功的结果value
  * 返回一个指定结果的成功的promise对象
  */
  Promise.resolve = function (value) {
    // 返回一个成功/失败的promise
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {   // value是promise => 使value的结果作为promise的结果
        value.then(resolve, reject)
      } else {    // value不是promise => promise变为成功，数据是value
        resolve(value)
      }
    })
  }

  /**
  * Promise函数对象的reject()方法
  * 接收一个参数：失败的结果reason
  * 返回一个指定结果的失败的promise对象
  */
  Promise.reject = function (reason) {
    // 返回一个失败的promise
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  /**
  * Promise函数对象的all()方法
  * 接收一个参数：promise的数组promises
  * 返回一个promise，只有当所有promise都成功才成功，否则失败
  */
  Promise.all = function (values) {
    // if (!Array.isArray(values)) {
    //   const type = typeof values;
    //   return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    // }
    
    // return new Promise((resolve, reject) => {
    //   let resultArr = [];
    //   let orderIndex = 0;
    //   const processResultByKey = (value, index) => {
    //     resultArr[index] = value;
    //     if (++orderIndex === values.length) {
    //         resolve(resultArr)
    //     }
    //   }
    //   for (let i = 0; i < values.length; i++) {
    //     let value = values[i];
    //     if (value && typeof value.then === 'function') {
    //       value.then((value) => {
    //         processResultByKey(value, i);
    //       }, reject);
    //     } else {
    //       processResultByKey(value, i);
    //     }
    //   }
    // });
    // 保存所有成功的value的数组
    let resultArr = new Array(values.length)
    // 用来保存所有成功的promise的数量
    let orderIndex = 0
    return new Promise((resolve, reject) => {
      // 遍历values获取每个promise的结果
      values.forEach((v, index) => {
        Promise.resolve(v).then(
          value => {
            // 成功数量加一
            orderIndex++
            // 将成功的value保存到resultArr
            resultArr[index] = value
            // 全部成功，将return的promise变为成功
            if (orderIndex === values.length) {
              resolve(resultArr)
            }
          },
          reason => {
            reject(reason)
          }
        )
      })
    })
  }
  /**
  * Promise函数对象的race()方法
  * 接收一个参数：promise的数组promises
  * 返回一个promise，其结果由最快完成的promise的结果决定
  */
  Promise.race = function (promises) {
    // 返回一个新的promise
    return new Promise((resolve, reject) => {
      // for (let i = 0; i < promises.length; i++) {
      //   let val = promises[i]
      //   if (val && typeof val.then === "function") {
      //     val.then(resolve, reject)
      //   } else {    // 普通值
      //     resolve(val)
      //   }
      // }
      promises.forEach(v => {
        Promise.resolve(v).then(    // 将普通值包装成为promise => if (val && typeof val.then === "function")...else...
          value => {
            resolve(value)
          },
          reason => {
            reject(reason)
          }
        )
      })
    })
  }

  //  向外暴露Promise函数
  window.Promise = Promise
})(window)