/**
 * @file 用户访问量
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
    var second = '';
    $('#type').change(function (e) {
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


    $('#type').on('click', function (e) {
        e.stopPropagation();
    })

    $('#type_value').on('click', function (e) {
        e.stopPropagation();
    })

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
        $("#getTraceId").val(traceId);
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
        traceId = _value;
        data.traceId = _value;
        project_b_time = $(this).children('option:selected').data('time');
        if ($('#top_bar .time-tag-active').attr('tag') == 'all') {
            $('.muted').html(project_b_time + '-' + now);
            data.beginTime = project_b_time + ' 00:00:00';
        }

        getData();
        getTotle();
        store.set('traceId', traceId);

    });

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
                    $('#totle').html(res.context.yTotalUV);
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


    var newUserData = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow',
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
                name: '新用户增长趋势',
                type: 'bar',
                barWidth: '60%',
                data: []
            }
        ]
    };
    var uvData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            data: ['本周期数据趋势', '与上周期的趋势对比']
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var time = params[0].name ? params[0].name:params[1].name;

                var res = time + ':00 - ' + time.split(':')[0]+ ':59:59';
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

    var newUserRate = {
        tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
            {
                name: '数量',
                type: 'pie',
                hoverAnimation: false,
                radius: '55%',
                center: ['50%', '60%'],
                data: [],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }


    // 切换时间
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
        getData()
    })


    function getData() {
        $.ajax({
            type: 'GET',
            url: '/data/pv/hour',
            data: data,
            success: function (res) {

                if (res.code == 1) {

                    uvData.xAxis[0].data = res.context.x;
                    uvData.series[0].data = res.context.yUV;
                    uvData.series[1].data = res.context.yPerUV;

                    if (res.context.yHBUV.length > 0) {
                        $('#uvTotle').show();
                        $('#uvTotle .totle').html(res.context.yHBUV[0]);
                        $('#uvTotle .hb').html(res.context.yHBUV[1] + '%');
                    } else {
                        $('#uvTotle').show();
                        $('#uvTotle .totle').html(res.context.yTotalUV);
                        $('#uvTotle .hb').html('');
                    }

                    if (res.context.x.length > 0) {
                        handleGenerateGraph(true);
                    } else {
                        handleGenerateGraph(false);
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
            url: '/data/user/pvcal/trend',
            data: data,
            success: function (res) {

                if (res.code == 1) {
                    newUserData.xAxis[0].data = res.context.x;
                    newUserData.series[0].data = res.context.yNewusers;

                    if (res.context.yHBNewusers.length > 0) {
                        $('#newUserTotle').show();
                        $('#newUserTotle .totle').html(res.context.yHBNewusers[0]);
                        $('#newUserTotle .hb').html(res.context.yHBNewusers[1] + '%');
                    } else {
                        $('#newUserTotle').hide()
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
            url: '/data/user/newuserrate',
            data: data,
            success: function (res) {

                if (res.code == 1) {

                    newUserRate.series[0].data = [];
                    for (var i = 0; i < res.context.yNewer.length; i++) {
                        newUserRate.series[0].data.push({
                            name: res.context.yNewer[i].label,
                            value: res.context.yNewer[i].amount
                        });
                    }

                    if (res.context.yNewer.length > 0) {
                        userRate(true);
                    }
                    else {
                        userRate(false);
                    }
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

        $.ajax({
            type: 'GET',
            url: '/data/retain/trend/simple',
            data: data,
            success: function (res) {

                if (res.code == 1) {
                    var html = '';
                    for (var i = 0; i < res.context.yRetention.length; i++) {
                        html += '<tr><td>' + res.context.yRetention[i][0] + '</td><td>' + res.context.yRetention[i][1] + '</td><td>' + res.context.yRetention[i][2] + '</td><td>' + res.context.yRetention[i][3] + '</td><td>' + res.context.yRetention[i][4] + '</td><td>' + res.context.yRetention[i][5] + '</td></tr>'
                    }

                    $('#trend').html(html)
                }
                else {
                    $('#trend').html('');
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


    function handleGenerateGraph(val) {

        var w = $('#uv').parent().width();
        var h = 0.6 * w;
        $('#uv').html('').css('width', w + 'px');
        $('#uv').css('height', '295px');

        if (val) {
            var myChart1 = echarts.init(document.getElementById('uv'), theme);
            myChart1.setOption(uvData);
            $(window).resize(function () {
                throttle(myChart1.resize, window);
            });
        } else {
            $('#uv').html('暂无数据');
        }


    };


    function handleGraph(val) {

        var w = $('#newUser').parent().width();
        $('#newUser').html('').css('width', w + 'px');
        $('#newUser').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('newUser'), theme);
            myChart.setOption(newUserData);
            $(window).resize(function () {
                throttle(myChart.resize, window);
            });
        } else {
            $('#newUser').html('暂无数据');

        }


    };

    function userRate(val) {
        var w = $('#rate').parent().width();
        var h = 0.6 * w;
        $('#rate').html('').css('width', w + 'px');
        $('#rate').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('rate'), theme);
            myChart.setOption(newUserRate);
            $(window).resize(function () {
                throttle(myChart.resize, window);
            });
        } else {
            $('#rate').html('暂无数据');
        }

    };


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
            $('#time').html(start.format('YYYY-MM-DD') + '-' + end.format('YYYY-MM-DD'));
        } else {
            $('#retain_condition').prepend('<div class="retain_tag"><span class="retain_tag_close" data-click="time"><i class="fa fa-times"></i></span><span id="time">' + start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss') + '</span></div>')
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

        var s1 = start.format('YYYY-MM-DD HH:mm:ss');

        var s2 = end.format('YYYY-MM-DD HH:mm:ss');
        data.beginTime = s1;
        data.endTime = s2;

        var num = DateDiff(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        if (num > 0) {
            $('.muted').html(s1 + ' - ' + s2);
        } else {
            $('.muted').html(s1);
        }

        var per_start = moment(s1).subtract((num + 1), 'days').format('YYYY-MM-DD HH:mm:ss');
        var per_end = moment(s2).subtract((num + 1), 'days').format('YYYY-MM-DD HH:mm:ss');

        data.perBeginTime = per_start;
        data.perEndTime = per_end;

        getData();
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

    $(document).on('click', function () {
        $('.filtrate').hide();
        $('#filtrate_btn').removeClass('open');
    });
})
