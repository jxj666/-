/**
 *@file 模块管理
 */
var isAdd = true;
$(function () {
    $('#modal-module').on('show.bs.modal', function (e) {
        if ($(e.relatedTarget).data('tz') === 'modify') {
            isAdd = false; // 修改
            $(this).find('.modal-title').html('修改模块');
            var tr = $(e.relatedTarget).closest('tr');
            $('#type').val(tr.find('.show_type').text());
            $('#name').val(tr.find('.show_name').text());
            $('#desc').val(tr.find('.show_desc').text());
            $('#modalId').val($(e.relatedTarget).data('value'));
        }
        else if ($(e.relatedTarget).data('tz') === 'addMoudal') {
            isAdd = true;
            $(this).find('.modal-title').html('添加模块');
        }
    }).on('hidden.bs.modal', function () {
        $(this)[0].reset();
        $(this).parsley().reset();
    }).parsley().on('form:submit', function () {
        if (isAdd) {
            // 添加模块
            $.post('/org/module/add', {
                mtype: $('#type').val(),
                name: $('#name').val(),
                desc: $('#desc').val()
            }).done(function (data) {
                if (data.code === 1) {
                    location.reload();
                }
                else {
                    alert(data.msg);
                }
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status === 0) {
                    alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
                    location.reload();
                    return;
                }
                alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
            });
        }
        else {
            // 修改模块
            $.post('/org/module/update', {
                id: $('#modalId').val(),
                mtype: $('#type').val(),
                name: $('#name').val(),
                desc: $('#desc').val()
            }).done(function (data) {
                if (data.code === 1) {
                    location.reload();
                }
                else {
                    alert(data.msg);
                }
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status === 0) {
                    alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
                    location.reload();
                    return;
                }
                alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
            });
        }
        return false;
    });
});
