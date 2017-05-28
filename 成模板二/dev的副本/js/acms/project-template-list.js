/**
 * @file 活动模板
 */
function getList(page, size) {
    page = page || 1;
    size = size || 20;
    var data = {};
    data.page = page;
    data.size = size;
    Pace.restart();
    $.get('/acms/tmpl/list', data).done(function (data) {
        if (data.code === 1) {
            $('html,body').animate({scrollTop: 0}, 150);
            $('#gallery').html(tmpl('template_record', data.context));
            // 翻页
            data.context.page = page;
            $('[data-info=page]').text(page);
            $('.pagination').html(tmpl('template_page', data.context));
            $('[data-info="totalPage"]').html(data.context.totalPage);
            $('[data-page="' + page + '"]').parent().addClass('active');

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
                    getList(i);
                }
            });
        }
        else {
            alert(data.msg);
        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status === 0) {
            alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
            location.reload();
            return;
        }
        alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
    });
}
getList(1);
// 创建活动
$('.tab-content').on('click', '[data-tz=createact]', function () {
    if (!window.confirm('确定创建新活动？')) {
        return;
    }
    Pace.restart();
    $.get('/acms/tmpl/createact/' + $(this).data('projectid')).done(function (data) {
        if (data.code === 1) {
            location.href = '#/acms/act/edit?activityId=' + data.context.activityId + '&from=template';
        }
        else {
            alert(data.msg);
            $('panel-body-loader').addClass('hide');
        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status === 0) {
            alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
            location.reload();
            return;
        }
        alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
    });
});
// 删除模板
$('.gallery').on('click', '[data-tz=deleteRecord]', function () {
    if (!window.confirm('删除模板后将不可恢复，确定删除？')) {
        return;
    }
    Pace.restart();
    $.get('/acms/tmpl/delete/' + $(this).data('projectid')).done(function (data) {
        if (data.code === 1) {
            getList(1);
        }
        else {
            alert(data.msg);
        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status === 0) {
            alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
            location.reload();
            return;
        }
        alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
    });
});
// 详情
$('#modal-detail').on('show.bs.modal', function (e) {
    Pace.restart();
    var $target = $(e.relatedTarget);
    $.get('/acms/tmpl/get/' + $target.data('projectid')).done(function (data) {
        $('#modal-detail .modal-body').html(data.context.project.summary);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status === 0) {
            alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
            location.reload();
            return;
        }
        alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
    });
});
function swiper() {
    var galleryTop = new Swiper('.gallery-top', {
        slidesPerView: 3.5,
        spaceBetween: 20,
        breakpoints: {
            1024: {
                slidesPerView: 2.5,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 1.5,
                spaceBetween: 20
            },
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            }
        }
    });
    var galleryThumbs = new Swiper('.gallery-thumbs', {
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 20,
        breakpoints: {
            1024: {
                slidesPerView: 5,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 4.5,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 3.5,
                spaceBetween: 20
            },
            320: {
                slidesPerView: 3,
                spaceBetween: 10
            }
        },
        touchRatio: 0.2,
        slideToClickedSlide: true
    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;
}
$('#tab-recordsList').on('shown.bs.tab', '[href="#tab-recordDetail"]', function (e) {
    var projectId = $(e.target).data('projectid');
    $.get('/acms/tmpl/getdetails/' + projectId).done(function (data) {
        if (data.code === 1) {
            // 示例图
            var imgs = data.context.imgs;
            $('.gallery-thumbs .swiper-wrapper').html('');
            if (imgs && imgs.length > 0) {
                $('.gallery-top .swiper-wrapper').html('');
                var topHtml = '';
                var thumbsHtml = '';
                $(imgs).each(function (index, item) {
                    topHtml += '<div class="swiper-slide">'
                        + '<a href="' + item + '" data-lightbox="demo">'
                        + '<div class="img-container">'
                        + '<img src="' + item + '" alt="">'
                        + '</div>'
                        + '</a>'
                        + '</div>';
                    thumbsHtml += '<div class="swiper-slide" style="background-image:url(' + item + '"></div>';

                });
                $('.gallery-top .swiper-wrapper').html(topHtml);
                $('.gallery-thumbs .swiper-wrapper').html(thumbsHtml);
                swiper();
            }
            else {
                $('.gallery-top .swiper-wrapper').html('暂无示例图');
            }
            // 示例描述
            $('#demoDesc').html(data.context.desc ? data.context.desc.memo : '');
            // 活动案例
            $('#actList').html(tmpl('template_actList', data.context));
        }
        else {
            alert(data.msg);
        }
        // detail-header
        $('.detail-title_container').html(tmpl('template_header', data.context.project));
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status === 0) {
            alert('由于长时间未操作，与服务器的连接已断开，点击确定重新加载页面');
            location.reload();
            return;
        }
        alert('服务器返回错误!错误代码：' + XMLHttpRequest.status + ' ' + textStatus);
    });
});


