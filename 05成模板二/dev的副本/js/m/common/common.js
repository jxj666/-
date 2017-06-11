/**
 * @file 通用js
 */
// 节流器
function throttle(method, context) {
    clearTimeout(method.timer);
    method.timer = window.setTimeout(function () {
        method.call(context);
    }, 300);
}

/*把表单转成json,并且name为key,value为值*/
jQuery.fn.extend({
    serializeObject: function () {
        var a, o, h, i, e;
        a = this.serializeArray();
        o = {};
        h = o.hasOwnProperty;
        for (i = 0; i < a.length; i++) {
            e = a[i];
            if (!h.call(o, e.name)) {
                o[e.name] = e.value;
            }
        }
        return o;
    }
});

// ajax错误处理
function ajaxFail(XMLHttpRequest, textStatus, errorThrown) {
    if (XMLHttpRequest.status === 0) {
        alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
        location.reload();
        return;
    }
    alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
}
