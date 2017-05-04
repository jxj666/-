// 热点切换
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