//通用 js

var type = getQueryString('type');

//下导航栏图标切换
if (type == 0) {
    $('nav').eq(type).css('backgroundImage', '../img/bag_icon_active.png');
} else if (type == 1) {
    $('nav').eq(type).css('backgroundImage', '../img/notice_icon_active.png');
} else if (type == 2) {
    $('nav').eq(type).css('backgroundImage', '../img/prize_icon_active.png');
}

//图标切换
var imgList = [
    'bag_icon', 'notice_icon', 'prize_icon'
];
$('.nav').on('click', function() {
    // console.log($(this).index());
    var index = $(this).index();
    if (index == 0) {
        location.href = 'lucky_bag.html?type=0';
    } else if (index == 1) {
        location.href = 'notice.html?type=1';
    } else if (index == 2) {
        location.href = 'gift.html?type=2';
    }
});

function getQueryString(name) {
    var reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", 'i');
    var str_arr = window.location.search.substr(1).match(reg);
    return str_arr != null ? str_arr[1] : null;
}

$('.click-list').on('click', 'a', function() {
    // console.log($(this).attr('data-click'));
    var a = $(this).attr('data-click');
    $('.tip-bg').removeClass('invisible');
    $('.' + a + '-tip').removeClass('invisible')
        .siblings().addClass('invisible');
});
$('.tip-close').click(function() {
    $('.tip-bg').addClass('invisible');
});

$('[data-click="winner-list"]').click(function() {
    location.href = 'winner_list.html';
});
$('.input').on('input', function() {
    var val = $(this).val();
    if (val.length === 4) {
        $(this).blur();
    }
});
//获取红包
$('#get-bag').on('click', function() {
    $('.pop-bg1').removeClass('invisible');
});
$('.scan-pop-btn').on('click', function() {
    location.href = 'lucky_bag.html';
});
$('.pop-close').on('click', function() {
    $('.pop-bg').addClass('invisible');
});

//拆红包
$('.lucky-btn').on('click', function() {
    $('.pop-bg2').removeClass('invisible');
});
$('.pop-close').on('click', function() {
    $('.pop-bg').addClass('invisible');
});
// 点击领取跳转到中奖详情
$('.lucky-get').on('click', function() {
    location.href = 'detail.html?index=2';
});

//优惠券
$('.coupon-pop-close').on('click', function() {
    $('.pop-bg').addClass('invisible');

})
$('.get-coupon-btn').on('click', function() {
    $('.pop-bg').addClass('invisible');
    location.href = 'gift.html?type=2';
})
$('.get-img-item a').on('click', function() {
    $('.pop-bg').removeClass('invisible');
})

//牌背面
function card() {
    $('.center_p img').removeClass('start').attr('src', 'img/card2_03.png');
    $('.jiuge ul li').addClass('j_change');
    setTimeout(function() {

        $('.pai').hide();
    }, 800)
    setTimeout(function() {

        $('.pai').html(`<img src="img/card2_07.png" alt="" class="beimian">`);
    }, 1000)
    setTimeout(function() {
        $('.jiuge ul li').removeClass('j_change')
    }, 1000)
    setTimeout(function() {

            $('.pai').show();
        }, 1200)
        //$('.jiuge ul li').removeClass('j_change');
}

//正面初步
var zhenmian = [
    [2, 'fanpai_10', '优惠券', '9999'],
    [2, 'fanpai_03', '平板', '5'],
    [3, 'fanpai_17'],
    [1],
    [2, 'fanpai_15', '红包', '666'],
    [3, 'fanpai_17'],
    [1],
    [2, 'fanpai_10', '优惠券', '9999']
]

function Rcard() {
    $('.pai').each(function(index, ele) {
        $('.center_p img').addClass('start').attr('src', 'img/card3_03.png');
        var type_num = zhenmian[index][0];
        var $e = $(ele);
        console.log(type_num)
        if (type_num == '2') {
            $e.html(`<div class="shanpin">
                            <img src="img/${zhenmian[index][1]}.png" alt="">
                            <h5>${zhenmian[index][2]}</h5>
                            <p>剩余${zhenmian[index][3]}个</p>
                        </div>`)
        } else if (type_num == '3') {
            $e.html(`<img src="img/${zhenmian[index][1]}.png" alt="" class="shipin"> `)
        } else {
            $e.html(`<h3 class="xie_p">谢谢参与</h3>`)
        }
    })
}

function start_play() {
    $('#j_play_btn h5').html(`START<br>开始翻牌`)
    Rcard()
    $('#j_play_btn').on('click', function Fcard() {
        $('#j_play_btn').off('click', Fcard);
        $('#j_play_btn h5').html(`请选择<br>卡片`);
        card()
        $('.jiuge li').on('click','.pai', function prize(ev) {
        console.log('start')
        $('.jiuge li').off('click', prize);
        var ev = ev || window.event;
        var target = ev.target || ev.srcElement;
        var $t = $(target).closest('.pai')
        console.log($t)
        //k为模拟数据
        var k=parseInt(Math.random()*8)
        var type_num = zhenmian[k][0];
        if (type_num == '2') {
            $t.html(`<div class="shanpin">
                            <img src="img/${zhenmian[k][1]}.png" alt="">
                            <h5>${zhenmian[k][2]}</h5>
                            <p>剩余${zhenmian[k][3]}个</p>
                        </div>`)
        } else if (type_num == '3') {
            $t.html(`<img src="img/${zhenmian[k][1]}.png" alt="" class="shipin"> `)
        } else {
            $t.html(`<h3 class="xie_p">谢谢参与</h3>`)
        }
    })
    })
    
}
start_play()
