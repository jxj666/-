/**
 * @file 活动详情
 */
function swiper() {
    var templateDemo = new Swiper('.template-demo', {
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
                slidesPerView: 3.4,
                spaceBetween: 20
            }
        },
        onImagesReady: function (swiper) {
            baguetteBox.run('.template-demo', {
                animation: 'fadeIn'
            });
        }
    });
    var templateDemo = new Swiper('.case-demo', {
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
                slidesPerView: 2,
                spaceBetween: 20
            }
        },
        onImagesReady: function (swiper) {
            baguetteBox.run('.template-demo', {
                animation: 'fadeIn'
            });
        }
    });
}
swiper();
