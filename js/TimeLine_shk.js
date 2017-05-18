/**
 * Created by liuyp on 2016/10/24.
 */
function TimeLine() {

    var self = this;

    /**
     * 当前选择日期 精确到时分秒
     * @type {Date}
     */
    this.DateShow = new Date();
    var Year_Show = 2016;
    var Month_Show = 1;
    var Day_Show = 1;
    var Hour_Show = 0;
    var Minute_Show = 0;

    /**
     * 整体显示 -- 当前浏览器类型
     * @type {string}
     */
    this.browserType = "";

    /**
     *整体显示 -- 目标div ID
     * @type {string}
     */
    this.IDName = '';

    /**
     * 显示模式  默认使用月模式
     * Year_Mode Month_Mode Day_Mode Minute_Mode
     * @type {string}
     */
    this.ShowMode = "Month_Mode";

    /**
     * 当前显示模式 是都显示TimeLineSVG
     * true 显示时间轴
     * false 显示时间轴
     * @type {boolean}
     */
    this.Is_ShowSVGLine = true;

    /* 分钟模式  鼠标 操作 变量*/
    var isMove_Minute = false;
    var x_Minute;
    var X_Before_Minute = 0;
    var m_Trans_Minute = -150;
    //分钟模式下 初始化显示日期
    var MinuteBegin_Date = new Date(moment.utc().add(-6, "hours").format("YYYY-MM-DD HH").toString() + ":00:00");


    /* 日模式 鼠标 操作 变量*/
    var isMove_Day = false;
    var x_Day;
    var X_Before_Day = 0;
    var m_Trans_Day = -387.5;
    //日模式下显示初始化左侧显示日期
    var DayBegin_Date = new Date();

    /* 月模式 鼠标 操作 变量*/
    var isMove_Month = false;
    var x_Month = 0;
    var X_Before_Month = 0;
    var m_Trans_Month = -150;
    var MonthBegin_Date = new Date(2009, 0, 1);

    /* 年模式 鼠标 操作 变量*/
    var m_Trans_Year = 50;
    var isMove_Year = false;
    var x_Year = 0;
    var X_Before_Year = 0;

    var YearShowCount = 8;
    var MonthShowCount = 12;
    var DayShowCount = 5;
    var MinutesShowCount = 11;

    /*数据图层变量*/
    /**
     * 当前图层列表
     * @type {Array}
     */

    var m_DataInfoALL = [];
    //基本数据
    var m_LayerDataList = [];
    var m_LayerShowTypeList = [];
    //分级数据
    var m_YearModeData = [];
    var m_MonthModeData = [];
    var m_DayModeData = [];
    var m_MinuteModeData = [];

    /** 对外接口 */

    /**
     * 供外部调用的初始化函数
     * @param DIVid
     * @param m_InitMode
     * @constructor
     */
    this.Init = function (DIVid, m_InitMode) {
        //获取当前浏览器类型
        self.browserType = setModeIE();
        //用DIVid 赋值
        self.IDName = DIVid;
        //对初始化的类型赋值
        switch (m_InitMode) {
            case "YEAR":
            {
                self.ShowMode = "Year_Mode";
                break;
            }
            case "MONTH":
            {
                self.ShowMode = "Month_Mode";
                break;
            }
            case "DAY":
            {
                self.ShowMode = "Day_Mode";
                break;
            }
            case "MINUTE":
            {
                self.ShowMode = "Minute_Mode";
                break;
            }
            default:
            {
                self.ShowMode = "Day_Mode";
                //默认使用天显示 模式
                break;

            }

        }
        InitShow();
        InitDateClickFunc();
    };

    /**
     * SVG title 显示内容初始化
     * @param event
     * @constructor
     */
    this.LoadTitleHander = function (event) {
        new Title(event.getTarget().getOwnerDocument(), 12);
    };

    /**
     * 对外接口
     * 获取当前时间
     * @returns {*}
     * @constructor
     */
    this.GetShowDate = function () {
        return self.DateShow;
    };

    /**
     * 对外接口
     * 获取当前时间
     * @param newDate
     * @returns {boolean}
     * @constructor
     */
    this.SetShowDate = function (newDate) {
        if (newDate instanceof Date) {
            self.DateShow = new Date(moment.utc(newDate));
            RefreshTimeShow();
            return true;
        } else {
            return false;
        }
    };

    /**
     * 数值修改触发函数 外部重写此函数 获取修改事件
     * @constructor
     */
    this.DateTimeChange = function () {
        $("#" + self.IDName).trigger("DateTimeChange", [self.DateShow]);
    };

    /**  内部函数  */

    /**
     * 整体显示 --属性新当前显示
     * @constructor
     */
    var RefreshTimeShow = function () {
        //根据当前选择时间获取 年月日
        Year_Show = self.DateShow.getUTCFullYear();
        Month_Show = self.DateShow.getMonth() + 1;
        Day_Show = self.DateShow.getDate();
        Hour_Show = self.DateShow.getHours();
        Minute_Show = self.DateShow.getMinutes();
        //年月日赋值显示
        document.getElementById('txt_Year').value = Year_Show.toString();
        document.getElementById('txt_Month').value = Month_Show.toString();
        document.getElementById('txt_Day').value = Day_Show.toString();
        //调用数据修改函数 ，触发外部func
        self.DateTimeChange();
        //根据模式重绘
        switch (self.ShowMode) {
            case "Year_Mode":
            {
                Year_SVGMove(0);
                break;
            }
            case "Month_Mode":
            {
                Month_SvgMove(0);
                break;
            }
            case "Day_Mode":
            {
                Day_SVGMove(0);
                break;
            }
            case "Minute_Mode":
            {
                Minute_SVGMove(0);
                break;
            }
            default:
                break;
        }
    };

    /**
     * 添加一天
     * @constructor
     */
    var AddDay = function () {
        //DateShow 添加一天
        self.DateShow = new Date(moment(self.DateShow).add(1, 'day'));
        //重设位移值 年位移位置
        self.m_Trans = ( self.m_TransYear - moment(self.DateShow).year() + 5 ) * 150;

        //天模式
        m_Trans_Day = m_Trans_Day - 12.5;
        //分钟位移位置
        m_Trans_Minute = m_Trans_Minute - 3600;
        RefreshTimeShow();
    };

    /**
     * 添加一个月
     * @constructor
     */
    var AddMonth = function () {
        var momentStr = (  moment(self.DateShow).add(1, 'month') - moment(self.DateShow)) / 1000 / 3600 / 24;
        self.DateShow = new Date(moment(self.DateShow).add(1, 'month'));
        self.m_Trans = ( self.m_TransYear - moment(self.DateShow).year() + 5 ) * 150;
        m_Trans_Minute = m_Trans_Minute - 3600 * momentStr;
        //天模式
        m_Trans_Day = m_Trans_Day - 12.5 * momentStr;
        RefreshTimeShow();
    };

    /**
     * 添加一年
     * @constructor
     */
    var AddYear = function () {
        var momentStr = (moment(self.DateShow).add(1, 'year') - moment(self.DateShow)) / 1000 / 3600 / 24;

        //分钟模式 位移
        m_Trans_Minute = m_Trans_Minute - momentStr * 3600;
        //天模式
        m_Trans_Day = m_Trans_Day - 12.5 * momentStr;
        //月位移 todo

        //年位移
        self.m_Trans = ( self.m_TransYear - moment(self.DateShow).year() + 5 ) * 150;
        self.DateShow = new Date(moment(self.DateShow).add(1, 'year'));
        RefreshTimeShow();
    };

    /**
     * 减一天
     * @constructor
     */
    var MinusDay = function () {
        self.DateShow = new Date(moment(self.DateShow).add(-1, 'day'));
        //分钟模式
        m_Trans_Minute = m_Trans_Minute + 3600;
        //天模式
        m_Trans_Day = m_Trans_Day + 12.5;
        RefreshTimeShow();
    };

    /**
     * 减一个月
     * @constructor
     */
    var MinusMonth = function () {
        var momentStr = (moment(self.DateShow) - moment(self.DateShow).add(-1, 'month')) / 1000 / 3600 / 24;
        self.DateShow = new Date(moment(self.DateShow).add(-1, 'month'));
        m_Trans_Minute = m_Trans_Minute + 3600 * momentStr;
        //天模式
        m_Trans_Day = m_Trans_Day + 12.5 * momentStr;
        RefreshTimeShow();
    };

    /**
     * 减一年
     * @constructor
     */
    var MinusYear = function () {
        //年份 的天
        var momentStr = (moment(self.DateShow) - moment(self.DateShow).add(-1, 'year')) / 1000 / 3600 / 24;

        self.DateShow = new Date(moment.utc(self.DateShow).add(-1, 'year'));

        //分钟模式
        m_Trans_Minute = m_Trans_Minute + momentStr * 3600;
        //天模式
        m_Trans_Day = m_Trans_Day + 12.5 * momentStr;
        RefreshTimeShow();
    };

    /**
     * 初始化界面显示
     * @param DIVid
     * @param m_InitMode
     * @constructor
     */
    var InitShow = function () {
        var m_ID = self.IDName;
        //左侧时间选择
        var ShowAll =
            ' <div class="TimeInputDiv">'
            + '<div id="YearInputDiv">'
            + '<input type="button" class="UpButton" id="btn_AddYear"></input>'
            + '<input class="TimeInput" id="txt_Year" type="text" readOnly="true"> </input>'
            + '<input type="button" class="DownButton" id="btn_MinusYear"></input>'
            + '</div>'
            + '<div id="MonthInputDiv">'
            + '<button class="UpButton" id="btn_AddMonth"></button>'
            + '<input class="MonthInput" id="txt_Month" type="text" readOnly="true">  </input>'
            + '<button class="DownButton" id="btn_MinusMonth"></button>'
            + '</div>'
            + '<div id="DayInputDiv">'
            + '<button class="UpButton" id="btn_AddDay"></button>'
            + '<input class="MonthInput" id="txt_Day" type="text"  readOnly="true"> </input>'
            + '<button class="DownButton" id="btn_MinusDay"></button>'
            + '</div>'
            + '<div id="BeforeDiv">'
            + '<button class="BeforeButton" id="btn_BeforeTime"></button>'
            + '</div>'
            + '<div id="AfterDiv">'
            + '<button class="AfterButton" id="btn_AfterTime"></button>'
            + '</div>'
            + '</div>'
            + '<div class="TimeLineTotalDiv" id="ShowTimeLine">'
            + '<div class="TimeLineDiv" id="Show_YearDiv">'
            + '<!--时间轴部分-->'
            + '<div class="TimeLineDiv_Inside" id="ShowTimeLineDiv_Year">'
            + '<div class="SVGDiv_Inside">'
            + '<svg class="svg_ALL" height="99" id="SVG_Year_Total" xmlns="http://www.w3.org/2000/svg">'
            + '</svg>'
            + '</div>'
            + '</div>'
            + '<!--模式选择部分-->'
            + '<div class="TimeMode_Inner" id=" TimeModeDiv YearMode_Div">'
            + '<div class="SmallFillDiv "></div>'
            + '<div class="BigShowDiv    btn_ShowYear">Years</div>'
            + '<div class="MedShowDiv    btn_ShowMonth">Months</div>'
            + '<div class="SmallShowDiv  btn_ShowDay">Days</div>'
            + '<div class="SmallShowDiv  btn_ShowMinute">Minutes</div>'
            + '<div class="SmallFillDiv "></div>'
            + '</div>'
            + '</div>'
            + '<div class="TimeLineDiv" id="Show_MonthDiv" style="display: none">'
            + '<!--  月时间轴部分-->'
            + '<div class="TimeLineDiv_Inside" id="ShowTimeLineDiv_Month">'
            + '<svg class="svg_ALL" height="100" id="SVG_Total" xmlns="http://www.w3.org/2000/svg">'
            + '<g id="ShowSVG" transform="translate(0,6)" class="x aixs"></g>'
            + '</svg>'
            + '</div>'
            + '<!--  月时间轴选择部分 -->'
            + '<div id="MonthMode_Div" class=" TimeModeDiv TimeMode_Inner">'
            + '<div class="SmallFillDiv  "></div>'
            + '<div class="SmallShowDiv  btn_ShowYear">Years</div>'
            + '<div class="BigShowDiv    btn_ShowMonth">Months</div>'
            + '<div class="SmallShowDiv  btn_ShowDay">Days</div>'
            + '<div class="SmallShowDiv  btn_ShowMinute">Minutes</div>'
            + '<div class="SmallFillDiv "></div>'
            + '</div>'
            + '</div>'
            + '<div class="TimeLineDiv" id="Show_DayDiv" style="display: none">'
            + '<div class="TimeLineDiv_Inside" id="ShowTimeLineDiv_Day">'
            + '<svg class="svg_ALL" height="100" id="SVG_Day_Total" xmlns="http://www.w3.org/2000/svg">'
            + '<g id="ShowSVG_Day" transform="translate(0,6)" class="x aixs ">'
            + '</g>'
            + '</svg>'
            + '</div>'
            + '<div class=" TimeModeDiv TimeMode_Inner" id="DayMode_Div">'
            + '<div class="SmallFillDiv "></div>'
            + '<div class="SmallShowDiv  btn_ShowYear ">Years</div>'
            + '<div class="MedShowDiv    btn_ShowMonth">Months</div>'
            + '<div class="BigShowDiv    btn_ShowDay  ">Days</div>'
            + '<div class="SmallShowDiv  btn_ShowMinute">Minutes</div>'
            + '<div class="SmallFillDiv "></div>'
            + '</div>'
            + '</div>'
            + '<div class="TimeLineDiv" id="Show_MinuteDiv" style="display: none">'
            + '<div class="TimeLineDiv_Inside" id="ShowTimeLineDiv_Minute">'
            + '<svg class="svg_ALL" height="100" id="SVG_Minute_Total" xmlns="http://www.w3.org/2000/svg">'
            + '<g id="ShowSVG_Minute" transform="translate(0,6)" class="x aixs ">'
            + '</g>'
            + '</svg>'
            + '</div>'
            + '<div class=" TimeModeDiv TimeMode_Inner" id="MinuteMode_Div">'
            + '<div class="SmallFillDiv "></div>'
            + '<div class="SmallShowDiv  btn_ShowYear ">Years</div>'
            + '<div class="SmallShowDiv    btn_ShowMonth">Months</div>'
            + '<div class="MedShowDiv    btn_ShowDay  ">Days</div>'
            + '<div class="BigShowDiv  btn_ShowMinute">Minutes</div>'
            + '<div class="SmallFillDiv "></div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="ShowHidebtnDiv" id="ShowHidebtn">'
            + '</div>';

        var m_ShowDiv = document.getElementById(m_ID);
        //初始化
        m_ShowDiv.innerHTML = ShowAll;

        try {
            m_ShowDiv.style.position = "fixed";
            m_ShowDiv.style.bottom = 0;
            m_ShowDiv.style.left = 0;
        } catch (err) {
        }
        //根据窗口设置宽度
        GetFullModeWidth(m_ID);
    };

    /**
     * 初始化显示左侧年月日 并初始化赋值点击事件
     * @constructor
     */
    var InitDateClickFunc = function () {
        //初始化时间
        self.DateShow = new Date();
        Year_Show = self.DateShow.getUTCFullYear();
        Month_Show = self.DateShow.getUTCMonth() + 1;
        Day_Show = self.DateShow.getUTCDate();
        Hour_Show = self.DateShow.getUTCHours();
        Minute_Show = self.DateShow.getUTCMinutes();

        /*初始化点击事件*/
        //年月日 加一 函数赋值
        var m_btn_AddYear = document.getElementById("btn_AddYear");
        m_btn_AddYear.onclick = AddYear;
        var btn_AddMonth = document.getElementById("btn_AddMonth");
        btn_AddMonth.onclick = AddMonth;
        var btn_AddDay = document.getElementById("btn_AddDay");
        btn_AddDay.onclick = AddDay;

        //年月日 减一 函数赋值
        var btn_MinusYear = document.getElementById("btn_MinusYear");
        btn_MinusYear.onclick = MinusYear;
        var btn_MinusMonth = document.getElementById("btn_MinusMonth");
        btn_MinusMonth.onclick = MinusMonth;
        var btn_MinusDay = document.getElementById("btn_MinusDay");
        btn_MinusDay.onclick = MinusDay;

        //初始化设置时间选择值 重新 赋值
        document.getElementById('txt_Year').value = Year_Show.toString();
        document.getElementById('txt_Month').value = Month_Show.toString();
        document.getElementById('txt_Day').value = Day_Show.toString();

        //设置 年TimeLine 滚动事件
        var m_ShowTimeLineDiv_Year = document.getElementById("ShowTimeLineDiv_Year");
        m_ShowTimeLineDiv_Year.onmousedown = GetMouseDown_Year;
        m_ShowTimeLineDiv_Year.onmouseup = GetMouseUP_Year;
        m_ShowTimeLineDiv_Year.onmouseout = GetMouseOut_Year;
        m_ShowTimeLineDiv_Year.onmousemove = MouseMove_Year;

        //设置 月TimeLine 滚动事件
        var m_ShowTimeLineDiv_Month = document.getElementById("ShowTimeLineDiv_Month");
        m_ShowTimeLineDiv_Month.onmousedown = GetMouseDown_Month;
        m_ShowTimeLineDiv_Month.onmouseup = GetMouseUP_Month;
        m_ShowTimeLineDiv_Month.onmouseout = GetMouseOut_Month;
        m_ShowTimeLineDiv_Month.onmousemove = MouseMove_Month;

        //设置 日TimeLine 滚动事件
        var m_ShowTimeLineDiv_Day = document.getElementById("ShowTimeLineDiv_Day");
        m_ShowTimeLineDiv_Day.onmousedown = GetMouseDown_Day;
        m_ShowTimeLineDiv_Day.onmouseup = GetMouseUP_Day;
        m_ShowTimeLineDiv_Day.onmouseout = GetMouseOut_Day;
        m_ShowTimeLineDiv_Day.onmousemove = MouseMove_Day;

        //设置 分钟 TimeLine 滚动事件
        var m_ShowTimeLineDiv_Minute = document.getElementById("ShowTimeLineDiv_Minute");
        m_ShowTimeLineDiv_Minute.onmousedown = GetMouseDown_Minute;
        m_ShowTimeLineDiv_Minute.onmouseup = GetMouseUP_Minute;
        m_ShowTimeLineDiv_Minute.onmouseout = GetMouseOut_Minute;
        m_ShowTimeLineDiv_Minute.onmousemove = MouseMove_Minute;

        //设置点击事件
        var m_btn_ShowYear = document.getElementsByClassName('btn_ShowYear');
        for (var i = 0; i < m_btn_ShowYear.length; i++) {
            m_btn_ShowYear[i].onclick = ShowYearMode;
        }

        var m_btn_ShowMonth = document.getElementsByClassName('btn_ShowMonth');
        for (var k = 0; k < m_btn_ShowMonth.length; k++) {
            m_btn_ShowMonth[k].onclick = ShowMonthMode;
        }

        var m_btn_ShowDay = document.getElementsByClassName('btn_ShowDay');
        for (var j = 0; j < m_btn_ShowDay.length; j++) {
            m_btn_ShowDay[j].onclick = ShowDayMode;
        }

        var m_btn_ShowMinute = document.getElementsByClassName('btn_ShowMinute');
        for (var w = 0; w < m_btn_ShowMinute.length; w++) {
            m_btn_ShowMinute[w].onclick = ShowMinuteMode;
        }

        //设置左右点击事件
        //向左减一天
        var btn_MinusDay_Left = document.getElementById("btn_BeforeTime");
        btn_MinusDay_Left.onclick = MinusDay;
        //向右加一天
        var btn_AddDay_Right = document.getElementById("btn_AfterTime");
        btn_AddDay_Right.onclick = AddDay;

        //伸缩点击事件
        var m_btn_ShowTimeLine = document.getElementById('ShowHidebtn');
        m_btn_ShowTimeLine.onclick = ClickShowAndHide;
        //调用初始化函数
        InitTimeLineShow();
    };

    /**
     * 界面重绘 重新计算样式
     */
    $(window).resize(function () {
        //判断当前显示模式 是否显示了时间轴
        if (self.Is_ShowSVGLine) {
            //若为全屏模式 则重新计算时间轴 及总控件宽度
            GetFullModeWidth(self.IDName);
        }
    });

    /**
     * 获取当前用于显示的浏览器类型
     * @returns {*}
     */
    var setModeIE = function () {
        var explorer = window.navigator.userAgent;
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            return "MSIE";
        }
        if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
            return "Firefox";
        }
        if (explorer.indexOf("Chrome") >= 0) {
            return "Chrome";
        }
        if (isSafari = navigator.userAgent.indexOf("Safari") > 0) {
            return "Safari";
        }
        if (isCamino = navigator.userAgent.indexOf("Camino") > 0) {
            return "Camino";
        }
        if (isMozilla = navigator.userAgent.indexOf("Gecko/") > 0) {
            return "Gecko";
        }
        if (explorer.indexOf("Opera") >= 0) {
            return "Opera";
        }
        return "unknown";
    };

    /**
     * 根据界面设置宽度
     * @param DIVid
     * @constructor
     */
    var GetFullModeWidth = function () {
        var m_browserType = self.browserType;
        var m_DIVID = self.IDName;
        if (m_DIVID == '') {
            return;
        }

        var m_ClassADD = document.getElementById(m_DIVID);
        var TimeLineTotalDIV = document.getElementById("ShowTimeLine");
        var TimeLineList = document.getElementsByClassName("svg_ALL");
        var Total_Witdh = 0;
        //chrome 浏览器
        if (m_browserType == "Chrome") {
            // 总宽度
            var TotalWidth = (document.documentElement.scrollWidth > document.documentElement.clientWidth) ? document.documentElement.scrollWidth : document.documentElement.scrollWidth;
            Total_Witdh = TotalWidth;
            //设置整体控件宽度
            if (TotalWidth > 380) {
                document.getElementById(m_DIVID).style.width = TotalWidth;
            } else {
                document.getElementById(m_DIVID).style.width = 380;
            }

            //右侧SVGTimeLine高度
            var SVGWitdh;
            SVGWitdh = TotalWidth - 490;
            //设置TimeLine宽度
            TimeLineTotalDIV.style.width = TotalWidth - 360;

            //SVG列表 设置宽度
            for (var j = 0; j < TimeLineList.length; j++) {
                TimeLineList[j].style.width = SVGWitdh;
            }
        }
        //火狐样式
        if (m_browserType == "Firefox") {
            // 总宽度
            var TotalWidth_fireFox = document.documentElement.clientWidth - 20;
            Total_Witdh = TotalWidth_fireFox;
            //设置TimeLine DIV宽度
            if (TotalWidth_fireFox > 360) {
                m_ClassADD.style.width = TotalWidth_fireFox + "px";
            } else {
                m_ClassADD.style.width = 360 + "px";
            }
            //SVG列表 设置宽度
            var SVGWitdh_fireFox = TotalWidth_fireFox - 490;
            for (var k = 0; k < TimeLineList.length; k++) {
                TimeLineList[k].style.width = SVGWitdh_fireFox + "px";
            }
            //右侧SVGTimeLine宽度
            TimeLineTotalDIV.style.width = (TotalWidth_fireFox - 360) + "px";
        }

        //IE样式
        if (m_browserType == "MSIE") {
            // 总宽度
            var TotalWidth_MSIE = document.documentElement.clientWidth - 20;
            Total_Witdh = TotalWidth_MSIE;
            //设置TimeLine DIV宽度
            if (TotalWidth_MSIE > 360) {
                m_ClassADD.style.width = TotalWidth_MSIE + "px";
            } else {
                m_ClassADD.style.width = 360 + "px";
            }
            //SVG列表 设置宽度
            var SVGWitdh_MSIE = TotalWidth_MSIE - 490;
            for (var t = 0; t < TimeLineList.length; t++) {
                TimeLineList[t].style.width = SVGWitdh_MSIE + "px";
            }
            //右侧SVGTimeLine宽度
            TimeLineTotalDIV.style.width = (TotalWidth_MSIE - 360) + "px";
        }

        //495
        var ShowTimeLine = document.getElementsByClassName("TimeLineTotalDiv");
        if (Total_Witdh < 495) {
            for (var i = 0; i < ShowTimeLine.length; i++) {
                ShowTimeLine[i].style.display = "none";
            }
            self.Is_ShowSVGLine = false;
        }
        else {
            //var ShowTimeLine = document.getElementsByClassName("TimeLineTotalDiv");
            for (var t1 = 0; t1 < ShowTimeLine.length; t1++) {
                ShowTimeLine[t1].style.display = "block";
            }
            self.Is_ShowSVGLine = true;
        }
        //根据新长度计算当前显示宽度值
        if (Total_Witdh != 0 && Total_Witdh > 0) {
            // console.log("屏幕总宽度：" + Total_Witdh);
            var CountWidth = Total_Witdh - 300 - 150;
            //年的 10年 一年25
            YearShowCount = Math.ceil(CountWidth / 10 / 25) + 1;
            //月 一年 12个月 一个月12.5
            MonthShowCount = Math.ceil(CountWidth / 12.5 / 12) + 2;
            //day 一个月 29天
            DayShowCount = Math.ceil(CountWidth / 29 / 12.5) + 1;
            //分钟 一小时  12个 5分钟 1个12.5
            MinutesShowCount = Math.ceil(CountWidth / 12 / 12.5) + 1;
            //console.log(YearShowCount + ":" + MonthShowCount + ":" + DayShowCount + ":" + MinutesShowCount);
        }
    };

    /**
     * 初始化 显示TimeLine div
     * @constructor
     */
    var InitTimeLineShow = function () {
        switch (self.ShowMode) {
            case "Year_Mode":
            {
                Year_SVGMove(0);
                ShowYearMode();
                break;
            }
            case "Month_Mode":
            {
                InitMonthTimeLineShow(2009);
                ShowMonthMode();
                break;
            }
            case "Day_Mode":
            {
                Day_SVGMove(0);
                ShowDayMode();
                break;
            }
            case "Minute_Mode":
            {

                Minute_SVGMove(0);
                ShowMinuteMode();
                break;
            }
            default:
            {
                break;
            }
        }
    };

    /**
     * 设置年
     * @param Year
     * @returns {boolean}
     * @constructor
     */
    var SetShowYear = function (Year) {
        if (parseInt(Year) != NaN) {
            Year_Show = parseInt(Year).toString();
            self.DateShow = new Date(Year_Show, Month_Show - 1, Day_Show, Hour_Show, Minute_Show, 0);
            RefreshTimeShow();
            return true;
        } else {
            return false;
        }
    };

    /**
     * 设置年月  函数
     * @param enevt
     * @returns {boolean}
     * @constructor
     */
    var SetShowMonth = function (enevt) {
        var TimeStr = enevt.getAttribute("value");
        var new_Year = TimeStr.split("-")[0];
        var new_Month = TimeStr.split("-")[1];
        if (parseInt(new_Year) != NaN) {
            Year_Show = parseInt(new_Year).toString();
            Month_Show = parseInt(new_Month).toString();
            //设置年月日
            self.DateShow = new Date(Year_Show, Month_Show - 1, Day_Show, Hour_Show, Minute_Show, 0);
            RefreshTimeShow();
            return true;
        } else {
            return false;
        }
    };

    /**
     * 获取分钟鼠标 down事件
     * @param event
     * @constructor
     */
    var GetMouseDown_Minute = function (event) {
        isMove_Minute = true;
        x_Minute = event.clientX;
        X_Before_Minute = x_Minute;
    };

    /**
     * 获取分钟鼠标 UP事件
     * @param event
     * @constructor
     */
    var GetMouseUP_Minute = function (event) {
        isMove_Minute = false;
    };

    /**
     * 获取分钟鼠标 移出事件
     * @constructor
     */
    var GetMouseOut_Minute = function () {
        //若非火狐 则移动
        if (self.browserType != "Firefox") {
            isMove_Minute = false;
        }
    };

    /**
     * 分钟模式 -- 鼠标拖动位移
     * @param event
     * @constructor
     */
    var MouseMove_Minute = function (event) {
        //计算拖动位移
        if (isMove_Minute) {
            x_Minute = event.clientX;
            var DrgNum = X_Before_Minute - x_Minute;
            if (DrgNum >= 1 || DrgNum <= -1) {
                X_Before_Minute = x_Minute;
                Minute_SVGMove(DrgNum);
            }
        }
    };

    /**
     * 分钟模式 -- 设置点击事件
     * @constructor
     */
    var Minute_ClickFucn = function () {
        //分钟点击事件
        var m_Btn_MinuteRectList = document.getElementsByClassName('Btn_MinuteRect');
        for (var t = 0; t < m_Btn_MinuteRectList.length; t++) {
            m_Btn_MinuteRectList[t].onclick = function () {
                MinuteRectOnClick(this);
            };
        }
    };

    /**
     * 分钟模式 -- 鼠标拖动等事件中 重绘界面 移动界面
     * 向前为正 ，向后为负
     * @param trans
     * @constructor
     */
    var Minute_SVGMove = function (trans) {

        //用于整体显示的SVG InnerHTML
        var SVG_Show = '';

        //全局变量 修改
        m_Trans_Minute = m_Trans_Minute - trans;

        //向后拖动
        while (m_Trans_Minute > 0) {
            m_Trans_Minute = m_Trans_Minute - 12 * 12.5;
            //减一个小时
            MinuteBegin_Date.setHours(MinuteBegin_Date.getHours() - 1);
        }
        //向前拖动
        while (m_Trans_Minute < -150) {
            m_Trans_Minute = m_Trans_Minute + 12 * 12.5;
            //加1小时
            MinuteBegin_Date.setHours(MinuteBegin_Date.getHours() + 1);
        }
        //每个月的位移 初始化位0
        var Month_Trans = m_Trans_Minute;
        //初始时间为2016年1月 当前月
        var CountDate = MinuteBegin_Date;
        //当前选择日期 str
        var DateShowNowStr = moment(self.DateShow).utc().format('YYYY-MM-DD HH:mm');
        //小时份循环

        var is_GutiarFlag = false;
        //小时开始 绘制 21个小时
        for (var i = 0; i < MinutesShowCount; i++) {
            //时间 指针 （当前显示时间）
            var TimeGar = '';

            var SVG_Hour = '<g class="tick_Total_Year" transform="translate(' + Month_Trans + ')">' +
                '<line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>';
            var HourNow = new Date(moment(CountDate).format("YYYY-MM-DD HH:mm"));
            //每一个小时 中 5min循环    一小时12
            for (var j = 0; j < 12; j++) {
                //每一个小时中 每5min的位移
                var Minute_Trans = (j * 12.5).toString();
                //根据时间计算当前块显示 DATE YYYY-MM-dd
                var DayTimeStr = moment(HourNow).utc().format('YYYY-MM-DD HH:mm');
                //根据时间加载数据 svg
                var Data_SVG = GetMinuteMode_DataShowList(DayTimeStr, Minute_Trans);

                //根据动画模式 设置是否需要显示动画模块 V1.1 20170321
                var Trans_SVG = GetMinuteMode_AnimeDateList(DayTimeStr, Minute_Trans);

                //  若非动画模式 则按照原有选择时间进行处理
                if ((!self.AnimeMode) && (!is_GutiarFlag)) {
                    // 是否为当前显示 时分秒
                    var item = HourNow - self.DateShow;
                    //若指针时间在范围内 显示指针
                    if (300000 > item && item >= 0 && TimeGar == '') {
                        is_GutiarFlag = true;
                        TimeGar = '<g id="guitarpick" class="SVG_guitarpick" '
                            + ' transform="translate(' + (Minute_Trans - 8) + ',-10)">'
                            + '<title>' + DateShowNowStr + '</title>'
                            + '<path d="'
                            + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                            + '"></path>'
                            + '<rect width="3" height="20" x="9" y="11" ></rect>'
                            + '<rect width="3" height="20" x="14" y="11" ></rect>'
                            + '<rect width="3" height="20" x="19" y="11" ></rect>'
                            + '</g>';
                    }
                }


                //若为动画模式 对 TimeGar 重新赋值
                if (self.AnimeMode == true && (!is_GutiarFlag)) {
                    TimeGar = "";
                    var Amineitem = moment(HourNow) - self.AnimeDate;
                    if (300000 > Amineitem && Amineitem >= 0 && TimeGar == "") {
                        console.log("get!");
                        is_GutiarFlag = true;
                        TimeGar = '<g id="guitarpick" class="SVG_Anime_guitarpick" '
                            + ' transform="translate(' + (Minute_Trans - 8) + ',-10)">'
                            + '<title>' + DateShowNowStr + '</title>'
                            + '<path d="'
                            + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                            + '"></path>'
                            + '<rect width="3" height="20" x="9" y="11" ></rect>'
                            + '<rect width="3" height="20" x="14" y="11" ></rect>'
                            + '<rect width="3" height="20" x="19" y="11" ></rect>'
                            + '</g>';

                    }
                }

                //根据时间 初始化 基础svg
                var SVG_Day = '   <g class="tick_Year_One" transform="translate(' + Minute_Trans + ')" >'
                    + '<rect class="DayRect Btn_MinuteRect" x="0.2" y="0" width="12.5" height="55" value="' + DayTimeStr + '">'
                    + '<title>' + DayTimeStr + '</title>'
                    + '</rect>'
                    + '<line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line>'
                    + '</g>';
                //SVG_Hour = SVG_Hour + Data_SVG + SVG_Day + TimeGar;

                SVG_Hour = SVG_Hour + Data_SVG + SVG_Day;
                if (self.AnimeMode) {
                    SVG_Hour = SVG_Hour + Trans_SVG;
                }
                if (Minute_Trans == "75" || Minute_Trans == "215") {
                    SVG_Hour = SVG_Hour
                        + '<line x1="' + Minute_Trans + '" x2="' + Minute_Trans + '" y1="40" y2="55" class="tick_10DayLine"'
                        + ' ></line>';
                }
                // 加5min
                HourNow.setMinutes(HourNow.getMinutes() + 5);

            }
            Month_Trans = 12 * 12.5 + Month_Trans;
            var Width = 12 * 12.5;
            var TimeHourShow = moment(CountDate).utc().format("YYYY-MM-DD HH:mm");
            if ((CountDate).getUTCHours() == 0) {
                TimeHourShow = moment(CountDate).utc().format("YYYY-MM-DD");
            }
            else {
                TimeHourShow = moment(CountDate).utc().format("HH:mm");
            }
            var Month_End = '<g transform="translate(0)">'
                + '<rect x="0" y="55" width="' + Width + '" height="25" class="Rect_White"/>'
                + '<text x="12" y="73" class="Month_Text_Show">' + TimeHourShow + '</text>'
                + '</g>'
                + '<g>'
                + '<circle cx="0" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/>'
                + '<circle cx="' + Width + '" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/>'
                + '</g>'
                + '<line x1="' + Width + '" x2="' + Width + '" y1="0" y2="80" class="tick_Line"></line>'
                + '</g>';
            SVG_Hour = SVG_Hour + TimeGar + Month_End;

            //小时显示完结
            SVG_Show = SVG_Show + SVG_Hour;
            //时间相加
            CountDate = new Date(moment(CountDate).add(1, 'hour'));
        }
        //时间相加
        var ShowTimeLine = document.getElementById("ShowSVG_Minute");

        if (self.browserType != "MSIE") {
            ShowTimeLine.innerHTML = SVG_Show;
        } else {
            $("#ShowSVG_Day").append(SVG_Show);
        }
        //ShowTimeLine.innerHTML = SVG_Show;
        Minute_ClickFucn();
    };

    /**
     * 分钟模式 -- 单日点击事件
     * @param event
     * @constructor
     */
    var MinuteRectOnClick = function (event) {
        var Tag = event.getAttribute("value");
        var ClickDate = new Date(moment.utc(Tag));
        self.SetShowDate(ClickDate);
    };


    /**
     * 分钟模式 -- 获取月模式的数据显示SVG 内容函数
     * @param Show_DayDate 输入传入的分钟时间
     * @param ShowTransLate 和当前分钟时间的位移
     * @returns {*}
     * @constructor
     */
    var GetMinuteMode_DataShowList = function (Show_DayDate, ShowTransLate) {
        Show_DayDate = Show_DayDate.toString();
        //若数据长度为0 则返回空
        if (m_MinuteModeData.length == 0 || !m_MinuteModeData.length) {
            return '';
        }
        //数据整体svg
        var ShowLayer_DataSVG = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show"'
            + ' transform="translate(' + ShowTransLate + ')">';

        //日期格式赋值
        var Date_Rect = Show_DayDate;
        //是否显示列表
        var IsDataShowList = [];
        //查找是否存在数据
        for (var k = 0; k < m_MinuteModeData.length; k++) {
            var is_ShowTag = false;
            var m_DataInfo_i = m_MinuteModeData[k];

            var IndexNum = m_DataInfo_i.indexOf(Date_Rect);
            if (IndexNum != -1) {
                is_ShowTag = true;
            }
            //根据数据存在情况加入列表
            IsDataShowList.push(is_ShowTag);
        }
        //判定是否有数据条填充 若无填充 则返回空值
        var IS_ShowTag = false;
        //生成基于 数据的是否显示Ture False 列表　使用列表初始化显示
        var rect_Height = Math.round(40 / m_MinuteModeData.length, 2);
        if (rect_Height > 10) {
            rect_Height = 10;
        }
        for (var i = 0; i < m_MinuteModeData.length; i++) {
            var DateRect = '';
            var Rect_Y = i * rect_Height;
            //生成RECT 样式
            if (IsDataShowList[i] == true) {
                //获取当前图层是否显示信息
                var Ishow = m_LayerShowTypeList[i];
                var RectLineEnd = Rect_Y + rect_Height - 0.4;
                //根据显示情况
                if (Ishow) {
                    IS_ShowTag = true;
                    //若该图层显示 则为蓝色
                    DateRect = '<rect class="Rect_Data_Show" x="-0.2" y="' + Rect_Y + '" width="12.7" height="' + rect_Height + '" ></rect>'
                        + '<line x1="0" x2="12.5" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="12.5" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                } else {
                    IS_ShowTag = true;
                    //不显示则为灰色
                    DateRect = '<rect class="Rect_Data_Hide" x="0" y="' + Rect_Y + '" width="12.5" height="' + rect_Height + '" ></rect>'
                        + '<line x1="0" x2="12.5" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="12.5" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                }
            }
            else {
                //若没有数据 则为空
                DateRect = '';
            }
            //组成矩阵
            ShowLayer_DataSVG = ShowLayer_DataSVG + DateRect;
        }
        ShowLayer_DataSVG = ShowLayer_DataSVG + '</g>';
        if (IS_ShowTag == false) {
            ShowLayer_DataSVG == '';
        }
        return ShowLayer_DataSVG;
    };

    /*分钟模式 时间轴部分 end*/


    /*日模式 日时间轴部分 begin*/


    /**
     * 日模式  DAY的DIV中 鼠标按下 触发函数
     * @constructor
     */
    var GetMouseDown_Day = function (event) {
        isMove_Day = true;
        x_Day = event.clientX;
        X_Before_Day = x_Day;
    };

    /**
     * 日模式  DAY的DIV中 鼠标抬起  触发函数
     * @constructor
     */
    var GetMouseUP_Day = function (event) {
        isMove_Day = false;
    };

    /**
     * 日模式  鼠标移出DAY的DIV 触发函数
     * @constructor
     */
    var GetMouseOut_Day = function () {
        if (self.browserType != "Firefox") {
            isMove_Day = false;
        }
    };

    /**
     * 日模式 -- 鼠标拖动位移 重新计算SVG  函数
     * @param event
     * @constructor
     */
    var MouseMove_Day = function (event) {
        //计算拖动位移
        if (isMove_Day) {
            x_Day = event.clientX;
            var DrgNum = X_Before_Day - x_Day;
            if (DrgNum >= 1 || DrgNum <= -1) {
                X_Before_Day = x_Day;
                Day_SVGMove(DrgNum);
            }
        }
    };

    /**
     * 日模式 -- 设置点击事件
     * @constructor
     */
    var Day_ClickFucn = function () {
        // console.log("Day_ClickFucn");
        //日点击事件
        var m_Btn_DayRectList = document.getElementsByClassName('Btn_DayRect');
        for (var t = 0; t < m_Btn_DayRectList.length; t++) {
            m_Btn_DayRectList[t].onclick = function () {
                DayRectOnClick(this);
            };
        }
    };

    /**
     * 日模式 -- 鼠标拖动等事件中 重绘界面 移动界面 向前为正 ，向后为负
     * @param trans
     * @constructor
     */
    var Day_SVGMove = function (trans) {
            //界面显示2个月
            var SVG_Show = '';
            //每个月的位移 初始化位0
            m_Trans_Day = m_Trans_Day - trans;
            //向后拖动
            while (m_Trans_Day > 0) {
                //计算长度
                var BeforeMonthLength = (new Date(DayBegin_Date.getFullYear(), (DayBegin_Date.getMonth() ), 0).getDate()) * 12.5;
                m_Trans_Day = m_Trans_Day - BeforeMonthLength;
                //减一个月
                DayBegin_Date.setMonth(DayBegin_Date.getMonth() - 1);
            }
            //向前拖动
            var MonthLength = -(new Date(DayBegin_Date.getFullYear(), (DayBegin_Date.getMonth() + 1), 0).getDate()) * 12.5;
            while (m_Trans_Day < MonthLength) {
                m_Trans_Day = m_Trans_Day - MonthLength;
                DayBegin_Date.setMonth(DayBegin_Date.getMonth() + 1);
                //计算长度
                MonthLength = -(new Date(DayBegin_Date.getFullYear(), (DayBegin_Date.getMonth() + 1), 0).getDate()) * 12.5;
            }
            Month_Trans = m_Trans_Day;
            //初始时间为2016年1月 当前月
            var CountDate = new Date(DayBegin_Date.getFullYear(), DayBegin_Date.getMonth() - 1, DayBegin_Date.getDate());

            //当前选择日期 str
            var DateShowNowStr = moment(self.DateShow).format('YYYY-MM-DD');

            //月份循环
            for (var i = 0; i < DayShowCount; i++) {
                var TimeGar = '';
                //计算当前月份天数
                var TimeDateCount = new Date(CountDate.getFullYear(), (CountDate.getMonth() + 1), 0).getDate();
                var ShowYear = CountDate.getFullYear();
                var ShowMonth = CountDate.getMonth();
                //月开始 绘制
                var SVG_Month = '  <g class="tick_Total_Year" transform="translate(' + Month_Trans + ')">' +
                    '<line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>';
                //每一天循环
                for (var j = 0; j < TimeDateCount; j++) {
                    //计算每一天的位移
                    var Day_Trans = (j * 12.5).toString();
                    //根据时间计算当前块显示 DATE YYYY-MM-dd
                    var DayTimeStr = moment(new Date(ShowYear, parseInt(ShowMonth), parseInt(j + 1))).format('YYYY-MM-DD');
                    //根据时间加载数据 svg
                    var Data_SVG = GetDayMode_DataShowList(DayTimeStr, Day_Trans);

                    //若当前日期为显示日期
                    if (!self.AnimeMode) {
                        if (DayTimeStr == DateShowNowStr) {
                            TimeGar = '<g id="guitarpick" class="SVG_guitarpick"  '
                                + ' transform="translate(' + (Day_Trans - 8) + ',-10)">'
                                + '<title>' + DateShowNowStr + '</title>'
                                + '<path d="'
                                + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                                + '"></path>'
                                + '<rect width="3" height="20" x="9" y="11" ></rect>'
                                + '<rect width="3" height="20" x="14" y="11" ></rect>'
                                + '<rect width="3" height="20" x="19" y="11" ></rect>'
                                + '</g>';
                        }
                    } else {
                        if (DayTimeStr == self.AnimeDate.utc().format('YYYY-MM-DD')) {
                            TimeGar = '<g id="guitarpick" class="SVG_Anime_guitarpick"'
                                + ' transform="translate(' + (Day_Trans - 8) + ',-10)">'
                                + '<title>' + DateShowNowStr + '</title>'
                                + '<path d="'
                                + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                                + '"></path>'
                                + '<rect width="3" height="20" x="9" y="11" ></rect>'
                                + '<rect width="3" height="20" x="14" y="11" ></rect>'
                                + '<rect width="3" height="20" x="19" y="11" ></rect>'
                                + '</g>';
                        }
                    }
                    //根据时间 初始化 基础svg
                    /*      + ' onclick="javascript:' + self.DayRectOnClick(evt, ' + ShowYear + ', ' + ShowMonth + ', ' + j + ') + '"   >'*/
                    var SVG_Day = '   <g class="tick_Year_One" transform="translate(' + Day_Trans + ')" >'
                        + '<rect class="DayRect Btn_DayRect" x="0.2" y="0" width="12.5" height="55" value="' + ShowYear + '-' + (parseInt(ShowMonth) + 1) + '-' + parseInt(j + 1) + '">'
                        + '<title>' + ShowYear + '-' + (parseInt(ShowMonth) + 1) + '-' + parseInt(j + 1) + '</title>'
                        + '</rect>'
                        + '<line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line>'
                        + '</g>';
                    SVG_Month = SVG_Month + Data_SVG + SVG_Day;
                    if (Day_Trans == "62.5" || Day_Trans == "125" || Day_Trans == "187.5" || Day_Trans == "250" || Day_Trans == "312.5" || Day_Trans == "375") {
                        SVG_Month = SVG_Month
                            + '<line x1="' + Day_Trans + '" x2="' + Day_Trans + '" y1="40" y2="55" class="tick_10DayLine"'
                            + ' ></line>';
                    }
                }
                Month_Trans = ( TimeDateCount * 12.5) + Month_Trans;
                var Width = ( TimeDateCount * 12.5);
                var Time = CountDate.getFullYear() + "-" + (CountDate.getMonth() + 1);
                var Month_End = '<g transform="translate(0)">'
                    + '<rect x="0" y="55" width="' + Width + '" height="25" class="Rect_White"/>'
                    + '<text x="12" y="73" class="Month_Text_Show">' + Time + '</text>'
                    + '</g>'
                    + '<g>'
                    + '<circle cx="0" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/>'
                    + '<circle cx="' + Width + '" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/>'
                    + '</g>'
                    + '<line x1="' + Width + '" x2="' + Width + '" y1="0" y2="80" class="tick_Line"></line>'
                    + '</g>';
                SVG_Month = SVG_Month + TimeGar + Month_End;
                //月显示完结
                SVG_Show = SVG_Show + SVG_Month;
                //时间相加
                CountDate = new Date(moment(CountDate).add(1, 'month'));
            }
            //时间相加
            var ShowTimeLine = document.getElementById("ShowSVG_Day");
            //IE处理
            if (self.browserType != "MSIE") {
                ShowTimeLine.innerHTML = SVG_Show;
            }
            else {
                $("#ShowSVG_Day").html(SVG_Show);
            }
            Day_ClickFucn();
        }
        ;

    /**
     * 日模式 -- 单日点击事件
     * @param event
     * @constructor
     */
    var DayRectOnClick = function (event) {
        var Tag = event.getAttribute("value");
        var tagsp = Tag.split('-');
        //转化年月日
        var ClickDate = new Date(tagsp[0], (parseInt(tagsp[1]) - 1), tagsp[2]);
        //设置为世界时
        var ClickDateUTC = new Date(moment(ClickDate).format('YYYY-MM-DD') + 'T00:00:00+00:00');
        //使用UTC赋值
        self.SetShowDate(ClickDateUTC);
    };

    /**
     * 日模式 -- 获取月模式的数据显示SVG 内容函数
     * @param Show_DayDate 输入传入的年时间
     * @param ShowTransLate 当前年时间的位移
     * @returns {*}
     * @constructor
     */
    var GetDayMode_DataShowList = function (Show_DayDate, ShowTransLate) {
        Show_DayDate = Show_DayDate.toString();
        //若数据长度为0 则返回空
        if (!m_DayModeData.length || m_DayModeData.lemgth == 0) {
            return '';
        }
        //数据整体svg
        var ShowLayer_DataSVG = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show"'
            + ' transform="translate(' + ShowTransLate + ')">';

        //日期格式赋值
        var Date_Rect = Show_DayDate;

        //是否显示列表
        var IsDataShowList = [];
        //查找是否存在数据
        for (var k = 0; k < m_DayModeData.length; k++) {
            var is_ShowTag = false;
            var m_DataInfo_i = m_DayModeData[k];
            var IndexNum = m_DataInfo_i.indexOf(Date_Rect);
            if (IndexNum != -1) {
                is_ShowTag = true;
            }
            //根据数据存在情况加入列表
            IsDataShowList.push(is_ShowTag);
        }
        //判定是否有数据条填充 若无填充 则返回空值
        var IS_ShowTag = false;
        //生成基于 数据的是否显示Ture False 列表　使用列表初始化显示
        var rect_Height = Math.round(40 / m_DayModeData.length, 2);
        if (rect_Height > 10) {
            rect_Height = 10;
        }
        for (var i = 0; i < m_DayModeData.length; i++) {
            var DateRect = '';
            var Rect_Y = i * rect_Height;
            //生成RECT 样式
            if (IsDataShowList[i] == true) {
                //获取当前图层是否显示信息
                var Ishow = m_LayerShowTypeList[i];
                var RectLineEnd = Rect_Y + rect_Height - 0.4;
                //根据显示情况
                if (Ishow) {
                    IS_ShowTag = true;
                    //若该图层显示 则为蓝色
                    DateRect = '<rect class="Rect_Data_Show" x="0" y="' + Rect_Y + '" width="12.5" height="' + rect_Height + '" ></rect>'
                        + '<line x1="0" x2="12.5" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="12.5" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                } else {
                    IS_ShowTag = true;
                    //不显示则为灰色
                    DateRect = '<rect class="Rect_Data_Hide" x="0" y="' + Rect_Y + '" width="12.5" height="' + rect_Height + '" ></rect>'
                        + '<line x1="0" x2="12.5" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="12.5" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                }
            }
            else {
                //若没有数据 则为空
                DateRect = '';
            }
            //组成矩阵
            ShowLayer_DataSVG = ShowLayer_DataSVG + DateRect;
        }
        ShowLayer_DataSVG = ShowLayer_DataSVG + '</g>';
        if (IS_ShowTag == false) {
            ShowLayer_DataSVG == '';
        }
        return ShowLayer_DataSVG;
    };

    /*日时间轴部分 end*/

    /*年时间轴部分 begin*/
    /**
     * 年模式 鼠标左键按下
     * @param event
     * @constructor
     */
    var GetMouseDown_Year = function (event) {
        isMove_Year = true;
        event = event || window.event;
        x_Year = event.clientX;
        X_Before_Year = x_Year;
    };

    /**
     * 年模式--鼠标左键抬起
     * @param event
     * @constructor
     */
    var GetMouseUP_Year = function (event) {
        event = event || window.event;
        isMove_Year = false;
        x_Year = event.clientX;
        //X_Before_Year = x_Year;
    };

    /**
     * 年模式 --鼠标移出DIV
     * @constructor
     */
    var GetMouseOut_Year = function () {
        if (self.browserType != "Firefox") {
            isMove_Year = false;
        }
    };

    /**
     * 年模式 --鼠标移动事件
     * @param evt
     * @constructor
     */
    var MouseMove_Year = function (evt) {
        if (isMove_Year) {
            evt = evt || window.event;
            x_Year = evt.clientX;
            var DrgNum = X_Before_Year - x_Year;

            X_Before_Year = x_Year;
            if (DrgNum >= 2 || DrgNum <= -2) {
                Year_SVGMove(DrgNum);
            }
        }
    };

    /**
     *年模式 -- 位移事件
     * @param transform 位移位置
     * @constructor
     */
    var Year_SVGMove = function (transform) {
        //计算当前最新位移
        m_Trans_Year = m_Trans_Year - transform;
        //获取遍历赋值的局部位移 初始量
        var Trans_now = m_Trans_Year;
        //获取年时间轴的DIV
        var m_ShowSVG_Year = document.getElementById("SVG_Year_Total");
        //初始化比较字符串
        var DateShowYearStr = moment(self.DateShow).format('YYYY');
        //总SVG Label
        var YearTotal = '<g id="ShowSVG_Year" transform="translate(' + Trans_now + ',10)" class="x aixs">';
        //初始化年份 1980
        var YearInit = moment(new Date(1980, 0, 1)).year();
        //循环绘制 年模块
        for (var j = 0; j < YearShowCount; j++) {
            var TimeGar = '';
            var TransMode = (j * 250).toString();
            //年模块SVG
            var YearShow = '<g class="tick_Total_Year" transform="translate(' + TransMode + ')">'
                + '<line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>';
            for (var i = 0; i < 10; i++) {
                var YearClick = YearInit + i;
                var Trans = (i * 25).toString();
                //若当前年时间为选择时间 则加入guitarpick指示当前时间
                if (!self.AnimeMode) {
                    if (DateShowYearStr == YearClick) {
                        TimeGar = '<g id="guitarpick" class="SVG_guitarpick"  '
                            + ' transform="translate(' + (Trans - 3) + ',-10)">'
                            + '<title>' + YearClick + '</title>'
                            + '<path d="'
                            + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                            + '"></path>'
                            + '<rect width="3" height="20" x="9" y="11" ></rect>'
                            + '<rect width="3" height="20" x="14" y="11" ></rect>'
                            + '<rect width="3" height="20" x="19" y="11" ></rect>'
                            + '</g>';
                    }
                } else {
                    if (YearClick == self.AnimeDate.utc().format('YYYY')) {
                        TimeGar = '<g id="guitarpick" class="SVG_Anime_guitarpick"'
                            + ' transform="translate(' + (Trans - 3) + ',-10)">'
                            + '<title>' + YearClick + '</title>'
                            + '<path d="'
                            + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                            + '"></path>'
                            + '<rect width="3" height="20" x="9" y="11" ></rect>'
                            + '<rect width="3" height="20" x="14" y="11" ></rect>'
                            + '<rect width="3" height="20" x="19" y="11" ></rect>'
                            + '</g>';
                    }
                }
                //通过当前时间 绘制背景的数据svg
                var SVG_Data = GetYearMode_DataShowList(YearClick, Trans);

                var IsTitle = "";
                //IE状态下对年Title进行缩放
                if (self.browserType != "MSIE") {
                    IsTitle = '<title>' + YearClick + '</title>';
                }
                //绘制基础的年模块部分
                var oneYear = '<g class="tick_Year_One" transform="translate(' + Trans + ')">'
                    + '<rect class="DayRect Btn_YearRect" x="0.2" y="0" width="25" height="55" value="' + YearClick + '"  >'
                    + IsTitle
                    + '</rect>'
                    + '<line class="tick_dot" x1="24" x2="24" y1="0" y2="52"></line>'
                    + '</g>';
                YearShow = YearShow + SVG_Data + oneYear;
            }
            var Right = '<g transform="translate(0)">'
                + '<rect x="0" y="55" width="250" height="25" class="Rect_White" value="' + YearInit + '"/>'
                + '<text x="12" y="73" class="Month_Text_Show">' + YearInit + '</text>'
                + '</g>'
                + '<g>'
                + '<circle cx="0" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/>'
                + '<circle cx="250" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/>'
                + '</g>'
                + '<line x1="250" x2="250" y1="0" y2="80" class="tick_Line"></line>'
                + '</g>';
            YearShow = YearShow + TimeGar + Right;
            YearTotal = YearTotal + YearShow;
            //添加10年
            YearInit = YearInit + 10;
        }
        YearTotal = YearTotal
            + '</g>'
                // '<line x1="0" x2="1500" y1="65" y2="65" class="tick_Line"></line>'
            + '</g>';
        //IE处理
        if (self.browserType != "MSIE") {
            m_ShowSVG_Year.innerHTML = YearTotal;
            $("#SVG_Year_Total").html(YearTotal);
        }
        else {
            $("#SVG_Year_Total").html(YearTotal);
        }

        var m_Btn_YearRectList = document.getElementsByClassName('Btn_YearRect');
        for (var w = 0; w < m_Btn_YearRectList.length; w++) {
            m_Btn_YearRectList[w].onclick = function () {
                btnClickGetYear(this);
            };
        }
    };

    /**
     * 年模式 -- 点击事件
     * @param event
     */
    var btnClickGetYear = function (event) {
        //调用设置年函数
        var Tag = event.getAttribute("value");
        var ClickDate = new Date(Tag);
        var m_Year = ClickDate.getFullYear();
        SetShowYear(m_Year);
    };

    /**
     * 年模式 -- 获取月模式的数据显示SVG 内容函数 输入传入的年时间和当前年时间的位移
     * @param Show_YearDate
     * @param ShowTransLate
     * @returns {*}
     * @constructor
     */
    var GetYearMode_DataShowList = function (Show_YearDate, ShowTransLate) {
        Show_YearDate = Show_YearDate.toString();
        //若数据长度为0 则返回空
        if (m_YearModeData.length == 0 || !m_YearModeData.length) {
            return '';
        }

        //数据整体svg
        var ShowLayer_DataSVG = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show"'
            + ' transform="translate(' + ShowTransLate + ')">';

        //日期格式赋值
        var Date_Rect = Show_YearDate;

        //是否显示列表
        var IsDataShowList = [];
        //查找是否存在数据
        for (var k = 0; k < m_YearModeData.length; k++) {
            var is_ShowTag = false;
            var m_DataInfo_i = m_YearModeData[k];
            var IndexNum = m_DataInfo_i.indexOf(Date_Rect);
            if (IndexNum != -1) {
                is_ShowTag = true;
            }
            //根据数据存在情况加入列表
            IsDataShowList.push(is_ShowTag);
        }

        //判定是否有数据条填充 若无填充 则返回空值
        var IS_ShowTag = false;
        //生成基于 数据的是否显示Ture False 列表　使用列表初始化显示
        var rect_Height = Math.round(40 / m_YearModeData.length, 2);
        if (rect_Height > 10) {
            rect_Height = 10;
        }
        for (var i = 0; i < m_YearModeData.length; i++) {
            var DateRect = '';
            var Rect_Y = i * rect_Height;
            //生成RECT 样式
            if (IsDataShowList[i] == true) {
                //获取当前图层是否显示信息
                var Ishow = m_LayerShowTypeList[i];
                var RectLineEnd = Rect_Y + rect_Height - 0.4;
                //根据显示情况
                if (Ishow) {
                    IS_ShowTag = true;
                    //若该图层显示 则为蓝色
                    DateRect = '<rect class="Rect_Data_Show" x="0" y="' + Rect_Y + '" width="25" height="' + rect_Height + '" ></rect>'
                        + '<line x1="0" x2="25" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="25" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                } else {
                    IS_ShowTag = true;
                    //不显示则为灰色
                    DateRect = '<rect class="Rect_Data_Hide" x="0" y="' + Rect_Y + '" width="25" height="' + rect_Height + '" ></rect>'
                        + '<line x1="0" x2="25" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="25" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                }
            }
            else {
                //若没有数据 则为空
                DateRect = '';
            }
            //组成矩阵
            ShowLayer_DataSVG = ShowLayer_DataSVG + DateRect;
        }
        ShowLayer_DataSVG = ShowLayer_DataSVG + '</g>';
        if (IS_ShowTag == false) {
            ShowLayer_DataSVG == '';
        }
        return ShowLayer_DataSVG;
    };


    /**
     * 月模式 -- 鼠标down事件
     * @param event
     * @constructor
     */
    var GetMouseDown_Month = function (event) {
        event = event || window.event;
        x_Month = event.clientX;
        X_Before_Month = x_Month;
        isMove_Month = true;
    };

    /**
     * 月模式 -- 鼠标抬起事件
     * @param event
     * @constructor
     */
    var GetMouseUP_Month = function (event) {
        isMove_Month = false;
    };

    /**
     * 月模式 -- 鼠标移动事件
     * @param event
     * @constructor
     */
    var MouseMove_Month = function (event) {
        event = event || window.event;
        if (isMove_Month) {
            x_Month = event.clientX;
            var DrgNum = X_Before_Month - x_Month;
            if (DrgNum >= 1 || DrgNum <= -1) {
                X_Before_Month = x_Month;
                Month_SvgMove(DrgNum);
            }
        }
    };

    /**
     * 月模式 -- 鼠标移出事件
     * @param event
     * @constructor
     */
    var GetMouseOut_Month = function (event) {
        if (self.browserType != "Firefox") {
            isMove_Month = false;
        }
    };

    /**
     * 月模式 -- 初始化TimeLine显示
     * @param DateShow
     * @constructor
     */
    var InitMonthTimeLineShow = function (DateShow) {
        var Trans = (DateShow - self.m_TransYear) * 150;
        Month_SvgMove(Trans);
    };

    /**
     * 月模式 -- 位移事件 重绘时间轴
     * @param tarnsform
     * @constructor
     */
    var Month_SvgMove = function (tarnsform) {

        //获取 月模式下 SVG的DIV
        var m_ShowSVG = document.getElementById("ShowSVG");

        //循环添加
        var InnerSvgTotal = "";
        m_Trans_Month = m_Trans_Month - tarnsform;
        while (m_Trans_Month > 150) {
            MonthBegin_Date = new Date(moment(MonthBegin_Date).add(-1.0, 'year'));
            m_Trans_Month = m_Trans_Month - 150;
        }
        while (m_Trans_Month < -150) {
            MonthBegin_Date = new Date(moment(MonthBegin_Date).add(1.0, 'year'));
            m_Trans_Month = m_Trans_Month + 150;
        }
        var m_BeginYear = moment(MonthBegin_Date).year();
        //获取当前选择时间的月份 STR 用于Title显示
        var TimeShowStr_Month = moment(self.DateShow).format("YYYY-M");
        // 月循环 MonthShowCount
        for (var i = 0; i < MonthShowCount; i++) {
            var TimeGar = "";
            var TimeStr = (m_BeginYear + i).toString();
            var Trans = i * 150 + m_Trans_Month - 150;
            var InnerSvg = '<g class="tick_Total_Year" Tag="' + TimeStr + '" transform="translate(' + Trans + ')">'
                + '<line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>';
            //月份循环
            for (var Month = 0; Month < 12; Month++) {
                var TransMonth = Month * 12.5;
                var ShowDateStr = TimeStr + "-" + ( Month + 1);
                var MonthData_Svg = "";

                //调用函数 返回当前单位是否需要显示数据
                MonthData_Svg = GetMothMode_DataShowList(ShowDateStr, TransMonth);

                var MonthSVG = '<g class="tick_Year_One" transform="translate(' + TransMonth + ')">'
                    + '<rect x="0.2" y="0" width="12.5" height="55" class="DayRect Btn_MonthRect" value="' + ShowDateStr + '">'
                    + '<title>' + ShowDateStr + '</title>'
                    + '</rect>'
                    + '<line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line>'
                    + '</g>';
                //若显示月为当前月
                if (self.AnimeMode) {
                    if (ShowDateStr == self.AnimeDate.utc().format("YYYY-M")) {
                        TimeGar = '<g id="guitarpick" class="SVG_Anime_guitarpick"'
                            + ' transform="translate(' + (Trans + TransMonth - 10) + ',-10)">'
                            + '<title>' + ShowDateStr + '</title>'
                            + '<path d="'
                            + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                            + '"></path>'
                            + '<rect width="3" height="20" x="9" y="11" ></rect>'
                            + '<rect width="3" height="20" x="14" y="11" ></rect>'
                            + '<rect width="3" height="20" x="19" y="11" ></rect>'
                            + '</g>';
                        // MonthSVG = MonthSVG + TimeGar;
                    }
                } else {
                    if (TimeShowStr_Month == ShowDateStr) {
                        TimeGar = '<g id="guitarpick" class="SVG_guitarpick"'
                            + ' transform="translate(' + (Trans + TransMonth - 10) + ',-10)">'
                            + '<title>' + ShowDateStr + '</title>'
                            + '<path d="'
                            + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                            + '"></path>'
                            + '<rect width="3" height="20" x="9" y="11" ></rect>'
                            + '<rect width="3" height="20" x="14" y="11" ></rect>'
                            + '<rect width="3" height="20" x="19" y="11" ></rect>'
                            + '</g>';
                        // MonthSVG = MonthSVG + TimeGar;
                    }
                }
                InnerSvg = InnerSvg + MonthData_Svg + MonthSVG;
            }

            InnerSvg = InnerSvg + '<g transform="translate(0)">'
                + '<rect x="0" y="55" width="150" height="25"  class="Rect_White"/>'
                + '<text x="12" y="73" class="Month_Text_Show" >' + TimeStr + '年</text>'
                + '</g>'
                + '<g>'
                + '<circle cx="0" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/>'
                + '<circle cx="150" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/>'
                + '</g>'
                + '<line x1="150" x2="150" y1="0" y2="80" class="tick_Line"></line>'
                + '</g>'
                + '</g>';
            InnerSvgTotal = InnerSvgTotal + InnerSvg + TimeGar;
        }

        m_ShowSVG.innerHTML = InnerSvgTotal;
        //IE处理
        if (self.browserType != "MSIE") {
            m_ShowSVG.innerHTML = InnerSvgTotal;
        }
        else {
            // console.log("IE innerHTML");
            $("#ShowSVG").html(YearTotal);
        }
        //绑定点击事件
        MonthClickFunc();
    };

    /**
     * 月模式 -- 点击事件赋值
     * @constructor
     */
    var MonthClickFunc = function () {
        var m_MonthRectList = document.getElementsByClassName("Btn_MonthRect");
        for (var i = 0; i < m_MonthRectList.length; i++) {
            m_MonthRectList[i].onclick = function () {
                SetShowMonth(this);
            }
        }
    };

    /**
     * 月模式 -- 获取月模式的数据显示SVG 内容函数
     * @param Show_MonthDate
     * @param ShowTransLate 位移数据
     * @returns {*}
     * @constructor
     */
    var GetMothMode_DataShowList = function (Show_MonthDate, ShowTransLate) {

        if (!m_MonthModeData.length) {
            return "";
        }
        var ShowLayer_DataSVG = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show"'
            + ' transform="translate(' + ShowTransLate + ')">';

        //日期格式赋值
        var Date_Rect = Show_MonthDate;
        //是否显示列表
        var IsDataShowList = [];
        //查找是否存在数据
        for (var k = 0; k < m_MonthModeData.length; k++) {
            var is_ShowTag = false;
            var m_DataInfo_i = m_MonthModeData[k];
            var IndexNum = m_DataInfo_i.indexOf(Date_Rect);
            if (IndexNum != -1) {
                is_ShowTag = true;
            }
            //根据数据存在情况加入列表
            IsDataShowList.push(is_ShowTag);
        }
        //生成基于 数据的是否显示Ture False 列表　使用列表初始化显示
        var rect_Height = Math.round(40 / m_MonthModeData.length, 2);

        if (rect_Height > 10) {
            rect_Height = 10;
        }
        var Rect_ShowHeight = rect_Height - 0.8;
        //遍历获取
        for (var i = 0; i < m_MonthModeData.length; i++) {
            var DateRect = '';
            var Rect_Y = i * rect_Height;
            //生成RECT 样式
            if (IsDataShowList[i] == true) {
                //获取当前图层是否显示信息
                var IsData_show = m_LayerShowTypeList[i];
                var RectLineEnd = Rect_Y + rect_Height - 0.2;
                //根据显示情况
                if (IsData_show) {
                    //若该图层显示 则为蓝色
                    DateRect = '<rect class="Rect_Data_Show" x="0" y="' + Rect_Y + '" width="12.5" height="' + Rect_ShowHeight + '" ></rect>'
                        + '<line x1="0" x2="12.5" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="12.5" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                }
                else {
                    //有数据 但是当前列 不显示 则为灰色
                    DateRect = '<rect class="Rect_Data_Hide" x="0" y="' + Rect_Y + '" width="12.5" height="' + Rect_ShowHeight + '" ></rect>'
                        + '<line x1="0" x2="12.5" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="12.5" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                }
            }
            else {
                //若没有数据 则为
                DateRect = '';
            }
            //组成矩阵
            ShowLayer_DataSVG = ShowLayer_DataSVG + DateRect;
        }
        ShowLayer_DataSVG = ShowLayer_DataSVG + '</g>';

        return ShowLayer_DataSVG;
    };


    /**
     * 整体显示 --  点击按钮 伸缩界面 事件
     * @constructor
     */
    var ClickShowAndHide = function () {
        //获取TimeLine 部分的DIV
        var ShowTimeLine = document.getElementsByClassName("TimeLineTotalDiv");
        //如果当前显示为全部
        if (self.Is_ShowSVGLine) {
            for (var i = 0; i < ShowTimeLine.length; i++) {
                ShowTimeLine[i].style.display = "none";
            }
            self.Is_ShowSVGLine = false;
        }
        else {
            //如果当前为压缩模式 修改为伸缩模式
            for (var j = 0; j < ShowTimeLine.length; j++) {
                ShowTimeLine[j].style.display = "block";
            }
            self.Is_ShowSVGLine = true;
            //伸长后重绘界面 重新计算
            GetFullModeWidth(self.IDName);
        }
    };

    /**
     * 整体显示 --  显示年选择模式
     * @constructor
     */
    var ShowYearMode = function () {
        m_Show_YearDiv = document.getElementById("Show_YearDiv");
        m_Show_MonthDiv = document.getElementById("Show_MonthDiv");
        m_Show_DayDiv = document.getElementById("Show_DayDiv");
        m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv");

        m_Show_YearDiv.style.display = "block";
        m_Show_MonthDiv.style.display = "none";
        m_Show_DayDiv.style.display = "none";
        m_Show_MinuteDiv.style.display = "none";

        //年按钮可用
        document.getElementById("btn_AddYear").disabled = false;
        document.getElementById("btn_MinusYear").disabled = false;
        //月日按钮不可用
        document.getElementById("btn_AddMonth").disabled = true;
        document.getElementById("btn_MinusMonth").disabled = true;
        document.getElementById("btn_AddDay").disabled = true;
        document.getElementById("btn_MinusDay").disabled = true;

        Year_SVGMove(0);
        self.ShowMode = "Year_Mode";
    };

    /**
     * 整体显示 -- 显示月显示模式
     * @constructor
     */
    var ShowMonthMode = function () {

        m_Show_YearDiv = document.getElementById("Show_YearDiv");
        m_Show_MonthDiv = document.getElementById("Show_MonthDiv");
        m_Show_DayDiv = document.getElementById("Show_DayDiv");
        m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv");

        m_Show_YearDiv.style.display = "none";
        m_Show_MonthDiv.style.display = "block";
        m_Show_DayDiv.style.display = "none";
        m_Show_MinuteDiv.style.display = "none";

        //年月 按钮可用
        document.getElementById("btn_AddYear").disabled = false;
        document.getElementById("btn_MinusYear").disabled = false;
        document.getElementById("btn_AddMonth").disabled = false;
        document.getElementById("btn_MinusMonth").disabled = false;
        //日按钮不可用
        document.getElementById("btn_AddDay").disabled = true;
        document.getElementById("btn_MinusDay").disabled = true;
        self.ShowMode = "Month_Mode";
        //计算 差值 每一年 差值150
        m_Trans_Month = (moment(MonthBegin_Date).year() - moment(self.DateShow).year() + 5) * 150;
        Month_SvgMove(0);
    };

    /**
     * 整体显示 --  显示天显示模式
     * @constructor
     */
    var ShowDayMode = function () {

        m_Show_YearDiv = document.getElementById("Show_YearDiv");
        m_Show_MonthDiv = document.getElementById("Show_MonthDiv");
        m_Show_DayDiv = document.getElementById("Show_DayDiv");
        m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv");
        m_Show_YearDiv.style.display = "none";
        m_Show_MonthDiv.style.display = "none";
        m_Show_DayDiv.style.display = "block";
        m_Show_MinuteDiv.style.display = "none";

        //年 月日按钮 可用
        $("#btn_AddYear").attr("disabled", false);
        $("#btn_MinusYear").attr("disabled", false);
        $("#btn_AddMonth").attr("disabled", false);
        $("#btn_MinusMonth").attr("disabled", false);
        $("#btn_AddDay").attr("disabled", false);
        $("#btn_MinusDay").attr("disabled", false);

        //计算  天显示的时间差
        var Time_Day = Math.round((DayBegin_Date - self.DateShow) / 86400000 * 12.5, 2);
        self.ShowMode = "Day_Mode";
        m_Trans_Day = m_Trans_Day + Time_Day;
        Day_SVGMove(0);
    };

    /**
     * 整体显示 --显示 分钟模式
     * @constructor
     */
    var ShowMinuteMode = function () {
        m_Show_YearDiv = document.getElementById("Show_YearDiv");
        m_Show_MonthDiv = document.getElementById("Show_MonthDiv");
        m_Show_DayDiv = document.getElementById("Show_DayDiv");
        m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv");

        m_Show_YearDiv.style.display = "none";
        m_Show_MonthDiv.style.display = "none";
        m_Show_DayDiv.style.display = "none";
        m_Show_MinuteDiv.style.display = "block";
        //年 月日按钮 可用
        $("#btn_AddYear").attr("disabled", false);
        $("#btn_MinusYear").attr("disabled", false);
        $("#btn_AddMonth").attr("disabled", false);
        $("#btn_MinusMonth").attr("disabled", false);
        $("#btn_AddDay").attr("disabled", false);
        $("#btn_MinusDay").attr("disabled", false);

        //设置显示模式
        self.ShowMode = "Minute_Mode";
        //计算偏移量
        var ItemTime = self.DateShow - MinuteBegin_Date - 21600000;
        var m_Trans = ItemTime / 1000 / 60 / 5 * 12.5;
        //拖拽 分钟
        Minute_SVGMove(m_Trans);
    };

    /**
     * 添加数据函数
     * @param ADDDatas
     * @constructor
     */
    this.ADDLayerData = function (ADDDatas) {
        var LengthAddCount = ADDDatas.length;
        //对于每一个添加的变量
        if (LengthAddCount) {
            for (var i = 0; i < LengthAddCount; i++) {
                var m_ADDItem = ADDDatas[i];
                m_DataInfoALL.push(m_ADDItem);
                var m_LayerName = m_ADDItem.DataName;

                var m_Layeris_Show = m_ADDItem.Layeris_Show;
                var IndexNum = m_LayerDataList.indexOf(m_LayerName);
                //若当前不存在 则加入列表及列表-表现层 并为各组数据添加新数据
                if (IndexNum == -1) {
                    m_LayerDataList.push(m_LayerName);
                    m_LayerShowTypeList.push(m_Layeris_Show);
                    m_YearModeData.push([]);
                    m_MonthModeData.push([]);
                    m_DayModeData.push([]);
                    m_MinuteModeData.push([]);
                    IndexNum = m_LayerDataList.length - 1;
                }
                var m_LayerDataInfo = m_ADDItem.DataInfo;

                //根据DataInfo中第一字段的长度，对当前数据是哪一种类型进行判断
                try {
                    var m_FirstItem = m_LayerDataInfo[0];
                    switch (m_FirstItem.length) {

                        case 4:
                        {
                            m_YearModeData[IndexNum] = m_LayerDataInfo;
                            break;
                        }
                        case 6:
                        case 7:
                        {
                            m_MonthModeData[IndexNum] = m_LayerDataInfo;
                            break;
                        }
                        case 10:
                        {
                            m_DayModeData[IndexNum] = m_LayerDataInfo;
                            break;
                        }
                        case 16:
                        {
                            m_MinuteModeData[IndexNum] = m_LayerDataInfo;
                            break;
                        }
                        default:
                        {
                            console.log(m_FirstItem);
                            break;
                        }
                    }
                }
                catch (err) {

                }
                // console.log("end One");
            }
        }
        Year_SVGMove(0);
        Month_SvgMove(0);
        Day_SVGMove(0);
        Minute_SVGMove(0);
    };

    /**
     * 集成原有函数
     * @type {TimeLine.AddMinuteData}
     */
    this.AddYearData = this.AddMonthData = this.AddDayData = this.AddMinuteData = function (m_InsertData) {
        //调用最新的重构函数
        this.ADDLayerData(m_InsertData);
    };

    /**
     * 重构当前数据
     * @constructor
     */
    var ResetLayerData = function () {

        //对于每一个添加的变量
        for (var i = 0; i < m_LayerDataList.length; i++) {
            m_OrderItem = m_LayerDataList[i];
            m_showType = m_LayerShowTypeList[i];
            m_DataInfoALL.forEach(function (m_infoData) {
                if (m_infoData.DataName === m_OrderItem) {
                    var m_LayerDataInfo = m_infoData.DataInfo;
                    //根据DataInfo中第一字段的长度，对当前数据是哪一种类型进行判断
                    try {
                        var m_FirstItem = m_LayerDataInfo[0];
                        switch (m_FirstItem.length) {

                            case 4:
                            {
                                m_YearModeData[i] = m_LayerDataInfo;
                                break;
                            }
                            case 6:
                            case 7:
                            {
                                m_MonthModeData[i] = m_LayerDataInfo;
                                break;
                            }
                            case 10:
                            {
                                m_DayModeData[i] = m_LayerDataInfo;
                                break;
                            }
                            case 16:
                            {
                                m_MinuteModeData[i] = m_LayerDataInfo;
                                break;
                            }
                            default:
                            {
                                //  console.log(m_FirstItem); todo 不符合标准则丢弃
                                break;
                            }
                        }
                    }
                    catch (err) {

                    }
                } else {
                }
            });
        }


        //刷新显示
        Year_SVGMove(0);
        Month_SvgMove(0);
        Day_SVGMove(0);
        Minute_SVGMove(0);
        //RefreshTimeShow(); 会触发重新赋值造成循环

    };

    /**
     * 根据名称 对当前数据进行移除
     * @param RemoveDataLayerName
     * @constructor
     */
    this.RemoveLayerDataByName = function (RemoveDataLayerName) {
        var IndexNum = m_LayerDataList.indexOf(RemoveDataLayerName);
        if (IndexNum != -1) {
            m_LayerDataList.splice(IndexNum, 1);
            m_LayerShowTypeList.splice(IndexNum, 1);
            m_YearModeData.splice(IndexNum, 1);
            m_MonthModeData.splice(IndexNum, 1);
            m_DayModeData.splice(IndexNum, 1);
            m_MinuteModeData.splice(IndexNum, 1);
        }
        //删除名称匹配的总数据项目
        var m_NewDat = [];
        for (var i = 0; i < m_DataInfoALL.length; i++) {
            if (m_DataInfoALL[i].DataName != RemoveDataLayerName) {
                m_NewDat.push(m_DataInfoALL[i]);
            }
        }
        m_DataInfoALL = m_NewDat;
        //根据当前移除
        switch (self.ShowMode) {
            case "Year_Mode":
            {
                Year_SVGMove(0);
                break;
            }
            case "Month_Mode":
            {
                Month_SvgMove(0);
                break;
            }
            case "Day_Mode":
            {
                Day_SVGMove(0);
                break;
            }
            case "Minute_Mode":
            {
                Minute_SVGMove(0);
                break;
            }
            default:
                break;
        }
    };

    /**
     * 对数据进行整体重新调整结构
     * @param m_NewDataList
     * @constructor
     */
    this.ReSetLayerList = function (m_NewDataList) {
        m_LayerDataList = [];
        m_LayerShowTypeList = [];
        m_YearModeData = [];
        m_MonthModeData = [];
        m_DayModeData = [];
        m_MinuteModeData = [];
        for (var i = 0; i < m_NewDataList.length; i++) {
            m_LayerDataList.push(m_NewDataList[i].DataName);
            m_LayerShowTypeList.push(m_NewDataList[i].Layeris_Show);
            m_YearModeData.push([]);
            m_MonthModeData.push([]);
            m_DayModeData.push([]);
            m_MinuteModeData.push([]);
        }
        //
        ResetLayerData(m_DataInfoALL);
    };


    /**
     * 获取图层列表
     * @returns {Array}
     * @constructor
     */
    this.GetLayerList = function () {
        return m_LayerDataList;
    };


    /**
     * 根据所选参数返回当前图层名称相符的模式的可被动画函数调用的json列表
     * @param m_LayerName 图层名称
     * @param m_BeginTime 开始时间
     * @param m_EndTime 结束时间
     * @param m_DateTye 日期模式 year month day minute
     * @param m_ImageUrl 日当前图层URL
     */
    this.getDataList = function (m_LayerName, m_BeginTime, m_EndTime, m_DateTye, m_ImageUrl) {
        //参数处理
        if (typeof(m_LayerName) != 'string') {
            console.log("图层名称错误！图层名称类型选择必须为：String。");
            return;
        }
        var m_Selecttype = m_DateTye.toLowerCase();
        if (m_Selecttype != "year" && m_Selecttype != "day"
            && m_Selecttype != "month" && m_Selecttype != "minute") {
            console.log("数据类型错误！数据类型选择必须为：year，month，day，mintue中的一个");
            return;
        }
        //判断开始结束时间类型
        if (!(m_BeginTime instanceof moment)) {
            console.log("参数 数据类型错误！开始日期的数据类型选择必须为 moment");
            return;
        }
        if (!(m_EndTime instanceof moment)) {
            console.log("参数 数据类型错误！结束日期的数据类型选择必须为 moment");
            return;
        }
        var m_Length = m_DataInfoALL.length;
        var m_MacthData = [];
        //根据输入条件获取当前json数据 只有一个
        if (m_Length != undefined && m_Length > 0) {
            m_DataInfoALL.forEach(function (m_dataitem) {
                //根据名字进行 第一次筛选出符合条件的
                if (m_dataitem.DataName == m_LayerName) {
                    var m_dataType = "";
                    var m_DateInfo = m_dataitem.DataInfo;
                    //根据类型进行下一次筛选
                    if (m_DateInfo.length > 0) {
                        var Data_length = m_DateInfo[0].length;
                        //根据 Data_length判断当前数据属于什么类型

                        switch (Data_length) {
                            case 3:
                            case 4:
                            {
                                //年
                                m_dataType = "year";
                                break;
                            }
                            case 6:
                            case 7:
                            {//月"2016-12"   "2016-2"
                                m_dataType = "month";
                                break;
                            }
                            case 10:
                            case 11:
                            {
                                //日 "2017-03-09"
                                m_dataType = "day";
                                break;
                            }
                            case 16:
                            {
                                //分 2017-02-10 06:10
                                m_dataType = "minute";
                                break;
                            }
                            default:
                                break;
                        }
                        if (m_dataType == m_Selecttype) {
                            m_MacthData = m_dataitem;
                            //  break;
                        }
                    }
                }
            });

        }

        /*var m_BeginMoment = moment.utc(m_BeginTime);

         var m_EndMoment = moment.utc(m_EndTime);*/

        var m_BeginMoment = m_BeginTime;

        var m_EndMoment = m_EndTime;

        var m_TimeList = [];
        // 数据不为空
        if (m_MacthData != []) {
            var m_allData = m_MacthData.DataInfo;
            //若存在匹配数据
            if (m_allData.length != undefined) {
                //对数据进行筛选
                for (var t = 0; t < m_allData.length; t++) {
                    var m_itemTime = m_allData[t];
                    var m_timeMoment = moment.utc(m_itemTime);
                    if (m_timeMoment.isAfter(m_BeginMoment) && m_timeMoment.isBefore(m_EndMoment)) {
                        m_TimeList.push(m_timeMoment);
                    }
                    else if (m_timeMoment.isSame(m_BeginMoment) || m_timeMoment.isSame(m_EndMoment)) {
                        m_TimeList.push(m_timeMoment);
                    }
                }
            }
        }

        //对URL进行转换
        var m_UrlList = [];
        for (var k = 0; k < m_TimeList.length; k++) {
            var m_returnItem = [];
            var m_Time = m_TimeList[k];
            var projectUrl = m_ImageUrl;
            if (projectUrl.indexOf('yyyy') > 0) {
                projectUrl = projectUrl.replace('yyyy', m_Time.utc().format("YYYY"));
            }
            if (projectUrl.indexOf('MM') > 0) {
                projectUrl = projectUrl.replace('MM', m_Time.utc().format("MM"));
            }
            if (projectUrl.indexOf('dd') > 0) {
                projectUrl = projectUrl.replace('dd', m_Time.utc().format("DD"));
            }
            if (projectUrl.indexOf('hh') > 0) {
                projectUrl = projectUrl.replace('hh', m_Time.utc().format("HH"));
            }
            if (projectUrl.indexOf('mm') > 0) {
                projectUrl = projectUrl.replace('mm', m_Time.utc().format("mm"));
            }
            /*   m_returnItem.LayerTimeUrl = projectUrl;
             m_returnItem.LayerTimeIndexZ = 550 + k;
             m_returnItem.LayerTimeName = m_LayerName + "_" + k;
             m_returnItem.LayerTime = m_Time;*/
            m_UrlList.push(projectUrl);
        }


        var m_returnList = [];
        m_returnList.UrlList = m_UrlList;
        m_returnList._id = m_LayerName;
        return m_returnList;
    };

    /**
     *
     * @param m_LayerName 图层名称
     * @param m_DateTye 日期模式 year month day minute
     */
    this.getLatestDate = function (m_LayerName, m_DateTye) {
        // 参数判断
        if (typeof(m_LayerName) != 'string') {
            console.log("图层名称错误！图层名称类型选择必须为：String。");
            return;
        }
        var m_Selecttype = m_DateTye.toLowerCase();
        if (m_Selecttype != "year" && m_Selecttype != "day"
            && m_Selecttype != "month" && m_Selecttype != "minute") {
            console.log("数据类型错误！数据类型选择必须为：year，month，day，mintue中的一个");
            return;
        }

        try {
            //遍历选出当前符合条件的data
            var m_Length = m_DataInfoALL.length;
            var m_MacthData = [];
            //根据输入条件获取当前json数据 只有一个
            if (m_Length != undefined && m_Length > 0) {
                m_DataInfoALL.forEach(function (m_dataitem) {
                    //根据名字进行 第一次筛选出符合条件的
                    if (m_dataitem.DataName == m_LayerName) {
                        var m_dataType = "";
                        var m_DateInfo = m_dataitem.DataInfo;
                        //根据类型进行下一次筛选
                        if (m_DateInfo.length > 0) {
                            var Data_length = m_DateInfo[0].length;
                            //根据 Data_length判断当前数据属于什么类型
                            switch (Data_length) {
                                case 3:
                                case 4:
                                {
                                    //年
                                    m_dataType = "year";
                                    break;
                                }
                                case 6:
                                case 7:
                                {//月"2016-12"   "2016-2"
                                    m_dataType = "month";
                                    break;
                                }
                                case 10:
                                case 11:
                                {
                                    //日 "2017-03-09"
                                    m_dataType = "day";
                                    break;
                                }
                                case 16:
                                {
                                    //分 2017-02-10 06:10
                                    m_dataType = "minute";
                                    break;
                                }
                                default:
                                    break;
                            }
                            if (m_dataType == m_Selecttype) {
                                m_MacthData = m_dataitem;
                                //  break;
                            }
                        }
                    }
                });

            }

            var m_LatestDate = "";
            //从 m_MacthData 获取最新的数据
            if (m_MacthData != []) {
                var m_allData = m_MacthData.DataInfo;
                if (m_allData != undefined) {
                    var m_length = m_allData.length;
                    m_LatestDate = m_allData[m_length - 1];
                }
            }
            //   console.log(m_LatestDate);
            if (m_LatestDate != "") {
                var m_LatestDate_moment = moment(m_LatestDate + "+00:00");
                // console.log(m_LatestDate_moment);
                return m_LatestDate_moment.utc();
            }
            else {
                return;
            }
        } catch (err) {
            return;
        }

    };


    /**
     * 动画显示部分 begin
     */

    /**
     * 是否为动画模式
     * @type {boolean}
     */
    self.AnimeMode = false;
    //动画显示开始结束时间
    self.Anime_BeginTime;
    self.Anime_EndTime;

    //当前动画显示到哪一帧 （moment时间）
    self.AnimeDate;

    /**
     * 设置动画模式
     * @param m_beginTime 动画范围开始时间
     * @param m_endTime 动画范围结束时间
     * @constructor
     */
    this.SetAmineMode = function (m_beginTime, m_endTime) {

        //参数正确性判断
        if (!(m_beginTime instanceof moment)) {
            console.log("参数类型错误，m_beginTime的类型需要为：moment");
            return false;
        }
        if (!(m_endTime instanceof moment)) {
            console.log("参数类型错误，m_beginTime的类型需要为：moment");
            return false;
        }
        //对参数进行赋值操作

        //如果当前设置的时分秒 不为5min的整数倍数
        //对开始时间向后 结束时间向前进行 整数化处理 todo 判定是否需要？？？
        self.Anime_BeginTime = m_beginTime;
        self.Anime_EndTime = m_endTime;
        //设置动画模式为true
        self.AnimeDate = m_beginTime;
        self.AnimeMode = true;
        //刷新当前显示 todo
        return true;
    };


    /**
     * 设置当前显示的动画时间
     * @param m_AnimeDate 设置的动画时间
     * @constructor
     */
    this.SetAmineDate = function (m_AnimeDate) {
        if (!(m_AnimeDate instanceof moment)) {
            console.log("参数类型错误，m_AnimeDate需要为moment类型。");
            return false;
        }
        else {
            //todo 传入参数是否需要进行５ｍｉｎ的整数化处理 目前默认为5min模式
            self.AnimeDate = m_AnimeDate;
            self.AnimeMode = true;

            Minute_SVGMove(0);
            Day_SVGMove(0);
            Month_SvgMove(0);
            Year_SVGMove(0);
            return true;
        }
    };

    /**
     * 设置当前动画模式结束
     * @returns {boolean}
     * @constructor
     */
    this.SetAmineMode_End = function () {
        self.AnimeMode = false;
        //将各种范围数据赋值为空（防止下次调用的时候bug）
        self.Anime_BeginTime = null;
        self.Anime_EndTime = null;
        self.AnimeDate = null;
        // todo 刷新当前显示 暂时只对分钟模式进行处理
        Minute_SVGMove(0);
        Day_SVGMove(0);
        Month_SvgMove(0);
        Year_SVGMove(0);
        return true;
    };

    //测试变量 用于控制是否显示动画进度条
    var is_ShowTrans = false;

    /**
     * 根据当前设置的动画模式判断 是否需要显示动画范围部分  todo 未完成
     * @param Show_DayDate 当前svg遍历显示部分  moment(HourNow).utc().format('YYYY-MM-DD HH:mm');
     * @param ShowTransLate 当前SVG遍历显示部分的位移
     * @constructor
     */
    var GetMinuteMode_AnimeDateList = function (Show_DayDate, ShowTransLate) {
        if (!is_ShowTrans) {

            return "";
        }
        //判断模式 只有动画模式才对SVG进行显示
        if (self.AnimeMode == false) {
            return "";
        }

        if (self.Anime_BeginTime == null || self.Anime_EndTime == null || self.AnimeDate == null) {
            return "";
        }

        //首先判断是否在动画播放值域范围内 转化为moment
        var m_TimeStr = Show_DayDate + "+00:00";
        var m_momentTime = moment(m_TimeStr);

        //若超出时间范围
        if (self.Anime_BeginTime.isAfter(m_momentTime) || self.Anime_EndTime.isBefore(m_momentTime)) {
            return "";
        }

        //在时间范围内 分为以下几种情况
        //1。开始时次 且未经过
        //2.开始时次 且经过
        //3.中间时次 且未经过
        //4.中间时次 且经过
        //5.结束时次 且未经过
        //6.结束时次 且经过
        var ShowLayer_DataSVG = "";

        //判断是否在开始时间范围内
        //与开始时间的时间差 相差5min以内 等于开始时间 或者大于开始时间 且小于开始时间+5
        //1.等于开始时次 等于结束时次 在这个时间范围内
        //当前进行时间
        if (self.Anime_BeginTime.isBefore(m_momentTime) && self.Anime_EndTime.isAfter(m_momentTime)) {
            console.log("isin!");
            //在时间范围内
            //判断是否已经进行 运行时间 大于当前时间 则已经进行
            if (self.AnimeDate.isBefore(m_momentTime)) {
                ShowLayer_DataSVG = '<g style="width: 12px;height: 40px;fill:#102f8c" class="tick_Data_Show1"'
                    + ' transform="translate(' + ShowTransLate + ')">'
                    + '<rect class="DayRect1 Btn_MinuteRect1"  style="fill:#102f8c;opacity: 0.5;" x="0.2" y="0" width="12.5" height="55"></rect> '
                    + '</g>';
            }
            else {
                ShowLayer_DataSVG = '<g style="width: 12px;height: 40px;fill:#8eb9cc" class="tick_Data_Show1"'
                    + 'transform="translate(' + ShowTransLate + ')"> '
                    + '<rect class="DayRect1 Btn_MinuteRect1"  style="fill:#8eb9cc;opacity: 0.5;" x="0.2" y="0" width="12.5" height="55"></rect> '
                    + '</g>';
            }
        }

        return ShowLayer_DataSVG;

    }


}




