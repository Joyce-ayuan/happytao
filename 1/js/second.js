$(function () {
    var currentPage = 1;
    var pageSize = 5;

    render();

    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            dataType: "json",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (res) {
                htmlStr = template("secondTmp", res);
                $(".infoTb").html(htmlStr);

                // 分页
                $(".paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(res.total / res.size),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                });
            }
        });
    }

    // 点击添加分类 弹出模态框
    $(".btn-add").click(function () {   
        $("#addModal").modal("show");

        // 模态框添加分类下拉列表数据
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            dataType: "json",
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (res) {
                var htmlStr = template("dropdownTmp", res);
                $(".dropdown-menu").html(htmlStr);
            }
        });
    });

    // 点击下拉列表中的分类选项   将选中的分类添加到button按钮中
    $(".dropdown-menu").on("click", "a", function () {
        var txt = $(this).text();
        $(".choose").text(txt);
        var id = $(this).parent().data("id");
        categoryId = id;
        $("#categoryId").val(id);
        $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    // 上传图片
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            var picUrl = data.result.picAddr;
            $("#modalImg").attr("src", picUrl);
            $("#brandLogo").val(picUrl);
            $('#form').data("bootstrapValidator").updateStatus( "brandLogo", "VALID" );
        }
    });

    // 添加表单校验
    $("#form").bootstrapValidator({

        // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],
        //指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 指定校验字段
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入品牌名称"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "品牌logo不能为空"
                    }
                }
            }
        }
    })

    // 点击添加按钮 提交ajax  将数据提交给后台  更新数据库   再重新渲染页面
    $(".btn-add-category").click(function () {
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            dataType: "json",
            data: $("#form").serialize(),
            success: function (res) {
                currentPage = 1;
                render();
            }
        })
    })

});