$(function () {

    var currentPage = 1;
    var pageSize = 5;
    // 将数据渲染到页面上
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            dataType: "json",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (res) {
                var htmlStr = template("firstTmp", res);
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

    // 点击添加分类按钮显示模态框
    $(".btn-add").click(function () {  
        $("#addModal").modal('show');
    })

    // 表单校验功能
    $("#form").bootstrapValidator({
        // 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },

        // 指定校验字段
        fields: {
            categoryName:{
                validators:{
                    notEmpty: {
                        message: "分类名不能为空"
                    }
                }
            }
        }
    })

    // 点击添加按钮 发送ajax请求更新数据库中的数据 再将数据重新渲染到页面中
    $("#form").on('success.form.bv', function (e) {  
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/category/addTopCategory",
            dataType: "json",
            data: $("#form").serialize(),
            success: function (res) {  
                if(res.success){
                    $("#addModal").modal('hide');
                    currentPage = 1;
                    render();
                }
            }
        })
    })

})