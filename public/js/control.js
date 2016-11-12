/**
 * Created by Administrator on 2016/9/6 0006.
 */

define(['unit'], function (unit) {


    /*    自执行事件    */   //（？？为什么如果绑定onload事件会有时候不执行？？）
    (function(){
        goTop();
        showSmallMenu();



        /*如果页面中有pagination，则构建翻页组件*/
        if(document.getElementById("pagination")) {
            var pag = new unit.Pagination();
            pag.init({
                index: parseInt(document.getElementsByClassName("page-number")[0].textContent.match(/\d/g)[0]),
                length: parseInt(document.getElementsByClassName("page-number")[0].textContent.match(/\d/g)[1])
            })
        }

        /*如果为文章页面，则构建目录*/
        if(document.getElementsByClassName("markdown")[0]) {
            var sidebar = document.getElementsByClassName("sidebar")[0],
                sidebarNav = sidebar.getElementsByClassName("main")[0],
                directoryNode = document.createElement("div"),
                navChange = document.createElement("p");
            if(window.innerWidth >= 880) {
                sidebarNav.style.left ="-100%";
            }

            directoryNode.className = "directory-content";
            directoryNode.style.transition = "all 0.5s linear";
            navChange.className = "nav-change";
            navChange.innerHTML = "<i class='iconfont change-btn' style='padding: 0 1rem; cursor: pointer'>&#xe631;</i>";

            sidebar.insertBefore(directoryNode, sidebarNav);
            sidebar.insertBefore(navChange, directoryNode);

            unit.generateDirectory(document.getElementsByClassName("markdown")[0]);

            unit.EventUnit.addHandler(sidebar.getElementsByClassName("change-btn")[0], 'click', function() {
                if(sidebarNav.style.left == "-100%") {
                    sidebarNav.style.transition = "all 0.5s linear";     //如果在css中定义，那么页面加载的时候就会出现，导致效果不好
                    directoryNode.style.left = "-100%";
                    sidebarNav.style.left = "0";
                }else {
                    sidebarNav.style.left = "-100%";
                    directoryNode.style.left = "0"
                }
            });

            unit.EventUnit.addHandler(window, "resize", function() {
                if(window.innerWidth < 880) {
                    sidebarNav.style.left = "0";
                    directoryNode.style.left = "-100%";
                }else if(window.innerWidth < 880 && directoryNode.style.left === "-100%"){
                    sidebarNav.style.left = "-100%";
                    sidebarNav.style.left = "0";
                }

            })
        }

    })();



    unit.EventUnit.addHandler(window, "scroll", function() {
        goTop();
        showSmallMenu();
    });

    /*    menu点击事件    */

    unit.EventUnit.addHandler(document.getElementsByClassName("smallMenu")[0], "click", function() {
       var  menuContent = this.getElementsByClassName("smallMenu-content")[0];
        if(menuContent.style.display === "none") {
            menuContent.style.display = "block";
        }else {
            menuContent.style.display = "none";
        }
    });


    /*    elevator右侧边栏绑定事件    */

    //联系我绑定事件
    if(document.getElementById("contactMe")){
        unit.EventUnit.addHandler(document.getElementById("contactMe"), "mouseover", function() {
            var t1 = new unit.Tooltip();
            t1.init({
                index: 1,
                target: this,
                position: "l",
                offsetR: this.offsetWidth+5,
                offsetT: unit.getPosition(this).absoluteTop - this.offsetHeight/2,
                content: "<h3 class='title'>联系我</h3>" +
                "<img src='http://cezrh.img48.wal8.com/img48/544629_20160502104557/147333482254.png' style='display: block;width: 120px;height: 120px'>",
                hasArrow: false,
                autoHide: true
            });
        });
    }


    //弹出目录绑定事件
    //if(document.getElementById("directory")){
    //    unit.EventUnit.addHandler(document.getElementById("directory"), "click", function() {
    //        var t2 = new unit.Tooltip();
    //
    //        t2.init({
    //            index: 2,
    //            target: this,
    //            position: "l",
    //            offsetR: this.offsetWidth /5 * 2,
    //            offsetT: 88,
    //            content: "<div class='directory-content' style='width: 200px;'></div>" ,
    //            hasArrow: false,
    //            autoHide: false
    //        });
    //
    //        if(document.getElementsByClassName("directory-content")[0].childNodes.length == 0) {
    //            unit.generateDirectory(document.getElementsByClassName("markdown")[0]);
    //        }
    //    });
    //}

    //回到顶部绑定事件
    unit.EventUnit.addHandler(document.getElementById("goTop").querySelector("i"), "click", function(){
        unit.scroll(0, 100);
    });



    /*    pay post页面底部打赏按钮绑定    */
    if(document.getElementsByClassName("pay-btn")[0]) {     //判断是否为post页面
        unit.EventUnit.addHandler(document.getElementsByClassName("pay-btn")[0], "click", function() {
            if(document.getElementsByClassName("pay-method")[0]) {
                document.getElementsByClassName("pay")[0].removeChild(document.getElementsByClassName("pay-method")[0])
            }else{
                var payMethod = document.createElement("div");
                payMethod.className = "pay-method";
                payMethod.innerHTML = "<img src='http://d2.freep.cn/3tb_161022195428bfmb576569.png/' alt='微信支付'>" +
                    "<img src='http://d3.freep.cn/3tb_161022195428a8ys576569.png/' alt='支付宝支付'><p><span>微信</span><span>支付宝</span></p>";
                document.getElementsByClassName("pay")[0].appendChild(payMethod);

                unit.scroll(180, 1000, true);
            }
        })
    }


    function goTop(){
        if(!document.getElementById) return false;
        if(!document.getElementById("goTop")) return false;
        if(unit.getScroll().scrollTop > 100) {
            document.getElementById("goTop").style.display = "block";
        }else {
            document.getElementById("goTop").style.display = "none";
        }
    }


    function showSmallMenu() {
        if(!document.getElementsByClassName("smallMenu-icon")[0]) return false;
        if(unit.getScroll().scrollTop > 47) {
            document.getElementsByClassName("smallMenu-icon")[0].style.color = "#333";
        }else{
            document.getElementsByClassName("smallMenu-icon")[0].style.color = "#c0c0c0";
        }
    }
});