(function($){
	$.fn.extend({
		/*
		*	# 联动下拉列表 #
		*	@config	[Object > Json]	参数
		*		data	[Sring]	数据名称，例：area
		*		codeObj	[Object]	存储最终选中的value值		*		
		*		lan	[String][可选]	数据语言类型，en、cn（默认）
		*		firstName	[String][可选]	下拉列表默认显示文本
		*		selected	[Number][可选]	通过value值指定下拉列表的选中结果
		*		callback	[Function][可选]	生成联动下拉列表后执行的回调函数
		*/
		selectLinked : function (config){
			//参数完整度检测
			if(this.length == 0 || this.get(0).tagName != "SELECT" || !config || !config.data)
				return this;

			//对象
			var $select = this,
				$code = config.codeObj,
				//key值定义
				name = "name",
				code = "code",
				children = "children",
				first = config.firstName || "";

			//函数
			var	fn = {
					//监听列表内容变化
					change : function(select){
						select.children().each(function(){
							if(this.selected){
								var children = $(this).data("children"),
									index = select.attr("index"),
									nextSelect = $select.eq(index - 0 + 1);
								if(children){
									fn.addData(nextSelect,children);
								}
								else{
									fn.addData(nextSelect);
								}
								var code = fn.getCode(this.value,children);
								fn.setCode(code);
							}
						});
					},
					//获取已选中的code值
					getCode : function(val,set){
						return set ? "" : val;
					},
					//写入code到指定存放对象
					setCode : function(val){
						if($code)
							$code.val(val);
					},
					//添加并生成列表子项：options
					addData : function(select,data){
						//使列表不可操作，并清空原列表数据
						$select.each(function(){
							if(this == select.get(0) || $(this).attr("index") > select.attr("index"))
								$(this).attr("disabled",true).html("<option value=\"\">" + first + "</option>").change();
						});
						if(!select || !data)return;
						for(var i = 0; i < data.length; i ++){
							if(data[i] != undefined){
								var codeAll = data[i][code].split("_"),
									codeVal = codeAll[codeAll.length - 1],
									childrenData = data[i][children];
								//创建列表子项，并添加数据
								var option = $("<option>").val(codeVal).html(data[i][name]);
								//判断是否存在下级数据，并且匹配对应的select对象数。如是则缓存到当前子项对象中
								if(childrenData && childrenData.length != 0 && select.attr("index") < $select.length - 1){
									option.data("children",childrenData);
								}
								select.append(option);
							}
						}
						//解除列表不可操作状态
						select.attr("disabled",false).change();
					},
					//初始化列表项处理
					init : function(val){
						var data = qz.jsonData[dataName][0].dataSearch,
							code = qz.getParentsByCode(dataName,val);
							code = code[0].constructor === Array ? code[0] : code;
						clickSelected(code);
						if(config.callback)
							config.callback();
						//选中指定列表项
						function clickSelected(code){
							var codes = code;
							for(var i = 0; i < codes.length; i ++ ){
								$select.eq(i).children().each(function(){
									if(this.value == codes[i]){
										this.selected = "selected";
										$select.eq(i).change();
									}
								});
							}
						}
					},
					//获取数据，并初始化第一级列表
					run : function(data){
						var select = $select.eq(0);
						fn.addData(select,data);
						//如果指定初始选定项目，回调函数将在指定选定项目完成后执行
						if(config.selected){
							fn.init(config.selected);
						}
						else if(config.callback)
							config.callback();
					}
				};
			
			//注册所有列表change事件
			$select.each(function(n){
				$(this).on("change",function(){
					fn.change($(this),n + 1);
				}).attr("index",n);
			});

			//域名环境设置
			var domain = DOMAIN,
				//语言
				lan = "_" + (config.lan || "cn").toLowerCase(),
				//数据文件名处理
				dataName = config.data + lan,
				//数据来源链接地址拼接
				dataUrl = 'http://www.' + domain + '/static/data@str@' + dataName + '.json';

			//请求数据，获得数据后执行初始化函数
			$.ajaxData(dataUrl,dataName,fn.run);

			//返回jquery对象
			return this;
		}
	});
})(jQuery);