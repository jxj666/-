function loadData(page, size) {
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    page = page || 1;
    size = size || $('#data-table_length select').val();
    var findLike = $.trim($('#keyword').val());
    var url = (findLike == null || findLike.length === 0) ? ('/org/list/' + page)
        : ('/org/find/' + page + '?nameOrId=' + findLike);
    $.ajax({
        url: url,
        data: {
            size: size
        },
        dataType: 'json',
        type: 'get',
        success: function (data) {
            if (data.code === 1) {
                $('#data-table tbody').html(tmpl('template_list', data.context));
                $('[data-info="totalPage"]').html(data.context.totalPage);
                $('html,body').animate({scrollTop: 0}, 150);
                data.context.page = page;
                $('[data-info=page]').text(page);
                $('.pagination').html(tmpl('template_page', data.context));
                $('[data-page="' + page + '"]').parent().addClass('active');
                // 翻页
                if (page > 1) {
                    $('#data-table_previous').removeClass('disabled')
                        .find('a').attr('data-page', page - 1);
                }
                if (data.context.totalPage > 1 && page < data.context.totalPage) {
                    $('#data-table_next').removeClass('disabled')
                        .find('a').attr('data-page', page - 0 + 1);
                }
                $('[data-tz="page"]').on('click', function () {
                    if (!$(this).parent().hasClass('active') && !$(this).parent().hasClass('disabled')) {
                        var i = $(this).data('page');
                        loadData(i);
                    }
                });
                $('[data-tz="showInfo"]').each(function () {
                    $(this).popover({
                        content: $(this).data('value'),
                        trigger: 'focus hover',
                        placement: 'left'
                    });
                });
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

// 加载数据
loadData(1);

// 关键字搜索加载列表
$('[data-tz="search"]').click(function () {
    loadData(1);
});
$('#keyword').on('keyup', function (e) {
    if (e.keyCode === 13) {
        $('[data-tz="search"]').trigger('click');
    }
    if ($(this).val().length > 0) {
        $(this).next('.search-clear-btn').removeClass('hide');
    }
    else {
        $(this).next('.search-clear-btn').addClass('hide')
    }
});
$('.search-clear-btn').click(function () {
    $(this).addClass('hide').prev('[type=search]').val('');
    $('[data-tz="search"]').trigger('click');
});
// 选择n项结果加载列表
$('#data-table_length select').change(function () {
    loadData(1);
});

//    添加企业
$('#organization_add').on('hidden.bs.modal', function () {
    $(this).parsley().reset();
    $(this)[0].reset();
})
    .parsley().on('form:submit', function () {
    var organizationAdd = $('#organization_add');
    var data = {
        name: $.trim(organizationAdd.find('.add_name').val()),
        orgId: $.trim(organizationAdd.find('.add_orgid').val()),
        status: organizationAdd.find('.add_status').find('option:selected').val(),
        username: $.trim(organizationAdd.find('.add_adminid').val()),
        password: $.trim(organizationAdd.find('.add_adminpwd').val()),
        accountLimit: organizationAdd.find('.add_accountlimit').find('option:selected').val(),
        deptLimit: organizationAdd.find('.add_deptlimit').find('option:selected').val(),
        type: organizationAdd.find('.add_type').find('option:selected').val()
    };
    $.ajax({
        url: '/org/create',
        data: data,
        dataType: 'json',
        type: 'post',
        success: function (data) {
            if (data.code === 1) {
                $('[data-dismiss="modal"]').trigger('click');
                loadData(1);
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
    return false;
});
// 上传图片
$('[data-tz="imgUpload"]').on('change', function () {
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
            console.log('上传成功,图片地址为:' + res.context.url);
            var url = res.context.url;
            if (url) {
                $this.parent().next('[type="url"]').val(url);
                $this.prev().remove();
                $('<div class="pic"><img src=' + url + '></div>').insertBefore($this);
            }
        }
        else {
            alert(code + '\r\n' + res.message);
        }
    }).fail(function (res) {
        alert('上传失败!请重试');
    });
});
$('[type="url"]').change(function () {
    var $target = $(this).parent().find('.pic img');
    if ($target.length > 0) {
        $target.attr('src', $(this).val());
    }
});
// 修改企业
$('tbody').on('click', '[data-tz="modify"]', function () {
    var tr = $(this).parent().parent();
    var organizationModify = $('#organization_modify');
    organizationModify.find('.modify_name').attr('value', tr.find('.show_name').text());
    organizationModify.find('.modify_status').attr('value', tr.find('.show_status').attr('data-value'));
    organizationModify.find('.modify_orgid').attr('value', tr.find('.show_id').text());
    organizationModify.find('.modify_accountlimit').attr('value', tr.find('.show_accountlimit').val());
    organizationModify.find('.modify_deptlimit').attr('value', tr.find('.show_deptlimit').val());
    organizationModify.find('.modify_uid').attr('value', $(this).attr('data-value'));
    organizationModify.find('.modify_type').val(tr.find('.show_type').data('type'));
    if (tr.find('.show_logo').val()) {
        $('#logoImage').val(tr.find('.show_logo').val());
        $('.pic img').attr('src', tr.find('.show_logo').val());
    }

    $('.selectpicker').selectpicker('refresh');
});

$('#organization_modify').on('hidden.bs.modal', function () {
    $(this).parsley().reset();
    $(this)[0].reset();
    $(this).find('.pic img').attr('src','//saascore.oss-cn-beijing.aliyuncs.com/custom/img/common/upload.jpg');
}).parsley().on('form:submit', function () {
    var organizationModify = $('#organization_modify');
    var data = {
        name: $.trim(organizationModify.find('.modify_name').val()),
        shortName: $.trim(organizationModify.find('.modify_shortName').val()),
        orgId: $.trim(organizationModify.find('.modify_orgid').val()),
        status: organizationModify.find('.modify_status').find('option:selected').val(),
        password: organizationModify.find('.modify_adminpwd').val(),
        accountLimit: organizationModify.find('.modify_accountlimit').find('option:selected').val(),
        deptLimit: organizationModify.find('.modify_deptlimit').find('option:selected').val(),
        id: $.trim(organizationModify.find('.modify_uid').val()),
        type: organizationModify.find('.modify_type').find('option:selected').val(),
        logo: $('#logoImage').val()
    };
    $.ajax({
        url: '/org/modify',
        data: data,
        dataType: 'json',
        type: 'post',
        success: function (data) {
            if (data.code === 1) {
                var page = $('.pagination li.active a').data('page');
                $('[data-dismiss="modal"]').trigger('click');
                loadData(page);
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
    return false;
});
