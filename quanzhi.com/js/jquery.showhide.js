(function($)
{
	$.fn.showhide = function(){
		$(".jquery-showhide-hover").each(function(){
			var objContent = $(".jquery-showhide-content",$(this));
			$(this).hover(function(){
				show($(this),objContent);
			},
			function(event){
				objContent.css("display","none");
			});
		});
		$(".jquery-showhide-click").each(function(){
			var objParent = $(this);
			var objContent = $(".jquery-showhide-content",$(this));
			var objClicker = null;
			if ($(this).is(".jquery-showhide-clicker"))
			{
				objClicker = $(this);
			}
			else
			{
				objClicker = $(".jquery-showhide-clicker",$(this));
			}
			if (!objClicker.length)
			{
				objClicker = $(this);
			}
			objClicker.click(function(){
				if (objContent.css("display") != "none")
				{
					objContent.css("display","none");
				}
				else
				{
					show(objParent,objContent);
				}
			});
		});
		$(document).mousedown(function(event){
			var target = $(event.target);
			if ((!target.parents(".jquery-showhide-click").length) && (!target.is(".jquery-showhide-clicker")))
			{
				$(".jquery-showhide-click .jquery-showhide-content").css("display","none");
			}
		});
		
		$(".jlklist_item").hover(function(){$(this).addClass("jlklist_item-hover")},function(){$(this).removeClass("jlklist_item-hover")});/*鼠标经过增加一个class,消失隐藏*/
		
		function show(obj,objContent)
		{
			var position = new getPosition(obj);
			var top = position.Top + position.Height;
			//objContent.css({"display":"block","position":"absolute","left":position.Left+"px","top":top+"px"});
			objContent.css({"display":"block","position":"absolute"});
		}
		function getPosition(obj)
		{
			this.Top = obj.offset().top;
			this.Left = obj.offset().left;
			this.Width = obj.outerWidth();
			this.Height = obj.outerHeight();
			return this;
		}
	}
	$(function(){
		$(document).showhide();
	})
})(jQuery);

