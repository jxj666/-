/**
 * @file 活动管理
 */
function loadData(page, keyword, pageSize, productId, status, time_begin, time_end) {
    page = page || 1;
    products = productId || $('#productId').val();
    size = pageSize || 20;
    keyword = keyword || $.trim($('#keyword').val());
    status = status || '';
    time_begin = time_begin || '';
    time_end = time_end || '';
    var data = {};

    data.page = page;
    products && (data.products = products);
    data.size = size;
    keyword && (data.keyword = keyword);
    status && (data.status = status);
    time_begin && (data.time_begin = time_begin);
    time_end && (data.time_end = time_end);

    $('.result-loader.hide').removeClass('hide');
    Pace.restart();

    $.ajax({
        url: '/acms/act/list',
        type: 'POST',
        data: data,
        success: function (data) {
            if (data.code === 1) {
                $('html,body').animate({scrollTop: 0}, 150);

                $('#resultList').html(tmpl('template_list', data.context));

                // 翻页
                data.context.page = page;
                $('[data-info=page]').text(page);
                $('.pagination').html(tmpl('template_page', data.context));
                $('[data-info="totalPage"]').html(data.context.totalPage);
                $('[data-page="' + page + '"]').parent().addClass('active');

                if (page > 1) {
                    $('#data-table_previous').removeClass('disabled')
                        .find('a').attr('data-page', page - 1);
                }
                if (data.context.totalPage > 1 && page < data.context.totalPage) {
                    $('#data-table_next').removeClass('disabled')
                        .find('a').attr('data-page', page - 0 + 1);
                }
                $('[data-tz="page"]').on('click', function () {
                    if (!$(this).parent().hasClass('active') && !$(this).parent().hasClass('disabled')) {
                        var i = $(this).data('page');
                        loadData(i);
                    }
                });

                $('[data-tz="skipEdit"]').on('click', function () {
                    location.href = '#/acms/act/edit?activityId=' + $(this).data('actid');
                });
                $('[data-tz="skipChart"]').on('click', function () {
                    hash2active('#/weiop/activity/stat');
                    location.href = '#/weiop/activity/stat?activityId=' + $(this).data('actid');
                });
                $('[data-tz="skipOrder"]').on('click', function () {
                    hash2active('#/weiop/order/toList');
                    location.href = '#/weiop/order/toList?activityId=' + $(this).data('actid');
                });
                $('[data-tz="_blank"]').on('click', function () {
                    var otherWindow = window.open();
                    otherWindow.opener = null;
                    otherWindow.location = $(this).data('url');
                });
                $('[data-tz="publish"]').on('click', function () {
                    $.ajax({
                        url: '/weiop/activity/publish',
                        type: 'POST',
                        data: {
                            activityId: $(this).data('actid')
                        },
                        success: function (data) {
                            if (data.code === 1) {
                                $.gritter.add({
                                    title: '发布成功',
                                    text: '已发布'
                                });
                                loadData(page);
                            }
                            else {
                                alert(data.msg);
                            }

                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            if (XMLHttpRequest.status === 0) {
                                alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
                                location.reload();
                                return;
                            }
                            alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
                        }
                    });
                });
            }
            else {
                alert(data.msg);
            }
            $('.result-loader').addClass('hide');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 0) {
                alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
                location.reload();
                return;
            }
            alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
        }
    });
}
function hash2active(href) {
    var $this = $('.sidebar [data-toggle=ajax][href="'+href+'"]');
    var targetLi = $this.closest('li');
    var targetParentLi = $this.parents();
    $('.sidebar li').not(targetLi).not(targetParentLi).removeClass('active');
    $(targetLi).addClass('active');
    $(targetParentLi).addClass('active');
}
$(function () {
    $keyword = $('#keyword');

    // 初始加载数据
    loadData(1);
    $('#productId').change(function () {
        clearKeyword();
        loadData(1);
    });

    // 关键字搜索加载列表

    $('[data-tz="search"]').click(function () {
        loadData(1, $keyword.val());
    });
    $('#keyword').on('keyup', function (e) {
        if (e.keyCode === 13) {
            $('[data-tz="search"]').trigger('click');
        }
        if ($(this).val().length > 0) {
            $(this).next('.search-clear-btn').removeClass('hide');
        }
        else {
            $(this).next('.search-clear-btn').addClass('hide');
        }
    });
    $('.search-clear-btn').click(function () {
        $(this).addClass('hide').prev('[type=search]').val('');
        $('[data-tz="search"]').trigger('click');
    });

    function clearKeyword() { //  清空搜索栏
        $keyword.val('');
        $('.search-clear-btn').addClass('hide');
    }
});
