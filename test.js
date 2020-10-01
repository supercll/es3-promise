// 在我的理解中，promise 本身并不是异步的，而是一个异步管理器，真正实现异步操作的是then方法其中的回调函数

// 本文件编写的是测试集

// 1. CPromise接收一个参数executor，参数里包含两个函数resolve与reject
let { CPromise } = require("./promise");

var p = new CPromise(function (resolve, reject) {
    // resolve(1);
    reject(2);
});

// console.log(p);

// 2. 实现resolve与reject的静态方法

/* console.log(CPromise.resolve(1));
console.log(CPromise.reject(2)); */

// 3.实现.then的基础功能

p.then(
    function (value) {
        console.log("ok", value);
    },
    function (reason) {
        console.log("no", reason);
    }
);
