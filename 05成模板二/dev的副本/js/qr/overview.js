/**
 * @file 批次概览
 */
var num2CN = {
    // 单个数字转换用数组实现，
    chnNumChar: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    // 节权位同样用数组实现，
    chnUnitSection: ['', '万', '亿', '万亿', '亿亿'],
    // 节内权位同样用数组实现，
    chnUnitChar: ['', '十', '百', '千'],
    // 节内转换算法
    sectionToChinese: function (section) {
        var strIns = '';
        var chnStr = '';
        var unitPos = 0;
        var zero = true;
        while (section > 0) {
            var v = section % 10;
            if (v === 0) {
                if (!zero) {
                    zero = true;
                    chnStr = this.chnNumChar[v] + chnStr;
                }
            }
            else {
                zero = false;
                strIns = this.chnNumChar[v];
                strIns += this.chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    },
    // 转换算法主函数
    main: function (num) {
        num -= 0;
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(num)) {
            return '不是正确数字';
        }
        var unitPos = 0;
        var strIns = '';
        var chnStr = '';
        var needZero = false;

        if (num === 0) {
            return this.chnNumChar[0];
        }

        while (num > 0) {
            var section = num % 10000;
            if (needZero) {
                chnStr = this.chnNumChar[0] + chnStr;
            }
            strIns = this.sectionToChinese(section);
            strIns += (section !== 0) ? this.chnUnitSection[unitPos] : this.chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }
        return chnStr;
    }
};


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

    function getList(page, keyword, orderBy, size, productSn) {
        $('.table-loader.hide').removeClass('hide');
        Pace.restart();

        // productSn = productSn || $productSn.val();
        productSn = productSn || 'all';
        $.ajax({
            url: '/qrmgr/list',
            type: 'GET',
            data: {
                page: page,
                size: size ? size : 10,
                order_by: orderBy ? orderBy : '',
                // keyword: keyword ? keyword : '',
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
            $(this).next('.search-clear-btn').addClass('hide');
        }
    });
    $('.search-clear-btn').click(function () {
        $(this).addClass('hide').prev('[type=search]').val('');
        $('[data-tz="search"]').trigger('click');
    });
    // 产品联动
    $('[data-tz=linkage]').change(function () {
        var target = $(this).data('target');
        $(this).prop('checked') ? $(target).prop('disabled', true)
            : $(target).prop('disabled', false);
        $('.selectpicker').selectpicker('refresh');
    });
    // 产码量数字转中文
    $('#size').on('keyup change', function () {
        $(this).closest('.form-group').find('[data-info=num2CN]').text(num2CN.main($(this).val()));
    });
    // 新建
    $('#modal-create').parsley().on('form:submit', function () {
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
    // 批次管理
    $('#modal-query').on({
        'show.bs.modal': function (e) {
            var check = $(e.relatedTarget).data('tz');
            if (check === 'check') { // 点击的是查看按钮
                $('#batchQuery').val($(e.relatedTarget).data('batch'));
                $(this).find('[data-info=domain]').html($(e.relatedTarget).data('orgid'));
                $(this).find('[data-info=product]').html($(e.relatedTarget).data('product'));
                $(this).find('[data-info=size]').html($(e.relatedTarget).data('size'));
                $(this).find('[data-info=memo]').html($(e.relatedTarget).data('memo'));
            }
        },
        'hidden.bs.modal': function () {
            $('#batchQuery').val('');
            $(this).find('[data-info=domain]').html('');
            $(this).find('[data-info=product]').html('');
            $(this).find('[data-info=size]').html('');
            $(this).find('[data-info=memo]').html('');
            $(this).find('.modal-footer button').show();
            $(this).find('.modal-footer [data-info=statusList]').addClass('hide');
        }
    });
    // 作废批次
    $('[data-tz=destoryBatch]').click(function () {
        var batchNo = $.trim($('#batchQuery').val());
        if (batchNo.length <= 0) {
            alert('请输入批次号');
            $('#batchQuery').focus();
            return;
        }
        var data = {code: 1, context: {status: '作废', date: moment().format('l'), user: 'admin'}, msg: 'success'};
        if (data.code === 1) {
            var $footer = $(this).hide().closest('.modal-footer');
            $footer.find('[data-info="statusList"]').removeClass('hide');

            $footer.find('[data-info="batchStatus"]').html(data.context.status);
            $footer.find('[data-info="date"]').html(data.context.date);
            $footer.find('[data-info="user"]').html(data.context.user);
        }
        else {
            alert(data.msg);
        }
    });
    // 批次搜索
    $('[data-tz=batchSearch]').click(function () {
        var batchNo = $.trim($('#batchQuery').val());
        if (batchNo.length <= 0) {
            alert('请输入批次号');
            $('#batchQuery').focus();
            return;
        }
        var data = {
            code: 1,
            context: {
                "batchNo": "20170331123",
                "memo": "宝哥是个好人",
                "orgId": "taozuitianxia",
                "createTime": "2017-01-10 23:24:42",
                "updateTime": null,
                "status": 1,
                "size": 100,
                "extInfo": null,
                "productSN": "tianzipinjian21",
                "productName": "天子（壹号）品鉴礼盒装",
                "image": "http://7xuq6b.com1.z0.glb.clouddn.com/tianziolympic2/resources/images/p_cigarette.jpg",
                "url": null
            },
            msg: 'success'
        };
        if (data.code === 1) {
            // $('#batchQuery').val(data.context.batchNo);
            $('#modal-query').find('[data-info=domain]').html(data.context.orgId);
            $('#modal-query').find('[data-info=product]').html(data.context.productName);
            $('#modal-query').find('[data-info=size]').html(data.context.size);
            $('#modal-query').find('[data-info=memo]').html(data.context.memo);
        }
        else {
            alert(data.msg);
        }

    });
    // 单码搜索
    var $modalCode = $('#modal-code');
    $modalCode.on('hidden.bs.modal', function () {
        $('#keyword').val('');
        $modalCode.find('[data-info=domain]').html('');
        $modalCode.find('[data-info=product]').html('');
        $modalCode.find('[data-info=code]').html('');
        $modalCode.find('[data-info=status]').html('');
        $modalCode.find('.modal-footer button').show();
        $modalCode.find('.modal-footer [data-info=statusList]').addClass('hide');
    });
    $('[data-tz=search]').click(function () {
        var batchNo = $.trim($('#keyword').val());
        if (batchNo.length <= 0) {
            alert('请输入单码');
            $('#keyword').focus();
            return;
        }
        /*$.ajax({
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
         });*/
        var data = {
            code: 1,
            context: {
                "code": '1001',
                "batch": "20170331123",
                "orgId": "taozuitianxia",
                "createTime": "2017-01-10 23:24:42",
                "status": 0,
                "productSN": "tianzipinjian21",
                "productName": "天子（壹号）品鉴礼盒装",
            },
            msg: 'success'
        };
        if (data.code === 1) {
            $modalCode.modal('show');
            $modalCode.find('[data-info=domain]').html(data.context.orgId);
            $modalCode.find('[data-info=product]').html(data.context.productName);
            $modalCode.find('[data-info=code]').html(data.context.code);
            var status = '';
            if (data.context.status == 0) {
                status = '未扫码';
            }
            else if (data.context.status == 1) {
                status = '已扫码';
            }
            else if (data.context.status == 2) {
                status = '已验码';
            }
            else if (data.context.status == -2) {
                status = '已作废';
            }
            $modalCode.find('[data-info=status]').html(status);
        }
        else {
            alert(data.msg);
        }
    });
    // 作废单码
    $('[data-tz=destoryCode]').click(function () {
        var batchNo = $.trim($('#keyword').val());
        if (batchNo.length <= 0) {
            alert('请输入单码');
            $('#keyword').focus();
            return;
        }
        /* $.ajax({
         url: '/qrmgr/scanCode',
         type: 'POST',
         data: {
         code: [batchNo]
         },
         // traditional: true,
         dataType: 'json',
         success: function (data) {
         if (data.code === 1) {
         if ($.isEmptyObject(data.context)) {
         alert('作废成功');
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
         }
         else {
         alert(data.msg);
         }
         }
         });*/
        var data = {code: 1, context: {status: '作废', date: moment().format('l'), user: 'admin'}, msg: 'success'};
        if (data.code === 1) {
            var $footer = $(this).hide().closest('.modal-footer');
            $footer.find('[data-info="statusList"]').removeClass('hide');

            $footer.find('[data-info="codeStatus"]').html(data.context.status);
            $footer.find('[data-info="date"]').html(data.context.date);
            $footer.find('[data-info="user"]').html(data.context.user);
        }
        else {
            alert(data.msg);
        }
    });
    // 修改
    /* $('tbody').on('click', '[data-tz="update"]', function () {
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
     });*/
// 获取进度信息
    $('#modal-progress').on('hidden.bs.modal', function () {
        $('#modal-progress .modal-title').html('');

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
        $('#modal-progress .modal-title').html($(this).data('batchno'));
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
        /*
         var otherWindow = window.open();
         otherWindow.opener = null;
         otherWindow.location = '/qrmgr/download?batchNo=' + $(this).data('batchno');
         */
        window.location.href = '/qrmgr/download?batchNo=' + $(this).data('batchno');
    });

    // 批量作废
    /*var scanCode = {
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
     });*/
});
