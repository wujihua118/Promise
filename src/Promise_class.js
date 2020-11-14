/**
 * 自定义Promise函数模块：class版本
 */

const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

class Promise {
  constructor(excutor) {
    let that = this
    that.status = PENDING
    that.data = undefined
    that.callbacks = []

    let resolve = (value) => {
      if (that.status !== PENDING) return
      that.status = RESOLVED
      that.data = value
      if (that.callbacks.length > 0) {
        setTimeout(() => {
          that.callbacks.forEach(callbackObj => {
            callbackObj.onResolved(value)
          })
        })
      }
    }

    let reject = (reason) => {
      if (that.status !== PENDING) return
      that.status = REJECTED
      that.data = reason
      if (that.callbacks.length > 0) {
        setTimeout(() => {
          that.callbacks.forEach(callbackObj => {
            callbackObj.onRejected(reason)
          })
        })
      }
    }

    try {
      excutor(resolve, reject) 
    } catch (error) {
      reject(error)
    }
  }

  then (onResolved, onRejected) {
    const that = this
    onResolved = typeof onResolved === "function" ? onResolved : value => value
    onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason } 
    return new Promise((resolve, reject) => {

      let handler = (cb) => {
        const result = cb(that.data)
        try {
          if (result instanceof Promise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }

      if (that.status === RESOLVED) {
        setTimeout(() => {
          handler(onResolved)
        })
      } else if (that.status === REJECTED) {
        setTimeout(() => {
          handler(onRejected)
        })
      } else {
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

  catch (onRejected) {
    return this.then(null, onRejected)
  }

  static resolve = function (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  static reject = function (reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  static all = function (values) {
    let resultArr = new Array(values.length)
    let orderIndex = 0
    return new Promise((resolve, reject) => {
      values.forEach((v, index) => {
        Promise.resolve(v).then(
          value => {
            orderIndex++
            resultArr[index] = value
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

  static race = function (promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(v => {
        Promise.resolve(v).then(
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
}