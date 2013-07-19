var cookieObj = {
	/**
	 * @public 设置cookie。setCookie(key, value, expires, path, domain, secure)
	 * @method setCookie
	 * @param {String} key cookie的键名
	 * @param {String} val cookie字段的值
	 * @param {Number} [expires] 保存天数
	 * @param {String} [domain] cookie域名
	 * @param {String} [path] cookie路径
	 * @param {Boolean} [secure] cookie是否为安全传输
	 * @return void
	 */
	set:function(key, val, expires, domain, path, secure){
		if (!path) path = '/';
		expires = expires || 365;
		expires = expires * 86400000;
		var e_date = new Date();
		e_date.setTime(+e_date + expires);
		document.cookie = 
			key + '=' + encodeURIComponent(val)
			+ (expires ? '; expires=' + e_date.toGMTString() : '')
			+ (domain ? '; domain=' + domain : '')
			+ (path ? '; path=' + path : '')
			+ (secure ? '; secure' : '');
	},
	
	/**
	 * 获取 cookie 值
	 * @param {String} key cookie字段的名字
	 * @return {String} 如果 key 不存在，返回 null
	 */
	get: function(key) {
		var c = document.cookie.split("; ");
		for (var i = 0; i < c.length; i++) {
			var p = c[i].split("=");
			if (key == p[0]) try { return decodeURIComponent(p[1]) } catch (e) { return null }
		}
		return null;
	},
	
	/**
	 * 删除 cookie 值
	 * @param {String} key cookie字段的名字
	 * @param {String} domain
	 * @param {String} path
	 */
	del: function(key, domain, path) {
		document.cookie = key + "=1" + (path ? "; path="+path:"; path=/")+(domain?"; domain="+domain:"")+";expires=Fri, 02-Jan-1970 00:00:00 GMT";
	},
	
	/**
	 * 获取域名以.分隔的最后两段，如music.xx.com 返回 .xx.com
	 * @return {String} 返回域名以.分隔的最后两段
	 */
	getDomain:function(){
		return "." + location.host.split(".").slice(-2).join(".");
	}
};