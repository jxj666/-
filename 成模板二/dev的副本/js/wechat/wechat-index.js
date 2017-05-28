/**
 * Created by carol on 16/9/23.
 */
var isAdd = false;
$('#add').on('click',function () {
    isAdd = true;
    for(var i = 0;i<4;i++){
        $('#info-' + i).val('')
    }
    $('#modal-alert').modal('show');
})

$('[data-click=upDate]').on('click',function (e) {
    var tdAll = $(e.target.parentNode).prevAll();
    for(var i = 0;i< tdAll.length;i++){
        if($(tdAll[i+1]).text() == '服务号'){
            $('#info-0 select option[value="1"]').attr('selected','selected');
        }

        if($(tdAll[i+1]).text() == '订阅号') {
            $('#info-0 select option[value="2"]').attr('selected','selected');

        }

        $('#info-' + i).val($(tdAll[i+1]).text());
    }
    isAdd = false;
    $('.selectpicker').selectpicker('refresh');
    $('#modal-alert').modal('show');
})

$('[data-click=save]').on('click',function (e) {

    var appId= new RegExp('^wx[a-z0-9]*$');
    var originId = new RegExp('^gh_[a-z0-9]*$');
    if(!appId.test($('#info-3').val())){
        alert('请输入正确的appId');
        return
    }

    if(!originId.test($('#info-1').val())){
        alert('请输入正确的原始Id');
        return
    }

    if(!$('#info-1').val() && !$('#info-2').val() && !$('#info-3').val()){
        alert('请输入完整信息');
        return
    }

    if(isAdd){
        $.ajax({
            type:'POST',
            url:'/org/wechat/add',
            data:{
                appid:$('#info-3').val(),
                name:$('#info-2').val(),
                originId:$('#info-1').val(),
                type: $('#info-0 select option:selected').val()
            },
            success:function (res) {
                if(res.code ==1){
                    $('#modal-alert').modal('hide');
                    alert('保存成功');
                    window.location.reload()
                }else {
                    alert(res.msg)
                }
            }
        })
    }else {
        $.ajax({
            type:'POST',
            url:'/org/wechat/'+ $('#info-3').val() +'/update',
            data:{
                appid:$('#info-3').val(),
                name:$('#info-2').val(),
                originId:$('#info-1').val(),
                type:$('#info-0 select option:selected').val()
            },
            success:function (res) {
                if(res.code ==1){
                    $('#modal-alert').modal('hide');
                    alert('更新成功');
                    window.location.reload()
                }else {
                    alert(res.msg)
                }
            }
        })
    }
})