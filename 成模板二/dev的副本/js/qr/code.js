$(function () {
    var $bathNo = $('#batchNo');
    var $keyword = $('#keyword');

    function getList(page, keyword, orderBy, size, batchNo) {
        keyword = keyword || $.trim($keyword.val());
        if (keyword.length <= 0) {
            alert('请输入code');
            return;
        }
        batchNo = batchNo || $bathNo.val();
        page = page || 1;
        size = size || $('#data-table_length select').val();
        orderBy = orderBy || $('[data-sort].active').data('sort');
        $('tbody').closest('.panel').removeClass('hidden');
        $('.table-loader.hide').removeClass('hide');
        $.ajax({
            url: '/qr_code/list',
            type: 'GET',
            data: {
                page: page,
                size: size,
                order_by: orderBy,
                keyword: keyword,
                batchNo: batchNo
            },
            success: function (data) {
                if (data.code === 1) {
                    $('tbody').html(tmpl('template_list', data.context));
                    // 翻页
                    data.context.page = page;$('[data-info=page]').text(page);
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
                $('.table-loader').addClass('hide');
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

    if ($bathNo.val() === '-1') {
        window.sessionStorage.removeItem('batch');
        return;
    }
    window.sessionStorage.getItem('batch') && $bathNo.val(window.sessionStorage.getItem('batch'))

    // 一进页面加载列表// getList(1);
    // 点击排序加载列表
    $('[data-sort]').click(function () {
        if (!$(this).hasClass('active')) {
            $('[data-sort].active').removeClass('active');
            $(this).addClass('active');
            getList(1);
        }
    });
    // 选择n项结果加载列表
    $('#data-table_length select').change(function () {
        getList(1);
    });
    // 关键字搜索加载列表
    $('[data-tz="search"]').click(function () {
        getList(1);
    });
    $('#keyword').on('keyup', function (e) {
        if (e.keyCode === 13) {
            $('[data-tz="search"]').trigger('click');
        }
        if ($(this).val().length > 0) {
            $(this).next('.search-clear-btn').removeClass('hide');
        }
        else {
            $(this).next('.search-clear-btn').addClass('hide')
        }
    });
    $('.search-clear-btn').click(function () {
        $(this).addClass('hide').prev('[type=search]').val('');
        $('[data-tz="search"]').trigger('click');
    });
    // btnchNo改变时加载
    $('#batchNo').change(function () {
        $keyword.val('');
        // getList(1);
        $('tbody').html('');
        window.sessionStorage.setItem('batch', $bathNo.val());
    });
});
