var index = getQueryString('index');
if (index == '11') {
    $('.weichaikai_k').removeClass('invisible');
    $('.weichaikai_k').on('click', function() {
        $('.jianpin_k').addClass('invisible');
        $('.btn1_k').addClass('invisible');
        $('.shiwu_k').removeClass('invisible');
        $('.meidizhi_k').removeClass('invisible');
        $('.penyou h5').text('已有58位好友帮拆，呼朋唤友来帮忙吧')
        var html_w = '';
        for (var i = 0; i < 29; i++) {
            html_w += `<img src="img/phy_36.jpg" alt=""><img src="img/phy_32.jpg" alt="">`
        }
        $('.img-box').html(html_w)
        $('.img-box').addClass('img-box2')
    })

} else {
    $('.jianpin_k').addClass('invisible');
    $('.honbao_k').removeClass('invisible');
    $('.shuomin_k').addClass('invisible');
    $('.baoshuomin_k').removeClass('invisible');
    $('.linhonbao_k').removeClass('invisible');
    $('.linhonbao_k').on('click', function() {
        $('.linhonbao_k').css({'color':'#fff','text-shadow':'0 0 .02rem gray'})
        $('.linhonbao_k').addClass('btn_fontg');
        var html_w = '';
        for (var i = 0; i < 29; i++) {
            html_w += `<img src="img/phy_36.jpg" alt=""><img src="img/phy_32.jpg" alt="">`
        }
         $('.img-box').html(html_w)
        $('.img-box').addClass('img-box2')
    })
    $('.baoshuomin_k').on('click',function(){
        $('.pop-bg').removeClass('invisible')
    })
    $('.hb-pop-close').on('click',function(){
        $('.pop-bg').addClass('invisible')
    })

}

$('.pp_body button').on('click',function(){
    location.href="gift.html"
})
$('.getinfo a').on('click',function(){
    location.href="winner_list.html"
})