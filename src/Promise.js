/**
 * 自定义Promise函数模块：IIFE
 */

(function (window) {

  /**
   * Promise构造函数
   * excutor：执行器函数(同步执行)
   */
  function Promise (excutor) {
    let _this = this  // 保存当前的promise对象
    _this.status = 'pending'  // 给promise对象指定status属性，初始值为pending
    _this.data = undefined  // 给promise对象指定一个用于存储数据结果的属性
    _this.callbacks = []  // 每个元素的结构：{ onResolved() {}, onRejected() {} }

    function resolve(value) {
      // 如果当前状态不是pending，直接结束
      if (_this.status !== 'pending') return
      // 改变状态 pending => resolved
      _this.status = 'resolved'
      // 保存value数据
      _this.data = value
      // 如果有待执行的callback函数，立即异步执行回调函数onResolved
      if (_this.callbacks.length > 0) {
        setTimeout(() => {  // 放入队列中执行(异步)
          _this.callbacks.forEach(callbackObj => {
            callbackObj.onResolved(value)
          })
        }, 0)
      }
    }

    function reject(reason) {
      // 如果当前状态不是pending，直接结束
      if (_this.status !== 'pending') return
      // 改变状态 pending => rejected
      _this.status = 'rejected'
      // 保存reason数据
      _this.data = reason
      // 如果有待执行的callback函数，立即异步执行回调函数onRejected
      if (_this.callbacks.length > 0) {
        setTimeout(() => {  // 放入队列中执行(异步)
          _this.callbacks.forEach(callbackObj => {
            callbackObj.onRejected(reason)
          })
        }, 0)
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
  */
  Promise.prototype.then = function (onResolved, onRejected) {
    let _this = this
    // 加入当前的状态还是pending状态，将回调函数保存起来
    _this.callbacks.push({
      onResolved,
      onRejected
    })
  }

  /**
  * Promise原型对象的catch()方法
  * 接收一个参数：失败的回调函数
  * 返回一个新的promise对象
  */
  Promise.prototype.catch = function (onRejected) {
    
  }

  /**
  * Promise函数对象的resolve()方法
  * 接收一个参数：成功的结果value
  * 返回一个指定结果的成功的promise对象
  */
  Promise.resolve = function (value) {
    
  }

  /**
  * Promise函数对象的reject()方法
  * 接收一个参数：失败的结果reason
  * 返回一个指定结果的失败的promise对象
  */
  Promise.reject = function (reason) {
    
  }

  /**
  * Promise函数对象的all()方法
  * 接收一个参数：promise的数组promises
  * 返回一个promise，只有当所有promise都成功才成功，否则失败
  */
  Promise.all = function (promises) {
    
  }
  /**
  * Promise函数对象的race()方法
  * 接收一个参数：promise的数组promises
  * 返回一个promise，其结果由最快完成的promise的结果决定
  */
  Promise.race = function (reason) {
    
  }

  //  向外暴露Promise函数
  window.Promise = Promise
})(window)