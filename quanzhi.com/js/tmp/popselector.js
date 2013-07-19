(function($) 
{
	$.fn.popselector = function(options)
	{
		var objSelector = $(this);
		var objContainer,objContent,objSelected,objDisplayText,objDisplayValue;
		var options = options;
		var selectorWidth = 620;
		var itemWidth = 150;
		var childWidth = 300;
		var moveTimeStamp = new Date().getTime();
		var timeoutId = 0;
		var selectorSelected = new Array();
		if (options)
		{
			if (options.selectorWidth)
			{
				selectorWidth = options.selectorWidth;
			}
			if (options.itemWidth)
			{
				itemWidth = options.itemWidth;
			}
			if (options.childWidth)
			{
				childWidth = options.childWidth;
			}
		}
		var maxStr = '';
		if (options.maxSelectedNum) {
			maxStr = '最大选择'+options.maxSelectedNum+'项';
		}
		var containerHtml = '\
			<div class="popselector-boxtitle">\
				<span><img class="popselector-close" src="/resources/images/clo.gif" alt="关闭" /></span>\
				<b>请选择：'+maxStr+'</b>\
			</div>\
			<div class="popselector-selected">\
				<span>\
					<input class="popselector-confirm" type="button" value="确定">\
					<input class="popselector-clear" type="button" value="清除">\
					<input class="popselector-cancel" type="button" value="取消">\
				</span>\
				已选择：\
			</div>\
			<div class="popselector-selected-content"></div>\
			<div class="popselector-content">\
			</div>\
		';
		if (options)
		{
			if (options.width)
			{
				selectorWidth = options.width;
			}
		}
		
		var content = '<div class="popselector-owner"><input class="popselector-display-text" readonly="readonly" type="text"';
		if (options.selectedText)
		{
			content += ' value="'+options.selectedText+'"';
		}
		content += '><input class="popselector-display-button" type="button"><input class="popselector-display-value" type="hidden" name="'+options.name+'"';
		if (options.selectedValue)
		{
			content += ' value="'+options.selectedValue+'"';
		}
		content += '></div>';
		objSelector.html(content);
		objSelector.click(function(){
			$.mask.show();
			if (!objContainer)
			{
				buildContent();
			}
			else
			{
				selectorShow();
			}
		});

		function buildContent()
		{
			if (!options.data)
			{
				if (options.url)
				{
					$.ajax({
						type: "get",
						url: options.url,
						dataType:"json",
						beforeSend: function(XMLHttpRequest){
							if (options.beforeLoad)
							{
								options.beforeLoad(XMLHttpRequest);
							}
						},
						success: function(data){
							if (options.loaded)
							{
								options.loaded(data);
							}
							options.data = data;
							init();
						},
						complete: function(){},
						error: function(){
							if (options.loadError)
							{
								options.loadError();
							}
						}
					});
				}
			}
			else
			{
				init();
			}
		}
		function init()
		{
			var parentAllowCheck = true;
			if (options.allow)
			{
				parentAllowCheck = false;
			}
			var htmlContent = getParentHtmlContent(options.data,0,parentAllowCheck)[0];
			var html = '<div id="popselector-container_'+options.name+'" class="popselector-container" style="display:none;">' + containerHtml + '</div>';
			$('#popselector-container_'+options.name).remove();
			$("body").append(html);

			objContainer = $("#popselector-container_"+options.name);
			objContent = $(".popselector-content",objContainer);
			objSelected = $(".popselector-selected-content",objContainer);
			objDisplayText = $(".popselector-display-text",objSelector);
			objDisplayValue = $(".popselector-display-value",objSelector);

			objContainer.css({"width":selectorWidth+"px"});
			objContent.html(htmlContent);
			bindEvent();
			selectorShow();
		}
		function bindEvent()
		{
			initSelected();
			$("li",objContent).each(function(){
				$(this).mousemove(function(){
					moveTimeStamp = new Date().getTime();
				});
				$(this).hover(function(){
						showChild($(this));
					},
					function(){
						$(this).children('ul').removeClass("popselector-show").addClass("popselector-hide");
						clearTimeout(timeoutId);
					}
				);
				$(this).children("input").click(function(){
					if ($(this).next().is(".popselector-uncheck") || $(this).next().is(".popselector-uncheck-parent"))
					{
						$(this).attr("checked",!$(this).attr("checked"));
						return;
					}
					var checked = $(this).attr("checked");
					selectorSelect($(this).parent(),checked);
				});
				$(this).children("span").click(function(){
					if (!$(this).is(".popselector-uncheck") && !$(this).is(".popselector-uncheck-parent"))
					{
						var checked = !$(this).prev().attr("checked");
						selectorSelect($(this).parent(),checked);
					}
				});
			});
			$(".popselector-confirm",objContainer).click(function(){
				var val = "";
				var text = "";
				for (var i=0;i<selectorSelected.length ;i++)
				{
					if (val)
					{
						val += ",";
						text += ",";
					}
					val += selectorSelected[i][0];
					text += selectorSelected[i][1];
				}
				objDisplayText.attr("value",text);
				objDisplayValue.attr("value",val);
				selectorClose();
			});
			$(".popselector-clear",objContainer).click(function(){
				objDisplayText.attr("value","");
				objDisplayValue.attr("value","");
				$(".popselector-selected-text",objSelected).each(function(){
					var dataValue = $(this).attr("dataValue");
					$(".popselector-item[datavalue='"+dataValue+"']>input",objContent).attr("checked",false);
				});
				selectorSelected = new Array();
				objSelected.html("");
			});
			$(".popselector-cancel",objContainer).click(function(){
				selectorClose();
			});
			$(".popselector-close",objContainer).click(function(){
				selectorClose();
			});
			$(window).resize(function() {
				if(objContainer.css('display') == 'block'){
					var height = parseInt(objContainer.css("height"));
					var width = parseInt(objContainer.css("width"));
					objContainer.css({
						top:	getPageScroll()[1] + parseInt($(window).height())/2 - height/2,
						left:	getPageScroll()[0] + parseInt($(window).width())/2 - width/2
					});
				}
			});
		}
		function initSelected()
		{
			options.currentSelectedNum = 0;
			options.maxSelectedNum = parseInt(options.maxSelectedNum);
			selectorSelected = new Array();
			var val = objDisplayValue.attr("value");
			if (val)
			{
				var arr = val.split(",");
				for (var i in arr)
				{
					var obj = $("li[dataValue='"+arr[i]+"']",objContent);
					obj.children("input").attr("checked",true);
					var dataName = obj.attr("dataName");
					selectorSelected.push(new Array(arr[i],dataName));
					appendSelectedText(dataName,arr[i]);
				}
			}
		}
		function selectorShow()
		{
			objContainer.css("display","block");
			var height = parseInt(objContainer.css("height"));
			var width = parseInt(objContainer.css("width"));
			objContainer.css({
				top:	getPageScroll()[1] + parseInt($(window).height())/2 - height/2,
				left:	getPageScroll()[0] + parseInt($(window).width())/2 - width/2
			});
		}
		function selectorClose()
		{
			objContainer.css("display","none");
			$.mask.close();
			if (options.close)
			{
				options.close();
			}
		}
		function selectorSelect(obj,checked)
		{
			if (checked){
				var currentSelectedNum = $('#popselector-container_'+options.name).find('.popselector-selected-text').length;
				currentSelectedNum = parseInt(currentSelectedNum);
				if (currentSelectedNum >= options.maxSelectedNum) {
					obj.find('input').attr('checked',false)
					$.alert('最多只能选择'+options.maxSelectedNum+'项');
					return false;
				}
				options.currentSelectedNum++;
			} else {
				options.currentSelectedNum--;
			}
			
			var arrRemove = new Array();
			$("li>input",obj).each(function(){
				if ($(this).attr("checked"))
				{
					$(this).attr("checked",false);
					var val = $(this).parent().attr("dataValue");
					arrRemove.push(val);
				}
			});
			obj.children('input').attr("checked",checked);
			var val = obj.attr("dataValue");
			var name = obj.attr("dataName");
			if (checked)
			{
				selectorSelected.push(new Array(val,name));
				obj.parents("li").each(function(){
					var removeValue = $(this).attr("dataValue");
					$(this).children('input').attr("checked",false);
					arrRemove.push(removeValue);
				});
				appendSelectedText(name,val);
			}
			else
			{
				arrRemove.push(val);
			}
			removeSelectedText(arrRemove);
		}
		function selectorRemove(val)
		{
			for (var i=0;i<selectorSelected.length ;i++)
			{
				if (selectorSelected[i][0] == val)
				{
					selectorSelected = selectorSelected.slice(0,i).concat(selectorSelected.slice(i+1));
					break;
				}
			}
		}
		function appendSelectedText(dataName,dataValue)
		{
			var content = "<a class='popselector-selected-text' dataValue='"+dataValue+"'>"+dataName+"<img src='/resources/images/del.gif'></a>";
			var obj = $(content);
			obj.click(function(){
				removeSelectedText(new Array(dataValue));
				$("li[dataValue='"+dataValue+"']>input",objContent).attr("checked",false);
				$(this).remove();
			});
			objSelected.append(obj);
		}
		function removeSelectedText(arrRemove)
		{
			$(".popselector-selected-text",objSelected).each(function(){
				for (var i in arrRemove)
				{
					if ($(this).attr("dataValue") == arrRemove[i])
					{
						$(this).remove();
						selectorRemove(arrRemove[i]);
						break;
					}
				}
			});
		}
		function showChild(obj)
		{
			timeoutId = setTimeout(function(){
				var stamp = new Date().getTime();
				if (stamp-moveTimeStamp>300)
				{
					var objChild = obj.children('ul');
					objChild.removeClass("popselector-hide").addClass("popselector-show").css({"width":childWidth+"px"});
					var position = getChildPosition(obj,objChild);
					objChild.css({"top":position[0]+"px","left":position[1]+"px"});
				}
				else
				{
					showChild(obj);
				}
			},50);
		}
		function getChildPosition(objParent,objChild)
		{
			var parentOffset = objParent.offset();
			var parentWidth = objParent.innerWidth();
			var contentOffset = objContent.offset();
			var limitBottom = contentOffset.top + objContent.outerHeight();
			var limitRight = contentOffset.left + objContent.outerWidth();
			var ulWidth = objChild.outerWidth();
			var ulHeight = objChild.outerHeight();
			var bottom = parentOffset.top + ulHeight / 2;
			var left = parentWidth + parentOffset.left;
			var top = bottom - ulHeight;
			if (top < contentOffset.top)
			{
				top = contentOffset.top;
			}
			if (left + ulWidth / 2 > limitRight)
			{
				left =  parentOffset.left - ulWidth;
			}
			if (objParent.parent().css("left") == "auto")
			{
				left -= contentOffset.left;
				top -= contentOffset.top;
			}
			else
			{
				var diffLeft = parentOffset.left - objParent.parent().offset().left;
				var diffTop = parentOffset.top - objParent.parent().offset().top;
				left -= parentOffset.left;
				left += diffLeft;
				top -= parentOffset.top;
				top += diffTop;
			}
			return Array(top,left);
		}
		function getParentHtmlContent(data,deep,parentAllowCheck)
		{
			var content = '<ul class="popselector-ul';
			if (deep)
			{
				content += ' popselector-hide';
			}
			else
			{
				content += ' popselector-first-parent';
			}
			content += '">';
			var childAllowCheck = parentAllowCheck;
			for (var i in data)
			{
				var arr = getChildHtmlContent(data[i],deep,parentAllowCheck);
				content += arr[0];
				if (arr[1])
				{
					childAllowCheck = true;
				}
			}
			if (!deep)
			{
				content += '<div style="clear:both;height:0px;display:block;"></div>';
			}
			content += '</ul>';
			return new Array(content,childAllowCheck);
		}
		function getChildHtmlContent(childData,deep,parentAllowCheck)
		{
			var allowCheck = parentAllowCheck;
			var name = childData[options.nameKey];
			var value = childData[options.valueKey];
			var hasChildAllowCheck = false;
			var content = '';
			var arrChildContent = null;
			if (!allowCheck && options.allow)
			{
				for (var i in options.allow)
				{
					if (options.allow[i] == value)
					{
						allowCheck = true;
					}
				}
			}
			if (childData[options.childKey])
			{
				arrChildContent = getParentHtmlContent(childData[options.childKey],deep+1,allowCheck);
				if (options.onlyChild)
				{
					allowCheck = false;
				}
			}

			content += '<li class="popselector-item';
			if (arrChildContent)
			{
				content += ' popselector-item-parent';
			}
			content += '" dataValue="' + value + '" dataName="' + name + '" deep="'+deep+'" style="width:'+itemWidth+'px;">';
			content += '<input type="checkbox"';
			if (options.allow)
			{
				//content += ' disabled="disabled"';
			}
			content += '><span';
			if (!allowCheck)
			{
				var className = "popselector-uncheck";
				if (arrChildContent)
				{
					if (arrChildContent[1])
					{
						className = "popselector-uncheck-parent";
						allowCheck = true;
					}
				}
				content += ' class="'+className+'"';
			}
			content += '>' + name + '</span>';
			if (arrChildContent)
			{
				content += arrChildContent[0];
			}
			content += '</li>';
			return new Array(content,allowCheck);
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
	}
})(jQuery);
