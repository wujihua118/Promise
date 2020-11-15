// console.log('Promise study notes')
// async function fn () {
//   // return Promise.reject(1)
//   // return 1
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('已成功')
//     }, 1000)
//   })
// }
// fn().then(
//   value => {
//     console.log('resolve', value)
//   },
//   reason => {
//     console.log('reject', reason)
//   }
// )

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