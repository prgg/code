(function($) {
	$.fn.extend({
		selecty : function(bool){
			var fn = {
				//元素替换处理
				selecty_Html : function(obj,$select,$selected,$options){
					//复制<select>对应属性值到$select
					obj.children().each(function(i,o){
						if(o.tagName == "OPTGROUP"){
							var $li = $("<li>").addClass("optgroup"),
								$optgroup_title = "",
								$optgroup = $("<ul>").attr("class",o.className).appendTo($li);
							if(o.label){
								$optgroup_title = "<li class='optgroup_title'>" + o.label + "</li>";
								$optgroup.append($optgroup_title);
							}
							fn.selecty_Html($(o),$select,$selected,$optgroup);
							$li.appendTo($options);
						}
						else {
							var html = o.innerHTML,
								selected = "",
								disabled = "";
							if(o.selected){
								selected = "selected";
								$selected.html(html);
							}
							if(o.disabled){
								disabled = "disabled";
							}
							$("<li>").attr({
								"class" : o.className + " " + selected + " " + disabled,
								title : html
							}).html(html).appendTo($options);
						}
					});					
				},
				//替换元素事件处理
				selecty_Event : function(obj,$select,$selected,$options){
					var	select = obj,
						optionTags = $options.find("li:not('.optgroup):not('.optgroup_title)");
					//关闭下拉列表
					var closeUl = function(event){
						$options.each(function(){
							var el = ($(event.target).parents(".js-base-selecty").length != 0) ? $(event.target).parents(".js-base-selecty") : $(event.target);
							if($select.get(0) != el[0] && $(this).css("display") == "block"){
								fn.hide($(this));
							}
							else if($select.get(0) == el[0]){
								event.preventDefault();
							}
						});
					};
					//<select>内容发生变化后切换内容（目前为强制重新换肤，理论上应仅执行切换内容）
					var selectChange = function(){
						select.selecty(true);
					};
					//将关闭下拉列表 & select联动函数缓存到select对象中。用于解除事件注册
					select.data({
						"closeUl" : closeUl,
						"selectChange" : selectChange
					});
					//select对象change触发时执行selectChange
					select.on("change",selectChange);
					//文档事件注册：关闭所有已展开的下拉列表
					$(document).on("click",closeUl);
					//$select事件注册：点击展开&隐藏列表
					$select.on("click",function(event){
						if ($options.css("display") == "block") {
							fn.hide();
						}
						else if($select.attr("disabled_") != "disabled"){
							fn.show();
						};
					});
					//列表hover事件注册
					$options.hover(function(){
						$(this).toggleClass("js-base-selecty-pop-hover");
					});
					//列表子项click事件注册
					$options.delegate("li","click",function(event){
						fn.tab(this);
						event.stopPropagation();
					});
					//列表子项hover事件注册
					$options.delegate("li","hover",function(){
						if(!$(this).is(".optgroup") && !$(this).is(".optgroup_title"))
							$(this).toggleClass("hover");
					});
					//设置遮罩容器全局zIndex级别
					if(!window.createBackgroundDom_zIndex)
						window.createBackgroundDom_zIndex = 99;
					createBackgroundDom_zIndex++;
					var fn = {
						defaultIndex : "",
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
							//获取正文内容宽度、偏移量
							var content = $("body").children("div").eq(0),
								cont = {
									W : content.outerWidth(),
									L : content.offset().left
								};
							//获取内容对象绝对高宽
							var obj = $(config.obj),
								objH = obj.outerHeight(),
								objW = obj.outerWidth();
							//获取事件触发来源对象高宽、坐标
							var btnObj = $(config.targetObj),
								btn = {
									H : btnObj.outerHeight(),
									W : btnObj.outerWidth(),
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
							//返回坐标值
							return {
								x : x,
								y : y
							}
						},
						show : function(obj){
							this.defaultIndex = $options.find(".selected").index();
							//获取内容浮层在页面中的绝对居中坐标
							var offset = this.getXY({
								obj : $options,
								targetObj : $select,
								space : -1
							});
							$options.css({
								left : offset.x,
								top : offset.y,
								"z-index" : createBackgroundDom_zIndex
							}).show();
							this.scroll_();
						},
						hide : function(callback){
							var this_ = this;
							$options.hide(0,function(){
								//selected发生变化时触发<select>.change方法
								if(this_.defaultIndex != $options.find(".selected").index()){
									if(callback){
										callback();
									}
									select.change();
								}
							});
						},
						tab : function(obj){
							var fn_ = this;
							optionTags.removeClass("selected");
							optionTags.each(function(i){
								if(this == obj){
									var this_ = this;
									fn_.hide(function(){
										fn_.addVal(i);
									});
								}
							});
						},
						addVal : function(index){
							select.find("option").each(function(n){
								if(n == index)
									$(this).attr("selected",true);
							});
						},
						scroll_ : function(){
							var scroll = $options.find(".selected").position();
							if(!scroll)
								return;
							var scrolltop = scroll.top,
								boxHeight = $options.height(),
								lineHeight = optionTags.eq(0).height(),
								top = scrolltop - boxHeight + lineHeight;
							$options.children("ul").animate({ scrollTop : top });
						}
					};
				}
			};
			if(!window.selectyIndex)
				window.selectyIndex = 0;
			this.each(function(i,obj){
				selectyIndex ++ ;
				//判断对象是否为<select>元素
				if(obj.tagName == "SELECT" && ($(obj).attr("selecty") == undefined || bool)){
					//强制换肤处理
					if(typeof bool == "boolean"){
						$(document).off("click",$(obj).data("closeUl"));
						$(obj).off("change",$(obj).data("selectChange"));
						var nextObj = $(obj).next("div.js-base-selecty"),
							nextList = $("." + nextObj.attr("selectyIndex"));
						nextObj.add(nextList).remove();
					}
					//添加默认皮肤样式
					if(!obj.className.match("js-base-select"))
						$(obj).addClass("js-base-select-b");
					//创建类select对象：$select
					var width = $(obj).css("border",0).outerWidth();
					var disabled = ($(obj).attr("disabled")) ? "disabled" : "",
						$select = $("<div>").css("width",width).attr("disabled_",disabled).addClass("js-base-selecty " + obj.className + " js-base-selecty-" + disabled).attr("selectyIndex","js-base-selecty" + selectyIndex),
						$selected = $("<p>").appendTo($select),
						$icon = $("<span>").html("<i class='icon-down-c'></i>").appendTo($select),
						$options = $("<ul>"),
						$iframe = $("<iframe src='about:blank' frameborder='0' scrolling='no' style='position:absolute;top:0;left:0;z-index:-1;width:100%;height:999em;opacity:0;filter:alpha(opacity=0);'></iframe>"),
						$popDiv = $("<div>").css("width",width).addClass("js-base-selecty-pop js-base-selecty-pop-" + selectyIndex).append($options).append($iframe).appendTo("body");
					//将$select传入selectHtml进行赋值
					fn.selecty_Html($(obj),$select,$selected,$options);
					//$select替换<select>
					$(obj).after($select).hide();
					//将$select添加事件处理
					fn.selecty_Event($(obj),$select,$selected,$popDiv);
					//标记对象已处理状态
					$(obj).attr("selecty",true);
				}
			});
			return this;
		}
	});
})(jQuery);