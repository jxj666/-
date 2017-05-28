/**
 * @file 活动编辑
 */
var activityIdReg = /(\\?|\\&)activityId=([^&?#]*)/ig;
var params = location.hash;
var activityId = params.match(activityIdReg) ? params.match(activityIdReg).join('').split('=')[1] : false;
// 日期插件
function dateTimePicker() {
    $('#begin_time').datetimepicker({
        format: 'l'
    });
    $('#end_time').datetimepicker({
        format: 'l'
    });
    $('#begin_time').on('dp.change', function (e) {
        $('#end_time').data('DateTimePicker').minDate(moment(e.date).add(1, 'hour'));
    });
    $('#end_time').on('dp.change', function (e) {
        $('#begin_time').data('DateTimePicker').maxDate(moment(e.date).subtract(1, 'hour'));
    });
}
// appid
function appid2compAppid() {
    $('#paramsContent').on('change', '#appid', function () {
        $('#comp_appid').val($(this).find('option:selected').data('compappid'));
    });
}
// 上传图片
$('#content').on('change', '[data-tz="imgUpload"]', function () {
    var $this = $(this);
    var formData = new FormData();
    formData.append('file', this.files[0]);
    var channel = $this.data('channel');
    formData.append('channel', channel);
    $.ajax({
        url: '/op/storage/upload',
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json'
    }).done(function (res) {
        var code = res.code;
        if (code === 1) {
            var url = res.context.url;
            if (url) {
                $this.parent().next('[type="hidden"]').val(url);
                $this.prev().remove();
                $('<div class="pic"><img src=' + url + '></div>').insertBefore($this);
                var iframeTar = $this.data('iframe');
                if (iframeTar) {
                    $(document.getElementById('iframe1').contentWindow.document.body).find(iframeTar).attr('src', url);
                }
                var selTar = $this.data('seltar');
                if (selTar) {
                    $(selTar).find('option:selected').attr('data-image', url);
                }
            }
        }
        else {
            alert(code + '\r\n' + res.message);
        }
    }).fail(function (res) {
        alert('上传失败!请重试');
    });
})
    .focus(function () {
        var iframeTar = $(this).data('iframe');
        var offsetTop = $(document.getElementById('iframe1').contentWindow.document.body).find(iframeTar).offset().top - 60;// 60是大喇叭的高度
        $(document.getElementById('iframe1').contentWindow.document.body).animate(
            {scrollTop: offsetTop}
            , 500);
    });
$('#content').on('change', '[type = "url"]', function () {
    var $target = $(this).parent().find('.pic img');
    if ($target.length > 0) {
        $target.attr('src', $(this).val());
    }
});

// ace插件
ace.require('ace/ext/old_ie');
ace.require('ace/ext/language_tools');
function createEditor(parent, id, mode, minLines, maxLines) {
    parent && $(parent).html('<pre id=' + id + '></pre>');
    var editor = ace.edit(id);
    editor.setTheme('ace/theme/monokai');
    editor.$blockScrolling = Infinity;
    editor.setFontSize(14);
    editor.session.setMode('ace/mode/' + mode);
    // editor.setAutoScrollEditorIntoView(true);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        minLines: minLines ? minLines : 5,
        maxLines: maxLines ? maxLines : 25
    });
    return editor;
}

// 存放ace的editor
var ruleAceObj = {};

var paramsObj = {
    progress: 0,
    upLoadBatchParams: function () { // 上传活动自有参数
        var that = this;
        $('#batchParams').parsley().on('form:submit', function () {
            var data = $('#batchParams').serializeObject();
            Pace.restart();
            $.ajax({
                url: '/acms/act/param/updatebatch/' + activityId,
                type: 'POST',
                data: data,
                success: function (data) {
                    if (data.code === 1) {
                        that.progress += 50;
                        if (that.progress === 100 || $('#batchParams').length <= 0) {
                            that.successModal(data.context);
                        }
                    }
                    else {
                        that.init();
                        alert(data.msg);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (XMLHttpRequest.status === 0) {
                        alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
                        location.reload();
                        return;
                    }
                    that.init();
                    alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
                }
            });
            return false;
        }).on('form:error', function () {
            // This global callback will be called for any field that fails validation.
            /* var target = $(this.$element).data('name');
             alert('"' + target + '" 验证不通过');*/
            that.init();
            var target = $(this.$element).find('.parsley-error').eq(0).data('name');
            alert('"' + target + '" 验证不通过');
        });
    },
    upLoadBaseParams: function () { // 上传活动基本参数
        var that = this;
        $('#baseParams').parsley().on('form:submit', function () {
            var data = $('#baseParams').serializeObject();
            Pace.restart();
            $.ajax({
                url: '/acms/act/base/update/' + activityId,
                type: 'POST',
                data: data,
                success: function (data) {
                    if (data.code === 1) {
                        that.progress += 50;
                        if (that.progress === 100) {
                            that.successModal(data.context);
                        }
                    }
                    else {
                        that.init();
                        alert(data.msg);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (XMLHttpRequest.status === 0) {
                        alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
                        location.reload();
                        return;
                    }
                    that.init();
                    alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
                }
            });
            return false;
        }).on('form:error', function () {
            that.init();
            var target = $(this.$element).find('.parsley-error').eq(0).data('name');
            alert('"' + target + '" 验证不通过');
        });
    },
    successModal: function (data) {
        var fromReg = /(\\?|\\&)from=([^&?#]*)/ig;
        var from = params.match(fromReg) ? params.match(fromReg).join('').split('=')[1] : false;
        if (from === 'template') {
            this.init();

            $('#modal-success img.media-object').attr('src', '/acms/act/qr?activityId=' + data.activityId);
            $('#modal-success [data-info=activityName]').html(data.name);
            $('#modal-success [data-info=activityTime]').html(data.createTime + ' - ' + data.endTime);
            $('#modal-success [data-info=statUrl]').attr('href', '#/weiop/activity/stat?activityId=' + data.activityId);
            $('#modal-success').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    },
    init: function () {
        this.progress = 0;
    }
};

function getPageList(activityId) {  // 获取页面列表
    if (!activityId) {
        return;
    }
    Pace.restart();
    $.get('/acms/act/get/' + activityId).done(function (data) {
        if (data.code === 1) {
            // 页面列表
            if (data.context.pages.length > 0) {
                data.context.pages.sort(function (a, b) {
                    return a.idx - b.idx;
                });
            }
            $('#pagelist').html(tmpl('template_pagelist', data.context));

            $('[data-info=pageId]').html($('[data-pageid].active').data('pageid'));

            if (data.context.pages && data.context.pages.length > 0) {
                // 删除页面
                $('[data-tz=deletePage]').click(function (e) {
                    stopBubble(e); // 阻止冒泡
                    if (window.confirm('删除页面后将不可恢复，确认删除？')) {
                        var pageId = $(this).closest('li').data('pageid');
                        if (!pageId) {
                            return;
                        }
                        $.post('/acms/act/remove/page/' + activityId + '/' + pageId).done(function (data) {
                            if (data.code === 1) {
                                alert('删除页面成功');
                                getPageList(activityId);
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
                });
            }

            // 规则编辑
            var rulelist = data.context.rule;
            if (!$.isEmptyObject(rulelist)) {
                for (var key in rulelist) {
                    if (rulelist.hasOwnProperty(key)) {
                        var parent = '#editor' + key + 'Container';
                        if ($(parent).length > 0) {
                            var id = 'editor' + key;
                            ruleAceObj[id] = createEditor(parent, id, 'javascript');
                            ruleAceObj[id].session.setValue(String(rulelist[key])); // value必须是字符串类型

                            editorChange(ruleAceObj[id]);// 绑定change事件
                        }
                    }
                }
                $('#ruleList [data-toggle=tab]').eq(0).trigger('click');
            }
            else {
                $('#ruleList').html('<li>暂时未定义规则</li>');
                $('#tab-edit_rule').html('');
            }
            // 参数编辑
            $('#paramsTitle').html('');
            $('#paramsContent').html('<form id="batchParams" class="form-horizontal"><button type="submit" class="hidden" data-tz="save">保存</button></form>');
            $('#groupList').html('');
            $('#tab-edit_params').html('');

            if (data.context.activity.paramsMap && !$.isEmptyObject(data.context.activity.paramsMap)) {
                var paramsMap = data.context.activity.paramsMap;
                for (var key in paramsMap) {
                    if (paramsMap.hasOwnProperty(key)) {
                        // 参数保存
                        $('#paramsTitle').append('<li><a href="#' + key + '" data-tz="tab">'
                            + key + '</a></li>');
                        $('#batchParams').append('<div class="tab-pane fade" id="' + key + '"></div>');
                        $('#' + key).html(tmpl('template_paramsInput', {paramsInput: paramsMap[key]}));

                        // 参数编辑
                        $('#groupList').append('<li><a href="#' + key + 'Group" data-toggle="tab">'
                            + key + '</a></li>');
                        $('#tab-edit_params').append('<div class="tab-pane fade" id="' + key + 'Group">'
                            + '<div class="dataTables_wrapper form-inline dt-bootstrap no-footer ">'
                            + '<div class="row">'
                            + '<div class="col-sm-12">'
                            + '<table class="table table-striped  table-condensed dataTable no-footer dtr-inline collapsed table-hover" role="grid">'
                            + '<thead>'
                            + '<tr>'
                            + '<th>参数名称</th> <th>参数值</th> <th>显示名称</th> <th>验证正则</th> <th>是否必须</th> <th>错误信息</th> <th>帮助信息</th> <th>操作</th>'
                            + '</tr>'
                            + '</thead>'
                            + '<tbody></tbody>'
                            + '</table> </div> </div>'
                            + '<div class="fade in panel-body-loader hide"><span class="spinner"></span></div> </div>'
                            + '</div>');
                        $('#' + key + 'Group tbody').html(tmpl('template_paramsGroup', {paramsInput: paramsMap[key]}));
                    }
                }
            }
            else {
                // $('#paramsTitle').html('暂无数据');
                $('#paramsContent').html('');
                $('#groupList').html('暂无数据');
                $('#tab-edit_params').html('暂无数据');
            }
            $('#paramsTitle').prepend('<li class="active"><a href="#baseParams" data-tz="tab">基础配置</a></li>');
            $('#paramsContent').prepend($('#configTemplate').html());
            $('.selectpicker').selectpicker('refresh');

            paramsObj.init();
            $('#batchParams').length > 0 ? paramsObj.upLoadBatchParams() : (paramsObj.progress += 50);
            paramsObj.upLoadBaseParams();

            // paramsTitle模拟tab效果
            $('#paramsTitle').on('click', '[data-tz=tab]', function (e) {
                stopDefault(e); // 阻止默认行为
                if (!$(this).closest('li').hasClass('active')) {
                    $('#paramsTitle [data-tz=tab]').each(function () {
                        $(this).closest('li').removeClass('active');
                        var target = $(this).attr('href');
                        $(target).removeClass('active in');
                    });
                    $(this).closest('li').addClass('active');
                    var target = $(this).attr('href');
                    $(target).addClass('active in');
                }
            });


            dateTimePicker();
            appid2compAppid();

            $('#groupList [data-toggle=tab]').eq(0).trigger('click');
            // iframe
            $('[data-pageid]').eq(0).trigger('click');
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
function editorChange(editor) { // 定义change事件
    editor.on('change', function (e) {
        var $target = $(editor.container);
        $target.attr('data-change', true);// 标识change
    });
}
function getPageHTML(editor, src) {
    $('#pageEdit .panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    src = src || '/acms/act/getpage/' + activityId + '/' + $('[data-pageid].active').data('pageid');
    $.get(src).done(function (data) {
        editor.session.setValue(data);
        $('#pageEdit .panel-body-loader').addClass('hide');
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status === 0) {
            alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
            location.reload();
            return;
        }
        alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
    });
}

// 保存HTML
function pageUpdate(content, pageId, editor) {
    $('#pageEdit .panel-body-loader.hide').removeClass('hide');
    content = content || editor.getValue();
    content = $.trim(content);
    if (!content) {
        if (!window.confirm('内容为空,确定要保存？')) {
            return;
        }
    }
    Pace.restart();
    pageId = pageId || $('[data-pageid].active').data('pageid');
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
                $('#pageEdit .panel-body-loader').addClass('hide');
                $('#editor').removeAttr('data-change');
                var src = '/acms/act/getpage/' + activityId + '/' + $('[data-pageid].active').data('pageid');
                iframeInject(src);
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

$(function () {
    var editor = createEditor('.editor-container', 'editor', 'html'); // 创建页面编辑ace
    editorChange(editor);
    // 点击加载页面列表
    $('#pagelist').on('click', '[data-pageid]', function () {
        if (!$(this).hasClass('active')) {
            // 切换tab
            $('[data-pageid].active').removeClass('active');
            $(this).addClass('active');
            var pageId = $(this).data('pageid');
            $('[data-info=pageId]').html(pageId);
            var src = '/acms/act/getpage/' + activityId + '/' + pageId;
            // 图形编辑
            iframeInject(src);

            // 页面编辑
            getPageHTML(editor, src);
        }
    });

    getPageList(activityId); // 获取页面列表
    // 新增页面
    var addPageEditor = createEditor(null, 'addPageContent', 'html');
    $('#modal-addPage').on('hidden.bs.modal', function () {
        $(this).parsley().reset();
        $(this)[0].reset();
        addPageEditor.session.setValue('');
    }).parsley().on('form:submit', function () {
        var content = $.trim(addPageEditor.getValue());
        if (content.length <= 0) {
            alert('页面内容不能为空！');
            addPageEditor.focus();
            return false;
        }
        Pace.restart();
        var data = $('#modal-addPage').serializeObject();
        data.content = content;
        $.post('/acms/act/page/add/' + activityId, data).done(function (data) {
            if (data.code === 1) {
                alert('新增页面成功');
                getPageList(activityId);
                $('[data-dismiss=modal]').trigger('click');
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
        return false;
    });

    // 点击代码编辑
    $('[data-toggle=tab][href=#pageEdit]').on('click', function () {
        if (!$(this).hasClass('active')) {
            // 编辑界面tab切换
            $('[data-toggle=tab].active').removeClass('active');
            $(this).addClass('active');

            $('[data-tz=alertSave][href=#phoneEdit].hide').removeClass('hide'); // 显示返回按钮
            $('#toSave').show(); // 显示保存按钮

            getPageHTML(editor);
        }
    });
    // 代码编辑保存
    $('#pageEdit [data-tz=save]').click(function () {
        pageUpdate(editor.getValue());
    });
    // 点击"返回"图形编辑
    $('[data-tz=alertSave][href=#phoneEdit]').on('click', function (e) {
        stopDefault(e); // 阻止事件默认行为
        if (!$(this).hasClass('active')) {
            // 离开时提示保存
            if ($('#tab-edit_main>.tab-pane.active.in [data-tz=save]').length > 0) { // 单编辑框页面
                if ($('#tab-edit_main>.tab-pane.active.in [data-change=true]').length > 0) { // 被修改过
                    if (window.confirm('页面代码被修改过，点击"确定"保存')) {
                        $('#tab-edit_main>.tab-pane.active.in [data-tz=save]').trigger('click');
                    }
                }
            }
            else if ($('#tab-edit_rule [data-tz=itemSave]').length > 0) { // 规则编辑页面
                if ($('#tab-edit_rule [data-change=true]').length > 0) { // 被修改过
                    if (window.confirm('规则被修改过，点击"确定"保存')) {
                        $('#tab-edit_rule [data-change=true]').each(function () {
                            $(this).parent().next('[data-tz=itemSave]').trigger('click');
                        });
                    }
                }
            }
            $('.gallery-option-set [data-toggle=tab].active').removeClass('active');
            $(this).tab('show');
            $('[data-tz=alertSave][href=#phoneEdit]').addClass('hide'); // 隐藏返回按钮
            $('#toSave').show(); // 显示保存按钮

            closeEditContainer(); // 关闭编辑框
            var src = '/acms/act/getpage/' + activityId + '/' + $('[data-pageid].active').data('pageid');
            iframeInject(src);
        }
    });

    // 点击规则编辑
    $('[data-toggle=tab][href=#ruleEdit]').on('click', function () {
        if (!$(this).hasClass('active')) {
            // 编辑界面tab切换
            $('[data-toggle=tab].active').removeClass('active');
            $(this).addClass('active');

            $('[data-tz=alertSave][href=#phoneEdit].hide').removeClass('hide'); // 显示返回按钮
            $('#toSave').show(); // 显示保存按钮
        }
    });
    // 点击参数编辑
    $('[data-toggle=tab][href=#parameEdit]').on('click', function () {
        if (!$(this).hasClass('active')) {
            // 编辑界面tab切换
            $('[data-toggle=tab].active').removeClass('active');
            $(this).addClass('active');

            $('[data-tz=alertSave][href=#phoneEdit].hide').removeClass('hide'); // 显示返回按钮
            $('#toSave').hide(); // 隐藏保存按钮

        }
    });

    // 规则保存
    $('#tab-edit_rule').on('click', '[data-tz=itemSave]', function () {
        Pace.restart();
        var type = $(this).data('type');
        var id = $(this).prev('div').find('pre').prop('id');
        var rule = ruleAceObj[id].getValue();
        $.post('/acms/act/rule/update/' + activityId, {type: type, rule: rule}).done(function (data) {
            if (data.code === 1) {
                var rule = data.context;
                $('#editor' + rule).removeAttr('data-change');
                alert(data.context + '保存成功');
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
    });
    // 保存按钮
    +function toSaveFun() {
        $('#toSave').click(function () {
            $('#tab-edit_main>.tab-pane.active.in [data-tz=save]').length > 0 ? $('#tab-edit_main>.tab-pane.active.in [data-tz=save]').trigger('click') :
                $('#tab-edit_rule [data-tz=itemSave]').length > 0 && $('#tab-edit_rule [data-change=true]').parent().next('[data-tz=itemSave]').trigger('click')
        });
    }();
// 另存为模板
    $('#modal-savetmpl').on('hidden.bs.modal', function () {
        $(this).parsley().reset();
        $(this)[0].reset();
    }).parsley().on('form:submit', function () {
        Pace.restart();
        var data = $('#modal-savetmpl').serializeObject();
        $.post('/acms/tmpl/savetmpl/' + activityId, data).done(function (data) {
            if (data.code === 1) {
                alert('保存成功，可以到"模板管理"界面查看');
                $('[data-dismiss=modal]').trigger('click');
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
        return false;
    });

// 参数编辑
    $('#modal-params').on('hidden.bs.modal', function () {
        $(this).parsley().reset();
        $(this)[0].reset();
    }).on('show.bs.modal', function (e) {
        var $target = $(e.relatedTarget);

        if ($target.data('tz') === 'addParam') {
            $(this).find('[type=submit]').attr('data-status', 'add'); // 新增
        }
        else {
            var $tr = $target.closest('tr');
            $(this).find('[type=submit]').attr('data-status', 'update'); // 更新
            $(this).find('[name=key]').val($tr.find('[data-name]').data('name'));
            $(this).find('[name=value]').val($tr.find('[data-value]').data('value'));
            $(this).find('[name=group]').val($tr.find('[data-group]').data('group'));
            $(this).find('[name=name]').val($tr.find('[data-displayname]').data('displayname'));
            $(this).find('[name=regex]').val($tr.find('[data-regex]').data('regex'));
            $(this).find('[name=required]').val(String($tr.find('[data-required]').data('required')));
            $(this).find('[name=err_msg]').val($tr.find('[data-err_msg]').data('err_msg'));
            $(this).find('[name=help]').val($tr.find('[data-help]').data('help'));

            $('.selectpicker').selectpicker('refresh');
        }
    }).parsley().on('form:submit', function () {
        Pace.restart();
        var data = $('#modal-params').serializeObject();
        console.log(data);
        var updateStatus = $('#modal-params [type=submit]').attr('data-status');
        if (updateStatus === 'add') {
            $.post('/acms/act/param/add/' + activityId, data).done(function (data) {
                if (data.code === 1) {
                    alert('添加成功');
                    getPageList(activityId);
                    $('[data-dismiss=modal]').trigger('click');
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
        else if (updateStatus === 'update') {
            $.post('/acms/act/param/updatemeta/' + activityId, data).done(function (data) {
                if (data.code === 1) {
                    alert('更新成功');
                    getPageList(activityId);
                    $('[data-dismiss=modal]').trigger('click');
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
// 删除一个参数
    $('#tab-edit_params').on('click', '[data-tz=removeParam]', function () {
        if (window.confirm('删除后将不可恢复!确定要删除？')) {
            Pace.restart();
            var key = $(this).closest('tr').find('[data-name]').data('name');
            $.post('/acms/act/param/remove/' + activityId + '/' + key).done(function (data) {
                if (data.code === 1) {
                    // alert('删除成功');
                    getPageList(activityId);
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
    });

    // 全屏编辑
    $('[data-tz=content-expand]').click(function () {
        var $target = $('#content');
        if ($('body').hasClass('panel-expand') && $target.hasClass('panel-expand')) {
            $('body').removeClass('panel-expand');
            $target.removeClass('panel-expand');
            $(this).html('<i class="fa fa-expand m-r-5"></i>全屏编辑');
        }
        else {
            $('body').addClass('panel-expand');
            $target.addClass('panel-expand');
            $(this).html('<i class="fa fa-compress m-r-5"></i>退出全屏');
        }
        $(window).trigger('resize');
    });
});
// 拖动条
/*$('[data-level] input').ionRangeSlider({
 /!* min: 0,
 max: 100,*!/
 from: 0,
 to: 100,
 type: 'double',
 step: 1,
 prefix: '￥',
 max_postfix: '+',
 prettify: false,
 grid: true,
 grid_num: 5,
 keyboard: true,
 force_edges: true,
 /!* onFinish: function () {
 var to = $(this).data('to');
 var max = $(this).data('max');
 console.log('to:' + to + 'max:' + max);
 if (to >= max) {
 var slider = $(this).data('ionRangeSlider');

 // Call sliders update method with any params
 slider.update({
 max: max - 0 + 100
 });
 }
 }*!/
 })*/


// 奖品图片
/*$('#productName').change(function () {
 var $option = $(this).find('option:selected');
 $('#productDesc').val($option.data('description'));
 $('#quantity').val($option.data('quantity'));
 $('#originPrice').val($option.data('price'));
 $('#limitPrice').val(0);
 $('#productImage').val($option.data('image'))
 .parent().find('img').attr('src', $option.data('image'));

 });*/
