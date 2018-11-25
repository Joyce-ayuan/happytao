$(function () {


    // 左侧数据渲染 
    $.ajax({
        type: "get",
        url: "/category/queryTopCategory",
        dataType: "json",
        success: function (res) {
            var htmlStr = template("leftTmp", res);
            $(".categoryName").html(htmlStr);
            renderById(res.rows[0].id)
        }
    })
    // 给左侧的a注册点击事件  通过事件委托  点击谁谁高亮显示
    $(".categoryName").on("click", "a", function () {
        $(".categoryName a").removeClass("current");
        $(this).addClass("current");
        var id = $(this).data('id');
        renderById(id);
    })

    function renderById(id) {
        $.ajax({
            type: "get",
            dataType: "json",
            data: {
                id: id
            },
            url: "/category/querySecondCategory",
            success: function (res) {
                var htmlStr = template("rightTmp", res);
                $(".details").html( htmlStr );
            }
        })
    }




})