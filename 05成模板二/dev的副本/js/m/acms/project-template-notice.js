
// 公告配置
//是否启用公告
$('.g_notice_set .menu_c div').on('click', function(ev) {
        var target = ev.target;
        var $t = $(target);
        if ($t.hasClass('j_active')) {
            return;
        } else {
            $t.addClass('j_active')
            $t.siblings().removeClass('j_active')
            if ($t.hasClass('yes_c')) {
                $('.set_menu .menu_b').show();
            } else {
                $('.set_menu .menu_b').hide();
            }
        }
    })
    //打开编辑
$('.g_notice_set .menu_s').on('click', 'button', function(ev) {
        var target = ev.target;
        var $t = $(target);
        $('.g_notice_pop').removeClass('hide')
    })
    // 上传照片
$(".g_notice_pop .box_a").on('click', '.img_up', function(ev) {
        console.log('1')
        $('#j_img_up').trigger('click');
    })
    // 去除红字

 $('.link input').on('focus',function(){

    $('.link_e').hide()
 })
    // 顶置切换
    $('.g_notice_pop .menu_c div').on('click', function(ev) {
        var target = ev.target;
        var $t = $(target);
        if ($t.hasClass('j_active')) {
            return;
        } else {
            $t.addClass('j_active')
            $t.siblings().removeClass('j_active')
        }
    })
    // 确定取消
$(".j_yes").click(function(){
$('.g_notice_pop').addClass('hide')
})
$(".j_no").click(function(){
  $('.g_notice_pop').addClass('hide')
})