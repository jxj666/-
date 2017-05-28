// 节流器
function throttle(method, context) {
    clearTimeout(method.timer);
    method.timer = window.setTimeout(function () {
        method.call(context);
    }, 300);
}
// map方法兼容
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. 将O赋值为调用map方法的数组.
        var O = Object(this);

        // 2.将len赋值为数组O的长度.
        var len = O.length >>> 0;

        // 3.如果callback不是函数,则抛出TypeError异常.
        if (Object.prototype.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 4. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 5. 创建新数组A,长度为原数组O长度len
        A = new Array(len);

        // 6. 将k赋值为0
        k = 0;

        // 7. 当 k < len 时,执行循环.
        while (k < len) {

            var kValue, mappedValue;

            //遍历O,k为原数组索引
            if (k in O) {

                //kValue为索引k对应的值.
                kValue = O[k];

                // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
                mappedValue = callback.call(T, kValue, k, O);

                // 返回值添加到新数组A中.
                A[k] = mappedValue;
            }
            // k自增1
            k++;
        }

        // 8. 返回新数组A
        return A;
    };
}
// 功能:停止事件冒泡
function stopBubble(e) {
    // 如果提供了事件对象，则这是一个非IE浏览器
    if (e && e.stopPropagation) {
        // 因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    }
    else {
        // 否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
    }
}

// 功能：阻止事件默认行为
function stopDefault(e) {
    // 阻止默认浏览器动作(W3C)
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    else {
        // IE中阻止函数器默认动作的方式
        window.event.returnValue = false;
    }
    return false;
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

$(function () {
    App.init();
    /**
     * NAME: Bootstrap 3 Multi-Level by Johne
     * This script will active Triple level multi drop-down menus in Bootstrap 3.*
     */
    $('li.dropdown-submenu').on('click', function (event) {
        event.stopPropagation();
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
        } else {
            $('li.dropdown-submenu').removeClass('open');
            $(this).addClass('open');
        }
    });
    $('[data-tz="logout"]').click(function () {
        $.cookie('refer_tzCookie', window.location.href, {path: '/', domain: '.taozuike.com'});
        window.sessionStorage && window.sessionStorage.clear();
        // Clear all keys
        store.clearAll();
        window.location.href = '/logout';
    });

    $('[data-click="edit"]').click(function () {
        $('#edit-password').modal('show');
    });
// 修改密码
    $('#edit-password').on('hidden.bs.modal', function () {
        $(this).parsley().reset();
        $(this)[0].reset();
    }).parsley().on('form:submit', function () {
        var oldPasswd = $('#old').val();
        var newPasswd = $('#new').val();
        var confirmPasswd = $('#new-confirm').val();
        $.ajax({
            type: 'POST',
            url: '/org/user/passwd/reset',
            data: {
                oldPasswd: oldPasswd,
                newPasswd: newPasswd,
                confirmPasswd: confirmPasswd
            },
            success: function (res) {
                if (res.code === 1) {
                    $('#edit-password').modal('hide');
                    $('#old').val('');
                    $('#new').val('');
                    $('#new-confirm').val('');
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
        return false;
    });
});
