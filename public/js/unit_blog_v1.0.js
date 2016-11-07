/**
 * Created by Administrator on 2016/9/5 0005.
 */

define(function() {
    /*判断是否为数组*/
    function isArray(arr) {
        return Object.prototype.toString.call(arr) == "[object Array]";
    }

    /**
     * 实现滚动效果
     * @param {number} objTop 想要滚动到的目标高度 / 滚动的距离
     * @param {number} ms   滚动所需毫秒数
     * @param {boolean}    是否在当前基础下进行滚动。若否，则objTop为滚动的目标高度。若真，则objTop为在当前滚动距离的基础下再次滚动的距离
     */
    var scroll = function(objTop, ms, isContinue) {
        var currentTop = document.body.scrollTop || document.documentElement.scrollTop,
            velocity = Math.abs(objTop - currentTop)/ms,
            timer;
        if(arguments[2] === true) {
            objTop = currentTop + objTop;
        }
        if(currentTop < objTop) {
            timer = setInterval(function() {
                document.body.scrollTop = document.documentElement.scrollTop = currentTop + velocity*10;
                currentTop = currentTop + velocity*10;
                if(currentTop >=  objTop - 10) {
                    document.body.scrollTop = document.documentElement.scrollTop = objTop;
                    clearInterval(timer);
                }
            },10);
        }else {
            timer = setInterval(function() {
                document.body.scrollTop = document.documentElement.scrollTop = currentTop - velocity*10;
                currentTop = currentTop - velocity*10;
                if(currentTop <= objTop + 10) {
                    document.body.scrollTop = document.documentElement.scrollTop = objTop;
                    clearInterval(timer);
                }
            },10);
        }
    };

    /**
     * window加载绑定事件
     * @param func
     */
    function addLoadEvent(func) {
        var oldOnload = window.onload;
        if(typeof window.onload != "function") {
            window.onload = func;
        }else{
            window.onload = function() {
                oldOnload();
                func();
            }
        }
    }

    /**
     * 事件处理函数
     */
    var EventUnit = {

        /**
         * 绑定事件
         * @param   {Element}   element DOM元素
         * @param   {String}    event   事件名称
         * @param   {Function}  handler    绑定的函数
         */
        addHandler: function(element,event,handler) {
            if(element.addEventListener) {
                element.addEventListener(event,handler,false);
            }else if(element.attachEvent) {
                element.attachEvent("on"+event,handler);
            }else{
                element["on"+event] = handler;
            }
        },
        /**
         * 移除绑定事件
         * @param   {Element}   element DOM元素
         * @param   {String}    event   事件名称
         * @param   {Function}  handler    绑定的函数
         */
        removeHandler: function(element,event,handler) {
            if(element.removeEventListener) {
                element.removeEventListener(event,handler,false);
            }else if(element.detachEvent) {
                element.detachEvent("on"+event,handler);
            }else{
                element["on"+event] = null;
            }
        },

        /**
         * 获取当前事件
         * @param   {String}    event   事件
         * @return  对event对象的引用
         */
        getEvent: function(event) {
            return event ? event : window.event;
        },
        getTarget: function(event) {
            return event.target || event.srcElement;
        }
    };

    /**
     * 获得元素在页面中绝对位置
     */
    var getPosition = function(element) {
        var absoluteTop = element.offsetTop,
            absoluteLeft = element.offsetLeft;
        var current = element.offsetParent;
        while( current !== null) {
            absoluteTop += current.offsetTop;
            absoluteLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return {
            absoluteTop: absoluteTop,
            absoluteLeft: absoluteLeft
        };
    };

    /**
     * 获得滚轮的位置
     */
    var getScroll = function() {
        var scrollTop,scrollLeft;
        if(document.compatMode == "CSS1Compat") {
            scrollTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
            scrollLeft = document.documentElement.scrollLeft == 0 ? document.body.scrollLeft : document.documentElement.scrollLeft;
        }else {
            scrollTop = document.body.scrollTop;
            scrollLeft = document.body.scrollLeft;
        }
        return {
            scrollTop: scrollTop,
            scrollLeft: scrollLeft
        };
    };

    /**
     *  判断所检测的节点是不是参考节点的子节点
     *  @param  {Node}  参考节点
     *  @param  {Node}  待测节点
     */
    var contains = function(refNode,otherNode) {
        if(refNode.contains) {
            return refNode.contains(otherNode) && refNode !== otherNode;    //节点1.contains(节点1)返回true,所以设定refNode !== otherNode
        }else if( refNode.compareDocumentPosition) {
            return !!(refNode.compareDocumentPosition(otherNode)&16);
        }else {
            var node = otherNode.parentNode;
            do{
                if(node === refNode) {
                    return true;
                }else {
                    node = node.parentNode;
                }
            }while(node !== null);
        }
    };

    /**
     * 简单的字典格式继承
     * @param defs       原配置
     * @param options    新设置的配置
     */
    function extend(defs, options) {
        for (var att in options) {
            defs[att] = options[att];
        }
        return defs
    }

    /**
     * 查找一个节点的所有同辈节点
     * @param dom 传入的节点
     * @return [array] 返回同辈节点的数组集合
     */
    function findSibling(node) {
        var children = node.parentNode.childNodes,
            siblings = [];
        for(var i=0, len=children.length; i<len; i++) {
            if(children[i].nodeType === 1 && children[i] !== node) {
                siblings.push(children[i]);
            }
        }
        return siblings;
    }

    function setDir(box, node, index) {
        var newNode = document.createElement("p");
        newNode.className = "head" + index;
        newNode.innerHTML = "<i class='iconfont'>&#xe610;</i>" + node.textContent;
        box.appendChild(newNode);
        //console.log(newNode);
        return newNode;
    }


    var generateDirectory = function(wrap) {
        if(!document.getElementsByClassName("directory-content")[0]) {
            return false
         }
        var children = wrap.childNodes,
            box = document.getElementsByClassName("directory-content")[0];
        var allHead = [],
            allHeadNum = [],
            minNum = null;

        for(var i= 0, len=children.length; i<len; i++) {
            if(/H\d/.test(children[i].nodeName)) {
                allHead.push(children[i]);      //将所有的标题存放进入allHead
                var headNum = parseInt(/\d/.exec(children[i].nodeName)[0]);

                if(!minNum || minNum > headNum){    //找出最大的标题，也就是H后面最小的数
                    minNum = headNum;
                }
                allHeadNum.push(headNum);       //将所有标题，也就是H后面的数存储
            }
        }

        allHeadNum = allHeadNum.map(function(item) {

            return parseInt(item) - parseInt(minNum) + 1;
        });

        allHead.forEach(function(item, index) {
            var newNode = setDir(box, item, allHeadNum[index]);

            EventUnit.addHandler(newNode, "click", function(){
                scroll(getPosition(item).absoluteTop, 100);
            })
        })
    };

    /**
     * 组件模块
     */

    /**
     *  原型链继承
     * @param sub 子构造函数，继承者
     * @param par 父构造函数，被继承
     */
    function inheritPrototype(sub, par){
        var prototype = Object(par.prototype);
        prototype.constructor = sub;
        sub.prototype = prototype;
    }


    /*    构建所有的组建的通用模块     */
    function Widget() {
        this.containerBox = null;   //组件的最外层元素
        this.handlers = {};
    }

    Widget.prototype = {
        constructor: Widget,

        on: function(type, handler) {       //绑定自定义事件
            if(typeof this.handlers[type] == "undefined"){
                this.handlers[type] = []
            }
            this.handlers[type].push(handler);

            return this
        },

        fire: function(type, data) {        //执行自定义事件
            if(isArray(this.handlers[type])){
                var handlers = this.handlers[type];
                for(var i=0, len=handlers.length; i<len; i++){
                    handlers[i](data);
                }
            }
            return this
        },

        renderUI: function() {},    //接口：添加DOM节点（结构层面）

        bindUI: function() {},      //接口：监听事件 （行为层面）

        cssUI: function() {},      //接口：初始化组件属性 （样式层面）

        //render: function() {    //渲染组件
        //    this.renderUI();
        //    this.bindUI();
        //
        //},

        destroy: function() {         //销毁组件，wrap为组件的父级元素，若没传入，则默认组件添加到body下

        }

    };

    /*    气泡组件    */
    function Tooltip() {
        Widget.call(this);
        this.settings ={
            index: null,             //必须得配置，为编号标识符，防止二次触发
            target: null,            //需要提示的节点
            position: "b",          //提示框所在位置
            offsetL: 0,              //位置设置
            offsetR: 0,              //位置设置
            offsetT: 0,              //位置设置
            offsetB: 0,              //位置设置
            content: null,          //提示框内容
            hasArrow: true,         //提示框是否带箭头
            autoHide: true,         //是否自动隐藏
            delay: 0                 //延时0ms后触发
        };
    }

    //inheritPrototype(Tooltip, Widget);
    Tooltip.prototype = new Widget();

    Tooltip.prototype.indexArr = [];

    Tooltip.prototype.renderUI = function() {
        var className = this.settings.hasArrow ? "tooltip tooltip-"+ this.settings.position : "tooltip";
        this.containerBox = document.createElement("div");
        this.containerBox.className = className;
        this.containerBox.innerHTML = this.settings.autoHide ? this.settings.content : "<p class='iconfont tip-close' title='关闭'>&#xe615;</p>"+this.settings.content;
        document.body.appendChild(this.containerBox);
        this.cssUI().setPosition();
        this.containerBox.style.display = "none";


    };

    Tooltip.prototype.cssUI = function() {
        var that = this;

        function setPosition() {
            if(that.settings.offsetL) {
                that.containerBox.style.left = that.settings.offsetL + "px";
            }
            if(that.settings.offsetR) {
                that.containerBox.style.right = that.settings.offsetR + "px";
            }
            if(that.settings.offsetT) {
                that.containerBox.style.top = that.settings.offsetT + "px";
            }
            if(that.settings.offsetB) {
                that.containerBox.style.bottom = that.settings.offsetB + "px";
            }
        }

        return{
            setPosition: setPosition
        }
    };

    Tooltip.prototype.bindUI = function() {
        var that = this,
            timer;

        this.on("show", function() {
            that.containerBox.style.display = "block"
        });

        this.on("con", function() {
            console.log("hhhhhh")
        });

        this.on("hide",function() {
            document.body.removeChild(that.containerBox);
            if(that.settings.delay != 0 && timer){
                clearTimeout(timer);
            }
            that.containerBox = null;
            that.indexArr[that.settings.index] = false; //将单一模式解除，让其可以再吃触发
        });

        if(this.settings.delay != 0) {
            timer = setTimeout(function(){
                that.fire("show");
            }, that.settings.delay);
        }else{
            this.fire("show");
        }

        if(!this.settings.autoHide && document.getElementsByClassName("tip-close")[0]) {
            EventUnit.addHandler(document.getElementsByClassName("tip-close")[0], "click", function() {
                that.fire("hide");
            });
        }

        EventUnit.addHandler(that.settings.target,"mouseout",function() {
            if(that.containerBox != null && that.settings.autoHide && contains(document.body, that.containerBox)){
                that.fire("hide");
            }
        });

        //当窗口大小发生变化时，刷新气泡的位置
        EventUnit.addHandler(window, "resize", function() {
            that.cssUI().setPosition();
        })
    };

    Tooltip.prototype.init = function(options) {
        extend(this.settings, options);


        this.indexArr[this.settings.index] = this.indexArr[this.settings.index] ? false : true;

        if(this.indexArr[this.settings.index]){
            this.renderUI();
            this.bindUI();
        }
        this.indexArr[this.settings.index] = true
    };


    /*    分页组件    */

    function Pagination() {
        Widget.call(this);
        this.nextBtn = null;
        this.preBtn = null;
        this.settings = {
            index: 1,
            length: null
        }
    }

    //inheritPrototype(Pagination, Widget);
    Pagination.prototype = new Widget();

    Pagination.prototype.renderUI = function(){

        if(document.getElementById("pagination")) {

            this.containerBox =  document.getElementById("pagination");
            this.nextBtn = this.containerBox.getElementsByClassName("next")[0];
            this.preBtn = this.containerBox.getElementsByClassName("pre")[0];

        }
    };

    Pagination.prototype.init = function(options) {
        extend(this.settings, options);
        this.renderUI();
        this.bindUI();
    };

    Pagination.prototype.cssUI = function(){
        var that = this;

        /*使翻页节点disabled*/
        function disabledLinkNode(node){
            var spanNode = document.createElement("span");
            spanNode.className = node.className;
            spanNode.textContent = node.textContent;
            spanNode.style.color = "#dddddd";

            if(node.className.indexOf("pre") > -1){
                that.containerBox.removeChild(node);
                that.containerBox.insertBefore(spanNode, that.containerBox.firstChild);
                that.preBtn = spanNode;
            }

            if(node.className.indexOf("next") > -1){
                that.containerBox.removeChild(node);
                that.containerBox.appendChild(spanNode);
                that.nextBtn = spanNode;

            }
        }

        /*使翻页节点active*/
        function activeLinkNode(node){
            var aNode = document.createElement("a");
            aNode.className = node.className;
            aNode.textContent = node.textContent;

            if(node.className.indexOf("pre") > -1){
                that.containerBox.removeChild(node);
                that.containerBox.insertBefore(aNode, that.containerBox.firstChild);
                aNode.style.href = "/page/" + parseInt(that.settings.index-1);
                that.preBtn = aNode;

            }

            if(node.className.indexOf("next") > -1){
                that.containerBox.removeChild(node);
                that.containerBox.appendChild(aNode);
                aNode.style.href = "/page/" + parseInt(that.settings.index+1);
                that.nextBtn = aNode;
            }
        }


        return{
            disabledLinkNode: disabledLinkNode,
            activeLinkNode: activeLinkNode
        }
    };

    Pagination.prototype.bindUI = function() {

        var that = this;

        if(this.settings.index === 1){
            this.cssUI().disabledLinkNode(this.preBtn);
        }

        if(this.settings.index === parseInt(this.settings.length)){
            this.cssUI().disabledLinkNode(this.nextBtn);
        }

        /*刷新分页组件中的页面显示*/
        this.on("refresh", function() {
            that.containerBox.getElementsByClassName("page-number")[0].innerHTML = "当前第" + that.settings.index + "页 共" + parseInt(that.settings.length) + "页";
        });

        /*绑定前一页按钮*/
        EventUnit.addHandler(this.preBtn, "click", function() {
            if (that.preBtn.nodeName !== "A") {
                return
            }

            if (that.settings.index > 1) {
                that.settings.index = that.settings.index - 1;
                that.fire("refresh");
            }else {
                that.cssUI().disabledLinkNode(that.preBtn);
            }

            if (that.containerBox.getElementsByClassName("next").nodeName !== "A") {
                that.cssUI().activeLinkNode(that.nextBtn);
            }

        });

        /*绑定后一页按钮*/
        EventUnit.addHandler(this.nextBtn, "click", function() {
            if (that.nextBtn.nodeName !== "A") {
                return
            }

            if (that.settings.index < parseInt(that.settings.length)) {
                that.settings.index = that.settings.index + 1;
                that.fire("refresh");
            }else {
                that.cssUI().disabledLinkNode(that.nextBtn);
            }

            if (that.containerBox.getElementsByClassName("pre").nodeName !== "A") {
                that.cssUI().activeLinkNode(that.preBtn);
            }

        });
    };



    return{
        scroll: scroll,
        EventUnit: EventUnit,
        addLoadEvent: addLoadEvent,
        getPosition: getPosition,
        getScroll: getScroll,
        generateDirectory: generateDirectory,
        Tooltip: Tooltip,
        Pagination: Pagination
    }
});
