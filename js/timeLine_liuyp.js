/**
 * Created by lenovo on 2017/10/23.
 */
(function (global) {

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, fromIndex) {
            if (fromIndex === null) {
                fromIndex = 0;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, this.length + fromIndex);
            }
            for (var i = fromIndex, j = this.length; i < j; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }

    "use strict";


    var TimeLine = global.TimeLine = function (options) {
        this.DateInfo = {};
        this.LayerDataInfo = {};
        this.GLOBALVAR = {};
        this.ModelStockCount = {};

        this.GLOBALVAR.ShowMode = options.timemode || "MONTH";

        this.GLOBALVAR.DIVID = options.divID;


        if (!this.GLOBALVAR.DIVID) {
            //  alert("需要制定一个 控件 DIV");
            return;
        }


        this.models = {};
        this.model_names = [];

        //初始化 显示
        this.initDIVShow();

        //以当前时间 为基准 进行位移显示
        this.drawSvg(0);
        return this;

    };


    // Backwards compatibility.
    TimeLine.init = function (options) {
        return new TimeLine(options);
    };


    TimeLine.prototype = {
        getDataInfo: function () {
            return this.GLOBALVAR;
        },
        /**
         *
         */
        initDIVShow: function () {
            //获取当前 浏览器模式
            this.GLOBALVAR.browserType = this._setModeIE();
            this.DateInfo.SELECTDATE = moment().utc();
            //初始化 Div 整体部分显示
            this._initDivALL();
            this._initDateClickFunc();
            this._initModeModel();
            this._refreshDateInfo();
            //  this.models = new TimeLine.YearModel();
            //初始化 右侧显示
            //根据模式 初始化 当前模式显示。

        },

        /**
         *
         * @returns {*}
         * @private
         */
        _setModeIE: function () {
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
        },

        /**
         * 初始化基础显示
         * @private
         */
        _initDivALL: function () {
            var _DIVID = this.GLOBALVAR.DIVID;
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

            var m_ShowDiv = document.getElementById(_DIVID);
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
            this._getFullModeWidth();
        },
        /**
         *  对 当前控件宽度 进行控制
         * @private
         */
        _getFullModeWidth: function () {

            var m_browserType = this.GLOBALVAR.browserType;
            var m_DIVID = this.GLOBALVAR.DIVID;
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
                this.GLOBALVAR.isShowSVGLine = false;
            } else {
                //var ShowTimeLine = document.getElementsByClassName("TimeLineTotalDiv");
                for (var t1 = 0; t1 < ShowTimeLine.length; t1++) {
                    ShowTimeLine[t1].style.display = "block";
                }
                this.GLOBALVAR.Is_ShowSVGLine = true;
            }
            //根据新长度计算当前显示宽度值
            if (Total_Witdh !== 0 && Total_Witdh > 0) {
                // console.log("屏幕总宽度：" + Total_Witdh);
                var CountWidth = Total_Witdh - 300 - 150;
                //年的 10年 一年25
                this.ModelStockCount.YearShowCount = Math.ceil(CountWidth / 10 / 25) + 1;
                //月 一年 12个月 一个月12.5
                this.ModelStockCount.MonthShowCount = Math.ceil(CountWidth / 12 / 12.5) + 2;
                //day 一个月 29天 (月使用最小的29 进行计算)
                this.ModelStockCount.DayShowCount = Math.ceil(CountWidth / 29 / 12.5) + 1;
                //分钟 一小时  60个 1分钟 1个12.5
                this.ModelStockCount.MinutesShowCount = Math.ceil(CountWidth / 60 / 12.5) + 1;
            }
        },


        /**
         * 初始化各种点击事件
         * @private
         */
        _initDateClickFunc: function () {
            //初始化时间
            this.DateInfo.SELECTDATE = moment().utc();
            //根据当前时间 刷新 显示的年月日时分秒
            this._refreshDateInfo();

            /*初始化点击事件*/
            //年月日 加一 函数赋值
            var m_btn_AddYear = document.getElementById("btn_AddYear");
            m_btn_AddYear.onclick = this._clickFunc._addOneYear;
            var btn_AddMonth = document.getElementById("btn_AddMonth");
            btn_AddMonth.onclick = this._clickFunc._addOneMonth;
            var btn_AddDay = document.getElementById("btn_AddDay");
            btn_AddDay.onclick = this._clickFunc._addOneDay;

            //年月日 减一 函数赋值
            var btn_MinusYear = document.getElementById("btn_MinusYear");
            btn_MinusYear.onclick = this._clickFunc._minusOneYear;
            var btn_MinusMonth = document.getElementById("btn_MinusMonth");
            btn_MinusMonth.onclick = this._clickFunc._minusOneMonth;
            var btn_MinusDay = document.getElementById("btn_MinusDay");
            btn_MinusDay.onclick = this._clickFunc._minusOneDay;


            //设置点击事件
            var m_btn_ShowYear = document.getElementsByClassName('btn_ShowYear');
            for (var i = 0; i < m_btn_ShowYear.length; i++) {
                m_btn_ShowYear[i].onclick = this._clickFunc._showYearMode;
            }

            var m_btn_ShowMonth = document.getElementsByClassName('btn_ShowMonth');
            for (var k = 0; k < m_btn_ShowMonth.length; k++) {
                m_btn_ShowMonth[k].onclick = this._clickFunc._showMonthMode;
            }

            var m_btn_ShowDay = document.getElementsByClassName('btn_ShowDay');
            for (var j = 0; j < m_btn_ShowDay.length; j++) {
                m_btn_ShowDay[j].onclick = this._clickFunc._showDayMode;
            }

            var m_btn_ShowMinute = document.getElementsByClassName('btn_ShowMinute');
            for (var w = 0; w < m_btn_ShowMinute.length; w++) {
                m_btn_ShowMinute[w].onclick = this._clickFunc._showMinuteMode;
            }

            //设置左右点击事件
            //向左减一天
            var btn_MinusDay_Left = document.getElementById("btn_BeforeTime");
            btn_MinusDay_Left.onclick = this._clickFunc._minusOneDay;
            //向右加一天
            var btn_AddDay_Right = document.getElementById("btn_AfterTime");
            btn_AddDay_Right.onclick = this._clickFunc._addOneDay;

            //伸缩点击事件
            var m_btn_ShowTimeLine = document.getElementById('ShowHidebtn');
            m_btn_ShowTimeLine.onclick = this._clickFunc._clickShowAndHide;
        },


        /**
         * 点击事件 集合 被上一个函数调用
         */
        _clickFunc: {
            _addOneYear: function () {
                this.DateInfo.SELECTDATE.add(1.0, "year");
                this._refreshDateInfo();
            },
            _addOneMonth: function () {
                this.DateInfo.SELECTDATE.add(1.0, "month");
                this._refreshDateInfo();
            },
            _addOneDay: function () {
                this.DateInfo.SELECTDATE.add(1.0, "day");
                this._refreshDateInfo();
            },
            _minusOneYear: function () {
                this.DateInfo.SELECTDATE.add(-1.0, "year");
                this._refreshDateInfo();
            },

            _minusOneMonth: function () {
                this.DateInfo.SELECTDATE.add(-1.0, "month");
                this._refreshDateInfo();
            },

            _minusOneDay: function () {
                console.log(TimeLine);
                var DateInfo = TimeLine.getDataInfo();
                //   var newDate = TimeLine.DateInfo.SELECTDATE.add(-1.0, "day");
                // this._reSetDate(newDate);
                var self = TimeLine;

            },
            _showYearMode: function () {
                var _self = TimeLine.models;
                _self.ShowMode = "YEAR";
                _self._Base.GLOBALVAR.ShowMode = "YEAR";
                _self._Base._initModeModel();
                TimeLine.models.drag(0);
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


            },


            _showMonthMode: function () {
                var _self = TimeLine.models;
                // _self.ShowMode = "YEAR";
                _self._Base.GLOBALVAR.ShowMode = "MONTH";
                _self._Base._initModeModel();
                TimeLine.models.drag(0);
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


            },

            _showDayMode: function () {
                console.log('_showDayMode');
                var _self = TimeLine.models;
                // _self.ShowMode = "YEAR";
                _self._Base.GLOBALVAR.ShowMode = "DAY";
                _self._Base._initModeModel();
                TimeLine.models.drag(0);

                var m_Show_YearDiv = document.getElementById("Show_YearDiv");
                var m_Show_MonthDiv = document.getElementById("Show_MonthDiv");
                var m_Show_DayDiv = document.getElementById("Show_DayDiv");
                var m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv");
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


            },

            _showMinuteMode: function () {
                console.log('_showMinuteMode');
                var _self = TimeLine.models;
                // _self.ShowMode = "YEAR";
                _self._Base.GLOBALVAR.ShowMode = "MINUTE";
                _self._Base._initModeModel();
                TimeLine.models.drag(0);

                var m_Show_YearDiv = document.getElementById("Show_YearDiv");
                var m_Show_MonthDiv = document.getElementById("Show_MonthDiv");
                var m_Show_DayDiv = document.getElementById("Show_DayDiv");
                var m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv");

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


            },

            _clickShowAndHide: function () {
                //获取TimeLine 部分的DIV
                var ShowTimeLine = document.getElementsByClassName("TimeLineTotalDiv");
                //如果当前显示为全部
                if (self.Is_ShowSVGLine) {
                    for (var i = 0; i < ShowTimeLine.length; i++) {
                        ShowTimeLine[i].style.display = "none";
                    }
                    self.Is_ShowSVGLine = false;
                } else {
                    //如果当前为压缩模式 修改为伸缩模式
                    for (var j = 0; j < ShowTimeLine.length; j++) {
                        ShowTimeLine[j].style.display = "block";
                    }
                    self.Is_ShowSVGLine = true;
                    //伸长后重绘界面 重新计算
                    this._getFullModeWidth();
                }
            }

        },

        /**
         * 根据当前的常量 刷新显示的 年月日时分秒 信息
         * @private
         */
        _refreshDateInfo: function () {
            console.log('_refreshDateInfo');
            console.log(this.DateInfo.SELECTDATE);
            this.DateInfo.YEARSHOW = parseInt(this.DateInfo.SELECTDATE.format("YYYY"));
            this.DateInfo.MONTHSHOW = parseInt(this.DateInfo.SELECTDATE.format("MM"));
            this.DateInfo.DAYSHOW = parseInt(this.DateInfo.SELECTDATE.format("DD"));
            this.DateInfo.HOURSHOW = parseInt(this.DateInfo.SELECTDATE.format("HH"));
            this.DateInfo.MINUTESHOW = parseInt(this.DateInfo.SELECTDATE.format("ss"));
            //初始化设置时间选择值 重新 赋值
            document.getElementById('txt_Year').value = this.DateInfo.YEARSHOW.toString();
            document.getElementById('txt_Month').value = this.DateInfo.MONTHSHOW.toString();
            document.getElementById('txt_Day').value = this.DateInfo.DAYSHOW.toString();

        },

        /**
         * 初始化 当前显示 的 年月日 model
         * @private
         */
        _initModeModel: function () {

            switch (this.GLOBALVAR.ShowMode) {
                case "YEAR":
                {
                    TimeLine.models = new TimeLine.YearModel(this);
                    break;
                }
                case "MONTH":
                {
                    TimeLine.models = new TimeLine.MonthModel(this);
                    break;
                }
                case "DAY":
                {
                    console.log("DayModel");
                    TimeLine.models = new TimeLine.DayModel(this);
                    break;
                }
                case "MINUTE":
                {
                    TimeLine.models = new TimeLine.MinuteModel(this);
                    break;
                }
                default:
                {
                    break;
                }
            }
            //初始化显示
            //TimeLine.models.init(this);
            // TimeLine.models.drag(0);
        },


        /**
         * 添加 显示的数据项目
         * @param dataInfo
         */
        addData: function (dataInfo) {
        },

        /**
         * 移动 当前 Svg的 位移
         * @param callback
         */
        drawSvg: function (dragNum) {
            //每一种模式都进行 位移
            TimeLine.models.drag(dragNum);
        }
        ,

        /**
         * 选择当前 模式
         * @param modeName
         */
        selectModels: function (modeName) {
            if (!modeName) {
                return "模式设置不能为空";
            }
            var modeNameUpper = modeName;
            switch (modeNameUpper) {
                case "YEAR":
                case "MONTH":
                case "DAY":
                case "MINUTE":
                {
                    this.GLOBALVAR.ShowMode = modeNameUpper;
                    break;
                }
                default:
                {
                    break;
                }
            }
            //重新对 model 进行初始化
            this._initModeModel();
        },

        /**
         * 不触发外部获取
         * @param newDate
         */
        resetDate: function (newDate) {
            this.DateInfo.SELECTDATE = newDate;
            this._refreshDateInfo();
        },

        _reSetDate: function (newDate) {
            this.DateInfo.SELECTDATE = newDate;
            this._refreshDateInfo();
            //触发外部 数据获取
            this.DateTimeChange();
            TimeLine.models.drag(0);
        },


        /**
         * 数值修改触发函数 外部重写此函数 获取修改事件
         * @constructor
         */
        DateTimeChange: function () {
            $("#" + this.GLOBALVAR.DIVID).trigger("DateTimeChange", [this.DateInfo]);
        },


    };

    TimeLine.YearModel = function (_BaseModel) {

        this.init(_BaseModel);
        return this;
    };

    TimeLine.YearModel.prototype = {

        YEARMODEVAR: {
            Trans_Year: 0,
            YearShowCount: 10
        },
        DateInfo: {},
        _self: this,

        /**
         * 初始化SVG绘制
         */
        init: function (baseModel) {
            this._Base = baseModel;
            this.DateInfo = this._Base.DateInfo;
            this.MouseVAR = {x_Month: 0, "x_Before_Month": 0, isMove_Month: false};
            this.drag(0);
            this.initMouseMove();
        },

        initMouseMove: function () {
            console.log('_initMouseMove');
            var m_ShowTimeLineDiv_Year = document.getElementById("ShowTimeLineDiv_Year");
            m_ShowTimeLineDiv_Year.onmousedown = this.mouseMove_Func._getMouseDown_Month;
            m_ShowTimeLineDiv_Year.onmouseup = this.mouseMove_Func._getMouseUP_Month;
            m_ShowTimeLineDiv_Year.onmouseout = this.mouseMove_Func._getMouseOut_Month;
            m_ShowTimeLineDiv_Year.onmousemove = this.mouseMove_Func._getMouseMove_Month;
        },

        mouseMove_Func: {
            _getMouseDown_Month: function (event) {
                var self = TimeLine.models;

                event = event || window.event;
                self.MouseVAR.x_Month = event.clientX;
                self.MouseVAR.x_Before_Month = self.MouseVAR.x_Month;
                self.MouseVAR.isMove_Month = true;

            },
            _getMouseUP_Month: function () {
                var self = TimeLine.models;
                self.MouseVAR.isMove_Month = false;
            },
            _getMouseOut_Month: function () {
                var self = TimeLine.models;
                var browserType = self._Base.GLOBALVAR.browserType;
                if (browserType !== "Firefox" && browserType !== 'Edge') {
                    self.MouseVAR.isMove_Month = false;
                }
            },
            _getMouseMove_Month: function (event) {
                var self = TimeLine.models;
                event = event || window.event;
                if (self.MouseVAR.isMove_Month) {
                    self.MouseVAR.x_Month = event.clientX;
                    var DrgNum = self.MouseVAR.x_Before_Month - self.MouseVAR.x_Month;
                    if (DrgNum >= 1 || DrgNum <= -1) {
                        self.MouseVAR.x_Before_Month = self.MouseVAR.x_Month;
                        self.drag(DrgNum);
                    }
                }
            }

        },
        /*
         Returns all of the elements (rows) of the worksheet as objects
         */
        drag: function (transform) {
            console.log('drag_day');
            //计算当前最新位移
            this.YEARMODEVAR.Trans_Year = this.YEARMODEVAR.Trans_Year - transform;
            //获取遍历赋值的局部位移 初始量
            var Trans_now = this.YEARMODEVAR.Trans_Year;
            //获取年时间轴的DIV
            var m_ShowSVG_Year = document.getElementById("SVG_Year_Total");
            //初始化比较字符串
            var DateShowYearStr = moment(this.DateInfo.SELECTDATE).format('YYYY');
            //总SVG Label
            var YearTotal = '<g id="ShowSVG_Year" transform="translate(' + Trans_now + ',10)" class="x aixs">';
            //初始化年份 1980
            var YearInit = moment(new Date(1980, 0, 1)).year();
            //循环绘制 年模块
            for (var j = 0; j < this.YEARMODEVAR.YearShowCount; j++) {
                var TimeGar = '';
                var TransMode = (j * 250).toString();
                //年模块SVG
                var YearShow = '<g class="tick_Total_Year" transform="translate(' + TransMode + ')">'
                    + '<line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>';
                for (var i = 0; i < 10; i++) {
                    var YearClick = YearInit + i;
                    var Trans = (i * 25).toString();
                    //若当前年时间为选择时间 则加入guitarpick指示当前时间

                    if (DateShowYearStr.toString() === YearClick.toString()) {
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

                    //通过当前时间 绘制背景的数据svg
                    var SVG_Data = this.getYearMode_DataShowList(YearClick, Trans);

                    var IsTitle = "";
                    //IE状态下对年Title进行缩放
                    if (self.browserType !== "MSIE") {
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
            if (self.browserType !== "MSIE") {
                m_ShowSVG_Year.innerHTML = YearTotal;
                $("#SVG_Year_Total").html(YearTotal);
            } else {
                $("#SVG_Year_Total").html(YearTotal);
            }

            var m_Btn_YearRectList = document.getElementsByClassName('Btn_YearRect');
            for (var w = 0; w < m_Btn_YearRectList.length; w++) {

                m_Btn_YearRectList[w].onclick = this.btnClickGetYear;

            }
        },


        btnClickGetYear: function (event) {
            var self = TimeLine.models;
            var toElement = event.toElement;
            //调用设置年函数
            var Tag = toElement.innerHTML.toString().replace('<title>', '');
            Tag = Tag.replace('</title>', '');
            var m_Year = parseInt(Tag);
            //重新设置
            var SELECTDATE = moment.utc([m_Year, parseInt(self.DateInfo.MONTHSHOW - 1), parseInt(self.DateInfo.DAYSHOW),
                parseInt(self.DateInfo.HOURSHOW), parseInt(self.DateInfo.MINUTESHOW), 0]);
            //刷新显示 对外 显示
            self._Base._reSetDate(SELECTDATE);
        },
        /**
         * 根据当前年时间 和位移 绘制 svg 图像
         * @param YearClick
         * @param Trans
         * @returns {string}
         */
        getYearMode_DataShowList: function (YearClick, Trans) {
            return "";
        }
    };


    TimeLine.MonthModel = function (_BaseModel) {

        this.init(_BaseModel);
        return this;
    };

    TimeLine.MonthModel.prototype = {


        DateInfo: {},
        _self: this,

        /**
         * 初始化SVG绘制
         */
        init: function (baseModel) {
            this.MONTHMODEVAR = {
                Trans_Month: 0,
                MonthShowCount: 15

            };
            this._Base = baseModel;
            this.MONTHMODEVAR.SELECTDATE = this._Base.DateInfo.SELECTDATE;
            var SelectTime = this.MONTHMODEVAR.SELECTDATE.format("YYYY");
            this.MONTHMODEVAR.MonthBegin_Date = moment.utc(SelectTime, "YYYY").add(-3.0, "year");
            this.DateInfo = this._Base.DateInfo;
            this.MONTHMODEVAR.browserType = this._Base.GLOBALVAR.browserType;
            this.MouseVAR = {x_Month: 0, "x_Before_Month": 0, isMove_Month: false};
            this.drag(0);
            this.initMouseMove();
        },

        initMouseMove: function () {

            var m_ShowTimeLineDiv_Year = document.getElementById("ShowTimeLineDiv_Month");
            m_ShowTimeLineDiv_Year.onmousedown = this.mouseMove_Func._getMouseDown_Month;
            m_ShowTimeLineDiv_Year.onmouseup = this.mouseMove_Func._getMouseUP_Month;
            m_ShowTimeLineDiv_Year.onmouseout = this.mouseMove_Func._getMouseOut_Month;
            m_ShowTimeLineDiv_Year.onmousemove = this.mouseMove_Func._getMouseMove_Month;
        },

        mouseMove_Func: {
            _getMouseDown_Month: function (event) {

                var self = TimeLine.models;
                event = event || window.event;
                self.MouseVAR.x_Month = event.clientX;
                self.MouseVAR.x_Before_Month = self.MouseVAR.x_Month;
                self.MouseVAR.isMove_Month = true;

            },
            _getMouseUP_Month: function () {

                var self = TimeLine.models;
                self.MouseVAR.isMove_Month = false;
            },
            _getMouseOut_Month: function () {
                var self = TimeLine.models;
                var browserType = self._Base.GLOBALVAR.browserType;
                if (browserType !== "Firefox" && browserType !== 'Edge') {
                    self.MouseVAR.isMove_Month = false;
                }
            },
            _getMouseMove_Month: function (event) {
                var self = TimeLine.models;
                event = event || window.event;
                if (self.MouseVAR.isMove_Month) {
                    self.MouseVAR.x_Month = event.clientX;
                    var DrgNum = self.MouseVAR.x_Before_Month - self.MouseVAR.x_Month;
                    if (DrgNum >= 1 || DrgNum <= -1) {
                        self.MouseVAR.x_Before_Month = self.MouseVAR.x_Month;
                        self.drag(DrgNum);
                    }
                }
            }

        },

        drag: function (tarnsform) {
            this.MONTHMODEVAR.SELECTDATE = this._Base.DateInfo.SELECTDATE;
            //获取 月模式下 SVG的DIV
            var m_ShowSVG = document.getElementById("ShowSVG");

            //循环添加
            var InnerSvgTotal = "";
            this.MONTHMODEVAR.Trans_Month = this.MONTHMODEVAR.Trans_Month - tarnsform;
            //对 开始时间进行计数
            while (this.MONTHMODEVAR.Trans_Month > 0) {
                this.MONTHMODEVAR.MonthBegin_Date = this.MONTHMODEVAR.MonthBegin_Date.add(-1.0, 'year');
                this.MONTHMODEVAR.Trans_Month = this.MONTHMODEVAR.Trans_Month - 150;
            }
            while (this.MONTHMODEVAR.Trans_Month < -150) {
                this.MONTHMODEVAR.MonthBegin_Date = this.MONTHMODEVAR.MonthBegin_Date.add(1.0, 'year');
                this.MONTHMODEVAR.Trans_Month = this.MONTHMODEVAR.Trans_Month + 150;
            }

            var mBeginTimeStr = this.MONTHMODEVAR.MonthBegin_Date.format("YYYY-MM");
            var mSelectTimeStr = this._Base.DateInfo.SELECTDATE.format("YYYY-MM");
            //  var m_BeginYear = parseInt(this.MONTHMODEVAR.MonthBegin_Date.format("YYYY"));

            //获取当前选择时间的月份 STR 用于Title显示
            var TimeShowStr_Month = mSelectTimeStr;

            // 月循环 MonthShowCount
            for (var i = 0; i < this.MONTHMODEVAR.MonthShowCount; i++) {
                var yearBase = moment.utc(mBeginTimeStr, "YYYY-MM");
                yearBase = yearBase.add(1.0 * i, 'year');
                var TimeStr = yearBase.format("YYYY");
                var TimeGar = "";
                var Trans = i * 150 + this.MONTHMODEVAR.Trans_Month - 150;
                var InnerSvg = '<g class="tick_Total_Year" Tag="' + TimeStr + '" transform="translate(' + Trans + ')">'
                    + '<line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>';
                //月份循环
                for (var Month = 0; Month < 12; Month++) {
                    yearBase = yearBase.add(1.0, "month");
                    var TransMonth = Month * 12.5;
                    var ShowDateStr = yearBase.format("YYYY-MM");
                    var MonthData_Svg = "";

                    //调用函数 返回当前单位是否需要显示数据
                    MonthData_Svg = this._getMonthMode_DataShowList(ShowDateStr, TransMonth);

                    var MonthSVG = '<g class="tick_Year_One" transform="translate(' + TransMonth + ')">'
                        + '<rect x="0.2" y="0" width="12.5" height="55" class="DayRect Btn_MonthRect" value="' + ShowDateStr + '">'
                        + '<title>' + ShowDateStr + '</title>'
                        + '</rect>'
                        + '<line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line>'
                        + '</g>';
                    //若显示月为当前月

                    if (TimeShowStr_Month.toString() === ShowDateStr.toString()) {
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
            if (this.MONTHMODEVAR.browserType !== "MSIE") {
                m_ShowSVG.innerHTML = InnerSvgTotal;
            } else {
                $("#ShowSVG").html(InnerSvgTotal);
            }
            //绑定点击事件
            // MonthClickFunc();
            var m_MonthRectList = document.getElementsByClassName("Btn_MonthRect");
            for (var i = 0; i < m_MonthRectList.length; i++) {
                m_MonthRectList[i].onclick = this.btnClickGetMonth;
            }
        },


        btnClickGetMonth: function (event) {
            var self = TimeLine.models;
            var toElement = event.toElement;
            //调用设置年函数
            var Tag = toElement.innerHTML.toString().replace('<title>', '');
            Tag = Tag.replace('</title>', '');
            var YearStr = Tag.substr(0, 4);
            var MonthStr = Tag.substr(5, 2);
            var _YearStr = parseInt(YearStr);
            var _MonthStr = parseInt(MonthStr);

            //重新设置
            var SELECTDATE = moment.utc([_YearStr, parseInt(_MonthStr - 1), parseInt(self.DateInfo.DAYSHOW),
                parseInt(self.DateInfo.HOURSHOW), parseInt(self.DateInfo.MINUTESHOW), 0]);

            //刷新显示 对外 显示
            self._Base._reSetDate(SELECTDATE);
        },
        /**
         * 根据当前年时间 和位移 绘制 svg 图像
         * @param YearClick
         * @param Trans
         * @returns {string}
         */
        _getMonthMode_DataShowList: function (YearClick, Trans) {
            return "";
        }


    };


    TimeLine.DayModel = function (_BaseModel) {

        this.init(_BaseModel);
        return this;
    };

    TimeLine.DayModel.prototype = {


        DateInfo: {},
        _self: this,

        /**
         * 初始化SVG绘制
         */
        init: function (baseModel) {
            this.DAYMODEVAR = {
                Trans_Day: 0,
                DAYShowCount: 15

            };
            this._Base = baseModel;
            this.DAYMODEVAR.SELECTDATE = this._Base.DateInfo.SELECTDATE;

            this.DAYMODEVAR.DayBegin_Date = moment.utc(this.DAYMODEVAR.SELECTDATE.format('YYYY-MM-DD'), "YYYY-MM-DD");

            this.DAYMODEVAR.DayBegin_Date = this.DAYMODEVAR.DayBegin_Date.add(-1.0, "month");


            this.DateInfo = this._Base.DateInfo;
            this.DAYMODEVAR.browserType = this._Base.GLOBALVAR.browserType;
            this.MouseVAR = {x_Day: 0, "x_Before_Day": 0, isMove_Day: false};
            this.drag(0);
            this.initMouseMove();
        },

        initMouseMove: function () {

            var m_ShowTimeLineDiv_Day = document.getElementById("ShowTimeLineDiv_Day");
            m_ShowTimeLineDiv_Day.onmousedown = this.mouseMove_Func._getMouseDown_Month;
            m_ShowTimeLineDiv_Day.onmouseup = this.mouseMove_Func._getMouseUP_Month;
            m_ShowTimeLineDiv_Day.onmouseout = this.mouseMove_Func._getMouseOut_Month;
            m_ShowTimeLineDiv_Day.onmousemove = this.mouseMove_Func._getMouseMove_Month;
        },

        mouseMove_Func: {
            _getMouseDown_Month: function (event) {

                var self = TimeLine.models;
                event = event || window.event;
                self.MouseVAR.x_Day = event.clientX;
                self.MouseVAR.x_Before_Day = self.MouseVAR.x_Day;
                self.MouseVAR.isMove_Day = true;

            },
            _getMouseUP_Month: function () {

                var self = TimeLine.models;
                self.MouseVAR.isMove_Day = false;
            },
            _getMouseOut_Month: function () {
                var self = TimeLine.models;
                var browserType = self._Base.GLOBALVAR.browserType;
                if (browserType !== "Firefox" && browserType !== 'Edge') {
                    self.MouseVAR.isMove_Day = false;
                }
            },
            _getMouseMove_Month: function (event) {
                var self = TimeLine.models;
                event = event || window.event;
                if (self.MouseVAR.isMove_Day) {
                    self.MouseVAR.x_Day = event.clientX;
                    var DrgNum = self.MouseVAR.x_Before_Day - self.MouseVAR.x_Day;
                    if (DrgNum >= 1 || DrgNum <= -1) {
                        self.MouseVAR.x_Before_Day = self.MouseVAR.x_Day;
                        if (DrgNum > 500) {
                            DrgNum = 500;
                        }
                        self.drag(DrgNum);
                    }
                }
            }

        },

        drag: function (tarnsform) {
            if (tarnsform > 500) {
                console.log('drag_day:' + tarnsform);
            }
            //界面显示2个月
            var SVG_Show = '';
            this.DAYMODEVAR.SELECTDATE = this._Base.DateInfo.SELECTDATE;


            this.DAYMODEVAR.Trans_Day = this.DAYMODEVAR.Trans_Day - tarnsform;
            /*    var SelectTime = this.DAYMODEVAR.SELECTDATE.format("YYYY-MM");
             this.DAYMODEVAR.DayBegin_Date = moment.utc(SelectTime, "YYYY-MM").add(-2.0, "month");*/
            //向前拖动
            while (this.DAYMODEVAR.Trans_Day > 0) {
                //减少一个月
                this.DAYMODEVAR.DayBegin_Date.add(-1.0, "month");
                //计算上一个月长度
                var BeforeMonthLength = this.DAYMODEVAR.DayBegin_Date.daysInMonth() * 12.5;
                this.DAYMODEVAR.Trans_Day = this.DAYMODEVAR.Trans_Day - BeforeMonthLength;
            }
            //向前拖动
            while (this.DAYMODEVAR.Trans_Day < -350) {
                this.DAYMODEVAR.DayBegin_Date.add(1.0, "month");
                var MonthLength = this.DAYMODEVAR.DayBegin_Date.daysInMonth() * 12.5;
                this.DAYMODEVAR.Trans_Day = this.DAYMODEVAR.Trans_Day + MonthLength;
            }
            var Day_Trans = this.DAYMODEVAR.Trans_Day;
            //初始时间为2016年1月 当前月
            //   var CountDate = this.DAYMODEVAR.DayBegin_Date.format('YYYY-MM-DD');
            //当前选择日期 str
            var DateShowNowStr = this.DAYMODEVAR.SELECTDATE.format('YYYY-MM-DD');
            // console.log(CountDate + ":" + DateShowNowStr);

            var momentCount = moment.utc(this.DAYMODEVAR.DayBegin_Date.format('YYYY-MM-DD'), 'YYYY-MM-DD');

            //月份循环
            for (var i = 0; i < this.DAYMODEVAR.DAYShowCount; i++) {
                var TimeGar = '';
                //计算当前月份天数
                var TimeDateCount = momentCount.daysInMonth();
                //月开始 绘制
                var SVG_Month = '  <g class="tick_Total_Year" transform="translate(' + Day_Trans + ')">' +
                    '<line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>';
                //每一天循环
                for (var j = 0; j < TimeDateCount; j++) {
                    //计算每一天的位移
                    var Day_Trans_min = (j * 12.5).toString();
                    //根据时间计算当前块显示 DATE YYYY-MM-dd
                    var DayTimeStr = momentCount.format('YYYY-MM-DD');

                    //根据时间加载数据 svg
                    var Data_SVG = this._getDayMode_DataShowList(DayTimeStr, Day_Trans_min);

                    //若当前日期为显示日期

                    if (DayTimeStr.toString() === DateShowNowStr.toString()) {

                        TimeGar = '<g id="guitarpick" class="SVG_guitarpick"  '
                            + ' transform="translate(' + (Day_Trans_min - 8) + ',-10)">'
                            + '<title>' + DateShowNowStr + '</title>'
                            + '<path d="'
                            + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                            + '"></path>'
                            + '<rect width="3" height="20" x="9" y="11" ></rect>'
                            + '<rect width="3" height="20" x="14" y="11" ></rect>'
                            + '<rect width="3" height="20" x="19" y="11" ></rect>'
                            + '</g>';
                    }

                    //根据时间 初始化 基础svg
                    /*      + ' onclick="javascript:' + self.DayRectOnClick(evt, ' + ShowYear + ', ' + ShowMonth + ', ' + j + ') + '"   >'*/
                    var SVG_Day = '   <g class="tick_Year_One" transform="translate(' + Day_Trans_min + ')" >'
                        + '<rect class="DayRect Btn_DayRect" x="0.2" y="0" width="12.5" height="55" value="' + DayTimeStr + '">'
                        + '<title>' + DayTimeStr + '</title>'
                        + '</rect>'
                        + '<line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line>'
                        + '</g>';
                    SVG_Month = SVG_Month + Data_SVG + SVG_Day;
                    if (Day_Trans_min === "62.5" || Day_Trans_min === "125" || Day_Trans_min === "187.5"
                        || Day_Trans_min === "250" || Day_Trans_min === "312.5" || Day_Trans_min === "375") {
                        SVG_Month = SVG_Month
                            + '<line x1="' + Day_Trans_min + '" x2="' + Day_Trans_min + '" y1="40" y2="55" class="tick_10DayLine"'
                            + ' ></line>';
                    }

                    //时间相加
                    momentCount = momentCount.add(1.0, 'day');
                }
                Day_Trans = ( TimeDateCount * 12.5) + Day_Trans;
                var Width = ( TimeDateCount * 12.5);
                var Time = momentCount.format('YYYY-MM');
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

            }
            //时间相加
            var ShowTimeLine = document.getElementById("ShowSVG_Day");
            //IE处理
            if (self.browserType !== "MSIE") {
                ShowTimeLine.innerHTML = SVG_Show;
            } else {
                $("#ShowSVG_Day").html(SVG_Show);
            }
            //日点击事件
            var m_Btn_DayRectList = document.getElementsByClassName('Btn_DayRect');
            for (var t = 0; t < m_Btn_DayRectList.length; t++) {
                m_Btn_DayRectList[t].onclick = this.btnClickGetDay;
            }
        },


        btnClickGetDay: function (event) {
            var self = TimeLine.models;
            var toElement = event.toElement;
            //调用设置年函数
            var Tag = toElement.innerHTML.toString().replace('<title>', '');
            Tag = Tag.replace('</title>', '');
            var YearStr = Tag.substr(0, 4);
            var MonthStr = Tag.substr(5, 2);
            var DayStr = Tag.substr(8, 2);
            var _YearStr = parseInt(YearStr);
            var _MonthStr = parseInt(MonthStr);
            var _DayStr = parseInt(DayStr);

            //重新设置
            var SELECTDATE = moment.utc([_YearStr, parseInt(_MonthStr - 1), _DayStr,
                parseInt(self.DateInfo.HOURSHOW), parseInt(self.DateInfo.MINUTESHOW), 0]);
            console.log('Change:' + SELECTDATE.format('YYYYMMDD'));
            //刷新显示 对外 显示
            self._Base._reSetDate(SELECTDATE);
        }
        ,
        /**
         * 根据当前年时间 和位移 绘制 svg 图像
         * @param YearClick
         * @param Trans
         * @returns {string}
         */
        _getDayMode_DataShowList: function (YearClick, Trans) {
            return "";
        }


    };

    /**
     * 分钟模式
     * @param _BaseModel
     * @returns {TimeLine.MinuteMode}
     * @constructor
     */
    TimeLine.MinuteModel = function (_BaseModel) {
        this.init(_BaseModel);
        return this;
    };

    TimeLine.MinuteModel.prototype = {


        DateInfo: {},
        _self: this,

        /**
         * 初始化SVG绘制
         */
        init: function (baseModel) {
            this.MINUTEMODEVAR = {
                Trans_Minute: 0,
                MinuteShowCount: 15

            };
            this._Base = baseModel;
            this.MINUTEMODEVAR.SELECTDATE = this._Base.DateInfo.SELECTDATE;

            this.MINUTEMODEVAR.MinuteBegin_Date = moment.utc(this.MINUTEMODEVAR.SELECTDATE.format('YYYY-MM-DD HHmmss'), "YYYY-MM-DD HHmmss");

            this.MINUTEMODEVAR.MinuteBegin_Date = this.MINUTEMODEVAR.MinuteBegin_Date.add(-1.0, "hour");


            this.DateInfo = this._Base.DateInfo;
            this.MINUTEMODEVAR.browserType = this._Base.GLOBALVAR.browserType;
            this.MouseVAR = {x_Day: 0, "x_Before_Day": 0, isMove_Day: false};
            this.drag(0);
            this.initMouseMove();
        },

        initMouseMove: function () {

            var m_ShowTimeLineDiv_Minute = document.getElementById("ShowTimeLineDiv_Minute");
            m_ShowTimeLineDiv_Minute.onmousedown = this.mouseMove_Func._getMouseDown_Month;
            m_ShowTimeLineDiv_Minute.onmouseup = this.mouseMove_Func._getMouseUP_Month;
            m_ShowTimeLineDiv_Minute.onmouseout = this.mouseMove_Func._getMouseOut_Month;
            m_ShowTimeLineDiv_Minute.onmousemove = this.mouseMove_Func._getMouseMove_Month;
        },

        mouseMove_Func: {
            _getMouseDown_Month: function (event) {

                var self = TimeLine.models;
                event = event || window.event;
                self.MouseVAR.x_Day = event.clientX;
                self.MouseVAR.x_Before_Day = self.MouseVAR.x_Day;
                self.MouseVAR.isMove_Day = true;

            },
            _getMouseUP_Month: function () {

                var self = TimeLine.models;
                self.MouseVAR.isMove_Day = false;
            },
            _getMouseOut_Month: function () {
                var self = TimeLine.models;
                var browserType = self._Base.GLOBALVAR.browserType;
                if (browserType !== "Firefox" && browserType !== 'Edge') {
                    self.MouseVAR.isMove_Day = false;
                }
            },
            _getMouseMove_Month: function (event) {
                var self = TimeLine.models;
                event = event || window.event;
                if (self.MouseVAR.isMove_Day) {
                    self.MouseVAR.x_Day = event.clientX;
                    var DrgNum = self.MouseVAR.x_Before_Day - self.MouseVAR.x_Day;
                    if (DrgNum >= 1 || DrgNum <= -1) {
                        self.MouseVAR.x_Before_Day = self.MouseVAR.x_Day;
                        if (DrgNum > 500) {
                            DrgNum = 500;
                        }
                        self.drag(DrgNum);
                    }
                }
            }

        },

        drag: function (tarnsform) {
            if (tarnsform > 500) {
                console.log('drag_Minute:' + tarnsform);
            }
            //界面显示2个月
            //用于整体显示的SVG InnerHTML
            var SVG_Show = '';
            //  this.MINUTEMODEVAR.MinuteBegin_Date;

            //全局变量 修改
            this.MINUTEMODEVAR.Trans_Minute = this.MINUTEMODEVAR.Trans_Minute - tarnsform;

            //向后拖动
            while (this.MINUTEMODEVAR.Trans_Minute > 0) {
                this.MINUTEMODEVAR.Trans_Minute = this.MINUTEMODEVAR.Trans_Minute - 12 * 12.5 * 5;
                //减一个小时
                this.MINUTEMODEVAR.MinuteBegin_Date.add(-1.0, 'hour');
                // MinuteBegin_Date.setHours(MinuteBegin_Date.getHours() - 1);
            }
            //向前拖动
            while (this.MINUTEMODEVAR.Trans_Minute < -60 * 12.5) {
                this.MINUTEMODEVAR.Trans_Minute = this.MINUTEMODEVAR.Trans_Minute + 12 * 12.5 * 5;
                //加1小时
                this.MINUTEMODEVAR.MinuteBegin_Date.add(1.0, 'hour');
                //   MinuteBegin_Date.setHours(MinuteBegin_Date.getHours() + 1);
            }
            //每个月的位移 初始化位0
            var Month_Trans = this.MINUTEMODEVAR.Trans_Minute;
            //初始时间为2016年1月 当前月
            var CountDate = moment.utc(this.MINUTEMODEVAR.MinuteBegin_Date.format("YYYY-MM-DD HH:00"), "YYYY-MM-DD HH:00");
            console.log(CountDate.format("YYYY-MM-DD HH:mm"));
            //当前选择日期 str
            var DateShowNowStr = this.MINUTEMODEVAR.SELECTDATE.format("YYYY-MM-DD HH:mm");
            //小时份循环

            /// var TimeCompareStr = this.MINUTEMODEVAR.SELECTDATE.format("YYYY-MM-DD HH:mm");

            var is_GutiarFlag = false;
            //小时开始 绘制 21个小时
            for (var i = 0; i < this.MINUTEMODEVAR.MinuteShowCount; i++) {
                //时间 指针 （当前显示时间）
                var TimeGar = '';

                var SVG_Hour = '<g class="tick_Total_Year" transform="translate(' + Month_Trans + ')">' +
                    '<line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>';
                // var HourNow = new Date(moment(CountDate).format("YYYY-MM-DD HH:mm"));
                //每一个小时 中 1 min循环    一小时12
                for (var j = 0; j < 60; j++) {
                    //每一个小时中 每5min的位移
                    var Minute_Trans = (j * 12.5).toString();
                    //根据时间计算当前块显示 DATE YYYY-MM-dd
                    console.log(CountDate);
                    try {
                        var MinuteTimeStr = CountDate.format("YYYY-MM-DD HH:mm");
                    } catch (err) {
                        console.log(err);
                    }
                    //根据时间加载数据 svg
                    var Data_SVG = this._getMinuteMode_DataShowList(MinuteTimeStr, Minute_Trans);

                    //根据动画模式 设置是否需要显示动画模块 V1.1 20170321
                    // var Trans_SVG = GetMinuteMode_AnimeDateList(DayTimeStr, Minute_Trans);

                    //  若非动画模式 则按照原有选择时间进行处理

                    // 是否为当前显示 时分秒

                    //若指针时间在范围内 显示指针
                    if (DateShowNowStr === MinuteTimeStr && is_GutiarFlag === false) {
                        is_GutiarFlag = true;
                        TimeGar = '<g id="guitarpick" class="SVG_guitarpick" '
                            + ' transform="translate(' + (Minute_Trans - 8) + ',-10)">'
                            + '<title>' + MinuteTimeStr + '</title>'
                            + '<path d="'
                            + 'M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z'
                            + '"></path>'
                            + '<rect width="3" height="20" x="9" y="11" ></rect>'
                            + '<rect width="3" height="20" x="14" y="11" ></rect>'
                            + '<rect width="3" height="20" x="19" y="11" ></rect>'
                            + '</g>';
                    }


                    //根据时间 初始化 基础svg
                    var SVG_Day = '<g class="tick_Year_One" transform="translate(' + Minute_Trans + ')" >'
                        + '<rect class="DayRect Btn_MinuteRect" x="0.2" y="0" width="12.5" height="55" value="' + MinuteTimeStr + '">'
                        + '<title>' + MinuteTimeStr + '</title>'
                        + '</rect>'
                        + '<line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line>'
                        + '</g>';
                    //SVG_Hour = SVG_Hour + Data_SVG + SVG_Day + TimeGar;

                    SVG_Hour = SVG_Hour + Data_SVG + SVG_Day;

                    if (Minute_Trans % (12.5 * 5) === 0) {
                        if (Minute_Trans % (12.5 * 5 * 2) === 0) {
                            SVG_Hour = SVG_Hour
                                + '<line x1="' + Minute_Trans + '" x2="' + Minute_Trans + '" y1="20" y2="55" class="tick_10DayLine"'
                                + ' ></line>';
                        } else {
                            SVG_Hour = SVG_Hour
                                + '<line x1="' + Minute_Trans + '" x2="' + Minute_Trans + '" y1="40" y2="55" class="tick_10DayLine"'
                                + ' ></line>';
                        }
                    }
                    // 加5min
                    CountDate = CountDate.add(1.0, 'minute');
                }
                Month_Trans = 60 * 12.5 + Month_Trans;
                var Width = 60 * 12.5;
                var TimeHourShow = CountDate.format("YYYY-MM-DD HH:mm");
                if (CountDate.format("HH:mm") === '00:00') {
                    TimeHourShow = CountDate.format("YYYY-MM-DD");
                } else {
                    TimeHourShow = CountDate.format("HH:mm");
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

            //IE显示处理
            if (self.browserType !== "MSIE") {
                ShowTimeLine.innerHTML = SVG_Show;
            } else {
                $("#ShowSVG_Day").append(SVG_Show);
            }
            //ShowTimeLine.innerHTML = SVG_Show;
            //重新设置分钟点击


            var m_Btn_MinuteRectList = document.getElementsByClassName('Btn_MinuteRect');
            for (var t = 0; t < m_Btn_MinuteRectList.length; t++) {
                m_Btn_MinuteRectList[t].onclick = this.btnClickGetMinute;
            }
        },


        btnClickGetMinute: function (event) {
            var self = TimeLine.models;
            var toElement = event.toElement;
            //调用设置年函数
            var Tag = toElement.innerHTML.toString().replace('<title>', '');
            Tag = Tag.replace('</title>', '');
            var YearStr = Tag.substr(0, 4);
            var MonthStr = Tag.substr(5, 2);
            var DayStr = Tag.substr(8, 2);
            var _YearStr = parseInt(YearStr);
            var _MonthStr = parseInt(MonthStr);
            var _DayStr = parseInt(DayStr);

            //重新设置
            var SELECTDATE = moment.utc([_YearStr, parseInt(_MonthStr - 1), _DayStr,
                parseInt(self.DateInfo.HOURSHOW), parseInt(self.DateInfo.MINUTESHOW), 0]);
            console.log('Change:' + SELECTDATE.format('YYYYMMDD'));
            //刷新显示 对外 显示
            self._Base._reSetDate(SELECTDATE);
        }
        ,
        /**
         * 根据当前年时间 和位移 绘制 svg 图像
         * @param YearClick
         * @param Trans
         * @returns {string}
         */
        _getMinuteMode_DataShowList: function (YearClick, Trans) {
            return "";
        }


    };

})(this);