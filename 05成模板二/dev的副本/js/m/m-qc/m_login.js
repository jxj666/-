var enterpriseName = '';
$('[data-click="cut-enterprise"]').click(function () {
	$('.pop').removeClass('invisible')
					 .children('.enterprise-pop').removeClass('invisible');
});
$('.enterprise-item').on('click', function () {
	enterpriseName = $(this).children('a').text();
	// console.log(enterpriseName);
});
$('[data-click="confirm-cut"]').click(function () {
	$('.enterprise-name').text(enterpriseName);
	$('.pop').addClass('invisible')
					 .children('.enterprise-pop').addClass('invisible');
});
