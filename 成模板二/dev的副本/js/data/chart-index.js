/**
 * @file 数据概览
 */
$(function () {
    var traceId = $('#getTraceId').find('option:selected').val();
    if (traceId === '-1') {
        store.remove('traceId');
        return;
    }
    if (store.get('traceId')) {
        traceId = store.get('traceId');
        $('#getTraceId').val(traceId);
    }
    var project_b_time = $('#getTraceId').find('option:selected').data('time');
    var activityId = $('#getTraceId').find('option:selected').data('act');
    var appid = $('#getTraceId').find('option:selected').data('app');
    var systemTime = $('#getTraceId').data('time');
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
    var projiect_data = {
        beginTime: now + ' 00:00:00',
        endTime: now + ' 23:59:59',
        traceId: traceId,
        perBeginTime: perNow + ' 00:00:00',
        perEndTime: perNow + ' 23:59:59',
        activityId: activityId,
        appid: appid
    };
    var pvData = {
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
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
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
                type: 'value',
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
    var uvData = {
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
    var helpData = {
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
            data: ['助力数', '与上周期的对比趋势']
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
                name: '助力数',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 2
            },
            {
                name: '与上周期的对比趋势',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 1
            }
        ]
    };
    var joinData = {
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
            data: ['发起数', '与上周期的对比趋势']
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
                name: '发起数',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 2
            },
            {
                name: '与上周期的对比趋势',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 1
            }
        ]
    };
    var orderData = {
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
            data: ['支付数', '与上周期的对比趋势']
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
                name: '支付数',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 2
            },
            {
                name: '与上周期的对比趋势',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [],
                z: 1
            }
        ]
    };
    var toptimeData = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(106,186,232,.1)'
                }
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
    var cityTopData = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(106,186,232,.1)'
                }
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
            data: []
        },
        series: [
            {
                name: '访问用户省市分布前10名',
                type: 'bar',
                data: []
            }
        ]
    };
    var deepData = {
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
            data: ['页面访问深度', '与上周期的趋势对比']
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
                name: '页面访问深度',
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

    function getList(time, _traceId, _activityId, _appid) {
        $.ajax({
            type: 'GET',
            url: '/data/pv',
            data: {
                beginTime: time + ' 00:00:00',
                endTime: now + ' 23:59:59',
                traceId: _traceId,
                perBeginTime: '',
                perEndTime: '',
                activityId: _activityId,
                appid: _appid
            },
            success: function (res) {
                if (res.code === 1) {
                    var html = '';
                    html += '<td>' + res.context.yPV + '</td><td>' + res.context.yUV + '</td><td>' + res.context.yIP + '</td><td data-info="user-join">' + res.context.yUserJoin + '</td><td data-info="user-help">' + res.context.yHelp + '</td><td data-info="user-order">' + res.context.yOrders + '</td><td>' + res.context.yFans + '</td><td>' + res.context.yNewusers + '</td>';
                    $('#project_data').html(html);

                }
                else {
                    $('#project_data').html('<td>0</td><td>0</td><td>0</td><td data-info="user-join">0</td><td data-info="user-help">0</td><td data-info="user-order">0</td><td>0</td><td>0</td>');
                    alert(res.msg);
                }
                // 清掉pv 助力 订单记录
                !_activityId && $('[data-info=user-join],[data-info=user-help],[ data-info=user-order]').hide();

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

    function city(val) {
        var w = $('#city-top').parent().width();
        var h = 0.6 * w;
        $('#city-top').html('').css('width', w + 'px');
        $('#city-top').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('city-top'), theme);
            myChart.setOption(cityTopData);
            $(window).resize(function () {
                throttle(myChart.resize, window);
            });
        }
        else {
            $('#city-top').html('暂无数据');
        }
    }

    //获取时间段
    function time(val) {
        if (val) {
            var begin = systemTime - parseInt(val) * 24 * 3600 * 1000;
            var beginTime = new Date(begin).getFullYear() + '-' + (new Date(begin).getMonth() + 1) + '-' + new Date(begin).getDate();
            return beginTime;
        }
    }


    function handleGenerateGraph(val) {
        var w = $('#pv').parent().width();
        $('#pv').html('').css('width', w + 'px');
        $('#pv').css('height', '295px');
        $('#uv').html('').css('width', w + 'px');
        $('#uv').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('pv'), theme);
            myChart.setOption(pvData);

            var myChart1 = echarts.init(document.getElementById('uv'), theme);
            myChart1.setOption(uvData);
            $(window).resize(function () {
                throttle(myChart.resize, window);
                throttle(myChart1.resize, window);
            });
        }
        else {
            $('#pv').html('暂无数据');
            $('#uv').html('暂无数据');
        }
    }

    function handleGraph(val) {
        var w = $('#deep').parent().width();
        $('#deep').html('').css('width', w + 'px');
        $('#deep').css('height', '295px');

        if (val) {
            var myChart1 = echarts.init(document.getElementById('deep'), theme);
            myChart1.setOption(deepData);
            $(window).resize(function () {
                throttle(myChart1.resize, window);
            });
        }
        else {
            $('#deep').html('暂无数据')
        }
    }

    function toptime(val) {
        var w = $('#toptime').parent().width();
        var h = 0.6 * w;
        $('#toptime').html('').css('width', w + 'px');
        $('#toptime').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('toptime'), theme);
            myChart.setOption(toptimeData);
            $(window).resize(function () {
                throttle(myChart.resize, window);
            });
        }
        else {
            $('#toptime').html('暂无数据');
        }

    }


    function activityHandle(val) {
        var w = $('#user-join').parent().width();
        $('#user-join').html('').css('width', w + 'px');
        $('#user-join').css('height', '295px');

        $('#user-help').html('').css('width', w + 'px');
        $('#user-help').css('height', '295px');

        $('#user-order').html('').css('width', w + 'px');
        $('#user-order').css('height', '295px');

        if (val) {
            var myChart = echarts.init(document.getElementById('user-join'), theme);
            myChart.setOption(joinData);
            $(window).resize(function () {
                throttle(myChart.resize, window);
            });
        }
        else {
            $('#user-join').html('暂无数据');
        }

        if (val) {
            var myChart1 = echarts.init(document.getElementById('user-help'), theme);
            myChart1.setOption(helpData);
            $(window).resize(function () {
                throttle(myChart1.resize, window);
            });
        }
        else {
            $('#user-help').html('暂无数据');
        }

        if (val) {
            var myChart2 = echarts.init(document.getElementById('user-order'), theme);
            myChart2.setOption(orderData);
            $(window).resize(function () {
                throttle(myChart2.resize, window);
            });
        }
        else {
            $('#user-order').html('暂无数据');
        }
    }

    function getData(val) {
        $.ajax({
            type: 'GET',
            url: '/data/pv',
            data: projiect_data,
            success: function (res) {
                if (res.code === 1) {
                    var html = '';
                    html += '<td>' + res.context.yPV + '</td><td>' + res.context.yUV + '</td><td>' + res.context.yIP + '</td><td data-info="user-join">' + res.context.yUserJoin + '</td><td data-info="user-help">' + res.context.yHelp + '</td><td data-info="user-order">' + res.context.yOrders + '</td><td>' + res.context.yFans + '</td><td>' + res.context.yNewusers + '</td>';
                    $('#list_data').html(html);

                }
                else {
                    $('#list_data').html('<td>0</td><td>0</td><td>0</td><td data-info="user-join">0</td><td data-info="user-help">0</td><td data-info="user-order">0</td><td>0</td><td>0</td>');
                    alert(res.msg);
                }
                // 清掉pv 助力 订单记录
                !projiect_data.activityId && $('[data-info=user-join],[data-info=user-help],[ data-info=user-order]').hide();
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
            url: '/data/pv/hour',
            data: data,
            success: function (res) {

                if (res.code === 1) {
                    pvData.xAxis[0].data = res.context.x;
                    pvData.series[0].data = res.context.yPV;
                    pvData.series[1].data = res.context.yPerPV;

                    uvData.xAxis[0].data = res.context.x;
                    uvData.series[0].data = res.context.yUV;
                    uvData.series[1].data = res.context.yPerUV;

                    if (res.context.yHBPV.length > 0) {
                        $('#pvTotle').show();
                        $('#pvTotle .totle').html(res.context.yHBPV[0]);
                        $('#pvTotle .hb').html(res.context.yHBPV[1] + '%');
                    }
                    else {
                        $('#pvTotle').hide();
                    }

                    if (res.context.yHBUV.length > 0) {
                        $('#uvTotle').show();
                        $('#uvTotle .totle').html(res.context.yHBUV[0]);
                        $('#uvTotle .hb').html(res.context.yHBUV[1] + '%');
                    }
                    else {
                        $('#uvTotle').hide()
                    }

                    if (res.context.x.length > 0) {
                        handleGenerateGraph(true);
                    }
                    else {
                        handleGenerateGraph(false);
                    }
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

        $.ajax({
            type: 'GET',
            url: '/data/region/pv',
            data: data,
            success: function (res) {
                if (res.code == 1) {
                    cityTopData.yAxis.data = res.context.x;
                    cityTopData.series[0].data = res.context.yPV;

                    if (res.context.x.length > 0) {
                        city(true);
                    } else {
                        city(false);
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

        if (projiect_data.activityId) {
            $.ajax({
                type: 'GET',
                url: '/data/activity/trend',
                data: projiect_data,
                success: function (res) {
                    if (res.code === 1) {
                        // 显示pv 助力 订单记录
                        $('[data-info=user-join],[data-info=user-help],[data-info=user-order]').show();
                        helpData.xAxis[0].data = res.context.x;
                        joinData.xAxis[0].data = res.context.x;
                        orderData.xAxis[0].data = res.context.x;

                        helpData.series[0].data = res.context.yHelp;
                        helpData.series[1].data = res.context.yPerHelp;

                        joinData.series[0].data = res.context.yUserJoin;
                        joinData.series[1].data = res.context.yPerUserJoin;

                        orderData.series[0].data = res.context.yOrders;
                        orderData.series[1].data = res.context.yPerOrders;

                        if (res.context.yHBUserJoin.length > 0) {
                            $('#joinTotle').show();
                            $('#joinTotle .totle').html(res.context.yHBUserJoin[0]);
                            $('#joinTotle .hb').html(res.context.yHBUserJoin[1] + '%');
                        }
                        else {
                            $('#joinTotle').hide()
                        }

                        if (res.context.yHBOrders.length > 0) {
                            $('#orderTotle').show();
                            $('#orderTotle .totle').html(res.context.yHBOrders[0]);
                            $('#orderTotle .hb').html(res.context.yHBOrders[1] + '%');
                        }
                        else {
                            $('#orderTotle').hide();
                        }

                        if (res.context.yHBHelp.length > 0) {
                            $('#helpTotle').show();
                            $('#helpTotle .totle').html(res.context.yHBHelp[0]);
                            $('#helpTotle .hb').html(res.context.yHBHelp[1] + '%');
                        }
                        else {
                            $('#helpTotle').hide();
                        }


                        if (res.context.x.length > 0) {
                            activityHandle(true);
                        } else {
                            activityHandle(false);
                        }
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
        else {
            // 清掉pv 助力 订单记录
            $('[data-info=user-join],[data-info=user-help],[ data-info=user-order]').hide();
            // activityHandle(false);
        }

        $.ajax({
            type: "get",
            url: "/data/pv/toptime",
            data: data,
            success: function (res) {

                if (res.code == 1) {
                    if (res.context) {
                        toptimeData.xAxis[0].data = res.context.x;
                        toptimeData.series[0].data = res.context.yPV;
                        if (res.context.x.length > 0) {
                            toptime(true);
                        } else {
                            toptime(false);
                        }

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
            url: '/data/user/pvcal/trend',
            data: data,
            success: function (res) {

                if (res.code === 1) {
                    deepData.xAxis[0].data = res.context.x;
                    deepData.series[0].data = res.context.yDeep;
                    deepData.series[1].data = res.context.yPerDeep;


                    if (res.context.yHBDeep.length > 0) {
                        $('#deepTotle').show();
                        $('#deepTotle .totle').html(res.context.yHBDeep[0]);
                        $('#deepTotle .hb').html(res.context.yHBDeep[1] + '%');
                    }
                    else {
                        $('#deepTotle').hide();
                    }


                    if (res.context.x.length > 0) {
                        handleGraph(true);
                    }
                    else {
                        handleGraph(false);
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
    }

    $('#getTraceId').change(function () {
        var _value = $(this).find('option:selected').val();
        projiect_data.activityId = $(this).find('option:selected').data('act');
        projiect_data.appid = $(this).find('option:selected').data('app');
        project_b_time = $(this).find('option:selected').data('time');
        projiect_data.traceId = _value;
        traceId = _value;
        data.traceId = _value;
        if ($('#top_bar .custom-active').attr('tag') == 'all') {
            $('.muted').html(project_b_time + '-' + now);
            projiect_data.beginTime = project_b_time + ' 00:00:00';
            data.beginTime = project_b_time + ' 00:00:00';
        }
        store.set('traceId', _value);

        getData();
        getList(project_b_time, traceId, $(this).find('option:selected').data('act'), $(this).find('option:selected').data('app'));
    });

    getData(true);
    getList(project_b_time, traceId, activityId, appid);

//切换时间
    $('#top_bar').on('click', function (e) {
        for (var i = 0; i < $('#top_bar').find('button').length; i++) {
            $('#top_bar').find('button').eq(i).removeClass('custom-active');
        }
        $(e.target).addClass('custom-active');

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
        data = {
            beginTime: beginTime,
            endTime: endTime,
            traceId: $('#getTraceId').val(),
            perBeginTime: perBegin,
            perEndTime: perEnd
        };
        projiect_data = {
            beginTime: beginTime,
            endTime: endTime,
            traceId: traceId,
            perBeginTime: perBegin,
            perEndTime: perBegin,
            activityId: $('#getTraceId').find('option:selected').data('act'),
            appid: $('#getTraceId').find('option:selected').data('app'),
        };
        getData(false);
    });
});
