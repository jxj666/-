var chushi = ['x12345', 'y12345', 'x12345']
var i = 0;
//初试化,绑定事件
! function() {
    var chuli = [];
    chuli['num'] = chushi.length;
    var k = '';
    for (var j = 0; j < chushi.length; j++) {
        if (j < 10) {
            k = chushi[j] + '0' + j;
        } else {
            k = chushi[j] + j;
        }
        chuli['K' + j] = k
    }
    xianshi(chuli)
    $('.shu_b').on('click', function() {
        if ($('.shu_k').val() != '') {
            tianjia($('.shu_k').val(), chuli);
        } else {
            alert('输入不可为空')
        }
    })
    $('.shuchu ul').on('click','a', function(ev) {
        var ev = ev || window.event;
        var target = ev.target || ev.srcElement;
        var $t = $(target)
        shanchu($t.attr('data-k'), chuli)
    })


}()

//显示
function xianshi(arr) {
	console.log(arr);
    var text_html = '';
    var t = arr['num'];
    delete arr['num'];
    for (k in arr) {
        text_html += `<li><span>${arr[k]}</span><a href='javascript:void(0)' data-k="${k}">删除</a></li>`
    }
    arr['num'] = t;
    $('.shuchu ul').html(text_html)
}
//添加
function tianjia(str, arr) {
    var e = parseInt(arr['num']);
    if (e < 10) {
        k = "0" + e;
    } else {
        k = e;
    }
    arr['K' + e] = str + k;
    arr['num'] = e + 1;
    xianshi(arr);
}
//删除
function shanchu(str, arr) {
    delete arr[str];
    xianshi(arr)
}
