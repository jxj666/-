var minute = 1000*60; //1分钟

// 当前时间
window.setInterval(function(){
    getTime();
}, 1000)

function getTime() {
    var date = new Date();
    var timeReg = /(?:\d*):(?:\d*):(?:\d*)/
    var _timeStr = timeReg.exec(date);
    var _html = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + ' ' + _timeStr;
    $('#time').html(_html);
}
var tobacco = 'yn_ryx';// 声明烟名

// 切换数据
$('.cut a').on('click', function () {
    var text = $(this).html();
    console.log(text);
    $('.name-time').html(text);
    $(this).addClass('activation');
    $(this).parents().siblings().children('a').removeClass('activation');
    tobacco = $(this).data('href');
    url = '/dataview/pv?traceId=ie35vg45tf&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
    city_url = '/dataview/city/topn?traceId=ie35vg45tf&topn=100&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
    map_url = '/dataview/map/city?traceId=ie35vg45tf&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
    $('#pv').html('<span>0</span><span>0</span><span>0</span><span>0</span><span>0</span><span>0</span>');
    $('#desc').html('已有<em class="color">0</em>人参与，当前在线<em>0</em>人，<br>累计验真<em class="color">0</em>条，<em class="color">0</em>小包。');
    $('#list').html('');
    $('.qrcode-time').html('');
    getPv(url);
    currentUsers();
    getMapData(map_url);
    getCityRank(city_url);
    // $('.name-broadcast').html(text);

});

var url = '/dataview/pv?traceId=ie35vg45tf&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
var city_url = '/dataview/city/topn?traceId=ie35vg45tf&topn=100&productId='+ tobacco + '&timeStamp=' + new Date().getTime();// 区域扫码次数接口
// var winner_url = '/dataview/city/topn?traceId=ie35vg45tf&topn=100&productId='+ tobacco + '&timeStamp='+new Date().getTime();// 区域中奖人数接口
var map_url = '/dataview/map/city?traceId=ie35vg45tf&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
$('.tab_list').on('click',function (e) {
    $('.tab_list li').removeClass('active');
    var tag = parseInt($(e.target).attr('tag'));
    $(e.target).addClass('active')
    if(tag == 0){
        url = '/dataview/pv?traceId=ie35vg45tf&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
        city_url = '/dataview/city/topn?traceId=ie35vg45tf&topn=100&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
        map_url = '/dataview/map/city?traceId=ie35vg45tf&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
        getPv(url);
        getMapData(map_url);
        getCityRank(city_url);
    }else {
        url = '/dataview/region/pv?traceId=ie35vg45tf&region='+ tag +'&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
        city_url = '/dataview/region/city/topn?traceId=ie35vg45tf&topn=100&region='+ tag  +'&productId='+ tobacco + '&timeStamp=' + new Date().getTime();
        map_url = '/dataview/region/map/city?traceId=ie35vg45tf&region='+ tag + '&productId='+ tobacco +'&timeStamp=' + new Date().getTime();
        getPv(url);
        getMapData(map_url);
        getCityRank(city_url);
    }
});

// pv,uv...
window.setInterval(function(){
    getPv(url);
}, minute);

getPv(url);
function getPv(url){
    $.ajax({
        url: url,
        success: function(res) {
            var code = res.code;
            if ( code == 1 ) {
                var data = res.context;
                var pvArr = (data.pv.toString()).split('');
                var _html = '';
                pvArr.forEach(function(n, index){
                    _html += '<span>' + n + '</span>';
                })
                $('#pv').html(_html);
                // $('#desc').html('已有<em>' + data.tiao + '</em>条盒、<em>' + data.he + '</em>小包被扫，<br><em>' + data.uv +'</em>人参与，当前在线<em>' + data.online + '</em>人。')

                // $('#desc').html('已有<em>' + data.uv +'</em>人参与，当前在线<em>' + data.online + '</em>人，<br>今日访问<em>' + data.today + '</em>次。<br>条盒扫码次数<em>' + data.tiao + '</em>次,小包<em>' + data.he + '</em>次');
                $('#desc').html('已有<em class="color">' + data.uv +'</em>人参与，当前在线<em>' + data.online + '</em>人，<br>累计验真<em class="color">' + data.tiao + '</em>条，<em class="color">'+data.he+'</em>小包。');
                //<br>累计消费者<em  class="color">' + data.total_consumer+ '</em>人,零售户<em class="color">' + data.total_register + '</em>人'
            } else {
                ajaxFail(res, code);
            }
        }
    })
}

// 用户实时访问数据
window.setInterval(function(){
    currentUsers();
}, minute)

currentUsers();
function currentUsers() {
    $.ajax({
        url: '/dataview/realtime?traceId=ie35vg45tf&productId='+ tobacco + '&timeStamp=' + new Date().getTime(),
        success: function(res) {
            var code = res.code;
            if ( code == 1 ) {
                var dataArr = res.context;
                var _html = '';
                dataArr.forEach(function(n, index){
                    var image = n.headimgurl;
                    if ( image == '' ) {
                        image = 'https://weiop.oss-cn-beijing.aliyuncs.com/ruanyuxi/img/default.jpeg';
                    }
                    _html += '<li class="each-user"><img src="' + image + '" alt="" class="head"><span class="color"> ' + n.nickname + '</span> 访问了 <span class="color">' + n.title + '</span> 页面，来自<span class="color"> ' + n.province + ' ' + n.city + '</span><em>' + n.statTime + '</em></li>'
                })
                $('#list').html(_html);
            } else {
                ajaxFail(res, code)
            }
        }
    })
}

// 城市排行 区域扫码次数排行
window.setInterval(function(){
    getCityRank(city_url);
}, minute * 30)

getCityRank(city_url);
function getCityRank(city_url) {
    $.ajax({
        url: city_url,
        success: function(res) {
            var code = res.code;
            if ( code == 1 ) {
                var cityArr = res.context.topn;
                var _html = '';
                cityArr.forEach(function(n, index){
                    if ( index === 0 ) {
                        _html += '<li class="city-wrap"><div class="city"><span><i>' + (index + 1) + ' </i>' + n.city + '</span> <em>' + n.pv + '</em></div>';
                    } else {
                        if ( index%20 === 0 && index > 10 ) {
                            _html += '</li><li class="city-wrap"><div class="city"><span><i>' + (index + 1) + ' </i>' + n.city + '</span> <em>' + n.pv + '</em></div>';
                            if ( index === (cityArr.length - 1) ) {
                                _html += '</li>'
                            }
                        } else {
                            _html += '<div class="city"><span><i>' + (index + 1) + ' </i>' + n.city + '</span> <em>' + n.pv + '</em></div>';
                        }
                    }
                    // _html += '<li class="city"><span>' + n.city + '</span> <em>' + n.pv + '</em></li>';
                })
                $('.qrcode-time').html(_html);
            } else {
                ajaxFail(res, code)
            }
        }
    })
}
// 区域中奖人数排行
// window.setInterval(function () {
//     getWinnerNumber(winner_url);
// },minute * 30)

// getWinnerNumber(winner_url);
// function getWinnerNumber(winner_url) {
//      $.ajax({
//         url: winner_url,
//         success: function(res) {
//             var code = res.code;
//             if ( code == 1 ) {
//                 var cityArr = res.context.topn;
//                 var _html = '';
//                 cityArr.forEach(function(n, index){
//                     if ( index === 0 ) {
//                         _html += '<li class="city-wrap"><div class="city"><span><i>' + (index + 1) + ' </i>' + n.city + '</span> <em>' + n.pv + '</em></div>';
//                     } else {
//                         if ( index%20 === 0 && index > 10 ) {
//                             _html += '</li><li class="city-wrap"><div class="city"><span><i>' + (index + 1) + ' </i>' + n.city + '</span> <em>' + n.pv + '</em></div>';
//                             if ( index === (cityArr.length - 1) ) {
//                                 _html += '</li>'
//                             }
//                         } else {
//                             _html += '<div class="city"><span><i>' + (index + 1) + ' </i>' + n.city + '</span> <em>' + n.pv + '</em></div>';
//                         }
//                     }
//                     // _html += '<li class="city"><span>' + n.city + '</span> <em>' + n.pv + '</em></li>';
//                 })
//                 $('.winner-number').html(_html);
//             } else {
//                 ajaxFail(res, code)
//             }
//         }
//     })
// }

var map = document.getElementById("map");
var echart = echarts.init(map);
var data = {"list": []};

// var data = {"list":[{"name":"重庆","value":64},{"name":"成都","value":43},{"name":"玉林","value":32},{"name":"扬州","value":22},{"name":"梧州","value":30},{"name":"崇左","value":17},{"name":"南宁","value":28},{"name":"资阳","value":17},{"name":"北京","value":25},{"name":"亳州","value":11},{"name":"德阳","value":17},{"name":"泰安","value":9},{"name":"忻州","value":27},{"name":"济宁","value":13},{"name":"郑州","value":21},{"name":"昆明","value":20},{"name":"上海","value":23},{"name":"深圳","value":23},{"name":"广安","value":8},{"name":"威海","value":25},{"name":"遂宁","value":10},{"name":"百色","value":23},{"name":"白城","value":12},{"name":"防城港","value":22},{"name":"北海","value":9},{"name":"福州","value":7},{"name":"宿州","value":6},{"name":"自贡","value":14},{"name":"阿克苏地区","value":23},{"name":"西安","value":20},{"name":"哈尔滨","value":17},{"name":"青岛","value":9},{"name":"柳州","value":7},{"name":"呼和浩特","value":21},{"name":"佛山","value":8},{"name":"阜阳","value":6},{"name":"菏泽","value":3},{"name":"海口","value":18},{"name":"来宾","value":4},{"name":"泉州","value":19},{"name":"枣庄","value":10},{"name":"延边朝鲜族自治州","value":6},{"name":"沈阳","value":21},{"name":"临沂","value":17},{"name":"钦州","value":11},{"name":"赤峰","value":11},{"name":"滁州","value":9},{"name":"洛阳","value":21},{"name":"广元","value":19},{"name":"乌鲁木齐","value":2},{"name":"通化","value":5},{"name":"无锡","value":3},{"name":"四平","value":10},{"name":"马鞍山","value":17},{"name":"滨州","value":14},{"name":"淄博","value":15},{"name":"鹤壁","value":14},{"name":"杭州","value":8},{"name":"大连","value":19},{"name":"贵港","value":6},{"name":"周口","value":15},{"name":"邯郸","value":1},{"name":"唐山","value":8},{"name":"牡丹江","value":15},{"name":"遵义","value":12},{"name":"泰州","value":1},{"name":"沧州","value":18},{"name":"蚌埠","value":1}]};

// var data = {"list":[{"name":"重庆","value":45},{"name":"自贡","value":32},{"name":"扬州","value":20},{"name":"北京","value":17},{"name":"成都","value":32},{"name":"亳州","value":21},{"name":"梧州","value":23},{"name":"德阳","value":21},{"name":"南宁","value":10},{"name":"深圳","value":27},{"name":"崇左","value":18},{"name":"资阳","value":14},{"name":"防城港","value":17},{"name":"泰安","value":11},{"name":"百色","value":10},{"name":"开封","value":6},{"name":"玉林","value":15},{"name":"济宁","value":15},{"name":"青岛","value":21},{"name":"宿州","value":22},{"name":"乌鲁木齐","value":12},{"name":"泉州","value":8},{"name":"赣州","value":5},{"name":"大连","value":15},{"name":"大理白族自治州","value":13},{"name":"钦州","value":5},{"name":"枣庄","value":18},{"name":"四平","value":16},{"name":"佛山","value":9},{"name":"保定","value":4},{"name":"威海","value":10},{"name":"哈尔滨","value":22},{"name":"延边朝鲜族自治州","value":16},{"name":"菏泽","value":8},{"name":"福州","value":22},{"name":"包头","value":19},{"name":"合肥","value":13},{"name":"呼和浩特","value":10},{"name":"上海","value":20},{"name":"滁州","value":14},{"name":"蚌埠","value":6},{"name":"鞍山","value":20},{"name":"潍坊","value":12},{"name":"杭州","value":11},{"name":"宁德","value":13},{"name":"本溪","value":14},{"name":"郑州","value":10},{"name":"广元","value":12},{"name":"沧州","value":20},{"name":"贺州","value":17},{"name":"天津","value":17},{"name":"通化","value":4},{"name":"贵港","value":7},{"name":"阜阳","value":12},{"name":"马鞍山","value":9},{"name":"绵阳","value":7},{"name":"无锡","value":5},{"name":"淄博","value":3},{"name":"邯郸","value":20},{"name":"宜宾","value":13},{"name":"聊城","value":4},{"name":"鹤壁","value":19},{"name":"达州","value":20},{"name":"西安","value":5},{"name":"普洱","value":18},{"name":"西双版纳傣族自治州","value":18},{"name":"牡丹江","value":8},{"name":"沈阳","value":20},{"name":"景德镇","value":17},{"name":"汉中","value":9},{"name":"洛阳","value":10},{"name":"遵义","value":15},{"name":"南京","value":5}]};

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value * 10)
            });
        }
    }
    return res;
};

var option = {
    backgroundColor: 'transparent',
    title: {
        text: '玉溪（软）二维码营销实时播报大屏',
        subtext: '成聚移动技术支持',
        sublink: 'http://',
        left: 'center',
        show: false,
        textStyle: {
            color: '#fff'
        }
    },
    tooltip : {
        formatter: function(key, value) {
            return key.name + "：" + ((key.data.value[2])/10)
        },
        trigger: 'item',
        show: true
    },
    legend: {
        orient: 'vertical',
        y: 'bottom',
        x:'right',
        data:['扫码量'],
        show: false,
        textStyle: {
            color: '#fff'
        }
    },
    geo: {
        map: 'china',
        label: {
            emphasis: {
                show: false
            }
        },
        roam: true,
        //zoom: 2.3,
        //center: [113,27],
        itemStyle: {
            normal: {
                areaColor: '#7976ac',//'#27273B',// 地图背景色的颜色设置
                borderColor: '#111'
            },
            emphasis: {
                areaColor: '#413e76'//'#2a333d'
            }
        }
    },
    series : [
        {
            name: '扫码量',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data.list),
            symbolSize: function (val) {
                return val[2] / 20;
            },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#ddb926'
                }
            }
        },
        {
            name: 'Top 20',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data.list.sort(function (a, b) {
                return b.value - a.value;
            }).slice(0, 20)),
            symbolSize: function (val) {
                return val[2] / 50;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#f4e925',
                    shadowBlur: 60,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        }
    ]
};

if (option && typeof option === "object") {
    echart.setOption(option, true);
}

getMapData(map_url);
function getMapData(map_url) {
    $.ajax({
        url: map_url,
        success: function(res) {
            var code = res.code;
            if ( code == 1 ) {
                res = res.context.list;
                option.series = [
                    {
                        data: convertData(res),
                    },
                    {
                        data: convertData(res.sort(function (a, b) {
                            return b.value - a.value;
                        }).slice(0, 100))
                    }
                ]
                echart.setOption(option);
            }
            else {
                ajaxFail(res, code)
            }
        }
    })
}

setInterval(function(){
    getMapData(map_url)
}, minute/3);

function ajaxFail(res, code) {
    alert(res.msg + '\r\n' + res.code);
}

$('#enlarge').on('click', function(){
    $('.content').addClass('fixed');
    $(this).addClass('invisible');
    $('#shrink').removeClass('invisible');
});

$('#shrink').on('click', function(){
    $('.content').removeClass('fixed');
    $(this).addClass('invisible');
    $('#enlarge').removeClass('invisible');
});

// 滚动
var _wrap = $('#list');//定义滚动区域
var _interval = 3000;//定义滚动间隙时间
var _moving;//需要清除的动画
_moving = setInterval(function () {
    // 如果只有一条数据就不滚动了
    if (_wrap.children().length <= 1) {
        //clearInterval(_moving);
        return;
    }
    var _field = _wrap.find('li:first');//此变量不可放置于函数起始处,li:first取值是变化的
    var _h = _field.height();//取得每次滚动高度(多行滚动情况下,此变量不可置于开始处,否则会有间隔时长延时)
    _field.animate({
        marginTop: -_h
    }, 600, function () {//通过取负margin值,隐藏第一行
        _field.css('marginTop', 0).appendTo(_wrap);//隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
    });
}, _interval);//滚动间隔时间取决于_interval


// var _ele = $('.top20cities');//定义滚动区域
var _first = $('.qrcode-time');
var _second = $('.winner-number');
var _time = 10000;//定义滚动间隙时间
var _scrolling;//需要清除的动画
_scrolling = setInterval(function () {
    // var _field = _ele.find('.city-wrap:first');//此变量不可放置于函数起始处,li:first取值是变化的
    var _firstField = _first.find('.city-wrap:first');
    var _secondField = _second.find('.city-wrap:first');
    // var _h = _field.height();//取得每次滚动高度(多行滚动情况下,此变量不可置于开始处,否则会有间隔时长延时)
    var _firstH = _firstField.height();
    var _secondH = _secondField.height();
    _firstField.animate({
        marginTop: -_firstH
    }, 600, function () {
        _firstField.css('marginTop', 0).appendTo(_first);
    });
    _secondField.animate({
        marginTop: -_secondH
    }, 600,function () {
        _secondField.css('marginTop', 0).appendTo(_second);
    });
    // _field.animate({
    //     marginTop: -_h
    // }, 600, function () {//通过取负margin值,隐藏第一行
    //     _field.css('marginTop', 0).appendTo(_ele);//隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
    // })
}, _time);//滚动间隔时间取决于_interval

// $('.top20cities').animate({'scrollTop': '30px'})

// var weeks = ["日", "一", "二", "三", "四", "五", "六"];
// var jD_date = $("#date");
// var jD_week = $("#week");
// var jD_time = $("#time");
// function showTime() {
//     var date = new Date();
//     var _weeks = weeks;
//     var dateFormatter = {
//         "Y": date.getFullYear(), //月份
//         "M": date.getMonth() + 1, //月份
//         "d": date.getDate(), //日
//         "h": date.getHours(), //小时
//         "m": (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(), //分
//         "s": (date.getSeconds() < 10 ? "0" : "") + date.getSeconds(), //秒
//         "w": date.getDay(), //星期
//     };
//     jD_date.html(
//             dateFormatter.Y + "年" +
//             dateFormatter.M + "月" +
//             dateFormatter.d + "日"
//     )
//     jD_week.html("星期" + _weeks[dateFormatter.w])
//     jD_time.html(dateFormatter.h + ":" + dateFormatter.m + ":" +
//             dateFormatter.s);
//     date = null;
//     dateFormatter = null;
//     _weeks = null;
//     setTimeout(showTime, 1000);
// }
// $(function () {
//     showTime();
// })
