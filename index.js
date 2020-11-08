/**
 * 1、函数对象与实例对象
 * 1.1 函数对象：
 *   将函数作为独享使用时，简称为函数对象
 * 1.2 实例对象：
 *   new 函数产生的对象，简称为对象
 */

 function Fn() {}  // Fn 函数
 const fn = new Fn()  // Fn 是构造函数，fn 是实例对象（简称为对象）
 console.log(Fn.prototype)  // Fn 是函数对象
 Fn.call({})  // Fn 是函数对象
 $('#app')  // jQuery 函数
 $.get('/test') // jQuery 函数对象

 /**
  * 2、两种类型的回调函数
  * 2.1 同步回调
  *   立即执行，完全执行完了才结束，不会放入回调队列中
  *   例如：数组遍历相关的回调函数 / Promise 的 executor 函数
  * 2.2 异步回调
  *   不会立即执行，会放入回调队列中将来执行
  * 例如：定时器回调 / ajax 回调 / Promise 的成功、失败的回调
  */

  // 同步回调
  const arr = [1, 3, 5];
  arr.forEach(item => {
    console.log(item);
  })
  console.log('forEach之后');

  // 异步回调
  setTimeout(() => {
    console.log('timeout callback');
  }, 0)
  console.log('setTimeout之后');