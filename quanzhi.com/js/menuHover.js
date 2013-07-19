 $(function(){
	menuHoverList();
});
 function menuHoverList () {
	//菜单头部
	var menuItem =  $(".menu_item"),
		//提示层
		menuItemHover = $(".menu_item_hover"),
		menuItemData = $(".menu_item_data"),
		timerAll = null,
		customTime = 500,
		callback = function(){};
		//遍历导航
		menuItem.each(function (index) {
			var self = $(this);
			//当前对象则退出
			if(self.hasClass("on") || self.attr("data-link") == "") {
				return;
			} else {
				//显示提示层
				menuHover(self);
				
			}
		});
		menuItemHover.hover(function(){

			$(this).attr("show",0);
	  		if(timerAll) {
	  			clearTimeout(timerAll);
	  		}
		},function() {
			if(timerAll) {
	  			clearTimeout(timerAll);
	  		}
	  		$(this).attr("show",1);
	  		timerAll = setTimeout(function (){
	  			callback();
	  		},customTime);
		});

	    function menuHover (obj) {
	    	var timer;
	    	obj.attr("show",0);
		  	obj.hover (function () {
	  			if(timer) {
	  				clearTimeout(timer);
	  			}
	  			timer = setTimeout(function() {
	  				hoverOn(obj);
	  			},customTime);
		  	},function () {
	  			if(timer) {
	  				clearTimeout(timer);
	  			}
	  			timer = setTimeout(function (){
	  				hoverOut(obj);
	  			},customTime);
	  			timerAll = timer;
		  	});
	  	};
	  	//hover 移入事件
	  	function hoverOn (obj) {
	  		//obj.text().replace(/^\s+/,"").replace(/\s+$/,"")
	  		var text = obj.text().replace(/^\s+/,"").replace(/\s+$/,"");
	  		if(text == "我的简历") {
	  			menuItemHover.get(0).className = "menu_item_hover jianli";	
			} else if(text == "找工作") {
				menuItemHover.get(0).className = "menu_item_hover gongzuo";
			} else if (text == "校园招聘"){
				menuItemHover.get(0).className = "menu_item_hover xiaoyuan";
			} else if (text == "帐号信息") {
				menuItemHover.get(0).className = "menu_item_hover zhanghao";
			} else if (text == "职场") {
				menuItemHover.get(0).className = "menu_item_hover zhichang";
			}

	  		if(menuItemHover.is(":visible"))
	  			return;
	  		var data = obj.attr("data-link");
	  		
	  		if(data) {
	  			//清空数据
	  			menuItemData.empty();
	  			//callDate()
	  			callDate(data);
	  			//去掉最后一个虚线
				menuItemData.find("a").last().addClass("nober");
	  		}
	  		//显示对象
	  		obj.addClass("on");	
	  		menuItemHover.show();
	  		callback = function(){
	  			//console.log(2);
	  			hoverOut(obj);
	  		};		
	  	};
	  	function hoverOut (obj) {
	  		
	  		if(!menuItemHover.is(":visible") || menuItemHover.attr("show") == 0)
	  			return;
	  		//隐藏对象
	  		obj.removeClass("on");
	  		//menuItemHover.removeClass("jianli");
	  		menuItemHover.hide();
	  	}; 
        function callDate (data) {
        	var getDate = data.split("|");
        //遍历数据
        $.each(getDate,function(idx,current) {
        	var result = current.split(",");
        	//console.log(result[1])
        	//追加数据
        	menuItemData.append("<a href=" + result[1] + ">" + result[0] + "</a>");	
        });
    };
};

