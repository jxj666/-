/**
 * @file 注入iframe
 */
var iframe_Obj = {
    timer: null,
    hover: function () {
        var that = this;
        $('.iframe-img_src,.iframe-img_bg,.iframe-bc_editable').hover(function () {
            clearTimeout(that.timer);
            $(this).prev().show();
        }, function () {
            var $this = $(this);
            that.timer = setTimeout(function () {
                $this.prev().hide();
            }, 100);
        });
    },
    init: function () {
        // 图片
        $('.iframe-img_src').each(function () {
            var btn = $('<div class="iframe-edit_img"><span class="iframe-edit_btn">编辑</span></div>');
            $(this).before(btn);
        });
        // 背景图片
        $('.iframe-img_bg').each(function () {
            var btn = $('<div class="iframe-edit_bgimg"><span class="iframe-edit_btn">编辑</span></div>');
            $(this).before(btn);
        });
        // 大喇叭
        $('.iframe-bc_editable').each(function () {
            var btn = $('<div class="iframe-edit_bc"><span class="iframe-edit_btn">编辑</span></div>');
            $(this).before(btn);
        });
        this.hover();
    }
};

$(function () {
    iframe_Obj.init();
});
