/**
 *@file 设备
 */
var present = {
    getOption: function (data, other) {
        option = {
            tooltip: {
                show: false
                /*trigger: 'item',
                 formatter: "{a} <br/>{b}: {c} ({d}%)"*/
            },
            /*legend: {
             x: 'center',
             data:[data.label,'其它']
             },*/
            series: [
                {
                    name: '操作系统',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    silent: true, // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                    data: [
                        {value: data.amount, name: data.label},
                        {value: other, name: '其它'}
                    ]
                }
            ]
        };
        return option;
    }
};
var device = {
    arrObj2arr: function (obj, name) {
        var newArr = [];
        $.each(obj, function (i, v) {
            newArr.push(v[name]);
        });
        return newArr;
    },
    getOption: function (data, title) {
        var option = {
            /*title: {
             text: title,
             // subtext: '数据来自 成聚移动'
             },*/
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var res = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        var present = i === 1 ? '%' : '';
                        res += '<br/><span style="display:inline-block;margin-right:5px;'
                            + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ' : ' + params[i].value + present;
                    }
                    return res;
                }
            },
            legend: {
                data: ['数量', '占比']
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
                data: this.arrObj2arr(data, 'device')
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: this.arrObj2arr(data, 'uv')
                },
                {
                    name: '占比',
                    type: 'bar',
                    data: this.arrObj2arr(data, 'rate')
                }
            ]
        };
        return option;
    }
};

$(function () {
    var $getTraceId = $('#getTraceId');
    if ($getTraceId.val() === '-1') {
        store.remove('traceId');

        return;
    }
    if (store.get('traceId')) {
        $getTraceId.val(store.get('traceId'));
    }

    function getStatInfo(b, e, t) {
        var $beginTime = $('[name="daterangepicker_start"]');
        var $endTime = $('[name="daterangepicker_end"]');
        var dateReg = /(\d{2}|\d{4})(?:\-)?([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)?([0-2]{1}\d{1}|[3]{1}[0-1]{1})(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1})(?::)?([0-5]{1}\d{1})(?::)?([0-5]{1}\d{1})/;
        $('.panel-body-loader').removeClass('hide');
        t = t || $getTraceId.val();
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
        var params = {
            beginTime: b,
            endTime: e,
            traceId: t
        };
        // 百分比
        $.ajax({
            url: '/data/device/os?' + $.param(params),
            type: 'GET',
            success: function (data) {
                if (data.code === 1) {
                    $('.os .panel-body-loader').addClass('hide');
                    if (data.context.yUV.length > 0) {
                        var yUV = data.context.yUV;
                        var $present = $('#present');
                        $present.html(tmpl('template_present', data.context));
                        $.each(yUV, function (i, v) {
                            var other = data.context.totalUV - v.amount;
                            var pieChart = echarts.init(document.getElementById(v.label), {color: ['#6abae8', '#e1e1e1']});
                            pieChart.setOption(present.getOption(data.context.yUV[i], other));
                            $(window).resize(function () {
                                throttle(pieChart.resize, window);
                            });
                        });
                    }
                    else {
                        $('#present').html('暂无数据');
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
        // 柱形图
        $.ajax({
            url: '/data/device/pv/rate?' + $.param(params),
            type: 'GET',
            success: function (data) {
                if (data.code === 1) {
                    $('.rate .panel-body-loader').addClass('hide');
                    if (data.context.yAndroid.length > 0) {
                        var android = echarts.init(document.getElementById('android'), theme);
                        android.setOption(device.getOption(data.context.yAndroid, '安卓设备'));
                        $(window).resize(function () {
                            throttle(android.resize, window);
                        });
                    }
                    else {
                        $('#android').html('暂无数据');
                    }
                    if (data.context.yIOS.length > 0) {
                        var ios = echarts.init(document.getElementById('ios'), theme);
                        ios.setOption(device.getOption(data.context.yIOS, '苹果设备'));
                        $(window).resize(function () {
                            throttle(ios.resize, window);
                        });
                    }
                    else {
                        $('#ios').html('暂无数据');
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
            $('[data-click=time]').on('click', function () {
                $(this).parent().remove();
                $('#top_bar button[tag="2"]').trigger('click');
            });
        });

    // 活动列表改变时获得数据
    $getTraceId.on('change', function () {
        store.set('traceId', $getTraceId.val());
        if ($('#top_bar button.time-tag-active').length > 0) {
            $('#top_bar button.time-tag-active').trigger('click');
        }
        else {
            getStatInfo();
        }
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
                beginTime = $getTraceId.find('option:selected').data('time') + ' 00:00:00';
                endTime = moment(sysTime).endOf('day').format('l');
                break;
        }
        getStatInfo(beginTime, endTime);
    });
    // 初始显示今天的数据
    $('#top_bar button[tag="2"]').trigger('click');
});

