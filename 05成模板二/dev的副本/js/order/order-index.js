/**
 * @author Created by carol on 16/9/27.
 * @file 订单管理
 */

var phoneReg = new RegExp(/^1[3|4|5|7|8][0-9]\d{8}$/);
var orderid = '';
var activityIdReg = /(\\?|\\&)activityId=([^&?#]*)/ig;
var params = location.hash;
var activityId = params.match(activityIdReg) ? params.match(activityIdReg).join('').split('=')[1] :
    false;
if (activityId && activityId !== '-1') {
    store.set('activityStatId', activityId);
    $('#getActivityId').val(activityId);
    change(1);
}
else if (store.get('activityStatId')) {
    $('#getActivityId').val(store.get('activityStatId'));
    change(1);
}
else {
    $('#orderList').html('未找到相关数据');
}
// 查看快递
function kuaidi(delivery_num, type) {
    var otherWindow;
    switch (type) {
        case 1:
            // 顺丰
            otherWindow = window.open();
            otherWindow.opener = null;
            otherWindow.location = 'http://www.sf-express.com/mobile/cn/sc/dynamic_functions/waybill/waybill_query_info.html?billno=' + delivery_num;
            break;
        case 3:
            // 德邦
            otherWindow = window.open();
            otherWindow.opener = null;
            otherWindow.location = 'http://m.deppon.com/mow/client/index.html#/goodsTrack/' + delivery_num;
            break;
        case 4:
            // 中通
            otherWindow = window.open();
            otherWindow.opener = null;
            otherWindow.location = 'http://wap.zto.com/Bill/?BillCode=' + delivery_num;
            break;
        case 5:
            // 韵达
            otherWindow = window.open();
            otherWindow.opener = null;
            otherWindow.location = 'http://mobile.yundasys.com:2137/mobileweb/pages/query/queryDetail.html?mailno=' + delivery_num;
            break;
        default:
            otherWindow = window.open();
            otherWindow.opener = null;
            otherWindow.location = 'http://m.kuaidi100.com/result.jsp?nu=' + delivery_num;
    }
}
function change(page, pageSize,activityId, status, payStatus, awardType) {
    if (activityId === '-1') {
        store.remove('activityStatId');
        return;
    }
    page = page || 1;
    pageSize = pageSize || $('#data-table_length select').val();
    status = status || $("#getStatus option:selected").val();
    payStatus = payStatus || $("#getPayStatus option:selected").val();
    awardType = awardType || $('#awardType').find('option:selected').val();
    activityId = activityId || $('#getActivityId').val();
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    $.ajax({
        url: '/weiop/order/list/info',
        method: 'get',
        dataType: 'json',
        data: {
            activityId: activityId,
            pageIndex: page,
            pageSize: pageSize,
            status: status,
            payStatus: payStatus,
            awardType: awardType
        },
        success: function (e) {
            if (e.code === 1) {
                // 翻页
                $('html,body').animate({scrollTop: 0}, 150);
                e.context.page = page;
                $('[data-info=page]').text(page);
                $('.pagination').html(tmpl('template_page', e.context));
                $('[data-info="totalPage"]').html(e.context.totalPage);
                $('[data-page="' + page + '"]').parent().addClass('active');

                if (page > 1) {
                    $('#data-table_previous').removeClass('disabled')
                        .find('a').attr('data-page', page - 1);
                }
                if (e.context.totalPage > 1 && page < e.context.totalPage) {
                    $('#data-table_next').removeClass('disabled')
                        .find('a').attr('data-page', page - 0 + 1);
                }
                $('[data-tz="page"]').on('click', function () {
                    if (!$(this).parent().hasClass('active') && !$(this).parent().hasClass('disabled')) {
                        var i = $(this).data('page');
                        var datatableLength = $('#data-table_length select').val();
                        change(i, datatableLength);
                    }
                });
                if (e.context.orders.length > 0) {
                    $('#orderList').html(tmpl('template_list', e.context));
                    $('[data-kuaidi]').click(function () {
                        kuaidi($(this).data('waybill'), $(this).data('kuaidi'));
                    });

                    $('[data-click=upDate]').on('click', function (e) {
                        var username = $(this).data('username');
                        var mobile = $(this).data('mobile');
                        var address = $(this).data('address');
                        var province = $(this).data('province');
                        var district = $(this).data('district');
                        var city = $(this).data('city');
                        var memo = $(this).data('memo');
                        orderid = $(this).data('orderid');

                        $('#username').val(username);
                        $('#mobile').val(mobile);
                        $('#address').val(address);
                        $('#memo').val(memo);
                        $('.selectpicker').selectpicker('refresh');
                        $.ajax({
                            type: 'GET',
                            url: '/op/region/province',
                            success: function (res) {
                                if (res.code == 1) {
                                    var provinceList = '';
                                    for (var i = 0; i < res.context.regions.length; i++) {
                                        provinceList += '<option value="' + res.context.regions[i].id + '">' + res.context.regions[i].name + '</option>'
                                    }
                                    $('#province').html(provinceList);
                                    if (province) {
                                        $('#province option[value="' + province + '"]').attr('selected', 'selected');
                                    }
                                    $('.selectpicker').selectpicker('refresh');

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

                        if (province) {
                            getCity(province, city);
                        }

                        if (city) {
                            getDistrict(city, district);
                        }


                        $('#province').change(function () {
                            province = $(this).children('option:selected').val();
                            $('#city').html('<option>请选择城市</option>');
                            $('#district').html('<option>请选择地区</option>');
                            $('.selectpicker').selectpicker('refresh');

                            getCity(province, '');
                        })

                        $('#city').change(function () {
                            city = $(this).children('option:selected').val();
                            $('#district').html('<option>请选择地区</option>');
                            $('.selectpicker').selectpicker('refresh');

                            getDistrict(city, '');
                        })

                        $('#modal-alert').modal('show');
                    });


                }
                else {
                    // $('.table-striped tbody').html('<tr><td colspan="5">未找到相关数据</td></tr>')
                    $('#orderList').html('未找到相关数据');
                }
                $('.panel-body-loader').addClass('hide');

            }
            else {
                alert(e.msg);
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

function searchRes(page, qkey, pageSize, status, payStatus, awardType) {
    page = page || 1;
    qkey = qkey || $('#qkey').val();
    pageSize = pageSize || $('#data-table_length select').val();
    status = status || $("#getStatus option:selected").val();
    payStatus = payStatus || $("#getPayStatus option:selected").val();
    awardType = awardType || $('#awardType').find('option:selected').val();
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    $.ajax({
        type: 'GET',
        url: '/weiop/order/query/info',
        data: {
            qkey: qkey,
            activityId: activityId,
            pageIndex: page,
            pageSize: pageSize,
            status: status,
            payStatus: payStatus,
            awardType: awardType
        },
        success: function (e) {
            if (e.code === 1) {
                // 翻页
                $('html,body').animate({scrollTop: 0}, 150);
                e.context.page = page;
                $('[data-info=page]').text(page);
                $('.pagination').html(tmpl('template_page', e.context));
                $('[data-info="totalPage"]').html(e.context.totalPage);
                $('[data-page="' + page + '"]').parent().addClass('active');

                if (page > 1) {
                    $('#data-table_previous').removeClass('disabled')
                        .find('a').attr('data-page', page - 1);
                }
                if (e.context.totalPage > 1 && page < e.context.totalPage) {
                    $('#data-table_next').removeClass('disabled')
                        .find('a').attr('data-page', page - 0 + 1);
                }
                $('[data-tz="page"]').on('click', function () {
                    if (!$(this).parent().hasClass('active') && !$(this).parent().hasClass('disabled')) {
                        var i = $(this).data('page');
                        searchRes(i);
                    }
                });
                if (e.context.orders.length > 0) {
                    $('#orderList').html(tmpl('template_list', e.context));
                    $('[data-kuaidi]').click(function () {
                        kuaidi($(this).data('waybill'), $(this).data('kuaidi'));
                    });

                    $('[data-click=upDate]').on('click', function (e) {
                        var username = $(this).data('username');
                        var mobile = $(this).data('mobile');
                        var address = $(this).data('address');
                        var province = $(this).data('province');
                        var district = $(this).data('district');
                        var city = $(this).data('city');
                        var memo = $(this).data('memo');
                        orderid = $(this).data('orderid');

                        $('#username').val(username);
                        $('#mobile').val(mobile);
                        $('#address').val(address);
                        $('#memo').val(memo);
                        $('.selectpicker').selectpicker('refresh');
                        $.ajax({
                            type: 'GET',
                            url: '/op/region/province',
                            success: function (res) {
                                if (res.code == 1) {
                                    var provinceList = '';
                                    for (var i = 0; i < res.context.regions.length; i++) {
                                        provinceList += '<option value="' + res.context.regions[i].id + '">' + res.context.regions[i].name + '</option>'
                                    }
                                    $('#province').html(provinceList);
                                    if (province) {
                                        $('#province option[value="' + province + '"]').attr('selected', 'selected');
                                    }
                                    $('.selectpicker').selectpicker('refresh');
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

                        if (province) {
                            getCity(province, city);
                        }

                        if (city) {
                            getDistrict(city, district);
                        }


                        $('#province').change(function () {
                            province = $(this).children('option:selected').val();
                            $('#city').html('<option>请选择城市</option>');
                            $('#district').html('<option>请选择地区</option>');
                            $('.selectpicker').selectpicker('refresh');
                            getCity(province, '');
                        })

                        $('#city').change(function () {
                            city = $(this).children('option:selected').val();
                            $('#district').html('<option>请选择地区</option>');
                            $('.selectpicker').selectpicker('refresh');
                            getDistrict(city, '');
                        })

                        $('#modal-alert').modal('show');
                    });


                }
                else {
                    $('#orderList').html('未找到相关数据');
                }
            }
            else {
                alert(e.msg);
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
function clearSearch() {
    $('#qkey').val('');
    $('.search-clear-btn').addClass('hide');
};
// 选择n项结果加载列表
$('#data-table_length select').change(function () {
    change(1);
});

$('#getActivityId').change(function () {
    activityId = $(this).find('option:selected').val();
    clearSearch();
    change(1);
    store.set('activityStatId', $(this).val());
});

$('#getStatus').change(function () {
    clearSearch();
    change(1);
});

$('#getPayStatus').change(function () {
    clearSearch();
    change(1);
});
$('#awardType').change(function () {
    clearSearch();
    change(1);
});


$('[data-tz=search]').on('click', function () {
    var qkey = $('#qkey').val();
    if (!qkey) {
        alert('请输入手机号或者订单号搜索');
        return;
    }
    searchRes(1, qkey);
});
$('#qkey').on('keyup', function (e) {
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
    change(1);
});

function getCity(code, cityCode) {
    $.ajax({
        type: 'GET',
        url: '/op/region/list?code=' + code,
        success: function (res) {
            if (res.code === 1) {
                var cityList = '';
                for (var i = 0; i < res.context.regions.length; i++) {
                    cityList += '<option value="' + res.context.regions[i].id + '">' + res.context.regions[i].name + '</option>'
                }
                $('#city').html(cityList);
                if (cityCode) {
                    $('#city option[value="' + cityCode + '"]').attr('selected', 'selected');
                }

                if (res.context.regions.length == 1) {
                    getDistrict(res.context.regions[0].id, '')
                }
                $('.selectpicker').selectpicker('refresh');
            }
            else {
                alert(res.msg)
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

function getDistrict(code, cityCode) {
    $.ajax({
        type: 'GET',
        url: '/op/region/list?code=' + code,
        success: function (res) {
            if (res.code === 1) {
                var districtList = '';
                for (var i = 0; i < res.context.regions.length; i++) {
                    districtList += '<option value="' + res.context.regions[i].id + '">' + res.context.regions[i].name + '</option>'
                }
                $('#district').html(districtList);
                if (cityCode) {
                    $('#district option[value="' + cityCode + '"]').attr('selected', 'selected');
                }
                $('.selectpicker').selectpicker('refresh');
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

$(function () {
    $('#modal-alert').on('hidden.bs.modal', function (e) {
        $(this)[0].reset();
        $(this).parsley().reset();
    }).parsley().on('form:submit', function () {
        $.ajax({
            type: 'POST',
            url: '/weiop/order/update',
            data: {
                orderid: orderid,
                username: $('#username').val(),
                mobile: $('#mobile').val(),
                address: $('#address').val(),
                memo: $('#memo').val(),
                province: $('#province option:selected').val(),
                city: $('#city option:selected').val(),
                district: $('#district option:selected').val()
            },
            success: function (res) {
                if (res.code === 1) {
                    change(1);
                    $('#modal-alert').modal('hide');

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
    $('#order-detail').on('show.bs.modal', function (e) {
        var $relatedTarget = $(e.relatedTarget);
        $(this).find('[data-info=payTime]').html('支付时间：' + $relatedTarget.data('paytime'));
        $(this).find('[data-info=address]').html($relatedTarget.data('address'));
        if ($relatedTarget.data('location')) {
            $(this).find('[data-info=orderLocation]').html('下单地址：' + $relatedTarget.data('location'));
        }
    }).on('hidden.bs.modal', function () {
        $(this).find('[data-info=payTime]').html('');
        $(this).find('[data-info=address]').html('');
        $(this).find('[data-info=orderLocation]').html('');
    });
});


