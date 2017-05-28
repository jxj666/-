/**
 * Created by carol on 2016/11/21.
 */
$.ajax({
    type: 'GET',
    url: '/org/account/info',
    success: function (res) {
        if (res.code === 1) {

            $('#short-name').html(res.context.org.shortName);
            var num = parseInt(res.context.orgAccount.cashAmount) + parseInt(res.context.orgAccount.elAmount);
            $('#amount').html('¥' + num);
            $('#creat-time').html(res.context.org.createTime);

            if (res.context.orgAccount.status == 1) {
                $('#status').html('正常');
            } else {
                $('#status').html('冻结');
            }
            $('.service').html(tmpl('teamplate_module', res.context));

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
