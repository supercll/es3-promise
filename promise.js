function CPromise(executor) {
    // 参数校验
    if (!(executor instanceof Function)) {
        throw new TypeError("executor must be a function");
    }
    // 初始化状态
    this.promiseStatus = "pending";
    this.promiseValue = undefined;
    var _this = this;

    // 改变状态与value
    function change(status, value) {
        if (_this.promiseStatus !== "pending") return;
        _this.status = status;
        _this.value = value;
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

module.exports = { CPromise };