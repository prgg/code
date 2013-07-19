/*
http://www.devquanzhi.cn/html/jquery-mask.html
关于各种弹出层的方法引用，参见此页面。

	$.confirm(html,string,callback,cancelCallback) 打开带自定义皮肤的 confirm 弹窗
		html : [string|object] 弹出层包含内容（含遮罩）
		title : [string] 设置弹窗标题title内容（可选）
		callback : [function] 确定后执行方法（可选）
		cancelCallback : [function] 取消后执行方法（可选）	
	$.confirm_close() 关闭由$.confirm()开启的弹窗

*/
(function($) {
	//弹层处理
	$.extend({
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
		cssText_alert : ".jquery-alert { position:absolute; background:#fff; color:#333; padding-bottom:50px; border:1px solid #425817; box-shadow:2px 2px 0 rgba(150,150,150,0.4); text-align:center; font-size:12px; overflow:hidden; }.jquery-alert-t { display:block; margin:0; padding:8px 0; text-indent:10px; text-align:left; font-size:14px; font-weight:bolder; background:#EEF4E5 url('http://img1.quanzhi.cn/images/v1/poupbtbg.png') repeat-x; }.jquery-alert-cont { margin:0; padding:15px; text-align:left; line-height:25px; min-width:300px; width:auto!important; _width:300px; zoom:1; font-family:SimSun,Arial,sans-serif; }.jquery-alert-t .icon { position:absolute; top:11px; right:10px; cursor:pointer; }.jquery-alert-btn { position:absolute; bottom:0; right:0; width:100%; text-align:right; border-top:1px solid #ddd; padding:10px 0; }.jquery-alert-btn span { margin-right:10px; }",
		//遮罩容器创建
		createBackgroundDom : function(config){
			//设置遮罩容器全局zIndex级别
			if(!window.createBackgroundDom_zIndex)window.createBackgroundDom_zIndex = 9999;
			window.createBackgroundDom_zIndex ++;
			var zIndex = (config && config.zIndex) || window.createBackgroundDom_zIndex,
				opacity = (config && config.opacity) || 0;
			var obj = $("<div>").css({
					"position": "absolute",
					"top": "0",
					"left": "0",
					"width": "100%",
					"height": $(document).outerHeight(true),
					"background": "#fff",
					"display": "none",
					"overflow": "hidden",
					"z-index": zIndex,
					"opacity": opacity
				}).addClass("jquery-mask-bg");
			//用于遮盖select|flash|iframe等优先级较高对象
			//if($.browser.msie)
				obj.html("<iframe src='about:blank' frameborder='0' width='9999' height='9999' scrolling='no' style='visible:hidden;'></iframe>");
			return obj;
		},
		//返回对象在页面中的绝对居中坐标
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
				y : y - 200
			}
		},
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
					if(btn == cancelBtn.get(0) || btn == closeBtn.get(0)){
						if(config.cancelCallback)config.cancelCallback();
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
		alert_close : function(num,callback){
			var contObj = $(".jquery-fn-alert"),
				bgObj = $(".jquery-alert-bg");
			var allObj = contObj.add(bgObj);
			if(typeof num == "number"){
				allObj = contObj.eq(num).add(bgObj.eq(num));
			}
			else if($.isFunction(num)){
				callback = num;
			}
			$._close(allObj,callback);
		},
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
				config.callback = html.callback || "";
				config.cancelCallback = html.cancelCallback || "";
			}
			return $._alert(config);
		},
		confirm_close : function(num,callback){
			var contObj = $(".jquery-fn-confirm"),
				bgObj = $(".jquery-confirm-bg");
			var allObj = contObj.add(bgObj);
			if(typeof num == "number"){
				allObj = contObj.eq(num).add(bgObj.eq(num));
			}
			else if($.isFunction(num)){
				callback = num;
			}
			$._close(allObj,callback);
		}	
	});
})(jQuery);