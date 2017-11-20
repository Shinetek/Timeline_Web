/**
 * Created by lenovo on 2017/11/13.
 */


var timeLine = {


        /**
         * 初始化函数
         * @param elem 目标div
         * @param options 参数
         */
        initialize: function (elem, options) {
            console.log('initialize');
            //var self = this;
            //参数配置
            if (!options) {
                options = {}

            }
            this._el = {
                //主DIV
                container: {},
                //时间轴 年月日 时分 控制
                timecontroller: {},
                //轴主体div
                timecanvas: null,
                //右侧 控制显示 bar
                menubar: {}
            };

            //获取
            if (typeof elem === 'object') {
                this._el.container = elem;
            } else {
                this._el.container = document.getElementById(elem);
            }
            //设置宽高
            this.options = {
                script_path: "",
                //整体timeline 除了 右侧数据的部分
                controller_width_sp: 425,
                //控制器部分宽高
                controller_width: 300,
                controller_height: 75,
                //时间轴部分宽高
                timeline_width: 1000,
                timeline_height: 75,
                //时间轴 距离 顶部的 高
                timeline_height_top: 55,
                //默认背景颜色
                default_bg_color: "black",
                //默认当前时间
                default_time: moment.utc(),
                //默认一格的毫秒数目
                default_timespan: 24 * 60 * 60 * 1000,
                //年　月　日　小时
                mode_list: ['year', 'month', 'day', 'hour'],
                //在当前模式下，选择精确到的 单位
                mode_unit: ['month', 'day', 'hour', 'minute'],
                //每一个单位大小
                mode_timespan: [12.5, 12.5, 12.5, 5],

                select_modeindex: 2,
                moment_select: moment.utc(),
                moment_mousein: moment.utc(),
                //动画控制部分
                //是否拖拽
                is_drag: false,

                //鼠标当前位置
                mouse_x: 0,
                //开始拖拽x
                begin_X: 0,
                end_X: 0
            };
            //初始化全部显示
            this.init_container();
            //设置窗口的重设事件
            window.onresize = this._resizeScreen;

        },


        init_container: function () {
            //     console.log(this._el);
            //获取 宽高
            this._resizeScreen();
            this.init_beginTime();
            this.init_controller();
            this.init_timeline();
            this.init_timeMode();

        },

        /**
         * 数值修改触发函数 外部重写此函数 获取修改事件
         * @constructor
         */
        DateTimeChange: function () {
            $(timeLine._el.container).trigger("DateTimeChange", [timeLine.options.moment_select]);
        },

        /**
         * 初始化时间轴 左侧控制部分
         */
        init_controller_css: function () {
            var _canvas = document.createElement("canvas");
            _canvas.width = this.options.controller_width;
            _canvas.height = this.options.controller_height;
            _canvas.id = "_controller";
            _canvas.style.float = "left";
            this._el.container.appendChild(_canvas);

            var ctx = _canvas.getContext('2d');
            ctx.rect(0, 0, this.options.default_width, this.options.controller_height);
            ctx.fillStyle = this.options.default_bg_color;
            ctx.fill();


            //绘制 年月日 时分秒
            var context = _canvas.getContext('2d');

            context.strokeStyle = "white";//轮廓颜色
            //context.strokeRect(16, 22, 64, 31);//绘制矩形轮廓
            //context.strokeRect(86, 22, 36, 31);//绘制矩形轮廓
            //context.strokeRect(126, 22, 36, 31);//绘制矩形轮廓
            context.font = "normal 22px Verdana";
            context.fillStyle = "white";
            context.fillText("2017", 20, 45);

            context.font = "normal 22px Verdana";
            context.strokeStyle = "white";
            context.fillText("11", 90, 45);

            context.font = "normal 22px Verdana";
            context.strokeStyle = "white";
            context.fillText("15", 130, 45);

            // 三角形
            context.beginPath();
            context.moveTo(26, 17);
            context.lineTo(48, 8);
            context.lineTo(70, 17);
            context.closePath();
            context.fill();

            var ShowAll =
                ' <div class="TimeInputDiv">'
                + '<div id="YearInputDiv">'
                + '<div class="UpButton" id="btn_AddYear">'
                + '<svg width="98" height="25" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="m25.5,20.5l23.49999,-12l23.50001,12l-47,0z" fill="#fff"/>'
                + '</svg>'
                + '</div>'
                + '<input class="TimeInput" id="txt_Year" type="text" readOnly="true">  '
                + '<div class="DownButton" id="btn_MinusYear">'
                + '<svg>'
                + '<path transform="rotate(-180 50,14.5) " d="m25.5,20.5l23.49999,-12l23.50001,12l-47,0z" fill="#fff"/>'
                + '</svg>'
                + '</div>'
                + '</div>'
                + '<div id="MonthInputDiv">'
                + '<div class="UpButton" id="btn_AddMonth">'
                + '<svg width="98" height="25" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="m10,20.5l19.99999,-12l20.00001,12l-40,0z" fill="#fff"/>'
                + '</svg>'
                + '</div>'
                + '<input class="MonthInput" id="txt_Month" type="text" readOnly="true">  '
                + '<div class="DownButton" id="btn_MinusMonth">'
                + '<svg width="98" height="25" xmlns="http://www.w3.org/2000/svg">'
                + '<path transform="rotate(-180 30,14.5) " d="m10,20.5l19.99999,-12l20.00001,12l-40,0z" fill="#fff"/>'
                + '</svg>'
                + '</div>'
                + '</div>'
                + '<div id="DayInputDiv">'
                + '<div class="UpButton" id="btn_AddDay">'
                + '<svg width="98" height="25" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="m10,20.5l19.99999,-12l20.00001,12l-40,0z" fill="#fff"/>'
                + '</svg>'
                + '</div>'
                + '<input class="MonthInput" id="txt_Day" type="text"  readOnly="true"> '
                + '<div class="DownButton" id="btn_MinusDay">'
                + '<svg width="98" height="25" xmlns="http://www.w3.org/2000/svg">'
                + '<path transform="rotate(-180 30,14.5) " d="m10,20.5l19.99999,-12l20.00001,12l-40,0z" fill="#fff"/>'
                + '</svg>'
                + '</div> '
                + '</div>'
                + '<div class="AfterDiv" id="btn_BeforeTime">'
                + '<svg style="width: 24px;height: 44px;margin-top: 26px; transform:scaleX(-1);">'
                + '<path style="fill: #fff ;" d="M 10.240764,0 24,22 10.240764,44 0,44 13.759236,22 0,0 10.240764,0 z"></path>'
                + '</svg>'
                + '</div>'
                + '<div class="AfterDiv" id="btn_AfterTime">'
                + '<svg style="width: 24px;height: 44px;margin-top: 26px; ">'
                + '<path style="fill: #fff;" d="M 10.240764,0 24,22 10.240764,44 0,44 13.759236,22 0,0 10.240764,0 z"></path>'
                + '</svg>'
                + '</div>'
                + '</div>'
                + '<div class="TimeLineTotalDiv" id="ShowTimeLine">'
                + '<div class="TimeLineDiv" id="Show_YearDiv">';


        },
        init_controller: function () {
            var controller_div = document.createElement("div");
            controller_div.style.width = timeLine.options.controller_width + "px";
            controller_div.style.height = timeLine.options.controller_height + "px";
            controller_div.style.float = "left";
            controller_div.style.background = timeLine.options.default_bg_color;
            controller_div.id = "_controller";

            this._el.container.appendChild(controller_div);
            //设置 年部分
            timeLine._init_Year_div(controller_div);
            timeLine._init_Month_div(controller_div);
            timeLine._init_Day_div(controller_div);


        },
        //绘制年
        _init_Year_div: function (controller_div) {
            var YearDiv = document.createElement("div");
            YearDiv.style.width = "75px";
            YearDiv.style.height = "75px";
            YearDiv.style.float = "left";
            YearDiv.id = "YearInputDiv";
            controller_div.appendChild(YearDiv);

            var addYearDiv = document.createElement("div");
            addYearDiv.style.width = "80px";
            addYearDiv.style.height = "25px";
            addYearDiv.style.float = "left";
            addYearDiv.id = "btn_AddYear";
            addYearDiv.onclick = timeLine._addOneYear;
            YearDiv.appendChild(addYearDiv);

            var addYearSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            //  var addYearSvg = document.createElement("svg");
            addYearSvg.style.width = "68px";
            addYearSvg.style.height = "25px";
            addYearDiv.appendChild(addYearSvg);

            var addYearPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // var addYearPath = document.createElement("path");
            addYearPath.setAttribute("fill", "#fff");
            addYearPath.setAttribute("d", "m25.5,20.5l23.49999,-12l23.50001,12l-47,0z");
            addYearSvg.appendChild(addYearPath);

            var addYear_input = document.createElement("input");
            addYear_input.setAttribute("type", "text");
            addYear_input.setAttribute("readOnly", "true");
            addYear_input.setAttribute("id", "txt_Year");
            addYear_input.setAttribute("value", timeLine.options.moment_select.format("YYYY"));
            addYear_input.style.width = "95px";
            addYear_input.style.margin = " 3px 8px";

            addYear_input.style.height = "20px";
            addYear_input.style.margin = " 0px";
            addYear_input.style.padding = "0px";
            addYear_input.style.border = "0px";
            addYear_input.style.float = "left";
            addYear_input.style.color = "#fff";
            addYear_input.style.fontSize = "18px";
            addYear_input.style.textAlign = "center";
            addYear_input.style.border = "0";
            addYear_input.style.float = "left";
            addYear_input.style.color = "#fff";
            addYear_input.style.background = timeLine.options.default_bg_color;
            YearDiv.appendChild(addYear_input);

            var minusYearDiv = document.createElement("div");
            minusYearDiv.style.width = "95px";
            minusYearDiv.style.height = "25px";
            minusYearDiv.style.float = "left";
            minusYearDiv.id = "btn_AddYear";
            minusYearDiv.onclick = timeLine._minusOneYear;
            YearDiv.appendChild(minusYearDiv);

            var minusYearSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            //  var addYearSvg = document.createElement("svg");
            minusYearSvg.style.width = "98px";
            minusYearSvg.style.height = "25px";

            minusYearDiv.appendChild(minusYearSvg);

            var minusYearPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // var addYearPath = document.createElement("path");
            minusYearPath.setAttribute("fill", "#fff");
            minusYearPath.setAttribute("d", "m25.5,20.5l23.49999,-12l23.50001,12l-47,0z");
            minusYearPath.setAttribute("transform", "rotate(-180 48,14.5)");
            minusYearSvg.appendChild(minusYearPath);
        },

        //绘制月
        _init_Month_div: function (controller_div) {
            var MonthDiv = document.createElement("div");
            MonthDiv.style.width = "55px";
            MonthDiv.style.height = "75px";
            MonthDiv.style.float = "left";
            MonthDiv.id = "YearInputDiv";
            controller_div.appendChild(MonthDiv);

            var addMonthDiv = document.createElement("div");
            addMonthDiv.style.width = "65px";
            addMonthDiv.style.height = "25px";
            addMonthDiv.style.float = "left";
            addMonthDiv.id = "btn_AddYear";
            addMonthDiv.onclick = timeLine._addOneMonth;
            MonthDiv.appendChild(addMonthDiv);

            var addMonthSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            addMonthSvg.style.width = "65px";
            addMonthSvg.style.height = "25px";
            addMonthDiv.appendChild(addMonthSvg);

            var addMonthPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            addMonthPath.setAttribute("fill", "#fff");
            addMonthPath.setAttribute("d", "m10,20.5l19.99999,-12l20.00001,12l-40,0z");
            addMonthSvg.appendChild(addMonthPath);

            var addMonth_input = document.createElement("input");
            addMonth_input.setAttribute("type", "text");
            addMonth_input.setAttribute("readOnly", "true");
            addMonth_input.setAttribute("id", "txt_Month");
            addMonth_input.setAttribute("value", timeLine.options.moment_select.format("MM"));
            addMonth_input.style.width = "60px";
            addMonth_input.style.height = "20px";
            addMonth_input.style.margin = " 0px";
            addMonth_input.style.padding = "0px";
            addMonth_input.style.border = "0px";
            addMonth_input.style.float = "left";
            addMonth_input.style.color = "#fff";
            addMonth_input.style.fontSize = "18px";
            addMonth_input.style.textAlign = "center";
            addMonth_input.style.verticalAlign = "text-bottom";
            addMonth_input.style.background = timeLine.options.default_bg_color;
            MonthDiv.appendChild(addMonth_input);

            var minusMonthDiv = document.createElement("div");
            minusMonthDiv.style.width = "65px";
            minusMonthDiv.style.height = "25px";
            minusMonthDiv.style.float = "left";
            minusMonthDiv.id = "btn_AddYear";
            minusMonthDiv.onclick = timeLine._minusOneMonth;
            MonthDiv.appendChild(minusMonthDiv);

            var minusMonthSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            //  var addYearSvg = document.createElement("svg");
            minusMonthSvg.style.width = "65px";
            minusMonthSvg.style.height = "25px";
            minusMonthDiv.appendChild(minusMonthSvg);

            var minusMonthPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // var addYearPath = document.createElement("path");
            minusMonthPath.setAttribute("fill", "#fff");
            minusMonthPath.setAttribute("d", "m10,20.5l19.99999,-12l20.00001,12l-40,0z");
            minusMonthPath.setAttribute("transform", "rotate(-180 30,14.5)");
            minusMonthSvg.appendChild(minusMonthPath);
        },

        //绘制天
        _init_Day_div: function (controller_div) {
            var DayDiv = document.createElement("div");
            DayDiv.style.width = "65px";
            DayDiv.style.height = "75px";
            DayDiv.style.float = "left";
            DayDiv.id = "YearInputDiv";
            controller_div.appendChild(DayDiv);

            var addDayDiv = document.createElement("div");
            addDayDiv.style.width = "65px";
            addDayDiv.style.height = "25px";
            addDayDiv.style.float = "left";
            addDayDiv.id = "btn_AddYear";
            addDayDiv.onclick = timeLine._addOneDay;
            DayDiv.appendChild(addDayDiv);

            var addDaySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            //  var addYearSvg = document.createElement("svg");
            addDaySvg.style.width = "65px";
            addDaySvg.style.height = "25px";
            addDayDiv.appendChild(addDaySvg);

            var addDayPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // var addYearPath = document.createElement("path");
            addDayPath.setAttribute("fill", "#fff");
            addDayPath.setAttribute("d", "m10,20.5l19.99999,-12l20.00001,12l-40,0z");
            addDaySvg.appendChild(addDayPath);


            var addDay_input = document.createElement("input");
            addDay_input.setAttribute("type", "text");
            addDay_input.setAttribute("readOnly", "true");
            addDay_input.setAttribute("id", "txt_Day");
            addDay_input.setAttribute("value", timeLine.options.moment_select.format("DD"));
            addDay_input.style.width = "60px";
            addDay_input.style.height = "20px";
            addDay_input.style.margin = " 0px";
            addDay_input.style.padding = "0px";
            addDay_input.style.border = "0px";
            addDay_input.style.float = "left";
            addDay_input.style.color = "#fff";
            addDay_input.style.fontSize = "18px";
            addDay_input.style.textAlign = "center";
            addDay_input.style.verticalAlign = "text-bottom";
            addDay_input.style.background = timeLine.options.default_bg_color;
            DayDiv.appendChild(addDay_input);


            var minusDayDiv = document.createElement("div");
            minusDayDiv.style.width = "65px";
            minusDayDiv.style.height = "25px";
            minusDayDiv.style.float = "left";
            minusDayDiv.id = "btn_AddDay";
            minusDayDiv.onclick = timeLine._minusOneDay;
            DayDiv.appendChild(minusDayDiv);

            var minusDaySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            //  var addYearSvg = document.createElement("svg");
            minusDaySvg.style.width = "65px";
            minusDaySvg.style.height = "25px";
            minusDayDiv.appendChild(minusDaySvg);

            var minusDayPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // var addYearPath = document.createElement("path");
            minusDayPath.setAttribute("fill", "#fff");
            minusDayPath.setAttribute("d", "m10,20.5l19.99999,-12l20.00001,12l-40,0z");
            minusDayPath.setAttribute("transform", "rotate(-180 30,14.5)");
            minusDaySvg.appendChild(minusDayPath);
        },

        //添加一年
        _addOneYear: function () {
            timeLine.options.moment_select.add(1.0, 'years');
            timeLine._resetInputShow();
        },
        _minusOneYear: function () {
            timeLine.options.moment_select.add(-1.0, 'years');
            timeLine._resetInputShow();
        },

        _addOneMonth: function () {
            timeLine.options.moment_select.add(1.0, 'month');
            timeLine._resetInputShow();
        },
        _minusOneMonth: function () {
            timeLine.options.moment_select.add(-1.0, 'month');
            timeLine._resetInputShow();
        },

        _addOneDay: function () {
            timeLine.options.moment_select.add(1.0, 'day');
            timeLine._resetInputShow();
        },
        _minusOneDay: function () {
            timeLine.options.moment_select.add(-1.0, 'day');
            timeLine._resetInputShow();
        },

        /**
         * 初始化 时间轴 右侧 模式显示及伸缩部分
         */
        init_timeMode: function () {


        },


        /**
         * 初始化时间轴
         */
        init_timeline: function () {
            var _canvas = document.createElement("canvas");
            _canvas.width = this.options.timeline_width;
            _canvas.height = this.options.timeline_height;
            _canvas.id = "_timeline";
            _canvas.style.float = "left";

            this._el.container.appendChild(_canvas);
            this._el.timecanvas = _canvas;

            var ctx = _canvas.getContext('2d');
            ctx.rect(0, 0, this.options.timeline_width, this.options.timeline_height);
            ctx.fillStyle = this.options.default_bg_color;
            ctx.fill();


            //监听鼠标移动事件
            _canvas.addEventListener("mousedown", timeLine.startMove, false);
            _canvas.addEventListener("mousemove", timeLine.moving, false);
            _canvas.addEventListener("mouseup", timeLine.endMove, false);
            _canvas.addEventListener("mouseout", timeLine.endMove, false);

            //鼠标双击选择时间
            _canvas.addEventListener("dblclick", timeLine.onMouseClick, false);
            _canvas.addEventListener('mousewheel', timeLine.scrollFunc, false);
            /*  if (_canvas.addEventListener) {
             _canvas.addEventListener('mousewheel', timeLine.scrollFunc, false);
             }*/
            timeLine._drag(0);
        }
        ,


        /**
         *鼠标滚轮事件
         * @param event
         */
        scrollFunc: function (event) {
            //鼠标滚轮事件，
            //正为向上
            //负为向下

            var ev = event;
            var delta = ev.wheelDelta ? (ev.wheelDelta / 120) : (-ev.detail / 3); // Firefox using `wheelDelta` IE using `detail`

            if (delta > 0) {
                timeLine.options.select_modeindex = timeLine.options.select_modeindex - 1;
            }
            else {
                timeLine.options.select_modeindex = timeLine.options.select_modeindex + 1;
            }
            //多超界 进行判定
            if (timeLine.options.select_modeindex < 0) {
                timeLine.options.select_modeindex = 0;
            }
            if (timeLine.options.select_modeindex > 3) {
                timeLine.options.select_modeindex = 3;
            }
            timeLine._switchMode();
        },

        //根据当前鼠标时间 重新设置 index位置
        _switchMode: function () {
            //根据鼠标位置 重新计算开始结束
            var selectMode = timeLine.options.select_modeindex;
            // var modeName = this.options.mode_list [selectMode];
            //在当前模式下，选择精确到的 单位
            var selectmodeunit = timeLine.options.mode_unit[selectMode];
            //每一个单位大小
            var selectmodetimespan = timeLine.options.mode_timespan[selectMode];
            //基于当前时间计算
            var width_before = timeLine.options.mouse_x;
            var width_after = timeLine.options.timeline_width - timeLine.options.mouse_x;
            var unitNum_before = -parseFloat(width_before / selectmodetimespan);
            var unitNum_after = parseFloat(width_after / selectmodetimespan);
            var moment_begin = moment.utc(timeLine.options.moment_mousein.format("YYYY-MM-DD HH:mm:ss"), "YYYY-MM-DD HH:mm:ss");

            timeLine.options.moment_begin = moment_begin.add(unitNum_before, selectmodeunit);

            var moment_end = moment.utc(timeLine.options.moment_mousein.format("YYYY-MM-DD HH:mm:ss"), "YYYY-MM-DD HH:mm:ss");

            timeLine.options.moment_end = moment_end.add(unitNum_after, selectmodeunit);

            timeLine._drag(0);
        },


//开始移动
        startMove: function (event) {

            function doMouseDown(event) {
                event.preventDefault();
                timeLine.options.is_drag = true;
                timeLine.options.begin_X = event.offsetX;
            }

            timeLine.options.isMouseDownDoing = false;
            timeLine.options.doMouseDownTimmer = setTimeout(doMouseDown, 200, event);

        }
        ,

//位移过程
        moving: function () {
            //如果正在位移 则对拖动进行处理
            if (timeLine.options.is_drag) {
                //是否正在拖动
                timeLine.options.end_X = event.offsetX;
                var drag_pix = timeLine.options.end_X - timeLine.options.begin_X;
                //根据阈值进行赋值
                if (drag_pix > 20 || drag_pix < -20) {
                    timeLine._drag(drag_pix);
                    timeLine.options.begin_X = timeLine.options.end_X;
                }
            }
            else {
                //若未进行位移，根据开始和参数计算当前时间 显示
                timeLine._getDateMouseIn(event.offsetX);
            }
        }
        ,

// 结束位移
        endMove: function () {
            // console.log('endMove');
            if (!timeLine.options.isMouseDownDoing) {
                //  console.log('clear');
                clearTimeout(timeLine.options.doMouseDownTimmer); //能进到这里来，不管三七二十一先把doMouseDownTimmer清除，不然200毫秒后doMouseDown方法还是会被调用的
                // document.getElementById('div1').innerHTML += 'mouseUp<br/>';
            }
            if (timeLine.options.is_drag) {
                //是否正在拖动
                timeLine.options.is_drag = false;
                timeLine.options.end_X = event.offsetX;
                var drag_pix = timeLine.options.end_X - timeLine.options.begin_X;

                //  console.log(drag_pix);
                //根据阈值进行赋值
                if (drag_pix > 5 || drag_pix < -5) {
                    timeLine._drag(drag_pix);
                    timeLine.options.begin_X = timeLine.options.end_X;
                }
            }
            else {
                //timeLine.onMouseClick();
            }


        }
        ,

        onMouseClick: function () {
            console.log('onMouseClick');
            timeLine.options.moment_select = timeLine.options.moment_mousein;
            console.log(timeLine.options.moment_select.format("YYYY-MM-DD HH:mm:ss"));
            timeLine.DateTimeChange();
        },

//用于显示的date
        _formatDateShow: function () {
            var timeline_canvas = this._el.timecanvas;
            var ToolTip = "";
            if (timeLine.options.moment_mousein) {
                switch (timeLine.options) {

                }
            }
        }
        ,

//获取鼠标所在位置的时间
        _getDateMouseIn: function (mouse_x) {
            //获取当前开始时间
            var time_begin_str = timeLine.options.moment_begin.utc().format("YYYYMMDD HHmmss");
            var selectMode = this.options.select_modeindex;
            //在当前模式下，选择精确到的 单位
            var selectmodeunit = this.options.mode_unit  [selectMode];
            var selectmode_pix = this.options.mode_timespan  [selectMode];
            var add_unit = mouse_x / selectmode_pix;
            //获取当前像素单位
            var time = moment.utc(time_begin_str, "YYYYMMDD HHmmss");
            time = time.add(add_unit, selectmodeunit);
            //  console.log(time.format("YYYYMMDD HHmmss"));

            //设置鼠标当前位置
            timeLine.options.mouse_x = mouse_x;
            timeLine.options.moment_mousein = time;
            //   console.log(timeLine.options.moment_mousein.format("YYYY-MM-DD HH:mm:ss"));
            //根据当前像素单位 姐鼠标位置获取时间
        }
        ,


        init_beginTime: function () {
            var selectMode = this.options.select_modeindex;
            // var modeName = this.options.mode_list [selectMode];
            //在当前模式下，选择精确到的 单位
            var selectmodeunit = this.options.mode_unit[selectMode];
            //每一个单位大小
            var selectmodetimespan = this.options.mode_timespan[selectMode];
            //基于当前时间计算
            var width_before = this.options.timeline_width * 0.75;
            var width_after = this.options.timeline_width * 0.25;
            var unitNum_before = -parseFloat(width_before / selectmodetimespan);
            var unitNum_after = parseFloat(width_after / selectmodetimespan);
            var moment_begin = moment.utc(this.options.moment_select.format("YYYY-MM-DD HH:mm:ss"), "YYYY-MM-DD HH:mm:ss");

            timeLine.options.moment_begin = moment_begin.add(unitNum_before, selectmodeunit);

            var moment_end = moment.utc(this.options.moment_select.format("YYYY-MM-DD HH:mm:ss"), "YYYY-MM-DD HH:mm:ss");

            timeLine.options.moment_end = moment_end.add(unitNum_after, selectmodeunit);
        }
        ,

//根据位移重新计算开始结束
        _getTimeSpace: function (trans) {
            var moment_begin = timeLine.options.moment_begin;
            var moment_end = timeLine.options.moment_end;
            var selectMode = this.options.select_modeindex;
            //在当前模式下，选择精确到的 单位
            var selectmodeunit = this.options.mode_unit[selectMode];
            //每一个单位大小
            var selectmodetimespan = this.options.mode_timespan[selectMode];
            moment_begin.add(-trans / selectmodetimespan, selectmodeunit);
            moment_end.add(-trans / selectmodetimespan, selectmodeunit);
        }
        ,
//根据当前时刻进行位移
        _drag: function (trans) {
            //根据当前trans 计算新的开始结束

            //基于当前位移 重新计算 开始时间 结束时间
            timeLine._getTimeSpace(trans);
            var moment_begin = timeLine.options.moment_begin;
            var moment_end = timeLine.options.moment_end;
            timeLine._draw_bg();

            var selectMode = this.options.select_modeindex;
            //在当前模式下，选择精确到的 单位
            var selectmodeunit = this.options.mode_unit  [selectMode];
            var selectmode_pix = this.options.mode_timespan  [selectMode];
            timeLine._draw_timeline(moment_begin, moment_end, this.options.moment_select,selectmodeunit, selectmode_pix);
        },

        //绘制 时间轴背景
        _draw_bg: function () {
            var _canvas = this._el.timecanvas;
            if (_canvas) {
                var ctx = _canvas.getContext('2d');
                ctx.rect(0, 0, timeLine.options.timeline_width, timeLine.options.timeline_height);
                ctx.fillStyle = timeLine.options.default_bg_color;
                ctx.fill();
            }
        },

        //根据开始结束时间 绘制时间轴
        _draw_timeline: function (begin_date, end_date, select_date, unit_str, unit_pix) {

            //绘制横线
            timeLine._canvas_line("white", 0, timeLine.options.timeline_height_top, timeLine.options.timeline_width, timeLine.options.timeline_height_top);
            //绘制年间隔
            //timeLine._canvas_arc('white', 10, 55, 7);

            //计算开始绘制年时间
            var moment_draw = moment.utc(begin_date.format("YYYY-MM-DD HH:mm:ss"), "YYYY-MM-DD HH:mm:ss").startOf(unit_str);

            var trans = (1 - begin_date.diff(moment_draw, unit_str, true)) * unit_pix;

            //绘制纵向线
            while (moment_draw < end_date) {
                //绘制圆形
                if (timeLine._getArcMode(moment_draw)) {
                    timeLine._canvas_arc("white", trans - unit_pix, timeLine.options.timeline_height_top, 7);
                    timeLine._canvas_line("white", trans - unit_pix, 3, trans - unit_pix, timeLine.options.timeline_height);
                    var txtStr = timeLine._getDateStr(moment_draw);
                    timeLine._canvas_txt("white", txtStr, trans - unit_pix + 5, timeLine.options.timeline_height - 3);
                }

                if (timeLine._getLongLineMode(moment_draw)) {
                    timeLine._canvas_line("white", trans, timeLine.options.timeline_height_top - 20, trans, timeLine.options.timeline_height_top);
                }
                else {
                    // (fillcolor, begin_point_x, begin_point_y, end_point_x, end_point_y)
                    //  timeLine._canvas_line("white", trans, timeLine.options.timeline_height_top - 10, trans, timeLine.options.timeline_height_top);
                    timeLine._canvas_dashed_line("white", trans, timeLine.options.timeline_height_top - 10, trans, timeLine.options.timeline_height_top);

                }

                moment_draw.add(1.0, unit_str);
                // 绘制 时间块

                trans = trans + unit_pix;
            }
            //绘制圆点
        }
        ,

//根据选择时间 获取当前绘制时次是否为选择的时次
        _getisSelectDate: function (select_moment, draw_moment) {

        }
        ,

        _getArcMode: function (compareDate) {
            var selectMode = timeLine.options.mode_list[timeLine.options.select_modeindex];
            var isBegin = false;

            switch (selectMode) {
                case "year":
                {
                    console.log(compareDate.month());
                    if (compareDate.month() === 1) {
                        isBegin = true;
                    }
                    break;
                }
                case "month":
                {
                    if (compareDate.date() === 1) {
                        //  console.log
                        isBegin = true;
                    }
                    break;
                }
                case "day":
                {
                    if (compareDate.hour() === 1) {
                        isBegin = true;
                    }
                    break;
                }
                case "hour":
                {
                    if (compareDate.minute() === 1) {
                        isBegin = true;
                    }
                    break;
                }
                case "minute":
                {
                    if (compareDate.second() === 0) {
                        isBegin = true;
                    }
                    break;
                }
                default:
                    break;
            }
            return isBegin;
        }
        ,


//根据当前设置的 模式 返回对应长度的 Str
        _getDateStr: function (moment) {
            var selectMode = this.options.select_modeindex;
            var modeName = this.options.mode_list [selectMode];
            var moment_Str = moment.format("YYYY-MM-DD HH:mm:ss");
            switch (modeName) {
                case "year":
                {
                    moment_Str = moment.format("YYYY");
                    break;
                }
                case "month":
                {
                    moment_Str = moment.format("YYYY-MM");
                    break;
                }
                case "day":
                {
                    moment_Str = moment.format("YYYY-MM-DD");
                    break;
                }
                case "hour":
                {
                    moment_Str = moment.format("YYYY-MM-DD HH");
                    break;
                }
                case "minute":
                {
                    moment_Str = moment.format("YYYY-MM-DD HH:mm");
                    break;
                }
                default:
                {
                    break;
                }

            }
            return moment_Str;
        }
        ,

        _getLongLineMode: function (compareDate) {
            var selectMode = timeLine.options.mode_list[timeLine.options.select_modeindex];
            var isBegin = false;
            switch (selectMode) {
                case "year":
                {
                    if (compareDate.month() % 6 === 0) {
                        isBegin = true;
                    }
                    break;
                }
                case "month":
                {
                    if (compareDate.date() % 10 === 0) {
                        //  console.log
                        isBegin = true;
                    }
                    break;
                }
                case "day":
                {
                    if (compareDate.hour() % 10 === 0) {
                        isBegin = true;
                    }
                    break;
                }
                case "hour":
                {
                    if (compareDate.minute() % 6 === 0) {
                        isBegin = true;
                    }
                    break;
                }
                case "minute":
                {
                    if (compareDate.second() % 10 === 0) {
                        isBegin = true;
                    }
                    break;
                }
                default:
                    break;
            }
            return isBegin;
        }
        ,

//canvas 画线
        _canvas_arc: function (fillcolor, center_x, center_y, radius) {
            var _canvas = timeLine._el.timecanvas;
            if (_canvas) {
                var context = _canvas.getContext('2d');
                context.fillStyle = fillcolor;

                context.arc(center_x, center_y, radius, 0, Math.PI * 2);
                context.fill();
                //  context.stroke();
            }
        }
        ,
//canvas 画线
        _canvas_line: function (fillcolor, begin_point_x, begin_point_y, end_point_x, end_point_y) {
            if (begin_point_y > timeLine.options.timeline_width) {
                console.log(begin_point_x + ":" + end_point_x);
            }
            var _canvas = timeLine._el.timecanvas;
            if (_canvas) {
                var context = _canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = fillcolor;
                context.lineWidth = 1;
                context.moveTo(begin_point_x, begin_point_y);
                context.lineTo(end_point_x, end_point_y);
                context.closePath();
                context.stroke();
            }
        }
        ,

        _canvas_dashed_line: function (fillcolor, begin_point_x, begin_point_y, end_point_x, end_point_y) {
            var _canvas = timeLine._el.timecanvas;
            if (_canvas) {
                var context = _canvas.getContext('2d');
                context.beginPath();
                context.strokeStyle = fillcolor;
                context.lineWidth = 1;
                //context.setLineDash([2]);
                context.moveTo(begin_point_x, begin_point_y);
                context.lineTo(end_point_x, end_point_y);
                context.closePath();
                context.stroke();
            }
        }
        ,
//canvas 画矩形
        _canvas_rect: function (fillcolor, begin_point_x, begin_point_y, rect_width, rect_heigth) {
            var _canvas = timeLine._el.timecanvas;
            if (_canvas) {
                var context = _canvas.getContext('2d');
                context.beginPath();
                context.fillStyle = fillcolor;
                context.lineWidth = 10;
                context.moveTo(begin_point_x, begin_point_y);
                context.lineTo(begin_point_x, begin_point_y + rect_width);
                context.lineTo(begin_point_x + rect_heigth, begin_point_y + rect_width);
                context.lineTo(begin_point_x + rect_heigth, begin_point_y);
                context.closePath();
                context.fill();
            }
        }
        ,

        _canvas_txt: function (fillcolor, txtStr, begin_x, begin_y) {
            var _canvas = timeLine._el.timecanvas;
            if (_canvas) {
                var context = _canvas.getContext('2d');
                context.font = '16px Arial';
                context.fillStyle = fillcolor;
                context.fillText(txtStr, begin_x, begin_y);
            }
        }
        ,
        _resizeScreen: function () {
            timeLine.options.default_width = document.body.offsetWidth;
            timeLine.options.timeline_width = timeLine.options.default_width - timeLine.options.controller_width_sp;
            timeLine._fit_timeline();
        }
        ,
        _fit_timeline: function () {
            var _canvas = timeLine._el.timecanvas;
            if (_canvas) {
                _canvas.width = this.options.timeline_width;
                var ctx = _canvas.getContext('2d');
                ctx.rect(0, 0, this.options.timeline_width, this.options.timeline_height);
                ctx.fillStyle = this.options.default_bg_color;
                ctx.fill();
                timeLine._drag(0);
            }
        }
        ,

        _draw_timeLine: function () {

        },

        _resetInputShow: function () {

            var Year_input = document.getElementById("txt_Year");
            Year_input.setAttribute("value", timeLine.options.moment_select.format("YYYY"));

            var Month_input = document.getElementById("txt_Month");
            Month_input.setAttribute("value", timeLine.options.moment_select.format("MM"));
            var Day_input = document.getElementById("txt_Day");
            Day_input.setAttribute("value", timeLine.options.moment_select.format("DD"));

        }

    }
    ;




