(function($) {
	$.mask = function(){
	}
	$.extend($.mask, {
		settings: {
			maskHtml : "<div id='jquery-extend-mask' class='jquery-extend-mask'></div><div id='jquery-extend-mask-inner' class='jquery-extend-mask-inner'><!--waitHtml--></div>"
		},
		show : function(waitHtml){
			$("#jquery-extend-mask").remove();
			$("#jquery-extend-mask-inner").remove();
			var inner = "";
			if (waitHtml)
			{
				inner = waitHtml;
			}
			$("body").append($.mask.settings.maskHtml.replace("<!--waitHtml-->",inner));
			

			var height = parseInt($('#jquery-extend-mask-inner').css("height"));
			var width = parseInt($('#jquery-extend-mask-inner').css("width"));
			$(window).resize(function() {
				changeextend(); 
			});
			changeextend(); 
			function changeextend()
			{
				$('#jquery-extend-mask-inner').css({
					top:	getPageScroll()[1] + parseInt($(window).height())/2 - height/2,
					left:	getPageScroll()[0] + parseInt($(window).width())/2 - width/2
				});	
				$("#jquery-extend-mask").height(getHeight()).width(getWidth());
			}
			$("#jquery-extend-mask").height(getHeight()).width(getWidth()).css("display","block");
			function getHeight() {
				if ($.browser.msie && $.browser.version < 7) {
					var scrollHeight = Math.max(
						document.documentElement.scrollHeight,
						document.body.scrollHeight
					);
					var offsetHeight = Math.max(
						document.documentElement.offsetHeight,
						document.body.offsetHeight
					);

					if (scrollHeight < offsetHeight) {
						return $(window).height() + 'px';
					} else {
						return scrollHeight + 'px';
					}
				} else {
					return $(document).height() + 'px';
				}
			}
			function getWidth() {
				if ($.browser.msie && $.browser.version < 7) {
					var scrollWidth = Math.max(
						document.documentElement.scrollWidth,
						document.body.scrollWidth
					);
					var offsetWidth = Math.max(
						document.documentElement.offsetWidth,
						document.body.offsetWidth
					);

					if (scrollWidth < offsetWidth) {
						return $(window).width() + 'px';
					} else {
						return scrollWidth + 'px';
					}
				} else {
					return $(document).width() + 'px';
				}
			}
			function getPageScroll() {
				var xScroll, yScroll;
				if (self.pageYOffset) {
					yScroll = self.pageYOffset;
					xScroll = self.pageXOffset;
				} else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
					yScroll = document.documentElement.scrollTop;
					xScroll = document.documentElement.scrollLeft;
				} else if (document.body) {// all other Explorers
					yScroll = document.body.scrollTop;
					xScroll = document.body.scrollLeft;	
				}
				return new Array(xScroll,yScroll) 
			}
		},
		close : function(){
			$("#jquery-extend-mask").css("display","none");
			$("#jquery-extend-mask-inner").css("display","none");
		}
	});
})(jQuery);
