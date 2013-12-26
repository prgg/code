/******************************** 声明函数、变量对象，不对DOM进行任何操作 ********************************/

// JCN命名空间
var J = {
	speed : 300,//动画速度
	_pageZindex : 0,//Z轴 页面级
	pageZindex : function(){
		return this._pageZindex ++;
	},
	_floatZindex : 99,//Z轴 浮层级
	floatZindex : function(){
		return this._floatZindex++;
	},
	_positionZindex : 999,//Z轴 定位级
	positionZindex : function(){
		return this._positionZindex++;
	},
	//日志是否开启
	log : function(){
		return window.console && console.log ? true : false;
	},	
	//增加样式语句
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
	//JS错误信息处理与收集
	err : {
		//转换信息编码
		toQueryString: function(o) {
			var res = [], p, encode = encodeURIComponent;
			for (p in o) {
				 if (o.hasOwnProperty(p))
				 	res.push(encode(p) + '=' + encode(o[p]));
			}
			return res.join('&');
		},
		//发送信息
		beacon: function(msg) {
			var img = new Image(1,1);
			img.src = 'http://www.j.cn/js_error/1x1.png?' + msg;
		},
		//接受信息
		log: function(info) {
			if(window.console && console.log)
				console.log(info);
			this.beacon(this.toQueryString(info));
		},
		//接受处理函数
		runMethod: function(method) {
			try {
				method();
			} catch(ex) {
				this.log({
					msg : ex.message,
					type : 'try-catch'
				});
			}
		}
	},
	//遮罩创建
	createBackgroundDom : function(config){
		//获取遮罩容器全局zIndex级别
		var createBackgroundDom_zIndex = this.positionZindex(),
			zIndex = config && config.zIndex != undefined ? config.zIndex : createBackgroundDom_zIndex,
			opacity = config && config.opacity != undefined ? config.opacity : 0.5;
		var obj = $("<div>").css({
				"position": "absolute",
				"top": "0",
				"left": "0",
				"width": "100%",
				"height": $(document).outerHeight(true),
				"background": "#000",
				"display": "none",
				"overflow": "hidden",
				"z-index": zIndex,
				"opacity": opacity
			}).addClass("js-float-bg")
			//用于遮盖<select>、<object>、<iframe>等系统顶级控件
			//原本仅针对IE添加遮罩，用于完全遮盖，后来发现chrome某些版本也无法遮盖select等系统控件元素
			.html("<iframe src='about:blank' frameborder='0' scrolling='no' width='9999' height='9999' style='opacity:0;filter:alpha(opacity=0);'></iframe>")
			.appendTo('body');
		return obj;
	},
	/*
	 *	# 自定义UI的alert方法 #
	 */
	alert : function(val){
		window.alert(val);
	},
	//遮罩弹窗
	mask : {
		defaults : {
			bg : {
				cssName : "js-mask-bg"
			},
			cont : {
				cssName : "js-mask-cont"
			}
		},
		/*
		*	# 返回对象在页面中的绝对居中坐标 #
		*	@param	{DomObject}	config.obj	被计算的对象
		*	@return	{Json > Number}	{x,y}	计算后的坐标值
		*/
		getXY : function(config){
			var x,y;
			//获取窗口高宽、滚动条偏移量
			var winObj = $(window),
				win = {
					T : winObj.scrollTop(),
					L : winObj.scrollLeft(),
					H : winObj.height(),
					W : winObj.width()
				};
			//获取内容对象绝对高宽
			var obj = $(config.obj),
				objH = obj.outerHeight(true),
				objW = obj.outerWidth(true);
			//水平坐标计算
			x = win.L + win.W/2 - objW/2;
			//垂直坐标计算（判断是否超出顶部边界）
			if(objH > win.H)
				y = win.T;
			else
				y = win.T + win.H/2 - objH/2;
			//返回坐标值
			return {
				x : x,
				y : y,
				h : objH,
				w : objW
			}
		},
		run : function(config){
			var defaults = {
				obj : null,
				type : null,
				callback : false
			};
			defaults = $.extend(defaults,config);
			if(defaults.obj && defaults.type){
				defaults.obj[defaults.type](function(){
					if($.isFunction(defaults.callback)){
						defaults.callback();
					}
				});
				return defaults.obj;
			}
		},
		/*
		*	J.mask.hide(index,callback)
		*	# 关闭弹层 #
		*	@param	{Number|Function}	name[可选]	指定要关闭的弹层索引，类型为function时，转为callback处理
		*	@param	{Function}	callback[可选]	回调函数
		*/
		hide : function(index,callback){
			var that = this,
				contObj = $("." + this.defaults.cont.cssName),
				bgObj = $("." + this.defaults.bg.cssName),
				allObj = contObj.add(bgObj);
			if(typeof index == "number"){
				allObj = contObj.eq(index).add(bgObj.eq(index));
			}
			else if($.isFunction(index)){
				callback = index;
			}
			return that.run({
				obj : allObj,
				type : "fadeOut",
				callback : callback
			});
		},
		/*
		*	J.mask.show(html,callback)
		*	# 显示弹层 #
		*	@param	{Object|String|Number}	html	指定要弹出的内容
		*	@param	{Function}	callback[可选]	回调函数
		*/
		show : function(html,callback){
			//创建遮罩容器
			var that = this,
				bgObj = J.createBackgroundDom().addClass(this.defaults.bg.cssName);
			if(!html){
				return that.run({
					obj : bgObj.appendTo("body"),
					type : "fadeIn"
				});
			}
			//创建内容容器
			var contObj = $("<div>")
				.hide()
				.addClass(this.defaults.cont.cssName)
				.append(html);
			//集合弹窗容器
			var allObj = bgObj.add(contObj)
			//将弹窗容器插入到body
				.appendTo("body");
			//若HTML为Dom对象则使其显示
			if(typeof html == "object")
				$(html).show();
			//计算弹窗容器坐标以及遮罩层zIndex级别
			var offset = this.getXY({
					obj : contObj
				}),
				positionType = "fixed",
				top = "50%",
				left = "50%",
				mt = -(offset.h/2),
				ml = -(offset.w/2),
				zIndex = bgObj.css("z-index") - 0 + 1;
			//IE6 Fix
			if(!window.XMLHttpRequest){
				positionType = "absolute";
				top = offset.y;
				left = offset.x;
				mt = "";
				ml = "";
				function ie_fix(){
					var offset = J.mask.getXY({ obj : contObj });
					return contObj.css({
						top : offset.y,
						left : offset.x
					});
				};
				$(window).on("resize scroll",ie_fix);
			}
			//设置内容容器在页面中的位置
			contObj.css({
				"position" : positionType,
				"top" : top,
				"left" : left,
				"margin-top" : mt,
				"margin-left" : ml,
				"z-index" : zIndex
			});
			//显示遮罩与内容容器
			that.run({
				obj : allObj,
				type : "fadeIn"
			});
			return contObj;
		}
	},
	/*
	* 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
	* @param fn {function}  需要调用的函数
	* @param delay  {number}	延迟时间，单位毫秒
	* @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
	* @return {function}	实际调用函数
	*/
	throttle : function (fn, delay, immediate, debounce) {
		var curr = + new Date(),
			last_call = 0,
			last_exec = 0,
			timer = null,
			diff, //时间差
			context,//上下文
			args,
			exec = function () {
				last_exec = curr;
				fn.apply(context, args);
			};
		return function () {
			curr = +new Date();
			context = this;
			args = arguments;
			diff = curr - (debounce ? last_call : last_exec) - delay;
			clearTimeout(timer);
	 
			if (debounce) {
				if (immediate) {
					timer = setTimeout(exec, delay);
				} else if (diff >= 0) {
					exec();
				}
			} else {
				if (diff >= 0) {
					exec();
				} else if (immediate) {
					timer = setTimeout(exec, -diff);
				}
			}
	 
			last_call = curr;
		};
	},
	/*
	* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
	* @param fn {function}  要调用的函数
	* @param delay   {number}	空闲时间
	* @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
	* @return {function}	实际调用函数
	*/
	debounce : function (fn, delay, immediate) {
		return this.throttle(fn, delay, immediate, true);
	},
	//顶部导航二级分类
	topCate : function(obj){
		$(obj).each(function () {
			$(this).click(function () {
				$(this).addClass("cur").siblings().removeClass("cur");
			});
			$(this).find("i").click(function (event) {
				event.stopPropagation();
				$(this).parent().parent().removeClass("cur")
			});
		});
	}
};

J.cookie = {
	/**
	 * @public 设置cookie。setCookie(key, value, expires, path, domain, secure)
	 * @method setCookie
	 * @param {String} key cookie的键名
	 * @param {String} val cookie字段的值
	 * @param {Number} [expires] 保存天数
	 * @param {String} [domain] cookie域名
	 * @param {String} [path] cookie路径
	 * @param {Boolean} [secure] cookie是否为安全传输
	 * @return void
	 */
	set:function(key, val, expires, domain, path, secure){
		if (!path) path = '/';
		expires = expires || 0;
		//expires = expires * 86400000;
		var e_date = new Date();
		e_date.setTime(+e_date + expires);
		document.cookie = 
			key + '=' + encodeURIComponent(val)
			+ (expires ? '; expires=' + e_date.toGMTString() : '')
			+ (domain ? '; domain=' + domain : '')
			+ (path ? '; path=' + path : '')
			+ (secure ? '; secure' : '');
	},
	
	/**
	 * 获取 cookie 值
	 * @param {String} key cookie字段的名字
	 * @return {String} 如果 key 不存在，返回 null
	 */
	get: function(key) {
		var c = document.cookie.split("; ");
		for (var i = 0; i < c.length; i++) {
			var p = c[i].split("=");
			if (key == p[0]) try { return decodeURIComponent(p[1]) } catch (e) { return null }
		}
		return null;
	},
	
	/**
	 * 删除 cookie 值
	 * @param {String} key cookie字段的名字
	 * @param {String} domain
	 * @param {String} path
	 */
	del: function(key, domain, path) {
		document.cookie = key + "=1" + (path ? "; path="+path:"; path=/")+(domain?"; domain="+domain:"")+";expires=Fri, 02-Jan-1970 00:00:00 GMT";
	},
	
	/**
	 * 获取域名以.分隔的最后两段，如music.xx.com 返回 .xx.com
	 * @return {String} 返回域名以.分隔的最后两段
	 */
	getDomain:function(){
		return "." + location.host.split(".").slice(-2).join(".");
	}
};

//筛选模块 交互支持
J.filter = function(){
	var wrap = $(".js-base-filter");
	wrap.each(function(){
		var timer,
			numObj = $(".num",this),
			numInputs = $("input",numObj),
			numButton = $("button",numObj),
			numMore = $("div",numObj),
			numUrl = $(this).attr("data-url"),
			numType = $(this).attr("data-type"),
			numLocation = $(this).attr("data-location"),
			colorObj = $(".color",this),
			colorMore = $("ul",colorObj);
		//交互：价格表单
		numInputs.focus(function(){
			clearTimeout(timer);
			numMore.show();
		})
		.blur(function(){
			timer = setTimeout(function(){
				numMore.hide();
			},100);
		});
		numButton.mouseover(function(){
			clearTimeout(timer);
		})
		.click(function(){
			numMore.hide();
		});
		//交互：更多颜色
		colorObj.hover(
			function(){
				colorMore.show();
			},
			function(){
				colorMore.hide();
			}
		);
	});	
};

// 返回顶部
J.goToTop = function(obj) {
	var that = this;
	$(obj).click(function() {
		$("html, body").animate({
			scrollTop: 0
		},that.speed);
	});
};

//浮动导航
J.navFloat = {
	//判断浏览器宽度是否添加样式
	newmyWardrobe_add_remo : function(){
			var winw = $(window).width();//window的初始化宽度
			if(winw <= 1024){
				$("body").addClass("w-1024");
				$(".newmyWardrobe").addClass("newmyWardrobe1024");
				$(".newGoToTop").addClass("newGoToTop1024");
			}else{
				$("body").removeClass("w-1024");
				$(".newmyWardrobe").removeClass("newmyWardrobe1024");
				$(".newGoToTop").removeClass("newGoToTop1024");
			}
		},
	//方法执行
	handle : function(){
		//获取滚动条高度
		st = $(document).scrollTop();
		//执行nav_float_two方法
		J.navFloat.nav_float_two(st);
		//判断浏览器宽度是否添加样式
		J.navFloat.newmyWardrobe_add_remo();
	},
	//导航浮动
	nav_float_two : function(_top){
		//用来判断在非ie6
		var ie6 = window.XMLHttpRequest;
		//高于ie6的版本
		if(ie6){
			if(_top > 110){
				$("#js-base-web-nav-cont").addClass("web-nav-fixed");
				//$(".nav3_wrap").addClass("nav3_fix");
				/*$("#js-base-web-nav-cont").css({
					"position" : "fixed",
					"top":0
				});*/
			}else{
				$("#js-base-web-nav-cont").removeClass("web-nav-fixed");
				//$(".nav3_wrap").removeClass("nav3_fix");
				/*$("#js-base-web-nav-cont").css({
					"position" : "",
					"top" : ""
				});*/
			}
		}
	}
};

//固定位置
J.fixed = function(options){
	//阈值，防止重复读写DOM属性值
	var top = true,bottom = true;
	//计算
	function fixed(){
		var scrollTop = $(document).scrollTop(),
			scrollBottom = $(document).height() - scrollTop - $(window).height();
		if(window.XMLHttpRequest){
			if(options.top && scrollTop >= options.top[0]){
				if(options.bottom && scrollBottom <= options.bottom){
					if(bottom){
						options.obj.css({
							"position" : "absolute",
							"top" : options.obj.offset().top
						});
						bottom = false;
					}
					top = true;
					return;
				}
				if(top){
					options.obj.css({
						"position" : "fixed",
						"top" : options.top[1]
					});
					top = false;
					bottom = true;
				}
			}
			else{
				if(!top){
					options.obj.css({
						"position" : "",
						"top" : ""
					});
					top = true;
					bottom = true;
				}
			}
		}		
	};
	//注册事件（滚动、对象尺寸改变、载入）
	$(window).on("scroll resize load",fixed);
};

//加入衣橱
J.addMyWardrobe = {
	//执行click事件,点击按钮触发动画效果
	objMyWardrobe : function(objBtn,callback){
		$(objBtn).bind({
			click : function(){
				//加入衣橱动画效果
				J.addMyWardrobe.addAnimate(this);
				//回调函数
				if(callback){
					callback.call(this);
				}
			}
		});
	},
	creaIcon : function(){
		var icon = $('<i class="icon-addAnimate-icon" id="js-base-addAnimate-icon"></i>');
		$(icon).appendTo("body");
		return icon;
	},
	getOffset : function(obj){
		var offset = obj.offset();
		return {
			x : offset.left + 20,
			y : offset.top
		}
	},
	//动画执行，obj为点击按钮对象
	addAnimate : function(obj) {
		//获取对象坐标值
		var aoffsetL = $(obj).offset().left,
			aoffsetT = $(obj).offset().top,
			//我的衣橱 对象
			myyichu = $("#js-base-addAnimate-myyichu"),
			//我的衣橱 坐标
			myyichuOffset = J.addMyWardrobe.getOffset(myyichu),
			//图标+1
			addOneObj = $("#js-base-addAnimate-addOne"),
			//图标衣橱
			iconObj = $("#js-base-addAnimate-icon");
		//如果图标衣橱不存在，则创建图标衣橱
		if(!iconObj.length){
			iconObj = J.addMyWardrobe.creaIcon();
		}
		//图标衣橱 动画开始
		iconObj.css({
			"left": aoffsetL,
			"top": aoffsetT
		}).show().stop(true).animate({
			top: [myyichuOffset.y, 'easeOutCubic'],
			left: myyichuOffset.x,
			opacity: 0
		}, 500, 'linear', function() {
			//图标衣橱 隐藏
			$(this).css({
				"display": "none",
				"opacity": 1,
				"left": myyichuOffset.x + 4,
				"top": myyichuOffset.y + 20
			});
			clearTimeout(animateShow);
			//图标+1 动画开始
			var animateShow = setTimeout(function() {
				addOneObj.fadeIn("fast").stop(true).animate({
						top: "15px",
						opacity: 1
					}, J.speed, function() {
						clearTimeout(newsAdd);
						//图标+1 隐藏
						var newsAdd = setTimeout(function() {
							addOneObj.css({
								"opacity": 1,
								"display": "none",
								"top": "40px"
							});
							//我的衣橱 闪烁
							J.lightning(myyichu);
						}, 500);
					});
			}, 400);
		});
	}
};

//标签云
J.tagCloud = function(tagcloudObj){
	var tagLength = tagcloudObj.length;
	//判断节点是否存在
	if(tagLength){
		$(tagcloudObj).each(function () {
			var rand = parseInt(Math.random() * 27);
			$(this).addClass("tags" + rand);
		});
	}
};

//站内全局导航交互操作：显示与隐藏全部分类
J.webNav = function(config){
	var speed,bool;
	speed = [10,200];
	function show(){
		if(bool)
			config.contObj.addClass(config.classHover);
	};
	function hide(){
		if(!bool)
			config.contObj.removeClass(config.classHover);
	};
	function s_show(){
		bool = true;
		setTimeout(show,speed[1]);
	};
	function s_hide(){
		bool = false;
		setTimeout(hide,speed[0]);
	};
	config.eventObj.mouseover(s_show).mouseout(s_hide);
	config.closeObj.click(s_hide);
};

//对象闪烁动画
J.lightning = function(obj){
	$(obj).stop(true).animate({
		'opacity': 0.4
	}, 200).animate({
		'opacity': 1
	}, 200).animate({
		'opacity': 0.4
	}, 200).animate({
		'opacity': 1
	}, 200).animate({
		'opacity': 0.4
	}, 200).animate({
		'opacity': 1
	}, 200).animate({
		'opacity': 0.4
	}, 200).animate({
		'opacity': 1
	}, 200);
};

//头部 - 寻找属于你的私人选款师，hover效果
J.mouseHover = function () {
	var pro = $(".pro_list .layout,.fosi24");
	pro.each(function() {
		var add = $(this).find(".pro_add");
		var tag = $(this).find(".f_proTag");
		var imgBor = $(this).find(".imgwrap");
		var wbGuideReg = $(this).find(".wb_guide_reg");
		$(this).hover(function() {
			tag.css("display", "block");
			add.css("top", "15px");
			imgBor.addClass("imgwrap_h");
			wbGuideReg.css("top", "14px");
			if ($(this).parent().parent().hasClass("test_list")) {
				add.css("top", "10px");
			}
		}, function() {
			tag.css("display", "none");
			add.css("top", "-999em");
			wbGuideReg.css("top", "-999em");
			imgBor.removeClass("imgwrap_h");
		})
	})
};

/*
 * 表单项文本框 - 默认文本的交互行为支持
 * @param	{Object}	objs	Dom对象，可多个
 * @param	{Array}	colors	长度2，0 = 默认字体颜色，1 = 改变后字体颜色
 * @return	{Array}	长度为总计遍历的对象，0代表未加载逻辑处理，1反之
 */
J.placeholder = function(objs,colors) {
	//参数处理
	var $this = $(objs),
		relogs = [],
		ui = {};
	colors = colors && colors.constructor == Array ? colors : ["gray","black"];
	//表现
	ui.focus = function(obj,placeholderText){
		obj.val("").css("color",colors[1]);
	};
	ui.blur = function(obj,placeholderText){
		obj.val(placeholderText).css("color",colors[0]);
	};
	//行为初始化
	function event_init(obj){
		//支持placeholder
		if(typeof obj.get(0).placeholder === "string"){
			return 0;
		}
		//非支持placeholder
		else{
			var placeholderText = obj.attr("placeholder");
			if(typeof placeholderText !== "undefined"){
				ui.blur(obj,placeholderText);
				obj.focus(function(){
					if(this.value === placeholderText){
						ui.focus($(this),placeholderText);
					}
				}).blur(function(){
					if(this.value === ""){
						ui.blur($(this),placeholderText);
					}
				});
				return 1;
			}
			else{
				return 0;
			}
		}
	};
	//如果对象存在
	if($this.length){
		//遍历对象并初始化
		$this.each(function(){
			relogs.push(event_init($(this)));
		});
		if(this.log()){
			console.log("J.placeholder : ",relogs);
		}
	}
};

//收藏与登录
J.nav_login = function(obj){
	var that = this,
		box = obj && $(obj).length ? $(obj) : false || $("#js-base-nav_login");
	if(box.length){		
		//显示内容并接受对象
		var showObj = this.mask.show(box);
		if(!box.attr("data-status")){
			var closeObj = $("[data-type=close]",box);
			//注册事件到指定对象
			closeObj.click(function(){
				that.mask.hide();
			});
		}
		box.attr("data-status",true);
	}
	else if(J.log()){
		console.log("J.nav_login() 必选对象不存在");
	}
};

//登录提示
J.right_bottom_fixed = function(obj){
	var doc = $(document),
		win = $(window);

	win.on("resize scroll",init);

	function init(){
		var winHeight = win.height(),
			docScrollTop = doc.scrollTop(),
			docHeight = doc.outerHeight();
		if((winHeight + docScrollTop)/docHeight >= 0.82){
			win.off("resize scroll",init);run();
		}
	};

	function run(){
		var h = obj.outerHeight(),
			fixedBottom = -h,
			bottom = 0,
			right = 0;
		obj.css({
			"position" : "fixed",
			"right" : right
		});
		if(!window.XMLHttpRequest){
			positionType = "absolute";
			fixedBottom = doc.scrollTop() + win.outerHeight();
			bottom_ = fixedBottom - h - bottom;
			obj.css({
				"position" : "absolute",
				"top" : bottom_
			}).show();
			function ie_ifx(){
				var bottom_ = doc.scrollTop() + win.outerHeight() - h - bottom;
				obj.css({
					"top" : bottom_
				});
			};
			win.on("resize scroll",ie_ifx);
		}
		else{
			obj.css("bottom", fixedBottom).show().animate({
				"bottom" : bottom
			});
		}
		if(!obj.attr("data-status")){
			var closeObj = $("[data-type=close]",obj);
			//注册事件到指定对象
			closeObj.click(function(){
				if(!window.XMLHttpRequest){
					fixedBottom = h + doc.outerHeight();
					obj.animate({
						"top" : fixedBottom
					},function(){
						$(this).hide();
					});
				}
				else{
					obj.animate({
						"bottom" : fixedBottom
					},function(){
						$(this).hide();
					});
				}
			});
		}
		obj.attr("data-status",true);
	}
};

//遮罩提示，添加遮罩背景
J.tip = {
	status : false,
	init : function(){
		if(!this.status){
			//创建提示对象
			var ward = $('<div class="ward_tip" style="display:none;"></div>'),
				rig = $('<div class="rig_tip" style="display:none;"></div>'),
				bg = J.createBackgroundDom();
			//载入提示对象
			$('body').append(ward).append(rig);
			this.status = {
				ward : ward,
				rig : rig,
				bg : bg
			};
		}
	},
	ward_show : function(){
		this.init();
		//获取我的衣橱坐标
		var that = this,
			objYC = $('#js-base-addAnimate-myyichu');
			ycLeft = objYC.offset().left,
			ycTop = objYC.offset().top;
		this.status.bg.show();
		this.status.ward.css({
			'display':'block',
			'position':'absolute',
			'top':ycTop+2,
			'left':ycLeft-140,
			'z-index':J.positionZindex()
		})
		.click(function(e){
			that.status.ward.add(that.status.bg).hide();
		});
	},
	rig_show : function(){
		this.init();		
		//获取坐标 私人选款师
		var that = this,
			objTool = $('.xks-sort'),
			tLeft = objTool.offset().left - this.status.rig.width() + objTool.width(),
			tTop = objTool.offset().top - 93;
		$('.qmark').click(function(){
			that.status.rig.css({
				'display':'block',
				'position':'absolute',
				'top':tTop,
				'left':tLeft,
				'z-index':J.positionZindex()
			});
			objTool.css("z-index",J.positionZindex());
			that.status.bg.show();
		});		
		this.status.rig.click(function(){
			objTool.css("z-index","");
			that.status.rig.add(that.status.bg).hide();
		});
		var rigTipFun = function(){
			tTop = objTool.offset().top - 93;
			that.status.rig.css({
				'top':tTop
			});
		};
		$(window).load(function(){
			rigTipFun();
		});
		$(window).scroll(function(){
			rigTipFun();
		});
	}
};


//注册onerror事件到window对象，用于监听页面脚本错误信息
/*window.onerror = function(msg,url,line) {
	//	msg{String}	错误信息详情
	//	url{String}	错误信息地址
	//	line{String}	错误代码行号
	//	type{String}	错误信息来源类型
	J.err.log({
		msg : msg,
		url : url,
		line : line,
		type : 'onerror'
	});
	return true;
};*/
/*function closeBox(id) {
	if ($("#" + id)) {
		$("#" + id).fadeOut("slow").removeClass("fast");
	}
}*/

$(function(){

	//加载引导提示 - 我的衣橱&私人定制 20130903
		//J.tip.ward_show();
	//筛选模块 交互支持
		J.filter();
	//返回顶部
		J.err.runMethod(function(){
			J.goToTop(".newGoToTop");
		});
	//window执行handle
		$(window).bind({
			scroll : J.navFloat.handle,
			resize : J.throttle(function(){
				J.navFloat.newmyWardrobe_add_remo();
			  },300,true),
			onresize : J.throttle(function(){
				J.navFloat.newmyWardrobe_add_remo();
			  },300,true),
			load : J.throttle(function(){
				J.navFloat.handle();
			  },300,true)
		});
	//二级导航
		J.topCate(".topCate a");
	//执行标签云方法
		J.tagCloud(".btmcloud a");
	//执行加入衣橱动画效果
		J.addMyWardrobe.objMyWardrobe($(".addto_btn, .addto, .add_btn"),function(){
			$(this).parent().html("已收入衣橱");
		});
	//文本框焦点
	//J.searchStatus($('.sea_in,#js-base-login-input'));
		J.placeholder($("input"),["#999","#333"]);
	//页面载入后：header区域 > 选款师头像闪烁
		J.lightning(".fun_guide");
	//头部 - 寻找属于你的私人选款师，hover效果
		J.mouseHover();
	//header区域 > 主导航 > 显隐全部（更多）分类
		J.webNav({
			contObj : $("#js-base-web-nav-cont"),
			eventObj : $(".js-base-web-nav-event"),
			closeObj : $(".js-base-web-nav-close"),
			classHover : "web-nav-hover"
		});
});
