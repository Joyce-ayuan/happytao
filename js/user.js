$(function () {
    // 动态渲染用户管理页面数据
    var currentPage = 1;
    var pageSize = 5;
    var currentId;
    var isDelete;

    render();

    function render() {
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (res) {
                var htmlStr = template("userTmp", res);
                $(".infoTb").html(htmlStr);

                // 分页
                $(".paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(res.total / pageSize),
                    onPageClicked: function (a, b, c, page) {  
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

    // 点击启用禁用按钮显示模态框
    // 由于数据是动态渲染的   所以要用到事件委托来注册点击事件
    $(".infoTb").on("click", ".btn", function () {  
        $("#btnModal").modal('show');
        currentId = $(this).parent().data("id");
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    })

    $(".btn-confirm").click(function () {  
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            dataType: "json",
            data: {
                id: currentId,
                isDelete: isDelete
            },
            success: function (res) {  
                if(res.success){
                    $("#btnModal").modal('hide');
                    render();
                }
            }
        })
    })
})