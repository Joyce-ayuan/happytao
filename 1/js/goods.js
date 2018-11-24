$(function () {
    // 渲染数据
    var currentPage = 1;
    var pageSize = 3;
    var picArr = [];

    render();

    function render() {
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (res) {
                var htmlStr = template("goodsTmp", res);
                $("#infoTb").html(htmlStr);
                // 分页
                $("#paginator").bootstrapPaginator({
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

    // 点击添加按钮  显示模态框
    $(".btn-add").click(function () {
        $("#addModal").modal("show");
    });

    // 请选择二级分类下拉列表
    $(".btn-add").click(function () {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            dataType: "json",
            data: {
                page: 1,
                pageSize: 200
            },
            success: function (res) {
                console.log(res);
                var htmlStr = template("categoryTmp", res);
                $(".dropdown-menu").html(htmlStr);
            }
        });
    });

    // 给下拉列表注册事件(通过事件委托)
    $(".dropdown-menu").on("click", "a", function () {
        var txt = $(this).text();
        $(".categorychose").text(txt);
        var brandId = $(this).data("id");
        $("#brandId").val(brandId);

        // 当categorychose标签中有内容时，改变表单校验状态
        $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    });

    // 图片
    $("#fileupload").fileupload({
        dataType: "json",
        done: function (e, data) {
            var picObj = data.result;
            var picUrl = picObj.picAddr;
            $("#imgBox").prepend('<img src="' + picUrl + '" style="width:100px;">');
            // 往数组的最前面追加图片名称和路径
            picArr.unshift(picObj);
            console.log(picArr);
            // 图片只能为三张
            // 如果图片大于三张  则将最后一张删除
            if (picArr.length > 3) {
                console.log("图片大于三张");
                picArr.pop();
                $("#imgBox img:last-of-type").remove();
            }

            // 当传入的图片为3张时 修改校验状态
            if ( picArr.length === 3 ) {
                $('#form').data("bootstrapValidator").updateStatus("pic", "VALID");
              }
        }
    });

    // 配置表单校验
    $("#form").bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: "glyphicon glyphicon-ok",
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-refresh"
        },
        fields: {
            proName: {
                validators: {
                    notEmpty: {
                        message: "商品名称不能为空"
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "商品原价不能为空"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "商品现价不能为空"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "商品描述不能为空"
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "商品尺码不能为空"
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '必须是xx - xx的格式, xx是两位数字,例如: 36 - 44 '
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "商品库存不能为空"
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字'
                    }
                }
            },
            brandId: {
                validators: {
                    notEmpty: {
                        message: "品牌名称不能为空"
                    }
                }
            },
            pic: {
                validators: {
                    notEmpty: {
                        message: "请上传三张图片"
                    }
                }
            }
        }
    });

    // 添加商品渲染
    $('#form').on("success.form.bv", function( e ) {
        console.log($("#form").serialize());
        var formStr = $("#form").serialize();
        formStr += "&picName1" + picArr[0].picName + "&picAddr1" + picArr[0].picAddr;
        formStr += "&picName1" + picArr[1].picName + "&picAddr1" + picArr[1].picAddr;
        formStr += "&picName1" + picArr[2].picName + "&picAddr1" + picArr[2].picAddr;
        console.log(formStr);
        $.ajax({
            type: "post",
            url: "/product/addProduct",
            dataType: "json",
            data: formStr,
            success: function (res) {
                console.log(res);
                $("#addModal").modal('hide');
                currentPage = 1;
                render();
                $("#imgBox img").remove();
                picArr = [];
            }
        })
    })

});