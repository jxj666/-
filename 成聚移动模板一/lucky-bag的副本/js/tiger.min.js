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
$('.close_pop').on('click', function() {
    $('.pop-bg').addClass('invisible');
});


$('.pop-close').on('click', function() {
    $('div.pop-bg').addClass('invisible');
});
// 点击领取跳转到中奖详情
$('.lucky-get').on('click', function() {
    $('.pop-bg').addClass('invisible')
});
$('.pop-bg3 button').on('click', function() {
    $('.pop-bg').addClass('invisible')
})

//优惠券
$('.coupon-pop-close').on('click', function() {
    $('.pop-bg').addClass('invisible');

})
$('.get-coupon-btn').on('click', function() {
    $('.pop-bg').addClass('invisible');
     $('.pop-bg').removeClass('invisible');
})
$('.get-img-item a').on('click', function() {
    $('.pop-bg').removeClass('invisible');
})
$('.guize').on('click', 'a', function() {
    // console.log($(this).attr('data-click'));
   
    $('.tip-bg').removeClass('invisible');
    $('.statement-tip').removeClass('invisible')
        .siblings().addClass('invisible');
});
//老虎机
var miao_n=3133;
var zonjian_n=7777;
var choujian_n=6666;
var songchu_n=2222;
var fanwen_n=166;
var jihui_n=9;
var zhonjian_n=0;
var chushi=['phy_21','fanpai_15','fanpai_03'];
var html_t='';

$('.jihui_s').text(jihui_n)

for(var i=0;i<5;i++){
for(var j=0;j<chushi.length;j++){
html_t+=`<div class="img_c"><img src="img/${chushi[j]}.png"></div>`
}
}
$('.num-img').html(html_t)

$(".main3-btn").click(function() {
    jihui_n-=1;
    if(jihui_n>=0){
         $('.jihui_s').text(jihui_n);   
    }else{
        var text='';
        if(zhonjian_n<1){
            text=' 你的运气不怎么样!<br>老虎跟鸡都没得到!<br>T_T'
        }else if(zhonjian_n>0&&zhonjian_n<3){
            text=' 你的运气在正常水平!<br>不好不坏!<br>一般人...'
        }else{
            text=' 你的运气在超凡的好!<br>今晚要老虎还是要鸡!<br>^_^'
        } 

       $('.btn_t').html('截图分享') 
       $('.xushu_t').html(text);
       $('.pop-bg3').removeClass('invisible');

        return;
    }
    if (!flag) {
        flag = true;
        reset();
        letGo();
        setTimeout(function() {
            flag = false;
        }, 3000);
        index++;
    }
});

var flag = false;
var index = 0;
var TextNum1
var TextNum2
var TextNum3
var jihui=9;
function letGo() {

    TextNum1 = parseInt(Math.random() * 7) //随机数
    TextNum2 = parseInt(Math.random() * 7)
    TextNum3 = parseInt(Math.random() * 7)
    var bol3=TextNum3%3;
    var bol2=TextNum2%3;
    var bol1=TextNum1%3;
     if (bol3===bol2&&bol2===bol1) {

        if(bol1==1){
            zhonjian(2)
        }else if(bol1==2){
           zhonjian(0)
        }else{
            zhonjian(1)
        }
    }else{
         meizhon()
    }
    var num1 = [-1.5, -3, -4.5, -6,-7.5,-9,-10.5,-12][TextNum1]; //在这里随机
    var num2 = [-1.5, -3, -4.5, -6,-7.5,-9,-10.5,-12][TextNum2];
    var num3 = [-1.5, -3, -4.5, -6,-7.5,-9,-10.5,-12][TextNum3];
    $(".num-con1").animate({
        "top": -15+'rem'
    }, 1000, "linear", function() {
        $(this).css("top", 0).animate({
            "top": num1+'rem'
        }, 1000, "linear");
    });
    $(".num-con2").animate({
        "top": -15+'rem'
    }, 1000, "linear", function() {
        $(this).css("top", 0).animate({
            "top": num2+'rem'
        }, 1800, "linear");
    });
    $(".num-con3").animate({
        "top": -15+'rem'
    }, 1000, "linear", function() {
        $(this).css("top", 0).animate({
            "top": num3+'rem'
        }, 1300, "linear");
    });

}
function zhonjian(num){
setTimeout(function(){
    $('.yogurt').attr('src',`img/${chushi[num]}.png`)
  $('.pop-bg2').removeClass('invisible');
  
  zhonjian_n+=1;
  $('.zhonjian_s').text(zhonjian_n);
    
},3000);
}
function meizhon(){
setTimeout(function(){

    $('.pop-bg3').removeClass('invisible');
},3000);
}
function reset() {
    $(".num-con1,.num-con2,.num-con3").css({
        "top": -5.7+'rem'
    });
}



var time1=setInterval(function(){
    miao_n -=1;
    var k='';
    choujian_n +=parseInt(Math.random() * 10);
    var s=miao_n%60;
    var m=parseInt(miao_n/60);
$('.minutes ').text(m)
  s>9? k=s : k=('0'+s);
$('.seconds ').text(k)

$('.code-count').text(choujian_n)
},1000)
var time2=setInterval(function(){
    zonjian_n-=1;
    songchu_n+=1;
    fanwen_n+=parseInt(Math.random() * 1.2);
;
$('.stock-num ').text(zonjian_n)
$('.prize-count ').text(songchu_n)
$('.person-count').text(fanwen_n)
},2000)

window.onload=function(){$('.pop-bg').addClass('invisible');}





//jihui_s
//zhonjian_s
