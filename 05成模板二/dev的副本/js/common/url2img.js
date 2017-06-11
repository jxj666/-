/* 页面转图片 */
/*
 * 在当前页面指定url截图并下载，该函数会涉及跨域问题
 * 该函数依赖两个库
 *     1、html2canvas，该库主要将html转换成canvas
 *     2、canvas-to-blob，主要兼容canvas.toBlob方法
 * @param {Object}
 *   option = {
 *     // 【必须】需要截图的URL
 *     url: '/examples/data',
 *     // @default 'body' 截图的具体DOM，基于querySelector选择
 *     dom: 'body',
 *     // @default 1000 截图页面的加载事件
 *     loadTime: 1000,
 *     // @default 600 生成的图片宽度，高度自适应
 *     imgWidth: 600,
 *     // @default 'pic' 指定下载文件的名称
 *     imgName:  'pic',
 *     // 【可选】图片背景
 *     imgBg: '#f00',
 *     // 【必选】下载按钮，用标签a
 *     aLink: document.getElementById('download'),
 *     // @default function(){ console.log('可下载！')}，可下载状态回调
 *     success: function(){
 *       function(){ console.log('可下载！')}
 *     }
 *   }
 */
function url2img(option) {
    option = option || {};
    // 默认值
    var url = option.url || location.href;
    var dom = option.dom || 'body';
    var loadTime = option.loadTime || 3000;
    var imgWidth = option.imgWidth || $(dom).innerWidth();
    var imgName = option.imgName || 'pic';
    var imgBg = option.imgBg;
    var aLink = option.aLink || document.getElementById('download');
    var success = option.success || function () {
            document.getElementById('download').innerHTML = '保存为图片';
        };


    if (!url || !aLink) {
        console.info('缺少参数！');
        return;
    }

    // iframe Box & iframe
    var iframeBox = document.createElement('div');
    var iframe = document.createElement('iframe');

    // set iframe Box
    iframeBox.style.width = '1px';
    iframeBox.style.height = '1px';
    iframeBox.style.overflow = 'hidden';
    iframeBox.style.position = 'absolute';
    iframeBox.style.top = '0px';
    iframeBox.style.right = '0px';

    // set iframe
    iframe.src = url;
    iframe.style.border = 'none';
    iframe.width = imgWidth;
    iframe.scrolling = 'no';

    // iframe content loaded
    iframe.onload = function () {
        var iframeDoc = iframe.contentDocument;
        var iframeWin = iframe.contentWindow;

        imgBg && (iframeDoc.querySelector(dom).style.background = imgBg);

        setTimeout(function () {
            html2canvas(iframeDoc.querySelector(dom)).then(function (canvas) {
                canvas.toBlob(function (blob) {
                    aLink.download = imgName;
                    aLink.href = URL.createObjectURL(blob);
                    success && success();
                    //var evt = document.createEvent('MouseEvents');
                    //evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,false,
                    //            false, false, false, 0, null);
                    //alink.dispatchEvent(evt);
                    //evt = null;
                    //alink = null;
                });
            });
        }, loadTime);
    };

    iframeBox.appendChild(iframe);
    document.body.appendChild(iframeBox);
}

