//搜索表单 - 关键词交互操作处理
function searchKey(config)
{
	var body = $("body"),
		//关键词input对象
		ipt = config.ipt,
		//关键词父级对象
		parentIpt = ipt.parent(),
		//关键词更多选项弹层对象
		tools = config.toolsPop,
		//弹层确认按钮对象
		toolsBtn = config.toolsBtn,
		//弹层显示后默认焦点停留对象
		toolsFocus = config.toolsFocus,
		//职位对象
		userName = $("#searchPost"),
		//公司对象
		companyName = $("#searchCompany"),
		//关键词对象
		keyWord = $("#searchkeyFont");

	//操作层 - 显示
	function showTools()
	{
		if(!tools.is(":visible"))
			tools.show();
		setTimeout(function(){
			//toolsFocus.focus();
			$("#searchkeyFont").focus();
		});
	};

	//添加关键词一键清除
	function addRemove(targetObj){
		var remove_style = ".keywordtool_remove{display:none;width:15px;height:15px;overflow:hidden;position:absolute;z-index:9;margin:9px 0 0 -10px;font-weight:bolder;color:#333;background:#fff url('http://www.quanzhi.cn/images/v1/keywordtools_x.png') no-repeat;cursor:pointer;zoom:1;}.keywordtool_remove2{margin:5px 0 0 -20px;}.search-list .keywordtool_remove{ margin-left:-40px; margin-top:7px; }.search-list .keywordtool_remove2{ margin-left:-1.8em; margin-top:7px; }",
			remove = "<span class='keywordtool_remove keywordtool_remove2' onclick='$(this).prev().val(\"\").blur().focus();$(this).hide();'></span>",
			remove2 = $("<span class='keywordtool_remove'></span>").click(function(){
				targetObj.val("").keyup();
				$(this).hide();
				ipt.blur();
			});
		$.addStyle(remove_style);
		targetObj.each(function(){
			if(this == ipt.get(0)){
				$(this).after(remove2);
				$(this).change(function(){
					var next = $(this).next(),
						vals = "";
					userName.add(companyName).add(keyWord).val(function(i,a){
						vals += a;
						return a;
					});

					if(vals != ""){
						next.show();
					}
					else{
						next.hide();
					}
				});
			}
			else{
				$(this).after(remove);
				$(this).keyup(nextShowhide);
			}
		});
		function nextShowhide(){
			var next = $(this).next();
			if(this.value != ""){
				next.show();
			}
			else{
				next.hide();
			}
		};
	};

	addRemove(userName.add(companyName).add(keyWord).add(ipt));

	userName.add(companyName).add(keyWord).keyup();

	ipt.change();

	//操作层 - 按钮确认 内容写入
	function setSearchContent(){
		var searchContent = '',
			userName_val = $.trim(userName.val()),
			companyName_val = $.trim(companyName.val()),
			keyWord_val = $.trim(keyWord.val());

		if(keyWord_val){
			searchContent += keyWord_val+'+';
		}
		if(userName_val){
			searchContent += 'zw:'+userName_val+'+';
		}
		if(companyName_val){
			searchContent +='gs:'+companyName_val+'+';
		}
		searchContent = searchContent.substring(0,searchContent.length-1);
		
		ipt.val(searchContent).change();

		return searchContent;
	};

	//修复IE中的input光标自动靠前bug
	function ie_fucusFix(){
		var r = this.createTextRange(); 
		r.collapse(false); 
		r.select(); 
	};
	if($.browser.msie){
		userName.add(companyName).add(keyWord).focus(ie_fucusFix);
	}

	//操作层 - 隐藏
	function hidePop(){
		ipt.focus().blur(function(){
			tools.hide();
		});
	};

	//输入框父级对象点击事件注册
	parentIpt.click(function(event){
		showTools();
		event.stopPropagation();
	});
	//输入框获得焦点事件注册
	ipt.focus(showTools);

	//操作层 - 回车事件注册
	tools.on("keyup",function(event){
		if(event.keyCode == 13){
			hidePop();
			event.stopPropagation();
		}
	});
	//操作层 - 冒泡阻止
	tools.click(function(event){
		event.stopPropagation();
	});	
	//操作层 - 确认按钮click事件注册
	toolsBtn.click(function(){
		hidePop();
	});

	userName.add(companyName).add(keyWord).blur(setSearchContent);

	//文档click事件注册：关闭操作层
	body.click(function(){
		tools.hide();
	});

	//关键词输入框默认提示语
	ipt.iptChange({
		keyWord : "职位、公司名称、关键词"
	})
	.css("cursor" , "pointer");
};