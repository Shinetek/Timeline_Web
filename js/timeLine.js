/**
 * Created by lenovo on 2017/10/17.
 */
var TimeLine = function () {
    var _self = this;

    /**
     * 当前选择日期 精确到时分秒
     * @type {Date}
     */
    _self.TimeLineDate = new Date();
    var Year_Show = _self.TimeLineDate.getUTCFullYear();
    var Month_Show = _self.TimeLineDate.getMonth() + 1;
    var Day_Show = _self.TimeLineDate.getDate();
    var Hour_Show = _self.TimeLineDate.getHours();
    var Minute_Show = _self.TimeLineDate.getMinutes();

    /**
     * 整体显示 -- 当前浏览器类型
     * @type {string}
     */
    _self.browserType = "";

    /**
     *整体显示 -- 目标div ID
     * @type {string}
     */
    _self.IDName = '';

    /**
     * 显示模式  默认使用月模式
     * Year_Mode Month_Mode Day_Mode Minute_Mode
     * @type {string}
     */
    _self.ShowMode = "Minute_Mode";

    /**
     * 当前显示模式 是都显示TimeLineSVG
     * true 显示时间轴
     * false 显示时间轴
     * @type {boolean}
     */
    _self.Is_ShowSVGLine = true;

    var _yearModeClass = new YearModeClass();
    var _monthModeClass = new MonthModeClass();
    var _dayModeClass = new YearModeClass();
    var _minuteModeClass = new YearModeClass();

    _self.ShowModeClass = _yearModeClass;
    _self.LayerDataInfo = [];

    /**
     *
     * @param DIVid
     * @param initMode
     * @constructor
     */
    _self.init = function (DIVid, initMode) {
        //获取当前浏览器类型
        _self.browserType = _setModeIE();
        //用DIVid 赋值
        _self.IDName = DIVid;
        //对初始化的类型赋值
        switch (initMode) {
            case "YEAR":
            {
                _self.ShowMode = "Year_Mode";
                break;
            }
            case "MONTH":
            {
                _self.ShowMode = "Month_Mode";
                break;
            }
            case "DAY":
            {
                _self.ShowMode = "Day_Mode";
                break;
            }
            case "MINUTE":
            {
                _self.ShowMode = "Minute_Mode";
                break;
            }
            default:
            {
                _self.ShowMode = "Day_Mode";
                //默认使用天显示 模式
                break;
            }
        }
        _initShow();
        _initDateClickFunc();
    };

    /**
     * 数值修改触发函数 外部重写此函数 获取修改事件
     * @constructor
     */
    _self.DateTimeChange = function () {
        $("#" + _self.IDName).trigger("DateTimeChange", [_self.TimeLineDate]);
    };


    /**
     *
     * @returns {*}
     * @private
     */
    var _setModeIE = function () {
        var explorer = window.navigator.userAgent;

        if (navigator.userAgent.indexOf("Trident") > 0 || navigator.userAgent.indexOf("Edge") > 0) {
            return "Edge";
        }
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            return "MSIE";
        }
        if (navigator.userAgent.indexOf("Firefox") > 0) {
            return "Firefox";
        }
        if (explorer.indexOf("Chrome") >= 0) {
            return "Chrome";
        }
        if (navigator.userAgent.indexOf("Safari") > 0) {
            return "Safari";
        }
        if (navigator.userAgent.indexOf("Camino") > 0) {
            return "Camino";
        }
        if (navigator.userAgent.indexOf("Gecko/") > 0) {
            return "Gecko";
        }
        if (explorer.indexOf("Opera") >= 0) {
            return "Opera";
        }
        return "unknown";
    };

    /**
     *  对 当前控件宽度 进行控制
     * @private
     */
    var _getFullModeWidth = function () {

        if (_self.IDName === '') {
            return;
        }
        var m_browserType = _self.browserType;
        var m_DIVID = _self.IDName;
        var m_ClassADD = document.getElementById(m_DIVID);
        var TimeLineTotalDIV = document.getElementById("ShowTimeLine");
        var TimeLineList = document.getElementsByClassName("svg_ALL");
        var Total_Witdh = 0;

        switch (m_browserType) {

            case 'Chrome':
            {
                // 总宽度
                var TotalWidth = (document.documentElement.scrollWidth > document.documentElement.clientWidth)
                    ? document.documentElement.scrollWidth : document.documentElement.scrollWidth;
                Total_Witdh = TotalWidth;
                //设置整体控件宽度
                if (TotalWidth > 380) {
                    document.getElementById(m_DIVID).style.width = TotalWidth;
                } else {
                    document.getElementById(m_DIVID).style.width = 380;
                }

                //右侧SVGTimeLine高度
                var SVGWitdh = 0;
                SVGWitdh = TotalWidth - 490;
                //设置TimeLine宽度
                TimeLineTotalDIV.style.width = TotalWidth - 360;

                //SVG列表 设置宽度
                for (var j = 0; j < TimeLineList.length; j++) {
                    TimeLineList[j].style.width = SVGWitdh;
                }
                break;
            }
            //chrome 浏览器
            case 'Firefox':
            {
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
                break;
            }
            case "MSIE":
            {
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
                for (var ti = 0; ti < TimeLineList.length; ti++) {
                    TimeLineList[ti].style.width = SVGWitdh_MSIE + "px";
                }
                //右侧SVGTimeLine宽度
                TimeLineTotalDIV.style.width = (TotalWidth_MSIE - 360) + "px";
                break;
            }
            case 'Edge':
            {
                var curW = document.documentElement.clientWidth || document.body.clientWidth;
                //var curH = document.documentElement.clientHeight || document.body.clientHeight;
                //  console.log('Edge:' + curW);

                // 总宽度
                var TotalWidth_Edge = curW - 20;
                Total_Witdh = TotalWidth_Edge;
                //设置TimeLine DIV宽度
                if (TotalWidth_Edge > 360) {
                    m_ClassADD.style.width = TotalWidth_Edge + "px";
                } else {
                    m_ClassADD.style.width = 360 + "px";
                }
                //SVG列表 设置宽度
                var SVGWitdh_Edge = TotalWidth_Edge - 490;
                for (var tj = 0; tj < TimeLineList.length; tj++) {
                    TimeLineList[tj].style.width = SVGWitdh_Edge + "px";
                }
                //右侧SVGTimeLine宽度
                TimeLineTotalDIV.style.width = (TotalWidth_Edge - 360) + "px";
                break;
            }
            default:
            {
                break;
            }
        }

        //495
        var ShowTimeLine = document.getElementsByClassName("TimeLineTotalDiv");
        if (Total_Witdh < 495) {
            for (var i = 0; i < ShowTimeLine.length; i++) {
                ShowTimeLine[i].style.display = "none";
            }
            _self.Is_ShowSVGLine = false;
        } else {
            //var ShowTimeLine = document.getElementsByClassName("TimeLineTotalDiv");
            for (var t1 = 0; t1 < ShowTimeLine.length; t1++) {
                ShowTimeLine[t1].style.display = "block";
            }
            _self.Is_ShowSVGLine = true;
        }
        //根据新长度计算当前显示宽度值
        if (Total_Witdh !== 0 && Total_Witdh > 0) {
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
     * 初始化基础显示
     * @private
     */
    var _initShow = function () {
        var m_ID = _self.IDName;
        //左侧时间选择
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
            + '<svg width="25" height="100" xmlns="http://www.w3.org/2000/svg">'
            + '<g>'
            + '<title>展开/隐藏</title>'
            + '<path id="svg_1" d="m3,55.94447l19,0l0,4l-19,0l0,-4z" stroke-width="0" stroke="#000" fill="#fff"/>'
            + '<path id="svg_2" d="m3,47.94447l19,0l0,4l-19,0l0,-4z" stroke-width="0" stroke="#000" fill="#fff"/>'
            + '<path id="svg_3" d="m3,39.94447l19,0l0,4l-19,0l0,-4z" stroke-width="0" stroke="#000" fill="#fff"/>'
            + '</svg>'
            + '</div>';

        var m_ShowDiv = document.getElementById(m_ID);
        //初始化
        m_ShowDiv.innerHTML = ShowAll;

        try {
            m_ShowDiv.style.position = "fixed";
            m_ShowDiv.style.bottom = 0;
            m_ShowDiv.style.left = 0;
        } catch (err) {
            console.log(err);
        }
        //根据窗口设置宽度
        _getFullModeWidth(m_ID);
    };


    /**
     * 初始化各种点击事件
     * @private
     */
    var _initDateClickFunc = function () {
        //初始化时间
        _self.TimeLineDate = new Date();
        Year_Show = _self.TimeLineDate.getUTCFullYear();
        Month_Show = _self.TimeLineDate.getUTCMonth() + 1;
        Day_Show = _self.TimeLineDate.getUTCDate();
        Hour_Show = _self.TimeLineDate.getUTCHours();
        Minute_Show = _self.TimeLineDate.getUTCMinutes();

        /*初始化点击事件*/
        //年月日 加一 函数赋值
        var m_btn_AddYear = document.getElementById("btn_AddYear");
        m_btn_AddYear.onclick = _addOneYear;
        var btn_AddMonth = document.getElementById("btn_AddMonth");
        btn_AddMonth.onclick = _addOneMonth;
        var btn_AddDay = document.getElementById("btn_AddDay");
        btn_AddDay.onclick = _addOneDay;

        //年月日 减一 函数赋值
        var btn_MinusYear = document.getElementById("btn_MinusYear");
        btn_MinusYear.onclick = _minusOneYear;
        var btn_MinusMonth = document.getElementById("btn_MinusMonth");
        btn_MinusMonth.onclick = _minusOneMonth;
        var btn_MinusDay = document.getElementById("btn_MinusDay");
        btn_MinusDay.onclick = _minusOneDay;

        //初始化设置时间选择值 重新 赋值
        document.getElementById('txt_Year').value = Year_Show.toString();
        document.getElementById('txt_Month').value = Month_Show.toString();
        document.getElementById('txt_Day').value = Day_Show.toString();


        //设置点击事件
        var m_btn_ShowYear = document.getElementsByClassName('btn_ShowYear');
        for (var i = 0; i < m_btn_ShowYear.length; i++) {
            m_btn_ShowYear[i].onclick = _showYearMode;
        }

        var m_btn_ShowMonth = document.getElementsByClassName('btn_ShowMonth');
        for (var k = 0; k < m_btn_ShowMonth.length; k++) {
            m_btn_ShowMonth[k].onclick = _showMonthMode;
        }

        var m_btn_ShowDay = document.getElementsByClassName('btn_ShowDay');
        for (var j = 0; j < m_btn_ShowDay.length; j++) {
            //    m_btn_ShowDay[j].onclick = _showDayMode;
        }

        var m_btn_ShowMinute = document.getElementsByClassName('btn_ShowMinute');
        for (var w = 0; w < m_btn_ShowMinute.length; w++) {
            //  m_btn_ShowMinute[w].onclick = _showMinuteMode;
        }

        //设置左右点击事件
        //向左减一天
        var btn_MinusDay_Left = document.getElementById("btn_BeforeTime");
        btn_MinusDay_Left.onclick = _minusOneDay;
        //向右加一天
        var btn_AddDay_Right = document.getElementById("btn_AfterTime");
        btn_AddDay_Right.onclick = _addOneDay;

        //伸缩点击事件
        var m_btn_ShowTimeLine = document.getElementById('ShowHidebtn');
        m_btn_ShowTimeLine.onclick = _clickShowAndHide;
        //调用初始化函数
        _initTimeLineShow();
    };

    /**
     * 初始化 显示TimeLine div
     * @private
     */
    var _initTimeLineShow = function () {
        switch (_self.ShowMode) {
            case "Year_Mode":
            {
                //  Year_SVGMove(0);
                _showYearMode();
                break;
            }
            case "Month_Mode":
            {
                // InitMonthTimeLineShow(2009);
                _showMonthMode();
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
     * 添加一年
     * @private
     */
    var _addOneYear = function () {
        var momentStr = (moment(self.TimeLineDate).add(1, 'year') - moment(self.TimeLineDate)) / 1000 / 3600 / 24;


        //todo 添加 位移函数

        _self.TimeLineDate = new Date(moment(self.TimeLineDate).add(1, 'year'));
        _self.ShowModeClass.reSetDate(self.TimeLineDate);
        _refreshTimeShow();
    };

    /**
     * 添加一个月
     * @private
     */
    var _addOneMonth = function () {
        //    var momentStr = (  moment(self.TimeLineDate).add(1, 'month') - moment(self.TimeLineDate)) / 1000 / 3600 / 24;
        _self.TimeLineDate = new Date(moment(_self.TimeLineDate).add(1, 'month'));

        _refreshTimeShow();
    };


    /**
     * 添加一天
     * @private
     */
    var _addOneDay = function () {
        //TimeLineDate  添加一天
        _self.TimeLineDate = new Date(moment(_self.TimeLineDate).add(1, 'day'));
        //重设位移值 年位移位置

        //天模式
        // m_Trans_Day = m_Trans_Day - 12.5;
        //分钟位移位置 修改为1分钟模式
        //  m_Trans_Minute = m_Trans_Minute - 12.5 * 60 * 24;
        _refreshTimeShow();
    };


    /**
     * 减一天
     * @private
     */
    var _minusOneDay = function () {
        _self.TimeLineDate = new Date(moment(_self.TimeLineDate).add(-1, 'day'));
        //分钟模式
        // m_Trans_Minute = m_Trans_Minute + 12.5 * 60 * 24;
        //天模式
        // m_Trans_Day = m_Trans_Day + 12.5;
        _refreshTimeShow();
    };


    /**
     * 整体显示 --属性新当前显示
     * @private
     */
    var _refreshTimeShow = function () {
        console.log('_refreshTimeShow');
        //根据当前选择时间获取 年月日
        Year_Show = _self.TimeLineDate.getUTCFullYear();
        Month_Show = _self.TimeLineDate.getMonth() + 1;
        Day_Show = _self.TimeLineDate.getDate();
        Hour_Show = _self.TimeLineDate.getHours();
        Minute_Show = _self.TimeLineDate.getMinutes();
        //年月日赋值显示
        document.getElementById('txt_Year').value = Year_Show.toString();
        document.getElementById('txt_Month').value = Month_Show.toString();
        document.getElementById('txt_Day').value = Day_Show.toString();
        //调用数据修改函数 ，触发外部func
        _self.DateTimeChange();
    };


    /**
     * 减一个月
     * @private
     */
    var _minusOneMonth = function () {
        //  var momentStr = (moment(_self.TimeLineDate) - moment(_self.TimeLineDate).add(-1, 'month')) / 1000 / 3600 / 24;
        _self.TimeLineDate = new Date(moment(_self.TimeLineDate).add(-1, 'month'));
        //m_Trans_Minute = m_Trans_Minute + 12.5 * 24 * 60 * momentStr;


        //天模式
        //m_Trans_Day = m_Trans_Day + 12.5 * momentStr;
        _refreshTimeShow();
    };

    /**
     * 减一年
     * @private
     */
    var _minusOneYear = function () {
        //年份 的天
        // var momentStr = (moment(self.TimeLineDate) - moment(self.TimeLineDate).add(-1, 'year')) / 1000 / 3600 / 24;

        _self.TimeLineDate = new Date(moment.utc(self.TimeLineDate).add(-1, 'year'));
        /*   //分钟模式
         m_Trans_Minute = m_Trans_Minute + momentStr * 12.5 * 24 * 60;
         //天模式
         m_Trans_Day = m_Trans_Day + 12.5 * momentStr;*/
        _refreshTimeShow();
    };

    /**
     * 整体显示 --  点击按钮 伸缩界面 事件
     * @private
     */
    var _clickShowAndHide = function () {
        //获取TimeLine 部分的DIV
        var ShowTimeLine = document.getElementsByClassName("TimeLineTotalDiv");
        //如果当前显示为全部
        if (self.Is_ShowSVGLine) {
            for (var i = 0; i < ShowTimeLine.length; i++) {
                ShowTimeLine[i].style.display = "none";
            }
            _self.Is_ShowSVGLine = false;
        } else {
            //如果当前为压缩模式 修改为伸缩模式
            for (var j = 0; j < ShowTimeLine.length; j++) {
                ShowTimeLine[j].style.display = "block";
            }
            _self.Is_ShowSVGLine = true;
            //伸长后重绘界面 重新计算
            _getFullModeWidth(self.IDName);
        }
    };

    /**
     * 整体显示 --  显示年选择模式
     * @private
     */
    var _showYearMode = function () {
        console.log('_showYearMode');
        var m_Show_YearDiv = document.getElementById("Show_YearDiv");
        var m_Show_MonthDiv = document.getElementById("Show_MonthDiv");
        var m_Show_DayDiv = document.getElementById("Show_DayDiv");
        var m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv");

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

        //  _yearModeClass.mouseMoveFunc(0);
        _self.ShowMode = "Year_Mode";
        _self.ShowModeClass = _yearModeClass;
        _self.ShowModeClass.init(_self.TimeLineDate, _self.LayerDataInfo, _onDataChangeFunc);
    };


    /**
     * 整体显示 -- 显示月显示模式
     * @private
     */
    var _showMonthMode = function () {

        var m_Show_YearDiv = document.getElementById("Show_YearDiv");
        var m_Show_MonthDiv = document.getElementById("Show_MonthDiv");
        var m_Show_DayDiv = document.getElementById("Show_DayDiv");
        var m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv");

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
        _self.ShowMode = "Month_Mode";
        //计算 差值 每一年 差值150
        _self.ShowModeClass = _monthModeClass;
        _self.ShowModeClass.init(_self.TimeLineDate, _self.LayerDataInfo);
    };


    /**
     *
     * @param newDate
     * @private
     */
    var _onDataChangeFunc = function (newDate) {
        console.log('_onDataChangeFunc');
        _self.TimeLineDate = newDate;
        _refreshTimeShow();
    };


    /**
     *
     * @type {TimeLine.AddMinuteData}
     */
    _self.AddYearData = _self.AddMonthData = _self.AddDayData = _self.AddMinuteData = function (m_InsertData) {
        //调用最新的重构函数
        _addLayerInfoData(m_InsertData);
    };


    var _addLayerInfoData = function (insertData) {

        var LengthAddCount = insertData.length;
        //对于每一个添加的变量
        if (LengthAddCount) {
            for (var i = 0; i < LengthAddCount; i++) {
                var m_ADDItem = insertData[i];
                _self.LayerDataInfo.push(m_ADDItem);
            }
        }
        _self.ShowModeClass.reSetDataInfo(_self.LayerDataInfo);
    }
};
var YearModeClass = function () {
    //绘制年 的计数
    var _self = this;
    _self.ClassDate = new Date();

    var Trans_YearPix = 50;
    var isMove_Year = false;

    //鼠标 X 当前位置和 前一个位置
    var x_Year = 0;
    var X_Before_Year = 0;

    var YearDataInfo = [];

    /**
     *
     * @param dateSt
     * @private
     */
    var _init = function (dateStr, DataIndfo, onChangeFunc) {
        console.log("year init");
        _self.ClassDate = dateStr;
        YearDataInfo = DataIndfo;

        _mouseMove_Year_Func(0);
        _initMouseMove();
        _self.onchange = onChangeFunc;
        //  _mouseMove_Year(0);
    };

    function _initMouseMove() {
        var m_ShowTimeLineDiv_Year = document.getElementById("ShowTimeLineDiv_Year");
        m_ShowTimeLineDiv_Year.onmousedown = _getMouseDown_Year;
        m_ShowTimeLineDiv_Year.onmouseup = _getMouseUP_Year;
        m_ShowTimeLineDiv_Year.onmouseout = _getMouseOut_Year;
        m_ShowTimeLineDiv_Year.onmousemove = _mouseMove_Year;
    }


    /**
     * 年模式 鼠标左键按下
     * @param event
     * @private
     */
    var _getMouseDown_Year = function (event) {
        isMove_Year = true;
        event = event || window.event;
        x_Year = event.clientX;
        X_Before_Year = x_Year;
    };


    /**
     * 年模式--鼠标左键抬起
     * @param event
     * @private
     */
    var _getMouseUP_Year = function (event) {
        event = event || window.event;
        isMove_Year = false;
        x_Year = event.clientX;
        //X_Before_Year = x_Year;
    };

    /**
     * 年模式 --鼠标移出DIV
     * @private
     */
    var _getMouseOut_Year = function () {
        if (_self.browserType !== "Firefox" && _self.browserType !== 'Edge') {
            isMove_Year = false;
        }
    };


    /**
     * 年模式 --鼠标移动事件
     * @param evt
     * @private
     */
    var _mouseMove_Year = function (evt) {
        if (isMove_Year) {
            evt = evt || window.event;
            x_Year = evt.clientX;
            var DrgNum = X_Before_Year - x_Year;

            X_Before_Year = x_Year;
            if (DrgNum >= 2 || DrgNum <= -2) {
                _mouseMove_Year_Func(DrgNum);
            }
        }
    };


    /**
     * 年模式 -- 位移事件
     * @param transform 位移位置
     * @private
     */
    var _mouseMove_Year_Func = function (transform) {
        //计算当前最新位移
        Trans_YearPix = Trans_YearPix - transform;
        //获取遍历赋值的局部位移 初始量
        var Trans_now = Trans_YearPix;
        //获取年时间轴的DIV
        var m_ShowSVG_Year = document.getElementById("SVG_Year_Total");
        //初始化比较字符串
        var TimeLineDate_YearStr = moment(_self.ClassDate).format('YYYY');
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
                //
                if (TimeLineDate_YearStr.toString() === YearClick.toString()) {
                    console.log(TimeLineDate_YearStr + ':' + YearClick);
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
                YearShow = YearShow + TimeGar;

                //通过当前时间 绘制背景的数据svg
                var SVG_Data = _getYearMode_DataShowList(YearClick, Trans);

                var IsTitle = "";
                //IE状态下对年Title进行缩放
                if (_self.browserType !== "MSIE") {
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
        if (_self.browserType !== "MSIE") {
            m_ShowSVG_Year.innerHTML = YearTotal;
            $("#SVG_Year_Total").html(YearTotal);
        } else {
            $("#SVG_Year_Total").html(YearTotal);
        }

        var m_Btn_YearRectList = document.getElementsByClassName('Btn_YearRect');
        for (var w = 0; w < m_Btn_YearRectList.length; w++) {
            m_Btn_YearRectList[w].onclick = function () {
                _btnClickGetYear(this);
            };
        }
    };

    /**
     * 年模式 -- 点击事件
     * @param event
     */
    var _btnClickGetYear = function (event) {
        //  console.log('new Data ' + _self.ClassDate);
        //调用设置年函数
        var clickDate = new Date(event.getAttribute("value"));
        var _Year = clickDate.getFullYear();
        if (_Year) {
            var Year_Show = parseInt(_Year).toString();
            var Month_Show = _self.ClassDate.getUTCMonth() + 1;
            var Day_Show = _self.ClassDate.getUTCDate();
            var Hour_Show = _self.ClassDate.getUTCHours();
            var Minute_Show = _self.ClassDate.getUTCMinutes();
            _self.ClassDate = new Date(Year_Show, Month_Show - 1, Day_Show, Hour_Show, Minute_Show, 0);
            console.log('new Data ' + _self.ClassDate);
            _mouseMove_Year_Func(0);
            _self.onchange(_self.ClassDate);
            return _self.ClassDate;
        } else {
            return _self.ClassDate;
        }
    };


    /**
     * 年模式 -- 获取月模式的数据显示SVG 内容函数 输入传入的年时间和当前年时间的位移
     * @param Show_YearDate
     * @param ShowTransLate
     * @returns {*}
     * @private
     */
    var _getYearMode_DataShowList = function (Show_YearDate, ShowTransLate) {
        Show_YearDate = Show_YearDate.toString();
        //若数据长度为0 则返回空
        if (YearDataInfo.length === 0 || !YearDataInfo.length) {
            return '';
        }
        //数据整体svg
        var ShowLayer_DataSVG = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show"'
            + ' transform="translate(' + ShowTransLate + ')">';
        //日期格式赋值

        //是否显示列表
        var IsDataShowList = [];
        var DataMomentBegin = moment.utc(Show_YearDate);
        var DataMomentEnd = moment.utc(Show_YearDate).add(1.0, 'year');
        var TimeSpace = DataMomentEnd - DataMomentBegin;
        IsDataShowList = _checkDataTimeExistStatus(DataMomentBegin, DataMomentEnd, TimeSpace);

        //判定是否有数据条填充 若无填充 则返回空值
        var IS_ShowTag = false;

        var rect_Height = Math.round(40 / YearDataInfo.length, 2);
        if (rect_Height > 10) {
            rect_Height = 10;
        }
        for (var i = 0; i < YearDataInfo.length; i++) {
            var DateRect = '';
            var Rect_Y = i * rect_Height;
            //生成RECT 样式
            if (IsDataShowList[i].isExist === true) {
                //获取当前图层是否显示信息
                var Ishow = IsDataShowList[i].isShow;
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
            } else {
                //若没有数据 则为空
                DateRect = '';
            }
            //组成矩阵
            ShowLayer_DataSVG = ShowLayer_DataSVG + DateRect;
        }
        ShowLayer_DataSVG = ShowLayer_DataSVG + '</g>';
        if (IS_ShowTag === false) {
            ShowLayer_DataSVG = '';
        }
        return ShowLayer_DataSVG;
    };


    /**
     * 根据当前数据 获取存在状态
     * @param BeginTime_moment
     * @param EndTimeStr_moment
     * @param MinuteTimeBase
     * @returns {*[]}
     * @private
     */
    var _checkDataTimeExistStatus = function (BeginTime_moment, EndTimeStr_moment, MinuteTimeBase) {
        //
        // MinuteTimeBase = 1000 * 60;
        //MinuteTimeBase = MinuteTimeBase;
        var TimeCompare_begin = BeginTime_moment;

        var TimeCompare_end = EndTimeStr_moment;
        //根据不用模式对 当前开始结束时间 进行比较、

        //根据当前的 timeStr 对是否存在数据进行返回
        var ShowModeWidth = 12.5;
        //返回一个 n维数组
        var ExistReturn = [{
            "isExist": true,
            "isShow": true,
            "Width": "",
            "isBofore": "",
            "isEnd": ""
        }, {"isExist": true, "isShow": true, "Width": 0, "isBofore": "", "isEnd": ""}];
        ExistReturn = [];
        //处理JSON
        YearDataInfo.forEach(function (DataJsonItem) {
            var ExistReturnItem = {
                "isExist": false,
                "isShow": false,
                "Width": 0,
                "isAll": false,
                "isBofore": false,
                "isEnd": false
            };
            var DataInfo = DataJsonItem.DataInfo;
            if (DataInfo.length > 0) {
                //遍历每一个时段 对 当前时间段内的数据存在进行查找。
                DataInfo.forEach(function (DataTimeItem) {
                    var BeginTime = moment.utc(DataTimeItem.BeginTime);
                    var EndTime = moment.utc(DataTimeItem.EndTime);

                    //存在数据时间 完全包含 数据存在字段 |11|
                    if (BeginTime - TimeCompare_begin > 0 && TimeCompare_end - EndTime > 0) {
                        ExistReturnItem.Width = BeginTime - EndTime / MinuteTimeBase * ShowModeWidth;
                        ExistReturnItem.isExist = true;
                        ExistReturnItem.Width = ShowModeWidth;
                        ExistReturnItem.isAll = true;
                    }

                    //当前时间 在范围内 1||1
                    if (TimeCompare_begin - BeginTime > 0 && EndTime - TimeCompare_end > 0) {
                        ExistReturnItem.isExist = true;
                        ExistReturnItem.Width = ShowModeWidth;
                        ExistReturnItem.isAll = true;
                    }
                    //时间段 前半段 |1|1
                    if (EndTime - TimeCompare_begin > 0 && TimeCompare_end - EndTime > 0) {
                        ExistReturnItem.isExist = true;
                        var WitdhBefore = (EndTime - TimeCompare_begin) / MinuteTimeBase * ShowModeWidth;
                        ExistReturnItem.Width = WitdhBefore;
                        ExistReturnItem.isAll = false;
                        ExistReturnItem.isBofore = true;
                    }
                    //时间段  后半段 1|1|
                    if (BeginTime - TimeCompare_begin > 0 && TimeCompare_end - BeginTime > 0) {
                        ExistReturnItem.isExist = true;
                        var WitdhAfter = (BeginTime - TimeCompare_end) / MinuteTimeBase * ShowModeWidth;
                        ExistReturnItem.Width = WitdhAfter;
                        ExistReturnItem.isAll = false;
                        ExistReturnItem.isEnd = true;
                    }

                });
            }
            //设置查找
            ExistReturnItem.isShow = DataJsonItem.Layeris_Show;
            ExistReturn.push(ExistReturnItem);
        });
        return ExistReturn;
    };

    /**
     *  设置为新时间
     * @param newDate
     * @private
     */
    var _reSetDate = function (newDate) {
        _self.ClassDate = newDate;
        var trans = parseInt(moment.utc(newDate).format("YYYY")) - parseInt(moment.utc(newDate).format("YYYY"));
        var transPix = trans * 12.5;
        _mouseMove_Year(transPix);
    };

    var _reSetDataInfo = function (newDataInfo) {
        YearDataInfo = newDataInfo;
        _mouseMove_Year_Func(0);
    };


    _self.init = _init;
    // _self.onchange = onchangeFunc;
    _self.reSetDate = _reSetDate;
    _self.mouseMoveFunc = _mouseMove_Year;
    _self.reSetDataInfo = _reSetDataInfo;
    return _self
};

var MonthModeClass = function () {
    var _self = this;
    _self.ClassDate = new Date();
    /* 月模式 鼠标 操作 变量*/
    var isMove_Month = false;
    var x_Month = 0;
    var x_Before_Month = 0;
    var m_Trans_Month = -150;


    /**
     * 根据 年月日 和 数据项初始化
     * @param dateStr
     * @param DataInfo
     * @private
     */
    var _init = function (dateStr, DataInfo) {
        _self.ClassDate = dateStr;
        _getMouseMove_MonthFunc(0);
        _initMouseMove();
    };


    /**
     * 设置DIV移动事件
     * @private
     */
    var _initMouseMove = function () {
        console.log('_initMouseMove');
        var m_ShowTimeLineDiv_Year = document.getElementById("ShowTimeLineDiv_Year");
        m_ShowTimeLineDiv_Year.onmousedown = _getMouseDown_Month;
        m_ShowTimeLineDiv_Year.onmouseup = _getMouseUP_Month;
        m_ShowTimeLineDiv_Year.onmouseout = _getMouseOut_Month;
        m_ShowTimeLineDiv_Year.onmousemove = _getMouseMove_Month;
    };

    /**
     * 月模式 -- 鼠标down事件
     * @param event
     * @private
     */
    var _getMouseDown_Month = function (event) {
        event = event || window.event;
        x_Month = event.clientX;
        x_Before_Month = x_Month;
        isMove_Month = true;
    };

    /**
     * 月模式 -- 鼠标抬起事件
     * @param event
     * @private
     */
    var _getMouseUP_Month = function (event) {
        isMove_Month = false;
    };


    /**
     * 月模式 -- 鼠标移出事件
     * @param event
     * @private
     */
    var _getMouseOut_Month = function (event) {
        if (self.browserType !== "Firefox" && self.browserType !== 'Edge') {
            isMove_Month = false;
        }
    };
    /**
     * 月模式 -- 鼠标移动事件
     * @param event
     * @private
     */
    var _getMouseMove_Month = function (event) {
        event = event || window.event;
        if (isMove_Month) {
            x_Month = event.clientX;
            var DrgNum = x_Before_Month - x_Month;
            if (DrgNum >= 1 || DrgNum <= -1) {
                x_Before_Month = x_Month;
                _getMouseMove_MonthFunc(DrgNum);
            }
        }
    };


    /**
     *
     * @param tarnsform
     * @private
     */
    var _getMouseMove_MonthFunc = function (tarnsform) {
        console.log('_getMouseMove_MonthFunc');
        var MonthBegin_Date = moment.utc(_self.ClassDate).add(-3.0, "years");
        //获取 月模式下 SVG的DIV
        var m_ShowSVG = document.getElementById("ShowSVG");
        //循环添加
        var InnerSvgTotal = "";
        m_Trans_Month = m_Trans_Month - tarnsform;
        while (m_Trans_Month > 0) {
            MonthBegin_Date = new Date(moment(MonthBegin_Date).add(-1.0, 'year'));
            m_Trans_Month = m_Trans_Month - 12.5 * 12;
        }
        while (m_Trans_Month < -150) {
            MonthBegin_Date = new Date(moment(MonthBegin_Date).add(1.0, 'year'));
            m_Trans_Month = m_Trans_Month + 12.5 * 12;
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
                MonthData_Svg = _getMothMode_DataShowList(ShowDateStr, TransMonth);

                var MonthSVG = '<g class="tick_Year_One" transform="translate(' + TransMonth + ')">'
                    + '<rect x="0.2" y="0" width="12.5" height="55" class="DayRect Btn_MonthRect" value="' + ShowDateStr + '">'
                    + '<title>' + ShowDateStr + '</title>'
                    + '</rect>'
                    + '<line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line>'
                    + '</g>';

                if (TimeShowStr_Month === ShowDateStr) {
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
        if (self.browserType !== "MSIE") {
            m_ShowSVG.innerHTML = InnerSvgTotal;
        } else {
            // console.log("IE innerHTML");
            $("#ShowSVG").html(InnerSvgTotal);
        }
        //绑定点击事件
        var m_MonthRectList = document.getElementsByClassName("Btn_MonthRect");
        for (var i = 0; i < m_MonthRectList.length; i++) {
            m_MonthRectList[i].onclick = function () {
                _btnClickMonth(this);
            }
        }
    };


    /**
     * 设置年月  函数
     * @param enevt
     * @returns {Date|*}
     * @private
     */
    var _btnClickMonth = function (enevt) {
        var TimeStr = enevt.getAttribute("value");
        var new_Year = TimeStr.split("-")[0];
        var new_Month = TimeStr.split("-")[1];

        if (new_Year && new_Month) {
            var Day_Show = _self.ClassDate.getUTCDate();
            var Hour_Show = _self.ClassDate.getUTCHours();
            var Minute_Show = _self.ClassDate.getUTCMinutes();

            var Year_Show = parseInt(new_Year).toString();
            var Month_Show = parseInt(new_Month).toString();
            //设置年月日
            _self.ClassDate = new Date(Year_Show, Month_Show - 1, Day_Show, Hour_Show, Minute_Show, 0);
            // RefreshTimeShow();
            console.log('new DateMonth :' + _self.ClassDate);
            _getMouseMove_MonthFunc(0);
            return _self.ClassDate;
        } else {
            return _self.ClassDate;
        }
    };

    /**
     * 月模式 -- 获取月模式的数据显示SVG 内容函数
     * @param Show_MonthDate
     * @param ShowTransLate 位移数据
     * @returns {*}
     * @constructor
     */
    var _getMothMode_DataShowList = function (Show_MonthDate, ShowTransLate) {

        if (!_self.DataInfo || !_self.DataInfo.length) {
            return "";
        }
        var ShowLayer_DataSVG = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show"'
            + ' transform="translate(' + ShowTransLate + ')">';

        //日期格式赋值
        var Date_Rect = Show_MonthDate;
        //是否显示列表
        var IsDataShowList = [];
        var DataMomentBegin = moment.utc(Show_MonthDate);
        var DataMomentEnd = moment.utc(Show_MonthDate).add(1.0, 'month');
        var TimeSpace = DataMomentEnd - DataMomentBegin;
        IsDataShowList = _checkDataTimeExistStatus(DataMomentBegin, DataMomentEnd, TimeSpace);

        //查找是否存在数据
        /*  for (var k = 0; k < IsDataShowList.length; k++) {
         var is_ShowTag = false;
         var m_DataInfo_i = IsDataShowList[k];
         IsDataShowList.push(m_DataInfo_i);
         }*/

        //生成基于 数据的是否显示Ture False 列表　使用列表初始化显示
        var rect_Height = Math.round(40 / m_MonthModeData.length, 2);

        if (rect_Height > 10) {
            rect_Height = 10;
        }
        var Rect_ShowHeight = rect_Height - 0.8;
        //遍历获取
        for (var i = 0; i < IsDataShowList.length; i++) {
            var DateRect = '';
            var Rect_Y = i * rect_Height;
            //生成RECT 样式
            if (IsDataShowList[i].isExist === true) {
                //获取当前图层是否显示信息
                var IsData_show = IsDataShowList[i].isShow;
                var RectLineEnd = Rect_Y + rect_Height - 0.2;
                //根据显示情况
                if (IsData_show) {
                    //若该图层显示 则为蓝色
                    DateRect = '<rect class="Rect_Data_Show" x="0" y="' + Rect_Y + '" width="12.5" height="' + Rect_ShowHeight + '" ></rect>'
                        + '<line x1="0" x2="12.5" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="12.5" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                } else {
                    //有数据 但是当前列 不显示 则为灰色
                    DateRect = '<rect class="Rect_Data_Hide" x="0" y="' + Rect_Y + '" width="12.5" height="' + Rect_ShowHeight + '" ></rect>'
                        + '<line x1="0" x2="12.5" y1="' + Rect_Y + '" y2="' + Rect_Y + '" class="Data_tick_Line"></line>'
                        + '<line x1="0" x2="12.5" y1="' + RectLineEnd + '" y2="' + RectLineEnd + '" class="Data_tick_Line"></line>';
                }
            } else {
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
     * 根据当前数据 获取存在状态
     * @param BeginTime_moment
     * @param EndTimeStr_moment
     * @param MinuteTimeBase
     * @returns {*[]}
     * @private
     */
    var _checkDataTimeExistStatus = function (BeginTime_moment, EndTimeStr_moment, MinuteTimeBase) {
        //
        // MinuteTimeBase = 1000 * 60;
        //MinuteTimeBase = MinuteTimeBase;
        var TimeCompare_begin = BeginTime_moment;

        var TimeCompare_end = EndTimeStr_moment;
        //根据不用模式对 当前开始结束时间 进行比较、

        //根据当前的 timeStr 对是否存在数据进行返回
        var ShowModeWidth = 12.5;
        //返回一个 n维数组
        var ExistReturn = [{
            "isExist": true,
            "isShow": true,
            "Width": "",
            "isBofore": "",
            "isEnd": ""
        }, {"isExist": true, "isShow": true, "Width": 0, "isBofore": "", "isEnd": ""}];
        ExistReturn = [];
        //处理JSON
        YearDataInfo.forEach(function (DataJsonItem) {
            var ExistReturnItem = {
                "isExist": false,
                "isShow": false,
                "Width": 0,
                "isAll": false,
                "isBofore": false,
                "isEnd": false
            };
            var DataInfo = DataJsonItem.DataInfo;
            if (DataInfo.length > 0) {
                //遍历每一个时段 对 当前时间段内的数据存在进行查找。
                DataInfo.forEach(function (DataTimeItem) {
                    var BeginTime = moment.utc(DataTimeItem.BeginTime);
                    var EndTime = moment.utc(DataTimeItem.EndTime);

                    //存在数据时间 完全包含 数据存在字段 |11|
                    if (BeginTime - TimeCompare_begin > 0 && TimeCompare_end - EndTime > 0) {
                        ExistReturnItem.Width = BeginTime - EndTime / MinuteTimeBase * ShowModeWidth;
                        ExistReturnItem.isExist = true;
                        ExistReturnItem.Width = ShowModeWidth;
                        ExistReturnItem.isAll = true;
                    }

                    //当前时间 在范围内 1||1
                    if (TimeCompare_begin - BeginTime > 0 && EndTime - TimeCompare_end > 0) {
                        ExistReturnItem.isExist = true;
                        ExistReturnItem.Width = ShowModeWidth;
                        ExistReturnItem.isAll = true;
                    }
                    //时间段 前半段 |1|1
                    if (EndTime - TimeCompare_begin > 0 && TimeCompare_end - EndTime > 0) {
                        ExistReturnItem.isExist = true;
                        var WitdhBefore = (EndTime - TimeCompare_begin) / MinuteTimeBase * ShowModeWidth;
                        ExistReturnItem.Width = WitdhBefore;
                        ExistReturnItem.isAll = false;
                        ExistReturnItem.isBofore = true;
                    }
                    //时间段  后半段 1|1|
                    if (BeginTime - TimeCompare_begin > 0 && TimeCompare_end - BeginTime > 0) {
                        ExistReturnItem.isExist = true;
                        var WitdhAfter = (BeginTime - TimeCompare_end) / MinuteTimeBase * ShowModeWidth;
                        ExistReturnItem.Width = WitdhAfter;
                        ExistReturnItem.isAll = false;
                        ExistReturnItem.isEnd = true;
                    }

                });
            }
            //设置查找
            ExistReturnItem.isShow = DataJsonItem.Layeris_Show;
            ExistReturn.push(ExistReturnItem);
        });
        return ExistReturn;
    };

    /**
     *  设置为新时间
     * @param newDate
     * @private
     */
    var _reSetDate = function (newDate) {
        _self.ClassDate = newDate;
        var trans = parseInt(moment.utc(newDate).format("YYYY")) - parseInt(moment.utc(newDate).format("YYYY"));
        var transPix = trans * 12.5;
        _mouseMove_Year(transPix);
    };

    var _reSetDataInfo = function (newDataInfo) {
        YearDataInfo = newDataInfo;
        _getMouseMove_MonthFunc(0);
    };

    _self.init = _init;
    _self.reSetDate = _reSetDate;
    _self.mouseMoveFunc = _getMouseMove_Month;
    _self.mouseMoveFunc = _reSetDataInfo;

    return _self
};

