
/*
$(".class|#id|tag").selectBar({

	// 必选参数		
		title : "area",// 数据类型
		clickObj : ".class|#id|tag",// 事件触发对象，必须为当前JQ对象子孙对象
		codeObj : ".class|#id|tag",// code对象，必须为当前JQ对象子孙对象
		nameObj : ".class|#id|tag"// name对象，必须为当前JQ对象子孙对象

	// 可选参数
		url : "quanzhi.cn",// 数据存在主域地址（默认quanzhi.cn）
		lan : "CN",// 数据语言(可选：CN、EN。默认CN)
		numMax : 5,// 数据最大可选择数量，默认5条
		nameMax : false,// 中文是否完整输出（仅针对地区数据，例如：北京+朝阳区+团结湖）
		lv : 0// 数据可操作层级控制，默认0
			//  	0	全部可显示&可选择（默认）
			//  	1	不可选第一级列表
			//  	2	不可选第二级列表
			//  	以下地区数据类型专用
			//  	3	可选第一级、第二级（不显示第三级列表）
			//  	4	不能选第1级中的省/自治区及大洲，其他可选1、2、3级（不可选省/自治区及大洲第一级列表）
			//  	5	不能选第1级中的省/自治区，其他可选1、2、3级（不可选省/自治区第一级列表）

});
*/
(function($){
	$.fn.extend({
		selectBar : function(config){
			this.each(function(){
				// 载入弹窗函数
				selectBar.call(this,{
					domain : config.url || DOMAIN,
					// cont : {
						title : config.title,
						lan : config.lan,
						dataMax : config.numMax,
						nameMax : config.nameMax,
						lv : config.lv,
					// },
					// page : {
						//eventObj : $(this).find(config.clickObj),
						codeObj : $(this).find(config.codeObj),
						nameObj : $(this).find(config.nameObj),
					// },
					close : config.close,
					hideToRemove : true
				});
				var that = this;
				$(this).find(config.clickObj).on("click focusin",function(event){
					that.show();
					setTimeout(function(){
						$(event.target).blur();
					});
					event.stopPropagation();
				});
			});
			return this;
		}
	});
})(jQuery);

/*
*	# 定制弹出层 # 根据用户自定义的数据源生成相关表现形式的多选项弹层
*	@param	options[Object -> Json]
*		必选参数
*			title[String]
*			eventObj[Objevt -> Dom]
*			nameObj[Objevt -> Dom]
*			codeObj[Objevt -> Dom]
*		可选参数
*			domain[String]	Ajax请求数据来源域：优先获取全局域名设置，其次使用quanzhi.com
*			dataMax[Number]	数据选择支持上限：默认5条
*			nameMax[Bool]	可见内容是否完整输出（仅针对地区数据类型）：默认flase(仅显示当前选择对象内容)，true（显示当前选择对象以及该对象所有祖先级对象的内容）
*			lan[String]	语言类型：默认中文cn，可选英文en
*			lv[Number]	可操作级别：默认0
*				0	全部可显示&可选择（默认）
*				1	不可选第一级列表
*				2	不可选第二级列表
*				以下地区数据类型专用
*				3	可选第一级、第二级（不显示第三级列表）
*				4	不能选第1级中的省/自治区及大洲，其他可选1、2、3级（不可选省/自治区及大洲第一级列表）
*				5	不能选第1级中的省/自治区，其他可选1、2、3级（不可选省/自治区第一级列表）
*/
function selectBar(options) {

	//	申明selectbarh函数全局变量，用于配置与记录函数的执行过程
	if(!window.SELECTBAR)
		SELECTBAR = {
			hash : window.location.hash,
			log : false,
			debug : false,
			id : 0
		};

	/*
	*	# 自定义打印信息 #
	*	@param	msg[All] 打印信息内容：为空时退出函数
	*	@param	type[String|Bool] 打印信息类型：为空时优先使用console.log，备选alert的表现形态
	*		true	强制使用系统默认alert方法表现
	*		"ui"	使用自定义.alert方法表现
	*		"debug"	获取对应的调试信息
	*/
	function log(msg,type){
		if(typeof type === "string"){
			type = type.toLocaleLowerCase();
			if(type === "debug")
				msg = getDebug(msg);
			else if(type === "ui"){
				msg = $.alert ? $.alert(msg) : msg;
				if(msg)
					type = true;
			}
		}
		if(msg === undefined || msg === false)
			return;
		if(type !== true && window.console && console.log)
			console.log(msg);
		else
			alert(msg);
	};

	//	是否打印函数开发日志
	if (!SELECTBAR.log && SELECTBAR.hash == "#_log" && window.getSelectBarLog) {
		// 加载日志
		SELECTBAR.log = getSelectBarLog();
		// 打印日志
		log(SELECTBAR.log);
	};

	/*
	*	# 获取函数调试信息 #
	*	@param	debugCode[Number]	调试代码
	*	@return	[String|Number|False]
	*/
	function getDebug(debugCode){
		return SELECTBAR.debug[debugCode] || (SELECTBAR.hash == "#_debug" ? debugCode : false);
	};

	//	是否开启Debug调试模式
	if(!SELECTBAR.debug && SELECTBAR.hash == "#_debug" && window.getSelectBarDebug){
		//	加载Debug调试信息
		SELECTBAR.debug = getSelectBarDebug();
	};
	
	//	验证传参数据是否存在，缺少必选参数则退出函数
	if(!options && !options.title && !options.eventObj && !options.nameObj && !options.nameObj && !options.codeObj ){
		log(101,"debug");
		return;
	}

	/*
	*	参数默认配置
	* 	domain[String]	Ajax请求数据来源域：优先获取全局域名设置，其次使用quanzhi.com
	* 	dataMax[Number]	数据选择支持上限：默认5条
	* 	nameMax[Bool]	可见内容是否完整输出（仅针对地区数据类型，例如：北京+朝阳区+团结湖）：默认flase(仅显示当前选择内容)
	* 	lan[String]	语言类型：默认中文cn
	* 	lv[Number]	可操作级别：默认0
	*/
	this.opt = {
		// 必选参数示例
		// title : string,
		// eventObj : object -> dom,
		// nameObj : object -> dom,
		// codeObj : object -> dom,
		// 可选参数默认配置
		domain : DOMAIN || "quanzhi.com",
		dataMax : 5,
		nameMax : true,
		lan : "cn",
		lv : 0
	};

	// 加载传参数据
	$.extend(this.opt,options);
	log(100,"debug");

	// # 参数严格验证 #
	// Title
	this.tmplType = getTmplType(this.opt.title);
	if(this.tmplType)
		log(102,"debug");
	else
		log(103,"debug");

	//eventObj
	//nameObj
	//codeObj


	// selectBar初始化记录
	SELECTBAR.id ++;

	// 弹窗显示
	this.show = function(callback){
		log("show");
	};

	// 弹窗隐藏
	this.hide = function(callback){

	};

	// 获取name值
	this.getNames = function(callback){

	};

	// 获取code值
	this.getCodes = function(callback){

	};

	// 添加选中对象
	this.addCheckbox = function(code){

	};

	// 删除选中对象
	this.removeCheckbox = function(code){
		
	};


	// 数据请求状态
	this.dataLoadStatus = 0;
	// 弹层显示状态
	this.popShowStatus = false;
};

/*
*	# 获取弹层函数维护日志列表 #
*	@return	[String]
*/
function getSelectBarLog() {
	var logs = {
		time : "2013.5.8",
		version : [
			"2.012 新增：职场栏目数据(CRM)",
			"2.011 修复：默认加载多个已选项目时，弹出alert提示层限制",
			"2.010 修复：最大可选项目为“1”时无法被选择",
			"2.009 新增：能源合作网数据\n调整：能源、电力、医疗、化工、汽车、酒店、零售、教育、建材、IT、环境等数据内容\n调整：电力行业模版由v1_1改为v2",
			"2.008 更变：使用全局变量调用弹层Z轴层级",
			"2.007 更变：已选择历史项目，最后选择项目改为最先显示（倒序）",
			"2.006 更变：已选中项目高亮显示",
			"2.005 更变：规则：载入弹窗时，不判断选择上限（可接收任意选择项目到弹窗界面）",
			"2.004 新增：专业（major）数据；调整行业站行业弹窗数据排序",
			"2.003 修复：多个大类下存在同ID小类的选择错误问题；中英版本单词分组逗号区别使用",
			"2.002 修复：行业数据引起的脚本错误",
			"2.001 更变：优化Ajax请求，缓存数据文件到客户端",
			"2.000 更变：更变数据格式，支持使用字符串形式的更小体积数据文件",
			"1.006 新增：加入到jQuery插件，提供jQuery接口",
			"1.005 新增：关闭弹窗后回调参数",
			"1.004 更变：Code值将只输出当前项目（不附带父级项目code值）",
			"1.003 修复：数据请求支持缓存，只在首次进行请求；数据json键名可自定义",
			"1.002 更变：行业、职业（v2）数据模板UI更新",
			"1.001 新增：对行业站数据展示支持",
			"1.000 新增：支持地区、行业、职业数据展示、行为操作"
			]
		};
	return logs.time + "\n" + logs.version.join("\n");
};

/*
*	# 获取弹层函数调试信息列表 #
*	@return	[Object -> Json]
*/
function getSelectBarDebug() {
	return {
		"100" : "参数格式检测正确",
		"101" : "未检测到传参数据，或参数格式不正确",
		"102" : "参数数据检测正确",
		"103" : "参数数据错误，请检查是否存在此数据",
		"200" : "数据请求成功",
		"300" : "模版生成完毕",
		"400" : "事件注册完毕",
		"500" : "初始化完成"
	}
};

/*
*	# 获取HTML模板类型版本号 #
*	@param	title[String]	数据名称
*	@return	[String]	对应数据名称的版本号
*/
function getTmplType(title){
	var types = {
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
		major: "v1_2",
		//职场栏目
		zhichangColumn : "v1",
		//行业名称列表
		hangye : "v1",
		//地区名称列表
		areasite : "v1"
	};
	return types[title];
};