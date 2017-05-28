$(function () {
    var traceId = $("#getTraceId option:selected").val();
    if (traceId === '-1') {
        store.set('traceId', '');
        return;
    }
    if (store.get('traceId')) {
        traceId = store.get('traceId');
        $("#getTraceId").val(traceId);
    }

    var systemTime = $('.page-header').data('time');
    var type = 'day';
    var trend_type = 'day';
    var second = 'rate';
    var now = moment(systemTime).subtract(7, 'days').format('YYYY-MM-DD');
    $('.muted').html(moment(systemTime).subtract(7, 'days').format('YYYY-MM-DD') + '-' + moment(systemTime).format('YYYY-MM-DD'));
    var data = {
        beginTime: now + ' 00:00:00',
        endTime: moment(systemTime).format('YYYY-MM-DD') + ' 23:59:59',
        traceId: traceId,
        type: type
    };
    var trend_data = {
        beginTime: now + ' 00:00:00',
        endTime: moment(systemTime).format('YYYY-MM-DD') + ' 23:59:59',
        traceId: traceId,
        type: trend_type
    };

    $('[data-click=retention]').on('click', function () {
        $('[data-click=retention]').addClass('retain-btn-active');
        $('[data-click=rate]').removeClass('retain-btn-active');
        second = 'retention';
        $('#trend').html(html1)
    });


    $('[data-click=rate]').on('click', function () {
        $('[data-click=retention]').removeClass('retain-btn-active');
        $('[data-click=rate]').addClass('retain-btn-active');
        second = 'rate';
        $('#trend').html(html2)
    });


    $('#getTraceId').change(function () {
        var _value = $(this).children('option:selected').val();
        traceId = _value;
        data.traceId = _value;
        getData(true);
        store.set('traceId', traceId);
    });

    var uvData = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            data: ['本周期数据趋势']
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br /><span class="line_dot" style="background-color:#6ac1e8"></span>{a}:{c}%'
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
            }
        ]
    };

    $('.totleNum').on('click', function (e) {
        for (var i = 0; i < $('.totleNum').find('button').length; i++) {
            $('.totleNum').find('button').eq(i).removeClass('retain-btn-active');
        }
        $(e.target).addClass('retain-btn-active');
        trend_data.type = $(e.target).attr('tag');
        if ($(e.target).attr('tag') == 'day') {

            trend_data.beginTime = moment(systemTime).subtract(7, 'days').format('YYYY-MM-DD') + ' 00:00:00';
            trend_data.endTime = moment(systemTime).format('YYYY-MM-DD') + ' 23:59:59';
            $('.muted').html(moment(systemTime).subtract(7, 'days').format('YYYY-MM-DD') + '-' + moment(systemTime).format('YYYY-MM-DD'));
        }

        if ($(e.target).attr('tag') == 'week') {
            trend_data.beginTime = moment().subtract(4, 'week').startOf('week').format('YYYY-MM-DD') + ' 00:00:00';
            trend_data.endTime = moment(systemTime).format('YYYY-MM-DD') + ' 23:59:59'
            $('.muted').html(moment().subtract(4, 'week').startOf('week').format('YYYY-MM-DD') + '-' + moment(systemTime).format('YYYY-MM-DD'));
        }
        if ($(e.target).attr('tag') == 'month') {
            trend_data.beginTime = moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD') + ' 00:00:00';
            trend_data.endTime = moment(systemTime).format('YYYY-MM-DD') + ' 23:59:59'
            $('.muted').html(moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD') + '-' + moment(systemTime).format('YYYY-MM-DD'));
        }
        getTrend();
    })

    $('[data-click=change]').on('click', function (e) {
        for (var i = 0; i < $('[data-click=change]').find('button').length; i++) {
            $('[data-click=change]').find('button').eq(i).removeClass('retain-btn-active');
        }

        $(e.target).addClass('retain-btn-active');
        data.type = $(e.target).attr('tag');

        if ($(e.target).attr('tag') == 'day') {
            var html = '<th></th><th>当天</th><th>次日留存</th><th>2天后</th><th>3天后</th><th>4天后</th><th>5天后</th><th>6天后</th>';
            $('#table_title').html(html);
            data.beginTime = moment(systemTime).subtract(7, 'days').format('YYYY-MM-DD') + ' 00:00:00';
            data.endTime = moment(systemTime).format('YYYY-MM-DD') + ' 23:59:59';
        }

        if ($(e.target).attr('tag') == 'week') {
            data.beginTime = moment().subtract(4, 'week').startOf('week').format('YYYY-MM-DD') + ' 00:00:00';
            data.endTime = moment(systemTime).format('YYYY-MM-DD') + ' 23:59:59'
            var html = '<th></th><th>当周</th><th>一周留存</th><th>两周</th><th>三周</th><th>四周</th>';
            $('#table_title').html(html);
        }

        if ($(e.target).attr('tag') == 'month') {
            data.beginTime = moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD') + ' 00:00:00';
            data.endTime = moment(systemTime).format('YYYY-MM-DD') + ' 23:59:59'
            var html = '<th></th><th>当月</th><th>一月留存</th><th>二月</th>';
            $('#table_title').html(html)
        }
        getData()
    })

    var html1 = '';
    var html2 = '';

    function getData(val) {
        $.ajax({
            type: 'GET',
            url: '/data/retain/trend',
            data: data,
            success: function (res) {

                if (res.code == 1) {
                    html1 = '';
                    html2 = '';

                    for (var i = 0; i < res.context.yRate.length; i++) {
                        html2 += '<tr>';
                        html2 += '<td>' + res.context.yRate[i][0] + '</td>';
                        for (var j = 1; j < res.context.yRate[i].length; j++) {
                            if (res.context.yRate[i][j] != '') {
                                html2 += '<td>' + res.context.yRate[i][j] + '%</td>'
                            } else {
                                html2 += '<td>' + res.context.yRate[i][j] + '</td>'
                            }
                        }
                        html2 += '</tr>';
                    }

                    for (var i = 0; i < res.context.yRetention.length; i++) {
                        html1 += '<tr>';
                        for (var j = 0; j < res.context.yRetention[i].length; j++) {
                            html1 += '<td>' + res.context.yRetention[i][j] + '</td>'
                        }
                        html1 += '</tr>';
                    }


                    if (second == 'retention') {
                        $('#trend').html(html1)
                    } else {
                        $('#trend').html(html2)
                    }


                    if (val) {
                        uvData.xAxis[0].data = res.context.x;
                        uvData.series[0].data = res.context.yDateRate;

                        if (res.context.yDateRate.length > 0) {
                            handleGenerateGraph(true);
                        } else {
                            handleGenerateGraph(false);
                        }
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

    function getTrend() {
        $.ajax({
            type: 'GET',
            url: '/data/retain/trend',
            data: trend_data,
            success: function (res) {

                if (res.code == 1) {
                    uvData.xAxis[0].data = res.context.x;
                    uvData.series[0].data = res.context.yDateRate;

                    if (res.context.yDateRate.length > 0) {
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

    }


    getData(true);

    function handleGenerateGraph(val) {

        var w = $('#retain').parent().width();
        var h = 0.6 * w;
        $('#retain').html('').css('width', w + 'px');
        $('#retain').css('height', '295px');

        if (val) {
            var myChart1 = echarts.init(document.getElementById('retain'), theme);
            myChart1.setOption(uvData);
        } else {
            $('#uv').html('暂无数据');
        }
    }

})

