function getList(page, pageSize, orderBy, keyword) {
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    page = page || 1;
    pageSize = 20 || $('#data-table_length select').val();
    keyword = keyword || $('#keyword').val();
    orderBy = orderBy || '';
    $.ajax({
        type: 'GET',
        url: '/project/list',
        data: {
            page: page,
            pageSize: pageSize,
            orderBy: orderBy,
            keyword: keyword
        },
        success: function (res) {
            if (res.code === 1) {
                var html = '';
                for (var i = 0; i < res.context.projectList.length; i++) {
                    var online = res.context.projectList[i].status === 1 ? '上线' : '下线';
                    html += '<tr ><td data-info="projectName">' + res.context.projectList[i].name + '</td><td>' + res.context.projectList[i].createTime + '</td><td>' + online + '</td><td>' + res.context.projectList[i].traceId + '</td><td data-pid="' + res.context.projectList[i].traceId + '"><button type="button" class="btn btn-tz-blue btn-xs m-r-5" data-click="look"  data-tz="btnStatList">查看</button> <button type="button" class="btn btn-tz-blue btn-xs" data-click="del">删除</button> </td> </tr>'
                }
                $('#project_data').html(html);
                // 翻页
                $('html,body').animate({scrollTop: 0}, 150);
                res.context.page = page;
                $('[data-info=page]').text(page);
                $('.pagination').html(tmpl('template_page', res.context));
                $('[data-info="totalPage"]').html(res.context.totalPage);
                $('[data-page="' + page + '"]').parent().addClass('active');

                if (page > 1) {
                    $('#data-table_previous').removeClass('disabled')
                        .find('a').attr('data-page', page - 1);
                }
                if (res.context.totalPage > 1 && page < res.context.totalPage) {
                    $('#data-table_next').removeClass('disabled')
                        .find('a').attr('data-page', page - 0 + 1);
                }
                $('[data-tz="page"]').on('click', function () {
                    if (!$(this).parent().hasClass('active') && !$(this).parent().hasClass('disabled')) {
                        var i = $(this).data('page');
                        var datatableLength = $('#data-table_length select').val();
                        getList(i, datatableLength);
                    }
                });

                $('[data-click=look]').on('click', function (e) {
                    $('[name="project-id"]').html($(this).parent().data('pid'));
                    $('.popup_title').html($(this).closest('tr').find('[data-info="projectName"]').html());
                    $('#look-for').modal('show');
                    $('#add-info').hide();
                    $('#confirm-info').show();
                });


                $('[data-click=del]').on('click', function (e) {
                    if (window.confirm('删除后将不能再查询该项目的所有数据，确认删除该项目？')) {
                        $.ajax({
                            type: 'POST',
                            url: '/project/delete/' + $(this).parent().data('pid'),
                            success: function (res) {
                                if (res.code === 1) {
                                    alert('删除成功');
                                    getList();
                                }
                            }
                        });
                    }
                });
            }
            else {
                alert(res.msg);
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
// 选择n项结果加载列表
$('#data-table_length select').change(function () {
    var datatableLength = $('#data-table_length select').val();
    getList(1, datatableLength);
});

// 定义一个新的复制对象
function copyCode() {
    $('.copy-target-container').each(function () {
        var btn = $('<div class="clip_button"></div>');
        $(this).append(btn);
    });
    var client = new ZeroClipboard($('.clip_button'));
    $('#global-zeroclipboard-html-bridge').data('placement', 'top').attr('title', '点击复制到粘贴板').tooltip();
    client.on('ready', function (readyEvent) {
        this.on('copy', function (event) {
            event.clipboardData.setData('text/plain', $.trim($(event.target).closest('.copy-target-container').find('.copy-target').text()));
        });
        this.on('aftercopy', function (event) {
            // `this` === `client`
            // `event.target` === the element that was clicked
            $('#global-zeroclipboard-html-bridge').attr('title', '已复制').tooltip('fixTitle').tooltip('show').attr('title', '点击复制到粘贴板').tooltip('fixTitle');
        });
    });
    client.on('error', function () {
        $('#global-zeroclipboard-html-bridge').attr('title', '浏览器缺少flash插件').tooltip('fixTitle').tooltip('show').attr('title', '点击复制到粘贴板').tooltip('fixTitle');
    });
}

var $traceid = $('#traceid');
var btnStat = {
    list: function () {
        var me = this;
        $.ajax({
            type: 'GET',
            url: '/project/button/list',
            data: {
                traceId: $traceid.val()
            },
            success: function (data) {
                if (data.code === 1) {
                    if (data.context.list.length > 0) {
                        me.render(data.context);

                        // 复制按钮
                        copyCode();
                    }
                    else {
                        $('.btn-list').html('还没有添加统计~');
                    }
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
    },
    create: function (data) {
        var me = this;
        $.ajax({
            type: 'POST',
            url: '/project/button/create',
            data: data,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.code === 1) {
                    $('#btnContent').val('');
                    me.list();
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
    },
    update: function () {
        /*$.ajax({
         type: 'POST',
         url: '/project/button/update',
         data: {
         traceId: $traceid.val(),
         aid: aid
         },
         success: function (data) {
         if (data.code === 1) {

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
         });*/
    },
    delete: function (aid) {
        var me = this;
        $.ajax({
            type: 'POST',
            url: '/project/button/delete',
            data: {
                traceId: $traceid.val(),
                aid: aid
            },
            success: function (data) {
                if (data.code === 1) {
                    me.list();
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
    },
    render: function (data) {
        $('.btn-list').html(tmpl('template_btnList', data));
    }
};
$(function () {
    // 获取监控列表
    getList();
    // 添加监控项目
    $('#add').on('click', function () {
        $('#look-for').modal('show');
        $('#add-info').show();
        $('#confirm-info').hide();
        $('#project').val('');
        $('#domain').val('');
    });
    // 复制
    copyCode();
    // 查看更多代码
    $('[data-tz="checkMore"]').click(function (e) {
        e.preventDefault();
        $(this).find('i').toggleClass('rotate');
        var target = $(this).attr('href');
        $(target).toggleClass('active').toggleClass('in');
    });
    // 提交项目

    $('[data-click=save]').on('click', function () {
        var name = '';
        var domain = '';
        var activityId = '';
        var type = $('.device_list li.active').find('img').attr('tag');
        switch (type) {
            case '3':
                if (!$('#project').val()) {
                    alert('请输入项目名称');
                    return;
                }

                if (!$('#domain').val()) {
                    alert('请输入域名');
                    return;
                }
                name = $('#project').val();
                domain = $('#domain').val();
                break;

            case '4':
                activityId = $('#activityList').find('option:selected').val();
                name = $('#activityList').find('option:selected').html();
                if (activityId === '-1') {
                    return;
                }
                break;
        }
        $.ajax({
            type: 'POST',
            url: '/project/create',
            data: {
                source: parseInt(type, 10),
                name: name,
                domain: domain,
                activityId: activityId
            },
            success: function (res) {
                if (res.code === 1) {
                    $('[name="project-id"]').html(res.context.traceId);
                    $('#add-info').hide();
                    $('#confirm-info').show();
                    getList();
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
    });
    // 统计按钮列表
    $(document).on('click', '[data-tz="btnStatList"]', function () {
        $traceid.val($(this).parent().data('pid'));
        btnStat.list();
    });
// 添加一个按钮统计
    $(document).on('click', '[data-tz="btnCreate"]', function () {
        var $btnTagVal = $.trim($('#btnTag').val());
        if ($btnTagVal.length <= 0) {
            alert('tag不能为空');
            return;
        }
        var $btnContentVal = $.trim($('#btnContent').val());
        if ($btnContentVal.length <= 0) {
            alert('描述不能为空');
            return;
        }
        var data = {traceId: $traceid.val(), tag: $btnTagVal, description: $btnContentVal};
        data = JSON.stringify([data]);
        btnStat.create(data);
    });
// 删除一个按钮统计
    $(document).on('click', '[data-tz="btnDel"]', function () {
        if (!window.confirm('确定删除？')) {
            return;
        }
        btnStat.delete($(this).data('aid'));
    });

    $('#look-for').on('hidden.bs.modal', function () {
        $('.popup_title').html('添加数据监控项目');
        $('[name="project-id"]').html('');
        $traceid.val('');
    });
})
