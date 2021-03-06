function TimeLine() {
  var e = this;this.DateShow = new Date();var t = 2016,
      i = 1,
      n = 1,
      a = 0,
      o = 0;this.browserType = "", this.IDName = "", this.ShowMode = "Month_Mode", this.Is_ShowSVGLine = !0;var l,
      r,
      s = !1,
      d = 0,
      h = -150,
      c = new Date(moment.utc().add(-6, "hours").format("YYYY-MM-DD HH").toString() + ":00:00"),
      m = !1,
      v = 0,
      g = -387.5,
      w = new Date(),
      u = !1,
      y = 0,
      _ = 0,
      D = -150,
      f = new Date(2009, 0, 1),
      S = 50,
      M = !1,
      x = 0,
      p = 0,
      b = 8,
      Y = 12,
      k = 5,
      I = 11,
      T = [],
      E = [],
      B = [],
      L = [],
      A = [],
      C = [],
      G = [];this.Init = function (t, i) {
    switch (e.browserType = X(), e.IDName = t, i) {case "YEAR":
        e.ShowMode = "Year_Mode";break;case "MONTH":
        e.ShowMode = "Month_Mode";break;case "DAY":
        e.ShowMode = "Day_Mode";break;case "MINUTE":
        e.ShowMode = "Minute_Mode";break;default:
        e.ShowMode = "Day_Mode";}U(), W();
  }, this.LoadTitleHander = function (e) {
    new Title(e.getTarget().getOwnerDocument(), 12);
  }, this.GetShowDate = function () {
    return e.DateShow;
  }, this.SetShowDate = function (t) {
    return t instanceof Date && (e.DateShow = new Date(moment.utc(t)), H(), !0);
  }, this.DateTimeChange = function () {
    $("#" + e.IDName).trigger("DateTimeChange", [e.DateShow]);
  };var H = function () {
    switch (t = e.DateShow.getUTCFullYear(), i = e.DateShow.getMonth() + 1, n = e.DateShow.getDate(), a = e.DateShow.getHours(), o = e.DateShow.getMinutes(), document.getElementById("txt_Year").value = t.toString(), document.getElementById("txt_Month").value = i.toString(), document.getElementById("txt_Day").value = n.toString(), e.DateTimeChange(), e.ShowMode) {case "Year_Mode":
        ye(0);break;case "Month_Mode":
        be(0);break;case "Day_Mode":
        he(0);break;case "Minute_Mode":
        ie(0);}
  },
      F = function () {
    e.DateShow = new Date(moment(e.DateShow).add(1, "day")), e.m_Trans = 150 * (e.m_TransYear - moment(e.DateShow).year() + 5), g -= 12.5, h -= 3600, H();
  },
      O = function () {
    var t = (moment(e.DateShow).add(1, "month") - moment(e.DateShow)) / 1e3 / 3600 / 24;e.DateShow = new Date(moment(e.DateShow).add(1, "month")), e.m_Trans = 150 * (e.m_TransYear - moment(e.DateShow).year() + 5), h -= 3600 * t, g -= 12.5 * t, H();
  },
      V = function () {
    var t = (moment(e.DateShow).add(1, "year") - moment(e.DateShow)) / 1e3 / 3600 / 24;h -= 3600 * t, g -= 12.5 * t, e.m_Trans = 150 * (e.m_TransYear - moment(e.DateShow).year() + 5), e.DateShow = new Date(moment(e.DateShow).add(1, "year")), H();
  },
      N = function () {
    e.DateShow = new Date(moment(e.DateShow).add(-1, "day")), h += 3600, g += 12.5, H();
  },
      R = function () {
    var t = (moment(e.DateShow) - moment(e.DateShow).add(-1, "month")) / 1e3 / 3600 / 24;e.DateShow = new Date(moment(e.DateShow).add(-1, "month")), h += 3600 * t, g += 12.5 * t, H();
  },
      z = function () {
    var t = (moment(e.DateShow) - moment(e.DateShow).add(-1, "year")) / 1e3 / 3600 / 24;e.DateShow = new Date(moment.utc(e.DateShow).add(-1, "year")), h += 3600 * t, g += 12.5 * t, H();
  },
      U = function () {
    var t = e.IDName,
        i = document.getElementById(t);i.innerHTML = ' <div class="TimeInputDiv"><div id="YearInputDiv"><div class="UpButton" id="btn_AddYear"><svg width="98" height="25" xmlns="http://www.w3.org/2000/svg"><path d="m25.5,20.5l23.49999,-12l23.50001,12l-47,0z" fill="#fff"/></svg></div><input class="TimeInput" id="txt_Year" type="text" readOnly="true">  <div class="DownButton" id="btn_MinusYear"><svg><path transform="rotate(-180 50,14.5) " d="m25.5,20.5l23.49999,-12l23.50001,12l-47,0z" fill="#fff"/></svg></div></div><div id="MonthInputDiv"><div class="UpButton" id="btn_AddMonth"><svg width="98" height="25" xmlns="http://www.w3.org/2000/svg"><path d="m10,20.5l19.99999,-12l20.00001,12l-40,0z" fill="#fff"/></svg></div><input class="MonthInput" id="txt_Month" type="text" readOnly="true">  <div class="DownButton" id="btn_MinusMonth"><svg width="98" height="25" xmlns="http://www.w3.org/2000/svg"><path transform="rotate(-180 30,14.5) " d="m10,20.5l19.99999,-12l20.00001,12l-40,0z" fill="#fff"/></svg></div></div><div id="DayInputDiv"><div class="UpButton" id="btn_AddDay"><svg width="98" height="25" xmlns="http://www.w3.org/2000/svg"><path d="m10,20.5l19.99999,-12l20.00001,12l-40,0z" fill="#fff"/></svg></div><input class="MonthInput" id="txt_Day" type="text"  readOnly="true"> <div class="DownButton" id="btn_MinusDay"><svg width="98" height="25" xmlns="http://www.w3.org/2000/svg"><path transform="rotate(-180 30,14.5) " d="m10,20.5l19.99999,-12l20.00001,12l-40,0z" fill="#fff"/></svg></div> </div><div class="AfterDiv" id="btn_BeforeTime"><svg style="width: 24px;height: 44px;margin-top: 26px; transform:scaleX(-1);"><path style="fill: #fff ;" d="M 10.240764,0 24,22 10.240764,44 0,44 13.759236,22 0,0 10.240764,0 z"></path></svg></div><div class="AfterDiv" id="btn_AfterTime"><svg style="width: 24px;height: 44px;margin-top: 26px; "><path style="fill: #fff;" d="M 10.240764,0 24,22 10.240764,44 0,44 13.759236,22 0,0 10.240764,0 z"></path></svg></div></div><div class="TimeLineTotalDiv" id="ShowTimeLine"><div class="TimeLineDiv" id="Show_YearDiv">\x3c!--时间轴部分--\x3e<div class="TimeLineDiv_Inside" id="ShowTimeLineDiv_Year"><div class="SVGDiv_Inside"><svg class="svg_ALL" height="99" id="SVG_Year_Total" xmlns="http://www.w3.org/2000/svg"></svg></div></div>\x3c!--模式选择部分--\x3e<div class="TimeMode_Inner" id=" TimeModeDiv YearMode_Div"><div class="SmallFillDiv "></div><div class="BigShowDiv    btn_ShowYear">Years</div><div class="MedShowDiv    btn_ShowMonth">Months</div><div class="SmallShowDiv  btn_ShowDay">Days</div><div class="SmallShowDiv  btn_ShowMinute">Minutes</div><div class="SmallFillDiv "></div></div></div><div class="TimeLineDiv" id="Show_MonthDiv" style="display: none">\x3c!--  月时间轴部分--\x3e<div class="TimeLineDiv_Inside" id="ShowTimeLineDiv_Month"><svg class="svg_ALL" height="100" id="SVG_Total" xmlns="http://www.w3.org/2000/svg"><g id="ShowSVG" transform="translate(0,6)" class="x aixs"></g></svg></div>\x3c!--  月时间轴选择部分 --\x3e<div id="MonthMode_Div" class=" TimeModeDiv TimeMode_Inner"><div class="SmallFillDiv  "></div><div class="SmallShowDiv  btn_ShowYear">Years</div><div class="BigShowDiv    btn_ShowMonth">Months</div><div class="SmallShowDiv  btn_ShowDay">Days</div><div class="SmallShowDiv  btn_ShowMinute">Minutes</div><div class="SmallFillDiv "></div></div></div><div class="TimeLineDiv" id="Show_DayDiv" style="display: none"><div class="TimeLineDiv_Inside" id="ShowTimeLineDiv_Day"><svg class="svg_ALL" height="100" id="SVG_Day_Total" xmlns="http://www.w3.org/2000/svg"><g id="ShowSVG_Day" transform="translate(0,6)" class="x aixs "></g></svg></div><div class=" TimeModeDiv TimeMode_Inner" id="DayMode_Div"><div class="SmallFillDiv "></div><div class="SmallShowDiv  btn_ShowYear ">Years</div><div class="MedShowDiv    btn_ShowMonth">Months</div><div class="BigShowDiv    btn_ShowDay  ">Days</div><div class="SmallShowDiv  btn_ShowMinute">Minutes</div><div class="SmallFillDiv "></div></div></div><div class="TimeLineDiv" id="Show_MinuteDiv" style="display: none"><div class="TimeLineDiv_Inside" id="ShowTimeLineDiv_Minute"><svg class="svg_ALL" height="100" id="SVG_Minute_Total" xmlns="http://www.w3.org/2000/svg"><g id="ShowSVG_Minute" transform="translate(0,6)" class="x aixs "></g></svg></div><div class=" TimeModeDiv TimeMode_Inner" id="MinuteMode_Div"><div class="SmallFillDiv "></div><div class="SmallShowDiv  btn_ShowYear ">Years</div><div class="SmallShowDiv    btn_ShowMonth">Months</div><div class="MedShowDiv    btn_ShowDay  ">Days</div><div class="BigShowDiv  btn_ShowMinute">Minutes</div><div class="SmallFillDiv "></div></div></div></div><div class="ShowHidebtnDiv" id="ShowHidebtn"><svg width="25" height="100" xmlns="http://www.w3.org/2000/svg"><g><title>展开/隐藏</title><path id="svg_1" d="m3,55.94447l19,0l0,4l-19,0l0,-4z" stroke-width="0" stroke="#000" fill="#fff"/><path id="svg_2" d="m3,47.94447l19,0l0,4l-19,0l0,-4z" stroke-width="0" stroke="#000" fill="#fff"/><path id="svg_3" d="m3,39.94447l19,0l0,4l-19,0l0,-4z" stroke-width="0" stroke="#000" fill="#fff"/></svg></div>';try {
      i.style.position = "fixed", i.style.bottom = 0, i.style.left = 0;
    } catch (e) {}j(t);
  },
      W = function () {
    e.DateShow = new Date(), t = e.DateShow.getUTCFullYear(), i = e.DateShow.getUTCMonth() + 1, n = e.DateShow.getUTCDate(), a = e.DateShow.getUTCHours(), o = e.DateShow.getUTCMinutes(), document.getElementById("btn_AddYear").onclick = V, document.getElementById("btn_AddMonth").onclick = O, document.getElementById("btn_AddDay").onclick = F, document.getElementById("btn_MinusYear").onclick = z, document.getElementById("btn_MinusMonth").onclick = R, document.getElementById("btn_MinusDay").onclick = N, document.getElementById("txt_Year").value = t.toString(), document.getElementById("txt_Month").value = i.toString(), document.getElementById("txt_Day").value = n.toString();var l = document.getElementById("ShowTimeLineDiv_Year");l.onmousedown = ve, l.onmouseup = ge, l.onmouseout = we, l.onmousemove = ue;var r = document.getElementById("ShowTimeLineDiv_Month");r.onmousedown = fe, r.onmouseup = Se, r.onmouseout = xe, r.onmousemove = Me;var s = document.getElementById("ShowTimeLineDiv_Day");s.onmousedown = oe, s.onmouseup = le, s.onmouseout = re, s.onmousemove = se;var d = document.getElementById("ShowTimeLineDiv_Minute");d.onmousedown = P, d.onmouseup = Q, d.onmouseout = Z, d.onmousemove = ee;for (var h = document.getElementsByClassName("btn_ShowYear"), c = 0; c < h.length; c++) h[c].onclick = Te;for (var m = document.getElementsByClassName("btn_ShowMonth"), v = 0; v < m.length; v++) m[v].onclick = Ee;for (var g = document.getElementsByClassName("btn_ShowDay"), w = 0; w < g.length; w++) g[w].onclick = Be;for (var u = document.getElementsByClassName("btn_ShowMinute"), y = 0; y < u.length; y++) u[y].onclick = Le;document.getElementById("btn_BeforeTime").onclick = N, document.getElementById("btn_AfterTime").onclick = F, document.getElementById("ShowHidebtn").onclick = Ie, q();
  };$(window).resize(function () {
    e.Is_ShowSVGLine && j(e.IDName);
  });var X = function () {
    var e = window.navigator.userAgent;return navigator.userAgent.indexOf("Trident") > 0 || navigator.userAgent.indexOf("Edge") > 0 ? "Edge" : navigator.userAgent.indexOf("MSIE") > 0 ? "MSIE" : (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) ? "Firefox" : e.indexOf("Chrome") >= 0 ? "Chrome" : (isSafari = navigator.userAgent.indexOf("Safari") > 0) ? "Safari" : (isCamino = navigator.userAgent.indexOf("Camino") > 0) ? "Camino" : (isMozilla = navigator.userAgent.indexOf("Gecko/") > 0) ? "Gecko" : e.indexOf("Opera") >= 0 ? "Opera" : "unknown";
  },
      j = function () {
    var t = e.browserType,
        i = e.IDName;if ("" != i) {
      var n = document.getElementById(i),
          a = document.getElementById("ShowTimeLine"),
          o = document.getElementsByClassName("svg_ALL"),
          l = 0;switch (t) {case "Chrome":
          var r = (document.documentElement.scrollWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth);l = r, document.getElementById(i).style.width = r > 380 ? r : 380;var s;s = r - 490, a.style.width = r - 360;for (var d = 0; d < o.length; d++) o[d].style.width = s;break;case "Firefox":
          var h = document.documentElement.clientWidth - 20;l = h, n.style.width = h > 360 ? h + "px" : "360px";for (var c = h - 490, m = 0; m < o.length; m++) o[m].style.width = c + "px";a.style.width = h - 360 + "px";break;case "MSIE":
          var v = document.documentElement.clientWidth - 20;l = v, n.style.width = v > 360 ? v + "px" : "360px";for (var g = v - 490, w = 0; w < o.length; w++) o[w].style.width = g + "px";a.style.width = v - 360 + "px";break;case "Edge":
          var u = document.documentElement.clientWidth || document.body.clientWidth,
              v = u - 20;l = v, n.style.width = v > 360 ? v + "px" : "360px";for (var g = v - 490, w = 0; w < o.length; w++) o[w].style.width = g + "px";a.style.width = v - 360 + "px";}var y = document.getElementsByClassName("TimeLineTotalDiv");if (l < 495) {
        for (var _ = 0; _ < y.length; _++) y[_].style.display = "none";e.Is_ShowSVGLine = !1;
      } else {
        for (var D = 0; D < y.length; D++) y[D].style.display = "block";e.Is_ShowSVGLine = !0;
      }if (0 != l && l > 0) {
        var f = l - 300 - 150;b = Math.ceil(f / 10 / 25) + 1, Y = Math.ceil(f / 12.5 / 12) + 2, k = Math.ceil(f / 29 / 12.5) + 1, I = Math.ceil(f / 12 / 12.5) + 1;
      }
    }
  },
      q = function () {
    switch (e.ShowMode) {case "Year_Mode":
        ye(0), Te();break;case "Month_Mode":
        pe(2009), Ee();break;case "Day_Mode":
        he(0), Be();break;case "Minute_Mode":
        ie(0), Le();}
  },
      J = function (l) {
    return NaN != parseInt(l) && (t = parseInt(l).toString(), e.DateShow = new Date(t, i - 1, n, a, o, 0), H(), !0);
  },
      K = function (l) {
    var r = l.getAttribute("value"),
        s = r.split("-")[0],
        d = r.split("-")[1];return NaN != parseInt(s) && (t = parseInt(s).toString(), i = parseInt(d).toString(), e.DateShow = new Date(t, i - 1, n, a, o, 0), H(), !0);
  },
      P = function (e) {
    s = !0, l = e.clientX, d = l;
  },
      Q = function (e) {
    s = !1;
  },
      Z = function () {
    "Firefox" != e.browserType && "Edge" != e.browserType && (s = !1);
  },
      ee = function (e) {
    if (s) {
      l = e.clientX;var t = d - l;(t >= 1 || t <= -1) && (d = l, ie(t));
    }
  },
      te = function () {
    for (var e = document.getElementsByClassName("Btn_MinuteRect"), t = 0; t < e.length; t++) e[t].onclick = function () {
      ne(this);
    };
  },
      ie = function (t) {
    var i = "";for (h -= t; h > 0;) h -= 150, c.setHours(c.getHours() - 1);for (; h < -150;) h += 150, c.setHours(c.getHours() + 1);for (var n = h, a = c, o = moment(e.DateShow).utc().format("YYYY-MM-DD HH:mm"), l = !1, r = 0; r < I; r++) {
      for (var s = "", d = '<g class="tick_Total_Year" transform="translate(' + n + ')"><line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>', m = new Date(moment(a).format("YYYY-MM-DD HH:mm")), v = 0; v < 12; v++) {
        var g = (12.5 * v).toString(),
            w = moment(m).utc().format("YYYY-MM-DD HH:mm"),
            u = ae(w, g),
            y = Ce(w, g);if (!e.AnimeMode && !l) {
          var _ = m - e.DateShow;3e5 > _ && _ >= 0 && "" == s && (l = !0, s = '<g id="guitarpick" class="SVG_guitarpick"  transform="translate(' + (g - 8) + ',-10)"><title>' + o + '</title><path d="M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z"></path><rect width="3" height="20" x="9" y="11" ></rect><rect width="3" height="20" x="14" y="11" ></rect><rect width="3" height="20" x="19" y="11" ></rect></g>');
        }if (1 == e.AnimeMode && !l) {
          s = "";var D = moment(m) - e.AnimeDate;3e5 > D && D >= 0 && "" == s && (console.log("get!"), l = !0, s = '<g id="guitarpick" class="SVG_Anime_guitarpick"  transform="translate(' + (g - 8) + ',-10)"><title>' + o + '</title><path d="M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z"></path><rect width="3" height="20" x="9" y="11" ></rect><rect width="3" height="20" x="14" y="11" ></rect><rect width="3" height="20" x="19" y="11" ></rect></g>');
        }d = d + u + ('<g class="tick_Year_One" transform="translate(' + g + ')" ><rect class="DayRect Btn_MinuteRect" x="0.2" y="0" width="12.5" height="55" value="' + w + '"><title>' + w + '</title></rect><line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line></g>'), e.AnimeMode && (d += y), "75" != g && "215" != g || (d = d + '<line x1="' + g + '" x2="' + g + '" y1="40" y2="55" class="tick_10DayLine" ></line>'), m.setMinutes(m.getMinutes() + 5);
      }n = 150 + n;var f = moment(a).utc().format("YYYY-MM-DD HH:mm");f = 0 == a.getUTCHours() ? moment(a).utc().format("YYYY-MM-DD") : moment(a).utc().format("HH:mm");d = d + s + ('<g transform="translate(0)"><rect x="0" y="55" width="150" height="25" class="Rect_White"/><text x="12" y="73" class="Month_Text_Show">' + f + '</text></g><g><circle cx="0" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/><circle cx="150" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/></g><line x1="150" x2="150" y1="0" y2="80" class="tick_Line"></line></g>'), i += d, a = new Date(moment(a).add(1, "hour"));
    }var S = document.getElementById("ShowSVG_Minute");"MSIE" != e.browserType ? S.innerHTML = i : $("#ShowSVG_Day").append(i), te();
  },
      ne = function (t) {
    var i = t.getAttribute("value"),
        n = new Date(moment.utc(i));e.SetShowDate(n);
  },
      ae = function (e, t) {
    if (e = e.toString(), 0 == G.length || !G.length) return "";for (var i = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show" transform="translate(' + t + ')">', n = e, a = [], o = 0; o < G.length; o++) {
      var l = !1;-1 != G[o].indexOf(n) && (l = !0), a.push(l);
    }var r = Math.round(40 / G.length, 2);r > 10 && (r = 10);for (var s = 0; s < G.length; s++) {
      var d = "",
          h = s * r;if (1 == a[s]) {
        var c = B[s],
            m = h + r - .4;c ? (!0, d = '<rect class="Rect_Data_Show" x="-0.2" y="' + h + '" width="12.7" height="' + r + '" ></rect><line x1="0" x2="12.5" y1="' + h + '" y2="' + h + '" class="Data_tick_Line"></line><line x1="0" x2="12.5" y1="' + m + '" y2="' + m + '" class="Data_tick_Line"></line>') : (!0, d = '<rect class="Rect_Data_Hide" x="0" y="' + h + '" width="12.5" height="' + r + '" ></rect><line x1="0" x2="12.5" y1="' + h + '" y2="' + h + '" class="Data_tick_Line"></line><line x1="0" x2="12.5" y1="' + m + '" y2="' + m + '" class="Data_tick_Line"></line>');
      } else d = "";i += d;
    }return i += "</g>";
  },
      oe = function (e) {
    m = !0, r = e.clientX, v = r;
  },
      le = function (e) {
    m = !1;
  },
      re = function () {
    "Firefox" != e.browserType && "Edge" != e.browserType && (m = !1);
  },
      se = function (e) {
    if (m) {
      r = e.clientX;var t = v - r;(t >= 1 || t <= -1) && (v = r, he(t));
    }
  },
      de = function () {
    for (var e = document.getElementsByClassName("Btn_DayRect"), t = 0; t < e.length; t++) e[t].onclick = function () {
      ce(this);
    };
  },
      he = function (t) {
    var i = "";for (g -= t; g > 0;) {
      var n = 12.5 * new Date(w.getFullYear(), w.getMonth(), 0).getDate();g -= n, w.setMonth(w.getMonth() - 1);
    }for (var a = 12.5 * -new Date(w.getFullYear(), w.getMonth() + 1, 0).getDate(); g < a;) g -= a, w.setMonth(w.getMonth() + 1), a = 12.5 * -new Date(w.getFullYear(), w.getMonth() + 1, 0).getDate();Month_Trans = g;for (var o = new Date(w.getFullYear(), w.getMonth() - 1, w.getDate()), l = moment(e.DateShow).format("YYYY-MM-DD"), r = 0; r < k; r++) {
      for (var s = "", d = new Date(o.getFullYear(), o.getMonth() + 1, 0).getDate(), h = o.getFullYear(), c = o.getMonth(), m = '  <g class="tick_Total_Year" transform="translate(' + Month_Trans + ')"><line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>', v = 0; v < d; v++) {
        var u = (12.5 * v).toString(),
            y = moment(new Date(h, parseInt(c), parseInt(v + 1))).format("YYYY-MM-DD"),
            _ = me(y, u);e.AnimeMode ? y == e.AnimeDate.utc().format("YYYY-MM-DD") && (s = '<g id="guitarpick" class="SVG_Anime_guitarpick" transform="translate(' + (u - 8) + ',-10)"><title>' + l + '</title><path d="M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z"></path><rect width="3" height="20" x="9" y="11" ></rect><rect width="3" height="20" x="14" y="11" ></rect><rect width="3" height="20" x="19" y="11" ></rect></g>') : y == l && (s = '<g id="guitarpick" class="SVG_guitarpick"   transform="translate(' + (u - 8) + ',-10)"><title>' + l + '</title><path d="M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z"></path><rect width="3" height="20" x="9" y="11" ></rect><rect width="3" height="20" x="14" y="11" ></rect><rect width="3" height="20" x="19" y="11" ></rect></g>');m = m + _ + ('   <g class="tick_Year_One" transform="translate(' + u + ')" ><rect class="DayRect Btn_DayRect" x="0.2" y="0" width="12.5" height="55" value="' + h + "-" + (parseInt(c) + 1) + "-" + parseInt(v + 1) + '"><title>' + h + "-" + (parseInt(c) + 1) + "-" + parseInt(v + 1) + '</title></rect><line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line></g>'), "62.5" != u && "125" != u && "187.5" != u && "250" != u && "312.5" != u && "375" != u || (m = m + '<line x1="' + u + '" x2="' + u + '" y1="40" y2="55" class="tick_10DayLine" ></line>');
      }Month_Trans = 12.5 * d + Month_Trans;var D = 12.5 * d;m = m + s + ('<g transform="translate(0)"><rect x="0" y="55" width="' + D + '" height="25" class="Rect_White"/><text x="12" y="73" class="Month_Text_Show">' + (o.getFullYear() + "-" + (o.getMonth() + 1)) + '</text></g><g><circle cx="0" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/><circle cx="' + D + '" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/></g><line x1="' + D + '" x2="' + D + '" y1="0" y2="80" class="tick_Line"></line></g>'), i += m, o = new Date(moment(o).add(1, "month"));
    }var f = document.getElementById("ShowSVG_Day");"MSIE" != e.browserType ? f.innerHTML = i : $("#ShowSVG_Day").html(i), de();
  },
      ce = function (t) {
    var i = t.getAttribute("value"),
        n = i.split("-"),
        a = new Date(n[0], parseInt(n[1]) - 1, n[2]),
        o = new Date(moment(a).format("YYYY-MM-DD") + "T00:00:00+00:00");e.SetShowDate(o);
  },
      me = function (e, t) {
    if (e = e.toString(), !C.length || 0 == C.lemgth) return "";for (var i = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show" transform="translate(' + t + ')">', n = e, a = [], o = 0; o < C.length; o++) {
      var l = !1;-1 != C[o].indexOf(n) && (l = !0), a.push(l);
    }var r = Math.round(40 / C.length, 2);r > 10 && (r = 10);for (var s = 0; s < C.length; s++) {
      var d = "",
          h = s * r;if (1 == a[s]) {
        var c = B[s],
            m = h + r - .4;c ? (!0, d = '<rect class="Rect_Data_Show" x="0" y="' + h + '" width="12.5" height="' + r + '" ></rect><line x1="0" x2="12.5" y1="' + h + '" y2="' + h + '" class="Data_tick_Line"></line><line x1="0" x2="12.5" y1="' + m + '" y2="' + m + '" class="Data_tick_Line"></line>') : (!0, d = '<rect class="Rect_Data_Hide" x="0" y="' + h + '" width="12.5" height="' + r + '" ></rect><line x1="0" x2="12.5" y1="' + h + '" y2="' + h + '" class="Data_tick_Line"></line><line x1="0" x2="12.5" y1="' + m + '" y2="' + m + '" class="Data_tick_Line"></line>');
      } else d = "";i += d;
    }return i += "</g>";
  },
      ve = function (e) {
    M = !0, e = e || window.event, x = e.clientX, p = x;
  },
      ge = function (e) {
    e = e || window.event, M = !1, x = e.clientX;
  },
      we = function () {
    "Firefox" != e.browserType && "Edge" != e.browserType && (M = !1);
  },
      ue = function (e) {
    if (M) {
      e = e || window.event, x = e.clientX;var t = p - x;p = x, (t >= 2 || t <= -2) && ye(t);
    }
  },
      ye = function (t) {
    S -= t;for (var i = S, n = document.getElementById("SVG_Year_Total"), a = moment(e.DateShow).format("YYYY"), o = '<g id="ShowSVG_Year" transform="translate(' + i + ',10)" class="x aixs">', l = moment(new Date(1980, 0, 1)).year(), r = 0; r < b; r++) {
      for (var s = "", d = (250 * r).toString(), h = '<g class="tick_Total_Year" transform="translate(' + d + ')"><line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>', c = 0; c < 10; c++) {
        var m = l + c,
            v = (25 * c).toString();e.AnimeMode ? m == e.AnimeDate.utc().format("YYYY") && (s = '<g id="guitarpick" class="SVG_Anime_guitarpick" transform="translate(' + (v - 3) + ',-10)"><title>' + m + '</title><path d="M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z"></path><rect width="3" height="20" x="9" y="11" ></rect><rect width="3" height="20" x="14" y="11" ></rect><rect width="3" height="20" x="19" y="11" ></rect></g>') : a == m && (s = '<g id="guitarpick" class="SVG_guitarpick"   transform="translate(' + (v - 3) + ',-10)"><title>' + m + '</title><path d="M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z"></path><rect width="3" height="20" x="9" y="11" ></rect><rect width="3" height="20" x="14" y="11" ></rect><rect width="3" height="20" x="19" y="11" ></rect></g>');var g = De(m, v),
            w = "";"MSIE" != e.browserType && (w = "<title>" + m + "</title>");h = h + g + ('<g class="tick_Year_One" transform="translate(' + v + ')"><rect class="DayRect Btn_YearRect" x="0.2" y="0" width="25" height="55" value="' + m + '"  >' + w + '</rect><line class="tick_dot" x1="24" x2="24" y1="0" y2="52"></line></g>');
      }h = h + s + ('<g transform="translate(0)"><rect x="0" y="55" width="250" height="25" class="Rect_White" value="' + l + '"/><text x="12" y="73" class="Month_Text_Show">' + l + '</text></g><g><circle cx="0" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/><circle cx="250" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/></g><line x1="250" x2="250" y1="0" y2="80" class="tick_Line"></line></g>'), o += h, l += 10;
    }o += "</g></g>", "MSIE" != e.browserType ? (n.innerHTML = o, $("#SVG_Year_Total").html(o)) : $("#SVG_Year_Total").html(o);for (var u = document.getElementsByClassName("Btn_YearRect"), y = 0; y < u.length; y++) u[y].onclick = function () {
      _e(this);
    };
  },
      _e = function (e) {
    var t = e.getAttribute("value"),
        i = new Date(t),
        n = i.getFullYear();J(n);
  },
      De = function (e, t) {
    if (e = e.toString(), 0 == L.length || !L.length) return "";for (var i = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show" transform="translate(' + t + ')">', n = e, a = [], o = 0; o < L.length; o++) {
      var l = !1;-1 != L[o].indexOf(n) && (l = !0), a.push(l);
    }var r = Math.round(40 / L.length, 2);r > 10 && (r = 10);for (var s = 0; s < L.length; s++) {
      var d = "",
          h = s * r;if (1 == a[s]) {
        var c = B[s],
            m = h + r - .4;c ? (!0, d = '<rect class="Rect_Data_Show" x="0" y="' + h + '" width="25" height="' + r + '" ></rect><line x1="0" x2="25" y1="' + h + '" y2="' + h + '" class="Data_tick_Line"></line><line x1="0" x2="25" y1="' + m + '" y2="' + m + '" class="Data_tick_Line"></line>') : (!0, d = '<rect class="Rect_Data_Hide" x="0" y="' + h + '" width="25" height="' + r + '" ></rect><line x1="0" x2="25" y1="' + h + '" y2="' + h + '" class="Data_tick_Line"></line><line x1="0" x2="25" y1="' + m + '" y2="' + m + '" class="Data_tick_Line"></line>');
      } else d = "";i += d;
    }return i += "</g>";
  },
      fe = function (e) {
    e = e || window.event, y = e.clientX, _ = y, u = !0;
  },
      Se = function (e) {
    u = !1;
  },
      Me = function (e) {
    if (e = e || window.event, u) {
      y = e.clientX;var t = _ - y;(t >= 1 || t <= -1) && (_ = y, be(t));
    }
  },
      xe = function (t) {
    "Firefox" != e.browserType && "Edge" != e.browserType && (u = !1);
  },
      pe = function (t) {
    var i = 150 * (t - e.m_TransYear);be(i);
  },
      be = function (t) {
    var i = document.getElementById("ShowSVG"),
        n = "";for (D -= t; D > 150;) f = new Date(moment(f).add(-1, "year")), D -= 150;for (; D < -150;) f = new Date(moment(f).add(1, "year")), D += 150;for (var a = moment(f).year(), o = moment(e.DateShow).format("YYYY-M"), l = 0; l < Y; l++) {
      for (var r = "", s = (a + l).toString(), d = 150 * l + D - 150, h = '<g class="tick_Total_Year" Tag="' + s + '" transform="translate(' + d + ')"><line x1="0" x2="0" y1="0" y2="80" class="tick_Line"></line>', c = 0; c < 12; c++) {
        var m = 12.5 * c,
            v = s + "-" + (c + 1),
            g = "";g = ke(v, m);var w = '<g class="tick_Year_One" transform="translate(' + m + ')"><rect x="0.2" y="0" width="12.5" height="55" class="DayRect Btn_MonthRect" value="' + v + '"><title>' + v + '</title></rect><line class="tick_dot" x1="12" x2="12" y1="0" y2="52"></line></g>';e.AnimeMode ? v == e.AnimeDate.utc().format("YYYY-M") && (r = '<g id="guitarpick" class="SVG_Anime_guitarpick" transform="translate(' + (d + m - 10) + ',-10)"><title>' + v + '</title><path d="M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z"></path><rect width="3" height="20" x="9" y="11" ></rect><rect width="3" height="20" x="14" y="11" ></rect><rect width="3" height="20" x="19" y="11" ></rect></g>') : o == v && (r = '<g id="guitarpick" class="SVG_guitarpick" transform="translate(' + (d + m - 10) + ',-10)"><title>' + v + '</title><path d="M3.658 0.743C1.775 0.743 0.25 3.793 0.25 7.555l0 21.272l7.302 15.711l7.302 15.711l7.302 -15.711l7.302 -15.711l0 -21.272c0 -3.763 -1.526 -6.813 -3.408 -6.813l-22.392 0z"></path><rect width="3" height="20" x="9" y="11" ></rect><rect width="3" height="20" x="14" y="11" ></rect><rect width="3" height="20" x="19" y="11" ></rect></g>'), h = h + g + w;
      }h = h + '<g transform="translate(0)"><rect x="0" y="55" width="150" height="25"  class="Rect_White"/><text x="12" y="73" class="Month_Text_Show" >' + s + '年</text></g><g><circle cx="0" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/><circle cx="150" cy="55" r="5" stroke="white" stroke-width="2" fill="white"/></g><line x1="150" x2="150" y1="0" y2="80" class="tick_Line"></line></g></g>', n = n + h + r;
    }i.innerHTML = n, "MSIE" != e.browserType ? i.innerHTML = n : $("#ShowSVG").html(YearTotal), Ye();
  },
      Ye = function () {
    for (var e = document.getElementsByClassName("Btn_MonthRect"), t = 0; t < e.length; t++) e[t].onclick = function () {
      K(this);
    };
  },
      ke = function (e, t) {
    if (!A.length) return "";for (var i = '<g style="width: 12px;height: 40px;fill:#5F5F01" class="tick_Data_Show" transform="translate(' + t + ')">', n = e, a = [], o = 0; o < A.length; o++) {
      var l = !1;-1 != A[o].indexOf(n) && (l = !0), a.push(l);
    }var r = Math.round(40 / A.length, 2);r > 10 && (r = 10);for (var s = r - .8, d = 0; d < A.length; d++) {
      var h = "",
          c = d * r;if (1 == a[d]) {
        var m = B[d],
            v = c + r - .2;h = m ? '<rect class="Rect_Data_Show" x="0" y="' + c + '" width="12.5" height="' + s + '" ></rect><line x1="0" x2="12.5" y1="' + c + '" y2="' + c + '" class="Data_tick_Line"></line><line x1="0" x2="12.5" y1="' + v + '" y2="' + v + '" class="Data_tick_Line"></line>' : '<rect class="Rect_Data_Hide" x="0" y="' + c + '" width="12.5" height="' + s + '" ></rect><line x1="0" x2="12.5" y1="' + c + '" y2="' + c + '" class="Data_tick_Line"></line><line x1="0" x2="12.5" y1="' + v + '" y2="' + v + '" class="Data_tick_Line"></line>';
      } else h = "";i += h;
    }return i += "</g>";
  },
      Ie = function () {
    var t = document.getElementsByClassName("TimeLineTotalDiv");if (e.Is_ShowSVGLine) {
      for (var i = 0; i < t.length; i++) t[i].style.display = "none";e.Is_ShowSVGLine = !1;
    } else {
      for (var n = 0; n < t.length; n++) t[n].style.display = "block";e.Is_ShowSVGLine = !0, j(e.IDName);
    }
  },
      Te = function () {
    m_Show_YearDiv = document.getElementById("Show_YearDiv"), m_Show_MonthDiv = document.getElementById("Show_MonthDiv"), m_Show_DayDiv = document.getElementById("Show_DayDiv"), m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv"), m_Show_YearDiv.style.display = "block", m_Show_MonthDiv.style.display = "none", m_Show_DayDiv.style.display = "none", m_Show_MinuteDiv.style.display = "none", document.getElementById("btn_AddYear").disabled = !1, document.getElementById("btn_MinusYear").disabled = !1, document.getElementById("btn_AddMonth").disabled = !0, document.getElementById("btn_MinusMonth").disabled = !0, document.getElementById("btn_AddDay").disabled = !0, document.getElementById("btn_MinusDay").disabled = !0, ye(0), e.ShowMode = "Year_Mode";
  },
      Ee = function () {
    m_Show_YearDiv = document.getElementById("Show_YearDiv"), m_Show_MonthDiv = document.getElementById("Show_MonthDiv"), m_Show_DayDiv = document.getElementById("Show_DayDiv"), m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv"), m_Show_YearDiv.style.display = "none", m_Show_MonthDiv.style.display = "block", m_Show_DayDiv.style.display = "none", m_Show_MinuteDiv.style.display = "none", document.getElementById("btn_AddYear").disabled = !1, document.getElementById("btn_MinusYear").disabled = !1, document.getElementById("btn_AddMonth").disabled = !1, document.getElementById("btn_MinusMonth").disabled = !1, document.getElementById("btn_AddDay").disabled = !0, document.getElementById("btn_MinusDay").disabled = !0, e.ShowMode = "Month_Mode", D = 150 * (moment(f).year() - moment(e.DateShow).year() + 5), be(0);
  },
      Be = function () {
    m_Show_YearDiv = document.getElementById("Show_YearDiv"), m_Show_MonthDiv = document.getElementById("Show_MonthDiv"), m_Show_DayDiv = document.getElementById("Show_DayDiv"), m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv"), m_Show_YearDiv.style.display = "none", m_Show_MonthDiv.style.display = "none", m_Show_DayDiv.style.display = "block", m_Show_MinuteDiv.style.display = "none", $("#btn_AddYear").attr("disabled", !1), $("#btn_MinusYear").attr("disabled", !1), $("#btn_AddMonth").attr("disabled", !1), $("#btn_MinusMonth").attr("disabled", !1), $("#btn_AddDay").attr("disabled", !1), $("#btn_MinusDay").attr("disabled", !1);var t = Math.round((w - e.DateShow) / 864e5 * 12.5, 2);e.ShowMode = "Day_Mode", g += t, he(0);
  },
      Le = function () {
    m_Show_YearDiv = document.getElementById("Show_YearDiv"), m_Show_MonthDiv = document.getElementById("Show_MonthDiv"), m_Show_DayDiv = document.getElementById("Show_DayDiv"), m_Show_MinuteDiv = document.getElementById("Show_MinuteDiv"), m_Show_YearDiv.style.display = "none", m_Show_MonthDiv.style.display = "none", m_Show_DayDiv.style.display = "none", m_Show_MinuteDiv.style.display = "block", $("#btn_AddYear").attr("disabled", !1), $("#btn_MinusYear").attr("disabled", !1), $("#btn_AddMonth").attr("disabled", !1), $("#btn_MinusMonth").attr("disabled", !1), $("#btn_AddDay").attr("disabled", !1), $("#btn_MinusDay").attr("disabled", !1), e.ShowMode = "Minute_Mode";var t = e.DateShow - c - 216e5;ie(t / 1e3 / 60 / 5 * 12.5);
  };this.ADDLayerData = function (e) {
    var t = e.length;if (t) for (var i = 0; i < t; i++) {
      var n = e[i];T.push(n);var a = n.DataName,
          o = n.Layeris_Show,
          l = E.indexOf(a);-1 == l && (E.push(a), B.push(o), L.push([]), A.push([]), C.push([]), G.push([]), l = E.length - 1);var r = n.DataInfo;try {
        var s = r[0];switch (s.length) {case 4:
            L[l] = r;break;case 6:case 7:
            A[l] = r;break;case 10:
            C[l] = r;break;case 16:
            G[l] = r;break;default:
            console.log(s);}
      } catch (e) {}
    }ye(0), be(0), he(0), ie(0);
  }, this.AddYearData = this.AddMonthData = this.AddDayData = this.AddMinuteData = function (e) {
    this.ADDLayerData(e);
  };var Ae = function () {
    for (var e = 0; e < E.length; e++) m_OrderItem = E[e], m_showType = B[e], T.forEach(function (t) {
      if (t.DataName === m_OrderItem) {
        var i = t.DataInfo;try {
          switch (i[0].length) {case 4:
              L[e] = i;break;case 6:case 7:
              A[e] = i;break;case 10:
              C[e] = i;break;case 16:
              G[e] = i;}
        } catch (e) {}
      }
    });ye(0), be(0), he(0), ie(0);
  };this.RemoveLayerDataByName = function (t) {
    var i = E.indexOf(t);-1 != i && (E.splice(i, 1), B.splice(i, 1), L.splice(i, 1), A.splice(i, 1), C.splice(i, 1), G.splice(i, 1));for (var n = [], a = 0; a < T.length; a++) T[a].DataName != t && n.push(T[a]);switch (T = n, e.ShowMode) {case "Year_Mode":
        ye(0);break;case "Month_Mode":
        be(0);break;case "Day_Mode":
        he(0);break;case "Minute_Mode":
        ie(0);}
  }, this.ReSetLayerList = function (e) {
    E = [], B = [], L = [], A = [], C = [], G = [];for (var t = 0; t < e.length; t++) E.push(e[t].DataName), B.push(e[t].Layeris_Show), L.push([]), A.push([]), C.push([]), G.push([]);Ae();
  }, this.GetLayerList = function () {
    return E;
  }, this.getDataList = function (e, t, i, n, a) {
    if ("string" != typeof e) return void console.log("图层名称错误！图层名称类型选择必须为：String。");var o = n.toLowerCase();if ("year" != o && "day" != o && "month" != o && "minute" != o) return void console.log("数据类型错误！数据类型选择必须为：year，month，day，mintue中的一个");if (!(t instanceof moment)) return void console.log("参数 数据类型错误！开始日期的数据类型选择必须为 moment");if (!(i instanceof moment)) return void console.log("参数 数据类型错误！结束日期的数据类型选择必须为 moment");var l = T.length,
        r = [];void 0 != l && l > 0 && T.forEach(function (t) {
      if (t.DataName == e) {
        var i = "",
            n = t.DataInfo;if (n.length > 0) {
          switch (n[0].length) {case 3:case 4:
              i = "year";break;case 6:case 7:
              i = "month";break;case 10:case 11:
              i = "day";break;case 16:
              i = "minute";}i == o && (r = t);
        }
      }
    });var s = t,
        d = i,
        h = [];if (r != []) {
      var c = r.DataInfo;if (void 0 != c.length) for (var m = 0; m < c.length; m++) {
        var v = c[m],
            g = moment.utc(v);g.isAfter(s) && g.isBefore(d) ? h.push(g) : (g.isSame(s) || g.isSame(d)) && h.push(g);
      }
    }for (var w = [], u = 0; u < h.length; u++) {
      var y = h[u],
          _ = a;_.indexOf("yyyy") > 0 && (_ = _.replace("yyyy", y.utc().format("YYYY"))), _.indexOf("MM") > 0 && (_ = _.replace("MM", y.utc().format("MM"))), _.indexOf("dd") > 0 && (_ = _.replace("dd", y.utc().format("DD"))), _.indexOf("hh") > 0 && (_ = _.replace("hh", y.utc().format("HH"))), _.indexOf("mm") > 0 && (_ = _.replace("mm", y.utc().format("mm"))), w.push(_);
    }var D = [];return D.UrlList = w, D._id = e, D;
  }, this.getLatestDate = function (e, t) {
    if ("string" != typeof e) return void console.log("图层名称错误！图层名称类型选择必须为：String。");var i = t.toLowerCase();if ("year" != i && "day" != i && "month" != i && "minute" != i) return void console.log("数据类型错误！数据类型选择必须为：year，month，day，mintue中的一个");try {
      var n = T.length,
          a = [];void 0 != n && n > 0 && T.forEach(function (t) {
        if (t.DataName == e) {
          var n = "",
              o = t.DataInfo;if (o.length > 0) {
            switch (o[0].length) {case 3:case 4:
                n = "year";break;case 6:case 7:
                n = "month";break;case 10:case 11:
                n = "day";break;case 16:
                n = "minute";}n == i && (a = t);
          }
        }
      });var o = "";if (a != []) {
        var l = a.DataInfo;if (void 0 != l) {
          o = l[l.length - 1];
        }
      }if ("" != o) {
        return moment(o + "+00:00").utc();
      }return;
    } catch (e) {
      return;
    }
  }, e.AnimeMode = !1, e.Anime_BeginTime, e.Anime_EndTime, e.AnimeDate, this.SetAmineMode = function (t, i) {
    return t instanceof moment && i instanceof moment ? (e.Anime_BeginTime = t, e.Anime_EndTime = i, e.AnimeDate = t, e.AnimeMode = !0, !0) : (console.log("参数类型错误，m_beginTime的类型需要为：moment"), !1);
  }, this.SetAmineDate = function (t) {
    return t instanceof moment ? (e.AnimeDate = t, e.AnimeMode = !0, ie(0), he(0), be(0), ye(0), !0) : (console.log("参数类型错误，m_AnimeDate需要为moment类型。"), !1);
  }, this.SetAmineMode_End = function () {
    return e.AnimeMode = !1, e.Anime_BeginTime = null, e.Anime_EndTime = null, e.AnimeDate = null, ie(0), he(0), be(0), ye(0), !0;
  };var Ce = function (e, t) {
    return "";
  };
}

//# sourceMappingURL=TimeLine_shk.min-compiled.js.map