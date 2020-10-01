function CPromise(executor) {
    // 参数校验
    if (!(executor instanceof Function)) {
        throw new TypeError("executor must be a function");
    }
    // 初始化状态
    this.promiseStatus = "pending";
    this.promiseValue = undefined;
    this.resolveFunc = Function.prototype;
    this.rejectFunc = Function.prototype;
    var _this = this;

    // 改变状态与value
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

    // 执行executor并做错误处理
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

module.exports = { CPromise };
