/**
 * @file 员工管理
 */
var loadprc = false;
function loadData(page, size, orderType) {
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    page = page || 1;
    if (!orderType) {
        orderType =  $('[data-sort].active').attr('data-orderbytype') === 'desc' ? 'asc' : 'desc';
    }
    size = size || $('#data-table_length select').val();
    var findLike = $.trim($('#keyword').val());
    var url = (findLike == null || findLike.length === 0) ? '/org/user/list/' + page : '/org/user/find/' + page + '?nameOrPhone=' + findLike;
    $.ajax({
        url: url,
        data: {
            size: size,
            orderType: orderType
        },
        dataType: 'json',
        type: 'get',
        success: function (data) {
            if (data.code === 1) {
                loadprc = false;
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
//    <#-------------------------------load data------------end----------------->
//

function send_modifyUser() {
    var data = {
        username: $('#modify_susername').val(),
        password: $('#modify_spassword').val(),
        name: $('#modify_username').val(),
        phone: $('#modify_mobile').val(),
        mail: $('#modify_email').val(),
        // orgId: $('#modify_scope').val(),
        duty: $('#modify_title').val(),
        role: $('#modify_role').val(),
        status: $('#modify_status').val(),
        uid: $('#modify_uid').val()
    };
    $.ajax({
        url: '/org/user/modify',
        data: data,
        dataType: 'json',
        type: 'post',
        success: function (data) {
            if (data.code === 1) {
                loadData($('.pagination li.active a').data('page'));
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
//    <#-------------------------------修改员工资料-----------end----------------->

function send_addUser() {
    var data = {
        username: $('#add_susername').val(),
        password: $('#add_spassword').val(),
        name: $('#add_username').val(),
        phone: $('#add_mobile').val(),
        mail: $('#add_email').val(),
        // orgId: $('#add_scope').val(),
        duty: $('#add_title').val(),
        role: $('#add_role').val(),
        status: $('#add_status').val()
    };
    $.ajax({
        url: '/org/user/add',
        data: data,
        dataType: 'json',
        type: 'post',
        success: function (data) {
            if (data.code === 1) {
                loadData();
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

function clearSort() {
    $('[data-orderbytype]').attr('data-orderbytype', 'asc').removeClass('active').find('i.fa').attr('class', '').addClass('fa fa-sort m-l-5');
}
//    <#----------------------------------添加员工---------end------------------------------>
$(function () {
//    <#-------------------------------load data-------------start----------------->
    // 加载数据
    loadData(1);

    // 关键字搜索加载列表
    $('[data-tz="search"]').click(function () {
        loadData(1);
        clearSort();
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
        clearSort();
    });
    $('[data-tz="addUser"]').click(function () {
        addUser();
        clearSort();
    });

    // 点击排序加载列表
    $('[data-sort]').on('click', function () {
        $('[data-sort].active').removeClass('active');
        $(this).addClass('active');
        loadData(1, false, $(this).attr('data-orderbytype'));
        var type;
        if ($(this).attr('data-orderbytype') === 'asc') {
            type = 'desc';
            $(this).find('i.fa').attr('class', '').addClass('fa fa-arrow-down m-l-5');
        }
        else {
            type = 'asc';
            $(this).find('i.fa').attr('class', '').addClass('fa fa-arrow-up m-l-5');
        }
        $(this).attr('data-orderbytype', type);
    });
    $('tbody').on('click', '[data-tz="modify"]', function () {
        var tr = $(this).parent().parent();
        $('#modify_username').val(tr.find('.show_name').text());
        $('#modify_mobile').val(tr.find('.show_phone').text());
        $('#modify_email').val(tr.find('.show_mail').val());
        $('#modify_title').val(tr.find('.show_duty').text());
        $('#modify_status').val(tr.find('.show_status').val());
        $('#modify_role').val(tr.find('[data-info="role"]').length > 0 ? tr.find('[data-info="role"]').val() : '');
        // $('#modify_scope').val(tr.find('.show_region').val()); // 域
        $('#modify_susername').val(tr.find('.show_username').val());
        $('#modify_spassword').val('');
        $('#modify_uid').val($(this).data('value'));
        $('.selectpicker').selectpicker('refresh');
    });
    $('#modify_userform').on('hidden.bs.modal', function () {
        $(this).parsley().reset();
    })
        .parsley().on('form:submit', function () {
        send_modifyUser();
        return false;
    });
    $('#add_userform').on('hidden.bs.modal', function () {
        $(this).parsley().reset();
    })
        .parsley().on('form:submit', function () {
        send_addUser();
        return false;
    });
    // 邮箱后缀补全
    var nowid;
    var totalid;
    var can1press = false;
    var emailafter;
    var emailbefor;
    $('[type="email"]').focus(function () { // 文本框获得焦点，插入Email提示层
        var thisWidth = $(this).innerWidth();
        $('#myemail').remove();
        $(this).after("<div id='myemail' style='width:" + thisWidth + "px; height:auto; background:#fff; color:#6B6B6B; position:absolute; left:" + $(this).get(0).offsetLeft + "px; top:" + ($(this).get(0).offsetTop + $(this).innerHeight() + 2) + "px; border:1px solid #ccc;z-index:1060; '></div>");
        if ($('#myemail').html()) {
            $('#myemail').css('display', "block");
            $('.newemail').css('width', $('#myemail').width());
            can1press = true;
        } else {
            $('#myemail').css('display', 'none');
            can1press = false;
        }
    })
        .keyup(function () { // 文本框输入文字时，显示Email提示层和常用Email
            var press = $(this).val();
            if (press != '' || press != null) {
                var emailtxt = '';
                var emailvar = [
                    '@163.com',
                    '@126.com',
                    '@qq.com',
                    '@sina.com',
                    '@sohu.com',
                    '@tom.com',
                    '@21cn.com',
                    '@hotmail.com',
                    '@yahoo.com'
                ];
                totalid = emailvar.length;
                var thisWidth = $(this).innerWidth();
                var emailmy = "<div class='newemail' style='width:" + thisWidth + "px; color:#6B6B6B; overflow:hidden;'><span style='color:#03b0ff'>" + press + "</span></div>";
                if (!(isEmail(press))) {
                    for (var i = 0; i < emailvar.length; i++) {
                        emailtxt = emailtxt + "<div class='newemail' style='width:" + thisWidth + "px; color:#6B6B6B; overflow:hidden;'><span style='color:#03b0ff'>" + press + "</span>" + emailvar[i] + "</div>"
                    }
                }
                else {
                    emailbefor = press.split('@')[0];
                    emailafter = '@' + press.split('@')[1];
                    for (var i = 0; i < emailvar.length; i++) {
                        var theemail = emailvar[i];
                        if (theemail.indexOf(emailafter) == 0) {
                            emailtxt = emailtxt + "<div class='newemail' style='width:" + thisWidth + "px; color:#6B6B6B; overflow:hidden;'><span style='color:#03b0ff'>" + emailbefor + "</span>" + emailvar[i] + "</div>"
                        }
                    }
                }
                $('#myemail').html(emailmy + emailtxt);
                if ($('#myemail').html()) {
                    $('#myemail').css('display', 'block');
                    $('.newemail').css('width', $('#myemail').width());
                    can1press = true;
                }
                else {
                    $('#myemail').css('display', 'none');
                    can1press = false;
                }
                beforepress = press;
            }
            if (press == '' || press == null) {
                $('#myemail').html('');
                $('#myemail').css('display', 'none');
            }
        })
    $(document).click(function () { // 文本框失焦时删除层
        if (can1press) {
            $('#myemail').remove();
            can1press = false;
            if ($('[type="email"]').focus()) {
                can1press = false;
            }
        }
    })
    $('.newemail').live('mouseover', function () { // 鼠标经过提示Email时，高亮该条Email
        $('.newemail').css('background', '#f6f7f7');
        $(this).css('background', '#CACACA');
        $(this).focus();
        nowid = $(this).index();
    }).live("click", function () { // 鼠标点击Email时，文本框内容替换成该条Email，并删除提示层
        var newhtml = $(this).html();
        newhtml = newhtml.replace(/<.*?>/g, '');
        $('[type="email"]').val(newhtml);
        $('#myemail').remove();
    })
    $(document).bind('keyup', function (e) {
        if (can1press) {
            switch (e.which) {
                case 38:
                    if (nowid > 0) {
                        $('.newemail').css('background', '#f6f7f7');
                        $('.newemail').eq(nowid).prev().css('background', '#CACACA').focus();
                        nowid = nowid - 1;
                    }
                    if (!nowid) {
                        nowid = 0;
                        $('.newemail').css('background', '#f6f7f7');
                        $('.newemail').eq(nowid).css('background', '#CACACA');
                        $('.newemail').eq(nowid).focus();
                    }
                    break;
                case 40:
                    if (nowid < totalid) {
                        $('.newemail').css('background', '#f6f7f7');
                        $('.newemail').eq(nowid).next().css('background', '#CACACA').focus();
                        nowid = nowid + 1;
                    }
                    if (!nowid) {
                        nowid = 0;
                        $('.newemail').css('background', '#f6f7f7');
                        $('.newemail').eq(nowid).css('background', '#CACACA');
                        $('.newemail').eq(nowid).focus();
                    }
                    break;
                case 13:
                    var newhtml = $('.newemail').eq(nowid).html();
                    newhtml = newhtml.replace(/<.*?>/g, '');
                    $('[type="email"]').val(newhtml);
                    $('#myemail').remove();
            }
        }
    })
    // 检查email邮箱
    function isEmail(str) {
        if (str.indexOf('@') > 0) {
            return true;
        }
        return false;
    }
});
