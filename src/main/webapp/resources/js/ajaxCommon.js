/**
 * 
 */

/**
 * ※ 멀티로 페이지 네비게이션 기능이 필요한 경우
 *    => 목록과 함께 페이지 네비게이션 구성 可 
 * @desc  : list and page navigation
 * @param : targetUrl     (required) 호출url
 * @param : jsFunctionName(required) 네비게이션 링크 펑션
 * @param : pageNo        (required) 페이지 번호
 * @param : callbackFunction(required) 콜백 펑션
 * @param : customFlag    (optical) 플래그
 */
function gfnListPageNavigation(targetUrl, jsFunctionName, pageNo, callbackFunction, customFlag) {
	var pageUnit  = 3;
	var pageSize  = 5;
	
	var pageIndex = 1;
	if(pageNo) {
		pageIndex = pageNo;
	}
	var param;
	if(!customFlag) {
		param = {"pageUnit" : pageUnit, "pageSize" : pageSize, "pageIndex" : pageIndex, "jsFunction" : jsFunctionName, "sportBsnsId" : document.getElementById("sportBsnsId").value};		
	} else {
		if(customFlag == 'R' || customFlag == 'I') {
			//위험/이슈
			param = {"pageUnit" : pageUnit, "pageSize" : pageSize, "pageIndex" : pageIndex, "jsFunction" : jsFunctionName, "sportBsnsId" : document.getElementById("sportBsnsId").value, "riskIssueYn" : customFlag};		
		}
		//TODO CUSTOMIZE
		//param = {"pageUnit" : pageUnit, "pageSize" : pageSize, "pageIndex" : pageIndex, "jsFunction" : jsFunctionName};
	}
	$.ajax({
		type: "POST",
	    url: targetUrl,
	    dataType: "json",
	    beforesend : function() {},
	    data : param,
	    async : false,
	    success : function(jsonData, status, xhr) {
	    	eval(callbackFunction);
	    },
	    error : function(xhr, status, error) {
	    	console.log(xhr);
	    	if (xhr.status == 404) {
	    		alert("<spring:message code='error.ajax.response.404' />");
	    		return;
	    	} else if (xhr.status == 200) {

	    	} else {
	    	    alert("<spring:message code='error.ajax.response.fail' />");
	    	    return;
	    	}
	    },
	    complete: function(xhr, status) {
	    }
	});
}


function fnAjaxCall(actionURL, jqueryForm, jsonData, validation, callback) {
	
	var data = "";
	
	if(jqueryForm != null){
		data = jqueryForm.serialize();
	}else{
		data = jsonData;
	}
	
	$.ajax({
		type: "POST",
	    url: actionURL,
	    dataType: "json",
	    beforesend: validation,
	    data :  data,
	    success : function(response, status, xhr) {	    	
	    	if(callback != 'undefined' && callback != null && callback != ''){
	    		callback(response, status, xhr);
	    	}
	    },
	    error : function(xhr, status, error) {
	    	console.log(xhr);
	    	if (xhr.status == 404) {
	    		alert("<spring:message code='error.ajax.response.404' />");
	    		return;
	    	} else if (xhr.status == 200) {

	    	} else {
	    	    alert("<spring:message code='error.ajax.response.fail' />");
	    	    return;
	    	}
	    },
	    complete: function(xhr, status) {
	    	
	    }
	}); 
	
}



function fnAjaxCallWithContentOpt(actionURL, jqueryForm, jsonStringData, validation, callback) {
	
	var data = "";
	
	if(jqueryForm != null){
		data = JSON.stringify(jqueryForm.serializeObject());
	}else{
		data = jsonStringData;
	}
	
	$.ajax({
		type: "POST",
	    url: actionURL,
	    dataType: "json",
	    contentType:"application/json",
	    beforesend: validation,
	    data :  data,
	    success : function(response, status, xhr) {	    	
	    	if(callback != 'undefined' && callback != null && callback != ''){
	    		callback(response, status, xhr);
	    	}
	    },
	    error : function(xhr, status, error) {
	    	console.log(xhr);
	    	if (xhr.status == 404) {
	    		alert("<spring:message code='error.ajax.response.404' />");
	    		return;
	    	} else if (xhr.status == 200) {

	    	} else {
	    	    alert("<spring:message code='error.ajax.response.fail' />");
	    	    return;
	    	}
	    },
	    complete: function(xhr, status) {
	    	
	    }
	}); 
	
}