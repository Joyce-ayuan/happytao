// ajax判断登录状态, 进行登录拦截
$.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function (res) {  
        console.log(res);
        if(res.error == 400){
            location.href = "login.html";
        }
        if(res.success){
            console.log("该用户已经登录");
        }
    }
})