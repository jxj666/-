/**
 * @file 页面浏览量
 */
$(function () {
    $('#filtrate_btn').on('click', function (e) {
        e.stopPropagation();
        if (!$(this).hasClass('open')) {
            $('.filtrate').show();
            $(this).addClass('open');
        }
        else {
            $('.filtrate').hide();
            $(this).removeClass('open');
        }
    });

    $('#type').on('click', function (e) {
        e.stopPropagation();
    })

    $('#type_value').on('click', function (e) {
        e.stopPropagation();
    })

    var second = '';
    $('#type').change(function () {
        var _value = $(this).children('option:selected').val();
        second = $(this).children('option:selected').text();
        if (_value == 'all') {
            $('#type_value').html('<option value="all">全部</option>');
        } else {
            $.ajax({
                type: 'GET',
                url: '/data/condition',
                data: {type: _value},
                success: function (res) {
                    var html = '';
                    if (res.code == 1) {
                        for (var i in res.context) {
                            html += '<option value=' + res.context[i] + '>' + i + '</option>'
                        }
                        $('#type_value').html(html);
                    } else {
                        $('#type_value').html('<option value="all">全部</option>');
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
            })
        }
    });

    $('#clear').on('click', function (e) {
        e.stopPropagation();
        $("#type option[value='all']").attr("selected", true);
        $('#type_value').html('<option value="all">全部</option>');
    });

    $('#save').on('click', function () {
        $('.filtrate').hide();
        $('#filtrate_btn').removeClass('open');
        if ($("#type").children('option:selected').val() == 'all') {
            data.type = '';
            data.value = '';
        } else {
            data.type = $("#type option:selected").val();
            data.value = $("#type_value option:selected").val();
            if ($('[data-click=condition]').length > 0) {
                $('#condition').html(second + ':' + data.value);
            } else {
                $('#retain_condition').prepend('<div class="retain_tag"><span class="retain_tag_close" data-click="condition"><i class="fa fa-times"></i></span><span id="condition">' + second + ':' + data.value + '</span></div>');
            }
            $('[data-click=condition]').on('click', function () {
                $(this).parent().remove();
                data.type = '';
                data.value = '';
                getData()
            });
        }
        getData();
    });


    var traceId = $("#getTraceId option:selected").val();
    if (traceId === '-1') {
        store.remove('traceId');
        return;
    }
    if (store.get('traceId')) {
        traceId = store.get('traceId');
        $('#getTraceId').val(traceId);
    }
    var project_b_time = $("#getTraceId option:selected").data('time');
    var systemTime = $('.page-header').data('time');
    var now = moment(systemTime).format('YYYY-MM-DD');
    var perNow = moment(systemTime).subtract(1, 'days').format('YYYY-MM-DD');

    $('.muted').html(now);
    var data = {
        beginTime: now + ' 00:00:00',
        endTime: now + ' 23:59:59',
        traceId: traceId,
        perBeginTime: perNow + ' 00:00:00',
        perEndTime: perNow + ' 23:59:59'
    };

    $('#getTraceId').change(function () {
        var _value = $(this).children('option:selected').val();
        project_b_time = $(this).children('option:selected').data('time');
        if ($('#top_bar .time-tag-active').attr('tag') == 'all') {
            $('.muted').html(project_b_time + '-' + now);
            data.beginTime = project_b_time + ' 00:00:00';
        }
        traceId = _value;
        data.traceId = _value;
        getData();
        getTotle();
        store.set('traceId', _value);
    });

    var pageNumData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var time = params[0].name ? params[0].name : params[1].name;

                var res = time + ':00 - ' + time.split(':')[0] + ':59:59';
                for (var i = 0, l = params.length; i < l; i++) {
                    params[i].value = params[i].value ? params[i].value : '';
                    res += '<br/><span style="display:inline-block;margin-right:5px;'
                        + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ' : ' + params[i].value;
                }
                return res;
            }
        },
        legend: {
            data: ['本周期数据趋势', '与上周期的趋势对比']
        },

        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [

            {
                name: '本周期数据趋势',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 2
            },
            {
                name: '与上周期的趋势对比',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 1
            }
        ]
    };


    var jumpData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var time = params[0].name ? params[0].name : params[1].name;

                var res = time + ':00 - ' + time.split(':')[0] + ':59:59';
                for (var i = 0, l = params.length; i < l; i++) {
                    res += '<br/><span style="display:inline-block;margin-right:5px;'
                        + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ' : ' + params[i].value;
                }
                return res;
            }
        },

        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [

            {
                name: '本周期数据趋势',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var deepData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var time = params[0].name ? params[0].name : params[1].name;

                var res = time + ':00 - ' + time.split(':')[0] + ':59:59';
                for (var i = 0, l = params.length; i < l; i++) {
                    res += '<br/><span style="display:inline-block;margin-right:5px;'
                        + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ' : ' + params[i].value;
                }
                return res;
            }
        },

        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '本周期数据趋势',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var timeData = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },

        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '高峰时间段PV数趋势',
                type: 'bar',
                barWidth: '60%',
                data: []
            }
        ]
    };


//切换时间
    $('#top_bar').on('click', function (e) {
        for (var i = 0; i < $('#top_bar').find('button').length; i++) {
            $('#top_bar').find('button').eq(i).removeClass('time-tag-active');
        }

        $('[data-click=time]').parent().remove();

        $(e.target).addClass('time-tag-active');

        var beginTime = null;
        var endTime = null;
        var perBegin = null;
        var perEnd = null;
        switch ($(e.target).attr('tag')) {
            case '2': // 今天
                beginTime = moment(systemTime).startOf('day').format('l');
                endTime = moment(systemTime).endOf('day').format('l');
                perBegin = moment(systemTime).subtract(1, 'days').startOf('day').format('l');
                perEnd = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                $('.muted').html(now);
                break;
            case '1': // 昨天
                beginTime = moment(systemTime).subtract(1, 'days').startOf('day').format('l');
                endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                perBegin = moment(systemTime).subtract(2, 'days').startOf('day').format('l');
                perEnd = moment(systemTime).subtract(2, 'days').endOf('day').format('l');
                $('.muted').html(moment(systemTime).subtract(1, 'days').startOf('day').format('YYYY-MM-DD'));
                break;
            case '7': // 前7天
                beginTime = moment(systemTime).subtract(7, 'days').startOf('day').format('l');
                endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                perBegin = moment(systemTime).subtract(14, 'days').startOf('day').format('l');
                perEnd = moment(systemTime).subtract(8, 'days').endOf('day').format('l');

                $('.muted').html(moment(systemTime).subtract(7, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));
                break;
            case '14': // 前14天
                beginTime = moment(systemTime).subtract(14, 'days').startOf('day').format('l');
                endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                perBegin = moment(systemTime).subtract(28, 'days').startOf('day').format('l');
                perEnd = moment(systemTime).subtract(15, 'days').endOf('day').format('l');
                $('.muted').html(moment(systemTime).subtract(14, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));

                break;
            case '28': // 前28天
                beginTime = moment(systemTime).subtract(28, 'days').startOf('day').format('l');
                endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                perBegin = moment(systemTime).subtract(56, 'days').startOf('day').format('l');
                perEnd = moment(systemTime).subtract(29, 'days').endOf('day').format('l');
                $('.muted').html(moment(systemTime).subtract(28, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));
                break;
            case 'all': // 活动周期
                beginTime = project_b_time + ' 00:00:00';
                endTime = moment(systemTime).endOf('day').format('l');
                perBegin = '';
                perEnd = '';
                $('.muted').html(project_b_time + '-' + now);
                break;
        }

        data.beginTime = beginTime;
        data.endTime = endTime;
        data.perBeginTime = perBegin;
        data.perEndTime = perEnd;
        getData();
    })

    function getTotle() {
        $.ajax({
            type: 'GET',
            url: '/data/pv/hour',
            data: {
                beginTime: project_b_time + ' 00:00:00',
                endTime: now + ' 23:59:59',
                traceId: traceId,
                perBeginTime: '',
                perEndTime: ''
            },
            success: function (res) {
                if (res.code == 1) {
                    $('#totle').html(res.context.yTotalPV);
                } else {
                    alert(res.message)
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


    function getData() {
        $.ajax({
            type: 'GET',
            url: '/data/pv/hour',
            data: data,
            success: function (res) {
                if (res.code == 1) {
                    pageNumData.xAxis[0].data = res.context.x;
                    pageNumData.series[0].data = res.context.yPV;
                    pageNumData.series[1].data = res.context.yPerPV;

                    if (res.context.yHBPV.length > 0) {
                        $('#pageTotle').show();
                        $('#pageTotle .totle').html(res.context.yHBPV[0]);
                        $('#pageTotle .hb').html(res.context.yHBPV[1] + '%')
                    } else {
                        $('#pageTotle').show();
                        $('#pageTotle .totle').html(res.context.yTotalPV);
                        $('#pageTotle .hb').html('')
                    }

                    if (res.context.x.length > 0) {
                        page(true);
                    } else {
                        page(false);
                    }
                } else {
                    alert(res.message)
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
            url: '/data/user/pvcal/trend',
            data: data,
            success: function (res) {

                if (res.code == 1) {
                    deepData.xAxis[0].data = res.context.x;
                    deepData.series[0].data = res.context.yDeep;

                    jumpData.xAxis[0].data = res.context.x;
                    jumpData.series[0].data = res.context.yJump;


                    if (res.context.yHBDeep.length > 0) {
                        $('#deepTotle').show();
                        $('#deepTotle .totle').html(res.context.yHBDeep[0]);
                        $('#deepTotle .hb').html(res.context.yHBDeep[1] + '%');
                    } else {
                        $('#deepTotle').hide()
                    }

                    if (res.context.yHBJump.length > 0) {
                        $('#jumpTotle').show();
                        $('#jumpTotle .totle').html(res.context.yHBJump[0]);
                        $('#jumpTotle .hb').html(res.context.yHBJump[1] + '%');
                    } else {
                        $('#jumpTotle').hide()
                    }

                    if (res.context.x.length > 0) {
                        handleGraph(true);
                    } else {
                        handleGraph(false);
                    }
                } else {
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

        $.ajax({
            type: 'GET',
            url: '/data/pv/persist',
            data: data,
            success: function (res) {

                if (res.code == 1) {
                    timeData.xAxis[0].data = res.context.x;
                    timeData.series[0].data = res.context.yPV;

                    if (res.context.yHBPV.length > 0) {
                        $('#timeTotle').show();
                        $('#timeTotle .totle').html(res.context.yHBPV[0]);
                        $('#timeTotle .hb').html(res.context.yHBPV[1] + '%');
                    } else {
                        $('#timeTotle').hide()
                    }

                    if (res.context.x.length > 0) {
                        handTime(true);
                    } else {
                        handTime(false);
                    }
                } else {
                    alert(res.message)
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

    getData();
    getTotle();


//获取时间段
    function time(val) {
        if (val) {
            var begin = systemTime - parseInt(val) * 24 * 3600 * 1000;
            var beginTime = new Date(begin).getFullYear() + '-' + (new Date(begin).getMonth() + 1) + '-' + new Date(begin).getDate();
            return beginTime;
        }
    }


    function handleGraph(val) {

        var w = $('#jump').parent().width();
        var h = 0.6 * w;
        $('#jump').html('').css('width', w + 'px');
        $('#jump').css('height', '295px');
        $('#deep').html('').css('width', w + 'px');
        $('#deep').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('jump'), theme);
            myChart.setOption(jumpData);

            var myChart1 = echarts.init(document.getElementById('deep'), theme);
            myChart1.setOption(deepData);
            $(window).resize(function () {
                throttle(myChart.resize, window);
                throttle(myChart1.resize, window);
            });
        } else {
            $('#jump').html('暂无数据');
            $('#deep').html('暂无数据')
        }


    };


    function page(val) {
        var w = $('#page-num').parent().width();
        var h = 0.6 * w;
        $('#page-num').html('').css('width', w + 'px');
        $('#page-num').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('page-num'), theme);
            myChart.setOption(pageNumData);
            $(window).resize(function () {
                throttle(myChart.resize, window);
            });
        } else {
            $('#page-num').html('暂无数据');
        }


    }

    function handTime(val) {
        var w = $('#time').parent().width();
        var h = 0.6 * w;
        $('#time').html('').css('width', w + 'px');
        $('#time').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('time'), theme);
            myChart.setOption(timeData);
            $(window).resize(function () {
                throttle(myChart.resize, window);
            });
        } else {
            $('#time').html('暂无数据');
        }


    }


    $('#advance-daterange').daterangepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        startDate: moment(systemTime).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(systemTime).format('YYYY-MM-DD HH:mm:ss'),
        maxDate: moment(systemTime).format('YYYY-MM-DD HH:mm:ss'),

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
    }, function (start, end, label) {

        for (var i = 0; i < $('#top_bar').find('button').length; i++) {
            $('#top_bar').find('button').eq(i).removeClass('time-tag-active');
        }

        if ($('[data-click=time]').length > 0) {
            $('#time_span').html(start.format('YYYY-MM-DD') + '-' + end.format('YYYY-MM-DD'));
        } else {
            $('#retain_condition').prepend('<div class="retain_tag"><span class="retain_tag_close" data-click="time"><i class="fa fa-times"></i></span><span id="time_span">' + start.format('YYYY-MM-DD HH:mm:00') + ' - ' + end.format('YYYY-MM-DD HH:mm:00') + '</span></div>')
        }

        $('[data-click=time]').on('click', function () {
            $('#top_bar').find('button').eq(0).addClass('time-tag-active');
            $(this).parent().remove();
            data.beginTime = now + ' 00:00:00';
            data.endTime = now + ' 23:59:59';
            data.perBeginTime = perNow + ' 00:00:00';
            data.perEndTime = perNow + ' 23:59:59';
            getData()
        });

        var s1 = start.format('YYYY-MM-DD HH:mm:00');

        var s2 = end.format('YYYY-MM-DD HH:mm:00');
        data.beginTime = s1;
        data.endTime = s2;

        var num = DateDiff(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        if (num > 0) {
            $('.muted').html(s1 + ' - ' + s2);
        } else {
            $('.muted').html(s1);
        }

        var per_start = moment(s1).subtract((num + 1), 'days').format('YYYY-MM-DD HH:mm:00');
        var per_end = moment(s2).subtract((num + 1), 'days').format('YYYY-MM-DD HH:mm:00');

        data.perBeginTime = per_start;
        data.perEndTime = per_end;

        getData()

    });


    function DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
        var aDate, oDate1, oDate2, iDays
        aDate = sDate1.split("-")
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式
        aDate = sDate2.split("-")
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
        return iDays
    }

    $(document).bind('click', function () {
        $('.filtrate').hide();
        $('#filtrate_btn').removeClass('open');
    });
})