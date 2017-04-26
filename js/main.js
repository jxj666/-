//年度选择框
$('#select_time>button').on('click', function() {
	$('#select_time>ul').slideToggle()
})
$("#select_time>ul a").on('click', function(ev) {
	var ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	var $t = $(target)
	var valtxt = $t.text();
	$("#select_time .btntxt").text(valtxt);
	$('#select_time>ul').slideUp()
})
$(document).on("click", function(e) {
	if ($(e.target).parents("#select_time").length == 0) {
		$("#select_time>ul").slideUp();
	}
});
//工作站或示范单位选择
$('#select_site li').on('click', function(ev) {
		console.log('1');
		var ev = ev || window.event;
		var target = ev.target || ev.srcElement;
		var $t = $(target);
		$('#select_site li').removeClass('z-crt');
		$t.closest('li').addClass('z-crt');

	})
	//获取验证码
$('.message_num').on('click', time_delay)

function time_delay() {
	$('.message_num').off('click', time_delay)
	var date = 60;
	var timer = setInterval(function() {
		date--;
		$('.message_num').text(date)
		if (date < 1) {
			$('.message_num').text('获取验证码');
			$('.message_num').on('click', time_delay)
			clearInterval(timer);
			timer = null;

		}
	}, 1000)


}