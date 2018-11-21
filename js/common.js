$(function () {

    // 进度条

    // ajax全局事件
    // 需求：
    //      1-在第一个ajax请求发送的时候  开启进度条
    //      2-在全部ajax请求完成的时候  关闭进度条

    $(document).ajaxStart(function () {
        NProgress.start();
    })
    $(document).ajaxStop(function () {  // 模拟网络延迟
        setTimeout(function () {
            NProgress.done();
        }, 500)
    })

});