var type = getQueryString('type');
if(type == 0) {
	$('nav').eq(type).css('backgroundImage','../img/bag_icon_active.png');
}
else if(type == 1) {
	$('nav').eq(type).css('backgroundImage','../img/notice_icon_active.png');
}
else if(type == 2) {
	$('nav').eq(type).css('backgroundImage','../img/prize_icon_active.png');
}


var imgList = [
'bag_icon','notice_icon','prize_icon'
];
$('.nav').on('click', function () {
 	// console.log($(this).index());
 	var index = $(this).index();
 	if(index == 0){
 		location.href = 'lucky_bag.html?tpye=0';
 	}
 	else if (index == 1) {
 		location.href = 'notice.html?type=1';
 	}
 	else if (index == 2) {
 		location.href = 'my_gift.html?type=2';
 	}
});
function getQueryString(name) {
    var reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", 'i');
    var str_arr = window.location.search.substr(1).match(reg);
    return str_arr != null ? str_arr[1] : null;
}

$('.click-list').on('click', 'a', function () {
 	// console.log($(this).attr('data-click'));
 	var a = $(this).attr('data-click');
 	$('.tip-bg').removeClass('invisible');
 	$('.'+a+'-tip').removeClass('invisible')
 	.siblings().addClass('invisible');
});
$('.tip-close').click(function () {
 	$('.tip-bg').addClass('invisible');
});

$('[data-click="winner-list"]').click(function () {
	location.href = 'winner_list.html';
});


