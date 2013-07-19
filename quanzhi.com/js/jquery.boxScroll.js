(function($){
	$.extend({
		boxScroll : function (config){
			if(!config || !$(config.box).length)
				return;

			//Obj init
			var $box = $(config.box),
				$contBox = config.contBox || $box.find("ul"),
				$list = config.list || $contBox.children("li"),
				$left = config.left,
				$right = config.right,
				w = 0,
				spacing = config.spacing || 1,
				speed = config.speed || "fast",
				boxWidth = $box.innerWidth(),
				listWidth = $list.outerWidth(true),
				maxWidth = listWidth * $list.length;
			if(config.debug){
				var msg = "Debug:\n"+ " 可见区域宽：" + boxWidth + "px\n" + " 单格宽：" + listWidth + "px\n" + " 单格长度：" + $list.length + "\n" + " 总宽：" + maxWidth + "px\n" + " 每次滚动：" + spacing + "格\n" + " 滚动速度：" + speed + "\n";
				try{
					console.log(msg);
				}
				catch(e){
					alert(msg);
				}
			}

			//Style init
			$box.css({"position":"relative","overflow":"hidden"});
			$contBox.css({"position":"absolute","left":0,"top":0,"width":"9999px"});

			//Function init
			function scrollLeft(){
				if(w >= 0)
					return;
				w += listWidth * spacing;
				w = w > 0 ? 0 : w;
				_scroll();
			};
			function scrollRight(){
				var _w = -(maxWidth - boxWidth);
				if(w <= _w)
					return;
				w -= listWidth * spacing;
				w = w < _w ? _w : w;
				_scroll();
			};
			function _scroll(){
				$contBox.stop(true,true).animate({
					left : w + "px"
				},speed,function(){
					if(config.debug){
						var msg = "当前偏移量：" + w + "px";
						try{
							console.log(msg);
						}
						catch(e){
							alert(msg);
						}
					}
				});
			};

			//Event init
			$left.bind("click",scrollLeft);
			$right.bind("click",scrollRight);
		}
	});
})(jQuery);