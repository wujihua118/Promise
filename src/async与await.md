#### async 函数
- 函数的返回值为`promise`对象
- `promise`对象的结果由`async`函数执行的返回值决定

```javascript
async function fn () {
  // return '成功'
  // throw '失败'
  // return Promise.reject('已拒绝')

}
fn().then(
  value => {
    console.log('resolve', value)
  },
  reason => {
    console.log('reject', reason)
  }
)
```

#### await 表达式
`await`右侧的表达式一般为`promise`对象，但也可以是其他的值
- 如果表达式为`promise`对象，`await`返回的是`promise`成功的值
- 如果表达式是其他的值，直接将此值作为`await`的返回值

```javascript
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
```

> 注意：
> 
> `await`必须写在`async`函数中，但`async`函数中可以没有`await`
> 
> 如果`await`的`promise`失败了，就会抛出异常，需要通过`try...catch`来捕获处理