$(function () {

    var traceId = $("#getTraceId option:selected").val();
    if (traceId === '-1') {
        store.remove('traceId');
        return;
    }
    if (store.get('traceId')) {
        traceId = store.get('traceId');
        $("#getTraceId").val(traceId);
    }
    var systemTime = $('.page-header').data('time');
    var now = moment(systemTime).format('YYYY-MM-DD');
    var activityId = $("#getTraceId option:selected").data('act');
    $('.muted').html(now);
    var data = {beginTime: now + ' 00:00:00', endTime: now + ' 23:59:59', traceId: traceId};
    var data_activity = {
        beginTime: now + ' 00:00:00',
        endTime: now + ' 23:59:59',
        traceId: traceId,
        activityId: activityId
    };

    $('#getTraceId').change(function () {
        var _value = $(this).children('option:selected').val();
        traceId = _value;
        data.traceId = _value;
        data_activity.activityId = $(this).children('option:selected').data('act');
        activeList = [];
        $('#user-active').html('');
        getData();
        store.set('traceId', _value);
    });

    var totleData = {
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
            data: ['访问用户走势', '页面实时走势']
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
                name: '访问用户走势',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 2
            },
            {
                name: '页面实时走势',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 1
            }
        ]
    };

    var resourceData = {
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
            axisLabel: {
                show: false,
                inside: true
            },
            data: []
        },
        series: [
            {
                name: '活跃页面',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'insideLeft',
                        formatter: '{b}',
                        textStyle: {
                            color: '#888888'
                        }
                    }

                },
                data: []
            }
        ]
    };

    var slopeData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br /><span class="line_dot" style="background-color:#6ac1e8"></span>{a}:{c}%'

        },
        legend: {
            data: ['pv增长率走势']
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
                name: 'pv增长率走势',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var next_val = '';

    var activeList = [];

    var activityData = {
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
            data: ['活动发起数', '活动助力数']
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
                name: '活动发起数',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 2
            },
            {
                name: '活动助力数',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 1
            }
        ]
    };

    function getData() {
        $.ajax({
            type: 'GET',
            url: '/data/realtime/total',
            data: {traceId: traceId},
            success: function (res) {

                if (res.code == 1) {
                    $('#uvTotle').html(res.context.totalUV);
                    $('#pvTotle').html(res.context.totalPV);
                    $('#uv').html(res.context.UV);
                    $('#pv').html(res.context.PV);

                } else {
                    $('#uv').html('0');
                    $('#pv').html('0');
                    $('#uvTotle').html('0');
                    $('#pvTotle').html('0');
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
            url: '/data/realtime/tana',
            data: data,
            success: function (res) {

                if (res.code == 1) {
                    slopeData.xAxis[0].data = res.context.x;
                    slopeData.series[0].data = res.context.yTan;
                    if (res.context.x.length > 0) {
                        slope(true);
                    } else {
                        slope(false);
                    }
                } else {
                    alert(res.msg)
                }

            }
        });


        $.ajax({
            type: 'GET',
            url: '/data/realtime/pv',
            data: data,
            success: function (res) {

                if (res.code == 1) {
                    totleData.xAxis[0].data = res.context.x;
                    totleData.series[0].data = res.context.yUV;
                    totleData.series[1].data = res.context.yPV;

                    if (res.context.x.length > 0) {
                        handleGraph(true);
                    } else {
                        handleGraph(false);
                    }
                } else {
                    alert(res.msg)
                }
            }
        });

        if (data_activity.activityId) {
            $.ajax({
                type: 'GET',
                url: '/data/realtime/activity',
                data: data_activity,
                success: function (res) {

                    if (res.code == 1) {
                        activityData.xAxis[0].data = res.context.x;
                        activityData.series[0].data = res.context.yJoins;
                        activityData.series[1].data = res.context.yHelp;

                        if (res.context.x.length > 0) {
                            activityGraph(true);
                        } else {
                            activityGraph(false);
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
        }
        else {
            var w = $('#activity-trend').parent().width();
            $('#activity-trend').html('暂无数据').css('width', w + 'px');
            $('#activity-trend').css('height', '295px');
        }


        $.ajax({
            type: 'GET',
            url: '/data/realtime/detail',
            data: {traceId: traceId},
            success: function (res) {
                if (res.code == 1) {
                    if (res.context.length > 0) {
                        for (var i = 0; i < res.context.length; i++) {
                            activeList.push(res.context[i]);
                        }
                        if (next_val == '') {
                            appendList()
                        }
                        next_val = res.context[res.context.length - 1].statTime;
                    }
                    var t = setTimeout(getList, 60000);
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
            url: '/data/realtime/url',
            data: {traceId: traceId},
            success: function (res) {

                if (res.code == 1) {


                    resourceData.yAxis.data = res.context.x;
                    resourceData.series[0].data = res.context.yUV;

                    if (res.context.x.length > 0) {
                        resource(true);
                    } else {
                        resource(false);
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
    }

    getData();


    function getList() {
        var _data = {};
        if (next_val == '') {
            _data = {traceId: traceId}
        } else {
            _data = {traceId: traceId, beginTime: next_val}
        }
        $.ajax({
            type: 'GET',
            url: '/data/realtime/detail',
            data: _data,
            success: function (res) {
                if (res.code == 1) {
                    if (res.context.length > 0) {
                        for (var i = 0; i < res.context.length; i++) {
                            activeList.push(res.context[i]);
                        }
                        if (next_val == '') {
                            appendList()
                        }
                        next_val = res.context[res.context.length - 1].statTime;
                    }
                    var t = setTimeout(getList, 60000);

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
    }


    function appendList() {
        var html = '';
        if (activeList.length > 0) {
            var part = activeList[0].headimgurl ? ('<span class="active-user-img"><img src="' + activeList[0].headimgurl + '"></span><span class="active-user-name">' + activeList[0].nickname + '</span>') : ('<span class="active-user-name">' + activeList[0].guid + '</span>');
            html = '<div class="clearfix active-user-item"><span class="list_dot"></span>' + part + '<span class="pull-left">访问了</span><span class="active-url">' + activeList[0].url + '</span><span class="pull-right m-r-5">' + activeList[0].title + '</span></div>';
            $('#user-active').prepend(html);
            activeList.shift();
        }
        setTimeout(appendList, 6000);
    }

//获取时间段
    function time(val) {
        if (val) {
            var begin = systemTime - parseInt(val) * 24 * 3600 * 1000;
            var beginTime = new Date(begin).getFullYear() + '-' + (new Date(begin).getMonth() + 1) + '-' + new Date(begin).getDate();
            return beginTime;
        }
    }

    $('#user-active').css('width', ($('#user-active').parent().width() + 20) + 'px');
    $('.user-active-box').css('width', $('#user-active').parent().width() + 'px');


    function handleGraph(val) {

        var w = $('#totle').parent().width();
        $('#totle').html('').css('width', w + 'px');
        $('#totle').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('totle'), theme);
            myChart.setOption(totleData);
        } else {
            $('#totle').html('暂无数据');

        }

    }

    function activityGraph(val) {

        var w = $('#activity-trend').parent().width();
        $('#activity-trend').html('').css('width', w + 'px');
        $('#activity-trend').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('activity-trend'), theme);
            myChart.setOption(activityData);
        } else {
            $('#activity-trend').html('暂无数据');

        }

    }

    function slope(val) {

        var w = $('#slope').parent().width();
        $('#slope').html('').css('width', w + 'px');
        $('#slope').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('slope'), theme);
            myChart.setOption(slopeData);
        } else {
            $('#slope').html('暂无数据');

        }

    }


    function resource(val) {
        var w = $('#active').parent().width();
        $('#active').html('').css('width', w + 'px');
        $('#active').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('active'), theme);
            myChart.setOption(resourceData);
        } else {
            $('#active').html('暂无数据');
        }
    }


})
