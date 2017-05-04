//前沿科技信息平台
//热点切换
$('#hot_change li').on("click",function(ev){
	var ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	var $t = $(target)
	var $tli=$t.closest("li")
	if($tli.hasClass("active")){
		return;
	}else{
		var change=$tli.prop("className")
		var changeid='#'+change
	}
	$('#hot_change li').removeClass('active')
	$tli.addClass('active')
	$('.js_hot').hide()
	$(changeid).show()
})
//科技政策平台
//手机验证
    var wait = 60;
    function timeCount() {
      if (wait == 0) {
        $('.get-code').html('获取验证码');
        $('.get-code').removeClass('disable');
        clearTimeout(clearFun);
        wait = 60;
      } else {
        $('.get-code').html('已发送' + wait + 's');
        $('.get-code').addClass('disable');
        wait--;
        clearFun = setTimeout(timeCount, 1000);
      }
    }

    $('.get-code').on('click', function () {
      if($(this).hasClass('disable')){
        return;
      }else {
        timeCount();
      }
    });
//政策信息切换
$('#china_change li').on("click",function(ev){
	var ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	var $t = $(target)
	var $tli=$t.closest("li")
	if($tli.hasClass("active")){
		return;
	}else if($tli.hasClass("china_change12")){
		return;
	}else{
		var change=$tli.prop("className")
		var changeid='#'+change
	}
	$('#china_change li').removeClass('active')
	$tli.addClass('active')
	$('.china_text').hide()
	$(changeid).show()
})
//解读切换
$('#know_change li').on("click",function(ev){
	var ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	var $t = $(target)
	var $tli=$t.closest("li")
	if($tli.hasClass("active")){
		return;
	}else if($tli.hasClass("know_change5")){
		return;
	}else{
		var change=$tli.prop("className")
		var changeid='#'+change
	}
	$('#know_change li').removeClass('active')
	$tli.addClass('active')
	$('.know_text').hide()
	$(changeid).show()
})
//地点选择框
$('#select_port .u-btn').on('click',function() {
	$('#select_port ul').toggle()
})
$("#select_port ul a").on('click', function(ev) {
	var ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	var $t = $(target)
	var valtxt = $t.text();
	$("#select_port .btntxt").text(valtxt);
	$('#select_port ul').slideUp()
})
$(document).on("click", function(e) {
	if ($(e.target).parents("#select_port").length == 0) {
		$("#select_port ul").slideUp();
	}
});
