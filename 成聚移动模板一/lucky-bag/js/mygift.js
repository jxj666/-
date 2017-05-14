$('#linquSwitch li').on("click",function(ev){
	var ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	var $t = $(target)
	var $tli=$t.closest("li")
	if($tli.hasClass("active")){
		return;
	}else{
		var change=$tli.prop("id")
		var changeid='#div'+change
	}
	$('#linquSwitch li').removeClass('active')
	$tli.addClass('active')
	$('.lipin').hide()
	$(changeid).show()
})
$('[data-click="detail-btn"]').click(function () {
	// location.href = 'order_detail.html';
	var index = $(this).parent().parent().index();
	// console.log(index);
	if (index == 0) {
		location.href = 'get_coupon.html';
	}
	else {
		location.href = 'detail.html?index='+index;
	}
});