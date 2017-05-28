$(function () {
    var appid = $("#getappid option:selected").val();
    if (appid === '-1') {
        return;
    }
    var now = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() - 1);
    $('.muted').html(now);
    var data = {beginTime: now + ' 00:00:00', endTime: now + ' 23:59:59', appid: appid};


    $('#getappid').change(function () {
        var _value = $(this).children('option:selected').val();
        appid = _value;
        data.appid = _value;
        getData();
    });

    var cumulateUser = {
        tooltip: {
            trigger: 'axis'
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
                name: '总用户量',
                type: 'line',

                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var pageReadUser = {
        tooltip: {
            trigger: 'axis'
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
                name: '图文页的阅读人数',
                type: 'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var pageReadCount = {
        tooltip: {
            trigger: 'axis'
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
                name: '图文页的阅读次数',
                type: 'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var shareUser = {
        tooltip: {
            trigger: 'axis'
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
                name: '分享人数',
                type: 'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var shareCount = {
        tooltip: {
            trigger: 'axis'
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
                name: '分享次数',
                type: 'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var msgUser = {
        tooltip: {
            trigger: 'axis'
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
                name: '上行消息的用户数',
                type: 'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var msgCount = {
        tooltip: {
            trigger: 'axis'
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
                name: '上行消息的消息总数',
                type: 'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data: []
            }
        ]
    };

    var forwardUser = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
            {
                name: '转发的人数',
                type: 'pie',
                hoverAnimation:false,
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
    };
    var forwardCount = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
            {
                name: '转发的次数',
                type: 'pie',
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
    };


    getData(true);


//切换时间
    $('#top_bar').on('click', function (e) {
        for (var i = 0; i < $('#top_bar').find('button').length; i++) {
            $('#top_bar').find('button').eq(i).removeClass('active');
        }

        $(e.target).addClass('active');

        if (parseInt($(e.target).attr('tag'))) {
            var e_time = '';
            var b_time = time($(e.target).attr('tag'));

            if (parseInt($(e.target).attr('tag')) == 2) {
                e_time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
                data = {beginTime: e_time + ' 00:00:00', endTime: e_time + ' 23:59:59', appid: appid}
            } else {
                e_time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() - 1);
                data = {beginTime: b_time + ' 00:00:00', endTime: e_time + ' 23:59:59', appid: appid}
            }
            if (parseInt($(e.target).attr('tag')) > 3) {
                $('.muted').html(b_time + '-' + e_time);
            } else {
                $('.muted').html(b_time);
            }
        } else {
            var valTime = $(e.target).attr('tag'),
                s = eval(valTime + 'StartDate'),
                e = eval(valTime + 'EndDate');

            data = {beginTime: s + ' 00:00:00', endTime: e + ' 23:59:59', appid: appid};
            $('.muted').html(s + '-' + e);
        }

        getData(false)

    })


    function getData(val) {
        $.ajax({
            type: 'GET',
            url: '/wechat/data/day',
            data: data,
            success: function (res) {
                if (res.code == 1) {
                    cumulateUser.xAxis[0].data = res.context.x;
                    cumulateUser.series[0].data = res.context.yCUMULATEUSER;

                    pageReadUser.xAxis[0].data = res.context.x;
                    pageReadUser.series[0].data = res.context.yORIPAGEREADUSER;

                    pageReadCount.xAxis[0].data = res.context.x;
                    pageReadCount.series[0].data = res.context.yINTPAGEREADCOUNT;

                    shareUser.xAxis[0].data = res.context.x;
                    shareUser.series[0].data = res.context.ySHAREUSER;

                    shareCount.xAxis[0].data = res.context.x;
                    shareCount.series[0].data = res.context.ySHARECOUNT;

                    msgUser.xAxis[0].data = res.context.x;
                    msgUser.series[0].data = res.context.yMSGUSER;

                    msgCount.xAxis[0].data = res.context.x;
                    msgCount.series[0].data = res.context.yMSGCOUNT;


                    handleGenerateGraph(val);
                } else {
                    alert(res.msg)
                }
            }
        });

        $.ajax({
            type: 'GET',
            url: '/wechat/data/share/topn',
            data: data,
            success: function (res) {
                forwardUser.series[0].data = [];
                forwardCount.series[0].data = [];
                if (res.code == 1) {
                    for (var i = 0; i < res.context.ySHAREUSER.length; i++) {
                        forwardUser.series[0].data.push({
                            name: res.context.ySHAREUSER[i].label,
                            value: res.context.ySHAREUSER[i].value
                        })
                    }

                    for (var i = 0; i < res.context.ySHARECOUNT.length; i++) {
                        forwardCount.series[0].data.push({
                            name: res.context.ySHARECOUNT[i].label,
                            value: res.context.ySHARECOUNT[i].value
                        })
                    }

                    forward(val);

                } else {
                    alert(res.message)
                }
            }
        });


    }

//获取时间段
    function time(val) {
        if (val) {
            var begin = new Date().getTime() - parseInt(val) * 24 * 3600 * 1000;
            var beginTime = new Date(begin).getFullYear() + '-' + (new Date(begin).getMonth() + 1) + '-' + new Date(begin).getDate();
            return beginTime;
        }
    }


    var handleGenerateGraph = function (animationOption) {

        var w = $('#cumulateUser').parent().width();
        var h = 0.6 * w;
        $('#cumulateUser').html('').css('width', w + 'px');
        $('#cumulateUser').css('height', h + 'px');

        $('#pageReadCount').html('').css('width', w + 'px');
        $('#pageReadCount').css('height', h + 'px');

        $('#pageReadUser').html('').css('width', w + 'px');
        $('#pageReadUser').css('height', h + 'px');

        $('#msgCount').html('').css('width', w + 'px');
        $('#msgCount').css('height', h + 'px');

        $('#msgUser').html('').css('width', w + 'px');
        $('#msgUser').css('height', h + 'px');

        $('#shareCount').html('').css('width', w + 'px');
        $('#shareCount').css('height', h + 'px');

        $('#shareUser').html('').css('width', w + 'px');
        $('#shareUser').css('height', h + 'px');

        var myChart = echarts.init(document.getElementById('cumulateUser'), theme);
        myChart.setOption(cumulateUser);

        var myChart1 = echarts.init(document.getElementById('pageReadCount'), theme);
        myChart1.setOption(pageReadCount);

        var myChart2 = echarts.init(document.getElementById('pageReadUser'), theme);
        myChart2.setOption(pageReadUser);

        var myChart3 = echarts.init(document.getElementById('msgCount'), theme);
        myChart3.setOption(msgCount);

        var myChart4 = echarts.init(document.getElementById('msgUser'), theme);
        myChart4.setOption(msgUser);

        var myChart5 = echarts.init(document.getElementById('shareCount'), theme);
        myChart5.setOption(shareCount);

        var myChart6 = echarts.init(document.getElementById('shareUser'), theme);
        myChart6.setOption(shareUser);


    };

    var forward = function (animationOption) {

        var w = $('#forwardCount').parent().width();
        var h = 0.6 * w;
        $('#forwardCount').html('').css('width', w + 'px');
        $('#forwardCount').css('height', h + 'px');

        $('#forwardUser').html('').css('width', w + 'px');
        $('#forwardUser').css('height', h + 'px');

        var myChart = echarts.init(document.getElementById('forwardCount'));
        myChart.setOption(forwardCount);

        var myChart1 = echarts.init(document.getElementById('forwardUser'));
        myChart1.setOption(forwardUser);


    };
})


