(function($) 
{
	$.fn.multiselector = function(options)
	{
		if (options.mustSelectChild == undefined)
		{
			options.mustSelectChild = true;
		}
		var objSelector = $(this);
		var showData = {};
		var html = '<input type="hidden" name="'+options.name+'"';
		html += '>';
		objSelector.html(html);
		if (options.allow)
		{
			initShowData();
		}
		buildContent(options.data,$("input",objSelector));
		bindEvent();
		initData();
		
		function initShowData()
		{
			for (var i in options.allow)
			{
				var parents = getParents(options.data,options.allow[i]);
				if (parents)
				{
					var arr = parents.split(",");
					var data = options.data;
					for (var j=arr.length-1; j>=0 ;j--)
					{
						showData[data[arr[j]][options.valueKey]] = true;
						data = data[arr[j]][options.childKey];
					}
				}
			}
		}
		function initData()
		{
			if (options.selectedValue)
			{
				var parents = getParents(options.data,options.selectedValue);
				var arr = parents.split(",");
				var obj = $("select",objSelector).eq(0);
				var data = options.data;
				for (var i=arr.length-1;i>=0;i--)
				{
					var val = data[arr[i]][options.valueKey];
					var finded = false;
					$("option",obj).each(function(){
						if ($(this).attr("value") == val)
						{
							$(this).attr("selected","selected");
							finded = true;
							return false;
						}
					});
					if (finded)
					{
						data = data[arr[i]][options.childKey];
						buildContent(data,obj);
						obj = obj.next();
					}
				}
				if (options.mustSelectChild)
				{
					if (!obj.length)
					{
						$("input[name='"+options.name+"']",objSelector).attr('value',options.selectedValue);
					}
				}
				else
				{
					$("input[name='"+options.name+"']",objSelector).attr('value',options.selectedValue);
				}
				bindEvent();
			}
		}
		function getParents(data,val)
		{
			var finded = false;
			var parents = '';
			for (var i in data)
			{
				var value = data[i][options.valueKey];
				if (value != val)
				{
					if (data[i][options.childKey])
					{
						parents = getParents(data[i][options.childKey],val);
						if (parents)
						{
							parents += ',' + i;
							break;
						}
					}
				}
				else
				{
					parents = i;
					break;
				}
			}

			return parents;
		}
		function bindEvent()
		{
			$("select",objSelector).change(function(){
				bingSelectEvent($(this));
			});
		}
		function bingSelectEvent(obj)
		{
			while (obj.next().length)
			{
				obj.next().remove();
			}
			if (obj.get(0).selectedIndex)
			{
				var arrParentSelected = new Array(obj.val());
				var objPrev = obj.prev();
				while (objPrev.is("select"))
				{
					var pos = objPrev.get(0).selectedIndex;
					arrParentSelected.push(objPrev.val());
					objPrev = objPrev.prev();
				}
				var data = options.data;
				for (var i=arrParentSelected.length-1;i>=0;i--)
				{
					for (var pos in data)
					{
						if (data[pos][options.valueKey] == arrParentSelected[i])
						{
							data = data[pos][options.childKey];
							break;
						}
					}
				}
				if (data)
				{
					buildContent(data,obj);
					if (options.mustSelectChild)
					{
						setValue("",obj);
					}
					else
					{
						setValue(obj.val(),obj);
					}
					$("select",objSelector).eq(-1).change(function(){
						bingSelectEvent($(this));
					});
				}
				else
				{
					setValue(obj.val(),obj);
				}
			}
			else
			{
				if (options.mustSelectChild)
				{
					setValue("",obj);
				}
				else
				{
					var objPrev = obj.prev();
					if (objPrev.is("select"))
					{
						setValue(objPrev.val(),obj);
					}
					else
					{
						setValue("",obj);
					}
				}
			}
		}
		function setValue(val,obj)
		{
			$("input",objSelector).attr("value",val);
			if (options.change)
			{
				options.change(val,obj);
			}
		}
		function buildContent(data,objParent)
		{
			if (data)
			{
				var content = '<select><option value="">请选择</option>';
				var hasShow = false;
				for (var i in data)
				{
					var name = data[i][options.nameKey];
					var value = data[i][options.valueKey];
					content += '<option value="'+value+'"';
					if (options.allow)
					{
						if (showData[value])
						{
							content += ' show="1"';
							hasShow = true;
						}
					}
					content += '>' + name + '</option>';
				}
				content += "</select>";

				var objContent = $(content);
				if (options.allow)
				{
					if (hasShow)
					{
						$("option",objContent).each(function(){
							if ($(this).attr("show") != "1" && $(this).attr("value"))
							{
								$(this).remove();
							}
						});
					}
				}

				objContent.insertAfter(objParent);
			}
		}
	}
})(jQuery);
