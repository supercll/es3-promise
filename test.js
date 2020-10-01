// 在我的理解中，promise 本身并不是异步的，而是一个异步管理器，真正实现异步操作的是then方法其中的回调函数

// 本文件编写的是测试集

// 1. CPromise接收一个参数executor，
let { CPromise } = require("./promise");

var p = new CPromise(function (resolve, reject) {
    resolve(1);
    reject(2);
});

console.log(p);


