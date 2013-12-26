// JavaScript Document


//var tmepData = [{
//	"combinUrl" : "http://www.j.cn",
//	"imgUrl" : "http://image5.guang.j.cn/images/17/mid2/35646255913_58043280.jpg",
//	"costPrice" : "300",
//	"price" : "150",
//	"discount" : "5"
//}];
//cList(tmepData);


//$.getJSON("http://www.j.cn/jtuan/20131216/pn1",function(data){
//	cList(data.result);
//});

function cList(data){
	var $ul = $(".juitem"),i = 0;
	$ul.html("");
	for(; i < data.length; i++){
		$ul.append('\
			<li>\
				<div class="img_wrap">\
					<a target="_blank" href="/jump/'+data[i].item.id+'?location=img'+data[i].item.id+'&detail_url=' + data[i].combinUrl + '"><img src="' + data[i].imgUrl + '"/></a>\
				</div>\
				<p>\
					<span class="discount"><b>' + data[i].discount + '</b>折</span>\
					<div class="price"><span class="orgin">原价：￥' + data[i].costPrice + '</span><br /><span class="now">￥' + data[i].price + '</span></div>\
				</p>\
				<span class="postage">包邮</span>\
			</li>\
		');
	}
};

function loadData(id,locationVal){
	var urlVal='http://www.j.cn/jtuan/20131218/json/pn1?pageSize=150&category_id=' + id;
	if(locationVal){
		urlVal='http://www.j.cn/jtuan/20131218/json/pn1?pageSize=150&location='+locationVal+'&category_id=' + id;
	}
	$.ajax({
		url:urlVal,
		type : "GET",
		cache : true
	}).done(function(data){
		cList(data.result);
	});
};

function catId(){
	$.ajax({
		url:'http://www.j.cn/jtuan/get_categories/20131218',
		type : "GET",
		cache : true
	}).done(function(data){
		//console.log(data);
		$(".right_nav ul").append("<li class='cur'><a href='#scroll_top' data-id='0'>全部</a></li>");
		for(var i=0;i < data.length;i++){
			$(".right_nav ul").append("<li><a href='#scroll_top' data-id='" + data[i].id + "'>" + data[i].name+ "</a></li>");
		}
		$(".right_nav").on("click","a",function(){
			$(this).parent().addClass("cur").siblings().removeClass("cur");
			loadData($(this).attr("data-id"),"jtuan_20131218_nav_"+$(this).attr("data-id"));
		});
	});
}

$(document).ready(function() {
	catId();
	loadData(0,null);
});
