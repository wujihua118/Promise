console.log('Promise study notes')
async function fn () {
  // return Promise.reject(1)
  // return 1
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('已成功')
    }, 1000)
  })
}
fn().then(
  value => {
    console.log('resolve', value)
  },
  reason => {
    console.log('reject', reason)
  }
)

function foo () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('success')
    }, 1000)
  })
}
function fn () {
  return Promise.reject('fail')
}
async function bar () {
  try {
    const val = await foo()
    // const val = await fn()
    console.log('val', val)
  } catch (error) {
    console.log(error)
  }
}
bar()
setTimeout(() => {
  console.log('settimeout cb1', 1)
  Promise.resolve(3).then(
    value => {
      console.log('resolve cb3', value)
    }
  )
})
setTimeout(() => {
  console.log('settimeout cb2', 2) 
})
Promise.resolve(1).then(
  value => {
    console.log('resolve cb1', value)
  }
)
Promise.resolve(2).then(
  value => {
    console.log('resolve cb2', value)
  }
)
setTimeout(() => {
  console.log(1)
}, 0)
new Promise((resolve) => {
  console.log(2)  // 同步执行
  resolve()
}).then(() => {
  console.log(3)
}).then(() => {
  console.log(4)
})
console.log(5)
// 同步执行 => 微任务 => 宏任务 2 5 3 4 1

const first = () => (new Promise((resolve, reject) => {
  console.log(3)
  let p = new Promise((resolve, reject) => {
    console.log(7)
    setTimeout(() => {
      console.log(5)
      resolve(6)
    }, 0)
    resolve(1)
  })
  resolve(2)
  p.then((arg) => {
    console.log(arg)
  })
}))
first().then((arg) => {
  console.log(arg)
})
console.log(4)
