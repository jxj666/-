if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. 将O赋值为调用map方法的数组.
        var O = Object(this);

        // 2.将len赋值为数组O的长度.
        var len = O.length >>> 0;

        // 3.如果callback不是函数,则抛出TypeError异常.
        if (Object.prototype.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 4. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 5. 创建新数组A,长度为原数组O长度len
        A = new Array(len);

        // 6. 将k赋值为0
        k = 0;

        // 7. 当 k < len 时,执行循环.
        while (k < len) {

            var kValue, mappedValue;

            //遍历O,k为原数组索引
            if (k in O) {

                //kValue为索引k对应的值.
                kValue = O[k];

                // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
                mappedValue = callback.call(T, kValue, k, O);

                // 返回值添加到新数组A中.
                A[k] = mappedValue;
            }
            // k自增1
            k++;
        }

        // 8. 返回新数组A
        return A;
    };
}
var line = {
    getOption: function (data, name, present) {
        present = present || '';
        var option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['本周期数据趋势' + present, '与上周期的趋势对比' + present]
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
                    name: '本周期数据趋势' + present,
                    type: 'line',
                    smooth: true,
                    areaStyle: {normal: {}},
                    data: data['y' + name],
                    z: 2
                },
                {
                    name: '与上周期的趋势对比' + present,
                    type: 'line',
                    smooth: true,
                    areaStyle: {normal: {}},
                    data: data['yPer' + name],
                    z: 1
                }
            ]
        };
        return option;
    }
};
var top10 = {
    getOption: function getOption(data) {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: data.x
            },
            series: [
                {
                    name: '访问用户省市分布前10名',
                    type: 'bar',
                    data: data.yQuantityInc
                }
            ]
        };
        return option;
    }
};
var area = {
    getOption: function getOption(data) {
        var option = {
            tooltip: {
                trigger: 'item'
            },
            visualMap: {
                min: 0,
                max: parseInt(data[0].quantityInc) + 10,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],           // 文本，默认为数值文本
                calculable: true,
                color: ['#d94e5d', '#eac736', '#50a3ba']
            },
            series: [
                {
                    name: '地域分布',
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    data: data.map(function (obj, i) {
                        obj.name = obj.province;
                        obj.value = obj.quantityInc;
                        return obj;
                    })
                }
            ]
        };
        return option;
    }
};
function throttle(method, context) {
    clearTimeout(method.timer);
    method.timer = window.setTimeout(function () {
        method.call(context);
    }, 300);
}
var $getBatches = $('#getBatches');
// 加载下部数据
function getStatInfo(b, perB, e, perE, t) {
    t = t || $getBatches.val();
    if (t === '-1') {
        return;
    }
    $('.panel-body-loader').removeClass('hide');
    var $endTime = $('[name="daterangepicker_end"]');
    var $beginTime = $('[name="daterangepicker_start"]');
    b = b || $beginTime.val();
    e = e || $endTime.val();
    var dateReg = /(\d{2}|\d{4})(?:\-)?([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)?([0-2]{1}\d{1}|[3]{1}[0-1]{1})(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1})(?::)?([0-5]{1}\d{1})(?::)?([0-5]{1}\d{1})/;
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
    // 趋势
    $.ajax({
        url: '/qrmgr/data/times',
        type: 'GET',
        data: {
            batchNo: t,
            beginTime: b,
            endTime: e,
            perBeginTime: perB,
            perEndTime: perE
        },
        success: function (data) {
            if (data.code === 1) {
                $('.times .panel-body-loader').addClass('hide');
                // 扫码率
                if (data.context.yRateTotal.length > 0 || data.context.yPerRateTotal) {
                    var rateChart = echarts.init(document.getElementById('rate'), theme);
                    rateChart.setOption(line.getOption(data.context, 'RateTotal', '%'));
                    $(window).resize(function () {
                        throttle(rateChart.resize, window);
                    });
                }
                else {
                    $('#rate').html('暂无数据');
                }
                if (data.context.yRateInc.length > 0 || data.context.yPeryRateInc) {
                    var rateIncChart = echarts.init(document.getElementById('rateInc'), theme);
                    rateIncChart.setOption(line.getOption(data.context, 'RateInc', '%'));
                    $(window).resize(function () {
                        throttle(rateIncChart.resize, window);
                    });
                }
                else {
                    $('#rateInc').html('暂无数据');
                }
                // 扫码次数
                if (data.context.yTimesTotal.length > 0 || data.context.yPerTimesTotal) {
                    var timesChart = echarts.init(document.getElementById('times'), theme);
                    timesChart.setOption(line.getOption(data.context, 'TimesTotal'));
                    $(window).resize(function () {
                        throttle(timesChart.resize, window);
                    });
                }
                else {
                    $('#times').html('暂无数据');
                }
                if (data.context.yTimesInc.length > 0 || data.context.yPerTimesInc) {
                    var timesIncChart = echarts.init(document.getElementById('timesInc'), theme);
                    timesIncChart.setOption(line.getOption(data.context, 'TimesInc'));
                    $(window).resize(function () {
                        throttle(timesIncChart.resize, window);
                    });
                }
                else {
                    $('#timesInc').html('暂无数据');
                }
                // 扫码用户数
                if (data.context.yUsersTotal.length > 0 || data.context.yPerUsersTotal) {
                    var usersChart = echarts.init(document.getElementById('users'), theme);
                    usersChart.setOption(line.getOption(data.context, 'UsersTotal'));
                    $(window).resize(function () {
                        throttle(usersChart.resize, window);
                    });
                }
                else {
                    $('#users').html('暂无数据');
                }
                if (data.context.yUsersInc.length > 0 || data.context.yPerUsersInc) {
                    var usersIncChart = echarts.init(document.getElementById('usersInc'), theme);
                    usersIncChart.setOption(line.getOption(data.context, 'UsersInc'));
                    $(window).resize(function () {
                        throttle(usersIncChart.resize, window);
                    });
                }
                else {
                    $('#usersInc').html('暂无数据');
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
    // top10
    $.ajax({
        url: '/qrmgr/data/province/topn',
        type: 'GET',
        data: {
            batchNo: t,
            beginTime: b,
            endTime: e
        },
        success: function (data) {
            if (data.code === 1) {
                $('.topn .panel-body-loader').addClass('hide');
                if (data.context.yQuantityInc.length > 0) {
                    var cityTopChart = echarts.init(document.getElementById('cityTop'), theme);
                    cityTopChart.setOption(top10.getOption(data.context));
                    $(window).resize(function () {
                        throttle(cityTopChart.resize, window);
                    });
                }
                else {
                    $('#cityTop').html('暂无数据');
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

    $.ajax({
        type: 'GET',
        url: '/qrmgr/data/province/area',
        data: {
            batchNo: t,
            beginTime: b,
            endTime: e
        },
        success: function (data) {
            if (data.code === 1) {
                $('.area .panel-body-loader').addClass('hide');
                if (data.context.length > 0) {
                    // 地图
                    var cityMapChart = echarts.init(document.getElementById('cityMap'), theme);
                    cityMapChart.setOption(area.getOption(data.context));
                    $(window).resize(function () {
                        throttle(cityMapChart.resize, window);
                    });
                    // 详情
                    $('#listInfo').html(tmpl('template_listInfo', data));
                }
                else {
                    $('#cityMap').html('暂无数据');
                    $('#listInfo').html('<tr><td colspan="5">暂无数据</td>');
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
// 加载标题数据
function getList(t) {
    t = t || $getBatches.val();
    if (t === '-1') {
        $('#project_data').html('<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>');
        return;
    }
    // 标题
    $.ajax({
        url: '/qrmgr/data/summary',
        type: 'GET',
        data: {
            batchNo: t
        },
        success: function (data) {
            if (data.code === 1) {
                $('#project_data').html(tmpl('template_datalist', data.context));
                $('[data-info=summarySize]').html(data.context.size);
            }
            else {
                $('#project_data').html('<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>');
                $('[data-info=summarySize]').html('');
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

$('#advance-daterange').daterangepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        startDate: moment(sysTime).subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(sysTime).format('YYYY-MM-DD HH:mm:ss'),
        maxDate: moment(sysTime).format('YYYY-MM-DD HH:mm:ss'),

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
        // var diff = end - start;
        var beginTime = start.format('YYYY-MM-DD HH:mm:ss');
        // var perBeginTime = moment(start).subtract(28, 'days').format('YYYY-MM-DD HH:mm:ss');
        var endTime = end.format('YYYY-MM-DD HH:mm:ss');
        // var perEndTime = moment(start).subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
        getStatInfo(beginTime, null, endTime, null);
        if ($('[data-click=time]').length > 0) {
            $('#time').html(start.format('YYYY-MM-DD') + '-' + end.format('YYYY-MM-DD'));
        }
        else {
            $('#retain_condition').prepend('<div class="retain_tag"><span class="retain_tag_close" data-click="time"><i class="fa fa-times"></i></span><span id="time">' + start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss') + '</span></div>')
        }
        $('[data-click=time]').on('click', function () {
            $(this).parent().remove();
            $('#top_bar button[tag="2"]').trigger('click');
        });
    });

// 活动列表改变时获得数据
$getBatches.on('change', function () {
    if ($('#top_bar button.time-tag-active').length > 0) {
        $('#top_bar button.time-tag-active').trigger('click');
    }
    else {
        getStatInfo();
    }
    getList();
    window.sessionStorage.setItem('batch', $getBatches.val());
});
// 日期快捷按钮获得数据
$('#top_bar button').on('click', function () {
    $('[data-click=time]').parent().remove();
    $('#top_bar button.time-tag-active').removeClass('time-tag-active');
    var tag = $(this).addClass('time-tag-active').attr('tag');
    var beginTime = null;
    var perBeginTime = null;
    var endTime = null;
    var perEndTime = null;
    switch (tag) {
        case '2': // 今天
            beginTime = moment(sysTime).startOf('day').format('l');
            perBeginTime = moment(sysTime).subtract(1, 'days').startOf('day').format('l');
            endTime = moment(sysTime).endOf('day').format('l');
            perEndTime = moment(sysTime).subtract(1, 'days').endOf('day').format('l');
            break;
        case '1': // 昨天
            beginTime = moment(sysTime).subtract(1, 'days').startOf('day').format('l');
            perBeginTime = moment(sysTime).subtract(2, 'days').startOf('day').format('l');
            endTime = moment(sysTime).subtract(1, 'days').endOf('day').format('l');
            perEndTime = moment(sysTime).subtract(2, 'days').endOf('day').format('l');
            break;
        case '7': // 前7天
            beginTime = moment(sysTime).subtract(7, 'days').startOf('day').format('l');
            perBeginTime = moment(sysTime).subtract(14, 'days').startOf('day').format('l');
            endTime = moment(sysTime).subtract(1, 'days').endOf('day').format('l');
            perEndTime = moment(sysTime).subtract(8, 'days').endOf('day').format('l');
            break;
        case '14': // 前14天
            beginTime = moment(sysTime).subtract(14, 'days').startOf('day').format('l');
            perBeginTime = moment(sysTime).subtract(28, 'days').startOf('day').format('l');
            endTime = moment(sysTime).subtract(1, 'days').endOf('day').format('l');
            perEndTime = moment(sysTime).subtract(15, 'days').endOf('day').format('l');
            break;
        case '28': // 前28天
            beginTime = moment(sysTime).subtract(28, 'days').startOf('day').format('l');
            perBeginTime = moment(sysTime).subtract(56, 'days').startOf('day').format('l');
            endTime = moment(sysTime).subtract(1, 'days').endOf('day').format('l');
            perEndTime = moment(sysTime).subtract(29, 'days').endOf('day').format('l');
            break;
        case 'all': // 活动周期
            beginTime = $getBatches.find('option:selected').data('time');
            endTime = moment(sysTime).endOf('day').format('l');
            break;
    }
    getStatInfo(beginTime, perBeginTime, endTime, perEndTime);
});
$(function () {
    // 批次列表
    $.ajax({
        url: '/qrmgr/batches',
        type: 'GET',
        success: function (data) {
            if (data.code === 1) {
                $getBatches.html(tmpl('template_batches', data.context));
                if ($getBatches.val() === '-1') {
                    window.sessionStorage.removeItem('batch');
                    return;
                }
                window.sessionStorage.getItem('batch') && $getBatches.val(window.sessionStorage.getItem('batch'));
                $('.selectpicker').selectpicker('refresh');
                // 初始显示今天的数据
                getList();
                $('#top_bar button[tag="2"]').trigger('click');
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
