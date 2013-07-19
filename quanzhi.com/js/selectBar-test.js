
/*
$(".class|#id|tag").selectBar({
	//必选参数		
		title : "area",//数据类型
		clickObj : ".class|#id|tag",//事件触发对象，必须为当前JQ对象子孙对象
		codeObj : ".class|#id|tag",//code对象，必须为当前JQ对象子孙对象
		nameObj : ".class|#id|tag"//name对象，必须为当前JQ对象子孙对象

	//可选参数
		url : "quanzhi.cn",//数据存在主域地址（默认quanzhi.cn）
		lan : "CN",//数据语言(可选：CN、EN。默认CN)
		numMax : 5,//数据最大可选择数量，默认5条
		nameMax : false,//中文是否完整输出（仅针对地区数据，例如：北京+朝阳区+团结湖）
		lv : 0//数据可操作层级控制，默认0
			// 	0	全部可显示&可选择（默认）
			// 	1	不可选第一级列表
			// 	2	不可选第二级列表
			// 	以下地区数据类型专用
			// 	3	可选第一级、第二级（不显示第三级列表）
			// 	4	不能选第1级中的省/自治区及大洲，其他可选1、2、3级（不可选省/自治区及大洲第一级列表）
			// 	5	不能选第1级中的省/自治区，其他可选1、2、3级（不可选省/自治区第一级列表）

});
*/
(function($){
	$.extend({
		
		addStyle : function(cssText){
			var style = document.createElement("style");
			style.type = "text/css";
			try {
			    style.appendChild(document.createTextNode(cssText));
			} catch (ex) {
			    style.styleSheet.cssText = cssText;
			}
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(style);
		},
		ajaxData : function(dataUrl,dataType,successFn,errorFn){			
			//json数据转换string
			function jsonToStr(jsonData){
				if(!jsonData || typeof jsonData != "object" )return jsonData;
				var strData = [];
				for(var i = 0; i < jsonData.length; i ++ ){
					strData.push(jsonData[i].name + "," + jsonData[i].value + ((jsonData[i].lev == undefined) ? "@" : "," + jsonData[i].lev + "@"));
					if(jsonData[i].list != undefined){
						for (var p = 0; p < jsonData[i].list.length; p ++ ){
							strData.push(jsonData[i].list[p].name + "," + jsonData[i].value + "_" + jsonData[i].list[p].value + "@");
							if(jsonData[i].list[p].list != undefined){
								for (var g = 0; g < jsonData[i].list[p].list.length; g ++ ){
									strData.push(jsonData[i].list[p].list[g].name + "," + jsonData[i].value + "_" + jsonData[i].list[p].value + "_" + jsonData[i].list[p].list[g].value + "@");
								}
							}
						}
					}
				};
				strData = strData.join("");

				return strData.slice(0,-1);
			};
			//string数据转换json
			function strToJson (strData){
				if(typeof strData != "string" || strData == "")return;
				var jsonData = [],children = "children",
					strArr = strData.split("@"),
					strArrLen = strArr.length;
				var num1 = false,num2 = false;
				for(var i = 0; i < strArrLen; i++){
					var strArrs = strArr[i].split(","),
						name = strArrs[0],
						code = strArrs[1];
					if(code != undefined){
						var codeArr = code.split("_");
					}
					if(codeArr.length == 1){
						var lev = (strArrs[2] == undefined) ? "" : strArrs[2];
						jsonData.push({
							"code" : code,
							"name" : name,
							"lev" : lev
						});
						num1 = jsonData.length - 1;
					}
					else if(codeArr.length == 2){
						var d = jsonData[num1];
						if(codeArr[0] == d.code.split("_")[0]){
							if(!d[children])d[children] = [];
							d[children].push({
								"code" : code,
								"name" : name
							});
						}
						num2 = d[children].length - 1;
					}
					else if(codeArr.length == 3){
						var d = jsonData[num1][children][num2];
						if(codeArr[0] == d.code.split("_")[0]){
							if(!d[children])d[children] = [];
							d[children].push({
								"code" : code,
								"name" : name
							});
						}
					}
				}
				return jsonData;
			};

			//Ajax数据请求与回调函数列队处理
			if(!window.jsonData)window.jsonData = {};
			//回调函数列队变量申明
			if(jsonData[dataType] == undefined){
				jsonData[dataType] = [];
			}
			//加入当前回调函数到列队
			jsonData[dataType].push({
				fn : successFn
			});
			//console.log("是否开始请求数据 : " + dataType);
			if(jsonData[dataType].length > 1){
				//console.log("已开始请求数据，不再请求 : " + dataType);
				if(jsonData[dataType][0].data){
					//console.log("已请求到数据，执行回调函数 : " + dataType);
					successFn(jsonData[dataType][0].data);
				}
				return;
			}
			//console.log("未开始请求到数据，继续执行 : " + dataType);								
			//数据加载完毕后执行排队事件
			function successRun (data){
				if(typeof data == "string")var dataStr = data;
				else var dataStr = jsonToStr(data);
				var dataJson = strToJson(dataStr);
				for(var i = 0 ; i < jsonData[dataType].length ; i ++ ){
					if(!jsonData[dataType][0].dataStr)jsonData[dataType][0].dataStr = dataStr;
					if(!jsonData[dataType][0].data)jsonData[dataType][0].data = dataJson;
					jsonData[dataType][i].fn(dataJson);
				}
			};
			//Ajax获取数据
			$.ajax({
				type: "GET",
				//设置返回数据类型为jsonP
				dataType: "jsonP",
				//缓存请求数据
				cache: true,
				//设置callback函数名，用于缓存请求数据文件
				jsonpCallback: dataType + "_callBack",
				//设置jsonP内容编码
				scriptCharset: "UTF-8",
				//设置请求数据地址
				url: dataUrl,
				//设置请求失败时触发函数
				error: errorFn,
				//设置请求成功时触发函数
				success: successRun
			});
		}
	});

	$.fn.extend({
		selectBar : function(config){
			this.each(function(){
				//实例化弹窗函数
				new selectBar({
					url : config.url || DOMAIN,
					cont : {
						title : config.title,
						lan : config.lan,
						numMax : config.numMax,
						nameMax : config.nameMax,
						lv : config.lv
					},
					page : {
						clickObj : $(this).find(config.clickObj),
						hideInputId : $(this).find(config.codeObj),
						textInputId : $(this).find(config.nameObj)
					},
					close : config.close,
					hideToRemove : true
				});
			});
		}
	});

})(jQuery);

function selectBar(config) {
	if(!window.selectBar_common)
		window.selectBar_common = {
			log : false,
			debug : false,
			id : 1
		};
	var THIS = this,
		dataLoad = 0,
		//数据请求状态：0 = 未请求，1 = 请求中，2 = 请求完成
		show = false; //是否显示弹窗：true|false
	if (window.location.hash == "#selectBar.debug") { //通过锚点开启调试模式
		this.debug = true;
	};
	/*
	记录日志
		time	最后修改时间
		version	版本记录
	*/
	this.log = {
		time: "2013.3.18 17:01",
		version: "\n
			2.010	修复：最大可选项目为“1”时无法被选择\n
			2.009	新增：能源合作网数据\n
					调整：能源、电力、医疗、化工、汽车、酒店、零售、教育、建材、IT、环境等数据内容\n
					调整：电力行业模版由v1_1改为v2\n
			2.008	更变：使用全局变量调用弹层Z轴层级\n
			2.007	更变：已选择历史项目，最后选择项目改为最先显示（倒序）\n
			2.006	更变：已选中项目高亮显示\n
			2.005	更变：规则：载入弹窗时，不判断选择上限（可接收任意选择项目到弹窗界面）\n
			2.004	新增：专业（major）数据；调整行业站行业弹窗数据排序\n
			2.003	修复：多个大类下存在同ID小类的选择错误问题；中英版本单词分组逗号区别使用\n
			2.002	修复：行业数据引起的脚本错误\n
			2.001	更变：优化Ajax请求，缓存数据文件到客户端\n
			    2	更变：更变数据格式，支持使用字符串形式的更小体积数据文件\n
			1.006	新增：加入到jQuery插件，提供jQuery接口\n
			1.005	新增：关闭弹窗后回调参数\n
			1.004	更变：Code值将只输出当前项目（不附带父级项目code值）\n
			1.003	修复：数据请求支持缓存，只在首次进行请求；数据json键名可自定义\n
			1.002	更变：行业、职业（v2）数据模板UI更新\n
			1.001	新增：对行业站数据展示支持\n
			    1	支持地区、行业、职业数据展示、行为操作"
	};
	if (selectBar_common.log == false && window.location.hash == "#selectBar.log") { //通过锚点查看函数日志
		var str = "";
		for (var k in this.log)
			str += k + ":" + this.log[k] + "\n";
		alert(str);
		selectBar_common.log = true;
	};

	//无必选参数时终止函数执行
	if (!config || !config.cont || !config.page || config.cont.title == undefined || config.page.clickObj == undefined || config.page.hideInputId == undefined || config.page.textInputId == undefined) {
		this.show = function() {
			if (THIS.debug == true) alert("必选参数缺失，请检查配置");
		};
		return;
	};

	//弹窗语言类型处理
	config.cont.lan = (config.cont.lan == "cn" || config.cont.lan == "CN" || !config.cont.lan) ? "cn" : "en";

	//可选择条目上限预置
	if (config.cont.numMax == "undefined" || typeof config.cont.numMax != "number" || config.cont.numMax == "")
		config.cont.numMax = 5;

	//数据应用HTML模板类型预置
	var tmplType = {
		//地区
		area: "v1",
		//行业
		industry: "v2",
		//IT站
		industry_it: "v1_3",
		//金融站
		industry_jinrong: "v1_3",
		//建筑站
		industry_jianzhu: "v1_3",
		//酒店站（暂无数据）
		industry_jiudian: "v1_3",
		//建材站
		industry_jiancai: "v1_3",
		//教育站
		industry_jiaoyu: "v1_3",
		//零售站
		industry_lingshou: "v1_3",
		//电力站
		industry_dianli: "v1_3",
		//医疗站
		industry_yiliao: "v1_3",
		//汽车站
		industry_qiche: "v1_3",
		//环境站（暂无数据）
		industry_huanjing: "v1_3",
		//化工站
		industry_huagong: "v1_3",
		//能源站
		industry_nengyuan: "v1_3",
		//能源合作网
		industry_jobinen : "v1_3",
		//职业
		profession: "v2",
		//IT站
		profession_it: "v1_1",
		//金融站
		profession_jinrong: "v1_1",
		//建筑站
		profession_jianzhu: "v1_1",
		//酒店站
		profession_jiudian: "v1_1",
		//建材站
		profession_jiancai: "v1_1",
		//教育站
		profession_jiaoyu: "v1_1",
		//零售站
		profession_lingshou: "v1_1",
		//电力站
		profession_dianli: "v2",
		//医疗站
		profession_yiliao: "v2",
		//汽车站
		profession_qiche: "v1_1",
		//环境站
		profession_huanjing: "v1_1",
		//化工站
		profession_huagong: "v1_1",
		//简历编辑 > 蓝领
		profession_lanling: "v1_1",
		//能源站
		profession_nengyuan : "v2",
		//能源合作网
		profession_jobinen : "v2",
		//公司性质
		xingzhi: "v1_2",
		//学历
		degree: "v1_2",
		//专业类型
		major: "v1_2"
	};
	//数据应用HTML模板类型预置 - 基于数据类型选择
	config.cont.tmplType = tmplType[config.cont.title];
	if(this.debug == true && config.cont.tmplType == undefined)
		alert("\"" + config.cont.title + "\" 没有配置HTML模版");

	//数据类型标题预置
	var titleText = {
		cn: {
			area: "地点",
			industry: "行业",
			profession: "职业",
			xingzhi: "公司性质",
			degree : "学历",
			major : "专业"
		},
		en: {
			area: ["City","Cities"],
			industry: ["Industry","Industries"],
			profession: ["Category","Categories"],
			xingzhi: ["Nature of the company","Nature of the company"],
			degree : ["Degree","Degree"],
			major : ["Major","Major"]
		}
	};
	//数据类型标题预置 - 基于语言选择
	config.cont.titleText = titleText[config.cont.lan];
	//弹窗容器提示语言预置
	var lanTitleText = config.cont.titleText[config.cont.title.split("_")[0]];
	var	lanText = {
			cn: {
				title: "<strong>请选择" + lanTitleText + "：</strong> 最多可选 <span>" + config.cont.numMax + "</span> 项",
				newTitle: "<p><strong>已选择" + lanTitleText + "：</strong></p>",
				oldTitle: "<p><strong>已使用过：</strong></p>",
				addBtn: ["确定", "确定提交"],
				removeAllBtn: ["清空", "清空当前选择"],
				closeBtn: ["取消", "取消选择"]
			},
			en: {
				title: "<strong>Please select " + (lanTitleText[0] && lanTitleText[0].toLowerCase()) + "：</strong>To select up to <span>" + config.cont.numMax + "</span> " + (lanTitleText[1] && lanTitleText[1].toLowerCase()),
				newTitle: "<p><strong>" + (lanTitleText[1] && lanTitleText[1]) + " selected : </strong></p>",
				oldTitle: "<p><strong>Previous selection : </strong></p>",
				addBtn: ["Confirm", "Confirm"],
				removeAllBtn: ["Clear up", "Clear up"],
				closeBtn: ["Cancel", "Cancel"]
			}
		};
	lanText = lanText[config.cont.lan]; //弹窗容器提示语言预置 - 基于语言选择
	//弹窗ID名：防止ID重名
	config.cont.id = "selectBar" + selectBar_common.id;
	/* 
	弹窗容器样式
		popDiv	基础弹窗样式
		selectBar	基础选择器样式
		config.cont.tmplType	数据对应的html模板样式
	*/
	config.cont.className = "popDiv selectBar " + config.cont.tmplType.split("_")[0] + " " + config.cont.tmplType; //容器样式预置 - 基于数据模板选择
	//启用弹窗遮罩容器：了解遮罩默认配置参考 function popDiv
	config.bg = true;
	//遮罩容器ID：防止ID重名
	config.bg.id = "selectBarBg" + selectBar_common.id;
	//启用弹窗按钮：参考 function popDiv
	config.closeBut = true;
	//弹窗按钮容器ID：防止ID重名
	config.closeBut.id = "selectBarClose" + selectBar_common.id;
	//弹窗用户选择列表容器ID：防止ID重名
	config.page.popInputId = "selsecBarPopInput" + selectBar_common.id;
	//弹窗用户历史使用列表容器ID：防止ID重名
	config.page.cookieInputId = "selsecBarCookieInput" + selectBar_common.id;

	selectBar_common.id ++;

	//列表显示隐藏与禁止操作控制预置
	config.cont.lv = (config.cont.lv) ? config.cont.lv : 0;

	//开启Esc键支持关闭弹窗事件
	config.keyEsc = true;

	//默认
	config.hideToRemove = true;

	/*
	数据来源地址处理
		config.url	域名环境
		config.cont.title	数据名称
		config.cont.lan	语言
		_lan	URL后缀拼接
	*/
	//语言处理 & 强制大写
	var _lan = "_" + (config.cont.lan || "CN").toLowerCase();

	//数据文件名处理：当数据为area、industry或profession，且语言为CN时。无需后缀。
	config.cont.dataName = config.cont.title + _lan;
	var dataUrl = 'http://www.' + config.url + '/static/data@str@' + config.cont.dataName + '.json';

	//请求数据，并载入弹窗、添加表单逻辑关系与操作事件（本函数执行不操作DOM）
	this.init = function() {
		//如果数据已载入完毕，则不进行后续操作
		if(dataLoad == 2) return;
		//如果当前状态不为数据载入中，则设置为：数据载入中
		if(dataLoad != 1)dataLoad = 1;
		//如果当前状态为数据载入中则不进行后续操作
		else return;
		//初始化数据内容模版生成函数
		if(!this.json)this.json = new jsonHTML(config.cont);
		//初始化表单逻辑控制函数
		if(!this.form)this.form = new formData(config);
		//列表层级控制初始化
		if(!this.lvOff)this.lvOff = new lvOff(config);
		//Ajax获取数据
		$.ajaxData(dataUrl,config.cont.dataName,htmlTmpl,ajaxError);
	};
	//默认自动加载数据、生成模板等操作
	this.init();

	//ajax请求失败
	function ajaxError(msg) {
		if (THIS.debug == true) alert("请求数据失败：\n" + dataUrl);
		return msg;
	};

	//ajax请求成功，并生成模版框架
	function htmlTmpl(data) {
		if(!data)return;
		var cfg = {
			data: data,
			lv: 1
		},
			//创建：用户已选择列表
			selectNew = $("<div>", {
				id: config.page.popInputId,
				"class": "selectNew",
				html: lanText.newTitle + "<ol></ol>"
			}),
			//创建：历史选择列表
			selectOld = $("<div>", {
				id: config.page.cookieInputId,
				"class": "selectOld",
				html: lanText.oldTitle + "<ol></ol>"
			}),
			//创建：确定按钮
			selectButAdd = $("<button>", {
				html: "<span>" + lanText.addBtn[0] + "</span>",
				title: lanText.addBtn[0],
				"class": "but"
			}).click(function() {
				if(THIS.form.hideInput.add())
					THIS.hide();
			}),
			//创建：清空按钮
			selectButRemove = $("<button>", {
				html: "<span>" + lanText.removeAllBtn[0] + "</span>",
				title: lanText.removeAllBtn[1],
				"class": "but"
			}).click(function() {
				THIS.form.popInput.removeAll();
			}),
			//创建：关闭按钮
			selectButClose = $("<button>", {
				html: "<span>" + lanText.closeBtn[0] + "</span>",
				title: lanText.closeBtn[1],
				"class": "but"
			}).click(function() {
				THIS.hide();
			}),
			//创建：功能按钮父容器
			selectBut = $("<p>", {
				"class": "selectNewBut"
			}).append(selectButAdd, selectButRemove, selectButClose).appendTo(selectNew),
			//内容列表生成，并加入到模板框架中
			selectOl = $("<div>", {
				id: config.cont.id + "_ol",
				"class": "selectContDiv"
			}).append(THIS.json.run(cfg));
		//styleTmpl_v1_3 行业站特别处理
		if (config.cont.tmplType == "v1_3") {
			//初始生成第二级列表
			var listObj = selectOl.children("ol").children("li");
			var listInit = function() {
					for (var i = 0; i < listObj.length; i++) {
						if ($(listObj[i]).data("data") && $(listObj[i]).data("data") != 0 && listObj[i].getElementsByTagName("ol")[0] == undefined) {
							var json = new jsonHTML(config.cont);
							$("<div>", {
								html: json.run({
									data: $(listObj[i]).data("data")
								})
							}).appendTo(listObj[i]);
						}
					};
					//行业IT站特别处理
					if (config.cont.title == "industry_it") {
						/* IE6、IE7bug处理 */
						listObj.eq(1).addClass('rlist it_a');
						listObj.eq(2).addClass('rlist it_b');
						listObj.addClass('clearLeft').css("zoom","1");
						selectOl.children("ol").height("255").children("li").before("<div style='font-size:0;height:0;'></div>");
					}
					//行业医疗站特别处理
					if (config.cont.title == "industry_yiliao") {
						/* IE6、IE7bug处理 */
						listObj.eq(0).addClass('yiliao_a');
						listObj.eq(1).addClass('yiliao_b');
						listObj.addClass('clearLeft').css("zoom","1");
						selectOl.children("ol").children("li").before("<div style='font-size:0;height:0;'></div>");
					}
					//行业建筑站特别处理
					if (config.cont.title == "industry_jianzhu") {
						selectOl.children("ol").children("li").eq(1).addClass('rlist jianzhu_a');
						selectOl.children("ol").children("li").eq(7).addClass('rlist jianzhu_b');
						selectOl.children("ol").children("li").before("<div style='font-size:0;height:0;'></div>");
					}
				}();
			var add_li = $("<li>", {
				html: "<span class='list'><input type='checkbox' id='" + config.cont.title + "all' value='all' title='全部行业'><label for='" + config.cont.title + "all'>全部行业</label></span>"
				}).append(selectOl),
				add_ol = $("<ol>").attr("class", selectOl.children("ol")[0].className).append(add_li),
				add_div = $("<div>").attr({
					"id": selectOl[0].id,
					"class": selectOl[0].className
				}).append(add_ol);
			//行业化工站以外站点特别处理
			//if(config.cont.title != "industry_huagong"){
				selectOl.attr({
					"id": "",
					"class": ""
				}).children("ol").attr("class", "");
				selectOl = add_div;
			//}
			//行业金融站、建材站、医疗特别处理
			if (config.cont.title == "industry_jinrong" || config.cont.title == "industry_jiancai" || config.cont.title == "industry_yiliao") {
				selectOl.find("li").eq(0).addClass('list_a');
			}
			//行业教育站、零售站、电力站、汽车站、化工站、能源站、能源合作网特别处理
			if (config.cont.title == "industry_jiaoyu" || config.cont.title == "industry_lingshou" || config.cont.title == "industry_dianli" || config.cont.title == "industry_qiche" || config.cont.title == "industry_huagong" || config.cont.title == "industry_nengyuan" || config.cont.title == "industry_jobinen") {
				selectOl.find("li").eq(0).addClass('list_b');
			}
		};
		//将内容装载到弹窗参数配置中
		config.cont.value = $("<div>", {
			id: config.cont.id + "_cont",
			html: "<p class='title'>" + lanText.title + "</p>"
		}).append(selectNew, selectOld, selectOl);
		//设置状态为：数据加载完毕
		dataLoad = 2;
		//是否显示弹窗
		if (show == true) THIS.show();
	};

	//清空已载入数据、释放内存
	var removeData = function() {
		setTimeout(function() {
			delete THIS.popDiv;
			delete THIS.selFn;
			delete THIS.form;
			delete THIS.json;
			delete THIS.lvOff;
			dataLoad = 0;
		}, 200);
	};

	//弹窗显示
	this.show = function() {
		show = true;
		if (THIS.debug == true) alert("数据请求状态：" + dataLoad);
		if (dataLoad == 2) { //数据请求完毕
			if (this.popDiv == undefined) {
				if (config.keyEsc) { //将hide函数加载到弹窗函数：popDiv.keyEscHide(fn)
					config.keyEsc = {};
					config.keyEsc.fn = this.hide;
				}
				this.popDiv = new popDiv(config); //初始化弹窗组件
			};
			if (this.selFn == undefined) {
				this.selFn = new selFn(); //初始化模板事件行为
			};
			this.form.init.pop_form(); //弹窗与表单数据同步
			this.form.init.popOldList_cookie(); //cookie与表单数据同步
			this.lvOff.init(); //同步层级控制设置

			this.popDiv.showDiv();
			if (config.cont.title == "profession") { //全部职业模板特殊处理
				$("#" + config.cont.id + "_ol > ol >li").each(function() {
					//给超过6条子项目的对象添加标识class
					if ($(this).children("div").children("ol").children("li").length > 6) $(this).addClass("listMax");
					//单行最大高度设置
					if ($(this).attr("style") == undefined) {
						var h = ($(this).height() > 40) ? 40 : $(this).height();
						$(this).css("height", h);
					}
				});
			};
		} else if (dataLoad != 2) { //数据未请求或未请求完毕
			this.init();
		}
	};

	if(config.page.clickObj){
		//click对象指针样式设置
		$(config.page.clickObj).children().andSelf().css("cursor","pointer");
		//注册事件到click对象
		$(config.page.clickObj).on("click focusin",function(event){
			THIS.show();
			setTimeout(function(){
				$(event.target).blur();
			},1);
		});
	}

	//弹窗隐藏
	this.hide = function() {
		if (config.close) config.close();
		if (THIS.popDiv) THIS.popDiv.hideDiv();
		if (config.hideToRemove == true) {
			removeData();
		};
	};

	//模板事件注册

	function selFn() {
		var selFn = this,
			time = 300,
			//子列表触发响应时间
			hoverClass = "hover"; //默认hover样式名
		var tmplType = config.cont.tmplType.substr(0, 2); //获取数据类型对应的主版本号

		//对象定时显示
		function showList(cfg) {
			if (!cfg.cssName) cfg.cssName = hoverClass;
			//if(cfg.obj.sel && cfg.obj.sel == 1 && $(cfg.obj).hasClass(cgf.cssName))return;
			if (!cfg.time) cfg.time = time;
			cfg.obj.sel = 1;
			setTimeout(function() {
				if (cfg.obj.sel || cfg.obj.sel == 1) $(cfg.obj).addClass(cfg.cssName);
			}, cfg.time);
		};

		//对象定时隐藏
		function hideList(cfg) {
			//if(!cfg.obj.sel && cfg.obj.sel != 1)return;
			if (!cfg.time) cfg.time = time;
			if (!cfg.cssName) cfg.cssName = hoverClass;
			cfg.obj.sel = 0;
			setTimeout(function() {
				if (!cfg.obj.sel || cfg.obj.sel != 1) $(cfg.obj).removeClass(cfg.cssName);
			}, cfg.time);
		};

		//生成子列表 & 子列表边界限定操作
		this.liCont = function(obj) {
			if ($(obj).data("data") && $(obj).data("data") != 0 && obj.getElementsByTagName("ol")[0] == undefined) { //如果对象存在子列表，且未生成
				var json = new jsonHTML(config.cont),
					lv = (tmplType == "v2") ? 3 : false,
					parentObj = (tmplType == "v2") ? obj.getElementsByTagName("input")[0] : false;
				$("<div>", {
					html: json.run({
						data: $(obj).data("data"),
						lv: lv,
						obj: parentObj
					})
				}).appendTo(obj);
				THIS.form.init.popList_popInput(); //弹窗暂存数据 与 子列表 同步匹配
				THIS.lvOff.init(); //同步层级控制设置
			};
			if ($(obj).children("div")[0] != undefined) { //如果对象下已存在子列表：子列表弹窗边界限定操作
				var nextDiv = $(obj).children("div"),
					offset = $(obj).offset(),
					left = $(obj).width(),
					scrollTop = $(window).scrollTop(),
					_top = "",
					_left = "",
					_bottom = "";
				if (tmplType == "v1") {
					_left = left;
					if ((offset.top - scrollTop) > $(window).height() / 2 && nextDiv.height() < offset.top) { //坐标定位：垂直
						_top = "auto";
						_bottom = "0";
					}
					else _bottom = "";
					if (offset.left > $(window).width() / 2 && nextDiv.width() > $(obj).width() * 2) //坐标定位：水平
					_left = -(left * 2 + 33) + "px";
				}
				else if (tmplType == "v2" && $(obj).hasClass("list")) {
					if ((offset.top - scrollTop) > $(window).height() / 2 && nextDiv.height() < offset.top) { //坐标定位：垂直
						_top = "auto";
						_bottom = "18px";
					}
					else _bottom = "";
					if (offset.left > $(window).width() * 0.6) //坐标定位：水平
					_left = -(left + 8) + "px";
					else _left = "";
				}
				nextDiv.css({
					left: _left,
					top: _top,
					bottom: _bottom
				});
			}
		};
		//styleTmpl_v1
		if (tmplType == "v1") {
			//列表事件 - 显示隐藏子列表
			$("#" + config.cont.id + "_ol").delegate("li", "hover", function(e) {
				if (e.type == "mouseenter") {
					selFn.liCont(this);
					showList({
						obj: this
					});
				};
				if (e.type == "mouseleave") {
					hideList({
						obj: this
					});
				};
			});
			//CheckBox按钮事件 - 点击
			$("#" + config.cont.id + "_ol").delegate(":checkbox", "click", function() {
				//选中当前checkbox，添加到弹窗暂存数据列表
				THIS.form.popInput.run(this);
			});
			$("#" + config.cont.id + "_ol").delegate("li", "click", function() {
				selFn.liCont(this);
			});
		}
		//styleTmpl_v2
		if (tmplType == "v2") {
			//初始生成第二级列表
			var listInit = function() {
					var listObj = $("#" + config.cont.id + "_ol").children("ol").children("li");
					for (var i = 0; i < listObj.length; i++) {
						var json = new jsonHTML(config.cont);
						if ($(listObj[i]).data("data") != 0) $("<div>", {
							html: json.run({
								data: $(listObj[i]).data("data"),
								lv: 2
							})
						}).appendTo(listObj[i]);
					};
				}();
			//内容列表添加点击事件
			$("#" + config.cont.id + "_ol").delegate("li", "click", function(event) {
				event.stopPropagation();
				//如当前列表项为第二级列表，则加载、显示或隐藏第三级列表
				if ($(this).hasClass("list")) {
					selFn.liCont(this);
					if ($(this).attr("i") == 1) {
						if ($(this).hasClass("hover")) hideList({
							obj: this,
							time: 1
						});
						else showList({
							obj: this,
							time: 1
						});
						event.preventDefault();
					}
				}
			});
			//checkbox添加点击事件
			$("#" + config.cont.id + "_ol").delegate(":checkbox", "click", function(event) {
				//对象为标题
				if ($(event.target).closest("li").hasClass("v2_title")){
					THIS.form.popInput.run(this);
				}
				//对象为第二级列表
				else if ($(event.target).parents("div").eq(1).attr("id")){
					THIS.form.popInput.run(this);
				}
				//对象为第三级列表
				else THIS.form.popInput.run(this);
			});
			//显示隐藏子列表
			$("#" + config.cont.id + "_ol").delegate("li", "hover", function(e) {
				$(this).attr("i", 1);
				if ($(this).find("ol")[0]) {
					if (e.type == "mouseenter") {
						if ($(this).hasClass("listMax")) showList({
							obj: this,
							cssName: "hover listMaxHover"
						});
						else if ($(this).hasClass("list") != true) showList({
							obj: this
						});
						else this.sel = 1;
					};
					if (e.type == "mouseleave") {
						if ($(this).hasClass("listMax")) hideList({
							obj: this,
							cssName: "hover listMaxHover"
						});
						hideList({
							obj: this
						});
					}
				}
			});
			//终极子列表关闭按钮添加点击事件
			$("#" + config.cont.id + "_ol").delegate("i", "click", function(e) {
				hideList({
					obj: $(this).parents("li").eq(1),
					time: 1
				});
			});
		}
	};
};
/*
列表显示隐藏与禁止操作控制
	0	全部可显示&可选择（默认）
	1	不可选第一级列表
	2	不可选第二级列表
	//以下地区数据类型专用
	3	可选第一级、第二级（不显示第三级列表）
	4	不能选第1级中的省/自治区及大洲，其他可选1、2、3级（不可选省/自治区及大洲第一级列表）
	5	不能选第1级中的省/自治区，其他可选1、2、3级（不可选省/自治区第一级列表）
	地区类型(lev)：
		a 大洲
		b 省
		c 直辖市
		d 港澳台，钓鱼岛
*/
function lvOff(cfg) {
	var obj = "",
		list_a = [],//大洲
		list_b = [],//省
		list_c = [],//直辖市
		list_d = [],//港澳台，钓鱼岛
		listObj = cfg.cont.id + "_ol";//DOM列表父容器
	this.all_1_disabled = function() {
		if (cfg.cont.tmplType.split("_")[0] == "v1") obj = $("#" + listObj + " > ol > li > span > :checkbox'");
		else if (cfg.cont.tmplType.split("_")[0] == "v2") {
			var o = [];
			$("#" + listObj + " > ol > li > div > ol > li").each(function() {
				if ($(this).is(".list")) { //当第一级列表存在子列表时，才对此列表对象禁止操作
					if ($(this).find("li.v2_title")[0] != undefined) o.push($(this).find("li.v2_title")[0]);
				}
				//o.push($(this)[0]);
			});
			obj = $(o).children("span").find("input");
		}
	};
	this.all_2_disabled = function() {
		if (cfg.cont.tmplType.split("_")[0] == "v1") obj = $("#" + listObj + " > ol > li > div > ol > li > span > :checkbox");
		else if (cfg.cont.tmplType.split("_")[0] == "v2") {
			var o = [];
			$("#" + listObj + " > ol > li > div > ol > li > div > ol > li").each(function() {
				if (!$(this).is(".v2_title")) o.push(this);
			});
			obj = $(o).children("span").find("input");
		}
	};
	this.all_3_hide = function() {
		var o = $("#" + listObj + " > ol > li > div > ol > li").removeClass("list");
		o.find("span").removeClass("list");
		o.find("div").hide();
	};
	this.area = function() {
		$("#" + listObj + " > ol > li").each(function() {
			if ($(this).is(".list")) { //当第一级列表存在子列表时，才对此列表对象禁止操作
				if ($(this).attr("lev") == "a") list_a.push($(this).children("span").children(":checkbox")[0]);
				else if ($(this).attr("lev") == "b") list_b.push($(this).children("span").children(":checkbox")[0]);
				else if ($(this).attr("lev") == "c") list_c.push($(this).children("span").children(":checkbox")[0]);
				else if ($(this).attr("lev") == "d") list_d.push($(this).children("span").children(":checkbox")[0]);
			}
		});
	};
	this.init = function() {
		if (cfg.cont.lv == 0) return;
		else if (cfg.cont.lv == 1) this.all_1_disabled();
		else if (cfg.cont.lv == 2) this.all_2_disabled();
		else if (cfg.cont.lv == 3) {
			this.all_3_hide();
			return;
		} else if (cfg.cont.lv == 4) {
			this.area();
			obj = $(list_b).add(list_a);
		} else if (cfg.cont.lv == 5) {
			this.area();
			obj = $(list_b);
		}
		obj.attr("disabled","disabled");
		if(cfg.cont.title.split("_")[0] != "area")obj.hide();
		else {
			obj.parent().addClass("disabled");
			obj.css("visibility","hidden");
		}
	};
};

/*
弹窗与表单域联动关系处理
*/
function formData(cfg) {
	cfg.hideObjId = (typeof cfg.page.hideInputId == "string") ? $("#" + cfg.page.hideInputId) : cfg.page.hideInputId;
	cfg.textInputId = (typeof cfg.page.textInputId == "string") ? $("#" + cfg.page.textInputId) : cfg.page.textInputId;
	cfg.popInputId = cfg.page.popInputId;
	cfg.cookieInputId = cfg.page.cookieInputId;
	cfg.num = cfg.cont.numMax || 5;
	cfg.numset = false;
	var lan = {
		cn: {
			maxAlert: "最多可选择 " + cfg.num + " 个" + cfg.cont.titleText[cfg.cont.title.split("_")[0]] + "！"
		},
		en: {
			maxAlert: "Up to " + cfg.num + " " + cfg.cont.titleText[cfg.cont.title.split("_")[0]][0] + " can be selected"
		}
	};
	lan = lan[cfg.cont.lan];
	if (!cfg.cont.id ) return;

	var THIS = this,
		//弹窗(暂存参数) 存放对象
		vals = "",
		tmplType = cfg.cont.tmplType.substr(0, 2); //获取数据类型对应的主版本号

	//过滤重复数组元素
	function distinct(val) {
		//alert(1);
		var a = [],
			b = [];
		for (var prop in val) {
			var d = val[prop];
			if(d === a[prop]) continue; //防止循环到prototype
			if (b[d] != 1) {
				a.push(d);
				b[d] = 1;
			}
		}
		return a;
	};

	//对象处理
	this.obj = {
		getId : function(val){
			if(val == "")return;
			else if(typeof val == "string"){
				return this._getId(val);
			}
			else if(typeof val == "object"){
				return $(val).attr("id");
			}
		},
		_getId : function(val){
			if(val == "all")
				return [val];
			val = val.replace("v2_","");
			var data = jsonData[cfg.cont.dataName][0].dataStr.split("@"),
				reg = new RegExp(val + "$","g");
			var codeVal = [];
			for(var i = 0; i < data.length; i++){
				var code = data[i].split(",")[1];
				if(code.match(reg)){
					codeVal.push(code);
				}
			};
			return codeVal.length == 0 ? [val] : codeVal;
		},
		getCheckbox : function(val,set){
			if(val == "")return;
			if(typeof val == "object")
				return val;
			var id = this.getId(val);
			var checkboxs = $();
			for(var i = 0; i < id.length; i ++){
				if(set){
					checkboxs = checkboxs.add($("#" + cfg.cont.title + id[i]));
				}
				else{
					var tempCheckbox = ($("#" + cfg.cont.title + id[i]).length != 0) ? $("#" + cfg.cont.title + id[i]) : $("#v2_" + cfg.cont.title + id[i]);
					checkboxs = checkboxs.add(tempCheckbox);
				}
			};
			return checkboxs;
		},
		getParentCheckbox : function(val){
			return this.getCheckbox(val).parents("li").eq(1).children("span").find(":checkbox");
		},
		getCheckboxTitle : function(val,set){
			var obj = this.getCheckbox(val),
				title = obj.attr("title");
			if(cfg.cont.title == "area" && set){
				var pc = this.getParentCheckbox(val);
				if(pc.length != 0){
					var	li = this.getLi(pc.val());
					if(li.attr("lev") != "a" && li.attr("lev") != "b" && pc.length != 0){
						title = pc.attr("title") + title;
						var ppc = this.getParentCheckbox(pc.val());
						if(ppc.length != 0){
							var pLi = this.getLi(ppc.val());
							if(pLi.attr("lev") == "c" && ppc.length != 0){
								title = ppc.attr("title") + title;
							}
						}
					}
				}
				return title;
			}
			return title;
		},
		getLi : function(val){
			return this.getCheckbox(val).parent("span").parent("li");
		}
	};	
	//表单域 - 隐藏控件(input:hidden)
	this.hideInput = {
		//写入(覆盖，非叠加)
		add: function() {
			var vals = THIS.popHideVal.get(),
				val = vals.join("|"),
				bool = true;
			//已选择项目未超出上限
			if(vals.length <= cfg.num){
				//code值未变化，不重复写入数据
				if(val == cfg.hideObjId.val())
					return bool;
				cfg.hideObjId.val(val);
				THIS.viewInput.add();
				THIS.cookieObj.set(val);
			}
			//已选择项目已超出上限
			else{
				//提示已超出选择上限
				alertBar(lan.maxAlert);
				//返回false（不关闭窗口）
				bool = false;
			}
			return bool;
		},
		//查询
		get: function() {
			return cfg.hideObjId.val().replace(/^\|(.*)\|$/, "$1").split("|");
		}
	};
	//表单域 - 可见控件(input:text)
	this.viewInput = {
		//写入(覆盖，非叠加)
		add: function() {
			var comma = (cfg.cont.lan == "cn") ? "，" : ",",
				val = THIS.popList.get(cfg.cont.nameMax).join(comma);
			cfg.textInputId.val(val);
		},
		//查询
		get: function() {
			return cfg.textInputId.val().replace(/^\,(.*)\,$/, "$1").split(",");
		}
	};
	//Cookie存取
	this.cookieObj = (function() {
		//1.4 修改cookie值前缀
		var key = "select_" + cfg.cont.title,
			numMax = 6;
		return {
			//查询
			get: function() {
				var val = cookieObj.get(key);
				if (val != null) val.replace(/\|$/, "");
				return val;
			},
			//写入
			set: function(val) {
				if (val == "all") return; //如果传入值为all(all == 全选 == 空)，则终止执行
				var expires, domain, path, secure, valOld = this.get() || "";
				if (valOld != "") {
					//如果传入值与已存在值一致则终止执行
					if (valOld == val) return;
					//将值添加到cookie记录
					else val = valOld + "|" + val;
				}
				var valOldArr = distinct(val.split("|")); //过滤重复值
				if (valOldArr.length > numMax) { //判断是否超出值上限
					var maxLen = valOldArr.length - numMax;
					valOldArr.splice(0, maxLen);
				}
				val = valOldArr.join("|").replace(/\|$/,"");
				cookieObj.set(key, val, expires, domain, path, secure);
			},
			//删除
			del: function() {
				cookieObj.del(key);
			}			
		}
	})();
	//弹窗 - 暂存参数
	this.popHideVal = {		
		//增加
		add: function(val) {
			vals += val.replace("v2_","") + "|";
			vals = distinct(vals.split("|")).join("|");
		},
		//删除
		remove: function(val) {
			var reg = new RegExp(val.replace("v2_","") + "\\|", "g");
			vals = vals.replace(reg, "");
		},
		//删除全部
		removeAll: function() {
			vals = "";
		},
		//查询
		get: function() {
			return vals.replace(/\|$/, "").split("|");
		}
	};
	//弹窗 - 已选择项目列表
	this.popList = {
		//增加
		add: function(val) {
			if (!val) return;
			var obj = THIS.obj.getCheckbox(val),
				id = THIS.obj.getId(obj),
				title = THIS.obj.getCheckboxTitle(val,true);
			if($("#pop" + id).length != 0 || obj.length == 0) return;
			var span = $("<span>",{
					html: title
				}),
				li = $("<li>", {
					id: "pop" + id
				}).click(function() {						
					THIS.popInput.remove({
						val: obj.val()
					});
				}).append(span);
			$("#" + cfg.popInputId).find("ol").append(li);
		},
		//删除
		remove: function(val) {
			$("#pop" + THIS.obj.getId(val)).remove();
		},
		//删除全部
		removeAll: function() {
			$("#" + cfg.popInputId).find("ol").html("");
		},
		//查询
		get: function(bool) {
			var arr = THIS.popHideVal.get(),
				texts = [];
			if(arr == "")
				texts = arr;
			else if (arr && arr.length) {
				for (var i = 0; i < arr.length; i++) {
					var arrVal = (arr[i].split(",").length == 2) ? arr[i].split(",")[1] : arr[i];
					var obj = THIS.obj.getCheckbox(arrVal);
					if (obj.length) texts.push(THIS.obj.getCheckboxTitle(obj,bool));
				}
			};
			return texts;
		}
	};
	//弹窗 - 已使用过项目列表
	this.popOldList = {
		//增加
		add: function(val) {
			if (!val) return;
			if ($("#" + cfg.cookieInputId).css("display") != "block") $("#" + cfg.cookieInputId).fadeIn(1); //fadIn | show：IE6bug延迟显示修复
			var obj = THIS.obj.getCheckbox(val);
			//1.4 找不到对象时，不执行后续操作
			if(obj.length == undefined)return;
			var getId = THIS.obj.getId(obj);
			var li = $("<li>"),
				span = $("<span>"),
				label = $("<label>", {
					"for": "popOld" + getId,
					html: obj.attr("title")
				}),
				input = $("<input>", {
					id: "popOld" + getId,
					type: "checkbox",
					"checked": obj.attr("checked")
				}).click(function() {
					obj[0].click();
					var checked = ($(obj).attr("checked") == undefined) ? false : true;
					$(this).attr("checked", checked);
				});
			span.append(input).append(label);
			li.append(span);
			$("#" + cfg.cookieInputId).find("ol").append(li);
		},
		//删除
		del: function(val) {
			$("#" + cfg.cookieInputId).find("ol").html("");
		},
		//选择
		select: function(val) {
			$("#popOld" + THIS.obj.getId(val)).attr("checked", true);
		},
		//取消选择
		deselect: function(val) {
			$("#popOld" + THIS.obj.getId(val)).attr("checked", false);
		},
		//取消全部选择
		deselectAll: function() {
			$("#" + cfg.cookieInputId).find(":checked").attr("checked", false);
		}
	};
	//弹窗 - 内容列表(复选框Input:checkbox)
	this.selectedStyle = {
		add: function(obj){
			var $parentObj = $(obj).parent().parent();
			$(obj).parents("li.list").each(function(){
				if(!$(this).hasClass("selected"))						
					$parentObj = $parentObj.add($(this));
			});
			$parentObj.addClass("selected");
		},
		remove: function(obj){
			var $parentObj = $(obj).parent().parent();
			$(obj).parents("li.list").each(function(){
				if($(this).hasClass("selected") && $(this).find(":checked").length == 0){
					$parentObj = $parentObj.add($(this));
				}
			});
			$parentObj.removeClass("selected");
		},
		removeAll: function(){
			var this_ = this;
			$("#" + cfg.cont.id + "_ol").find("input").each(function(){
				this_.remove(this);
			});
		}
	};
	this.popInput = {
		//触发行为处理
		run: function(obj) {
			var val = obj.value;
			if (obj.checked) this.add({
				"val": val
			});
			else if (!obj.checked) this.remove({
				"val": val
			});
		},
		//添加
		add: function(conf) {
			var obj = THIS.obj.getCheckbox(conf.val);
			if (this.getNumMax()) {
				THIS.popHideVal.add(conf.val);
				THIS.popList.add(obj);
				THIS.popOldList.select(obj);
				conf.obj = obj[0];
				if(conf.obj == undefined) return;
				THIS.parentOut(obj);
				THIS.childOut(obj);					
				obj.attr("checked", true);
				THIS.selectedStyle.add(obj);
			}
			else {
				alertBar(lan.maxAlert);
				obj.attr("checked", false);
			}
		},
		//删除
		remove: function(conf) {
			var obj = THIS.obj.getCheckbox(conf.val);
			THIS.popList.remove(obj);
			THIS.popHideVal.remove(conf.val);
			THIS.popOldList.deselect(obj);				
			obj.attr("checked", false);
			THIS.selectedStyle.remove(obj);
		},
		//删除全部
		removeAll: function() {
			THIS.popList.removeAll();
			THIS.popHideVal.removeAll();
			THIS.popOldList.deselectAll();
			$("#" + cfg.cont.id + "_ol").find("input").attr("checked", false);
			THIS.selectedStyle.removeAll();
		},
		//查询是否超出限定可选上限
		getNumMax: function() {
			var bool = true,
				hideVal = THIS.popHideVal.get(),
				hideValLen = hideVal.length > 1 ? hideVal.length : hideVal[0] != "" ? 1 : 0;
			if(!cfg.numset && hideValLen >= cfg.num)
				bool = false;
			if(cfg.numset){
				bool = true;
				cfg.numset = false;
			}
			return bool;
		}
	};
	//显示弹窗前，初始化数据	(已选择项目列表)、弹窗(单项) 与 表单(隐藏控件)、表单(可见控件)同步匹配
	this.init = {
		showList: function(val) {
			if(THIS.obj.getCheckbox(val,true).length != 0)
				return;
			if(THIS.obj.getCheckbox(val).length != 0) {
				THIS.obj.getLi(val).attr("i", 0).click();
				return;
			}
			var data = jsonData[cfg.cont.dataName][0].dataStr.split("@");
			for(var i = 0; i < data.length; i ++){
				var code = data[i].split(",")[1],
					reg = new RegExp(val + "$","g"),
					reg2 = new RegExp("_[^_]+$","g");
				if(code.match(reg)){
					var c1 = THIS.obj.getLi(code.replace(reg2,"").replace(reg2,"")),
						c2 = THIS.obj.getLi(code.replace(reg2,""));
					if(c2.length == 0){
						c1.attr("i", 0).click();
						if(THIS.obj.getCheckbox(val).length == 0){
							this.showList(val);
						}
					}
					else {
						c2.attr("i", 0).click();
					}
				}
			};
		},
		//弹窗(已使用过项目列表) 与 表单(cookie) 同步匹配
		popOldList_cookie: function() {
			THIS.popOldList.del();
			var val = THIS.cookieObj.get();
			if (!val) return;
			var valArr = val.split("|").reverse(),
				len = valArr.length;
			for (var i = 0; i < len; i++) {
				if(THIS.obj.getCheckbox(valArr[i],true).length == 0)this.showList(valArr[i]);
				THIS.popOldList.add(valArr[i]);
			}
		},
		//弹窗(已选择项目列表) 与 弹窗(单项) 同步匹配
		popList_popInput: function() {
			var textInput = THIS.popHideVal.get();
			if (textInput && textInput[0] && textInput[0] != "" && textInput[0] != undefined) {
				for (var i = 0; i < textInput.length; i++) {
					THIS.obj.getCheckbox(textInput[i]).attr("checked", true);
				}
			}
		},
		//弹窗(已选择项目列表) + 弹窗(内容列表) 与 表单(隐藏控件) + 表单(可见控件) 同步匹配
		pop_form: function() {
			var viewInput = THIS.viewInput.get(),
				hideInput = THIS.hideInput.get();
			if (viewInput && viewInput[0] != false && hideInput && hideInput[0] != false) {
				THIS.popInput.removeAll();
				for (var i = 0; i < hideInput.length; i++) {
					if(THIS.obj.getCheckbox(hideInput[i],true).length == 0)this.showList(hideInput[i]);
					var obj = THIS.obj.getCheckbox(hideInput[i]);
					cfg.numset = true;
					obj.attr("checked", true);
					obj.click().attr("checked", true);
				}
			}
		}
	};
	//取消父级表单项勾选状态
	this.parentOut = function(obj) {
		var cheObj;
		if(tmplType == "v2"){
			var li = obj.parents("li").eq(0);
			if(!li.hasClass("v2_title")){
				cheObj = li.siblings(".v2_title").find(":checkbox");
			}
		}
		else{
			cheObj = obj.parents("li").parents("li").children("span").children(":checkbox").add(obj.parents("li").parents("li").parents("li").children("span").children(":checkbox"));
		}
		if(cheObj == undefined || cheObj.length == 0)return;
		cheObj.each(function(){
			if($(this).attr("checked"))
				THIS.popInput.remove({
					val : $(this).val()
				});
		});
	};
	//取消子级表单项勾选状态
	this.childOut = function(obj) {
		var cheObj;
		if(tmplType == "v2"){
			var li = obj.parents("li").eq(0);
			if(li.hasClass("v2_title")){
				cheObj = li.siblings().find(":checkbox");
			}
		}
		else{
			cheObj = obj.parent("span.list").next().find(":checkbox");
		}

		if(cheObj == undefined || cheObj.length == 0)return;
		cheObj.each(function(){
			if($(this).attr("checked")){
				THIS.popInput.remove({
					val : $(this).val()
				});
			}
		});
	};	
};

//带自定义皮肤的Alert替代函数
var alertBarArr = [];
function alertBar(val, lan) {
	if (!val) var val = "&nbsp;";
	if (!lan) var lan = "cn";
	var lanText = {
		cn: {
			title: "提示"
		},
		en: {
			title: "Help"
		}
	};
	lanText = lanText[lan.toLowerCase()];
	var THIS = this,
		but = $('<button class="but"><span>确定</span></button>').click(function() {
			THIS.hideDiv();
		}),
		alertBarClass = "alertBarHelp";
	val = $("<div>", {
		html: "<p class='title'><strong>" + lanText.title + "</strong>" + "<p class='alertCont'>" + val + "</p>"
	}).append(but);

	THIS = new popDiv({
		cont: {
			value: val,
			id: "alertBar",
			className: "popDiv alertBar " + alertBarClass
		},
		bg: {
			off: true,
			id: "alertBarBg",
			opacity: 0
		},
		closeBut: {
			off: true,
			id: "alertBarCloseBut"
		},
		hideToRemove: true,
		fxTime: 200
	});
	THIS.showDiv();
	but.focus();
};

//弹层处理

function popDiv(config) {
	//设置遮罩容器全局zIndex级别
	if(!window.createBackgroundDom_zIndex)
		window.createBackgroundDom_zIndex = 9999;
	var c = {
		cont: {
			value: config.cont && config.cont.value || false,
			id: config.cont && config.cont.id || "popDiv_contId" + createBackgroundDom_zIndex,
			className: config.cont && config.cont.className || "popDiv"
		},
		bg: {
			off: config.bg && config.bg.off || false,
			id: config.bg && config.bg.id || "popDiv_bgId" + createBackgroundDom_zIndex,
			className: config.bg && config.bg.className || "popDiv_bgClass",
			opacity: config.bg && config.bg.opacity || 0
		},
		closeBut: {
			off: config.closeBut && config.closeBut.off || false,
			id: config.closeBut && config.closeBut.id || "popDiv_closeId" + createBackgroundDom_zIndex,
			className: config.closeBut && config.closeBut.className || "closeBut"
		},
		outClick: config.outClick || false,
		keyEsc: config.keyEsc || false,
		hideToRemove: config.hideToRemove || false,
		fxTime: config.fxTime || 200
	},
		THIS = this;
	var lanText = {
		cn: {
			close: "关闭窗口"
		},
		en: {
			close: "Close Window"
		}
	};
	lanText = (config.cont.lan || config.cont.lan == "cn") ? lanText.cn : lanText.en;
	//弹窗背景&遮罩容器 创建
	this.createBgTag = function() {
		var bgDiv = $("<div>", {
			id: c.bg.id,
			css: {
				"position": "absolute",
				"top": "0",
				"left": "0",
				"width": "100%",
				"overflow": "hidden",
				"background": "#000",
				"display": "none"
			},
			"class": c.bg.className
		});
		bgDiv.css("opacity", c.bg.opacity);
		//if (!-[1, ] && !window.XMLHttpRequest) {
			bgDiv.html("<iframe src='about:blank' frameborder='0' width='9999' height='9999' scrolling='no' style='filter:alpha(opacity=0);width:9999px;height:9999px;'></iframe>");
		//}
		bgDiv.appendTo("body");
	};
	//弹窗内容载体容器 创建
	this.createContTag = function() {
		var contDiv = $("<div>", {
			id: c.cont.id,
			css: {
				"position": "absolute",
				"top": "50%",
				"left": "50%",
				"background": "#fff"
			},
			"class": c.cont.className
		});
		if (c.closeBut) this.craeteCloseTag(contDiv);
		if ($.browser.msie == undefined) contDiv.css("display", "none");
		contDiv.appendTo("body");
	};
	//弹窗关闭&隐藏按钮 创建
	this.craeteCloseTag = function(contDiv) {
		var closeDiv = $("<p>", {
			id: c.closeBut.id,
			"class": c.closeBut.className,
			val: lanText.close,
			title: lanText.close,
			click: function() {
				var fn = (c.keyEsc) ? c.keyEsc.fn : THIS.hideDiv;
				fn();
			}
		});
		closeDiv.appendTo(contDiv);
	};
	//弹窗容器 内容载入
	this.contToDiv = function() {
		$("#" + c.cont.id).append(c.cont.value);
	};
	//弹窗容器 显示
	var winH = 0,
		contH = 0,
		contW = 0;
	this.showDiv = function() {
		createBackgroundDom_zIndex ++;
		if ($("#" + c.bg.id + "")[0] != undefined) {
			$("#" + c.bg.id).height($(document).height() + "px");
			if ($.browser.msie == true) $("#" + c.bg.id + "").show();
			else $("#" + c.bg.id + "").fadeIn(c.fxTime);
			$("#" + c.bg.id).css("z-index", createBackgroundDom_zIndex);
		}
		if ($("#" + c.cont.id)[0] != undefined) {
			winH = (winH == 0) ? $(window).height() : winH;
			contH = (contH == 0) ? $("#" + c.cont.id).height() : contH;
			h = (contH > winH) ? winH - $(window).scrollTop() * 2 : contH - $(window).scrollTop() * 2;
			contW = (contW == 0) ? $("#" + c.cont.id).width() / 2 : contW;
			m = -h / 2 + "px 0 0 -" + contW + "px";
			$("#" + c.cont.id).css({
				"margin": m
			}).fadeIn(c.fxTime);
            //增加了一个show方法
			$("#" + c.cont.id).css("z-index", createBackgroundDom_zIndex).show();
		}
	};
	//弹窗容器 隐藏
	this.hideDiv = function() {
		if ($.browser.msie == true) $("#" + c.cont.id).css("left", "-200%");
		else $("#" + c.cont.id).fadeOut(c.fxTime);
		$("#" + c.bg.id + "").fadeOut(c.fxTime);
		if(c.hideToRemove) THIS.remove();
		$(document).unbind("keydown", this.keyDownFn);
	};
	//弹窗容器 内容清空
	this.remove = function() {
		$("#" + c.cont.id).width($("#" + c.cont.id).width());
		$("#" + c.cont.id).height($("#" + c.cont.id).height());
		setTimeout(function() {
			$("#" + c.cont.id).remove()
		}, c.fxTime);
	};
	//弹窗容器外 单击隐藏
	this.outClickHide = function() {
		$(document).click(function() {
			THIS.hideDiv();
		});
	};
	//Esc按件事件
	this.keyDownFn = function(event) {
		var fn = (c.keyEsc.fn) ? c.keyEsc.fn : THIS.hideDiv;
		if (event.keyCode == 27 && fn != undefined) {
			fn();
		}
	};
	//弹窗容器 Esc按键隐藏
	this.keyEscHide = function() {
		$(document).bind("keydown", this.keyDownFn);
	};
	this.init = function() {
		if (c.bg.id && $("#" + c.bg.id + "")[0] == undefined) THIS.createBgTag();
		if (c.cont.id && $("#" + c.cont.id)[0] == undefined) THIS.createContTag();
		if (c.cont.value != false) THIS.contToDiv();
		if (c.outClick) THIS.outClickHide();
		if (c.keyEsc) THIS.keyEscHide();
	}();
};

//jsonData处理
function jsonHTML(cfg) {
	var tmplType = cfg.tmplType.substr(0, 2); //获取数据类型对应的主版本号
	var k = {
		name : "name",
		code : "code",
		children : "children",
		type : "lev"
	};
	this._ol = $("<ol>", {
		"class": "selectBar_ol"
	});
	//V1数据模板
	this.styleTmpl_v1 = function(o) {		
		var data = o.data;
		for(var i = 0; i < data.length; i ++){
			if(data[i] != undefined){
				var codeAll = data[i][k.code].split("_"),
					code = codeAll[codeAll.length - 1],
					childrenClass = "list",
					childrenData = data[i][k.children];
				if(childrenData == undefined){
					childrenClass = "";
					childrenData = 0;
				}
				var _li = $("<li>", {
					"class" : childrenClass,
					html: "<span title=\"" + data[i][k.name] + "\" class='" + childrenClass + "'><input type='checkbox' title=\"" + data[i][k.name] + "\" value='" + code + "' id='" + cfg.title + data[i][k.code] + "'><label for='" + cfg.title + data[i][k.code] + "'>" + data[i][k.name] + "</label></span>"
				});
				if (data[i][k.type]) _li.attr("lev", data[i].lev);
				_li.data("data", childrenData).appendTo(this._ol);
			}
		};
	};
	//V2数据模板
	this.styleTmpl_v2 = function(o) {
		var data = o.data;
		for(var i = 0; i < data.length; i ++){
			if(data[i] != undefined){
				var codeAll = data[i][k.code].split("_"),
					code = codeAll[codeAll.length - 1],
					childrenClass = "list",
					childrenData = data[i][k.children];
				if(childrenData == undefined){
					childrenClass = "";
					childrenData = 0;
				}
				if(o.lv == 1) {
					childrenClass = (i % 2) ? " " : "hangyeListBg";
					$("<li>", {
						"class" : childrenClass,
						"title" : data[i][k.name],
						html: "<strong>" + data[i][k.name] + "</strong>"
					}).data("data", childrenData).appendTo(this._ol);
				}
				else if(o.lv == 2 && childrenData != undefined){
					$("<li>", {
						"class" : childrenClass,
						html: "<span title=\"" + data[i][k.name] + "\" class='" + childrenClass + "'><input type='checkbox' title=\"" + data[i][k.name] + "\" value='v2_" + code + "' id='v2_" + cfg.title + data[i][k.code] + "'><label for='v2_" + cfg.title + data[i][k.code] + "'>" + data[i][k.name] + "</label></span>"
					}).data("data", childrenData).appendTo(this._ol);
				}
				else if(o.lv == 3 || o.lv == 2 && childrenData == undefined){
					$("<li>", {
						html: "<span title=\"" + data[i][k.name] + "\"><input type='checkbox' title=\"" + data[i][k.name] + "\" value='" + code + "' id='" + cfg.title + data[i][k.code] + "'><label for='" + cfg.title + data[i][k.code] + "'>" + data[i][k.name] + "</label></span>"
					}).appendTo(this._ol);
				}
			}
		};		
	};
	this.run = function(o) {
		if (tmplType == "v1") {
			this.styleTmpl_v1(o);
		}
		else if (tmplType == "v2") {			
			if (o.lv == 3) {
				oval = o.obj.value.replace(/^v2\_/, "");
				oid = o.obj.id.replace(/^v2\_/, "");
				$("<li>", {
					"class": "v2_title",
					html: "<span title=\"" + o.obj.title + "\"><input type='checkbox' value='" + oval + "' title=\"" + o.obj.title + "\" id='" + oid + "'><label for='" + oid + "'>" + o.obj.title + "</label></span><i></i>"
				}).appendTo(this._ol);
			};
			this.styleTmpl_v2(o);
		}
		return this._ol;
	};
};
