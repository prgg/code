var formChecker = null; //初始化一个定时器标示
//上传加载完后执行表单验证 1秒执行一次
function swfUploadLoaded() {
	var btnSubmit = document.getElementById("btnSubmit");
	// 点击按钮执行上传事件
	btnSubmit.onclick = doSubmit;
	//按钮默认不可操作
	btnSubmit.disabled = true; 	

	//轮询：表单项验证  每隔1秒执行表单验证事件
	formChecker = window.setInterval(validateForm, 1000);
	
	validateForm();// 第一秒立马执行验证
}

//表单项验证
function validateForm() {
	var txtLastName = document.getElementById("lastname");
	var txtFirstName = document.getElementById("firstname");
	var txtEducation = document.getElementById("education");
	var txtFileName = document.getElementById("txtFileName");
	var txtReferences = document.getElementById("references");
	
	var isValid = true;
	if (txtLastName.value === "") {
		isValid = false;
	}
	if (txtFirstName.value === "") {
		isValid = false;
	}
	if (txtEducation.value === "") {
		isValid = false;
	}
	if (txtFileName.value === "") {
		isValid = false;
	}
	if (txtReferences.value === "") {
		isValid = false;
	}
	//四项任意一项为空 按钮disabled为true 此时按钮不可操作 
	//四项任意一项都不为空 按钮disabled为flase 此时按钮可操作
	document.getElementById("btnSubmit").disabled = !isValid;

}

// 点击按钮开始上传
function doSubmit(e) {
	if (formChecker != null) {   //标示不为null时 清除定时器 并又赋值null
		clearInterval(formChecker);
		formChecker = null;
	}
	
	e = e || window.event;
	if (e.stopPropagation) { //阻止事件冒泡 火狐下有效
		e.stopPropagation();
	}
	e.cancelBubble = true;  //阻止事件冒泡 ie下有效
	
	try {
		//开始上传文件
		swfu.startUpload();
	} catch (ex) {

	}
	return false;
}

 // 把正确的表单提交
function uploadDone() {
	try {
		document.forms[0].submit();
	} catch (ex) {
		alert("Error submitting form");
	}
}
// 选择上传文件时
function fileDialogStart() {
	//alert("adf")
	var txtFileName = document.getElementById("txtFileName");
	txtFileName.value = ""; //置空上传文件文本框
	this.cancelUpload();  
}


//文件上传错误
function fileQueueError(file, errorCode, message)  {
	try {
		// 处理错误的报错方式
		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:  //选择多个文件时
			alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
			return;
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			alert("The file you selected is too big.");  //文件超出指定大小时
			this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			return;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			alert("The file you selected is empty.  Please select another file.");  //文件为空时
			this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			return;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			alert("The file you choose is not an allowed file type.");  //不是指定类型的文件
			this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			return;
		default:
			alert("An error occurred in the upload. Try again later.");  //上传时发生错误时执行
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			return;
		}
	} catch (e) {
	}
}
	//选择好正确文件时执行
function fileQueued(file) {
	try {
		var txtFileName = document.getElementById("txtFileName");
		txtFileName.value = file.name;  //文件名赋给上传文本框
	} catch (e) {
	}

}
//执行完fileQueued后执行
function fileDialogComplete(numFilesSelected, numFilesQueued) {
	//检测表单
	validateForm();

	//开始上传
	//this.startUpload();
}

//上传过程
function uploadProgress(file, bytesLoaded, bytesTotal) {

	try {
		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

		file.id = "singlefile";	// This makes it so FileProgress only makes a single UI element, instead of one for each file
		var progress = new FileProgress(file, this.customSettings.progress_target);
		progress.setProgress(percent);
		progress.setStatus("Uploading...");
		
	} catch (e) {
		
	}
}

//表单提交并成功后触发
function uploadSuccess(file, serverData) {
	

	try {
		file.id = "singlefile";	// 给上传文件指定唯一id
		var progress = new FileProgress(file, this.customSettings.progress_target);
		progress.setComplete();   //上传完成
		progress.setStatus("Complete."); 
		progress.toggleCancel(false);

		if (serverData === " ") {
			this.customSettings.upload_successful = false; //如果服务器返回的数据位空 上传失败
			
		
		} else {
			this.customSettings.upload_successful = true;
			document.getElementById("hidFileID").value = serverData;  //不为空上传成功并把返回的数据赋给隐藏的input框
	
		}
		
	} catch (e) {
	
		
	}
}

//表单提交后触发
function uploadComplete(file) {
	
	
	try { 
		if (this.customSettings.upload_successful) { //上传成功后执行 uploadSuccess后
			this.setButtonDisabled(true);  
			uploadDone();
			//alert("一切都成功你就执行我把")

		} else {  //上传出错后执行 
			file.id = "singlefile";	// 给上传文件指定唯一id
			var progress = new FileProgress(file, this.customSettings.progress_target);
			progress.setError();
			progress.setStatus("File rejected");
			progress.toggleCancel(false);
			
			var txtFileName = document.getElementById("txtFileName");
			txtFileName.value = "";        //上传文本框质空
			validateForm();          //验证表单

			alert("There was a problem with the upload.\nThe server did not accept it.");
		}
	} catch (e) {
		
	}
}

//上传出错
function uploadError(file, errorCode, message) {
	try {
		
		if (errorCode === SWFUpload.UPLOAD_ERROR.FILE_CANCELLED) {
			// Don't show cancelled error boxes
			return;
		}
		
		var txtFileName = document.getElementById("txtFileName");
		txtFileName.value = "";
		validateForm();
		
		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:  //后台找不到文件路径
			alert("There was a configuration error.  You will not be able to upload a resume at this time.");
			this.debug("Error Code: No backend file, File name: " + file.name + ", Message: " + message);
			return;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:  //?
			alert("You may only upload 1 file.");
			this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			return;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			break;
		default:
			alert("An error occurred in the upload. Try again later.");
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			return;
		}

		file.id = "singlefile";	
		var progress = new FileProgress(file, this.customSettings.progress_target);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			progress.setStatus("Upload Error");
			this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			progress.setStatus("Upload Failed.");
			this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			progress.setStatus("Server (IO) Error");
			this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			progress.setStatus("Security Error");
			this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			progress.setStatus("Upload Cancelled");
			this.debug("Error Code: Upload Cancelled, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			progress.setStatus("Upload Stopped");
			this.debug("Error Code: Upload Stopped, File name: " + file.name + ", Message: " + message);
			break;
		}
	} catch (ex) {
	}
}