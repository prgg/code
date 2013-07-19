;(function($) {
    /*
     *  config 用法
     *  $(".js-tips").jsTips({
     *  targetObj : true;
     *  })
     *  $(".js-tips").jsTips({
     *  targetObj : function(text){
     *    var pObj = text.parent("div");
     *    return pObj.length ? pObj : text;
     *   }
     *  });
     * 
     * */
	$.fn.jsTips = function (config) {
		//定义全局变量
		var win = $(window),
            //TODO JSON 参数
			cfg = config ? config : {},
			//获取textarea高度
			textH,
			//获取textarea水平坐标
			textPosL,
			//获取textarea垂直坐标
			textPosT,
			textTip_h,
			textTip,
			textTipBg,
			triangle,
			textCont,
			bool = true,
			textCss = ".text-tip{max-height:100px;background:#fff;font-size:0;border:1px solid #635935;padding:1px;_padding-top:0;position:absolute;display:none;box-shadow:3px 3px 5px #f1f1f1;filter:progid:DXImageTransform.Microsoft.DropShadow(color=#50cccccc,offX=3,offY=3,positives=true)\\9;z-index:99;}.text-tip-show{display:block;}.text-tip .text-tip-cont{font-size:12px;background:#FFF7C6;padding:5px 8px;font-size:12px;line-height:16px;color:#555;overflow-x:hidden;overflow-y:auto;word-wrap:break-word;max-height:90px;position:relative;z-index:2;}.text-tip i{width:6px;height:6px;border-left:1px solid #635935;border-top:1px solid #635935;box-shadow:1px 1px 0px #fff inset;background:#FFF7C6;-webkit-transform:rotate(-135deg);-moz-transform:rotate(-135deg);-ms-transform:rotate(-135deg);-o-transform:rotate(-135deg);position:absolute;left:50%;margin-left:-4px;bottom:-4px;}/* 向上展示状态 */.text-tip-up{margin-top:-10px;}/* 向下展示状态 */.text-tip-down{margin-top:10px;}.text-tip-down i{top:-4px;bottom:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);}";
            //检测是否已载入对应样式
			 if(!window.textCss){
				$.addStyle(textCss);
				window.textCss = true;
			};
        //创建tips对象
		if($("text-tip").length == 0){
			textTip = $("<div>").addClass("text-tip"),
			triangle = $("<i>").appendTo(textTip),
			textCont = $("<div>").addClass("text-tip-cont").appendTo(textTip);
			textTip.appendTo("body");
		}
        //获取tips对象
		else{
			textTip = $(".text-tip"),
			textTipBg = textTop.children(".text-tip"),
			triangle = textTop.children("i"),
			textCont = textTop.children(".text-tip-cont");
		}

		//返回JQ对象
	    return this.each(function(){
	        runTip($(this));
	    });

		//写入提示层内容
		function runTip(text) {
			//获取textarea内容
			var mapTipCont = text.attr("map");
			//检查对象是否初始化过tip方法
			if(text.attr("jsTips") || mapTipCont == undefined || mapTipCont == "")
				return false;
			else
				text.attr("jsTips","1");

			if (parseInt($.browser.version) < 9) {
				triangle.css("display", "none");
			};
            //可视则执行

			function scrollFn(){
				if (textCont.is(":visible"))
					showTip(text);
			}
			//TODO 绑定事件 focus
			text.bind("focus", function() {
				textTip.addClass("text-tip-show");
				setTip(text,mapTipCont);			
				showTip(text,true);

				//滚动条事件注册
				win.bind("scroll",scrollFn);
			});

			//TODO 绑定事件 blur
			text.bind("blur", function() {
				textTip.removeClass("text-tip-show");
				//滚动条事件解除
				win.unbind("scroll",scrollFn);
			});

		};
		//tip写入内容并计算尺寸
		function setTip(text,mapTipCont){
			
			//将map内容写入tip内容层
			textCont.html(mapTipCont);

			var targetObj = text;			
            //TODO 判断是否传入参数
			if(cfg.targetObj){
                //TODO 回调
				if($.isFunction(cfg.targetObj)){
					targetObj = cfg.targetObj(text);
				}
				else{
					var pObj = text.parent("span.ipt");
					targetObj = pObj.length ? pObj : text;
				}
			}

			//获取textarea高度
			textH = targetObj.outerHeight(),
			//获取textarea宽度
			textW = targetObj.outerWidth(),
			//获取textarea水平坐标
			textPosL = targetObj.offset().left,
			//获取textarea垂直坐标
			textPosT = targetObj.offset().top;

			//设置tip层宽度等于源对象宽度
			textTip.width(textW - 4);
			//设置tip层的水平坐标
			textTip.css("left",textPosL);
			//获取Tips高度
			textTip_h = textTip.height();
		};

		//计算提示层坐标并显示
		function showTip(text,test) {

			//获取浏览器卷去的高
			var scrolltop = $(document).scrollTop(),
			textTipMT = parseInt($.browser.version) < 9 ? "" : parseInt(textTip.css("marginTop")),
			//textarea蹑离顶部的高度 + tips高度
			minheight = text.offset().top - scrolltop;

			if (minheight < (textTip_h - textTipMT)) {
				if (!bool && !test) return false;
				textTip.css("top", textPosT + textH);
				textTip.removeClass("text-tip-up").addClass("text-tip-down");
				bool = false;
			} else if (minheight > (textTip_h + textTipMT)) {
				if (bool && ! test) return false;
				textTip.css("top", textPosT - textTip_h);
				textTip.removeClass("text-tip-down").addClass("text-tip-up");
				bool = true;
			}
		};
	};
})(jQuery);
