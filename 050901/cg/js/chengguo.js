var mySwiper = new Swiper('.swiper-container', {

  mode: 'horizontal',
  loop: true,
  calculateHeight: true,
  pagination: '.pagination',
  paginationClickable: true,
  autoplay: 3000,
  speed: 200,
  autoplayDisableOnInteraction: false
});

var item = $('.segment-control-item');

item.on('click', function() {

  $(this).addClass('select').siblings().removeClass('select');
  $('.segment-content').eq($(this).index()).addClass('show').siblings().removeClass('show');

  var imgArr = ['icon1','icon2','icon3'];
  var index = $(this).index();

  for(var i = 0 ; i < item.length ; i++) {

    var url = ''
    if(index == i) {
      url = 'img/' + imgArr[i] + '.png';
    } else {
      url = 'img/' + imgArr[i] + '_gray.png';
    }

    item.eq(i).children('img').attr('src', url);
  } 
});

// 点击更多按钮
$('.check-more').on('click', function() {
  if(item.eq(0).hasClass('select')) {
    // 跳转到 需求难题二级页面
    window.location.href = 'more-page.html?xq';

  } else if(item.eq(1).hasClass('select')) {
    // 跳转到 成果库二级页面
    window.location.href = 'more-page.html?cg';

  } else if(item.eq(2).hasClass('select')) {
    // 跳转到 专家二级页面
    window.location.href = 'more-page.html?zj';
  }
});


$('.industry-type-list-item').on('click', function() {
  $(this).addClass('active').siblings().removeClass('active');
});

$('.segment-item').on('click', function() {
  $(this).children().children('a').addClass('select');
  $(this).siblings().children().children('a').removeClass('select');
  $('.group').eq($(this).index()).addClass('show').siblings().removeClass('show');
});

$('.result-list-item').hover(function() {

  $(this).children('.result').addClass('result-select');
  $(this).children('.result').children('.result-info').children('.check-detail').addClass('check-detail-select');
  $(this).siblings().children('.result').removeClass('result-select');
  $(this).siblings().children('.result').children('.result-info').children('.check-detail').removeClass('check-detail-select');
});

$('.need-list-item').hover(function() {
  $(this).children('.item-block').addClass('item-block-select');
  $(this).siblings().children('.item-block').removeClass('item-block-select');
  $(this).children('.item-block').children('.check-detail').addClass('need-check-detail');
  $(this).siblings().children('.item-block').children('.check-detail').removeClass('need-check-detail');
});

$('.expert-list-item').hover(function() {
  $(this).addClass('expert-item-select');
  $(this).siblings().removeClass('expert-item-select');
  $(this).children().children('div').children('span').addClass('detail-select');
  $(this).siblings().children().children('div').children('span').removeClass('detail-select');
});


$('.ku-list-item').on('click', function() {

  if ($(this).index() == 3) {
    return;
  }
  var index = 2 - $(this).index();
  $('.segment-control-item').eq(index).addClass('select').siblings().removeClass('select');
  $('.segment-content').eq(index).addClass('show').siblings().removeClass('show');

  var imgArr = ['icon1','icon2','icon3'];
  for(var i = 0 ; i < item.length ; i++) {

    var url = ''
    if(index == i) {
      url = 'img/' + imgArr[i] + '.png';
    } else {
      url = 'img/' + imgArr[i] + '_gray.png';
    }

    item.eq(i).children('img').attr('src', url);
  } 
});


// 点击分类的下一个按钮
var _h = 0;

var count = $('.industry-type-list-item').length;
var length = - (count - 15) * 56;

$('.next').on('click', function() {
  if ($('.industry-type-list').css('top') == length + 'px'){
    return;
  }
  else {
    next();
  }
});

$('.pre').on('click', function() {
  if ($('.industry-type-list').css('top') == '0px'){
    return;
  }
  else {
    pre();
  }
});
function next(){
  _h -= 56;
  $('.industry-type-list').css('top', _h+'px');
}
function pre(){
  _h += 56;
  $('.industry-type-list').css('top', _h+'px');
}














