/**
 * @file 活动页面管理
 */
function getPageList(activityId) {
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    $.ajax({
        url: '/weiop/activity/page-list',
        type: 'GET',
        data: {
            activityId: activityId
        },
        success: function (data) {
            if (data.code === 1) {
                $('tbody').html(tmpl('template_pagelist', data.context));
            }
            else {
                alert(data.msg);
            }
            $('.panel-body-loader').addClass('hide');
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
function pageShow(activityId, pageId) {
    $.ajax({
        url: '/weiop/activity/page/show',
        type: 'GET',
        data: {
            activityId: activityId,
            pageId: pageId
        },
        success: function (data) {
            if (data.code === 1) {
                $('[data-info="pageName"]').html(data.context.pageName);
                $('#pageId').val(data.context.pageId);
                // $('#pageCode').val(data.context.content);
                createEditor();
                editor.setValue(data.context.content);
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
}
function pageUpdate(activityId, pageId, content) {
    content = $.trim(content);
    if (!content) {
        alert('内容不能为空！');
        return;
    }
    $.ajax({
        url: '/weiop/activity/page/update',
        type: 'POST',
        data: {
            activityId: activityId,
            pageId: pageId,
            content: content
        },
        success: function (data) {
            if (data.code === 1) {
                alert('更新成功');
                $('[data-dismiss="modal"]').trigger('click');
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
}

var editor;
ace.require("ace/ext/old_ie");
ace.require("ace/ext/language_tools");
function createEditor(minLines, maxLines) {
    $('.editor-container').html('<div id="editor"></div>');
    editor = ace.edit('editor');
    editor.$blockScrolling = Infinity;
    editor.setFontSize(14);
    editor.session.setMode('ace/mode/html');
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        minLines: minLines ? minLines : 5,
        maxLines: maxLines ? maxLines : 25
    });
    editor.setTheme('ace/theme/monokai');
}

$(function () {
    var $activityId = $('#activityId');
    if ($activityId.val() === '-1') {
        store.remove('activityStatId');
        return;
    }
    // 初始进入加载页面列表
    store.get('activityStatId') && $activityId.val(store.get('activityStatId'));

    getPageList($activityId.val());
    // 选择活动加载页面列表
    $activityId.change(function () {
        getPageList($(this).val());
        store.set('activityStatId', $(this).val());
    });
    // 获取代码
    $('tbody').on('click', '[data-tz="show"]', function () {
        pageShow($activityId.val(), $(this).data('pageid'));
    });
    // 更新代码
    $('#form').on('hidden.bs.modal', function () {
        $(this).parsley().reset();
        $(this)[0].reset();

        $('#editor').remove();

        $('[data-info="pageName"]').html('编辑');
        $('#form [data-tz=update]').attr('type', 'submit');
    })
        .parsley().on('form:submit', function () {
        $('#form [data-tz=update]').attr('type', 'button');
        pageUpdate($activityId.val(), $('#pageId').val(), editor.getValue());
        return false;
    });
    // 清空
    $('[data-tz="reset"]').click(function () {
        editor.setValue('');
    });
});
