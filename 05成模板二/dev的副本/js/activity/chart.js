var $activityId = $('#activityId');
var line = {
    getOption: function (data, name) {
        option = {
            tooltip: {
                trigger: 'axis'
            },
            /* legend: {
             data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
             },*/
            /*toolbox: {
             feature: {
             saveAsImage: {}
             }
             },*/
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: data.x
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '数量',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data: data[name]
                }
            ]
        };
        return option;
    }
};

function getStatInfo(b, e, a) {
    a = a || $activityId.val();
    var dateReg = /(\d{2}|\d{4})(?:\-)?([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)?([0-2]{1}\d{1}|[3]{1}[0-1]{1})(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1})(?::)?([0-5]{1}\d{1})(?::)?([0-5]{1}\d{1})/;
    $('.panel-body-loader').removeClass('hide');
    var $endTime = $('[name="daterangepicker_end"]');
    var $beginTime = $('[name="daterangepicker_start"]');
    b = b || $beginTime.val();
    e = e || $endTime.val();
    if (!dateReg.test(b) || !dateReg.test(e) || b === e) {
        alert('日期格式不对/开始时间不能等于结束时间');
        return;
    }
    if (b.split(' ')[0] === e.split(' ')[0]) {
        $('.muted').html(b.split(' ')[0]);
    }
    else {
        $('.muted').html(b.split(' ')[0] + ' - ' + e.split(' ')[0]);
    }
    $.ajax({
        url: '/weiop/activity/stat/info',
        type: 'GET',
        data: {
            activityId: a,
            beginTime: b,
            endTime: e
        },
        success: function (data) {
            $('.panel-body-loader').addClass('hide');
            if (data.code === 1) {
                // 助力人数
                if (data.context.yHelp.length > 0) {
                    var help = echarts.init(document.getElementById('help'), theme);
                    help.setOption(line.getOption(data.context, 'yHelp'));
                    $(window).resize(function () {
                        throttle(help.resize);
                    });
                }
                else {
                    $('#help').html('暂无数据');
                }
                if (data.context.yHelpInc.length > 0) {
                    var helpInc = echarts.init(document.getElementById('helpInc'), theme);
                    helpInc.setOption(line.getOption(data.context, 'yHelpInc'));
                    $(window).resize(function () {
                        throttle(helpInc.resize);
                    });
                }
                else {
                    $('#helpInc').html('暂无数据');
                }
                // 发起人数
                if (data.context.yJoins.length > 0) {
                    var joins = echarts.init(document.getElementById('joins'), theme);
                    joins.setOption(line.getOption(data.context, 'yJoins'));
                    $(window).resize(function () {
                        throttle(joins.resize);
                    });
                }
                else {
                    $('#joins').html('暂无数据');
                }
                if (data.context.yJoinsInc.length > 0) {
                    var joinsInc = echarts.init(document.getElementById('joinsInc'), theme);
                    joinsInc.setOption(line.getOption(data.context, 'yJoinsInc'));
                    $(window).resize(function () {
                        throttle(joinsInc.resize);
                    });
                }
                else {
                    $('#joinsInc').html('暂无数据');
                }
                // 订单数
                if (data.context.yOrders.length > 0) {
                    var orders = echarts.init(document.getElementById('orders'), theme);
                    orders.setOption(line.getOption(data.context, 'yOrders'));
                    $(window).resize(function () {
                        throttle(orders.resize);
                    });
                }
                else {
                    $('#orders').html('暂无数据');
                }
                if (data.context.yOrdersInc.length > 0) {
                    var ordersInc = echarts.init(document.getElementById('ordersInc'), theme);
                    ordersInc.setOption(line.getOption(data.context, 'yOrdersInc'));
                    $(window).resize(function () {
                        throttle(ordersInc.resize);
                    });
                }
                else {
                    $('#ordersInc').html('暂无数据');
                }
                // 订单支付数
                if (data.context.yOrdersPay.length > 0) {
                    var ordersPay = echarts.init(document.getElementById('ordersPay'), theme);
                    ordersPay.setOption(line.getOption(data.context, 'yOrdersPay'));
                    $(window).resize(function () {
                        throttle(ordersPay.resize);
                    });
                }
                else {
                    $('#ordersPay').html('暂无数据');
                }
                if (data.context.yOrdersPayInc.length > 0) {
                    var ordersPayInc = echarts.init(document.getElementById('ordersPayInc'), theme);
                    ordersPayInc.setOption(line.getOption(data.context, 'yOrdersPayInc'));
                    $(window).resize(function () {
                        throttle(ordersPayInc.resize);
                    });
                }
                else {
                    $('#ordersPayInc').html('暂无数据');
                }
                // pv
                if (data.context.yPV.length > 0) {
                    var pv = echarts.init(document.getElementById('pv'), theme);
                    pv.setOption(line.getOption(data.context, 'yPV'));
                    $(window).resize(function () {
                        throttle(pv.resize);
                    });
                }
                else {
                    $('#pv').html('暂无数据');
                }
                if (data.context.yPVInc.length > 0) {
                    var pvInc = echarts.init(document.getElementById('pvInc'), theme);
                    pvInc.setOption(line.getOption(data.context, 'yPVInc'));
                    $(window).resize(function () {
                        throttle(pvInc.resize);
                    });
                }
                else {
                    $('#pv').html('暂无数据');
                }
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
// 头部数据
function getList(b, e, a, traceId, time) {
    a = a || $activityId.val();
    traceId = traceId || $activityId.find('option:selected').data('traceid');
    time = time || $activityId.find('option:selected').data('time');
    if (!a || !traceId) {
        return;
    }
    var dateReg = /(\d{2}|\d{4})(?:\-)?([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)?([0-2]{1}\d{1}|[3]{1}[0-1]{1})(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1})(?::)?([0-5]{1}\d{1})(?::)?([0-5]{1}\d{1})/;
    var $endTime = $('[name="daterangepicker_end"]');
    var $beginTime = $('[name="daterangepicker_start"]');
    b = b || $beginTime.val();
    e = e || $endTime.val();
    if (!dateReg.test(b) || !dateReg.test(e) || b === e) {
        alert('日期格式不对/开始时间不能等于结束时间');
        return;
    }
    $.ajax({
        type: 'GET',
        url: '/data/pv',
        data: {
            beginTime: time,
            endTime: moment(sysTime).endOf('day').format('l'),
            traceId: traceId,
            perBeginTime: '',
            perEndTime: '',
            activityId: a,
            appid: ''
        },
        success: function (res) {
            if (res.code === 1) {
                var html = '';
                html += '<td>' + res.context.yPV + '</td><td>' + res.context.yUV + '</td><td data-info="user-join">' + res.context.yUserJoin + '</td><td data-info="user-help">' + res.context.yHelp + '</td><td data-info="user-order">' + res.context.yOrders + '</td><td>' + res.context.yFans + '</td><td>' + res.context.yNewusers + '</td>';
                $('#project_data').html(html);

            }
            else {
                $('#project_data').html('<td>0</td><td>0</td><td data-info="user-join">0</td><td data-info="user-help">0</td><td data-info="user-order">0</td><td>0</td><td>0</td>');
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
    $.ajax({
        type: 'GET',
        url: '/data/pv',
        data: {
            beginTime: b,
            endTime: e,
            traceId: traceId,
            perBeginTime: '',
            perEndTime: '',
            activityId: a,
            appid: ''
        },
        success: function (res) {
            if (res.code === 1) {
                var html = '';
                html += '<td></td><td>' + res.context.yPV + '</td><td>' + res.context.yUV + '</td><td data-info="user-join">' + res.context.yUserJoin + '</td><td data-info="user-help">' + res.context.yHelp + '</td><td data-info="user-order">' + res.context.yOrders + '</td><td>' + res.context.yFans + '</td><td>' + res.context.yNewusers + '</td>';
                $('#list_data').html(html);

            }
            else {
                $('#list_data').html('<td></td><td>0</td><td>0</td><td data-info="user-join">0</td><td data-info="user-help">0</td><td data-info="user-order">0</td><td>0</td><td>0</td>');
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
    var activityidReg = /(\\?|\\&)activityId=([^&?#]*)/ig;
    var params = location.hash;
    var activityid = params.match(activityidReg) ? params.match(activityidReg).join('').split('=')[1] : false;
    if (activityid) {
        store.set('activityStatId', activityid);
    }

    // 活动列表改变时获得数据
    $activityId.on('change', function () {
        if ($('#top_bar button.time-tag-active').length > 0) {
            $('#top_bar button.time-tag-active').trigger('click');
        }
        else {
            getStatInfo();
        }
        store.set('activityStatId', $(this).val());
    });
    $('#advance-daterange').daterangepicker({
            format: 'YYYY-MM-DD HH:mm:00',
            startDate: moment(sysTime).subtract(2, 'hours').format('YYYY-MM-DD HH:mm:00'),
            endDate: moment(sysTime).format('YYYY-MM-DD HH:mm:00'),
            maxDate: moment(sysTime).format('YYYY-MM-DD HH:mm:00'),

            showWeekNumbers: false,
            timePicker: true,
            timePickerIncrement: 1,
            timePicker12Hour: false,
            opens: 'left',
            drops: 'down',
            buttonClasses: ['btn'],
            applyClass: 'time_box_btn',
            cancelClass: 'time_box_btn',
            separator: ' to ',
            locale: {
                applyLabel: '提交',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '到',
                firstDay: 1
            }
        },
        function (start, end, label) {
            $('#top_bar button.time-tag-active').removeClass('time-tag-active');
            var beginTime = start.format('YYYY-MM-DD HH:mm:00');
            var endTime = end.format('YYYY-MM-DD HH:mm:00');
            getStatInfo(beginTime, endTime);
            if ($('[data-click=time]').length > 0) {
                $('#time').html(start.format('YYYY-MM-DD') + '-' + end.format('YYYY-MM-DD'));
            }
            else {
                $('#retain_condition').prepend('<div class="retain_tag"><span class="retain_tag_close" data-click="time"><i class="fa fa-times"></i></span><span id="time">' + start.format('YYYY-MM-DD HH:mm:00') + ' - ' + end.format('YYYY-MM-DD HH:mm:00') + '</span></div>');
            }
            $('[data-info=time]').text(start.format('MM-DD') + '到' + end.format('MM-DD')); // 显示哪天的数据
            $('[data-click=time]').on('click', function () {
                $(this).parent().remove();
                $('#top_bar button[tag="2"]').trigger('click');
            });
        });
    // 日期快捷按钮获得数据
    $('#top_bar button').on('click', function () {
        $('[data-click=time]').parent().remove();
        $('#top_bar button.time-tag-active').removeClass('time-tag-active');
        var tag = $(this).addClass('time-tag-active').attr('tag');
        var beginTime = null;
        var endTime = null;
        switch (tag) {
            case '2': // 今天
                beginTime = moment(sysTime).startOf('day').format('l');
                endTime = moment(sysTime).endOf('day').format('l');
                break;
            case '1': // 昨天
                beginTime = moment(sysTime).subtract(1, 'days').startOf('day').format('l');
                endTime = moment(sysTime).subtract(1, 'days').endOf('day').format('l');
                break;
            case '7': // 前7天
                beginTime = moment(sysTime).subtract(7, 'days').startOf('day').format('l');
                endTime = moment(sysTime).subtract(1, 'days').endOf('day').format('l');
                break;
            case '14': // 前14天
                beginTime = moment(sysTime).subtract(14, 'days').startOf('day').format('l');
                endTime = moment(sysTime).subtract(1, 'days').endOf('day').format('l');
                break;
            case '28': // 前28天
                beginTime = moment(sysTime).subtract(28, 'days').startOf('day').format('l');
                endTime = moment(sysTime).subtract(1, 'days').endOf('day').format('l');
                break;
            case 'all': // 活动周期
                beginTime = $activityId.find('option:selected').data('time');
                endTime = moment(sysTime).endOf('day').format('l');
                break;
        }
        getStatInfo(beginTime, endTime);
        getList(beginTime, endTime);
        $('[data-info=time]').text($(this).text()); // 显示哪天的数据
    });
    // 初始显示今天的数据

    if ($activityId.val() === '-1') {
        store.remove('activityStatId');
        return;
    }
    store.get('activityStatId') && $activityId.val(store.get('activityStatId'));
    $('#top_bar button[tag="2"]').trigger('click');
});
