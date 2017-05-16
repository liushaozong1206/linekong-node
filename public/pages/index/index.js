/**
 * Author：zhoushuanglong
 * Time：2017/3/9
 * Description：index
 */


require(['../../public/config'], function () {
    require(['jquery', 'cookie', 'swiper', 'util'], function ($, cookie, swiper, util) {
        var index = {
            imgLoaded: function (type) {
                var img = new Image(),
                    src = $('#bannerSwiperWrapper .swiper-slide:eq(0) a.banner-img').data(type);
                img.src = src;
                img.onload = function () {
                    $('#bannerLoad').remove();

                    index.bannerImg(type);

                    //热点切换
                    index.hotGet(1);
                };
            },
            bannerImg: function (type) {
                if (util.ieVersion() == 8) {
                    $('.banner .banner-img').each(function (i) {
                        var url = $(this).data(type),
                            cssLeft = (1920 - parseInt($(window).width())) / 2;
                        $(this).html('<img style="left: ' + -cssLeft + 'px" src="' + url + '" / > ');
                    });
                } else {
                    $('.banner .banner-img').each(function (i) {
                        var $this = $(this);

                        //设置背景
                        var url = $this.data(type);
                        $this.css('background-image', 'url("' + url + '")');

                        //设置链接
                        var href = $this.attr('href');
                        if (href == '') {
                            $this.removeAttr('href').addClass('nohref');
                        }
                    });
                }
            },
            setBannerImgLeftIe8: function () {
                $('.banner .banner-img').each(function (i) {
                    $(this).children('img').css('left', (1920 - parseInt($(window).width())) / 2);
                });
            },
            hotGet: function (page) {
                util.get('/hot', {page: page}, function (data) {
                    pages = data.data.pages;
                    if (data.success == true) {
                        $('#hotLoad').hide();

                        //pc端
                        var $hc = $('.hot-con');
                        $hc.html(data.data.pc);
                        $hc.find('.hot-left .hot-item').addClass('active');
                        $hc.find('.hot-right .right-con').addClass('active');

                        //移动端
                        $('.hot-mobile-wrap').html(data.data.mobile);
                        index.setHotMobile();
                        new Swiper('.hot-mobile', {
                            nextButton: '.hot-mobile .swiper-button-next',
                            prevButton: '.hot-mobile .swiper-button-prev',
                            slidesPerView: 3,
                            paginationClickable: true,
                            initialSlide: 2,
                            loop: true,
                            autoplay: 5000,
                            autoplayDisableOnInteraction: false
                        });
                    }
                })
            },
            setHotMobile: function () {
                var num = 640 / 750,
                    itemW = parseInt($(window).width()) * num,
                    allW = (itemW + 4) * 3;
                $('.hot-mobile')
                    .width(allW)
                    .css('left', itemW * (-(640 - 50) / 640));
            },
            proSwitch: function (ele) {
                var $pbtn = $(ele).find('.pro-btn li'),
                    $pcon = $(ele).find('.pro-item');
                $pbtn.eq(0).addClass('active');
                $pcon.eq(0).addClass('active');

                function swithItem(i) {
                    var $legend = $('.legend'),
                        $p = $('p.no-con-tips'),
                        $gp = $('a.gift-pkg');

                    if (i == 0) {
                        $legend.delay(800).fadeIn(500);
                        $gp.delay(800).fadeIn(500);
                    } else {
                        $legend.fadeOut(100);
                        $gp.fadeOut(100);
                    }

                    $p.hide();
                    if (i == 3) {
                        $p.show();
                    }

                    $pbtn.removeClass('active').eq(i).addClass('active');
                    $pcon.removeClass('active').eq(i).addClass('active');
                }

                function numAdd() {
                    if (num < 2) {
                        num++;
                    } else {
                        num = 0;
                    }
                    swithItem(num);
                }

                //点击切换
                $pbtn.click(function () {
                    var i = $(this).index();
                    num = i;
                    swithItem(i);
                });

                //自动切换
                var num = 0, temp = true, timer;
                $(window).scroll(function () {
                    if (temp) {
                        if (($(window).scrollTop() + $(window).height() / 2) > $(ele).offset().top) {
                            clearInterval(timer);
                            timer = setInterval(function () {
                                numAdd();
                            }, 8000);

                            var $pc = $('.pro-con');
                            $pc.off('hover');
                            $pc.hover(function () {
                                clearInterval(timer);
                            }, function () {
                                timer = setInterval(function () {
                                    numAdd();
                                }, 8000);
                            });
                            temp = false;
                        }
                    }
                });
            }
        };
        $(window).resize(function () {
            index.setBannerImgLeftIe8();

            index.setHotMobile();

            //根据屏幕设置图片
            var wWidth = parseInt($(window).width());
            if (wWidth > 1024) {
                index.bannerImg('large');
            } else if (wWidth > 750) {
                index.bannerImg('middle');
            } else {
                index.bannerImg('little');
            }
        });

        //根据屏幕尺寸加载图片
        util.get('/banner', '', function (data) {
            $('#bannerSwiperWrapper').html(data.data);


            //初始化banner轮播图
            var bannerSwiper = new Swiper('.banner', {
                pagination: '.banner .swiper-pagination',
                paginationClickable: true,
                loop: true,
                autoplay: 5000,
                autoplayDisableOnInteraction: false
            });
            $('#bannerPrev').on('click', function (e) {
                e.preventDefault();
                bannerSwiper.swipePrev()
            });
            $('#bannerNext').on('click', function (e) {
                e.preventDefault();
                bannerSwiper.swipeNext()
            });

            //根据屏幕尺寸加载图片
            var wWidth = parseInt($(window).width());
            if (wWidth > 1024) {
                index.imgLoaded('large');
            } else if (wWidth > 750) {
                index.imgLoaded('middle');
            } else {
                index.imgLoaded('little');
            }
        });


        //热点推荐换一换
        var page = 1,
            pages = 0;
        $('a.change').click(function () {
            $('#hotLoad').show();

            if (page < pages) {
                page++;
            } else {
                page = 1;
            }
            index.hotGet(page);
        });

        //产品切换
        index.proSwitch('.production-pc');
        index.proSwitch('.production-mobile');


        //手机端链接切换
        var $lw = $('.link-wrap'),
            $lbtn = $lw.find('dt'),
            $lcon = $lw.find('dl');
        $lcon.eq(0).addClass('active');
        $lbtn.click(function () {
            var $dl = $(this).parent('dl');
            if ($dl.hasClass('active')) {
                $dl.removeClass('active');
            } else {
                $lcon.removeClass('active');
                $(this).parent('dl').addClass('active');
            }
        });

        //category点击跳转链接
        $('.category li').click(function () {
            var src = $(this).attr('data-src').toString();
            if (src.indexOf('javascript') === -1) {
                window.open(src);
            } else {
                alert('更多精彩内容，敬请期待！');
            }
        });

    })
});