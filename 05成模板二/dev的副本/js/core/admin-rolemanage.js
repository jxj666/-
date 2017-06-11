$(document).on('click', '.nav-pills>li>a', function () {
    var $li = $(this).closest('li');
    if (!$li.hasClass('active')) {
        $('.nav-pills>li.active').removeClass('active');
        $li.addClass('active');
    }
});
$('#addBtn').on('click', function () {
    var newList = $('li a[data-new=true] i');
    for (var i = 0; i < newList.length; i++) {
        if ($.trim($(newList[i]).html()).length === 0) {
            alert('请输入角色名!');
            return;
        }
    }
    var nRole = $('<li> <a data-tz="getTotalPerm" data-new="true" class="focus"> <i class="fa fa-n" contenteditable="true"></i></a></li>');
    $('.nav-pills li:eq(0)').before(nRole);
    $('.nav-pills li:eq(0) .fa-n').get(0).focus();
    getTotalPerm();
    $('#sendType').attr('value', 'add');
});
function getTotalPerm() {
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    $.ajax({
        url: '/org/role/totalperm',
        type: 'get',
        success: function (data) {
            if (data.code === 1) {
                $('.vertical-box-column .module_perm').html(tmpl('teamplate_module', toShowRolePerm(data.context)))
            }
            else {
                alert(data.msg);
            }
            // 取消全选状态
            $('[data-tz=checkedAll]').prop('checked', false);
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
$(document).on('click', '[data-tz="getTotalPerm"]', function () {
    getTotalPerm();
});

$('[data-tz="getPerm"]').click(function () {
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    var data = {
        role: $(this).data('value')
    };
    $.ajax({
        url: '/org/role/getperm',
        data: data,
        dataType: 'json',
        type: 'get',
        success: function (data) {
            if (data.code === 1) {
                $('.vertical-box-column .module_perm').html(tmpl('teamplate_module', toShowRolePerm(data.context)));
                $('#sendType').attr('value', 'update');
            }
            else {
                alert(data.msg);
            }
            // 取消全选状态
            $('[data-tz=checkedAll]').prop('checked', false);
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
});
// 全选
$('[data-tz=checkedAll]').click(function () {
    if ($(this).prop('checked')) {
        $('.module_perm [type=checkbox]').each(function (i) {
            !$(this).prop('checked') && $(this).trigger('click');
        });
    }
    else {
        $('.module_perm [type=checkbox]').each(function (i) {
            $(this).prop('checked') && $(this).trigger('click');
        });
    }
})
$('[data-tz="send"]').click(function () {
    if ($('#sendType').val() === 'update') {
        sendUpdateRole();
    }
    if ($('#sendType').val() === 'add') {
        sendAddRole();
    }

});
var nameReg = /^[\u4e00-\u9fa5a-z]{1,20}$/i;
function sendUpdateRole() {
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    var answers = {};
    // var rolePermDatas = [];
    var checkboxs = $('.module_perm [type=checkbox]');
    var k = 0;
    for (var i = 0; i < checkboxs.length; i++) {
        var checkbox = $(checkboxs[i]);
        if (checkbox.attr('data-value') == 1) {
            var grantType = parseInt((checkbox.attr('checked') === 'checked') ? '1' : '0');
            //var rp = new Object();
            //rp.role=checkbox.attr('data-role');
            //rp.perm=checkbox.attr('data-perm');
            //rp.grantType=grantType;
            //rolePermDatas[i]=rp;
            answers['data[' + k + '].role'] = checkbox.attr('data-role');
            answers['data[' + k + '].perm'] = checkbox.attr('data-perm');
            answers['data[' + k + '].grantType'] = grantType;
            k++;
        }
    }
    $.ajax({
        url: '/org/role/updateperm',
        data: answers,
        dataType: 'json',
        type: 'POST',
        success: function (data) {
            if (data.code === 1) {
                $('li.active [data-tz="getPerm"]').trigger('click');
                alert('保存成功');
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

function sendAddRole() {
    $('.panel-body-loader.hide').removeClass('hide');
    Pace.restart();
    var newList = $('li a[data-new="true"] i');

    for (var i = 0; i < newList.length; i++) {
        var newi = $(newList[i]);
        if (!newi.attr('contenteditable') == 'true') {
            break;
        }
        var rolePermDatas = [];
        var rolename = newi.text();
        console.log(rolename);
        var testObj = {};
        $.each($('.nav-pills>li>a:not(".focus")>i'), function (i, v) {
            testObj[$.trim($(v).html())] = true;
        });
        console.info(testObj);
        if (testObj[rolename]) {
            alert('角色名已存在！');
            newi.focus();
            return;
        }
        if (!nameReg.test(rolename)) {
            alert('角色名必须为1~20位中文、英文字符！');
            newi.focus();
            return;
        }
        var checkboxs = $('.module_perm [type=checkbox]');
        var answers = {};
        answers['name'] = $.trim(rolename);
        var k = 0;
        for (var j = 0; j < checkboxs.length; j++) {
            var checkbox = $(checkboxs[j]);
            var grantType = (checkbox.attr('checked') == 'checked') ? '1' : '0';
            if (grantType == '1') {
//                    rolePermDatas.push({perm:checkbox.attr('data-perm'),grantType:grantType})
                answers['data[' + k + '].perm'] = checkbox.attr('data-perm');
                answers['data[' + k + '].grantType'] = grantType;
                k++;
            }
        }
        $.ajax({
            url: '/org/role/add',
            data: answers,
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                if (data.code === 1) {
                    alert('添加成功');
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
    }
}

$(document).on('click', '[data-tz=changeStatus]', function () {
    $(this).attr('data-value', 1 - $(this).attr('data-value'));
});

function toShowRolePerm(rolePerms) {
    var arr = [];
    var obj = {};
    $.each(rolePerms, function (i, v) {
        if (arr.indexOf(v.permDes.moduleDes.name) === -1) {
            arr.push(v.permDes.moduleDes.name);
            obj[v.permDes.moduleDes.name] = [];
        }
        obj[v.permDes.moduleDes.name].push(v);
    });
    arr = [];
    $.each(obj, function (key, item) {
        var obj = {
            name: key,
            items: item
        };
        arr.push(obj);
    });
    console.log({modulePerm: arr});
    return {modulePerm: arr};
}
$(function () {
    $('.wrapper').innerHeight($(window).innerHeight() - $('.wrapper').offset().top - 40);
    $(window).resize(function () {
        $('.wrapper').innerHeight($(window).innerHeight() - $('.wrapper').offset().top - 40);
    });
});