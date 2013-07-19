if(!window.RL)
var RL = {
	//固定对象，垂直
	fixedTop : function(config){
		if(!$.isPlainObject(config))
			config = {
				obj : $(config)
			};
		return new this.fixed(config);
	},
	fixed : function(config) {
		var this_ = this,
			win = $(window),
			obj = config.obj;		
		//创建占位对象
		var copyObj = obj.clone().css({
			"opacity" : 0,
			"height" : $(obj).height(),
			"zoom" : 1
		}).hide();
		if(config.sub)
			copyObj.children().remove();
		obj.after(copyObj);
		
		//获取对象相对窗体顶部偏移量
		var objTop = obj.offset().top,
			objTop2 = objTop,
			pTop = obj.position().top,
			width = obj.width(),
			set = true;
		var objLeft;
		//计算并返回对象相对窗体左侧偏移量
		var getObjLeft = function(){
			var a = (copyObj.position().left > 0) ? copyObj.position().left : obj.position().left,
				b = (copyObj.offset().left > 0) ? copyObj.offset().left : obj.offset().left;
				objLeft = (($.browser.msie && $.browser.version == "6.0") ? a : b) - obj.css("marginLeft").match(/\d+/);
			return objLeft;
		};
		getObjLeft();
		//计算并返回对象相对窗体顶部偏移量
		var getOffsetTop = function(bool){
			var a = copyObj.offset().top,
				b = obj.offset().top,
				c = 0;
			if(bool)
				c = b;
			return objTop2 = (a > c) ? a : b;
		};
		var getObjWidth = function(){
			obj.css("width","");
			width = (copyObj.is(":visible")) ? copyObj.width() : obj.width();
			return width;
		};
		//重置Fixed对象水平位置
		this.reLeft = function(){
			obj.css({
				"left" : getObjLeft(),
				"width" : getObjWidth()
			});
		};
		//注册resize事件到文档
		win.on("resize",this.reLeft);
		//设置遮罩容器全局zIndex级别
		if(!window.createBackgroundDom_zIndex)
			window.createBackgroundDom_zIndex = 9999;
		var zIndex = createBackgroundDom_zIndex;
		//注册scrll事件到文档
		win.on("scroll", function() {
			getOffsetTop(set);
			if(win.scrollTop() >= objTop2) {
				if(set){
					obj.css({
						"position": "fixed",
						"width" : width,
						"left": objLeft,
						"top": 0,
						"zIndex": 99
					});
					copyObj.show();
					obj.css("z-index",zIndex).insertAfter(copyObj);
					set = false;
				}
				if($.browser.msie && $.browser.version == 6.0) {
					var top = pTop - objTop + win.scrollTop();
					obj.css({
						"position": "absolute",
						"top": top,
						"zoom": 1
					});
				}
			}
			else if(win.scrollTop() < objTop2) {
				if($.browser.msie && $.browser.version == 6.0) {
					obj.css({
						"position": "",
						"top": "",
						"left": ""
					});
				}
				if(!set){
					copyObj.hide();
					obj.css({
						"position": "",
						"width" : "",
						"top": "",
						"left":"",
						"z-index": ""
					}).insertAfter(copyObj);
					set = true;
				}
			}
		});
	},
	//列表Hover
	listBgHover : function(obj){
		$(obj).hover(
			function(){
				$(this).css("background","#f9f9f9");
			},
			function(){
				$(this).css("background","");
			}
		);
	},
	//工具栏Hover
	toolsBarHover : function(obj){
		//注册事件
		var setTimer;
		$(obj).each(function(){
			var children = $(this).find(".operation");
			$(this).hover(
				function(){
					if(!children.hasClass("stop")){
						//clearTimeout(setTimer);
						children.addClass("operation-hover");
					}
				},
				function(){
					if(!children.hasClass("stop")){
						//var this_ = this;
						//(function(){
							if(!$(".follow").children().is(":visible") && $(".jquery-mask-bg").length == 0){
								children.removeClass("operation-hover");
								$.follow_close();
							};
						//})();
						//setTimer = setTimeout(fn,0);
					};
				}
			);
		});
		//文档事件注册：点击后隐藏工具栏
		$(document).on("click",function(event){
			var e = $(event.target);
			if(!e.is(obj) && e.closest(obj).length == 0 && e.closest(".follow").length == 0 && e.closest(".jquery-show-cont").length == 0)
				$('tr.operation').each(function(){
					if(!$(this).hasClass("stop"))
						$(this).removeClass("operation-hover");
				});
		});
	}
};