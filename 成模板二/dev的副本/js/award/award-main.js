/**
 * @file 奖品库
 */
var isAdd = false;
$('#add').on('click', function () {
    isAdd = true;
    $('#modal-alert').modal('show');
});
$('#propFlag').change(function () {
    if ($(this).val() === '2') {
        $('#brandName').closest('.form-group').removeClass('hidden');
    }
    else {
        $('#brandName').closest('.form-group').addClass('hidden');
    }
});

$('[data-tz="imgUpload"]').on('change', function () {
    var $this = $(this);
    var formData = new FormData();
    formData.append('file', this.files[0]);
    var channel = $this.data('channel');
    formData.append('channel', channel);
    $.ajax({
        url: '/op/storage/upload',
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json'
    }).done(function (res) {
        var code = res.code;
        if (code === 1) {
            // console.log('上传成功,图片地址为:' + res.context.url);
            var url = res.context.url;
            if (url) {
                $this.parent().next('[type="url"]').val(url);
                $this.prev().remove();
                $('<div class="pic"><img src=' + url + '></div>').insertBefore($this);
            }
        }
        else {
            alert(code + '\r\n' + res.message);
        }
    }).fail(function (res) {
        alert('上传失败!请重试');
    });
})
$('[type="url"]').change(function () {
    var $target = $(this).parent().find('.pic img');
    if ($target.length > 0) {
        $target.attr('src', $(this).val());
    }
});

var pid = '';
/* -----------------  总奖品列表 ------------------------------ */
var $keyword = $('#keyword');
// 导入活动奖品时获取奖品列表

function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}

function getAwardList(page, size, totalPage) {
    if (!totalPage || totalPage <= 0) {
        return;
    }
    page = page || 1;
    size = size || totalPage * $('#tab-1 [name=data-table_length]').val();
    $.ajax({
        url: '/award/product/list',
        type: 'GET',
        data: {
            page: page,
            size: size
        },
        success: function (data) {
            if (data.code === 1) {
                $('#addActAward').html(tmpl('template_award_list', data.context))
                    .selectpicker('refresh');
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
function getList(page, keyword, orderBy, size) {
    page = page || 1;
    keyword = keyword || $.trim($keyword.val());
    orderBy = orderBy || $('#tab-1 [data-sort].active').data('sort');
    size = size || $('#tab-1 [name=data-table_length]').val();
    $('#tab-1 .panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    $.ajax({
        url: '/award/product/list',
        type: 'GET',
        data: {
            page: page,
            size: size,
            order_by: orderBy,
            keyword: keyword
        },
        success: function (data) {
            if (data.code === 1) {
                $('#tab-1 tbody').html(tmpl('template_list', data.context));
                // 翻页
                $('html,body').animate({scrollTop: 0}, 150);
                data.context.page = page;
                $('[data-info=page]').text(page);
                $('#tab-1 .pagination').html(tmpl('template_page', data.context));
                $('#tab-1 [data-info="totalPage"]').html(data.context.totalPage);
                $('#tab-1 [data-page="' + page + '"]').parent().addClass('active');

                if (page > 1) {
                    $('#tab-1 .previous').removeClass('disabled')
                        .find('a').attr('data-page', page - 1);
                }
                if (data.context.totalPage > 1 && page < data.context.totalPage) {
                    $('#tab-1 .next').removeClass('disabled')
                        .find('a').attr('data-page', page - 0 + 1);
                }
                $('#tab-1 [data-tz="page"]').on('click', function () {
                    if (!$(this).parent().hasClass('active') && !$(this).parent().hasClass('disabled')) {
                        var i = $(this).data('page');
                        getList(i);
                    }
                });
                getAwardList(1, false, data.context.totalPage);
            }
            else {
                alert(data.msg);
            }
            $('#tab-1 .panel-body-loader').addClass('hide');
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
$(document).on('click', '[data-click=upDate]', function (e) {
    isAdd = false;
    var $tr = $(this).closest('tr');
    pid = $tr.data('pid');
    var name = $tr.data('name');
    var description = $tr.data('description');
    var quantity = $tr.data('quantity');
    var price = $tr.data('price');
    var image = $tr.data('image');
    var url = $tr.data('url');
    var remark = $tr.data('remark');
    var type = $tr.data('type');
    var propFlag = $tr.data('propflag');
    var brandName = $tr.data('brandname');
    var packageType = $tr.data('packagetype');
    var productType = $tr.data('producttype');

    var exchangeUrl = $tr.data('exchangeurl'); // 兑换链接
    var status = $tr.data('status'); // 状态
    if (image) {
        $('#modal-alert').find('.pic img').attr('src', image);
        $('#imageUrl').val(image);
    }

    $('#name').val(name);
    $('#description').val(description);
    $('#quantity').val(quantity);
    $('#price').val(price);
    $('#award-url').val(url);
    $('#remark').val(remark);
    $('#type').val(type);
    $('#propFlag').val(propFlag);
    if (propFlag == '2') {
        $('#brandName').val(brandName).closest('.form-group').removeClass('hidden');
    }

    $('#packageType').val(packageType);
    $('#productType').val(productType);

    $('#exchangeUrl').val(exchangeUrl).prop('disabled', false); // 兑换链接
    $('#status').val(status).prop('disabled', false); // 状态

    $('#modal-alert').modal('show');

    $('.selectpicker').selectpicker('refresh');
})

$('#modal-alert').on('hidden.bs.modal', function () {
    $(this).parsley().reset();
    $(this)[0].reset();
    $(this).find('.pic img').attr('src', '//saascore.oss-cn-beijing.aliyuncs.com/custom/img/common/upload.jpg');
    $('#brandName').closest('.form-group').addClass('hidden');
    $(this).find('select').selectpicker('refresh');
    $('#exchangeUrl').prop('disabled', true);
    $('#status').prop('disabled', true);
}).parsley().on('form:submit', function () {
    if (isAdd) {
        $.ajax({
            type: 'POST',
            url: '/award/product/add',
            data: {
                name: $('#name').val(),
                description: $('#description').val(),
                quantity: $('#quantity').val(),
                price: $('#price').val(),
                image: $('#imageUrl').val(),
                remark: $('#remark').val(),
                type: $('#type').find('option:selected').val(),
                propFlag: $('#propFlag').find('option:selected').val(),
                brandName: $('#brandName').val(),
                packageType: $('#packageType').find('option:selected').val(),
                productType: $('#productType').find('option:selected').val()
            },
            success: function (res) {
                if (res.code === 1) {
                    $('#modal-alert').modal('hide');
                    alert('保存成功');
                    getList();
                }
                else {
                    alert(res.msg);
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
    else {
        $.ajax({
            type: 'POST',
            url: '/award/product/' + pid + '/update',
            data: {
                name: $('#name').val(),
                description: $('#description').val(),
                quantity: $('#quantity').val(),
                price: $('#price').val(),
                image: $('#imageUrl').val(),
                // url: $('#award-url').val(),
                remark: $('#remark').val(),
                type: $('#type').find('option:selected').val(),
                // wishing: $('#wishing').val(),
                // sendname: $('#sendname').val(),
                // exchangeUrl: $('#exchangeUrl').val(),
                // isNew: $('#isNew').val()
                propFlag: $('#propFlag').val(),
                brandName: $('#brandName').val(),
                packageType: $('#packageType').val(),
                productType: $('#productType').val(),

                exchangeUrl: $('#exchangeUrl').val(), // 兑换链接
                status: $('#status').find('option:selected').val() // 状态
            },
            success: function (res) {
                if (res.code === 1) {
                    $('#modal-alert').modal('hide');
                    alert('更新成功');
                    getList($('#tab-1 .pagination li.active [data-tz=page]').data('page'));
                    getActivityList($('#tab-2 .pagination li.active [data-tz=page]').data('page'));
                }
                else {
                    alert(res.msg);
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
    return false;
});



// 点击排序加载列表
$('#tab-1 [data-sort]').click(function () {
    if (!$(this).hasClass('active')) {
        $('[data-sort].active').removeClass('active');
        $(this).addClass('active');
        getList();
    }
});
// 选择n项结果加载列表
$('#tab-1 [name=data-table_length]').change(function () {
    getList();
});
// 关键字搜索加载列表
$('#tab-1 [data-tz="search"]').click(function () {
    getList();
});
$('#tab-1 #keyword').on('keyup', function (e) {
    if (e.keyCode === 13) {
        $('#tab-1 [data-tz="search"]').trigger('click');
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
    $('#tab-1 [data-tz="search"]').trigger('click');
});
/* ----------------- end 总奖品列表 ------------------------------ */

/* -----------------  活动奖品列表 ------------------------------ */
var $keyword2 = $('#keyword2');
// 总奖品列表
function getActivityList(page, orderBy, orderType, keyword, size, activityId) {
    activityId = activityId || $('#getActivityId').val();
    if (activityId === '-1') {
        return;
    }
    page = page || 1;
    keyword = keyword || $.trim($keyword2.val());
    orderBy = orderBy || $('#tab-2 [data-sort].active').data('sort');
    size = size || $('#tab-2 [name=data-table_length]').val();
    if (!orderType) {
        orderType =  $('#tab-2 [data-sort].active').attr('data-orderbytype') === 'desc' ? 'asc' : 'desc';
    }
    $('#tab-2 .panel-body-loader.hide').removeClass('hide');
    $.ajax({
        url: '/award/product/list/activity',
        type: 'GET',
        data: {
            page: page,
            size: size,
            order_by: orderBy,
            keyword: keyword,
            activityId: activityId,
            orderType: orderType
        },
        success: function (data) {
            var attr = data.context.products;
            data.context.products = attr.sort(compare('status'));
            if (data.code === 1) {
                $('#tab-2 tbody').html(tmpl('template_activity_list', data.context));
                // 翻页
                data.context.page = page;
                $('[data-info=page]').text(page);
                $('#tab-2 .pagination').html(tmpl('template_page', data.context));
                $('#tab-2 [data-info="totalPage"]').html(data.context.totalPage);
                $('#tab-2 [data-page="' + page + '"]').parent().addClass('active');

                if (page > 1) {
                    $('#tab-2 .previous').removeClass('disabled')
                        .find('a').attr('data-page', page - 1);
                }
                if (data.context.totalPage > 1 && page < data.context.totalPage) {
                    $('#tab-2 .next').removeClass('disabled')
                        .find('a').attr('data-page', page - 0 + 1);
                }
                $('#tab-2 [data-tz="page"]').on('click', function () {
                    if (!$(this).parent().hasClass('active') && !$(this).parent().hasClass('disabled')) {
                        var i = $(this).data('page');
                        getActivityList(i);
                    }
                });
            }
            else {
                alert(data.msg);
            }
            $('#tab-2 .panel-body-loader').addClass('hide');
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

// 点击排序加载列表
$('#tab-2 [data-sort]').click(function () {
    getActivityList(1, $(this).data('sort'), $(this).attr('data-orderbytype'));
    $('#tab-2 [data-sort].active').removeClass('active');
    $(this).addClass('active');
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
function tab2clearSort() {
    $('#tab-2 [data-orderbytype]').attr('data-orderbytype', 'desc').removeClass('active').find('i.fa').attr('class', '').addClass('fa fa-sort m-l-5');
}
// 活动列表
$('#getActivityId').on('change', function () {
    getActivityList();
    tab2clearSort();
})
// 选择n项结果加载列表
$('#tab-2 [name=data-table_length]').change(function () {
    getActivityList();
    tab2clearSort();
});
// 关键字搜索加载列表
$('#tab-2 [data-tz="search"]').click(function () {
    getActivityList();
    tab2clearSort();
});
$('#tab-2 #keyword2').on('keyup', function (e) {
    if (e.keyCode === 13) {
        $('#tab-2 [data-tz="search"]').trigger('click');
    }
    if ($(this).val().length > 0) {
        $(this).next('.search-clear-btn').removeClass('hide');
    }
    else {
        $(this).next('.search-clear-btn').addClass('hide');
    }
});
$('#tab-2 .search-clear-btn').click(function () {
    $(this).addClass('hide').prev('[type=search]').val('');
    $('#tab-2 [data-tz="search"]').trigger('click');
});

// 显示/隐藏积分项
function scoreStatus(bool) {
    if (bool) {
        $('#editScore').closest('.form-group').removeClass('hidden');
        $('#editIdx').closest('.form-group').removeClass('hidden');
        $('#editExchangeType').closest('.form-group').removeClass('hidden');
        $('#editShopShow').closest('.form-group').removeClass('hidden');
        $('#editShopQuantity').closest('.form-group').removeClass('hidden');
    }
    else {
        $('#editScore').closest('.form-group').addClass('hidden');
        $('#editIdx').closest('.form-group').addClass('hidden');
        $('#editExchangeType').closest('.form-group').addClass('hidden');
        $('#editShopShow').closest('.form-group').addClass('hidden');
        $('#editShopQuantity').closest('.form-group').addClass('hidden');
    }
}
function redPack(bool) {
    if (bool) {
        $('#editSendname').closest('.form-group').removeClass('hidden');
        $('#editWishing').closest('.form-group').removeClass('hidden');
    }
    else {
        $('#editSendname').closest('.form-group').addClass('hidden');
        $('#editWishing').closest('.form-group').addClass('hidden');
    }
}
$('#editType').change(function () {
    if ($(this).val() === '3') {
        scoreStatus(false);
        redPack(true);
    }
    else if ($(this).val() === '6') {
        redPack(false);
        scoreStatus(true);
    }
    else {
        redPack(false);
        scoreStatus(false);
    }
});
// 编辑活动奖品
$('#modal-actAward-edit').on('show.bs.modal', function (e) {
    var $tr = $(e.relatedTarget).closest('tr');
    var pid = $tr.data('pid');
    var name = $tr.data('name');
    var memo = $tr.data('memo');
    // var quantity = $tr.data('quantity'); // 数量
    var price = $tr.data('price');
    var image = $tr.data('image');
    var url = $tr.data('url');
    var sendname = $tr.data('sendname');
    var wishing = $tr.data('wishing');
    var type = $tr.data('type');
    // var isNew = $tr.data('isnew'); // 是否新品
    var exchangeUrl = $tr.data('exchangeurl');
    var propFlag = $tr.data('propflag');
    var brandName = $tr.data('brandname');
    var packages = $tr.data('packages');
    var productType = $tr.data('producttype');
    // var baseNum = $tr.data('basenum'); // 中奖基数
    var exchangeType = $tr.data('exchangetype');
    var idx = $tr.data('idx');
    var originPrice = $tr.data('originprice');
    // var probability = $tr.data('probability'); // 中奖概率
    // var rankShow = $tr.data('rankshow'); // 广播中是否显示
    var score = $tr.data('score');
    var shopShow = $tr.data('shopshow');
    // var status = $tr.data('status');
    var shopQuantity = $tr.data('shopquantity');
    var quantityPerCell = $tr.data('quantitypercell');
    if (image) {
        $('#modal-actAward-edit').find('.pic img').attr('src', image);
        $('#editImageUrl').val(image);
    }
    $(this).find('[data-info=pid]').val(pid);
    $('#editName').val(name);
    $('#editMemo').val(memo);
    // $('#editQuantity').val(quantity);
    $('#editPrice').val(price);
    $('#editUrl').val(url);
    $('#editSendname').val(sendname);
    $('#editWishing').val(wishing);
    $('#editType').val(type);
    $('#editExchangeUrl').val(exchangeUrl);
    // $('#editIsNew').val(isNew);
    $('#editPropFlag').val(propFlag);
    if (propFlag == '2') {
        $('#editBrandName').val(brandName).closest('.form-group').removeClass('hidden');
    }
    if (type == '3') {
        redPack(true);
    }
    else if (type == '6') {
        scoreStatus(true);
    }
    else {
        redPack(false);
        scoreStatus(false);
    }
    $('#editPackages').val(packages);
    $('#editProductType').val(productType);
    // $('#editbBasenum').val(baseNum);
    $('#editExchangeType').val(exchangeType);
    $('#editIdx').val(idx);
    $('#originPrice').val(originPrice);
    // $('#editProbability').val(probability);
    // $('#editRankShow').val(rankShow);
    $('#editScore').val(score);
    $('#editShopShow').val(shopShow);
    $('#editQuantity').val(shopQuantity);
    $('#editQuantityPerCell').val(quantityPerCell);

    $('.selectpicker').selectpicker('refresh');
}).on('hidden.bs.modal', function () {
    $(this).parsley().reset();
    $(this)[0].reset();
    $(this).find('.pic img').attr('src', '//saascore.oss-cn-beijing.aliyuncs.com/custom/img/common/upload.jpg');
    $(this).find('select').selectpicker('refresh');
}).parsley().on('form:submit', function () {
    $.ajax({
        type: 'POST',
        url: '/award/activity/product/edit',
        data: {
            paramType: 1,
            activityId: $('#getActivityId').val(),
            productId: $('#modal-actAward-edit').find('[data-info=pid]').val(),
            awardName: $('#editName').val(),
            memo: $('#editMemo').val(),
            exchangeType: $('#editExchangeType').find('option:selected').val(),
            // quantity: $('#editQuantity').val(),
            price: $('#editPrice').val(),
            image: $('#editImageUrl').val(),
            url: $('#editUrl').val(),
            sendname: $('#editSendname').val(),
            wishing: $('#editWishing').val(),
            // type: $('#editType').find('option:selected').val(),
            exchangeUrl: $('#editExchangeUrl').val(),
            // isNew: $('#editIsNew').find('option:selected').val(),
            // baseNum: $('#editBasenum').val(),
            idx: $('#editIdx').val(),
            // probability: $('#editProbability').val(),
            propFlag: $('#editPropFlag').val(),
            quantityPerCell: $('#editQuantityPerCell').val(),
            // rankShow: $('#editRankShow').val(),
            score: $('#editScore').val(),
            shopShow: $('#editShopShow').find('option:selected').val(),
            packages: $('#editPackages').find('option:selected').val(),
            shopQuantity: $('#editShopQuantity').val()
        },
        success: function (res) {
            if (res.code === 1) {
                getActivityList($('#tab-2 .pagination li.active [data-tz=page]').data('page'));
                $('[data-dismiss=modal]').trigger('click');
            }
            else {
                alert(res.msg);
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
// 导入活动奖品
$('#modal-actAward').on('hidden.bs.modal', function () {
    $(this).parsley().reset();
    // $(this)[0].reset();
    $('#addActAward').selectpicker('deselectAll');
}).parsley().on('form:submit', function () {
    if (!$('#addActAward').val()) {
        alert('没有选中项');
        return false;
    }
    if ($('#addActAward').val() === '-1') {
        alert('还没有添加过奖品');
        return false;
    }
    $.ajax({
        url: '/award/activity/product/add',
        type: 'POST',
        data: {
            activityId: $('#getActivityId').val(),
            ids: $('#addActAward').val().toString()
        },
        success: function (data) {
            if (data.code === 1) {
                getActivityList();
                $('[data-dismiss=modal]').trigger('click');
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
// 活动奖品策略
$('#modal-actAward-strategy').on('show.bs.modal', function (e) {
    var $tr = $(e.relatedTarget).closest('tr');
    var pid = $tr.data('pid');
    var quantity = $tr.data('quantity');
    var isNew = $tr.data('isnew');
    var probability = $tr.data('probability');
    var baseNum = $tr.data('basenum');
    var rankShow = $tr.data('rankshow');
    $(this).find('[data-info=pid]').val(pid);
    $('#editQuantity').val(quantity);
    $('#editIsNew').val(isNew);
    $('#editBaseNum').val(baseNum);
    $('#editProbability').val(probability);
    $('#editRankShow').val(rankShow);

    $('.selectpicker').selectpicker('refresh');
}).on('hidden.bs.modal', function () {
    $(this).parsley().reset();
    $(this)[0].reset();
    $(this).find('select').selectpicker('refresh');
}).parsley().on('form:submit', function () {
    $.ajax({
        type: 'POST',
        url: '/award/activity/product/edit',
        data: {
            paramType: 2,
            activityId: $('#getActivityId').val(),
            productId: $('#modal-actAward-strategy').find('[data-info=pid]').val(),
            quantity: $('#editQuantity').val(),
            isNew: $('#editIsNew').find('option:selected').val(),
            baseNum: $('#editBaseNum').val(),
            probability: $('#editProbability').val(),
            rankShow: $('#editRankShow').val(),
        },
        success: function (res) {
            if (res.code === 1) {
                getActivityList($('#tab-2 .pagination li.active [data-tz=page]').data('page'));
                $('[data-dismiss=modal]').trigger('click');
            }
            else {
                alert(res.msg);
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
// 上下线活动奖品
function offLine(productSn, status, activityId) {
    activityId = activityId || $('#getActivityId').val();
    if (activityId === '-1') {
        return;
    }
    productSn = productSn || '';
    if (!status) {
        return;
    }
    $.ajax({
        url: '/award/product/' + activityId + '/' + productSn + '/' + status,
        type: 'POST',
        success: function (data) {
            if (data.code === 1) {
                alert('操作成功');
                getActivityList($('#tab-2 .pagination li.active [data-tz=page]').data('page'));
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
$(document).on('click', '[data-click=offLine]', function () {
    offLine($(this).closest('tr').data('pid'), $(this).data('status'));
});

/* ----------------- end 活动奖品列表 ------------------------------ */
$(function () {
    getList();
    getActivityList();
});


