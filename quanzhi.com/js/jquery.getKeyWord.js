(function($){
	$.fn.extend({
		/*
		 *	# 获取关键词 #
		 *	@param	keywords[String|Array]	指定将要高亮的关键词或关键词组
		 *	@param	success[Function]	接收查询到的关键词函数，处理后返回结果
		 *
		 *	修改记录：
		 * 			20130428 - 过滤&nbsp;&#160;等HTML实体字符
		 *
		 * 	演示，高亮“a”：
		 * 		处理前
	 	 *		<div>testatest
		 *			<a>testatest</a>
		 *			testa
		 *		</div>
		 * 		处理后
		 *		<div>test<b>a</b>test
		 *			<a>test<b>a</b>test</a>
		 *			test<b>a</b>
		 *		</div>
		 *
		 *	var key = "keyword";
		 *	$(dom).getKeyWord(key,function(data){
		 *		return "<b>" + data + "</b>";
		 *	});
		 *		
		*/
		getKeyWord : function(keywords,success){

			//对象完整性检测
			if(!this.length || !keywords || !success || !($.isArray(keywords) || typeof keywords == "string") || keywords.length == 0 || !$.isFunction(success))
				return;

			//多个对象时递归处理
			if(this.length > 1){
				this.each(function(){
					this.getKeyWord(keywords,success);
				});
			}

			//查找并返回关键词
			else{
				//当存在多个关键词时递归处理
				if($.isArray(keywords) && keywords.length > 1){
					for(var i = 0;i < keywords.length; i++ )
						this.getKeyWord(keywords[i],success);
				}
				else{
					//转义处理
					(typeof keywords === "number") ? keywords : "\\" + keywords;
					//对象包含文本关键词高亮处理
					var regTag = new RegExp("[>\n](?!&.[a-z]*;)(.[^>]*)[<\n]","gi"),
						regKey = new RegExp(keywords,"gi"),
						//获取对象内容
						html = this.html(),
						//对象内容存储对象
						newHtml = "";
					//获取修改后的内容
					newHtml = html.replace(regTag,function(a,b){//获取非标签内容
						return a.replace(regKey,function(c){//获取关键词内容
							return success(c);//将内容传给回调函数处理，并返回结果
						});
					});
					//写入对象内容
					this.html(newHtml);
				}
			}

			//返回JQ对象
			return this;
		}
	});
})(jQuery);