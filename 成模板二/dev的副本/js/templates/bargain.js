/**
 * @file 砍价模板
 * */
function pageReload() {
    if (/android/i.test(navigator.userAgent)) {
        window.location.href = window.location.href.indexOf('?') === -1 ? (window.location.href + '?rggf=' + new Date().getTime())
            : window.location.href + '&rggf=' + new Date().getTime();
    }
    else {
        window.location.reload();
    }
}
function parse(str) {
    var s0 = str.split(" ");
    var s1 = s0[0].split("-");
    var s2 = s0[1].split(":");
    return new Date(parseInt(s1[0]), parseInt(s1[1]) - 1, parseInt(s1[2]), parseInt(s2[0]), parseInt(s2[1]), parseInt(s2[2]));
}

function getQueryString(name) {
    var reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", 'i');
    var str_arr = window.location.search.substr(1).match(reg);
    return str_arr != null ? str_arr[1] : null;
}

function ajaxFail(res, code) {
    alert(code + '\r\n' + res.msg);
    return;
}
// tab切换
$('[data-toggle="tab"]').click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('text-price')) {
        var id = $(this).data('target');
        $('[data-toggle="tab"]').removeClass('text-price');
        $(this).addClass('text-price');
        $(id).closest('.tab-content').find('.tab-pane.active').removeClass('active in');
        $(id).addClass('active in');
    }
})

var activity_id = getQueryString('activityid');
var actObj = {
    name: '',
    activityName: '',
    id: getQueryString('auid') || null,
    jmcnl: getQueryString('jmcnl') || '',
    cut: 0,
    otherid: 0,
    me: false,
    expire: false,
    notStart: false,
    needPrice: 0, // 再砍多少
    initPrice: 0, // 原价
    targetPrice: 0, // 目标价
    now_time: 0,
    end_time: 0,
    shareImage: '',
    shareDesc: '',
    shareTitle: '',
    compAppid: ''
};
var totalPrice = 0;

(function activity() {
    $.ajax({
        url: '/api/common/getActivity',
        method: 'post',
        data: {
            param: JSON.stringify({activity_id: activity_id})
        },
        success: function (res) {
            var code = res.code;
            if (code === 1) {
                var data = res.context;
                // 是否显示排行榜
                data.sortLimit <= 0 ? $('.bargain-gang.haschart').removeClass('haschart')
                    : $('.bargain-gang').addClass('haschart');

                // $('.countdown-bg').html('<img src="' + data.bgImage + '">');
                if (!$.isEmptyObject(data.paramsMap)) {
                    var paramsMap = data.paramsMap;
                    actObj.shareImage = paramsMap['基础配置']['acms.common.share.icon'].value;
                    actObj.shareDesc = paramsMap['基础配置']['acms.common.share.desc'].value;
                    actObj.shareTitle = paramsMap['基础配置']['acms.common.share.title'].value;
                    actObj.initPrice = paramsMap['活动配置']['acms.bargain.price.init'].value;
                    actObj.targetPrice = paramsMap['活动配置']['acms.bargain.price.target'].value;
                    // 初始价格 目标价格
                    $('.price-bar').find('[data-info=originPrice]').text(actObj.initPrice);
                    $('.price-bar').find('[data-info=limitPrice]').text(actObj.targetPrice);
                    totalPrice = actObj.initPrice - actObj.targetPrice;

                    $('#product-page').attr('href', paramsMap['活动配置']['acms.bargain.product.url'].value);
                }
                // 是否显示商品详情
                $('#product-page').attr('href').length <= 0 ? $('#product-page').hide()
                    : $('#product-page').show();
                actObj.activityName = data.name; // 活动名称

                actObj.compAppid = data.compAppid;

                actObj.now_time = parse(data.currentTime);
                var begin_time = parse(data.beginTime);
                actObj.end_time = parse(data.endTime);

                actObj.expire = data.expire;

                if (actObj.expire) {
                    $('.cd-clock').html('<span class="text-time">活动已结束~</span>');
                }
                else {
                    updateCountDown(actObj.end_time, 0);
                }

                if (actObj.now_time < begin_time) {
                    // 活动未开始
                    actObj.notStart = true;
                    $('.cd-clock').html('<span class="text-time">活动未开始~</span>');
                }
                checkAuid();
            }
            else {
                ajaxFail(res, code);
            }
        }
    });
})()

// 没有auid的时-创建create，有-view
function checkAuid() {
    if (!actObj.id) {
        var actCreate = (function () {
            $.ajax({
                url: '/act/create/' + activity_id,
                data: {
                    jmcnl: actObj.jmcnl
                },
                method: 'post',
                success: function (res) {
                    var code = res.code;
                    if (code === 1) {
                        var data = res.context;
                        var actUser = data.actUser;
                        var actUserExt = data.actUserExt;
                        var order = data.order;
                        actObj.id = actUser.id;
                        actObj.jmcnl = actUser.code;
                        userInfo(actUserExt, order);
                    }
                    else {
                        ajaxFail(res, code);
                    }
                }
            });
        })();
    }
    else {
        var myview = (function () {
            $.ajax({
                url: '/act/view/' + activity_id + '/' + actObj.id,
                method: 'post',
                success: function (res) {
                    var code = res.code;
                    if (code === 1) {
                        var data = res.context;
                        var actUser = data.actUser;
                        var actUserExt = data.actUserExt;
                        var order = data.order;
                        var user = data.user;
                        showStatusWithAuid(actUser, actUserExt, user, order);
                    }
                    else {
                        ajaxFail(res, code);
                    }
                }
            });
        })();
    }
}

// 用户信息
function userInfo(actUserExt, order) {
    $.ajax({
        url: '/user/info',
        method: 'get',
        success: function (res) {
            var code = res.code;
            if (code === 1) {
                var user = res.context.user;
                $('.price-left').html('<img src="' + user.avatar + '" class="price-object">');
                showStatusWithoutAuid(actUserExt, user, order);
            }
            else {
                ajaxFail(res, code);
            }
        }
    });
}

function showStatusWithoutAuid(actUserExt, user, order) {
    // $('.price-body').html('<p><span class="text-user">' + user.nickname + '</span>参加“浓酱呈祥，大过鸡年”砍价活动，已有<span class="text-price" data-id="price-number">' + actUserExt.freindsCount + '</span>位朋友帮忙砍价，共砍价<span class="text-price" data-id="price-past">' + actUserExt.cutPrice + '</span>元,再砍掉<span class="text-price" data-id="price-leave">' + actUserExt.needPrice + '</span>元就成功了！')
    var $priceBody = $('.price-body');
    actObj.needPrice = totalPrice - actUserExt.cutPrice;
    $priceBody.find('[data-info="userNickname"]').html(user.nickname);
    $priceBody.find('[data-info="actUserExtFreindsCount"]').html(actUserExt.freindsCount);
    $priceBody.find('[data-info="actUserExtCutPrice"]').html(actUserExt.cutPrice);
    $priceBody.find('[data-info="actUserExtNeedPrice"]').html(actObj.needPrice);
    $priceBody.find('[data-info="activityName"]').html(actObj.activityName);
    // 自己看
    $priceBody.find('[data-status]').hide();
    $priceBody.find('[data-status="self-before"]').show();

    actObj.name = user.nickname;
    wx.ready(function () {
        share(actObj);
    });
    // 做除法
    var num = Number((parseFloat(actUserExt.cutPrice) * 100 / totalPrice).toFixed(6));
    $('.price-bar-bd')[0].style.width = num + '%';

    $('.meor').html('我的砍价帮');
    showFriends();
    if (actObj.expire) {
        // 如果在结束后24小时以内
        var diff_time = (Number(actObj.now_time) - Number(actObj.end_time)).toFixed(0);
        // $('.price-body').html('<p>砍价活动已结束，可按照最终价格支付抢购。<br>请于活动结束后24小时内支付，否则视为放弃资格。</p>');
        $priceBody.find('[data-status]').hide();
        $priceBody.find('[data-status="self-24"]').show();
        if (diff_time >= 0 && diff_time < 1000 * 60 * 60 * 24) {
            if (!order) {
                deadlineShopping();
            }
            else {
                // 去订单详情
                $('.myself').removeClass('invisible');
                $('.others').addClass('invisible');
                var cutbtn = $('.myself').find('a');
                goOrderorgoChop(cutbtn, order);
            }
        }
        else {
            $('.others').addClass('invisible');
            $('.myself').addClass('invisible');
            $('.alreadyfinished').removeClass('invisible');
        }

    }
    else if (actObj.notStart) {
        $('.others').addClass('invisible');
        $('.myself').addClass('invisible');
        $('.notyet').removeClass('invisible');
    }
    else {
        if (num >= 100) {
            // $('.price-body').html('<p>恭喜您，砍价成功！立即支付，总价998元的三大吉礼只要229元打包带回家！大过鸡年，给您拜年啦。</p>');
            $priceBody.find('[data-status]').hide();
            $priceBody.find('[data-status="self-after"]').show();
        }
        actObj.me = actUserExt.isMe;
        actObj.cut = actUserExt.isCut;
        $('.myself').removeClass('invisible');
        $('.others').addClass('invisible');
        var cutbtn = $('.myself').find('a');
        goOrderorgoChop(cutbtn, order);
    }
}

function showStatusWithAuid(actUser, actUserExt, user, order) {
    $('.price-left').html('<img src="' + user.avatar + '" class="price-object">');

    // $('.price-body').html('<p><span class="text-user">' + user.nickname + '</span>参加“浓酱呈祥，大过鸡年”砍价活动，已有<span class="text-price" data-id="price-number">' + actUserExt.freindsCount + '</span>位朋友帮忙砍价，共砍价<span class="text-price" data-id="price-past">' + actUserExt.cutPrice + '</span>元,再砍掉<span class="text-price" data-id="price-leave">' + actUserExt.needPrice + '</span>元就成功了！</p>')
    var $priceBody = $('.price-body');
    actObj.needPrice = totalPrice - actUserExt.cutPrice;
    $priceBody.find('[data-info="userNickname"]').html(user.nickname);
    $priceBody.find('[data-info="actUserExtFreindsCount"]').html(actUserExt.freindsCount);
    $priceBody.find('[data-info="actUserExtCutPrice"]').html(actUserExt.cutPrice);
    $priceBody.find('[data-info="actUserExtNeedPrice"]').html(actObj.needPrice);
    $priceBody.find('[data-info="activityName"]').html(actObj.activityName);
    // 看别人成功前
    $priceBody.find('[data-status]').hide();
    $priceBody.find('[data-status="other-before"]').show();

    actObj.name = user.nickname;
    // 初始价格 目标价格
    $('.price-bar').find('[data-info=originPrice]').text(actUserExt.originPrice);
    $('.price-bar').find('[data-info=limitPrice]').text(actUserExt.limitPrice);
    // 做除法
    //var num = Number(Number(actUserExt.cutPrice)/totalPrice).toFixed(2) * 100;
    var num = Number((parseFloat(actUserExt.cutPrice) * 100 / totalPrice).toFixed(6));
    $('.price-bar-bd')[0].style.width = num + '%';

    actObj.me = actUserExt.isMe;
    actObj.cut = actUserExt.isCut;
    actObj.otherid = actUserExt.myAuid;
    showFriends();

    if (actObj.me) {
        actObj.jmcnl = actUser.code;
        wx.ready(function () {
            share(actObj);
        });
        // 我的页面
        $('.meor').html('我的砍价帮');
        // 先判断活动是否结束或是否开始
        if (actObj.expire) {
            // 如果在结束后24小时以内
            // $('.price-body').html('<p>砍价活动已结束，可按照最终价格支付抢购。<br>请于活动结束后24小时内支付，否则视为放弃资格。</p>');
            $priceBody.find('[data-status]').hide();
            $priceBody.find('[data-status="self-24"]').show();
            var diff_time = (Number(actObj.now_time) - Number(actObj.end_time)).toFixed(0);

            if (diff_time >= 0 && diff_time < 1000 * 60 * 60 * 24) {
                if (!order) {
                    deadlineShopping();
                }
                else {
                    // 去订单详情
                    $('.others').addClass('invisible');
                    $('.myself').removeClass('invisible');
                    var cutbtn = $('.myself').find('a');
                    goOrderorgoChop(cutbtn, order);
                }
            }
            else {
                $('.others').addClass('invisible');
                $('.myself').addClass('invisible');
                $('.alreadyfinished').removeClass('invisible');
            }
        }
        else if (actObj.notStart) {
            $('.others').addClass('invisible');
            $('.myself').addClass('invisible');
            $('.notyet').removeClass('invisible');
        }
        else {
            if (num >= 100) {
                // $('.price-body').html('<p>恭喜您，砍价成功！立即支付，总价998元的三大吉礼只要229元打包带回家！大过鸡年，给您拜年啦。</p>');
                $priceBody.find('[data-status]').hide();
                $priceBody.find('[data-status="self-after"]').show();
            }
            $('.myself').removeClass('invisible');
            $('.others').addClass('invisible');
            var cutbtn = $('.myself').find('a');
            goOrderorgoChop(cutbtn, order);
        }

    }
    else {
        // 别人的页面
        wx.ready(function () {
            share(actObj);
        });
        $('.myself').addClass('invisible');
        $('.others').removeClass('invisible');
        $('.meor').html('ta的砍价帮');
        var cutbtn = $('.others').find('.kkk');

        if (actObj.expire || actObj.notStart) {
            cutbtn.addClass('btn-disable');
            // $('.iwant').addClass('btn-disable');
            $('.iwant').on('click', function () {
                statistics(1);
                if (actObj.otherid) {
                    window.location.href = 'wine-wuliangjiao-main.html?activityid=' + activity_id + '&auid=' + actObj.otherid;
                }
                else {
                    window.location.href = 'wine-wuliangjiao-main.html?activityid=' + activity_id + '&jmcnl=' + actObj.jmcnl;
                }
            });
        }
        else {
            if (num >= 100) {
                cutbtn.addClass('btn-disable');
                // $('.price-body p').html(actObj.name + '参加“浓酱呈祥，大吉大利”砍价活动，已成功获得229元购买资格，三大吉礼到手啦！')
                $priceBody.find('[data-status]').hide();
                $priceBody.find('[data-status="other-after"]').show();
            }
            else {
                if (actObj.cut) {
                    // 我砍过
                    cutbtn.addClass('btn-disable');
                }
                else {
                    cutbtn.on('click', function () {
                        statistics(2);
                        chop(cutbtn);
                    });
                }
            }
            $('.iwant').on('click', function () {
                statistics(3);
                if (actObj.otherid) {
                    window.location.href = 'wine-wuliangjiao-main.html?activityid=' + activity_id + '&auid=' + actObj.otherid;
                }
                else {
                    window.location.href = 'wine-wuliangjiao-main.html?activityid=' + activity_id + '&jmcnl=' + actObj.jmcnl;
                }
            });
        }
    }
}

function goOrderorgoChop(cutbtn, order) {
    if (order) {
        if (order.payStatus === 0) {
            // 去支付
            cutbtn.html('去支付');
            cutbtn.on('click', function () {
                statistics(4);
                window.location.href = 'wine-wuliangjiao-order-detail.html?activityid=' + activity_id + '&orderid=' + order.orderid;
            });
        }
        else {
            // 查看订单
            cutbtn.html('查看订单');
            cutbtn.on('click', function () {
                statistics(5);
                window.location.href = 'wine-wuliangjiao-order-detail.html?activityid=' + activity_id + '&orderid=' + order.orderid;
            });
        }
    }
    else {
        if (actObj.cut) {
            // 我砍过
            cutbtn.addClass('btn-disable');
        }
        else {
            cutbtn.on('click', function () {
                statistics(6);
                chop(cutbtn);
            });
        }
    }
}

function chop(selector) {
    if (!selector.hasClass('btn-disable')) {
        $('#fortune').removeClass('hidden');

        showChopResult();
        window.setTimeout(function () {
            $('#fortuneing').addClass('hidden');
            $('#fortune-result').removeClass('hidden');
        }, 2700);
    }
}

function showChopResult() {
    $.ajax({
        url: '/act/help/' + activity_id + '/' + actObj.id,
        method: 'post',
        data: {
            please: prevent.please,
            dnot: prevent.dnot,
            passit: prevent.passit
        },
        success: function (res) {
            var code = res.code;
            if (code === 1) {
                var data = res.context;
                $('#cutdown_money').html(data.price);
                $('#cut_res').html(data.content);
                $('.index').html(actObj.name);
                $('.reload').on('click', function () {
                    $('#fortune').addClass('hidden');
                    $('#fortune-result').addClass('hidden');
                    pageReload();
                    statistics(7);
                });
            }
            else {
                ajaxFail(res, code);
            }
        }
    });
}

function deadlineShopping() {
    $('.myself').removeClass('invisible');
    var cutbtn = $('.myself').find('a');
    cutbtn.html('去支付');
    cutbtn.on('click', function () {
        statistics(8);
        window.location.href = 'wine-wuliangjiao-order-preview.html?activityid=' + activity_id + '&auid=' + actObj.id;
    });
}

function showFriends() {
    $.ajax({
        url: '/api/common/getActivityFriends',
        method: 'POST',
        data: {
            param: JSON.stringify({auid: actObj.id, page: 1, size: 100, withUser: true})
        },
        success: function (res) {
            var code = res.code;
            if (code === 1) {
                var data_arr = res.context;
                if (data_arr.length > 0) {
                    $('.nofriends').addClass('invisible');
                    $('.friends').removeClass('invisible');
                    var _html = '';
                    data_arr.forEach(function (n, index) {
                        var user = n.user;
                        _html += '<div class="list-group hasfeedback"><div class="gang-list-left"><img src="' + user.avatar + '" class="gang-list-object img-circle"></div><div class="gang-list-body"><h1 class="gang-list-heading">' + user.nickname + '</h1><p>' + n.data + '</p></div><span class="feedback plus">' + Number(n.score).toFixed(2) + '元</span></div>'
                    })
                    $('.friends').html(_html);
                }
                else {
                    $('.friends').addClass('invisible');
                    $('.nofriends').removeClass('invisible');
                }
            }
            else {
                ajaxFail(res, code);
            }
        }
    });
}

//  大喇叭（只能执行一次，不然会乱）
$.ajax({
    url: '/api/common/getActivityRanking',
    method: 'post',
    data: {
        param: JSON.stringify({activity_id: activity_id, limit: 20})
    },
    success: function (res) {
        var code = res.code;
        if (code === 1) {
            var data_arr = res.context;
            var _html = '';
            var li = $.trim($('.bc-notice').html());
            $.each(data_arr, function (i, user) {
                _html += li.replace(/user.nickName/ig, user.nickName)
                    .replace(/user.productName/ig, user.productName);
            })
            $('.bc-notice').html(_html);
        }
        else {
            ajaxFail(res, code);
        }
    }
});

$.ajax({
    url: '/api/common/getActivityStat',
    method: 'POST',
    data: {
        param: JSON.stringify({activity_id: activity_id})
    },
    success: function (res) {
        var code = res.code;
        if (code === 1) {
            var data = res.context;
            $('.init-chop span').html(data.users); // 发起砍价
            $('#totalpeople').html(data.users);
            $('.help-chop span').html(data.friends); // 帮忙砍价
        }
        else {
            ajaxFail(res, code);
        }
    }
});

$.ajax({
    url: '/api/common/pv',
    method: 'post',
    data: {
        param: JSON.stringify({activity_id: activity_id})
    },
    success: function (res) {
        var code = res.code;
        if (code === 1) {
            $('.pv span').html(res.context); // 查看活动
        }
        else {
            ajaxFail(res, code);
        }
    }
});


var _wrap = $('.bc-notice');//定义滚动区域
var _interval = 2000;//定义滚动间隙时间
var _moving;//需要清除的动画
_wrap.hover(function () {
    clearInterval(_moving);//当鼠标在滚动区域中时,停止滚动
}, function () {
    _moving = setInterval(function () {
        // 如果只有一条数据就不滚动了
        if (_wrap.children().length <= 1) {
            clearInterval(_moving);
            return;
        }
        var _field = _wrap.find('li:first');//此变量不可放置于函数起始处,li:first取值是变化的
        var _h = _field.height();//取得每次滚动高度
        _field.animate({marginTop: -_h + 'px'}, 600, function () {//通过取负margin值,隐藏第一行
            _field.css('marginTop', 0).appendTo(_wrap);//隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
        });
    }, _interval)//滚动间隔时间取决于_interval
}).trigger('mouseleave');//函数载入时,模拟执行mouseleave,即自动滚动
var _wrapNumber = $('.bc-number');//定义滚动区域
var _intervalNumber = 2000;//定义滚动间隙时间
var _movingNumber;//需要清除的动画
_wrapNumber.hover(function () {
    clearInterval(_movingNumber);//当鼠标在滚动区域中时,停止滚动
}, function () {
    _movingNumber = setInterval(function () {
        // 如果只有一条数据就不滚动了
        if (_wrapNumber.children().length <= 1) {
            clearInterval(_movingNumber);
            return;
        }
        var _fieldNumber = _wrapNumber.find('li:first');//此变量不可放置于函数起始处,li:first取值是变化的
        var _hNumber = _fieldNumber.height();//取得每次滚动高度
        _fieldNumber.animate({marginTop: -_hNumber + 'px'}, 600, function () {//通过取负margin值,隐藏第一行
            _fieldNumber.css('marginTop', 0).appendTo(_wrapNumber);//隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
        });
    }, _intervalNumber)//滚动间隔时间取决于_interval
}).trigger('mouseleave');//函数载入时,模拟执行mouseleave,即自动滚动

function statistics(n) {
    _joyAnalytics.send('click', {
        aid: 'C00000' + n,
        tag: 'BUTTON'
    });
}
