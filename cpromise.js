function CPromise(executor) {
    if (!(executor instanceof Function)) {
        throw new TypeError("executor must be a function");
    }
    this.promiseStatus = "pending";
    this.promiseValue = undefined;
    this.resolveFunc = Function.prototype;
    this.rejectFunc = Function.prototype;
    var _this = this;

    function change(status, value) {
        if (_this.promiseStatus !== "pending") return;
        _this.promiseStatus = status;
        _this.promiseValue = value;

        var timer = setTimeout(function () {
            clearTimeout(timer);
            timer = null;
            var promiseStatus = _this.promiseStatus;
            var promiseValue = _this.promiseValue;
            promiseStatus === "fulfilled"
                ? _this.resolveFunc(promiseValue)
                : _this.rejectFunc(promiseValue);
        });
    }

    try {
        executor(
            function (value) {
                change("fulfilled", value);
            },
            function (reason) {
                change("rejected", reason);
            }
        );
    } catch (e) {
        change("rejected", e.message);
    }
}

CPromise.resolve = function (value) {
    return new CPromise(function (resolve, reject) {
        resolve(value);
    });
};
CPromise.reject = function (reason) {
    return new CPromise(function (resolve, reject) {
        reject(reason);
    });
};

CPromise.prototype.then = function (resolveFunc, rejectFunc) {
    if (!(resolveFunc instanceof Function)) {
        resolveFunc = function (value) {
            return CPromise.resolve(value);
        };
    }
    if (!(rejectFunc instanceof Function)) {
        rejectFunc = function (reason) {
            return CPromise.reject(reason);
        };
    }

    var _this = this;

    return new CPromise(function (resolve, reject) {
        _this.resolveFunc = function (value) {
            try {
                var res = resolveFunc(value);
                res instanceof CPromise ? res.then(resolve, reject) : resolve(res);
            } catch (e) {
                reject(e.message);
            }
        };
        _this.rejectFunc = function (reason) {
            try {
                var res = rejectFunc(reason);
                res instanceof CPromise ? res.then(resolve, reject) : resolve(res);
            } catch (e) {
                reject(e.message);
            }
        };
    });
};

CPromise.prototype.catch = function (rejectFunc) {
    return this.then(null, rejectFunc);
};

CPromise.all = function (promiseArr) {
    var index = 0;
    var values = [];

    return new CPromise(function (resolve, reject) {
        for (var i = 0; i < promiseArr.length; i++) {
            (function (i) {
                var item = promiseArr[i];
                item instanceof CPromise ? null : (item = CPromise.resolve(item));
                item.then(function (value) {
                    index++;
                    values[i] = value;
                    if (index === promiseArr.length) {
                        resolve(values);
                    }
                }).catch(function (reason) {
                    reject(reason);
                });
            })(i);
        }
    });
};

(function (global) {
    // global=>window
    // factory=>回调函数  function (window, noGlobal) {...}
    "use strict"; // 严格模式

    if (typeof module === "object" && typeof module.exports === "object") {
        // 此条件成立说明当前运行代码的环境支持CommonJS规范
        // 浏览器端不支持，NODE端是是支持的
        module.exports = {
            CPromise,
        };
    } else {
        // 浏览器端运行
        global.CPromise = CPromise;
    }
})(typeof window !== "undefined" ? window : this);
