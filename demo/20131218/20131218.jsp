<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ include file="../../common/taglibs.jsp" %>
<c:set var="xkskt" value="${baseUrl }/css/static/20131218"/>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>抓住物流的尾巴 特卖保暖季</title>
<%@ include file="../../common/pagehead_new.jsp" %>
<link rel="stylesheet" href="${xkskt }/css/20131218.css?v=js_datezone" />
</head>

<body>
<%@ include file="../../common/bar_models.jsp" %>
<%@ include file="../../common/usernav_new.jsp" %>


<!-- nav标签 END-->
  <!--start top_bg-->
 <!-- <div class="top_bg11">
    <div class="top_img">
    </div>
  </div>-->
  <div class="cont_logo">
		<div class="logo_img">
		</div>
	</div>
  <!--end top_bg-->
  <div class="page">
    <div class="t_con">
      <ul id="scroll_top" class="clearfix juitem">
        
      </ul>
    </div>
    <%@ include file="../zt_bottom.jsp" %>
  <br />
  <%@ include file="../../common/bottom_cloud.jsp" %>
    <!-- E 标签云 -->
    <div class="right_nav">
        <ul>
            
        </ul>
    </div>
  </div>
  
  <!--侧边栏-->
<%@ include file="../../common/bottom_new.jsp"%>
<%@ include file="../../common/rightnav_models.jsp"%>
<%@ include file="../../common/footer_new.jsp"%>

<script type="text/javascript" src="${xkskt }/js/20131218.js?v=js_datezone"></script>
<script type="text/javascript" src="${xkskt }/js/endImgScroll.js"></script>
<script type="text/javascript">
$(document).ready(function(e) {
    function subjectBtn(){
	  var subjectBtnTimer = null;
	  $(".subjectBox,.subjectBTn").hover(function(){
		clearInterval(subjectBtnTimer);
		$(this).parent().addClass("subjectH");
	  },function(){
		subjectBtnTimer = setTimeout(function (){$(".subject").removeClass("subjectH");},3000);
	  });
	}
	subjectBtn();
	$("#subject").scrollShow("right",{auto:true});//无缝滚动
	
	function rightNav(){
		//定位导航位置
		var navTop = $('.t_con').offset().top,
			navleft = $('.t_con').offset().left + $('.t_con').width();
		$('.right_nav').css({
			top:navTop,
			left:navleft
		});
		//resize
		$(window).resize(function(){
			var navTop = $('.t_con').offset().top,
				navleft = $('.t_con').offset().left + $('.t_con').width();
			$('.right_nav').css({
				top:navTop,
				left:navleft
			});
		})
		//滚动位置判断
		var greaterIe6 = window.XMLHttpRequest;//高于ie6版本
		var dynamicPosition = function(){
			//获取滚动高度
			var st = $(document).scrollTop();
			if(greaterIe6){
				if( st>650 ){
					$('.right_nav').css("top",120);
				}else if(st<=navTop){
					$('.right_nav').css("top",navTop - st);
				}
			}else{
				if( st>650 ){
					$('.right_nav').css("top",st+120);
				}else if(st<=navTop){
					$('.right_nav').css("top",navTop - st);
				}
			}
		}
		$(window).bind("scroll",dynamicPosition);
	}
	
	rightNav();
	
});
</script>
</body>
</html>
