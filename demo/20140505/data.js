var data = [
	{ "date" : "20140310" , "uv" : 116434, "click" : 2564, "install" : 1129, "click_iphone" : 567 , "install_iphone" : 645  },
	{ "date" : "20140311" , "uv" : 121049, "click" : 5470, "install" : 2535, "click_iphone" : 1317, "install_iphone" : 611  },
	{ "date" : "20140312" , "uv" : 120114, "click" : 4647, "install" : 2068, "click_iphone" : 1329, "install_iphone" : 575  },
	{ "date" : "20140313" , "uv" : 137807, "click" : 5415, "install" : 2753, "click_iphone" : 2029, "install_iphone" : 761  },
	{ "date" : "20140314" , "uv" : 130976, "click" : 0   , "install" : 3424, "click_iphone" : 0   , "install_iphone" : 870  },
	{ "date" : "20140315" , "uv" : 141714, "click" : 6306, "install" : 4220, "click_iphone" : 2834, "install_iphone" : 1083 },
	{ "date" : "20140316" , "uv" : 132179, "click" : 5079, "install" : 3295, "click_iphone" : 2176, "install_iphone" : 894  },
	{ "date" : "20140317" , "uv" : 98258 , "click" : 4225, "install" : 2566, "click_iphone" : 1868, "install_iphone" : 751  },
	{ "date" : "20140318" , "uv" : 96830 , "click" : 4875, "install" : 2879, "click_iphone" : 2437, "install_iphone" : 883  },
	{ "date" : "20140319" , "uv" : 102828, "click" : 4645, "install" : 2785, "click_iphone" : 2303, "install_iphone" : 1052 },
	{ "date" : "20140320" , "uv" : 106491, "click" : 4358, "install" : 2578, "click_iphone" : 1949, "install_iphone" : 921  },
	{ "date" : "20140321" , "uv" : 106383, "click" : 4216, "install" : 2659, "click_iphone" : 2077, "install_iphone" : 918  },
	{ "date" : "20140322" , "uv" : 105168, "click" : 3732, "install" : 2408, "click_iphone" : 1950, "install_iphone" : 931  },
	{ "date" : "20140323" , "uv" : 107800, "click" : 4473, "install" : 2931, "click_iphone" : 2235, "install_iphone" : 1227 },
	{ "date" : "20140324" , "uv" : 96352 , "click" : 1028 + 1395 + 277 + 790 + 442, "install" : 2463, "click_iphone" : 475 + 1042 + 237 + 279 + 99, "install_iphone" : 1041 },
	{ "date" : "20140325" , "uv" : 105992, "click" : 1062 + 1930 + 759 + 470, "install" : 2174, "click_iphone" : 516 + 1808 + 323 + 110, "install_iphone" : 1023 },
	{ "date" : "20140326" , "uv" : 100341, "click" : 955 + 1794 + 830 + 441, "install" : 2130, "click_iphone" : 414 + 1328 + 268 + 105, "install_iphone" : 1926 },
	{ "date" : "20140327" , "uv" : 105696, "click" : 934 + 1665 + 782 + 441, "install" : 1975, "click_iphone" : 436 + 1336 + 382 + 115, "install_iphone" : 1145 },
	{ "date" : "20140328" , "uv" : 106437, "click" : 1096 + 1708 + 804 + 435, "install" : 2099, "click_iphone" : 445 + 1441 + 344 + 96, "install_iphone" : 1071 },
	{ "date" : "20140329" , "uv" : 106283, "click" : 931 + 1478 + 778 + 431, "install" : 1974, "click_iphone" : 368 + 1115 + 274 + 81, "install_iphone" : 1809 },
	{ "date" : "20140330" , "uv" : 104784, "click" : 1007 + 1467 + 711 + 449, "install" : 1934, "click_iphone" : 404 + 1177 + 272 + 86, "install_iphone" : 1810 },
	{ "date" : "20140331" , "uv" : 88806 , "click" : 815 + 1552 + 604 + 389, "install" : 1709, "click_iphone" : 376 + 1204 + 251 + 82, "install_iphone" : 1734 },
	{ "date" : "20140401" , "uv" : 98449 , "click" : 7044, "install" : 1461, "click_iphone" : 0, "install_iphone" : 1369 },
	{ "date" : "20140402" , "uv" : 120144, "click" : 9416, "install" : 1433, "click_iphone" : 0, "install_iphone" : 2172 },
	{ "date" : "20140403" , "uv" : 100498, "click" : 7068, "install" : 1423, "click_iphone" : 0, "install_iphone" : 1532 },
	{ "date" : "20140404" , "uv" : 103290, "click" : 7095, "install" : 1554, "click_iphone" : 0, "install_iphone" : 1532 },
	{ "date" : "20140405" , "uv" : 105161, "click" : 7000, "install" : 1554, "click_iphone" : 0, "install_iphone" : 1588 },
	{ "date" : "20140406" , "uv" : 110220, "click" : 3809, "install" : 1510, "click_iphone" : 0, "install_iphone" : 1355 },
	{ "date" : "20140407" , "uv" : 99206 , "click" : 6611, "install" : 1362, "click_iphone" : 0, "install_iphone" : 1556 },
	{ "date" : "20140408" , "uv" : 89790 , "click" : 6741, "install" : 1351, "click_iphone" : 0, "install_iphone" : 1251 },
	{ "date" : "20140409" , "uv" : 96653 , "click" : 4233 + 930  + 328 + 444 , "install" : 1208, "click_iphone" : 190 + 516  + 87  + 163, "install_iphone" : 1239 },
	{ "date" : "20140410" , "uv" : 94422 , "click" : 1523 + 1661 + 824 + 1029, "install" : 1078, "click_iphone" : 327 + 811  + 205 + 328, "install_iphone" : 1284 },
	{ "date" : "20140411" , "uv" : 103437, "click" : 1655 + 2372 + 596 + 1196, "install" : 996 , "click_iphone" : 407 + 1205 + 173 + 455, "install_iphone" : 1536 },
	{ "date" : "20140412" , "uv" : 93498 , "click" : 1860 + 1966 + 559 + 1130, "install" : 1300, "click_iphone" : 370 + 888  + 154 + 359, "install_iphone" : 1628 },
	{ "date" : "20140413" , "uv" : 96282 , "click" : 2117 + 2318 + 537 + 1200, "install" : 1326, "click_iphone" : 428 + 1214 + 160 + 441, "install_iphone" : 1529 },
	{ "date" : "20140414" , "uv" : 85031 , "click" : 1893 + 2370 + 519 + 1069, "install" : 1189, "click_iphone" : 407 + 1290 + 188 + 408, "install_iphone" : 1384 },
	{ "date" : "20140415" , "uv" : 86479 , "click" : 1848 + 2104 + 550 + 1271, "install" : 1273, "click_iphone" : 445 + 1151 + 170 + 473, "install_iphone" : 1242 },
	{ "date" : "20140416" , "uv" : 96981 , "click" : 1834 + 2217 + 538 + 1070, "install" : 1206, "click_iphone" : 408 + 1133 + 170 + 413, "install_iphone" : 1538 },
	{ "date" : "20140417" , "uv" : 101969, "click" : 1619 + 2030 + 536 + 1089, "install" : 1103, "click_iphone" : 407 + 1081 + 144 + 413, "install_iphone" : 1893 },
	{ "date" : "20140418" , "uv" : 97596 , "click" : 1748 + 2509 + 560 + 1216, "install" : 1327, "click_iphone" : 396 + 1234 + 142 + 423, "install_iphone" : 1811 },
	{ "date" : "20140419" , "uv" : 101606, "click" : 1994 + 2211 + 579 + 1238, "install" : 1259, "click_iphone" : 404 + 961  + 148 + 422, "install_iphone" : 1713 },
	{ "date" : "20140420" , "uv" : 97292 , "click" : 1809 + 2099 + 590 + 1131, "install" : 1227, "click_iphone" : 418 + 1097 + 144 + 365, "install_iphone" : 1632 },
	{ "date" : "20140421" , "uv" : 88541 , "click" : 1675 + 2068 + 418 + 1024, "install" : 999 , "click_iphone" : 402 + 1087 + 137 + 354, "install_iphone" : 1381 },
	{ "date" : "20140422" , "uv" : 79334 , "click" : 1712 + 1926 + 441 + 961 , "install" : 1009, "click_iphone" : 351 + 969  + 133 + 332, "install_iphone" : 1306 },
	{ "date" : "20140423" , "uv" : 81747 , "click" : 1385 + 1812 + 437 + 822 , "install" : 957 , "click_iphone" : 309 + 857  + 125 + 267, "install_iphone" : 1104 },
	{ "date" : "20140424" , "uv" : 92333 , "click" : 1540 + 1889 + 445 + 942 , "install" : 922 , "click_iphone" : 326 + 920  + 148 + 320, "install_iphone" : 920  },
	{ "date" : "20140425" , "uv" : 83521 , "click" : 1591 + 1740 + 471 + 981 , "install" : 997 , "click_iphone" : 304 + 809  + 130 + 305, "install_iphone" : 876  },
	{ "date" : "20140426" , "uv" : 80583 , "click" : 1924 + 1582 + 481 + 968 , "install" : 1033, "click_iphone" : 300 + 702  + 111 + 285, "install_iphone" : 942  },
	{ "date" : "20140427" , "uv" : 76038 , "click" : 1503 + 1769 + 473 + 957 , "install" : 1005, "click_iphone" : 344 + 766  + 130 + 282, "install_iphone" : 964  },
	{ "date" : "20140428" , "uv" : 72421 , "click" : 1442 + 2008 + 559 + 1109, "install" : 1005, "click_iphone" : 343 + 944  + 178 + 381, "install_iphone" : 781  },
	{ "date" : "20140429" , "uv" : 74319 , "click" : 1463 + 1387 + 534 + 857 , "install" : 867 , "click_iphone" : 281 + 663  + 129 + 302, "install_iphone" : 806  },
	{ "date" : "20140430" , "uv" : 87225 , "click" : 1427 + 1627 + 458 + 897 , "install" : 917 , "click_iphone" : 339 + 806 + 118 + 308, "install_iphone" : 791  },
	{ "date" : "20140501" , "uv" : 92107 , "click" : 1683 + 1737 + 468 + 850 , "install" : 988 , "click_iphone" : 300 + 754 + 102 + 291, "install_iphone" : 804  },
	{ "date" : "20140502" , "uv" : 68241 , "click" : 1357 + 1396 + 433 + 687 , "install" : 817 , "click_iphone" : 240 + 622 + 88  + 199, "install_iphone" : 951  },
	{ "date" : "20140503" , "uv" : 70095 , "click" : 1429 + 1528 + 424 + 883 , "install" : 832 , "click_iphone" : 285 + 726 + 101 + 310, "install_iphone" : 810  },
	{ "date" : "20140504" , "uv" : 94309 , "click" : 1716 + 1803 + 511 + 983 , "install" : 1075, "click_iphone" : 409 + 864 + 173 + 396, "install_iphone" : 849  },
	{ "date" : "20140505" , "uv" : 19437 , "click" : 0 , "install" : 461 , "click_iphone" : 0, "install_iphone" : 304 }
];
function getPCT(date){
	function toPCT(a,b){
		var num = Math.round(b / a * 10000)/100 + "",
			str = "%",
			num_len = num.length,
			num_index = num.indexOf(".");
		if(num != 0 && num != "Infinity"){
			if(num_index == 1 && num.length == 3 || num_index == 2 && num.length == 4){
				str = "0%";
			}
			if(num_index == -1){
				str = ".00%";
			}
			return num + str;
		}
		else{
			return 0;
		}
	};
	return {
		//入点到点击转化率
		"u2c" : toPCT(date.uv , date.click),
		//点击到安装转化率
		"c2i" : toPCT(date.click , date.install),
		//入点到安装转化率
		"u2i" : toPCT(date.uv , date.install),
	}
};
var html = "<table><thead><tr><th>日期</th><th>入点用户</th><th>点击量</th><th>安装量</th><th>入点 &gt; 点击</th><th>点击 &gt; 安装</th><th>入点 &gt; 安装</th><th>iOS点击量</th><th>iOS安装量</th></tr></thead><tfoot><tr><th>日期</th><th>入点用户</th><th>点击量</th><th>安装量</th><th>入点 &gt; 点击</th><th>点击 &gt; 安装</th><th>入点 &gt; 安装</th><th>iOS点击量</th><th>iOS安装量</th></tr></tfoot><tbody>";

for(var i = data.length - 1; i >= 0; i--){
	data[i].click = Math.round(data[i].date >= 20140401 ? data[i].click/2 : data[i].click);
	var date_re = getPCT(data[i]);
    html += "<tr>\
    			<td>" + data[i].date + "</td>\
    			<td>" + data[i].uv + "</td>\
    			<td>" + data[i].click + "</td>\
    			<td>" + data[i].install + "</td>\
    			<td>" + date_re.u2c + "</td>\
    			<td>" + date_re.c2i + "</td>\
    			<td><strong>" + date_re.u2i + "</strong></td>\
    			<td>" + data[i].click_iphone + "</td>\
    			<td>" + data[i].install_iphone + "</td>\
    		</tr>";
};

html += "</tbody></table>";

var img = new Image();
img.onload = function(){
	document.body.innerHTML = html;
};
img.src = "http://www.j.cn/js/1x1.gif?ucs=UTF-8&un=statistic_channel.test.mobile.0";