(function($){
	$.extend({
		/*
		* # 旗帜对联广告 #
		*/
		popCouplets : function(options){
			//必选参数检测
			if(!options || !options.contHtml)
				return;

			//申明初始参数
			var defaults = {
					x : 10,
					y : 50,
					contHtml : null,
					closeStyle : {
						"position" : "absolute",
						"right" : 0,
						"bottom" : 0,
						"width" : 24,
						"padding" : "2px 5px",
						"font-family" : "SimSun",
						"font-size" : "12px",
						"color" : "#999",
						"background" : "#fff",
						"cursor" : "pointer",
						"opacity" : .5
					},
					isScroll : true
				};

			//载入初始参数
			options = $.extend(defaults,options);

			//申明函数
			var fn = {
				closeDOM : function(){
					doc.off("scroll resize",fn.scrollDOM);
					htmlDOM.hide();
				},
				scrollDOM : function(){
					var docLeft = doc.scrollLeft(),
						docTop = doc.scrollTop();
					if(options.isScroll){
						htmlDOM.css({
							"top" : docTop + options.y
						});
					}
					leftObj.css("left",docLeft + options.x);
					rightObj.css("right",options.x);
				},
				init : function(){
					htmlDOM.css("position","absolute");
					this.scrollDOM();
				}
			};

			//DOM对象
			var win = $(window),
				doc = $(document),
				closeObj = $("<span>")
					.css(options.closeStyle)
					.click(fn.closeDOM)
					.html("关闭"),
				leftObj = $("<div>")
					.css({
						"position" : options.isScroll ? "fixed" : "absolute",
						"top" : options.y,
						"left" : options.x
					})
					.html(options.contHtml)
					.append(closeObj),
				rightObj = leftObj
					.clone(true)
					.css({
						"left" : "auto",
						"right" : options.x
					}),
				htmlDOM = leftObj.add(rightObj);

			//载入DOM对象到BODY
			htmlDOM.appendTo("body");

			//Browser Hack
			var isIE6 = $.browser.msie && parseInt($.browser.version) < 7;

			//注册文档事件
			if(isIE6){
				win.add(doc).on("scroll resize",fn.scrollDOM);
				//初始化
				fn.init();
			}
		}
	});
})(jQuery);