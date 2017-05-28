/**
* @file 地域分布
* */
$(function () {
    var traceId = $("#getTraceId option:selected").val();
    if (traceId === '-1') {
        store.remove('traceId');
        return;
    }

    if (store.get('traceId')) {
        traceId = store.get('traceId');
        $("#getTraceId").val(store.get('traceId'));
    }
    var systemTime = $('.page-header').data('time');
    var now = moment(systemTime).format('YYYY-MM-DD');
    var perNow = moment(systemTime).subtract(1, 'days').format('YYYY-MM-DD');

    var project_b_time = $("#getTraceId option:selected").data('time');
    $('.muted').html(now);
    var activityId = $("#getTraceId option:selected").data('act');
    var data = {beginTime: now + ' 00:00:00', endTime: now + ' 23:59:59', traceId: traceId};
    var list_data = {beginTime: now + ' 00:00:00', endTime: now + ' 23:59:59', traceId: traceId, page: 1, size: 100};
    var order_list = {beginTime: now + ' 00:00:00', endTime: now + ' 23:59:59', activityId: activityId};

    $('#getTraceId').change(function () {
        var _value = $(this).children('option:selected').val();
        traceId = _value;
        data.traceId = _value;
        list_data.traceId = _value;
        order_list.activityId = $(this).children('option:selected').data('act');
        project_b_time = $(this).children('option:selected').data('time');
        if ($('#top_bar .time-tag-active').attr('tag') == 'all') {
            $('.muted').html(project_b_time + '-' + now);
            data.beginTime = project_b_time + ' 00:00:00';
            list_data.beginTime = project_b_time + ' 00:00:00';
            order_list.beginTime = project_b_time + ' 00:00:00';
        }
        getData();
        store.set('traceId', traceId);
    });

    var option = {
        tooltip: {
            trigger: 'item'
        },
        visualMap: {
            min: 0,
            max: 100,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],           // 文本，默认为数值文本
            calculable: true,
            color: ['#d94e5d', '#eac736', '#50a3ba'],
        },
        series: [
            {
                name: '地域分布',
                type: 'map',
                mapType: 'china',
                roam: false,
                data: []
            }
        ]
    };

    var cityBarData = {
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


//切换时间
    $('#top_bar').on('click', function (e) {
        for (var i = 0; i < $('#top_bar').find('button').length; i++) {
            $('#top_bar').find('button').eq(i).removeClass('time-tag-active');
        }
        $('[data-click=time]').parent().remove();
        $(e.target).addClass('time-tag-active');

        var beginTime = null;
        var endTime = null;
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
                $('.muted').html(moment(systemTime).subtract(1, 'days').startOf('day').format('YYYY-MM-DD'));
                break;
            case '7': // 前7天
                beginTime = moment(systemTime).subtract(7, 'days').startOf('day').format('l');
                endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                $('.muted').html(moment(systemTime).subtract(7, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));
                break;
            case '14': // 前14天
                beginTime = moment(systemTime).subtract(14, 'days').startOf('day').format('l');
                endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                $('.muted').html(moment(systemTime).subtract(14, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));

                break;
            case '28': // 前28天
                beginTime = moment(systemTime).subtract(28, 'days').startOf('day').format('l');
                endTime = moment(systemTime).subtract(1, 'days').endOf('day').format('l');
                $('.muted').html(moment(systemTime).subtract(28, 'days').startOf('day').format('YYYY-MM-DD') + '-' + moment(systemTime).subtract(1, 'days').endOf('day').format('YYYY-MM-DD'));
                break;
            case 'all': // 活动周期
                beginTime = project_b_time + ' 00:00:00';
                endTime = moment(systemTime).endOf('day').format('l');
                $('.muted').html(project_b_time + '-' + now);
                break;
        }

        data.beginTime = beginTime;
        data.endTime = endTime;
        list_data.beginTime = beginTime;
        list_data.endTime = endTime;
        order_list.beginTime = beginTime;
        order_list.endTime = endTime;


        getData()
    });


    function getData() {
        $.ajax({
            type: 'GET',
            url: '/data/region/pv',
            data: data,
            success: function (res) {
                if (res.code == 1) {
                    cityBarData.yAxis.data = res.context.x;
                    cityBarData.series[0].data = res.context.yPV;

                    if (res.context.x.length > 0) {
                        city_bar(true);
                    } else {
                        city_bar(false);
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
        })

        if (order_list.activityId) {
            $.ajax({
                type: 'GET',
                url: '/data/region/orders',
                data: order_list,
                success: function (res) {
                    if (res.code == 1) {
                        var html = '';
                        for (var i = 0; i < res.context.ranks.length; i++) {
                            html += '<tr><td>' + (i + 1) + '</td><td>' + res.context.ranks[i].province + '</td><td>' + res.context.ranks[i].count + '</td></tr>'
                        }
                        $('#order-list').html(html);
                    } else {
                        $('#order-list').html('<tr><td>暂无数据</td></tr>');
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


        $.ajax({
            type: 'GET',
            url: '/data/region/list',
            data: list_data,
            success: function (res) {
                var html = '';
                if (res.code == 1) {
                    option.series[0].data = [];
                    for (var i = 0; i < res.context.length; i++) {
                        var name = res.context[i].province;
                        var value = res.context[i].pv;
                        option.series[0].data.push({name: name, value: value});
                        html += '<tr><td>' + (i + 1) + '</td><td>' + res.context[i].province + '</td><td>' + res.context[i].pv + '</td><td>' + res.context[i].uv + '</td></tr>'
                    }

                    $('#list-info').html(html);

                    if (res.context.length > 0) {
                        option.visualMap.max = parseInt(res.context[0].pv) + 10;
                        city(true);
                    } else {
                        city(false);
                    }
                } else {
                    $('#list-info').html('');
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

    getData();

//获取时间段
    function time(val) {
        if (val) {
            var begin = systemTime - parseInt(val) * 24 * 3600 * 1000;
            var beginTime = new Date(begin).getFullYear() + '-' + (new Date(begin).getMonth() + 1) + '-' + new Date(begin).getDate();
            return beginTime;
        }
    }

    var w = $('#city-map').parent().width();
    function city(val) {
        $('#city-map').html('').css('width', w + 'px');
        $('#city-map').css('height', '295px');

        if (val) {
            var myChart1 = echarts.init(document.getElementById('city-map'), theme);
            myChart1.setOption(option);
            /*myChart1.on('click',function(params){
                console.log(params.name);
            });*/
        } else {
            $('#city-map').html('暂无数据');
        }


    };


    function city_bar(val) {
        $('#city-bar').html('').css('width', w + 'px');
        $('#city-bar').css('height', '295px');
        if (val) {
            var myChart = echarts.init(document.getElementById('city-bar'), theme);
            myChart.setOption(cityBarData);
        } else {
            $('#city-bar').html('暂无数据');
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
            getData()
        });

        var s1 = start.format('YYYY-MM-DD HH:mm:ss');

        var s2 = end.format('YYYY-MM-DD HH:mm:ss');
        data.beginTime = s1;
        data.endTime = s2;
        list_data.beginTime = s1;
        list_data.endTime = s2;
        order_list.beginTime = s1;
        order_list.endTime = s2;

        var num = DateDiff(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        if (num > 0) {
            $('.muted').html(s1 + ' - ' + s2);
        } else {
            $('.muted').html(s1);
        }

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

})

