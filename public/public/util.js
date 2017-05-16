/**
 * Author：zhoushuanglong
 * Time：2017/3/9
 * Description：util
 */
define(function () {
    var util = {
        get: function (url, data, fn) {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                contentType: 'application/json',
                data: data,
                error: function () {
                    console.log('error');
                },
                success: function (data) {
                    fn.call(window, data, url);
                }
            });
        },
        ieVersion: function () {
            var ua = navigator.userAgent.toLowerCase(),
                isIE = ua.indexOf("msie") > -1;
            if (isIE) {
                return parseInt(ua.match(/msie ([\d.]+)/)[1].split('.')[0]);
            } else {
                return false;
            }
        },
        browserTips: function () {
            var ie8Blow = util.ieVersion() < 8 && util.ieVersion() != false,
                ie8Little = util.ieVersion() == 8 && parseInt($(window).width()) <= 900;
            if (ie8Blow || ie8Little) {
                var styleSheet = 'body,div,p,a,h1,h3{margin:0;padding:0;font-family:"Microsoft YaHei UI Light","Microsoft YaHei";font-weight:normal}' +
                    'a{text-decoration:none;cursor:pointer}' +
                    'html,body{background:#faf8f5;height:100%;width:100%}' +
                    '.main{margin:0 auto;padding-top:260px;width:500px;color:#454545}' +
                    '.tips h1{display:block;margin-top:25px;text-align:center}' +
                    '.tips h3{margin:20px 20px 0;font-size:16px;line-height:24px}' +
                    '.tips p{margin-top:40px;text-align:center}' +
                    '.tips p a{margin:0 10px;display:inline-block;color:#4087e0}' +
                    '.tips p a:hover{color:#0050b5}';
                util.loadStyleString(styleSheet);

                document.body.innerHTML = '<div class="main"><div class="tips">' +
                    '<h1>浏览器版本过低</h1>' +
                    '<h3>您好，我们检测到您的浏览器版本过低，可能存在安全风险！我们建议您使用以下浏览器，您将获得更好更安全的体验。</h3>' +
                    '<p>' +
                    '<a href="http://se.360.cn">360安全浏览器</a>' +
                    '<a href="http://browser.qq.com">QQ安全浏览器</a>' +
                    '<a href="http://ie.sogou.com">搜狗极速浏览器</a>' +
                    '</p></div></div>';
            }
        },
        loadStyleString: function (css) {
            var style = document.createElement("style");
            style.type = "text/css";
            try {
                style.appendChild(document.createTextNode(css));
            } catch (ex) {
                style.styleSheet.cssText = css;
            }
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(style);
        },
        header: function () {
            var $headerPop = $('.header-pop');

            $(document).on('click', 'a.lang-switch', function () {
                $.cookie('lang', $(this).attr('data-type'));
                window.location.href = '/';
            });
            $(document).on('click', 'a.pop-btn', function () {
                $headerPop.addClass('active');
            });
            $(document).on('click', '#closeHeaderPop', function () {
                $headerPop.removeClass('active');
            });
        },
        footer: function () {
            var $foot = $('footer.mobile'),
                $fc = $foot.find('.content'),
                $fl = $foot.find('a.logo'),
                $fr = $foot.find('.con-right');

            $fr.width(parseInt($fc.width()) - parseInt($fl.width()) - parseInt($fl.css('margin-right')));

            $(window).resize(function () {
                $fr.width(parseInt($fc.width()) - parseInt($fl.width()) - parseInt($fl.css('margin-right')) - 5);
            });
        },
        setHome: function (obj, url) {
            try {
                obj.style.behavior = 'url(#default#homepage)';
                obj.setHomePage(url);
            } catch (e) {
                if (window.netscape) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    } catch (e) {
                        alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
                    }
                } else {
                    alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【" + url + "】设置为首页。");
                }
            }
        },
        addFavorite: function (title, url) {
            try {
                window.external.addFavorite(url, title);
            }
            catch (e) {
                try {
                    window.sidebar.addPanel(title, url, "");
                }
                catch (e) {
                    alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加");
                }
            }
        }
    };

    $('#setHome').click(function () {
        util.setHome(window, 'http://www.linekong.com');
        return false;
    });

    $('#addFavorite').click(function () {
        util.addFavorite('蓝港互动', 'http://www.linekong.com');
        return false;
    });

    util.browserTips();

    util.header();
    util.footer();

    return util;
});