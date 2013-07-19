/*
	QuanZhi.com 2012.08.06
	类库依赖：JQuery.1.7.1.js
*/

/*
*	# JS异常错误信息捕获 #
*	@param	msg[String]	异常信息详情
*	@param	url[String]	异常信息地址
*	@param	line[String]	异常信息源代码行号
*/
function getScriptError(msg,url,line){
	if(window.console && console.log){
		console.log("Error : " + msg);
		console.log("Url : " + url);
		console.log("Line : " + line);
	}
	if(1 == 0){
		//记录错误信息
		$.ajax({
			type: "GET",
			url : "http://www.localquanzhi.com:81/",
			data : {
				msg : msg,
				url : url,
				line : line
			},
			dataType : "jsonP",
			success : function(msg){
				//写入错误信息成功
				console.log(msg);
			},
			error : function(msg){
				//写入错误信息失败
				console.log(msg);
			}
		});
	}
	return true;
};
window.onerror = getScriptError;

/*
*	全局域名配置，用于selectBar.js、selectLink.js等方法引用数据的域名来源
*	数据主要环境：
*		本地：localquanzhi.cn	前端开发环境引用
*		测试：devquanzhi.cn	研发、测试环境引用
*		线上：quanzhi.cn	正式线上环境引用
*/
(function(){
	//获取当前页面域名
	var hostname = location.hostname.split(".").reverse()[1];
	//判断使用环境
	DOMAIN = (hostname != "devquanzhi" && hostname != "localquanzhi" && hostname != "localin-en") ? "quanzhi.cn" : "devquanzhi.cn";
	POPZINDEX = 9999;
})();

//公共方法

/*
*	# 垂直高度缩放 #
*	@param	cfg[Object > Dom]
*		obj[Object > Dom]	应用对象
*		minH[Number]	缩小高度
*		maxH[Number]	放大高度
*		time[Number][可选]	缩放速度
*/
function zooming(cfg) {
	var obj = cfg.obj,
		min = cfg.minH,
		max = cfg.maxH,
		time = (!cfg.time || cfg.time == undefined) ? "fast" : cfg.time;
	if (!obj || typeof obj != "object") return;
	//显示放大
	this.show = function() {
		$(obj).animate({
			"height": max
		}, time);
	};
	//缩小隐藏
	this.hide = function() {
		$(obj).animate({
			"height": min
		}, time);
	};
};

/*
*	# 选项卡轮换 #
*	@param	cfg[Object > Json]
*		headObj[Object,Object]	标题对象数组
*		contObj[Object,Object]	内容对象数组
*		time[Number][可选]	定时切换时间，单位毫秒
*		fxOff[Bool|Number][可选]	内容淡出动画开启|关闭|时间
*		over[Bool][可选]	鼠标滑入是否暂时终止切换
*/
function tab(cfg) {
	var this_ = this,
		pObj = cfg.headObj,
		cObj = cfg.contObj,
		len = pObj.length,
		index = 0,
		time = (cfg.time || cfg.time != undefined) ? cfg.time : 3000,
		fxTime = (!cfg.fxOff || cfg.fxOff == undefined) ? 0 : (cfg.fxOff && typeof cfg.fxOff == "number") ? cfg.fxOff : 600,
		timeRun;
	if (!pObj || !cObj || typeof pObj != "object" || typeof cObj != "object") return;
	//给标题项目注册切换事件
	$(pObj).each(function(i) {
		$(this).attr("i", i);
		$(this).on("mouseover",function() {
			var i = $(this).attr("i");
			if (i == ((index == 0) ? len - 1 : index - 1)) return;
			this_.run(i);
		});
	});
	//执行切换
	this.run = function(num) {
		if (num) index = parseInt(num);
		$(pObj).each(function(i) {
			if (index == i) {
				$(this).addClass("on");
				$(cObj).eq(i).addClass("on").fadeIn(fxTime);
			} else {
				$(this).removeClass("on");
				$(cObj).eq(i).removeClass("on").hide();
			}
		});
		index = (index >= len - 1) ? 0 : index + 1;
	};
	//开始自动切换
	this.paly = function() {
		timeRun = setInterval(this_.run, time);
	};
	//禁止自动切换
	this.stopPaly = function() {
		clearInterval(timeRun);
	};
	//判断鼠标悬停是否暂停播放
	if (!cfg.over && cfg.over != true) {
		//鼠标移入对象内时禁止自动切换，移出后恢复
		$(pObj).add(cObj).hover(
			function() {
				snsTab.stopPaly();
			}, function() {
				snsTab.paly();
			}
		);
	}
	//判断自动播放是否开启
	if (!cfg.paly && cfg.paly != true) {
		this.paly();
	}
	//默认展开第一页
	this.run(0);
};

var qz = {
	/*
	*	# input change事件逻辑执行部分 #
	*	qz.iptChange.out	清除默认文本
	*	qz.iptChange.over	恢复默认文本
	*/
	jsonData : {},
	/*
	*	@return	[Array]	[[86101010,86101110,8611111],[86141010],[86171010,86171110]]
	*/
	getParentsByCode : function(dataType,code){
		code = code - 0;
		var result = [],
			val = qz.jsonData[dataType][0].dataSearch[code];
		if(val){
			if(val.parents.length){
				for(var i = 0,len = val.parents.length; i < len; i++){
					var parentCodes = this.getParentsByCode(dataType,val.parents[i]);
					for(var j=0;j<parentCodes.length;j++){
						if (parentCodes[j].constructor !== Array){
							result.push([parentCodes[j],code]);
						}
						else
						{
							parentCodes[j].push(code);
							result.push(parentCodes[j]);
						}
					}
				}
			}
			else{
				result = [code];
			}
		}
		return result;
	},
	/*
	*	# 获取全局弹层z-index值：每次获取递增+1 #
	*	@return [Number]
	*/
	getPopZindex : function(){
		return POPZINDEX ++;
	},
	iptChange : {
		out : function(config){
			if(config.color == undefined)config.color = "#333";
            if(config.oldColor == undefined)config.oldColor = "#a5a5a5";
			$(config.obj).each(function(){
				if(this.value != "" && this.value != config.keyWord){
					$(this).css("color",config.color);
				}
				else{
					$(this).css("color",config.oldColor);
					this.value = config.keyWord;
				}
				if(config.callBack)config.callBack();
			});
		},
		over : function(config){
			if(config.color == undefined)config.color = "#333";
            if(config.oldColor == undefined)config.oldColor = "#a5a5a5";
			$(config.obj).each(function(){
				if(this.value == config.keyWord){
					this.value = "";
					$(this).css("color",config.color);					
				} else if(this.value == "") {
					this.value = config.keyWord;
                    $(this).css("color",config.oldColor);                    
                }
				if(config.callBack)config.callBack();
			});
		}
	},
	/*
	*	# 评论 & 回到顶部功能 #
	*	@param config[Object > Json]
	*		comment[Bool|Function][可选]	开启评论悬浮，当为Function类型时，作为回调操作
	*		toTop[Bool|Function][可选]	开启返回顶部悬浮，当为Function类型时，作为回调操作
	*/
	rightFixed : function(config){
		var win = $(window),
			body = $("body"),
			tempObj = $("<div>").css({width:"1000px",margin:"0 auto"}),
			obj = $("<div>").addClass("rightFixed").appendTo(tempObj);
		
		//对象：评论
		if(config.comment){		
			var comment = $("<div>").addClass("comment").appendTo(obj);
			comment.on("click",function(){
				if($.isFunction(config.comment))
					config.comment();
			});
		};

		//对象：返回页面顶部
		if(config.toTop){
			var toTop = $("<div>").addClass("toTop").appendTo(obj);
			if(win.scrollTop() == 0)
				toTop.hide();
			//注册事件：返回页面顶部
			toTop.on("click",function(){
				$("html,body").animate({
					scrollTop : 0
				},500,function(){
					if($.isFunction(config.toTop))
						config.toTop();
				});
			});
		};

		//将对象插入到浏览器正文
		tempObj.appendTo(body);

		//注册浏览器窗体滚动事件
		win.on("scroll resize",function (){
			var winScrollTop = $(this).scrollTop();
			if(toTop && winScrollTop != 0 && !toTop.is(":visible"))
				toTop.fadeIn();
			else if(toTop && winScrollTop == 0)
				toTop.fadeOut();
			
			//obj.animate({top : offsetTop },{ duration:500 , queue:false });
			if($.browser.msie && $.browser.version == 6.0){
				var offsetTop = (winScrollTop + win.height() - obj.height() - 35) + "px";
				obj.css("top",offsetTop);
			}
		});
	},
	/*
	*	# 自定义链接跳转 #
	*	@param	url[String]	要跳转的页面地址
	*	@param	newWindow[Bool][可选]	是否从新窗口打开
	*/
	goPage : function(url,newWindow){
		newWindow ? window.open(url) : window.location.href = url;
	}
};

(function($) {
	$.fn.extend({
		/*
		*	# 文本框、多行文本框默认文本交互操作 #
		*	@param	config[Object > Json]
		*		keyWord[String]	默认的关键词
		*		color[String][可选]	改变后的字体颜色
		*		callBack[Function][可选]	回调方法
		*/
		iptChange : function(config){
			this.each(function(){
				$(this).bind({
					focus : function(){
						qz.iptChange.over({
							obj : this,
							keyWord : config.keyWord,
							color : config.color,
							callBack : config.callBack
						});
					},
					blur : function(){
						qz.iptChange.out({
							obj : this,
							keyWord : config.keyWord,
							color : config.color,
							callBack : config.callBack
						});
					}
				});
			});
			return this;
		}
	});
	$.extend({
		/*
		*	# 添加style样式到页面Head标签内 #
		*	@param	cssText[String]	字符串类型的样式表语句，范例："body{ font-size:12px;}p a{}.test{}#test{}"
		*/
		addStyle : function(cssText){
			var style = document.createElement("style");
			style.type = "text/css";
			try {
			    style.appendChild(document.createTextNode(cssText));
			} catch (ex) {
			    style.styleSheet.cssText = cssText;
			}
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(style);
		},
		/*
		*	# selectBar.js、selectLink.js 数据请求专用方法 #
		*	@param	dataUrl[Srting]	数据路径
		*	@param	dataType[String]	数据类型（名称）
		*	@param	successFn[Function]	请求数据成功后回调方法
		*	@param	errorFn[Function]	请求数据失败后回调方法
		*/
		ajaxData : function(dataUrl,dataType,successFn,errorFn){			
			//将json数据转为string类型
			function jsonToStr(jsonData){
				if(!jsonData || typeof jsonData != "object" )return jsonData;
				var strData = [];
				for(var i = 0; i < jsonData.length; i ++ ){
					strData.push(jsonData[i].name + "," + jsonData[i].value + ((jsonData[i].lev == undefined) ? "@" : "," + jsonData[i].lev + "@"));
					if(jsonData[i].list != undefined){
						for (var p = 0; p < jsonData[i].list.length; p ++ ){
							strData.push(jsonData[i].list[p].name + "," + jsonData[i].value + "_" + jsonData[i].list[p].value + "@");
							if(jsonData[i].list[p].list != undefined){
								for (var g = 0; g < jsonData[i].list[p].list.length; g ++ ){
									strData.push(jsonData[i].list[p].list[g].name + "," + jsonData[i].value + "_" + jsonData[i].list[p].value + "_" + jsonData[i].list[p].list[g].value + "@");
								}
							}
						}
					}
				};
				strData = strData.join("");
				return strData.slice(0,-1);
			};
			/*
			*	# 将String数据类型转换为Json类型 #
			*	@param	strData[String]	数据，转换前格式范例："北京,86101010@东城区,86101110"
			*/
			function strToJson (strData){
				if(typeof strData != "string" || strData == "")return;
				var jsonData = [],children = "children",
					strArr = strData.split("@"),
					strArrLen = strArr.length;
				var num1 = false,num2 = false;
				var searchData = {};
				for(var i = 0; i < strArrLen; i++){
					var strArrs = strArr[i].split(","),
						name = strArrs[0],
						code = strArrs[1];
					if(code != undefined){
						var codeArr = code.split("_");
					}
					
					var parent = null;
						if (codeArr.length > 1)
						{
							parent = codeArr[codeArr.length-2];
						}
					if (searchData[codeArr[codeArr.length-1]])
					{
						if (parent)
						{
							searchData[codeArr[codeArr.length-1]].parents.push(codeArr[codeArr.length-2]);
						}
					}
					else
					{
						var parents = [];
						if (parent)
						{
							parents.push(parent);
						}
						searchData[codeArr[codeArr.length-1]] = {'name':name,parents:parents};
					}
					if(codeArr.length == 1){
						var lev = (strArrs[2] == undefined) ? "" : strArrs[2];
						jsonData.push({
							"code" : code,
							"name" : name,
							"lev" : lev
						});
						num1 = jsonData.length - 1;
					}
					else if(codeArr.length == 2){
						var d = jsonData[num1];
						if(codeArr[0] == d.code.split("_")[0]){
							if(!d[children])d[children] = [];
							d[children].push({
								"code" : code,
								"name" : name
							});
						}
						num2 = d[children].length - 1;
					}
					else if(codeArr.length == 3){
						var d = jsonData[num1][children][num2];
						if(codeArr[0] == d.code.split("_")[0]){
							if(!d[children])d[children] = [];
							d[children].push({
								"code" : code,
								"name" : name
							});
						}
					}
				}
				return {
					jsonData : jsonData,
					searchData : searchData
				};
			};

			//Ajax数据请求与回调函数列队处理
			if(!window.jsonData)window.jsonData = {};
			//回调函数列队变量申明
			if(qz.jsonData[dataType] == undefined){
				qz.jsonData[dataType] = [];
			}
			//加入当前回调函数到列队
			qz.jsonData[dataType].push({
				fn : successFn
			});
			//console.log("是否开始请求数据 : " + dataType);
			if(qz.jsonData[dataType].length > 1){
				//console.log("已开始请求数据，不再请求 : " + dataType);
				if(qz.jsonData[dataType][0].data){
					//console.log("已请求到数据，执行回调函数 : " + dataType);
					successFn(qz.jsonData[dataType][0].data);
				}
				return;
			}
			//console.log("未开始请求到数据，继续执行 : " + dataType);								
			//数据加载完毕后执行排队事件
			function successRun (data){
				if(typeof data == "string")
					var dataStr = data;
				else
					var dataStr = jsonToStr(data);
				var dataJson = strToJson(dataStr);
				for(var i = 0 ; i < qz.jsonData[dataType].length ; i ++ ){
					if(!qz.jsonData[dataType][0].dataStr)
						qz.jsonData[dataType][0].dataStr = dataStr;
					if(!qz.jsonData[dataType][0].data)
						qz.jsonData[dataType][0].data = dataJson.jsonData;
					if(!qz.jsonData[dataType][0].dataSearch)
						qz.jsonData[dataType][0].dataSearch = dataJson.searchData;
					qz.jsonData[dataType][i].fn(dataJson.jsonData);
				}
			};

			//Ajax获取数据
			$.ajax({
				type: "GET",
				//设置返回数据类型为jsonP
				dataType: "jsonP",
				//缓存请求数据
				cache: true,
				//设置callback函数名，用于缓存请求数据文件
				jsonpCallback: dataType + "_callBack",
				//设置jsonP内容编码
				scriptCharset: "UTF-8",
				//设置请求数据地址
				url: dataUrl,
				//设置请求失败时触发函数
				error: errorFn,
				//设置请求成功时触发函数
				success: successRun
			});
		}
	});
})(jQuery);


//DOM加载完毕后执行方法
jQuery(document).ready(function() {
	//showhide：Header区域左上角行业列表弹层等通用方法
	$(".js-base-showhide-click").bind("click", function(event) {
		var contObj = $(this).next();
		if (contObj.css("display") == "block") {
			contObj.slideUp("fast");
		} else {
			contObj.slideDown("fast");
		}
	});
	$(document).bind("click", function(event) {
		$(".js-base-showhide-content").each(function(){
			var obj;
			$(event.target).each(function(){
				if(!$(this).hasClass("js-base-showhide-click"))obj = $(this).parent(".js-base-showhide-click")[0];
				else obj = this;
			});
			if($(this).prev()[0] != obj && $(this).css("display") == "block"){
				$(this).slideUp("fast");
			}
		});
	});

//Base.css UI交互处理

	//input
	$(".ipt").live("focus", function() {
		if (!$(this).hasClass("ipt-text-select")) {
			$(this).addClass("ipt-focus");
		}
	});
	$(".ipt").live("blur", function() {
		$(this).removeClass("ipt-focus");
	});

	//button
	$(".btn").live("focus mouseover", function() {
		var hover = $(this).attr("class").split(" ")[1] + "-hover";
		$(this).addClass("btn-hover " + hover);
		$(this).find(".default-down").addClass("default-down-h");
		$(this).find(".default-downbig").addClass("default-downbig-h");

	});
	$(".btn").live("blur mouseout mouseup", function() {
		var btnClass = $(this).attr("class").split(" ")[1],
			hover = btnClass + "-hover",
			active = btnClass + "-active";
		$(this).removeClass("btn-hover btn-active " + hover + " " + active);
		$(this).find(".default-down").removeClass("default-down-h");
		$(this).find(".default-downbig").removeClass("default-downbig-h");
	});
	$(".btn").live("mousedown", function() {
		var active = $(this).attr("class").split(" ")[1] + "-active";
		$(this).addClass("btn-active " + active);
	});
	$(".btn-disabled").each(function() {
		var disabled = $(this).attr("class").split(" ")[1] + "-disabled";
		$(this).addClass(disabled);
	});	
	

	//ie兼容处理
	if ($.browser.msie) {
		//ie6
		if ($.browser.version == 6.0) {
			//开启&关闭：IE6下所有基于JQuery的动画过渡效果
			jQuery.fx.off = true;

			//Header模块 > 导航区域 小三角显示隐藏效果兼容处理
			$(".tab-2").delegate("li", "hover", function(e) {
				if ($(this).hasClass("on"))
					return;
				var mt = $(this).find("i").eq(0).css("margin-top");
				if (e.type == "mouseenter") {
					$(this).find("i").css("margin-top", "-" + mt);
					$(this).addClass("ie6");
				} else if (e.type == "mouseleave") {
					$(this).find("i").css("margin-top", mt.slice(1, 3));
					$(this).removeClass("ie6");
				}
			});
		}
	}
});