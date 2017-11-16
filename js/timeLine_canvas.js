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
            select_date: moment.utc(),
            //动画控制部分
            //是否拖拽
            is_drag: false,
            //开始拖拽x
            begin_X: 0,
            end_X: 0
        };
        //初始化全部显示
        this.init_container();
        //
        window.onresize = this._resizeScreen;

    },


    init_container: function () {
        console.log(this._el);
        //获取 宽高
        this._resizeScreen();
        this.init_beginTime();
        this.init_controller();
        this.init_timeline();


    },
    //初始化时间轴
    init_controller: function () {
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

    },
    //初始化时间轴
    init_timeline: function () {
        console.log('init_timeline');
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

        timeLine._drag(0);
    },

    _draw_bg: function () {
        var _canvas = this._el.timecanvas;
        if (_canvas) {
            var ctx = _canvas.getContext('2d');
            ctx.rect(0, 0, timeLine.options.timeline_width, timeLine.options.timeline_height);
            ctx.fillStyle = timeLine.options.default_bg_color;
            ctx.fill();
        }
    },
    //开始移动
    startMove: function (event) {
        event.preventDefault();
        timeLine.options.is_drag = true;
        timeLine.options.begin_X = event.offsetX;
    },

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

        }
    },

    // 结束位移
    endMove: function () {
        if (timeLine.options.is_drag) {
            //是否正在拖动
            timeLine.options.is_drag = false;
            timeLine.options.end_X = event.offsetX;
            var drag_pix = timeLine.options.end_X - timeLine.options.begin_X;

            console.log(drag_pix);
            //根据阈值进行赋值
            if (drag_pix > 5 || drag_pix < -5) {
                timeLine._drag(drag_pix);
                timeLine.options.begin_X = timeLine.options.end_X;
            }
        }

    },

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
        var moment_begin = moment.utc(this.options.select_date.format("YYYY-MM-DD HH:mm:ss"), "YYYY-MM-DD HH:mm:ss");

        timeLine.options.moment_begin = moment_begin.add(unitNum_before, selectmodeunit);

        var moment_end = moment.utc(this.options.select_date.format("YYYY-MM-DD HH:mm:ss"), "YYYY-MM-DD HH:mm:ss");

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

        //基于当前时间计算
        timeLine._getTimeSpace(trans);
        var moment_begin = timeLine.options.moment_begin;
        var moment_end = timeLine.options.moment_end;
        timeLine._draw_bg();

        var selectMode = this.options.select_modeindex;
        //在当前模式下，选择精确到的 单位
        var selectmodeunit = this.options.mode_unit  [selectMode];
        var selectmode_pix = this.options.mode_timespan  [selectMode];
        //  this._draw_year(moment_begin, moment_end, this.options.select_date, "month", 12.5);
        timeLine._draw_timeline(moment_begin, moment_end, this.options.select_date, selectmodeunit, selectmode_pix);

    },

    //根据开始结束时间 绘制时间轴
    _draw_timeline: function (begin_date, end_date, select_date, unit_str, unit_pix) {



        //绘制横线
        timeLine._canvas_line("white", 0, timeLine.options.timeline_height_top, timeLine.options.timeline_width, timeLine.options.timeline_height_top);
        //绘制年间隔
        //   timeLine._canvas_arc('white', 10, 55, 7);

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
    },

    //根据选择时间 获取当前绘制时次是否为选择的时次
    _getisSelectDate: function (select_moment, draw_moment) {

    },
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
    },


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
    },
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
    },

    _draw_timeLine: function () {

    }


};




