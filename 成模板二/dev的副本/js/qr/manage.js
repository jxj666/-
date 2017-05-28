/**
* @file 批次管理备份
*/
function arrRemoveDuplicate(arr) {
    arr = arr || [];
    var obj = {};
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            obj[arr[i]] = true;
        }
    }
    for (var key in obj) {
        newArr.push(key);
    }
    return newArr;
}
$(function () {

    var $keyword = $('#keyword');
    var $productSn = $('#productSel');

    function getList(page, keyword, orderBy, size, productSn) {
        $('.table-loader.hide').removeClass('hide');
        Pace.restart();

        productSn = productSn || $productSn.val();
        $.ajax({
            url: '/qrmgr/list',
            type: 'GET',
            data: {
                page: page,
                size: size ? size : 10,
                order_by: orderBy ? orderBy : '',
                keyword: keyword ? keyword : '',
                product_sn: productSn
            },
            success: function (data) {
                if (data.code === 1) {
                    $('html,body').animate({scrollTop: 0}, 150);

                    $('tbody').html(tmpl('template_list', data.context));
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
                            var orderBy = $('[data-sort].active').data('sort');
                            var datatableLength = $('#data-table_length select').val();
                            getList(i, $.trim($keyword.val()), orderBy, datatableLength);
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

    // 一进页面加载列表
    getList(1);
    // 点击排序加载列表
    $('[data-sort]').click(function () {
        if (!$(this).hasClass('active')) {
            var datatableLength = $('#data-table_length select').val();
            getList(1, $.trim($keyword.val()), $(this).data('sort'), datatableLength);
            $('[data-sort].active').removeClass('active');
            $(this).addClass('active');
        }
    });
    // 产品筛选
    $productSn.on('change', function () {
        var orderBy = $('[data-sort].active').data('sort');
        var datatableLength = $('#data-table_length select').val();
        getList(1, $.trim($keyword.val()), orderBy, datatableLength);
    })
    // 选择n项结果加载列表
    $('#data-table_length select').change(function () {
        var orderBy = $('[data-sort].active').data('sort');
        var datatableLength = $('#data-table_length select').val();
        getList(1, $.trim($keyword.val()), orderBy, datatableLength);
    });
    // 关键字搜索加载列表
    $('[data-tz="search"]').click(function () {
        var orderBy = $('[data-sort].active').data('sort');
        var datatableLength = $('#data-table_length select').val();
        getList(1, $.trim($keyword.val()), orderBy, datatableLength);
        $('[data-dismiss="modal"]').trigger('click');
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
    // 新建
    $('#form').parsley().on('form:submit', function () {
        var $memo = $('#memo');
        var $productSn = $('#productSn');
        var $globalUrl = $('#globalUrl');
        var $size = $('#size');
        var $withVerify = $('#withVerify');
        // var $extInfo = $('#extInfo');
        var params = {};
        params.memo = $.trim($memo.val());
        params.productSn = $.trim($productSn.val());
        // params.extInfo = $.trim($extInfo.val()); // 扩展信息
        params.globalUrl = $.trim($globalUrl.val());
        params.withVerify = $.trim($withVerify.val());
        params.size = $.trim($size.val());

        $.ajax({
            url: '/qrmgr/add',
            type: 'POST',
            data: params,
            success: function (data) {
                if (data.code === 1) {
                    var orderBy = $('[data-sort].active').data('sort');
                    var datatableLength = $('#data-table_length select').val();
                    getList(1, $.trim($keyword.val()), orderBy, datatableLength);
                    $('#form').parsley().reset();
                    $('#form')[0].reset();
                    $('[data-dismiss="modal"]').trigger('click');
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
        return false;
    });
    // 修改
    $('tbody').on('click', '[data-tz="update"]', function () {
        var $batchNo = $('#batchNoEdit');
        var $memo = $('#memoEdit');
        var $productSn = $('#productSnEdit');
        var $globalUrl = $('#globalUrlPatternEdit');
        var $size = $('#sizeEdit');
        var $withVerifyCode = $('#withVerifyEdit');
        // var $extInfo = $('#extInfoEdit');
        var status = $(this).data('status');
        if (status > 1) {
            $batchNo.prop('disabled', true);
            $memo.prop('disabled', true);
            $productSn.prop('disabled', true);
            $size.prop('disabled', true);
            $withVerifyCode.prop('disabled', true);
            // $extInfo.prop('disabled', true);
        }
        else {
            $batchNo.prop('disabled', false);
            $memo.prop('disabled', false);
            $productSn.prop('disabled', false);
            $size.prop('disabled', false);
            $withVerifyCode.prop('disabled', false);
            // $extInfo.prop('disabled', false);
        }
        var $tr = $(this).parents('tr');
        $batchNo.val($tr.find('[data-info="batchNo"]').html());
        $memo.val($tr.find('[data-info="memo"]').html());
        $productSn.val($tr.find('[data-info="productName"]').data('val'));
        $globalUrl.val($tr.find('[data-info="globalUrl"]').html());
        $size.val($tr.find('[data-info="size"]').html());
        $withVerifyCode.val($tr.find('[data-info="withVerifyCode"]').data('val'));
        // $extInfo.val($tr.find('[data-info="extInfo"]').val());
        $('.selectpicker').selectpicker('refresh');
        // 提交修改
        $('#modal-update').on('hidden.bs.modal', function () {
            $(this).parsley().reset();
            $(this)[0].reset();
        })
            .parsley().on('form:submit', function () {
            var params = {};
            params.memo = $.trim($memo.val());
            params.productSn = $.trim($productSn.val());
            // params.extInfo = $.trim($extInfo.val()); // 扩展信息
            params.globalUrl = $.trim($globalUrl.val());
            params.withVerify = $.trim($withVerifyCode.val());
            params.size = $.trim($size.val());
            params.batchNo = $.trim($batchNo.val());
            $.ajax({
                url: '/qrmgr/update',
                type: 'POST',
                data: params,
                success: function (data) {
                    if (data.code === 1) {
                        var page = $('.pagination li.active a').data('page');
                        var orderBy = $('[data-sort].active').data('sort');
                        var datatableLength = $('#data-table_length select').val();
                        getList(page, $.trim($keyword.val()), orderBy, datatableLength);
                        $('[data-dismiss="modal"]').trigger('click');
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
            return false;
        });
    });
// 获取进度信息
    $('#modal-progress').on('hidden.bs.modal', function () {
        var page = $('.pagination li.active a').data('page');
        var orderBy = $('[data-sort].active').data('sort');
        var datatableLength = $('#data-table_length select').val();
        getList(page, $.trim($keyword.val()), orderBy, datatableLength);
    });
    var mStatus = -1;

    function getProgress(batchNo) {
        $.ajax({
            url: '/qrmgr/progress',
            type: 'GET',
            data: {
                batchNo: batchNo
            },
            success: function (data) {
                if (data.code === 1) {
                    $('#modal-progress .progress-menu').html(tmpl('template_progress', data.context));
                    mStatus = data.context.mStatus - 0;
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
    }

    $('tbody').on('click', '[data-tz="progress"]', function () {
        getProgress($(this).data('batchno'));
    });

    // 成码
    $(document).on('click', '[data-tz="generate"]', function () {
        var batchNo = $(this).data('batchno');
        $.ajax({
            url: '/qrmgr/generate/' + batchNo,
            type: 'POST',
            success: function (data) {
                if (data.code === 1) {
                    getProgress(batchNo);
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
    // 导出
    $(document).on('click', '[data-tz="generateimg"]', function () {
        var batchNo = $(this).data('batchno');
        $.ajax({
            url: '/qrmgr/generateimg/' + batchNo,
            type: 'POST',
            success: function (data) {
                if (data.code === 1) {
                    getProgress(batchNo);
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
    // 设置状态
    $(document).on('click', '[data-tz="setstatus"]', function () {
        var confirm = window.confirm('确定要将此批次二位码' + $(this).text());
        if (confirm) {
            var batchNo = $(this).data('batchno');
            $.ajax({
                url: '/qrmgr/setstatus/' + batchNo + '/' + (mStatus + 1),
                type: 'POST',
                success: function (data) {
                    if (data.code === 1) {
                        getProgress(batchNo);
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
        }
    });
    // 下载
    $('tbody').on('click', '[data-tz="downLoad"]', function () {
        /*  var otherWindow = window.open();
         otherWindow.opener = null;
         otherWindow.location = '/qrmgr/download?batchNo=' + $(this).data('batchno');*/
        window.location.href = '/qrmgr/download?batchNo=' + $(this).data('batchno');
    });

    // 批量作废
    var scanCode = {
        data: [],
        render: function () {
            $('#codeMenu').html(tmpl('template_codeList', {data: this.data}));
        },
        del: function (i) {
            this.data.splice(i, 1);
        },
        init: function () {
            var me = this;
            $('#scan-code').change(function () {
                var code = $(this).val();
                if (me.data.length > 200) {
                    alert('最多输入200个二维码ID');
                    return;
                }
                me.data.push({code: code, date: moment().format('l')});
                me.render();
                $(this).val('').focus();
            });
            $(document).on('click', '.operate', function () {
                var i = $(this).data('i');
                me.del(i);
                me.render();
            });
        }
    };
    scanCode.init();
    $('#scan-code-tab').on('hidden.bs.modal', function () {
        scanCode.data.length = 0;
        scanCode.render();
    }).on('shown.bs.modal', function () {
        $('#scan-code').val('').focus();
    });
    $('[data-tz="destoryCode"]').click(function () {
        var len = scanCode.data.length;
        if (len <= 0) {
            alert('还没有输入二维码！');
            return;
        }
        var newArr = [];
        for (var i = 0; i < len; i++) {
            newArr.push(scanCode.data[i].code);
        }
        var codeArr = arrRemoveDuplicate(newArr);
        $.ajax({
            url: '/qrmgr/scanCode',
            type: 'POST',
            data: {
                code: codeArr
            },
            // traditional: true,
            dataType: 'json',
            success: function (data) {
                if (data.code === 1) {
                    if ($.isEmptyObject(data.context)) {
                        alert('批量作废成功');
                    }
                    else {
                        for (var key in data.context) {
                            if (data.context.hasOwnProperty(key)) {
                                $.gritter.add({
                                    title: data.context[key],
                                    text: key
                                });
                            }
                        }
                    }
                    scanCode.data.length = 0;
                    scanCode.render();

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
});
