/**
 * @file 渠道来源
 */
var lineOption = {
    getOption: function (data, name) {
        option = {
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
                    // areaStyle: {normal: {}},
                    data: data[name]
                }
            ]
        };
        return option;
    }
};
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
    $('#type').change(function () {
        var _value = $(this).children('option:selected').val();
        second = $(this).children('option:selected').text();
        if (_value == 'all') {
            $('#type_value').html('<option value="all">全部</option>');
        }
        else {
            $.ajax({
                type: 'GET',
                url: '/data/condition',
                data: {type: _value},
                success: function (res) {
                    var html = '';
                    if (res.code === 1) {
                        for (var i in res.context) {
                            html += '<option value=' + res.context[i] + '>' + i + '</option>'
                        }
                        $('#type_value').html(html);
                    }
                    else {
                        $('#type_value').html('<option value="all">全部</option>');
                        alert(res.msg);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    ajaxFail(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        }
    });

    $('#clear').on('click', function (e) {
        e.stopPropagation();
        $("#type option[value='all']");
        $('#type_value').html('<option value="all">全部</option>');
    });


    $('#type').on('click', function (e) {
        e.stopPropagation();
    });

    $('#type_value').on('click', function (e) {
        e.stopPropagation();
    });

    $('#save').on('click', function () {
        $('.filtrate').hide();
        $('#filtrate_btn').removeClass('open');
        if ($("#type").children('option:selected').val() == 'all') {
            data.type = '';
            data.value = '';
        }
        else {
            data.type = $("#type option:selected").val();
            data.value = $("#type_value option:selected").val();
            if ($('[data-click=condition]').length > 0) {
                $('#condition').html(second + ':' + data.value);
            }
            else {
                $('#retain_condition').prepend('<div class="retain_tag"><span class="retain_tag_close" data-click="condition"><i class="fa fa-times"></i></span><span id="condition">' + second + ':' + data.value + '</span></div>');
            }
            $('[data-click=condition]').on('click', function () {
                $(this).parent().remove();
                data.type = '';
                data.value = '';
                /*getData()*/
            });
        }
        /*getData();*/
    });


    var traceId = $("#getTraceId option:selected").val();
    if (traceId === '-1') {
        store.set('traceId', '');
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
        getData();
        store.set('traceId', traceId);
    });

    var barData = {
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
                name: '渠道pv',
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


    function getData() {
        $.ajax({
            type: 'GET',
            url: '/data/channel/pv',
            data: data,
            success: function (res) {
                if (res.code === 1) {
                    if (res.context.x.length > 0) {
                        $('#channel').css('height', '295px');
                        var myChart1 = echarts.init(document.getElementById('channel'), theme);
                        myChart1.setOption(lineOption.getOption(res.context,'yPV'));
                    }
                    else {
                        $('#channel').html('暂无数据');
                    }
                }
                else {
                    alert(res.msg);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                ajaxFail(XMLHttpRequest, textStatus, errorThrown);
            }
        });

        $.ajax({
            type: 'GET',
            url: '/data/channel/list',
            data: data,
            success: function (res) {

                if (res.code === 1) {
                    if (res.context.list.length > 0) {
                        var html = '';
                        for (var i = 0; i < res.context.list.length; i++) {
                            html += '<tr ><td>' + (i + 1) + '</td><td>' + res.context.list[i].channel + '</td><td></td><td>' + res.context.list[i].pv + '</td><td>' + res.context.list[i].rate + '</td></tr>'
                        }
                        $('#channel-list').html(html)

                    } else {
                        html = '<tr >暂无数据</tr>';
                        $('#channel-list').html(html)
                    }
                    barData.yAxis.data = res.context.x;
                    barData.series[0].data = res.context.yPV;

                    if (res.context.x.length > 0) {
                        handle(true);
                    } else {
                        handle(false);
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


//获取时间段
    function time(val) {
        if (val) {
            var begin = systemTime - parseInt(val) * 24 * 3600 * 1000;
            var beginTime = new Date(begin).getFullYear() + '-' + (new Date(begin).getMonth() + 1) + '-' + new Date(begin).getDate();
            return beginTime;
        }
    }

    function handle(val) {
        var w = $('#channel-bar').parent().width();
        $('#channel-bar').html('').css('width', w + 'px');
        $('#channel-bar').css('height', '295px');

        if (val) {
            var myChart1 = echarts.init(document.getElementById('channel-bar'), theme);
            myChart1.setOption(barData);
        } else {
            $('#channel-bar').html('暂无数据');
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