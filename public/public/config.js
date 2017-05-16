/**
 * Author：zhoushuanglong
 * Time：2017/3/10
 * Description：Description
 */
define(function () {
    require.config({
        paths: {
            'jquery': 'http://common.8864.com/web/js/jquery/jquery-1.12.0.min',
            'cookie': 'http://common.8864.com/web/js/jquery.cookie',
            'swiper': 'http://common.8864.com/web/plugins/swiper2/idangerous.swiper.min',
            'util': '/public/util'
        },
        shim: {
            'cookie': ['jquery'],
            'util': ['jquery']
        }
    });
});
