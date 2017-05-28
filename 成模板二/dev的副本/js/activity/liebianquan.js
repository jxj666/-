// url上获取参数
function getQueryString(name) {
    var reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", 'i');
    var str_arr = window.location.search.substr(1).match(reg);
    return str_arr != null ? str_arr[1] : null;
}
var o = {};
o.name = '';
o.id = getQueryString('auid') || null;
o.jmcnl = getQueryString('jmcnl') || null;
o.shareImage = '';
// 序列化一个key/value对象
function url_surfix(params) {

    var theRequest = {};
    if (!params) {
        theRequest.auid = o.selfid;
        return decodeURIComponent($.param(theRequest));
    }
    var str = params.substr(1);
    var str_arr = str.split('&');
    $.each(str_arr, function (i, v) {
        theRequest[v.split('=')[0]] = decodeURIComponent(v.split('=')[1]);
    });
    theRequest.auid = o.selfid;
    return decodeURIComponent($.param(theRequest));
}

function wx_ready() {
    var _hostname = window.location.hostname;
    var testReg = /test/ig;
    var condition = testReg.test(_hostname);
    var weiopHost = condition ? 'test.weiop.taozuike.com' : 'weiop.taozuike.com';
    var shareDesc = o.name + '分享必需购物券，邀你参加必需商城茶烟酒共享节，点击领取';
    var shareImg = 'https://weiop.oss-cn-beijing.aliyuncs.com/libian/img/150.jpg';//o.shareImage;
    var shareLink = 'https://' + weiopHost + '/a/p/bixu-voucher-arf.html?' + url_surfix(location.search);
    shareLink = _joyAnalytics.countLevel(shareLink);
    var shareTitle = '珍贵的茶烟酒，与亲友共享！您有150元券未领取……';
    wx.hideMenuItems({
        menuList: ["menuItem:copyUrl",
            "menuItem:openWithQQBrowser",
            "menuItem:openWithSafari",
            "menuItem:originPage"],
        success: function (res) {
        }
    });
    wx.onMenuShareTimeline({
        title: shareTitle, // 分享标题
        link: shareLink, // 分享链接
        imgUrl: shareImg, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            _joyAnalytics.send("share", {
                aid: 'S000004'
            });
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareAppMessage({
        title: shareTitle,
        desc: shareDesc,
        link: shareLink,
        imgUrl: shareImg,
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
            _joyAnalytics.send("share", {
                aid: 'S000003'
            });
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQQ({
        title: shareTitle,
        desc: shareDesc,
        link: shareLink,
        imgUrl: shareImg,
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
            _joyAnalytics.send("share", {
                aid: 'S000002'
            });
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQZone({
        title: shareTitle,
        desc: shareDesc,
        link: shareLink,
        imgUrl: shareImg,
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
            _joyAnalytics.send("share", {
                aid: 'S000005'
            });
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareWeibo({
        title: shareTitle,
        desc: shareDesc,
        link: shareLink,
        imgUrl: shareImg,
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
            _joyAnalytics.send("share", {
                aid: 'S000006'
            });
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
}
function friends(id) {
    $.ajax({
        url: '/api/common/getActivityFriendsWithBusiness',
        method: 'post',
        data: {
            param: JSON.stringify({'auid': id, 'page': 1, 'size': 100, 'withUser': true, jmcnl: o.jmcnl})
        },
        success: function (res) {
            var code = res.code;
            if (code === 1) {
                var data_arr = res.context;
                var _html = '';
                data_arr.forEach(function (n, index) {
                    var user = n.user;
                    $('.help-list li').eq(index).html('<img src="' + user.avatar + '">')
                })
                $('.helper-wrap').removeClass('invisible');
            } else {
                alert(res.msg);
            }
        },
        error: function () {

        }
    });
}
function getView() {
    var postData = {name: 'view', pid: 'ryxbxsc-groupon-p120', jmcnl: o.jmcnl};
    o.id && (postData.auid = o.id);
    $.post('/act/rule/BIXUX00001', postData).done(function (data) {
        if (data.code === 1) {
            var systemTime = data.systemTime;
            data = data.context;
            o.selfid = data.actUser.id;
            !o.id && (o.id = o.selfid);
            o.name = data.userInfo.nickname;
            wx.ready(function () {
                wx_ready();
            });
            o.pid = data.awardMum.productId;

            $('.head-txt').find('a').html('<img src="' + data.userInfo.avatar + '">');

            var _btn_html = '';
            if (data.awardMumExt.status == 0) {
                _btn_html = '<div class="future-get-coupons-btn btn-disabled">即将<br>到手</div>';
            }
            else if (data.awardMumExt.status == 1) {
                _btn_html = '<a href="https://h5.youzan.com/v2/usercenter/14sisixgc" class="already-get-coupons-btn">使用</a>';
            }
            var _htmlMum = '<div class="coupons-info" data-pid="'
                + data.awardMum.productId + '"><div class="coupons-price"><img src="http://weiop.oss-cn-beijing.aliyuncs.com/ruanyuxi/img/liebian120.png"</div><p class="expiry-date">有效期至'
                + data.awardMum.expireTime
                + '</p></div>'
                + _btn_html;
            $('[data-award=mum]').html(_htmlMum);
            var _btn_sun_html = '';
            if (data.awardSunExt.status == 0) {
                _btn_sun_html = '<a href="javascript:void(0);" class="future-get-coupons-btn" id="get-coupons-38">领取</a>';
            }
            else if (data.awardSunExt.status == 1) {
                _btn_sun_html = '<a class="already-get-coupons-btn" href="https://h5.youzan.com/v2/usercenter/14sisixgc">使用</a>';
            }
            var _htmlSun = '<div class="coupons-info" data-pid="'
                + data.awardSun.productId + '"><div class="coupons-price"><img src="http://weiop.oss-cn-beijing.aliyuncs.com/ruanyuxi/img/liebian30.png"</span></div><p class="expiry-date">有效期至'
                + data.awardSun.expireTime
                + '</p></div>'
                + _btn_sun_html;
            $('[data-award=sun]').html(_htmlSun);

            // 好友列表
            $('.helper-num span').html(data.actUser.friends);
            friends(o.selfid);
            if ($('#get-coupons-38').length > 0) {
                // 领取
                $('#get-coupons-38').on('click', function (e) {
                    if (e && e.preventDefault) {
                        e.preventDefault();
                    }
                    $.ajax({
                        url: '/act/rule/BIXUX00001',
                        type: 'post',
                        data: {
                            name: 'create',
                            auid: o.id,
                            pid: o.pid,
                            jmcnl: o.jmcnl
                        },
                        success: function (res) {
                            var code = res.code;
                            if (code === 1) {
                                $('#get-coupons-38').off('click').html('使用')
                                    .removeClass('get-coupons-btn').addClass('already-get-coupons-btn')
                                    .attr('href', 'https://h5.youzan.com/v2/usercenter/14sisixgc');
                                friends(o.selfid);
                            }
                            else {
                                alert(res.msg);
                            }
                        }
                    });
                });
            }
        }
        else {
            alert(data.msg);
        }
    });
}
getView();

/*$('.close').on('click', function () {
 $('.pop').addClass('invisible');
 });*/
