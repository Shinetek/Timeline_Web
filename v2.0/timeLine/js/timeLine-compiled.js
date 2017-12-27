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
        //var self = this;
        //参数配置
        if (!options) {
            options = {};
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

        //获取 当前坐标轴
        if (typeof elem === 'object') {
            this._el.container = elem;
        } else {
            this._el.container = document.getElementById(elem);
        }
        //设置 类名称 与 css对应
        elem.setAttribute("class", "timeline");

        //设置宽高
        this.options = {
            script_path: "",
            //整体timeline 除了 右侧数据的部分
            controller_width_sp: 350,
            //控制器部分宽高
            controller_width: 300,
            controller_height: 72,
            //时间轴部分宽高
            timeline_width: 1000,
            timeline_height: 72,
            //时间轴 距离 顶部的 高
            timeline_height_top: 50,
            //默认背景颜色
            //default_bg_color: "#313133",
            default_bg_color: "rgba(49, 49, 49, 0.95)",

            default_button_color: "#444444",
            dataline_color: "#4682B4",
            dataline_color_1: "#0B69CB",
            dataline_color_gray: "#969696",
            //默认当前时间
            default_time: moment.utc(),
            //默认一格的毫秒数目
            default_timespan: 24 * 60 * 60 * 1000,
            //年　月　日　小时
            mode_list: ['year', 'month', 'day', 'hour'],
            //在当前模式下，选择精确到的 单位
            mode_unit: ['month', 'day', 'hour', 'minute'],
            //每一个单位大小
            mode_timespan: [12.5, 12.5, 12.5, 10],

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
            end_X: 0,

            isHide: false
        };
        this.datainfo = [];
        //初始化全部显示
        this._init_container();
        //设置窗口的重设事件
        window.onresize = this._resizeScreen;
    },

    _init_container: function () {
        //获取 宽高
        this._resizeScreen();
        this._init_beginTime();
        this._init_controller();
        this._init_timeline();
        this._init_timeMode();
    },

    /**
     * 数值修改触发函数 外部重写此函数 获取修改事件
     * @constructor
     */
    DateTimeChange: function () {
        $(timeLine._el.container).trigger("DateTimeChange", [timeLine.options.moment_select]);
    },

    //前一帧
    PreFrameChange: function () {
        $(timeLine._el.container).trigger("FrameChange", -1);
    },
    //后一帧
    NextFrameChange: function () {
        $(timeLine._el.container).trigger("FrameChange", 1);
    },

    _init_controller: function () {
        var controller_div = document.createElement("div");
        controller_div.style.width = timeLine.options.controller_width + "px";
        controller_div.style.height = timeLine.options.controller_height + "px";
        controller_div.style.float = "left";
        controller_div.style.background = timeLine.options.default_bg_color;
        controller_div.id = "_controller";
        controller_div.setAttribute('class', "controller_div");

        this._el.container.appendChild(controller_div);
        //设置 年部分

        timeLine._init_Year_div(controller_div);
        timeLine._init_Month_div(controller_div);
        timeLine._init_Day_div(controller_div);
        timeLine._init_Hour_div(controller_div);
        timeLine._init_Hide_div(controller_div);

        timeLine._init_sp_div(controller_div);

        timeLine._init_pre_div(controller_div);
        timeLine._init_next_div(controller_div);
    },
    //绘制年
    _init_Year_div: function (controller_div) {
        var YearDiv = document.createElement("div");
        YearDiv.id = "YearInputDiv";
        YearDiv.setAttribute("class", "year_show_div");
        controller_div.appendChild(YearDiv);
        var addYearDiv = document.createElement("div");

        addYearDiv.id = "btn_AddYear";
        addYearDiv.setAttribute("class", "time_up_year");
        addYearDiv.onclick = timeLine._addOneYear;
        YearDiv.appendChild(addYearDiv);

        var addYearSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        addYearDiv.appendChild(addYearSvg);

        var addYearPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        addYearPath.setAttribute("d", "m15,20.5l18,-10l18,10l-36,0z");
        addYearSvg.appendChild(addYearPath);

        var addYear_input = document.createElement("label");
        addYear_input.setAttribute("readOnly", "true");
        addYear_input.setAttribute("id", "txt_Year");
        addYear_input.setAttribute("class", "year_input");
        addYear_input.innerHTML = timeLine.options.moment_select.format("YYYY");
        addYear_input.style.pointerEvents = "none";
        addYear_input.style.cursor = "default";
        timeLine._setDocUnSelectable(addYear_input);

        YearDiv.appendChild(addYear_input);

        var minusYearDiv = document.createElement("div");
        minusYearDiv.style.float = "left";
        minusYearDiv.id = "btn_MinusYear";
        minusYearDiv.setAttribute("class", "time_down_year");
        minusYearDiv.onclick = timeLine._minusOneYear;
        YearDiv.appendChild(minusYearDiv);

        var minusYearSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        minusYearDiv.appendChild(minusYearSvg);

        var minusYearPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        minusYearPath.setAttribute("d", "m15,20.5l18,-10l18,10l-36,0z");
        minusYearPath.setAttribute("transform", "rotate(-180 33,14.5)");
        minusYearSvg.appendChild(minusYearPath);
    },

    //绘制月
    _init_Month_div: function (controller_div) {
        var MonthDiv = document.createElement("div");
        MonthDiv.setAttribute("class", "month_show_div");
        MonthDiv.id = "MonthInputDiv";
        controller_div.appendChild(MonthDiv);

        var addMonthDiv = document.createElement("div");
        addMonthDiv.setAttribute("class", "time_up_month");
        addMonthDiv.id = "btn_AddMonth";
        addMonthDiv.onclick = timeLine._addOneMonth;
        MonthDiv.appendChild(addMonthDiv);

        var addMonthSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        addMonthDiv.appendChild(addMonthSvg);

        var addMonthPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        addMonthPath.setAttribute("d", "m10,20.5l18,-10l18,10l-40,0z");
        addMonthSvg.appendChild(addMonthPath);

        var addMonth_input = document.createElement("label");
        addMonth_input.setAttribute("type", "text");
        addMonth_input.setAttribute("readOnly", "true");
        addMonth_input.setAttribute("id", "txt_Month");
        addMonth_input.setAttribute("value", timeLine.options.moment_select.format("MM"));
        addMonth_input.innerHTML = timeLine.options.moment_select.format("MM");

        timeLine._setDocUnSelectable(addMonth_input);
        addMonth_input.setAttribute("class", "month_input");

        MonthDiv.appendChild(addMonth_input);

        var minusMonthDiv = document.createElement("div");
        minusMonthDiv.id = "btn_MinusMonth";
        minusMonthDiv.setAttribute("class", "time_up_month");
        minusMonthDiv.onclick = timeLine._minusOneMonth;
        MonthDiv.appendChild(minusMonthDiv);

        var minusMonthSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        minusMonthDiv.appendChild(minusMonthSvg);

        var minusMonthPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        // var addYearPath = document.createElement("path");
        minusMonthPath.setAttribute("fill", timeLine.options.default_button_color);
        minusMonthPath.setAttribute("d", "m10,20.5l18,-10l18,10l-40,0z");
        minusMonthPath.setAttribute("transform", "rotate(-180 28,14.5)");
        minusMonthSvg.appendChild(minusMonthPath);
    },

    //绘制天
    _init_Day_div: function (controller_div) {
        var DayDiv = document.createElement("div");
        DayDiv.setAttribute("class", "month_show_div");
        DayDiv.id = "DayInputDiv";
        controller_div.appendChild(DayDiv);

        var addDayDiv = document.createElement("div");
        addDayDiv.id = "btn_AddYear";
        addDayDiv.setAttribute("class", "time_up_month");
        addDayDiv.onclick = timeLine._addOneDay;
        DayDiv.appendChild(addDayDiv);

        var addDaySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        addDayDiv.appendChild(addDaySvg);

        var addDayPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        addDayPath.setAttribute("d", "m10,20.5l18,-10l18,10l-40,0z");
        addDaySvg.appendChild(addDayPath);

        var addDay_input = document.createElement("label");
        addDay_input.setAttribute("type", "text");
        addDay_input.setAttribute("readOnly", "true");
        addDay_input.setAttribute("id", "txt_Day");
        addDay_input.setAttribute("value", timeLine.options.moment_select.format("DD"));
        addDay_input.innerHTML = timeLine.options.moment_select.format("DD");
        timeLine._setDocUnSelectable(addDay_input);
        addDay_input.setAttribute("class", "month_input");
        DayDiv.appendChild(addDay_input);

        var minusDayDiv = document.createElement("div");
        minusDayDiv.id = "btn_MinusDay";
        minusDayDiv.setAttribute("class", "time_up_month");
        minusDayDiv.onclick = timeLine._minusOneDay;
        DayDiv.appendChild(minusDayDiv);

        var minusDaySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        minusDayDiv.appendChild(minusDaySvg);

        var minusDayPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

        minusDayPath.setAttribute("d", "m10,20.5l18,-10l18,10l-40,0z");
        minusDayPath.setAttribute("transform", "rotate(-180 28,14.5)");
        minusDaySvg.appendChild(minusDayPath);
    },

    //绘制小时
    _init_Hour_div: function (controller_div) {
        var HourDiv = document.createElement("div");
        HourDiv.setAttribute("class", "month_show_div");
        HourDiv.id = "HourInputDiv";
        controller_div.appendChild(HourDiv);

        var addHourDiv = document.createElement("div");
        addHourDiv.setAttribute("class", "time_up_month");
        addHourDiv.id = "btn_AddYear";
        addHourDiv.onclick = timeLine._addOneHour;
        HourDiv.appendChild(addHourDiv);

        var addHourSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        addHourDiv.appendChild(addHourSvg);

        var addHourPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        // var addYearPath = document.createElement("path");
        addHourPath.setAttribute("fill", timeLine.options.default_button_color);
        addHourPath.setAttribute("d", "m10,20.5l18,-10l18,10l-40,0z");
        addHourSvg.appendChild(addHourPath);

        var addHour_input = document.createElement("label");
        addHour_input.setAttribute("type", "text");
        addHour_input.setAttribute("readOnly", "true");
        addHour_input.setAttribute("id", "txt_Hour");
        addHour_input.setAttribute("value", timeLine.options.moment_select.format("HH"));
        addHour_input.innerHTML = timeLine.options.moment_select.format("HH");
        timeLine._setDocUnSelectable(addHour_input);
        addHour_input.setAttribute("class", "month_input");
        HourDiv.appendChild(addHour_input);

        var minusHourDiv = document.createElement("div");
        minusHourDiv.setAttribute("class", "time_up_month");
        minusHourDiv.id = "btn_minusHour";
        minusHourDiv.onclick = timeLine._minusOneHour;
        HourDiv.appendChild(minusHourDiv);

        var minusHourSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        minusHourDiv.appendChild(minusHourSvg);

        var minusHourPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

        minusHourPath.setAttribute("d", "m10,20.5l18,-10l18,10l-40,0z");
        minusHourPath.setAttribute("transform", "rotate(-180 28,14.5)");
        minusHourSvg.appendChild(minusHourPath);
    },

    //绘制间隔
    _init_sp_div: function (controller_div) {

        var background_div = document.createElement("div");
        background_div.id = "background_div";
        background_div.setAttribute("class", "background_div");
        background_div.style.background = "transport";
        background_div.style.zIndex = "0";
        controller_div.appendChild(background_div);

        var background_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        background_svg.setAttribute("class", "background_svg");
        background_div.appendChild(background_svg);

        var y_location = "37";
        var nextPath_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        nextPath_1.setAttribute("x", "70");
        nextPath_1.setAttribute("y", y_location);
        nextPath_1.setAttribute("width", "10");
        nextPath_1.setAttribute("height", "1.5");

        var nextPath_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        nextPath_2.setAttribute("x", "125");
        nextPath_2.setAttribute("y", y_location);
        nextPath_2.setAttribute("width", "10");
        nextPath_2.setAttribute("height", "1.5");

        background_svg.appendChild(nextPath_1);
        background_svg.appendChild(nextPath_2);
        //background_svg.appendChild(nextPath_3);
    },

    //绘制qi前一个 div
    _init_pre_div: function (controller_div) {
        var PreDiv = document.createElement("div");
        PreDiv.setAttribute("class", "pre_div");
        PreDiv.id = "pre_div";
        controller_div.appendChild(PreDiv);
        var preSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        PreDiv.appendChild(preSvg);

        var prePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        prePath.setAttribute("d", "M 8,0 16,0 8,20 16,40 8,40 0,20 8,0z");
        preSvg.appendChild(prePath);

        PreDiv.onclick = timeLine._preClickFunc;
    },

    _preClickFunc: function () {
        var selectMode = timeLine.options.mode_list[timeLine.options.select_modeindex];
        switch (selectMode) {
            case "year":
                {
                    timeLine._minusOneYear();
                    break;
                }
            case "month":
                {
                    timeLine._minusOneMonth();
                    break;
                }
            case "day":
                {
                    timeLine._minusOneDay();
                    break;
                }
            case "minute":
                {
                    //todo 传出事件

                    break;
                }
            default:
                {
                    break;
                }

        }
    },

    //绘制开始div
    _init_next_div: function (controller_div) {
        var NextDiv = document.createElement("div");
        NextDiv.id = "next_div";
        NextDiv.setAttribute("class", "pre_div");
        controller_div.appendChild(NextDiv);

        var nextSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        NextDiv.appendChild(nextSvg);

        var nextPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        nextPath.setAttribute("d", "M  0,0 8,0 16,20 8,40 0,40 8,20 0,0z");
        nextSvg.appendChild(nextPath);

        NextDiv.onclick = timeLine._nextClickFunc;
    },

    _nextClickFunc: function () {
        var selectMode = timeLine.options.mode_list[timeLine.options.select_modeindex];
        switch (selectMode) {
            case "year":
                {
                    timeLine._addOneYear();
                    break;
                }
            case "month":
                {
                    timeLine._addOneMonth();
                    break;
                }
            case "day":
                {
                    timeLine._addOneDay();
                    break;
                }
            case "minute":
                {
                    //todo 传出事件

                    break;
                }
            default:
                {
                    break;
                }

        }
    },

    _init_Hide_div: function (controller_div) {
        var _timeLine = this._el.container;

        var hide_div = document.createElement("div");
        hide_div.style.width = '25px';
        hide_div.id = "hide_Div";
        hide_div.setAttribute("class", "hide_div");
        hide_div.style.background = timeLine.options.default_bg_color;
        _timeLine.appendChild(hide_div);

        var hideSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        hide_div.appendChild(hideSvg);

        var x_location = "5";
        var nextPath_1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        nextPath_1.setAttribute("x", x_location);
        nextPath_1.setAttribute("y", "30");
        nextPath_1.setAttribute("width", "15");
        nextPath_1.setAttribute("height", "2");
        var nextPath_2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        nextPath_2.setAttribute("x", x_location);
        nextPath_2.setAttribute("y", "35");
        nextPath_2.setAttribute("width", "15");
        nextPath_2.setAttribute("height", "2");
        var nextPath_3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        nextPath_3.setAttribute("x", x_location);
        nextPath_3.setAttribute("y", "40");
        nextPath_3.setAttribute("width", "15");
        nextPath_3.setAttribute("height", "2");
        hideSvg.appendChild(nextPath_1);
        hideSvg.appendChild(nextPath_2);
        hideSvg.appendChild(nextPath_3);

        hide_div.addEventListener("mousedown", timeLine._setHideAndShow, false);
    },

    _init_modeController: function () {},

    //设置显示隐藏
    _setHideAndShow: function () {
        var _controller = document.getElementById('_controller');
        var _timeline = document.getElementById('_timeline');
        if (timeLine.options.isHide === false) {
            _controller.style.display = "none";
            _timeline.style.display = "none";
            timeLine.options.isHide = true;
        } else {
            _controller.style.display = "block";
            _timeline.style.display = "block";
            timeLine.options.isHide = false;
        }
    },

    _setDocUnSelectable: function (_el) {
        /*   -webkit-touch-callout: none; /!* iOS Safari *!/
         -webkit-user-select: none; /!* Chrome/Safari/Opera *!/
         -khtml-user-select: none; /!* Konqueror *!/
         -moz-user-select: none; /!* Firefox *!/
         -ms-user-select: none; /!* Internet Explorer/Edge *!/
         user-select: none; /!* Non-prefixed version, currently
         not supported by any browser *!/
         */

        _el.style.webkitUserSelect = "none";
        _el.style.msUserSelect = "none";
        _el.style.userSelect = "none";
        _el.style.mozUserSelect = "none";
    },

    //添加一年
    _addOneYear: function () {
        timeLine._addminusSelectMoment(1.0, 'years');
    },
    _minusOneYear: function () {
        timeLine._addminusSelectMoment(-1.0, 'years');
    },

    _addOneMonth: function () {
        timeLine._addminusSelectMoment(1.0, 'month');
    },
    _minusOneMonth: function () {
        timeLine._addminusSelectMoment(-1.0, 'month');
    },

    _addOneDay: function () {
        timeLine._addminusSelectMoment(1.0, 'day');
    },
    _minusOneDay: function () {
        timeLine._addminusSelectMoment(-1.0, 'day');
    },

    _addOneHour: function () {
        timeLine._addminusSelectMoment(1.0, 'hour');
    },
    _minusOneHour: function () {
        timeLine._addminusSelectMoment(-1.0, 'hour');
    },

    //对当前显示时间进行加减
    _addminusSelectMoment: function (addminus_num, timeUnit) {
        timeLine.options.moment_select.add(addminus_num, timeUnit);
        var _trans = timeLine._getTransByTime(addminus_num, timeUnit);
        timeLine._resetInputShow();
        timeLine._drag(_trans);
        timeLine.DateTimeChange();
    },

    //根据日期加减 获取 位移
    _getTransByTime: function (addminus_num, timeUnit) {
        // var return_trans = 0;
        //获取当前选择时间
        var selectUnit = timeLine.options.mode_unit[timeLine.options.select_modeindex];
        var selectUnit_pix = timeLine.options.mode_timespan[timeLine.options.select_modeindex];
        var selectMoment_str = timeLine.options.moment_select.utc().format("YYYYMMDDHHmmss");
        var old_moment = moment.utc(selectMoment_str, "YYYYMMDDHHmmss").add(addminus_num, timeUnit);
        var return_trans = old_moment.diff(timeLine.options.moment_select, selectUnit, true) * selectUnit_pix;
        //根据当前 单位
        return -return_trans;
    },

    /**
     * 初始化 时间轴 右侧 模式显示及伸缩部分
     */
    _init_timeMode: function () {},

    _clearTimeLine: function () {

        var _canvas = this._el.timecanvas;
        if (_canvas) {
            var ctx = _canvas.getContext('2d');
            ctx.clearRect(0, 0, this.options.timeline_width, this.options.timeline_height);
        }
        //   ctx.rect(0, 0, this.options.timeline_width, this.options.timeline_height);
        //  ctx.fillStyle = this.options.default_bg_color;
        // ctx.fill();
    },

    /**
     * 初始化时间轴
     */
    _init_timeline: function () {
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

        if (_canvas.addEventListener) {
            //监听鼠标移动事件
            _canvas.addEventListener("mousedown", timeLine.startMove, false);
            _canvas.addEventListener("mousemove", timeLine.moving, false);
            _canvas.addEventListener("mouseup", timeLine.endMove, false);
            _canvas.addEventListener("mouseout", timeLine.endMove, false);

            //鼠标双击选择时间
            _canvas.addEventListener("dblclick", timeLine.onMouseClick, false);
            _canvas.addEventListener('mousewheel', timeLine.scrollFunc, false);
            _canvas.addEventListener('DOMMouseScroll', timeLine.scrollFunc, false);
        } else {
            _canvas.attachEvent("mousedown", timeLine.startMove);
            _canvas.attachEvent("mousemove", timeLine.moving);
            _canvas.attachEvent("mouseup", timeLine.endMove);
            _canvas.attachEvent("mouseout", timeLine.endMove);
            //鼠标双击选择时间
            _canvas.attachEvent("dblclick", timeLine.onMouseClick);
            _canvas.attachEvent('mousewheel', timeLine.scrollFunc);
        }
        timeLine._drag(0);
    },

    /**
     *鼠标滚轮事件
     * @param event
     */
    scrollFunc: function (event) {
        //鼠标滚轮事件，
        //正为向上
        //负为向下

        var ev = event || window.event;
        var delta = ev.wheelDelta ? ev.wheelDelta / 120 : -ev.detail / 3; // Firefox using `wheelDelta` IE using `detail`
        delta = -delta;
        if (delta > 0) {
            timeLine.options.select_modeindex = timeLine.options.select_modeindex - 1;
        } else {
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
        var ev = event || window.event;
        timeLine.options.isMouseDownDoing = false;
        timeLine.options.is_drag = true;
        timeLine.options.begin_X = ev.offsetX;
    },

    //位移过程
    moving: function (event) {
        var ev = event || window.event;
        //如果正在位移 则对拖动进行处理
        if (timeLine.options.is_drag) {
            //是否正在拖动
            timeLine.options.end_X = ev.offsetX;
            var drag_pix = timeLine.options.end_X - timeLine.options.begin_X;
            //根据阈值进行赋值
            if (drag_pix > 20 || drag_pix < -20) {
                timeLine._drag(drag_pix);
                timeLine.options.begin_X = timeLine.options.end_X;
            }
        } else {
            //若未进行位移，根据开始和参数计算当前时间 显示
            timeLine._getDateMouseIn(event.offsetX);
        }
    },
    // 结束位移
    endMove: function (event) {

        var ev = event || window.event;
        if (timeLine.options.is_drag) {
            //是否正在拖动
            timeLine.options.is_drag = false;
            timeLine.options.end_X = ev.offsetX;
            var drag_pix = timeLine.options.end_X - timeLine.options.begin_X;
            //根据阈值进行赋值
            if (drag_pix > 5 || drag_pix < -5) {
                //  timeLine.options.is_drag = false;
                timeLine._drag(drag_pix);
                timeLine.options.begin_X = timeLine.options.end_X;
            }
        } else {
            //timeLine.onMouseClick();
            timeLine._getDateMouseIn(event.offsetX);
        }
    },

    onMouseClick: function () {
        //鼠标点击事件
        timeLine.options.moment_select = timeLine.options.moment_mousein;
        timeLine.DateTimeChange();
        timeLine._resetInputShow();
        timeLine._drag(0);
    },

    //用于显示的date
    _formatDateShow: function () {

        var selectUnit = timeLine.options.mode_unit[timeLine.options.select_modeindex];

        var toolTip = "";
        if (timeLine.options.moment_mousein) {
            switch (selectUnit) {
                case "month":
                    {
                        toolTip = timeLine.options.moment_mousein.format("YYYY-MM");

                        break;
                    }
                case "day":
                    {
                        toolTip = timeLine.options.moment_mousein.format("YYYY-MM-DD");

                        break;
                    }
                case "hour":
                    {
                        toolTip = timeLine.options.moment_mousein.format("YYYY-MM-DD HH:mm");

                        break;
                    }
                case "minute":
                    {
                        toolTip = timeLine.options.moment_mousein.format("YYYY-MM-DD HH:mm:ss");

                        break;
                    }
                default:
                    {
                        toolTip = "";

                        break;
                    }

            }
        }
        var _canvas = timeLine._el.timecanvas;
        _canvas.title = toolTip;
        return toolTip;
    },

    //获取鼠标所在位置的时间
    _getDateMouseIn: function (mouse_x) {
        //获取当前开始时间
        var time_begin_str = timeLine.options.moment_begin.utc().format("YYYYMMDD HHmmss");
        var selectMode = this.options.select_modeindex;
        //在当前模式下，选择精确到的 单位
        var selectmodeunit = this.options.mode_unit[selectMode];
        var selectmode_pix = this.options.mode_timespan[selectMode];
        var add_unit = mouse_x / selectmode_pix;
        //获取当前像素单位
        var time = moment.utc(time_begin_str, "YYYYMMDD HHmmss");
        time = time.add(add_unit, selectmodeunit);

        //设置鼠标当前位置
        timeLine.options.mouse_x = mouse_x;
        timeLine.options.moment_mousein = time;
        //根据当前像素单位 姐鼠标位置获取时间
        timeLine._formatDateShow();
        return time.format("YYYYMMDD HHmmss");
    },

    _init_beginTime: function () {
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
    },

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
    },
    //根据当前时刻进行位移
    _drag: function (trans) {
        //根据当前trans 计算新的开始结束
        timeLine._clearTimeLine();
        //基于当前位移 重新计算 开始时间 结束时间
        timeLine._getTimeSpace(trans);
        var moment_begin = timeLine.options.moment_begin;
        var moment_end = timeLine.options.moment_end;
        timeLine._draw_bg();

        var selectMode = timeLine.options.select_modeindex;
        //在当前模式下，选择精确到的 单位
        var selectmodeunit = timeLine.options.mode_unit[selectMode];
        var selectmode_pix = timeLine.options.mode_timespan[selectMode];
        timeLine._draw_timeline(moment_begin, moment_end, this.options.moment_select, selectmodeunit, selectmode_pix);
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

        //计算开始绘制时间
        var moment_draw = moment.utc(begin_date.format("YYYY-MM-DD HH:mm:ss"), "YYYY-MM-DD HH:mm:ss").startOf(unit_str);

        var trans = (1 - begin_date.diff(moment_draw, unit_str, true)) * unit_pix;

        //绘制 DataInfo
        var begin_date_str = begin_date.utc().format("YYYYMMDDHHmmss");
        var end_date_str = end_date.utc().format("YYYYMMDDHHmmss");
        //根据当前 开始时间 和结束时间
        if (timeLine.datainfo.length > 0) {
            var rect_height = 40 / timeLine.datainfo.length;
            if (rect_height > 10) {
                rect_height = 10;
            }
            for (var i = 0; i < timeLine.datainfo.length; i++) {
                var rect_y = i * rect_height;
                var ProdItem = timeLine.datainfo[i];
                var isGrayShow = ProdItem.isShow;
                if (ProdItem.datainfolist) {
                    var select_datainfo = ProdItem.datainfolist[timeLine.options.mode_unit[timeLine.options.select_modeindex]];
                    for (var t = 0; t < select_datainfo.length; t++) {
                        var datainfo = select_datainfo[t];
                        timeLine._getDataShowInfo(rect_height, rect_y, datainfo, begin_date_str, end_date_str, begin_date, end_date, unit_str, unit_pix, t, isGrayShow);
                    }
                }
            }
        }

        //绘制纵向线
        while (moment_draw < end_date) {
            var _line_x = trans - unit_pix;
            //绘制圆形
            if (timeLine._getArcMode(moment_draw)) {
                timeLine._canvas_arc("white", _line_x, timeLine.options.timeline_height_top, 7);
                timeLine._canvas_line("white", _line_x, 3, trans - unit_pix, timeLine.options.timeline_height);
                var txtStr = timeLine._getDateStr(moment_draw);
                timeLine._canvas_txt("white", txtStr, _line_x + 5, timeLine.options.timeline_height - 3);
            }

            if (timeLine._getLongLineMode(moment_draw)) {
                timeLine._canvas_line("white", _line_x, timeLine.options.timeline_height_top - 20, _line_x, timeLine.options.timeline_height_top);
            } else {
                // (fillcolor, begin_point_x, begin_point_y, end_point_x, end_point_y)
                //  timeLine._canvas_line("white", trans, timeLine.options.timeline_height_top - 10, trans, timeLine.options.timeline_height_top);
                timeLine._canvas_dashed_line("white", _line_x, timeLine.options.timeline_height_top - 10, _line_x, timeLine.options.timeline_height_top);
            }

            moment_draw.add(1.0, unit_str);
            // 绘制 时间块

            trans = trans + unit_pix;
        }

        //绘制 当前选择时间点
        if (begin_date.isBefore(select_date) && end_date.isAfter(select_date)) {
            var selectTrans = (1 - begin_date.diff(select_date, unit_str, true) - 1) * unit_pix;
            //timeLine._canvas_arc("red", selectTrans - 7, timeLine.options.timeline_height_top, 7);
            timeLine._canvas_line("red", selectTrans, 0, selectTrans, 73);
        }
    },

    _getDataShowInfo: function (rect_height, rect_y, datainfo, begin_date_str, end_date_str, begin_date, end_date, unit_str, unit_pix, dataindex, isGrayShow) {

        var is_Draw = true;
        if (datainfo.begintime < begin_date_str && datainfo.endtime < begin_date_str || datainfo.begintime > end_date_str && datainfo.endtime > end_date_str) {
            is_Draw = false;
        }

        //如果确认绘制
        if (is_Draw) {
            //高度 rect_height
            //计算宽度  rect_width
            //计算开始x rect_x
            //计算开始y rect_y

            var rect_width = 0;
            var rect_x = 0;
            var begin_line_date = moment.utc(datainfo.begintime, "YYYYMMDDHHmmss");
            var end_line_date = moment.utc(datainfo.endtime, "YYYYMMDDHHmmss");

            if (begin_date_str <= datainfo.begintime && datainfo.endtime <= end_date_str) {
                //模式1 在中央
                rect_width = end_line_date.diff(begin_line_date, unit_str, true) * unit_pix;
                rect_x = begin_line_date.diff(begin_date, unit_str, true) * unit_pix;
            } else if (datainfo.begintime <= begin_date_str && end_date_str >= datainfo.endtime && datainfo.endtime >= begin_date_str) {
                //模式2 在前部
                rect_width = end_line_date.diff(begin_date, unit_str, true) * unit_pix;
                rect_x = 0;
            } else if (datainfo.begintime >= begin_date_str && datainfo.begintime <= end_date_str && datainfo.endtime >= end_date_str) {
                //模式3 在后部
                rect_width = timeLine.options.timeline_width;
                rect_x = begin_line_date.diff(begin_date, unit_str, true) * unit_pix;
            } else if (datainfo.begintime <= begin_date_str && datainfo.endtime >= end_date_str) {
                //模式4  全部包含
                rect_width = timeLine.options.timeline_width;
                rect_x = 0;
            } else {}

            var dataInfo = {
                isDraw: is_Draw,
                "rect_x": rect_x,
                "rect_width": rect_width,
                "rect_y": rect_y,
                "rect_height": rect_height,
                "dataindex": dataindex,
                "isGrayShow": isGrayShow
            };
            timeLine._draw_dataline(dataInfo);
        }
    },

    //根据数据信息绘制
    _draw_dataline: function (dataInfo) {

        var _canvas = timeLine._el.timecanvas;
        if (_canvas) {
            var context = _canvas.getContext('2d');
            //是否为灰阶段 false 为灰色
            if (dataInfo.isGrayShow === false) {
                context.fillStyle = timeLine.options.dataline_color_gray;
            } else {
                //若灰色选项为true 则使用两种颜色替换显示
                if (dataInfo.dataindex % 2 === 0) {
                    context.fillStyle = timeLine.options.dataline_color;
                } else {
                    context.fillStyle = timeLine.options.dataline_color_1;
                }
            }
            context.fillRect(dataInfo.rect_x, dataInfo.rect_y + 5, dataInfo.rect_width, dataInfo.rect_height - 1);
        }
    },

    //根据选择时间 获取当前绘制时次是否为选择的时次
    _getisSelectDate: function (select_moment, draw_moment) {},

    _getArcMode: function (compareDate) {
        var selectMode = timeLine.options.mode_list[timeLine.options.select_modeindex];
        var isBegin = false;
        switch (selectMode) {
            case "year":
                {
                    if (compareDate.month() === 0) {
                        isBegin = true;
                    }
                    break;
                }
            case "month":
                {
                    if (compareDate.date() === 1) {

                        isBegin = true;
                    }
                    break;
                }
            case "day":
                {
                    if (compareDate.hour() === 0) {
                        isBegin = true;
                    }
                    break;
                }
            case "hour":
                {
                    if (compareDate.minute() === 0) {
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
    },

    //根据当前设置的 模式 返回对应长度的 Str
    _getDateStr: function (moment) {
        var selectMode = this.options.select_modeindex;
        var modeName = this.options.mode_list[selectMode];
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
                    moment_Str = moment.format("YYYY-MM-DD HH:00");
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
    },

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
                    if (compareDate.date() % 10 === 1) {
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
    },

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
    },
    //canvas 画线
    _canvas_line: function (fillcolor, begin_point_x, begin_point_y, end_point_x, end_point_y) {

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
    },

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
    },
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
    },

    _canvas_txt: function (fillcolor, txtStr, begin_x, begin_y) {
        var _canvas = timeLine._el.timecanvas;
        if (_canvas) {
            var context = _canvas.getContext('2d');
            context.font = '16px Arial';
            context.fillStyle = fillcolor;
            context.fillText(txtStr, begin_x, begin_y);
        }
    },
    _resizeScreen: function () {
        timeLine.options.default_width = document.body.offsetWidth;
        timeLine.options.timeline_width = timeLine.options.default_width - timeLine.options.controller_width_sp;
        timeLine._fit_timeline();
        timeLine._switchMode();
        //timeLine._drag(0);
    },
    _fit_timeline: function () {
        var _canvas = timeLine._el.timecanvas;
        if (_canvas) {
            _canvas.width = this.options.timeline_width;
            var ctx = _canvas.getContext('2d');
            ctx.rect(0, 0, this.options.timeline_width, this.options.timeline_height);
            ctx.fillStyle = this.options.default_bg_color;
            ctx.fill();
        }
    },

    _draw_timeLine: function () {},

    _resetInputShow: function () {

        var Year_input = document.getElementById("txt_Year");
        Year_input.setAttribute("value", timeLine.options.moment_select.format("YYYY"));
        Year_input.innerHTML = timeLine.options.moment_select.format("YYYY");

        var Month_input = document.getElementById("txt_Month");
        Month_input.setAttribute("value", timeLine.options.moment_select.format("MM"));
        Month_input.innerHTML = timeLine.options.moment_select.format("MM");

        var Day_input = document.getElementById("txt_Day");
        Day_input.setAttribute("value", timeLine.options.moment_select.format("DD"));
        Day_input.innerHTML = timeLine.options.moment_select.format("DD");

        var Hour_input = document.getElementById("txt_Hour");
        Hour_input.setAttribute("value", timeLine.options.moment_select.format("HH"));
        Hour_input.innerHTML = timeLine.options.moment_select.format("HH");
    },

    setSelectMoment: function (newDate) {
        var old_moment = moment.utc(timeLine.options.moment_select.format("YYYYMMDDHHmmss"), "YYYYMMDDHHmmss");
        var isReset = false;
        if (newDate instanceof moment) {
            timeLine.options.moment_select = newDate;
            isReset = true;
        } else {
            if (newDate instanceof Date) {
                timeLine.options.moment_select = moment(newDate);
                isReset = true;
            } else {
                isReset = false;
            }
        }
        if (isReset) {
            var selectUnit = timeLine.options.mode_unit[timeLine.options.select_modeindex];
            var selectUnit_pix = timeLine.options.mode_timespan[timeLine.options.select_modeindex];
            var _trans = old_moment.diff(timeLine.options.moment_select, selectUnit, true) * selectUnit_pix;
            timeLine._resetInputShow();
            timeLine._drag(_trans);
        }
    },

    //对外接口 添加数据信息 

    addDataInfo: function (datainfolist) {
        if (datainfolist) {
            var _length = datainfolist.length;
            if (_length && _length > 0) {
                for (var i = 0; i < _length; i++) {
                    var addinfo = datainfolist[i];
                    var isin = false;
                    for (var t = 0; t < timeLine.datainfo.length; t++) {
                        var _datainfo = timeLine.datainfo[t];
                        if (!isin) {
                            if (_datainfo.name === addinfo.name) {
                                isin = true;
                                var dataConvert_t = timeLine._dataConvert(addinfo);
                                timeLine.datainfo[t] = dataConvert_t;
                            }
                        }
                    }
                    if (!isin) {
                        var dataConvert = timeLine._dataConvert(addinfo);
                        timeLine.datainfo.unshift(dataConvert);
                    }
                }
            }
        }
        timeLine._drag(0);
    },

    //移除数据
    removeDataInfo: function (datainfoName) {
        if (datainfoName) {
            var _length = timeLine.datainfo.length;
            for (var i = 0; i < _length; i++) {
                for (var t = 0; t < timeLine.datainfo.length; t++) {
                    var _datainfo = timeLine.datainfo[t];
                    if (_datainfo.name === datainfoName) {
                        timeLine.datainfo.splice(t, 1);
                    }
                }
            }
        }
        timeLine._drag(0);
    },

    //设置数据显示
    setDataInfoVislbility: function (datainfoName, isShow) {
        if (datainfoName) {
            var _length = timeLine.datainfo.length;
            for (var i = 0; i < _length; i++) {
                for (var t = 0; t < timeLine.datainfo.length; t++) {
                    var _datainfo = timeLine.datainfo[t];
                    if (_datainfo.name === datainfoName) {
                        timeLine.datainfo[t].isShow = isShow;
                    }
                }
            }
        }
        timeLine._drag(0);
    },

    //设置列表顺序
    setDataInfoListOrder: function (newOrderList) {
        if (newOrderList.length > 0) {
            var newOrderList_length = newOrderList.length;
            var _timeLinedatainfo = [];
            for (var i = 0; i < newOrderList_length; i++) {
                var _name = newOrderList[i];
                var isFind = false;
                if (_name) {
                    timeLine.datainfo.forEach(function (_dataitem) {
                        if (!isFind) {
                            if (_dataitem.name === _name) {
                                _timeLinedatainfo.push(_dataitem);
                                isFind = true;
                            }
                        }
                    });

                    //若没发现
                    if (!isFind) {
                        //使用空补位
                        _timeLinedatainfo.push({
                            name: _name,
                            isShow: true,
                            datainfolist: {
                                "month": [],
                                "day": [],
                                "hour": [],
                                "minute": []
                            }
                        });
                    }
                }
            }
            timeLine.datainfo = _timeLinedatainfo;
            timeLine._drag(0);
        }
    },

    _dataConvert: function (datainfo) {
        var DataInfoJson = {
            "month": [],
            "day": [],
            "hour": [],
            "minute": []
        };
        if (!datainfo.index) {
            datainfo.index = timeLine.datainfo.length;
        }
        //
        var YearModeList = [];
        var DayModeList = [];
        var MonthModeList = [];
        var _length = datainfo.datainfolist.length;
        for (var i = 0; i < _length; i++) {
            var beginTime = datainfo.datainfolist[i].begintime;
            var YearStr = beginTime.substr(0, 6);
            var MonthStr = beginTime.substr(0, 8);
            var DayStr = beginTime.substr(0, 10);
            if ($.inArray(YearStr, YearModeList) === -1) {
                YearModeList.push(YearStr);
            }
            if ($.inArray(MonthStr, MonthModeList) === -1) {
                MonthModeList.push(MonthStr);
            }
            if ($.inArray(DayStr, DayModeList) === -1) {
                DayModeList.push(DayStr);
            }

            DataInfoJson.minute.push(datainfo.datainfolist[i]);
        }

        //年处理
        YearModeList.forEach(function (yearBegin) {
            var BeginYear_MomentStr = moment.utc(yearBegin, "YYYYMM").format("YYYYMMDDHHmmss");
            var EndYear_MomentStr = moment.utc(yearBegin, "YYYYMM").add(1.0, 'month').format("YYYYMMDDHHmmss");
            DataInfoJson.month.push({
                "begintime": BeginYear_MomentStr,
                "endtime": EndYear_MomentStr
            });
        });
        //月处理
        MonthModeList.forEach(function (yearBegin) {
            var BeginMonth_MomentStr = moment.utc(yearBegin, "YYYYMMDD").format("YYYYMMDDHHmmss");
            var EndMonth_MomentStr = moment.utc(yearBegin, "YYYYMMDD").add(1.0, 'day').format("YYYYMMDDHHmmss");
            DataInfoJson.day.push({
                "begintime": BeginMonth_MomentStr,
                "endtime": EndMonth_MomentStr
            });
        });
        //日处理
        DayModeList.forEach(function (yearBegin) {
            var BeginDay_MomentStr = moment.utc(yearBegin, "YYYYMMDDHH").format("YYYYMMDDHHmmss");
            var EndDay_MomentStr = moment.utc(yearBegin, "YYYYMMDDHH").add(1.0, 'day').format("YYYYMMDDHHmmss");
            DataInfoJson.hour.push({
                "begintime": BeginDay_MomentStr,
                "endtime": EndDay_MomentStr
            });
        });
        datainfo.datainfolist = DataInfoJson;
        datainfo.isShow = true;
        return datainfo;
    }

};

//# sourceMappingURL=timeLine-compiled.js.map