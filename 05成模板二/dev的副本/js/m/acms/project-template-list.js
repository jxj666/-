/**
 * @file 模板管理
 */
$('[data-cj=tab]').click(function (e) {
    e.preventDefault();
    if(!$(this).hasClass('active')){
        $(this).closest('.nav').find('[data-cj=tab]').removeClass('active');
        $(this).addClass('active');
        var target = $(this).attr('href') || $(this).data('target');
        $(target).closest('.tab-content').find('.tab-pane').removeClass('active in');
        $(target).addClass('active in');
    }
});
