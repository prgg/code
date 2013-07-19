function copyFlash(config){

	//设置默认参数
	var defaults = {
		flashName : "copy",
		flashBox : $("<div>"),
		flashW : 100,
		flashH : 20,
		val : ""
	};

	//载入用户参数
	config = $.extend(defaults,config);

	//写入需要复制的内容
	this.setVal = function(val){
		//更新将要被复制的内容
		if(val || val == "")
			config.val = val;
		//重新载入flash（传参需要）
		this.reset();
	};

	//获取flash容器，用于设置它的位置以及表现形态
	this.getBox = function(){
		return config.flashBox;
	};

	//重载flash
	this.reset = function(){
		var flashStr = "<object classid=clsid:d27cdb6e-ae6d-11cf-96b8-444553540000 codebase=http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0 width="+ config.flashW +" height="+ config.flashH +">" +
				"<param name=movie value="+ config.flashName +".swf />" +
				"<param name=flashVars value='cliptext="+ config.val +"&callback="+ config.callback +"&error="+ config.error +"'/>" +
				"<param name=quality value=high/>" +
				"<param name=wmode value=transparent />" +
				"<embed src="+ config.flashName +".swf flashvars='cliptext="+ config.val +"&callback="+ config.callback +"&error="+ config.error +"' quality=high wmode=transparent width="+ config.flashW +" height="+ config.flashH +" name=flashvars type=application/x-shockwave-flash pluginspage=http://www.macromedia.com/go/getflashplayer />" +
				"</object>";
		config.flashBox.html(flashStr);
	};

	//默认加载flash
	this.reset();

	//将box插入到页面
	config.flashBox.appendTo("body");
};