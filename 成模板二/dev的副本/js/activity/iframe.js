/**
 * @file 控制iframe
 */
var myXss = new filterXSS.FilterXSS({
    stripIgnoreTag: true // 去掉标签
});
function closeEditContainer() {
    $('.edit-container .text-edit,.edit-container .img-edit,.edit-container .rule-edit,.edit-container .status-edit,.edit-container .broadcast-edit').hide();
    $('.edit-container').fadeOut();
    // 释放图片编辑事件
    $('.edit-container [type=url]').val('');
    $('.edit-container [type=file]').off();
    $('.edit-container [type=url]').off();
    $('.edit-container .pic img').attr('src', 'https://saascore.oss-cn-beijing.aliyuncs.com/custom/img/common/upload.jpg');

    // 释放文字编辑事件
    $('#textEdit').off().val('');

    // 清空不同状态编辑栏
    $('.edit-container .status-edit #accordion').html('');
    $('.edit-container .status-edit').find('.btn-group').length > 0 && $('.edit-container .status-edit').find('.btn-group').remove();
    // 清空大喇叭编辑栏
    $('.edit-container .broadcast-edit').find('.btn-group').remove();
}
function iframeInject(src) {
    if ($('#iframe').length > 0) {
        $('#iframe').remove();
    }

    var iframeEle = $('<iframe id="iframe" seamless frameborder="0" width="325" height="455" scrolling="auto" src =' + src + '>你的浏览器不支持iframe</iframe>');
    $('.content-container').prepend(iframeEle);

    $('#iframe').on('load', function () {
            var iframeTarget = null;
            var ifrDoc = $('#iframe')[0].contentWindow.document;
            // 注入js
            var scriptEle = document.createElement('script');
            scriptEle.type = 'text/javascript';
            $(ifrDoc).find('body').append(scriptEle);
            scriptEle.src = '//saascore.oss-cn-beijing.aliyuncs.com/custom/js/activity/iframe-js.min.js';
            // 注入css
            $(ifrDoc).find('head')
                .append($('<link rel="stylesheet" href="//saascore.oss-cn-beijing.aliyuncs.com/custom/css/activity/iframe-ui.min.css"/>'));

            // 取消编辑按钮
            cancelEdit();
            // 保存编辑按钮
            saveEdit();
            // 图片编辑
            $(ifrDoc).find('body').off().on('click', '.iframe-edit_img', function () {
                if ($('.edit-container').is(':hidden')) {
                    var $target = $(this).next('.iframe-img_src');
                    $target.addClass('active');

                    var width = $target.data('width');
                    var height = $target.data('height');

                    $('.edit-container .img-edit').show();
                    if (width && height) {
                        $('.edit-container .img-edit').find('[data-info=img-size]').html(width + '*' + height);
                    }
                    $('.edit-container').fadeIn();
                    changeImage($target);

                    iframeTarget = $target;
                }
            })
            // 背景图片编辑
                .on('click', '.iframe-edit_bgimg', function () {
                    if ($('.edit-container').is(':hidden')) {
                        var $target = $(this).next('.iframe-img_bg');
                        $target.addClass('active');

                        var width = $target.data('width');
                        var height = $target.data('height');

                        $('.edit-container .img-edit').show();
                        if (width && height) {
                            $('.edit-container .img-edit').find('[data-info=img-size]').html(width + '*' + height);
                        }
                        $('.edit-container').fadeIn();
                        changeImage($target, true);

                        iframeTarget = $target;
                    }
                })
                // 文字编辑
                .on('click', '.iframe-txt_editable', function () {
                    if ($('.edit-container').is(':hidden')) {
                        var target = this;
                        var txt = $.trim($(target).addClass('active').text());
                        $('.edit-container .text-edit').show();
                        $('#textEdit').val(txt).keyup(function () {
                            $(target).text(myXss.process($(this).val()));
                        });

                        $('.edit-container').fadeIn();

                        iframeTarget = $(target);
                    }
                })
                // 规则
                .on('click', '.iframe-rule_editable', function () {
                    if ($('.edit-container').is(':hidden')) {
                        var target = this;
                        var txt = $.trim($(target).addClass('active').text());
                        $('.edit-container .text-edit').show();
                        $('#textEdit').val(txt).keyup(function () {
                            $(target).html('');
                            var arr = myXss.process($(this).val().replace('\r', '').split('\n'));
                            $.each(arr, function (i, str) {
                                $(target).append('<li>' + $.trim(str) + '</li>');
                            });
                        });
                        $('.edit-container').fadeIn();

                        iframeTarget = $(target);
                    }
                })
                // 不同状态编辑
                .on('click', '.iframe-status_editable', function () {
                    if ($('.edit-container').is(':hidden')) {
                        var target = this;
                        var html = $.trim($(target).addClass('active').html());
                        $('.edit-container .status-edit').show();
                        var arr = html.split('<!--分隔符勿删-->');
                        $.each(arr, function (i, v) {
                            var reg = /<s[\s\S]*?data-type="status"[\s\S]*?>([\s\S]*?)<\/s>/ig;
                            var name = v.match(reg) ? $(v.match(reg)[0]).text() : '未定义';
                            var sel = $(v.match(/<p[\s\S]*?data-status="[\s\S]*?"[\s\S]*?>/ig)[0]).data('status');
                            var html = '<div class="panel panel-primary overflow-hidden">'
                                + '<div class="panel-heading">'
                                + '<h3 class="panel-title">'
                                + '<a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#accordion" href="' + '#edit-tab-' + sel + '">'
                                + '<i class="fa fa-plus-circle pull-right"></i>'
                                + name
                                + '</a>'
                                + '</h3>'
                                + '</div>'
                                + '<div id="' + 'edit-tab-' + sel + '" class="panel-collapse collapse">'
                                + '<div class="panel-body">'
                                + '<textarea class="form-control" rows="8" '
                                + 'data-attrs="' + name + '"'
                                + 'data-attrp="' + sel + '"'
                                + '>'
                                + $.trim(v.replace(/<p[\s\S]*?data-status="[\s\S]*?"[\s\S]*?>|<\/p\s*?>|<s[\s\S]*?data-type="status"[\s\S]*?>([\s\S]*?)<\/s>/ig, '')
                                    .replace(/<span[\s\S]*?>([\s\S]*?)<\/[\s\S]*?span>/ig, ' {{ $1 }} '))
                                + '</textarea>'
                                + '</div>'
                                + '</div>'
                                + '</div>';
                            $('#accordion').append(html);
                            $('#edit-tab-' + sel + ' textarea').keyup(function () {
                                var value = myXss.process($(this).val()).replace(/\{\{([\s\S]*?)\}\}/ig, function (match, $1) {
                                    var res = '<span data-info="' + $.trim($1) + '">' + $.trim($1) + '</span>';
                                    return res;
                                });
                                $(target).find('[data-status=' + $(this).data('attrp') + ']').html(value);
                            });
                        });

                        // 添加按钮组
                        if ($(ifrDoc).find('[data-type=template-config_status]')) {
                            try {
                                var editObj = eval($(ifrDoc).find('[data-type=template-config_status]').html());
                            }
                            catch (err) {
                                console.info('eval时发生错误了:' + err);
                            }
                            if (editObj && editObj.statusBtn) {
                                $('.edit-container .status-edit').append('<div class="btn-group tab-content-btn"></div>');
                                $.each(editObj.statusBtn, function (index, v) {
                                    $('.edit-container .status-edit .btn-group').append(''
                                        + '<button type="button" data-tz="addStatus" class="btn btn-white" data-class="text-user" data-info="' + v.value + '">'
                                        + v.label
                                        + '</button>');
                                });
                            }


                            $('[data-tz=addStatus]').click(function () {
                                var $target = $('.edit-container .status-edit .collapse.in textarea');
                                // $target.val($target.val() + '<span class="' + $(this).data('class') + '" data-info="' + $(this).data('info') + '">' + $(this).text() + '</span>');
                                $target.val($target.val() + ' {{ ' + $(this).data('info') + ' }} ');
                                var value = myXss.process($target.val()).replace(/\{\{([\s\S]*?)\}\}/ig, function (match, $1) {
                                    var res = '<span data-info="' + $.trim($1) + '">' + $.trim($1) + '</span>';
                                    return res;
                                });

                                $(ifrDoc).find('[data-status=' + $target.data('attrp') + ']').html(value);
                            });
                        }

                        // 点谁出谁
                        $('.edit-container .status-edit [data-toggle=collapse]').click(function () {
                            var target = $(this).attr('href').replace('#edit-tab-', '');
                            $(ifrDoc).find('body').find('.iframe-status_editable [data-status]').hide();
                            $(ifrDoc).find('body').find('.iframe-status_editable [data-status=' + target + ']').show();

                        });
                        $('.edit-container .status-edit [data-toggle=collapse]').eq(0).trigger('click');
                        $('.edit-container').fadeIn();

                        iframeTarget = $(target);
                    }
                })
                // 大喇叭编辑
                .on('click', '.iframe-edit_bc', function () {
                    if ($('.edit-container').is(':hidden')) {
                        var target = this;
                        $('.edit-container .broadcast-edit').show();
                        changeImage($(target).next('.iframe-bc_editable').find('.bc-logo img'));

                        var $textarea = $('.edit-container .broadcast-edit [data-edit="middle"]');
                        var html = myXss.process($(target).next('.iframe-bc_editable').find('.bc-notice li').html().replace(/<span[\s\S]*?>([\s\S]*?)<\/[\s\S]*?span>/ig, ' {{ $1 }} '));
                        $textarea.val(html).keyup(function () {
                            var value = myXss.process($(this).val()).replace(/\{\{([\s\S]*?)\}\}/ig, function (match, $1) {
                                var res = '<span data-info="' + $.trim($1) + '">' + $.trim($1) + '</span>';
                                return res;
                            });
                            $(target).next('.iframe-bc_editable').find('.bc-notice li').html(value);
                        });
                        // 添加按钮组
                        if ($(ifrDoc).find('[data-type=template-bc_middle]')) {
                            try {
                                var editObj = eval($(ifrDoc).find('[data-type=template-bc_middle]').html());
                            }
                            catch (err) {
                                console.info('eval时发生错误了:' + err);
                            }
                            if (editObj && editObj.statusBtn) {
                                $textarea.after('<div class="btn-group tab-content-btn"></div>');
                                $.each(editObj.statusBtn, function (index, v) {
                                    $('.edit-container .broadcast-edit .btn-group').append(''
                                        + '<button type="button" data-tz="bc-notice" class="btn btn-white" data-class="text-user" data-info="' + v.value + '">'
                                        + v.label
                                        + '</button>');
                                });
                            }
                            $('[data-tz="bc-notice"]').click(function () {
                                $textarea.val($textarea.val() + ' {{ ' + $(this).data('info') + ' }} ');
                                var value = myXss.process($textarea.val()).replace(/\{\{([\s\S]*?)\}\}/ig, function (match, $1) {
                                    var res = '<span data-info="' + $.trim($1) + '">' + $.trim($1) + '</span>';
                                    return res;
                                });
                                $(ifrDoc).find('.iframe-bc_editable .bc-notice li').html(value);
                            });
                        }
                        iframeTarget = $(target);
                        $('.edit-container').fadeIn();
                    }
                });

            function changeImage($target, bg) {
                bg = bg || false; // 是否是改背景图
                $('.edit-container [type=file]').off().on('change', function () {
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
                                $this.parent().next('[type="url"]').val(url);
                                if (bg === true) { // 改的是背景图
                                    $target[0].style.backgroundImage = url;
                                }
                                else {
                                    $target.attr('src', url);
                                }
                            }
                        }
                        else {
                            alert(res.msg);
                        }
                    }).fail(function (res) {
                        alert('上传失败!请重试');
                    });
                });
                $('.edit-container [type=url]').off().on('change', function () {
                    if (bg === true) { // 改的是背景图
                        console.log($target[0]);
                        $target[0].style.backgroundImage = 'url(' + $(this).val() + ')';
                    }
                    else {
                        $target.attr('src', $(this).val());
                    }
                });
            }

            function cancelEdit() {
                $('[data-tz=cancelEdit]').off().click(function () {
                    $(this).off();
                    // 删除active
                    iframeTarget.removeClass('active');
                    closeEditContainer();

                    // 重新加载iframe
                    iframeInject(src);
                });
            }

            // 注入回收
            function garbageCollector() {
                // 删除注入的css
                $(ifrDoc).find('link').not('[data-link=templates]').remove();
                $(ifrDoc).find('style').not('[data-style=templates]').remove();
                // 删除编辑按钮
                $(ifrDoc).find('body').find('[class^=iframe-edit]').remove();
                // 删除注入的JS
                $(ifrDoc).find('script').not('[data-js=templates]').remove();
            }

            function saveEdit() {
                $('[data-tz=saveEdit]').off().click(function () {
                    $(this).off('click');
                    // 删除active
                    iframeTarget.removeClass('active');
                    closeEditContainer();
                    garbageCollector();
                    var html = '<!DOCTYPE html>\r\n<html lang="zh-CN">\r\n' + $(ifrDoc).find('html').html() + '\r\n</html>';
                    pageUpdate(html);
                    // 重新加载iframe
                    iframeInject(src);
                });
            }

            // title 编辑
            $('#activeName').off().on('click', function () {
                if ($('.edit-container').is(':hidden')) {
                    var target = this;
                    var txt = $.trim($(target).addClass('active').text());
                    $('.edit-container .text-edit').show();
                    $('#textEdit').val(txt).keyup(function () {
                        var value = $.trim($(this).val());
                        $(target).text(value);
                        $(ifrDoc).find('title').text(value);
                    });

                    $('.edit-container').fadeIn();

                    iframeTarget = $(target);
                }
            }).text($(ifrDoc).find('title').html());
        }
    );
}






