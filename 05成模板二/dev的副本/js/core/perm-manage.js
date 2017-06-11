/**
 * @file 权限管理
 */

$(function () {
//    <#-------------------------修改模块------------start------------------------>
    $('[data-tz=modify]').click(function () {
        var tr = $(this).parent().parent();
        var permModify = $('#perm_modify');
        permModify.find('.modify_perm').attr('value', tr.find('.show_perm').text());
        permModify.find('.modify_name').attr('value', tr.find('.show_name').text());
        permModify.find('.modify_module').attr('value', tr.find('.show_module').text());
        permModify.find('.modify_uid').attr('value', $(this).attr('data-value'));
        $('.selectpicker').selectpicker('refresh');
    });

    $('[data-tz=send_modifyPerm]').click(function () {
        var permModify = $('#perm_modify');
        var data = {
            id: permModify.find('.modify_uid').val(),
            perm: permModify.find('.modify_perm').val(),
            name: permModify.find('.modify_name').val(),
            module: permModify.find('.modify_module').find('option:selected').val()
        };
        $.ajax({
            url: '/org/perm/update',
            data: data,
            dataType: 'json',
            type: 'post',
            success: function (data) {
                if (data.code === 1) {
                    window.location.reload();
                }
                else {
                    alert(data.msg);
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
    });

//    <#-------------------------修改模块------------end------------------------>
//
//    <#-------------------------添加模块------------start------------------------>
    $('[data-tz=addPerm]').click(function () {
        var permAdd = $('#perm_add');
        permAdd[0].reset();
    });

    $('[data-tz=send_addPerm]').click(function () {
        var permAdd = $('#perm_add');
        var data = {
            perm: permAdd.find('.add_perm').val(),
            name: permAdd.find('.add_name').val(),
            module: permAdd.find('.add_module').find('option:selected').val()
        };
        $.ajax({
            url: '/org/perm/add',
            data: data,
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                if (data.code === 1) {
                    window.location.reload();
                }
                else {
                    alert(data.msg);
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
    });

//    <#-------------------------添加模块------------end------------------------>
});
