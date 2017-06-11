wx.config({
    debug: false,
    appId: weixin_token.appId,
    timestamp: weixin_token.timestamp,
    nonceStr: weixin_token.nonceStr,
    signature: weixin_token.signature,
    jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'hideOptionMenu',
        'showOptionMenu'
    ]
});
wx.ready(function () {
    wx.hideMenuItems({
        menuList: [
            "menuItem:copyUrl",
            "menuItem:openWithQQBrowser",
            "menuItem:openWithSafari",
            "menuItem:originPage"
        ], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        success: function (res) {

        }
    });
});
function share(actObj) {
    var pre_fix = location.origin;
    var pathname = location.pathname;
    var shareLink = pre_fix + pathname + '?activityid=' + activity_id;
    shareLink = _joyAnalytics.countLevel(shareLink);

    if (actObj.id != null && actObj.id != "") {
        shareLink += '&auid=' + actObj.id;
    }

    if (actObj.jmcnl && actObj.jmcnl != '') {
        shareLink += '&jmcnl=' + actObj.jmcnl;
    }

    var shareTitle = actObj.shareTitle;
    var shareDesc = actObj.shareDesc;
    var shareImg = actObj.shareImage;


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
