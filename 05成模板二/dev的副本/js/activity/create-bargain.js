$(function () {
// 拖动条
    $('[data-level] input').ionRangeSlider({
        /* min: 0,
         max: 100,*/
        from: 0,
        to: 100,
        type: 'double',
        step: 1,
        prefix: '￥',
        max_postfix: '+',
        prettify: false,
        grid: true,
        grid_num: 5,
        keyboard: true,
        force_edges: true,
        /* onFinish: function () {
         var to = $(this).data('to');
         var max = $(this).data('max');
         console.log('to:' + to + 'max:' + max);
         if (to >= max) {
         var slider = $(this).data('ionRangeSlider');

         // Call sliders update method with any params
         slider.update({
         max: max - 0 + 100
         });
         }
         }*/
    })

// 上传图片
//    var images = [];
    $('[data-tz="imgUpload"]').on('change', function () {
        var $this = $(this);
        var formData = new FormData();
        formData.append('file', this.files[0]);
        var channel = $this.data('channel');
        formData.append('channel', channel);
        $.ajax({
            url: '/op/storage/upload',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json'
        }).done(function (res) {
            var code = res.code;
            if (code === 1) {
                console.log('上传成功,图片地址为:' + res.context.url);
                var url = res.context.url;
                if (url) {
                    $this.parent().next('[type="hidden"]').val(url);
                    $this.prev().remove();
                    $('<div class="pic"><img src=' + url + '></div>').insertBefore($this);
                    var iframeTar = $this.data('iframe');
                    if (iframeTar) {
                        $(document.getElementById('iframe1').contentWindow.document.body).find(iframeTar).attr('src', url);
                    }
                    var selTar = $this.data('seltar');
                    if (selTar) {
                        $(selTar).find('option:selected').attr('data-image', url);
                    }
                }
            }
            else {
                alert(code + '\r\n' + res.message);
            }
        }).fail(function (res) {
            alert('上传失败!请重试');
        });
    })
        .focus(function () {
            var iframeTar = $(this).data('iframe');
            var offsetTop = $(document.getElementById('iframe1').contentWindow.document.body).find(iframeTar).offset().top - 60;// 60是大喇叭的高度
            $(document.getElementById('iframe1').contentWindow.document.body).animate(
                {scrollTop: offsetTop}
                , 500);
        });
    $('[type="url"]').change(function () {
        var $target = $(this).parent().find('.pic img');
        if ($target.length > 0) {
            $target.attr('src', $(this).val());
        }
    });
    // 日期范围
    $('#datetimepicker3').datetimepicker({
        format: 'l'
    });
    $('#datetimepicker4').datetimepicker({
        format: 'l'
    });
    $("#datetimepicker3").on("dp.change", function (e) {
        $('#datetimepicker4').data("DateTimePicker").minDate(moment(e.date).add(1, 'hour'));
    });
    $("#datetimepicker4").on("dp.change", function (e) {
        $('#datetimepicker3').data("DateTimePicker").maxDate(moment(e.date).subtract(1, 'hour'));
    });

    // 奖品图片
    $('#productName').change(function () {
        var $option = $(this).find('option:selected');
        $('#productDesc').val($option.data('description'));
        $('#quantity').val($option.data('quantity'));
        $('#originPrice').val($option.data('price'));
        $('#limitPrice').val(0);
        $('#productImage').val($option.data('image'))
            .parent().find('img').attr('src', $option.data('image'));

    });

// 上传信息
    $('#toSave').click(function () {
        $('#save').trigger('click');
    });
    $('#formCreate').parsley().on('form:submit', function () {
        var $name = $('#actName');
        var $beginTime = $('#datetimepicker3');
        var $endTime = $('#datetimepicker4');
        var $desc = $('#desc');
        var $pid = $('#pid');
        var $appId = $('#appId');
        var $bgImage = $('#bgImage');
        var $productUrl = $('#productUrl');
        var $productName = $pid.find('option:selected');
        var $productDesc = $('#productDesc');
        var $productImage = $('#productImage');
        var $quantity = $('#quantity');
        var $originPrice = $('#originPrice');
        var $maxFriend = $('#maxFriend');
        var $limitPrice = $('#limitPrice');
        var $randomContent = $('#randomContent');
        var $rule = $('#rule');
        var $shareTitle = $('#shareTitle');
        var $shareDesc = $('#shareDesc');
        var $shareImage = $('#shareImage');
        var $adImage = $('#adImage');
        var $qrImage = $('#qrImage');
        var $leave1 = $('#leave1');
        var $leave2 = $('#leave2');
        var $leave3 = $('#leave3');
        var $leave4 = $('#leave4');
        if ($beginTime.val() >= $endTime.val()) {
            alert('结束时间必须大于开始时间');
            return false;
        }
        var levelRule = [
            {
                level: 1,
                min: $.trim($leave1.val()).split(';')[0],
                max: $.trim($leave1.val()).split(';')[1],
                threshold: 0
            },
            {
                level: 2,
                min: $.trim($leave2.val()).split(';')[0],
                max: $.trim($leave2.val()).split(';')[1],
                threshold: 25
            },
            {
                level: 3,
                min: $.trim($leave3.val()).split(';')[0],
                max: $.trim($leave3.val()).split(';')[1],
                threshold: 50
            },
            {
                level: 4,
                min: $.trim($leave4.val()).split(';')[0],
                max: $.trim($leave4.val()).split(';')[1],
                threshold: 75
            }
        ];
        $.ajax({
            url: '/weiop/activity/create',
            type: 'POST',
            data: {
                appid: $.trim($appId.val()), // 客户公众号账号
                name: $.trim($name.val()), // 活动名称
                begin_time: $beginTime.val(), // 活动开始时间
                end_time: $endTime.val(), // 活动结束时间
                desc: $.trim($desc.val()), // 活动描述
                product_id: $.trim($pid.val()), // 关联产品
                comp_appid:'', // 开发平台账号
                need_pay:'', // 活动奖品是否需要支付
                need_pay_final_after_end:'', // 活动结束后是否允许直接购买
                pay_config_name:'', // 微信支付配置
                short_limit:'', // 排行榜限制人数
                time_for_pay_after_end_in_hour:'', // 活动结束后N小时内允许购买
                status:'', // 活动状态
                traceid:'', // 追踪ID

                // type: 1,
                // bgImage: $bgImage.val(),
                // productName: $.trim($productName.html()),
                // productDesc: $.trim($productDesc.val()),
                // quantity: $.trim($quantity.val()),
                // originPrice: $.trim($originPrice.val()),// 原价
                // productImage: $.trim($productImage.val()),
                // maxFriend: $.trim($maxFriend.val()),
                // limitPrice: $.trim($limitPrice.val()),// 要砍到的价格
                // randomContent: $.trim($randomContent.val()),
                // rule: $.trim($rule.val()).replace('\r', ''),
                // shareTitle: $.trim($shareTitle.val()),
                // shareDesc: $.trim($shareDesc.val()),
                // shareImage: $.trim($shareImage.val()),
                // levelRule: JSON.stringify(levelRule),
                // adImage: $.trim($adImage.val()),
                // qrImage: $.trim($qrImage.val()),
                // productUrl: $.trim($productUrl.val()),
                // demoMainPageId: 'demo-preview'
            },

            success: function (data) {
                if (data.code === 1) {
                    $('#modal-success [data-info="url"]').html(data.context.act_url).attr('href', data.context.act_url);
                    $('#modal-success .media-object').attr('src', data.context.act_qr);
                    $('#modal-success [data-info="activityName"]').html(data.context.name);
                    $('#modal-success [data-info="activityTime"]').html(data.context.start_time);
                    $('#modal-success [data-info="statUrl]').html(data.context.stat_url);
                    $('#modal-success').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                }
                else {
                    alert(data.msg);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status === 0) {
                    alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
                    location.reload();
                    return;
                }
                alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
            }
        });
        return false;
    });
    window.Parsley.on('field:error', function () {
        // This global callback will be called for any field that fails validation.
        var target = $(this.$element).attr('name');
        alert('"' + target + '" 验证不通过');
    });
});

