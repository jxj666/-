/**
 * @file 用户管理
 */
$(function () {
    var appid = $('#getAppId').val();
    if (appid === '-1') {
        return;
    }


    function getList(page, orderBy, orderByType, size, appid, activityId) {
        $('.panel-body-loader.hide').removeClass('hide');
        Pace.restart();
        page = page || 1;
        size = size || $('#data-table_length select').val();
        appid = appid || $('#getAppId').val();
        orderBy = orderBy || $('[data-sort].active').data('sort');
        activityId = activityId || $('#activitySel').val();
        if (!orderByType) {
            orderByType =  $('[data-sort].active').attr('data-orderbytype') === 'desc' ? 'asc' : 'desc';
        }
        var findLike = $.trim($('#keyword').val());
        var url = (findLike == null || findLike.length === 0) ? '/user/list/' + page : '/user/find/' + findLike + '/' + page;
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                pageSize: size,
                appid: appid,
                orderBy: orderBy,
                orderByType: orderByType,
                activityId: activityId
            },
            success: function (data) {
                if (data.code === 1) {
                    $('tbody').html(tmpl('template_list', data.context));
                    // 翻页
                    $('html,body').animate({scrollTop: 0}, 150);
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
                            getList(i);
                        }
                    });
                }
                else {
                    alert(data.msg);
                }
                $('.panel-body-loader').addClass('hide');
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

    // 一进页面加载列表
    getList();
    // 点击排序加载列表
    $('[data-sort]').click(function () {
        $('[data-sort].active').removeClass('active');
        $(this).addClass('active');
        getList(1, $(this).data('sort'), $(this).attr('data-orderbytype'));
        var type;
        if ($(this).attr('data-orderbytype') === 'asc') {
            type = 'desc';
            $(this).find('i.fa').attr('class', '').addClass('fa fa-arrow-down m-l-5');
        }
        else {
            type = 'asc';
            $(this).find('i.fa').attr('class', '').addClass('fa fa-arrow-up m-l-5');
        }
        $(this).attr('data-orderbytype', type);
    });
    function clearSort() {
        $('[data-orderbytype]').attr('data-orderbytype', 'asc').removeClass('active').find('i.fa').attr('class', '').addClass('fa fa-sort m-l-5');
    }

    // 选择n项结果加载列表
    $('#data-table_length select').change(function () {
        getList();
        clearSort();
    });
    // 关键字搜索加载列表
    $('[data-tz="search"]').click(function () {
        getList();
        clearSort();
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
    // 公众号筛选
    $('#getAppId').change(function () {
        getList();
        clearSort();
    });
    // 活动筛选
    $('#activitySel').change(function () {
        getList();
        clearSort();
    });
});
