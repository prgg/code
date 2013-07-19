// JavaScript Document
function $id(id){return document.getElementById(id); }
function showSide() {
    var outer = $id("outer"), main = $id("main"), btn = $id("sidebtn"), side = $id("side");
    if (side.style.display == "block" || side.style.display == "") {
        side.style.display = "none";
        outer.className = "";
		speed = "slow";
        btn.className = "sidebtn2";
        btn.title = "显示菜单";
        main.className = "main2"
		
    } else {
        side.style.display = "block";
        outer.className = "outer";
		speed = "slow";
        btn.className = "sidebtn1";
        btn.title = "隐藏菜单";
        main.className = "main1"
    }
}

