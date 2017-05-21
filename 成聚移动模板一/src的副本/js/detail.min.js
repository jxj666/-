$('.hb-info-btn').on('click', function () {
	$('.pop-bg').removeClass('invisible');
})

$('.hb-pop-close').on('click', function () {
	$('.pop-bg').addClass('invisible');
})

    $('[data-click="my-gift-btn"]').on('click', function() {
        location.href = 'gift.html';
    });

    var index = getQueryString('index');
    if (index == 1) {
        $('.tv-img').removeClass('invisible').siblings().addClass('invisible');
        $('.tv').removeClass('invisible').siblings().addClass('invisible');
        $('.tv-btn').removeClass('invisible').siblings('.hb-btn').addClass('invisible');
    } else if (index == 2) {
        $('.hb-img').removeClass('invisible').siblings().addClass('invisible');
        $('.hblqsm').removeClass('invisible').siblings('.prize-info').addClass('invisible');
        $('.skip2').removeClass('invisible').siblings('.skip1').addClass('invisible');
    }
    $('[data-click="order-detail"]').click(function() {
        location.href = 'order_detail.html';
    });
