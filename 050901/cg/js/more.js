$(document).ready(function() {

  var search = window.location.search;
  var type = search.substring(1,search.length);
  
  if(type == '') {
    // 企业难题需求


  } else if(type == '') {
    // 院士专家

  } else if(type == '') {
    // 科技成果

  } else if(type == '') {
    // 科技金融企业库

  }

});


// 库切换
var bgArray = ['bg1','bg2','bg3','bg4'];
$('.ku-item').on('click', function() {

  var imgURL = '';

  for(var i = 0 ; i < bgArray.length ; i++) {
    if($(this).index() == i) {
      imgURL = 'url(img/' + bgArray[i] + '-select.png)';
    } else {
      imgURL = 'url(img/' + bgArray[i] + '.png)';
    }

    $('.ku-item').eq(i).css('background-image', imgURL);
  }

  $('.list').eq($(this).index()).addClass('show').siblings().removeClass('show');

  if($(this).index() == 3) {
    // 
  }

});



$('.type-item').hover(function() {
  $(this).addClass('active').siblings().removeClass('active');
});

// 点击分类的下一个按钮
var maxLeft = (0 - ($('.type-list').width() - $('.show-view').width())) + 'px';
var _left = 0;

$('.next-btn').on('click', function() {
  if (parseInt($('.type-list').css('left')) < parseInt(maxLeft)) {
    return;
  } else {
    next();
  }
});

$('.pre-btn').on('click', function() {
  if ($('.type-list').css('left') == '0px'){
    return;
  } else {
    prev();
  }
});


function next() {  _left -= 60;   $('.type-list').css('left', _left+'px'); }
function prev() {  _left += 60;   $('.type-list').css('left', _left+'px'); }



