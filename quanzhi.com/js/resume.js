/*
	QuanZhi.com 2012.08.06
	依赖：JQuery.1.7.1.js
	版本：1
*/

jQuery(document).ready(function() {
	//showhide
	//$(".re_shenfen").bind("click", function(event) {
	//	$(".re_shenfen-showhide-content").toggle();
	//	return false;
	//});
	
	//$(document).bind("click", function() {
	//	$(".re_shenfen-showhide-content").hide();
	//});
	

	/*求职信范例*/
	$(".u_qzxflclick").bind("click", function(event) {
		$(".u_qzxfl").toggle();
		return false;
	});
	$(document).bind("click", function() {
		$(".u_qzxfl").hide();
	});
	
	/*求职信范例*/
	$(".u_qzxflclicka").bind("click", function(event) {
		$(".u_qzxfla").toggle();
		return false;
	});
	$(document).bind("click", function() {
		$(".u_qzxfla").hide();
	});
	
	/*下载简历下拉层*/
	$(".u_downloadclick").bind("click", function(event) {
		$(".u_downloa").toggle();
		return false;
	});
	$(document).bind("click", function() {
		$(".u_downloa").hide();
	});
	
});