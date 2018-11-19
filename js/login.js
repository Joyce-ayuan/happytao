$(function () {

  /* 需求: 表单校验 */
  /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */

  $('#form').bootstrapValidator({
    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    //设置校验规则
    fields: {

      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空"
          },
          stringLength: {
            min: 2,
            max: 6,
            message: "长度为2-6位"
          }
        }
      },

      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "长度为6-12位"
          }
        }
      }
    }
  })




  /*
   * 2. 注册表单校验成功事件, 在事件中阻止默认成功的表单提交,
   *    通过 ajax 进行提交
   * */
  $("#form").on('success.form.bv', function (e) {
    // 阻止默认的表单提交
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (res) {
        if(res.error == 1000){
          alert(res.message);
        }
        if(res.error == 1001){
          alert(res.message);
        }
        if(res.success){
          location.href = "index.html";
        }
      }
    })
  });

  /*
  * 3. 重置功能 (本身reset按钮就可以重置内容, 需要调用表单校验插件的方法, 重置校验状态)
  * */

  $('[type="reset"').click(function () {  
    $(form).data('bootstrapValidator').resetForm();
  })


})