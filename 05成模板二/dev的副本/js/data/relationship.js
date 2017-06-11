var relationship = {
    getOption: function (data) {
        option = {
            /*  title: {
             text: '鼠标滚轮可控制显示区域大小',
             left: 'bottom',
             textStyle: {
             color: '#6abae8'
             }
             // subtext: '数据来自 成聚移动'
             },*/
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['关键传播访客', '中度传播访客', '低度传播访客']
            },
            animation: false,
            color: ['#2c9fef', '#6abae8', '#cce2ec', '#be7557', '#bb5257', '#6cc9b1', '#51b36b', '#ca5656', '#69d2bf', '#48bd7e', '#9a69d2', '#d269a7', '#f78baa'],
            series: [{
                type: 'graph',
                layout: 'force',
                roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                draggable: true,
                lineStyle: {
                    normal: {
                        color: 'source',
                        width: 0.5,
                        opacity: 0.3
                    }
                },
                focusNodeAdjacency: true,
                data: data.node.map(function (node, i) {
                    if (node.category === 0) {
                        node.symbolSize = 35;
                        if (node.img) {
//                            node.symbol = 'path://https://www.w3.org/TR/SVG/images/paths/triangle01.svg'; //+ node.img;
                            node.symbol = 'image://' + node.img;
                        }
                        else {
                            // node.symbol = 'image://https://saascore.oss-cn-beijing.aliyuncs.com/custom/img/data/headPhoto.png';
                            node.symbol = 'path://M-1125.8,820.8c-16.5,0-29.8,13.4-29.8,29.8s13.4,29.8,29.8,29.8c16.5,0,29.8-13.4,29.8-29.8S-1109.3,820.8-1125.8,820.8z M-1125.8,827.6c5.7,0,10.3,4.6,10.3,10.3c0,5.7-4.6,10.3-10.3,10.3c-5.7,0-10.3-4.6-10.3-10.3C-1136.1,832.2-1131.5,827.6-1125.8,827.6z M-1143.3,866.8c0-7.5,4.7-13.8,11.3-16.3c4.3,7.8,6.2,11.6,6.2,11.6s1.1-1.8,6.6-11.5c6.4,2.6,10.9,8.9,10.9,16.2C-1107.7,875-1143.5,875.2-1143.3,866.8z';
                        }
                    }
                    else if (node.category === 1) {
                        node.symbolSize = 15;
                    }
                    else if (node.category === 2) {
                        node.symbolSize = 10;
                        node.label = {
                            normal: {
                                textStyle: {
                                    color: '#b6cbd5'
                                }
                            }
                        };
                    }
                    return node;
                }),

                categories: [
                    {name: '关键传播访客', keyword: {}, base: '关键传播访客'},
                    {name: '中度传播访客', keyword: {}, base: '中度传播访客'},
                    {name: '低度传播访客', keyword: {}, base: '低度传播访客'}
                ],
                force: {
                    initLayout: 'circular',
                    // gravity: 0
                    edgeLength: 50,
                    repulsion: [50, 75, 100]
                },
                edges: data.edge
            }]
        };
        return option;
    }
};

$(document).ready(function () {
    var $getTraceId = $('#getTraceId');
    if ($getTraceId.val() === '-1') {
        store.remove('traceId');
        return;
    }
    store.get('traceId') && $getTraceId.val(store.get('traceId'));
    // 关系图
    function getStatInfo(t) {
        $('.net .panel-body-loader').removeClass('hide');
        t = t || $getTraceId.val();
        // 关系图
        $.ajax({
            // topn0:0级的个数，top1:1级个数
            url: '/data/sns/net',
            type: 'GET',
            data: {
                traceId: t,
                topn0: 30,
                topn1: 10,
                topn2: 5
            },
            success: function (data) {
                if (data.code === 1) {
                    if (data.context.node.length > 0) {
                        var relation = echarts.init(document.getElementById('relationship'));
                        relation.setOption(relationship.getOption(data.context));
                        $('.info-mask.hidden').removeClass('hidden');
                    }
                    else {
                        $('#relationship').html('暂无数据');
                        $('.info-mask').addClass('hidden');
                    }

                    $('.net .panel-body-loader').addClass('hide');
                    $(window).resize(function () {
                        throttle(relation.resize, window);
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
    }

    // 详情
    function getList(page, size, t) {
        $('.list .panel-body-loader').removeClass('hide');
        Pace.restart();
        t = t || $getTraceId.val();
        page = page || 1;
        size = size || 10;
        $.ajax({
            url: '/data/sns/list?traceId=' + t + '&page=' + page + '&size=' + size,
            type: 'GET',
            success: function (data) {
                if (data.code === 1) {
                    $('.list .panel-body-loader').addClass('hide');
                    $('#data-table tbody').html(tmpl('template_detail', data.context));
                    $('html,body').animate({scrollTop: 0}, 150);
                    data.context.page = page;
                    $('[data-info=page]').text(page);
                    $('.pagination').html(tmpl('template_page', data.context));
                    $('[data-info="totalPage"]').html(data.context.totalPage);
                    $('[data-page="' + page + '"]').parent().addClass('active');
                    // 翻页
                    if (page > 1) {
                        $('#data-table_previous').removeClass('disabled')
                            .find('a').attr('data-page', page - 1);
                    }
                    if (data.context.totalPage > 1 && page < data.context.totalPage) {
                        $('#data-table_next').removeClass('disabled')
                            .find('a').attr('data-page', page - 0 + 1);
                    }
                    $('[data-tz="page"]').on('click', function () {
                        if (!$(this).parent().hasClass('active') && !$(this).parent().hasClass('disabled')) {
                            var i = $(this).data('page');
                            var datatableLength = $('#data-table_length select').val();
                            getList(i, datatableLength);
                        }
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
    }

    // 活动列表改变时获得数据
    $getTraceId.on('change', function () {
        store.set('traceId', $getTraceId.val());
        getStatInfo();
        var datatableLength = $('#data-table_length select').val();
        getList(1, datatableLength);
    });
    getStatInfo();
    getList(1);
    // 选择n项结果加载列表
    $('#data-table_length select').change(function () {
        var datatableLength = $('#data-table_length select').val();
        getList(1, datatableLength);
    });
});

