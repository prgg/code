//列表展开
$(function () {
    var lastJSPullDown = null,
        lastJSPull = null,
        jsPull = $(".js-pull"),
        jsUpload = $("#js-upload"),
        jsApplyMod = $(".js-apply-mod");
	    jsPull.each(function (){
		    var self = $(this),
			selfParnt = self.parent(),
			jsPullDown = self.next(".js-pull-down");
		self.bind("click",function () {
          if(selfParnt.hasClass('on')) {
            selfParnt.removeClass('on');
          } else {
            if(lastJSPull) {
              $(lastJSPull).removeClass('on');
            }
            selfParnt.addClass('on');
            //文件上传事件
            jsUpload.change(function () {
              if($(this).val() == "") {
              //console.log(1);
              } else {
                //console.log(jsApplyMod.children("li"));
                jsApplyMod.children('li').not(function (index) {
                 return index == 0 ? true : false;
                }).hide();
              };   
            });
          };
          lastJSPullDown = jsPullDown[0];
          lastJSPull = selfParnt[0];
		});
	});

	//公司导航
	var jsNavbar = $(".js-navbar > li");
	tab = $(".tab");
	jsNavbar.bind("click", function() {
		var self = $(this),
		index = self.index();
		if (self.hasClass("navbar-list-active")) {
			return false;
		} else {
			self.addClass("navbar-list-active").siblings().removeClass("navbar-list-active");
			tab.eq(index).addClass("active").siblings().removeClass("active");
		};
	});
});
