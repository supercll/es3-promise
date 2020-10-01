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

/* p.then(
    function (value) {
        console.log("ok", value);
    },
    function (reason) {
        console.log("no", reason);
    }
); */

// 4.实现.then的链式调用
/* 
p.then(
    function (value) {
        console.log("ok", value);
        return new CPromise.resolve(3);
    },
    function (reason) {
        console.log("no", reason);
    }
).then(
    function (value) {
        console.log("ok2", value);
    },
    function (reason) {
        console.log("no2", reason);
    }
);
 */

// 5.实现.then不传参数时的容错处理，将无法处理的promise实例顺延到下一个then中处理
/* 
p.then(null, null).then(
    function (value) {
        console.log("ok2", value);
    },
    function (reason) {
        console.log("no2", reason);
    }
);
 */

// 6. 实现.catch方法，其实catch方法就是：不传第一个参数的.then方法
/* 
p.catch(function (reason) {
    console.log("catch-no", reason);
});
 */

// 7.实现.all静态方法

var fn1 = function () {
    return CPromise.resolve(1);
};

var fn2 = function () {
    return new CPromise(function (resolve, reject) {
        setTimeout(function () {
            reject(2);
        }, 1000);
    });
};
var fn3 = function () {
    return new CPromise(function (resolve, reject) {
        setTimeout(function () {
            resolve(3);
        }, 2000);
    });
};

CPromise.all([fn1(), fn2(), fn3()])
    .then(function (value) {
        console.log("ok", value);
    })
    .catch(function (reason) {
        console.log("no", reason);
    });
