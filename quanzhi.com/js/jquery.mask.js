/*
http://www.devquanzhi.cn/html/jquery-mask.html
关于各种弹出层的方法引用，参见此页面。
*/
(function($) {
	//弹层处理
	$.extend({
		//弹层样式，依赖base.js > $.addStyle方法加载到页面
		cssText_alert : ".jquery-alert { position:absolute; background:#fff; color:#333; padding-bottom:50px; border:1px solid #425817; box-shadow:2px 2px 0 rgba(150,150,150,0.4); text-align:center; font-size:12px; overflow:hidden; }.jquery-alert-t { display:block; margin:0; padding:8px 0; text-indent:10px; text-align:left; font-size:14px; font-weight:bolder; background:#EEF4E5 url('http://img1.quanzhi.cn/images/v1/poupbtbg.png') repeat-x; }.jquery-alert-cont { margin:0; padding:15px; text-align:left; line-height:25px; min-width:300px; width:auto!important; _width:300px; zoom:1; font-family:SimSun,Arial,sans-serif; }.jquery-alert-t .icon { position:absolute; top:11px; right:10px; cursor:pointer; }.jquery-alert-btn { position:absolute; bottom:0; right:0; width:100%; text-align:right; border-top:1px solid #ddd; padding:10px 0; }.jquery-alert-btn span { margin-right:10px; }",
		/*
		*	# 创建遮罩容器 #
		*	@param	config[Object > Json][可选]
		*		zIndex[Number]	设置Z轴
		*		opacity[Number]	设置透明度
		*	@return [Object > Dom] 返回一个满屏高宽的半透明遮罩容器DOM对象
		*/
		createBackgroundDom : function(config){
			//设置遮罩容器全局zIndex级别：与selectBar.js、selecty.js共用的全局变量设置，用于弹出层的Z轴优先级控制
			var createBackgroundDom_zIndex = qz.getPopZindex();
			var zIndex = (config && config.zIndex) || createBackgroundDom_zIndex,
				opacity = (config && config.opacity) || 0.5;
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
				}).addClass("jquery-mask-bg");
			//用于遮盖<select>、<object>、<iframe>等系统顶级控件
			//if($.browser.msie)//原本仅针对IE添加遮罩，用于完全遮盖，后来发现chrome某些版本也需要此设置
				obj.html("<iframe src='about:blank' frameborder='0' scrolling='no' width='9999' height='9999' style='opacity:0;filter:alpha(opacity=0);'></iframe>");
			return obj;
		},
		/*
		*	# 返回对象在页面中的绝对居中坐标：x、y轴 #
		*	@param	config[Object > Json]
				obj[Object > Dom]	被计算的对象
				type[String][可选]	计算方式
				targetObj[Object > Dom][可选]	当type == "follow"时，obj坐标值结果为：跟随targetObj边界
		*	@return	{x,y}[Object > Json]
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
			//相对config.targetObj对象跟随定位坐标计算
			if(config.type == "follow"){
				//获取正文内容宽度、偏移量
				var content = $("body").children("div").eq(0),
					cont = {
						W : content.outerWidth(),
						L : content.offset().left
					};
				//获取事件触发来源对象高宽、偏移量
				var btnObj = $(config.targetObj),
					btn = {
						H : btnObj.outerHeight(true),
						W : btnObj.outerWidth(true),
						L : btnObj.offset().left,
						T : btnObj.offset().top
					},
					space = config.space || 0;
				x = btn.L;
				y = btn.T;
				//垂直坐标计算（判断是否超出顶部边界）
				if((btn.T + btn.H + objH - win.T) > win.H)
					y = btn.T - objH - space;
				else y = btn.T + btn.H + space;
				if(y < 0)
					y = btn.T + btn.H + space;
				//水平坐标计算（判断是否超出右侧边界）
				if((btn.L + btn.W + objW) > (cont.W + cont.L))
					x = btn.L + btn.W - objW;
				else x = btn.L;
			}
			//绝对居中坐标计算
			else{
				//水平坐标计算
				x = win.L + win.W/2 - objW/2;
				//垂直坐标计算（判断是否超出顶部边界）
				if(objH > win.H)
					y = win.T;
				else
					y = win.T + win.H/2 - objH/2;
			}
			//返回坐标值
			return {
				x : x,
				y : y
			}
		},
		/*
		*	# $.alert | $.confirm | $.follow 方法的弹层显示执行 #
		*	@param	config[Object > Json]
		*		val[Object|String|Number]	被显示的内容
		*		type[String]	显示方式（类型）
		*		title[String][可选]	标题
		*		callback[Function][可选]	确定方式撤销窗口的回调方法回调
		*		cancelCallback[Function][可选]	取消方式撤销窗口的回调方法
		*		closeCallback[Function][可选]	关闭方式撤销窗口的回调方法
		*		data[Object > Json][可选]	追加额外参数
		*			okBtnTitle	确定按钮文本自定义
		*			cancelBtnTitle	取消按钮文本自定义
		*			closeBtnTitle	关闭按钮文本自定义
		*/
		_alert : function(config){
			//没有传入val时中止执行
			if(!config.val)return;
			//第一次触发本函数时加载相关样式
			if(!window.cssText_alert){
				$.addStyle(this.cssText_alert);
				window.cssText_alert = true;
			};
			//设置对应className
			var className = {
				popObj : "jquery-alert jquery-fn-" + config.type,
				contObj : "jquery-alert-cont",
				btnObj : "jquery-alert-btn",
				okBtn : "btn btn-orange-c",
				cancelBtn : "btn btn-clean-c",
				titleObj : "jquery-alert-t",
				closeBtn : "icon icon-round-del"
			};
			//设置默认title
			var title = {
				okBtn : config.data && config.data.okBtnTitle || "确定",
				cancelBtn : config.data && config.data.cancelBtnTitle || "取消",
				closeBtn : config.data && config.data.closeBtnTitle || "关闭窗口"
			};
			//创建标题模块
			var titleObj = $("<p>").addClass(className.titleObj).html(config.title),
				//创建确定按钮
				okBtn = $("<span>").addClass(className.okBtn).html("<a href='#nogo'>" + title.okBtn + "</a>"),
				//创建取消按钮
				cancelBtn = $("<span>").addClass(className.cancelBtn).html("<a href='#nogo'>" + title.cancelBtn + "</a>"),
				//创建按钮容器
				btnObj = $("<div>").addClass(className.btnObj),
				//创建关闭图标按钮
				closeBtn = $("<i>").attr("title",title.closeBtn).addClass(className.closeBtn).appendTo(titleObj),			
				//创建内容容器对象，并加入val值
				contObj = $("<div>").addClass(className.contObj).append(config.val),
				//获取遮罩容器对象
				bgObj = $.createBackgroundDom().addClass("jquery-" + config.type + "-bg"),
				//创建弹窗容器
				popObj = $("<div>").addClass(className.popObj).data({"html":config.val,"callback":config.callback}),
				//集合：bgObj、popObj
				alertObj = bgObj.add(popObj);
			if(typeof config.val == "object"){
				$(config.val).css("display","block");				
			}
			if(config.type == "alert"){
				//集合：title、cont、btn
				btnObj.append(okBtn);
				var allObj = titleObj.add(contObj).add(btnObj);
			}
			else if(config.type == "confirm"){
				//集合：title、cont、btn、cancel
				btnObj.append(okBtn).append(cancelBtn);
				var allObj = titleObj.add(contObj).add(btnObj);
			}
			//加载allObj到弹窗容器
			popObj.append(allObj);			
			//注册事件用于关闭弹窗
			okBtn.add(closeBtn).add(cancelBtn).on("click",function(){
				var btn = this;
				//判断关闭弹窗条件是否成立
				if(config.defirm && btn == okBtn.get(0)){
					if(config.defirm() == false)
						return false;
				}
				//Confirm取消、关闭按钮处理				
				if(config.type == "confirm"){
					if(btn == cancelBtn.get(0)){
						if(config.cancelCallback)
							config.cancelCallback();
						popObj.data("callback","");
					}
					else if(btn == closeBtn.get(0)){
						var callback = config.closeCallback || config.cancelCallback;
						if(callback)
							callback();
						popObj.data("callback","");
					}
				}
				//执行关闭弹窗
				$._close(alertObj);
			});
			//插入遮罩、弹窗容器到body
			alertObj.appendTo("body");
			//计算弹窗容器坐标以及遮罩层zIndex级别
			var offset = $.getXY({
					obj:popObj
				}),
				top = offset.y,
				left = offset.x,
				zIndex = bgObj.css("z-index") - 0 + 1;
			//设置内容容器在页面中的位置
			popObj.css({
				"top" : top,
				"left" : left,
				"z-index" : zIndex
			});
			//显示遮罩与内容容器
			alertObj.fadeIn("fast",function(){
				if(this == bgObj.get(0))okBtn.children("a").focus();
			});
			return contObj;
		},
		/*
		*	# $.alert | $.confirm | $.follow 方法的弹层关闭执行 #
		*	@param	obj[Object > Dom]	被关闭的弹层对象
		*	@param	callback[Function][可选]	关闭窗口的回调方法回调
		*/
		_close : function(obj,callback){
			obj.fadeOut("fast",function(){
				if(!$(this).is(".jquery-mask-bg")){
					var html = $(this).data("html"),
						callbackFn = $(this).data("callback");
					if(typeof html == "object"){
						$(html).hide().appendTo("body");
					}
					if(callbackFn || callback){
						if($.isFunction(callback))
							callbackFn = callback;
						callbackFn();
					}
				}
				$(this).remove();
			});
		},
		/*
		*	# 自定义UI的alert方法 #
		*	@param	html[Object|String|Number]	显示的内容
		*	@param	title[String][可选]	自定义标题
		*	@param	data[Object > Json][可选]	追加的额外参数
		*	@param	callback[Function][可选]	回调方法
		*/
		alert : function(html,title,data,callback){
			//判断是否传入title值，否则使用默认值
			if(title){
				if(typeof title != "string"){
					if($.isFunction(title)){
						var callback = title;
					}
					else if($.isPlainObject(title)){
						var data = title;
						var callback = data;
					}
				}
				else if($.isFunction(data)){
					var callback = data;
				}
			}
			if(!title || typeof title != "string"){
				var title = "提示";
			}
			return $._alert({
				type : "alert",
				val : html,
				title : title,
				callback : callback,
				data : data
			});
		},
		/*
		*	# 自定义UI的alert关闭方法 #
		*	@param	index[Number|Function][可选]	指定要关闭的弹层索引，类型为function时，转为callback处理
		*	@param	callback[Function][可选]	回调函数
		*/
		alert_close : function(index,callback){
			var contObj = $(".jquery-fn-alert"),
				bgObj = $(".jquery-alert-bg");
			var allObj = contObj.add(bgObj);
			if(typeof index == "number"){
				allObj = contObj.eq(index).add(bgObj.eq(index));
			}
			else if($.isFunction(index)){
				callback = index;
			}
			$._close(allObj,callback);
		},
		/*
		*	# 自定义UI的confirm方法 #
		*	@param	html[Object|String|Number]	显示的内容
		*	@param	title[String][可选]	自定义标题
		*	@param	callback[Function][可选]	执行确定的回调方法
		*	@param	cancelCallback[Function][可选]	执行取消的回调方法
		*/
		confirm : function(html,title,callback,cancelCallback){
			var config = {
				type : "confirm",
				title : "确定"
			};
			if(!html)return;
			else if(!$.isPlainObject(html)){
				//判断是否传入title值，否则使用默认值
				if(!title || title && $.isFunction(title)){
					var cancelCallback = callback,
						callback = title,
						title = config.title;
				}
				config.val = html;
				config.title = title;
				config.callback = callback;
				config.cancelCallback = cancelCallback;
			}
			else if($.isPlainObject(html) && html.val){
				config.val = html.val;
				config.title = html.title || config.title;
				config.defirm = html.defirm || "";
				config.data = html.data || "";
				config.callback = html.callback || "";
				config.cancelCallback = html.cancelCallback || "";
				config.closeCallback = html.closeCallback || "";
			}
			return $._alert(config);
		},
		/*
		*	# 自定义UI的confirm关闭方法 #
		*	@param	index[Number|Function][可选]	指定要关闭的弹层索引，类型为function时，转为callback处理
		*	@param	callback[Function][可选]	回调函数
		*/
		confirm_close : function(index,callback){
			var contObj = $(".jquery-fn-confirm"),
				bgObj = $(".jquery-confirm-bg");
			var allObj = contObj.add(bgObj);
			if(typeof index == "number"){
				allObj = contObj.eq(index).add(bgObj.eq(index));
			}
			else if($.isFunction(index)){
				callback = index;
			}
			$._close(allObj,callback);
		},
		/*
		*	# 跟随指定对象边界显示的弹层 #
		*	@param	html[Object|String|Number]	显示的内容
		*	@param	targetObj[Object > Dom]	指定跟随的对象
		*	@param	callback[Function][可选]	回调方法
		*/
		follow : function(html,targetObj,callback){
			if(!html)
				return;
			else if(typeof html == "object") html = $(html);
			//检测当前对应浮层是否已被打开
			if($(targetObj).data("closeFn")){
				//$(targetObj).data("closeFn")();
				return;
			}
			var speed = 0;//"fast";
			//创建内容浮层
			var contObj = $("<div>").css("position","absolute").attr("id","jquery-extend-mask-inner").addClass("follow").css("zoom",1).hide().append(html).appendTo("body");			
			if(typeof html == "object")
				$(html).show();
			//获取内容浮层在页面中的绝对居中坐标
			var offset = $.getXY({
				type : "follow",
				obj : contObj,
				targetObj : targetObj,
				space : 0
			});
			//设置全局Z轴
			var zIndex = qz.getPopZindex();
			//显示浮层
			contObj.css({
				left : offset.x,
				top : offset.y,
				"z-index" : zIndex
			}).fadeIn(speed);
			//关闭浮层
			var closeFollow = function(){
				$(contObj).add(targetObj).data("closeFn",null);
				$(document).off("click",closeFollowDoc);
				contObj.fadeOut(speed,function(){
					if(typeof html == "object" && contObj.children().get(0) == html.get(0))
						$(html).hide().appendTo("body");
					$(this).remove();
					if(callback)callback();
				});
			};
			var closeFollowDoc = function(event){
				if(event.target != targetObj && event.target != $(targetObj).get(0) && event.target != contObj.get(0) && !$(event.target).parents().is(contObj) && !$(event.target).parents().is(targetObj))
					closeFollow();
			};
			//将关闭浮层函数写入缓存，使下次触发时获取显示状态
			$(contObj).add(targetObj).data("closeFn",closeFollow);
			//注册文档事件，关闭浮层
			$(document).on("click",closeFollowDoc);
			return contObj;
		},
		/*
		*	# 跟随指定对象边界显示的弹层关闭方法 #
		*	@param	index[Number|Function][可选]	指定要关闭的弹层索引，类型为function时，转为callback处理
		*	@param	callback[Function][可选]	回调函数
		*/
		follow_close : function(index,callback){
			var obj = $(".follow");
			if(typeof index == "number")
				obj = obj.eq(index);
			else if(typeof index == "function")
				callback = index;
			obj.each(function(){
				var closeFn = $(this).data("closeFn");
				if(typeof closeFn == "function")
					closeFn();
				if(callback && typeof callback == "function")
					callback();
			});
		},
		/*
		*	# 给指定对象添加一个显示|隐藏的跟随显示弹层 #
		*	@param	btn[Object > Dom]	指定对象
		*	@param	obj[Object|String|Number]	显示的内容，跟随指定对象边界显示|隐藏
		*	@param	time[Number][可选]	显示或隐藏的过程时长
		*/
		toggleFollow : function(btn,obj,time){
			if(!btn || !obj)return;
			var set,
				time = time || 300;
			var fn = {
				btnOver : function(){
					clearTimeout(set);
					if(!obj.is(":visible"))
						$.follow(obj,this);
				},
				btnOut : function(){
					set = setTimeout(function(){
						$.follow_close(-1);
					},time);
				},
				objOver : function(){
					clearTimeout(set);
				},
				objOut : function(){
					btn.mouseout();
				}
			};
			btn.on("mouseover",fn.btnOver);
			btn.on("mouseout",fn.btnOut);
			obj.hover(
				function(){
					fn.objOver();
				},
				function(){
					fn.objOut();
				}
			);
		},
		mask : {
			config : {
				className : {
					bgObj : "jquery-show-bg",
					contObj : "jquery-show-cont"
				}
			},
			/*
			*	$.mask.close(index,callback)
			*	# 关闭弹层 #
			*	@param	name[Number|Function][可选]	指定要关闭的弹层索引，类型为function时，转为callback处理
			*	@param	callback[Function][可选]	回调函数
			*/
			close : function(index,callback){
				var this_ = this,
					allObj = $("." + this.config.className.bgObj).add("." + this.config.className.contObj);
				if(typeof index == "number"){
					allObj = $("." + this.config.className.bgObj).eq(index).add($("." + this.config.className.contObj).eq(index));
				}
				else if($.isFunction(index)){
					callback = index;
				}
				$._close(allObj,callback);
			},
			/*
			*	$.mask.show(html,callback)
			*	# 显示弹层 #
			*	@param	html[Object > Dom|String]	指定要弹出的内容
			*	@param	callback[Function][可选]	回调函数
			*/
			show : function(html,callback){
				//创建遮罩容器
				var bgObj = $.createBackgroundDom().addClass(this.config.className.bgObj);
				if(!html){
					bgObj.appendTo("body").fadeIn("fast");
					return;
				}
				//创建内容容器
				var contObj = $("<div>").attr("id","jquery-extend-mask-inner").css({"position":"absolute","background":"#fff"}).addClass(this.config.className.contObj).hide().append(html);
				//将html缓存到contObj对象中
				if(html)
					contObj.data("html",html);
				//将callback缓存到contObj对象中
				if(callback && $.isFunction(callback))
					contObj.data("callback",callback);
				//集合弹窗容器
				var popObj = bgObj.add(contObj);
				//将弹窗容器插入到body
				popObj.appendTo("body");
				//若HTML为Dom对象则使其显示
				if(typeof html == "object")
					$(html).show();
				//计算弹窗容器坐标以及遮罩层zIndex级别
				var offset = $.getXY({
						obj:contObj
					}),
					top = offset.y,
					left = offset.x,
					zIndex = bgObj.css("z-index") - 0 + 1;
				//设置内容容器在页面中的位置
				contObj.css({
					"top" : top,
					"left" : left,
					"z-index" : zIndex
				});
				//显示遮罩与内容容器
				popObj.fadeIn("fast");
				return contObj;
			}
		}		
	});
})(jQuery);