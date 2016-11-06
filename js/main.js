/**
 * 2016/9/2
 * AMD 主入口
 *
 * @file    main.js
 * @author  Zhangzirui(411489774@qq.com)
 *
 */

requirejs.config({
    paths: {
        unit: "unit_blog_v1.0"
    }
});

require(['unit','control'],function(unit){

});