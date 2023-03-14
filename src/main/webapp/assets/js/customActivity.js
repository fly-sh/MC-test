define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Step 1", "key": "step1" },
    ];
    var currentStep = steps[0].key;
    var eventDefinitionKey ="";
    
    
    var jnSettings_name = "";
    var jnVersion = "";
    var CJfuelapiRestHost = "";
    var CJfuel2token = "";
    
    //$(window).ready(onRender);
    
    connection.on('initActivity', initialize);    
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);
    connection.on('requestedInteraction',requestedInteractionHandler);
    
    connection.on('requestedTriggerEventDefinition', onGetEventDefinition);
    connection.on('requestedSchema', onGetSchema);
    
    //connection.on('updateStep', onClickedNext);
    
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestInteraction');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestSchema');
        
        connection.trigger('updateButton', { button: 'next', enabled: true });
        console.log("render Done");
        
      
    }
    
    function onGetEventDefinition(data) {
        console.log("onGetEventDefinition : " + JSON.stringify(data));
    }

    function onGetSchema(data) { // Data Extension 필드 확인가능
    	console.log("onGetSchema : " + JSON.stringify(data));
        
        var exceptionField = ["Subkey","Phone","Date","Send_Date","mobilephone","longUrl","mainCustomerPH"];
        var excptDeField = ["actualChoice"];
        
		personalFieldArr = new Array();

        $.each(data.schema, function(index, deData){//DE 필드확인 및 구분
           var key = deData.key;
           var fieldName = key.substring(key.lastIndexOf(".")+1, key.length);
           
           if(key.split(".")[0] == "Event"){
        	   if(excptDeField.indexOf(fieldName) < 0 ){
        		   dataExtensionObj[fieldName] = "{{" + key + "}}";// 저장형태 : { "필드명1" : "{{Event.eventDefinitionKey.필드명1}}" , "필드명2" : "{{Event.eventDefinitionKey.필드명2}}" }   => json 형태로 저장
        	   }
        	   //화면 출력용 개인화 필드 데이터 세팅 전체 필드중 제외 필드 설정
        	   if(exceptionField.indexOf(fieldName) < 0 ){
        		   personalFieldArr.push(fieldName);
        	   }
           }
        });
        
    }

    function initialize (data) {
    	console.log("initialize start ");
    	console.log(JSON.stringify(data));
    	if (data) {
            payload = data;
        }
    	
    	var payload_name = payload['name'];
    	var payload_id = payload['id'];
    	
        console.log(payload_name);
        console.log(payload_id);
        
        if ( payload_id == null){
        	//alert("Journey를 Save 해주시기 바랍니다.");
        	//alert($("#a_1").text());
        	//action_popup.alert($("#a_1").text());
        	action_popup.alert($("#a_1").text(), function() {
        		connection.trigger('destroy');
			});
    	}
        
        if ( payload_name == null || payload_name == "" || payload_name == undefined){
        	payload_name ="Notiforce-prod";
        	payload['name'] = payload_name;
        }

        var message;
        

        
        // If there is no message selected, disable the next button
        if (!message) {
            showStep(null, 1);
            connection.trigger('updateButton', { button: 'next', enabled: false });
            // If there is a message, skip to the summary step
        } else {
            //$('#select1').find('option[value='+ message +']').attr('selected', 'selected');
            //$('#message').html(message);
        	connection.trigger('updateButton', { button: 'next', enabled: true });
            showStep(null, 3);
        }
        
        connection.trigger('updateButton', { button: 'next', enabled: true });
        //showStep(null, 3);
       console.log("initialize end");
    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
         console.log(tokens);
         var ObjTokens = tokens;
         CJfuel2token = ObjTokens.fuel2token;
         console.log(CJfuel2token);
         
         var jsondata = {
        		 fuelapihost : ""+CJfuelapiRestHost+"",
        		 fueltokenkey : ""+CJfuel2token+"" };
					
         var jsonString = JSON.stringify(jsondata);
         $.ajax({
 			url: "/customActivity/message/getUserInfo.json",
 			type: "post",
 			dataType: "json",
 			data: jsonString,
 			contentType:"application/json; charset=UTF-8",
 			success: function(data) {
 				console.log(data);
 				if(data.statusCode == "200"){
 					userOrg = data.result;
 					userInfo = data.userInfo;
 					$('#headerForm [name="org_id"]').val(userOrg.org_id);
 					$('#headerForm [name="mber_no"]').val(userOrg.mber_no);
 					$('#TmpListModalForm [name="org_id"]').val(userOrg.org_id);
 					$('#TmpListModalForm [name="mber_no"]').val(userOrg.mber_no);
 					setInitData();
 					//$("#org_id").val(userOrg.org_id);
 					//$("#mber_no").val(userOrg.mber_no);
 				}else{
 					//alert("인증 되지 않은 Markting Cloud 입니다.");
// 					alert($("#a_2").text());
// 		        	connection.trigger('destroy');
 		        	action_popup.alert($("#a_2").text(), function() {
 		        		connection.trigger('destroy');
 					});
 				}
     		}
     	 });
    }
    
    
    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com" 
         console.log(endpoints);
         var ObjEndpoints = endpoints;
         CJfuelapiRestHost = endpoints.fuelapiRestHost;
         console.log(CJfuelapiRestHost);
    }

    function onClickedNext () {
    	console.log("onClickedNext");
    	//var isValFalse = false;//validation 처리
    	
    	var contString = $("#msg").val();
    	var _byteConfirm = 0;
    	var _charConfirm = '';
    	
    	 if($("#sender").val() == "" || $("#sender").val() == null){
         	//alert("발신번호를 선택해주세요.");
    		//alert($("#a_3").text());
    		action_popup.alert($("#a_3").text());
    		connection.trigger('ready');
         	return;
         }
         
         if($("#templete_id").val() == "" ){
         	//alert("친구톡 템플릿을 선택해주세요.");
//        	alert($("#a_4").text());
        	action_popup.alert($("#a_4").text() );
         	connection.trigger('ready');
         	return;
         }
         
         if($("#msgTab").hasClass("on")){//메시지 탭
        	 if($("#lmsTitle").hasClass("on") || $("#mmsTitle").hasClass("on")){
        		 if($("#subject").val() == ""){
        			 //alert("메시지 제목을 입력해주세요.");
//        			 alert($("#a_5").text());
        			 action_popup.alert($("#a_5").text());
        			 connection.trigger('ready');
        	         return;
        		 }
        	 }
        	 if($("#msg").val() == ""){
    			 //alert("메시지 내용을 입력해주세요.");
//    			 alert($("#a_6").text());
        		 action_popup.alert($("#a_6").text());
        		 connection.trigger('ready');
    	         return;
    		 }
    		 
    		// 메시지 byte 확인
    		for(var i=0; i<contString.length; i++) {
				_charConfirm = contString.charAt(i);
				if(escape(_charConfirm).length > 4) _byteConfirm += 2;
				else _byteConfirm++;
			}
			if(_byteConfirm > 2000) {
				action_popup.alert($("#a_14").text());
        		connection.trigger('ready');
        	    return;
			}
    		 
         }else if($("#kkfTab").hasClass("on")){//친구톡
         	// 메시지 길이 확인
         	if($("#img_url").val() == "" || $("#img_url").val() == null) {
	    		if(contString.length > 1000) {
					action_popup.alert($("#a_33").text());
	        		connection.trigger('ready');
	        	    return;
				}
			} else {
	    		if(contString.length > 400) {
					action_popup.alert($("#a_34").text());
	        		connection.trigger('ready');
	        	    return;
				}
			}
         }else if($("#kkoTab").hasClass("on")){//알림톡
        	 
         }
         
         // 광고성일 경우 080번호 존재 유무 확인
         if($("#advYn1").is(":checked") == true){
        	if($("#rejectnum").val() == "" || $("#rejectnum").val() == null) {
				action_popup.alert($("#a_32").text() );
         		connection.trigger('ready');
				return;
			}
         }
         
         //메시지 내용에 선언된 개인화필드 존재 유무확인
         var contPersFdArr = contString.match(/[{](.*?)[}]/g);
         var isPersFdOk = true;
         
         if(contPersFdArr!= null){
        	 $.each(contPersFdArr, function(index, psField){
        		 var temp = psField.substring(1, psField.length - 1);
        		 var tempPFArr = personalFieldArr;
        		 //tempPFArr.push("URL");
        		 if(tempPFArr.indexOf(temp) < 0){
        			 //alert("메시지 내용의 개인화필드는 Data Extension 필드 선언이 필수입니다.");
        			 //alert($("#a_7").text());
        			 action_popup.alert($("#a_7").text());
        			 isPersFdOk = false;
        			 return false;
        		 }
        	 });
         }
         
         //가변버튼 validation (주소형식, 개인화필드)
         var contStringUrlSize = $('#btnList').find('input[name=addBtnType]').size();
         if (contStringUrlSize > 0) {
         	var murl = $('#btnList').find('#mUrlWl');
         	if (murl.size() > 0) {
         		for (var i=0; i<murl.size(); i++) {
         			var contStringUrl = $('#btnList').find('#mUrlWl:eq('+i+')').val();
         			if (!(contStringUrl.startsWith('http://') || contStringUrl.startsWith('https://'))) {
         				action_popup.alert($("#a_31").text());
         				isPersFdOk = false;
			        	return false;
         			}
         			var contStringUrlArr = contStringUrl.match(/[{](.*?)[}]/g);
         			if (contStringUrlArr != null) {
         				$.each(contStringUrlArr, function(index, psField){
			        		var temp = psField.substring(1, psField.length - 1);
			        		var tempPFArr = personalFieldArr;
			        		if(tempPFArr.indexOf(temp) < 0){
			        			action_popup.alert($("#a_30").text());
			        			isPersFdOk = false;
			        			return false;
			        		}
			        	});
         			}
         			contStringUrl = $('#btnList').find('#pUrlWl:eq('+i+')').val();
         			if (contStringUrl != "") {
         				contStringUrlArr = contStringUrl.match(/[{](.*?)[}]/g);
	         			if (contStringUrlArr != null) {
	         				$.each(contStringUrlArr, function(index, psField){
				        		var temp = psField.substring(1, psField.length - 1);
				        		var tempPFArr = personalFieldArr;
				        		if(tempPFArr.indexOf(temp) < 0){
				        			action_popup.alert($("#a_30").text());
				        			isPersFdOk = false;
				        			return false;
				        		}
				        	});
	         			}
         				if (!(contStringUrl.startsWith('http://') || contStringUrl.startsWith('https://'))) {
	         				action_popup.alert($("#a_31").text());
	         				isPersFdOk = false;
				        	return false;
         				}
         			}
         		}
         	}
         	var aurl = $('#btnList').find('#aUrlAl');
         	if (aurl.size() > 0) {
         		for (var i=0; i<aurl.size(); i++) {
         			var contStringUrl = $('#btnList').find('#aUrlAl:eq('+i+')').val();
         			if (!(contStringUrl.startsWith('http://') || contStringUrl.startsWith('https://'))) {
         				action_popup.alert($("#a_31").text());
         				isPersFdOk = false;
			        	return false;
         			}
         			var contStringUrlArr = contStringUrl.match(/[{](.*?)[}]/g);
         			if (contStringUrlArr != null) {
         				$.each(contStringUrlArr, function(index, psField){
			        		var temp = psField.substring(1, psField.length - 1);
			        		var tempPFArr = personalFieldArr;
			        		if(tempPFArr.indexOf(temp) < 0){
			        			action_popup.alert($("#a_30").text());
			        			isPersFdOk = false;
			        			return false;
			        		}
			        	});
         			}
         			contStringUrl = $('#btnList').find('#iUrlAl:eq('+i+')').val();
         			if (!(contStringUrl.startsWith('http://') || contStringUrl.startsWith('https://'))) {
         				action_popup.alert($("#a_31").text());
         				isPersFdOk = false;
			        	return false;
         			}
         			contStringUrlArr = contStringUrl.match(/[{](.*?)[}]/g);
         			if (contStringUrlArr != null) {
         				$.each(contStringUrlArr, function(index, psField){
			        		var temp = psField.substring(1, psField.length - 1);
			        		var tempPFArr = personalFieldArr;
			        		if(tempPFArr.indexOf(temp) < 0){
			        			action_popup.alert($("#a_30").text());
			        			isPersFdOk = false;
			        			return false;
			        		}
			        	});
         			}
         		}
         	}
         }
    	 
         if(isPersFdOk == false){
        	 connection.trigger("ready");
        	 return;
         }
         
         
         //예약시간 유효성 검사
         var timePattern = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
         if($("#bookYn").is(":checked")){
        	 
        	 if($("#searchSdate").val() == ""){
        		//alert("날짜를 선택해 주시기 바랍니다.");
//        		alert($("#a_8").text());
        		action_popup.alert($("#a_8").text());
        		connection.trigger("ready");
        		return;
        	 }
        	 
        	 if(!timePattern.test($("input[name=start_time]").val()) ){
        		//alert("24시간 xx:xx 형식으로 입력해 주시기 바랍니다.");
//        		alert($("#a_9").text());
        		action_popup.alert($("#a_9").text());
        		connection.trigger("ready");
        		return;
        	 }
        	 
        	 var nowDate = new Date();
        	 var selDate = new Date($("#searchSdate").val() + " " + $("input[name=start_time]").val());
        	 
        	 nowDate.setMinutes(nowDate.getMinutes() + 30);
        	 if(nowDate > selDate){
        		//alert("문자 예약 시간을 30분 후로 입력해 주시기 바랍니다.");
//        		alert($("#a_10").text());
        		action_popup.alert($("#a_10").text());
        		connection.trigger("ready");
         		return;
        	 }
        	 
        	if(!$("#nightYn").is(":checked") && $('#advYn1').is(":checked")) {
	        	var sTime = new Date($("#searchSdate").val() + " 08:00");
	        	var eTime = new Date($("#searchSdate").val() + " 20:00");
	        	 
	        	if(selDate < sTime || selDate > eTime){
	        		action_popup.alert($("#a_28").text());
	        		connection.trigger("ready");
	        		return;
	        	}
        	}
        }
         
         
         
    	//if(isValFalse){
    		//connection.trigger('ready');
    	//}else{
    		save();
    		connection.trigger("nextStep");
    	//}
    }

    function onClickedBack () {
        connection.trigger('prevStep');
    }

    function onGotoStep (step) {
        showStep(step);
        connection.trigger('ready');
    }
    function requestedInteractionHandler(settings){
    	try{
    		if(settings.triggers == "" || settings.triggers[0].metaData.eventDefinitionKey == undefined){
    			//alert("Data Extension Object 를 선택해 주세요!");
    			alert($("#a_11").text());
    			connection.trigger('destroy');
    		}else{
    			var chkDeConnArr = settings.triggers[0].metaData.eventDefinitionKey.split("-");
    			if(chkDeConnArr[0] != "DEAudience" && chkDeConnArr[0] != "AutomationAud" && chkDeConnArr[0] != "APIEvent"
    				&& chkDeConnArr[0] != "SalesforceObjectTriggerV2" && chkDeConnArr[0] != "CloudPagesSma" 
    					&& chkDeConnArr[0] != "DateEvent" && chkDeConnArr[0] != "ContactAudience"
    						&& settings.triggers[0].metaData.eventDefinitionKey.indexOf("SalesforceObj") != 0){
    				
    				//alert("Data Extension Object 를 선택해 주세요!");
        			alert($("#a_11").text());
        			connection.trigger('destroy');
    				
    			}
    		}
    		eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
    		jnSettings_name = settings.name;
    		jnVersion = settings.version;
    	}catch(e){
    		console.error(e);
    	}
    }

    function showStep(step, stepIndex) {
    	
        if (stepIndex && !step) {
            step = steps[stepIndex-1];
        }

        currentStep = step;
        //console.log("showStep" + currentStep.key);
        $('.step').hide();

        switch(currentStep.key) {
            case 'step1':
                $('#step1').show();
                connection.trigger('updateButton', {
                    button: 'next',
                    enabled: Boolean(getMessage())
                });
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: false
                });
                break;
            case 'step2':
                $('#step2').show();
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: true
                });
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'next',
                    visible: true
                });
                break;
           
        }
    }
    
    function setInitData() {
		
    	var msgtype;
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        if(inArguments[0].msgType){
        	var setData = inArguments[0];
    		msgtype = setData.msgType;
    		
    		$("#isSaveLoad").val("Y");//mc 데이터 로드 유무
    		
    		//사용자용 데이터 저장 => setUserData 함수 에서 선택된 데이터 세팅 
    		var savedUserInfoJO = new Object();
    		
    		if(msgtype === 'KKO') {
        		loadKkoForm();
        	} else if(msgtype === 'KKF') {
        		loadKkfForm();
        		$("#img_url").val(setData.img_url);
        	} else {
        		loadMsgForm();        		
        	}
//        	$('#msgType').val(msgtype);
        	console.log("initialize msgtype   " + msgtype);
        	if(setData.t_data != undefined){
        		var tData = setData.t_data;
        		$("#msg").val(tData.content);
        		$("#subject").val(tData.subject);
        		$("#sender").val(tData.callback);
        		savedUserInfoJO.callback = tData.callback;
        		
        		if(tData.msg_cl_type == "1"){
        			$("#advYn1").attr("checked","checked");
        			$("#rejNum_tr").show();
        			$("#nightStatus").show();
        			$("#rejectnum").val(tData.ars_080_num);
        			savedUserInfoJO.ars_080_num = tData.ars_080_num;
        			$("#textMsgTime").timepicker('remove');
        			$("#textMsgTime").timepicker({
				        'minTime': '08:00am', // 조회하고자 할 시작 시간 ( 00:15분 부터 선택 가능하다. )
				        'maxTime': '20:00pm', // 조회하고자 할 종료 시간 ( 20시 까지 선택 가능하다. )
				        'timeFormat': 'H:i',
				        'step': 15 // 30분 단위로 지정. ( 10을 넣으면 10분 단위 )
				    });
                }else{
                	$("#advYn2").attr("checked","checked");
                	$("#rejNum_tr").hide();
                	$("#nightStatus").hide();
                	$("#textMsgTime").timepicker('remove');
                	$("#textMsgTime").timepicker({
				        'minTime': '00:00am', // 조회하고자 할 시작 시간 ( 00:15분 부터 선택 가능하다. )
				        'maxTime': '23:45pm', // 조회하고자 할 종료 시간 ( 20시 까지 선택 가능하다. )
				        'timeFormat': 'H:i',
				        'step': 15 // 30분 단위로 지정. ( 10을 넣으면 10분 단위 )
				    });   
                }
        		
        		if(tData.templete_type == "1008" || tData.templete_type == "1009"){
        			$("#templete_id").val(setData.templete_id_display);
        			if(tData.kakao_img_url != undefined) $("#img_url").val(tData.kakao_img_url);
                	if(tData.kakao_img_link != undefined) $("#img_link_url").val(tData.kakao_img_link);
        		}
        		
        		if(tData.tmp_book_yn == "Y"){
        			$("#bookYn").prop("checked", true);
        			$("#searchSdate").val(tData.date_client_req.substring(0,10));
        			$("input[name=start_time]").val(tData.date_client_req.substring(11,16));
        		}
        		
        		if(tData.adsend_yn == "Y"){
        			$("#nightYn").prop("checked", true);
        		}
        		
        		if (tData.adFrontFlag == "Y") {
		    		$("#fPhraseYN").prop("checked", true);
		    	} else if (tData.adFrontFlag == "N") {
					$("#fPhraseYN").prop("checked", false);
				}
		    	
		    	if (tData.adEndFlag == "Y") {
		    		$("#ePhraseYN").prop("checked", true);
		    	} else if (tData.adEndFlag == "N") {
					$("#ePhraseYN").prop("checked", false);
				}
        		
        		if(tData.t_file != null && tData.t_file != undefined ){
        			fileByteS = tData.t_file[0];
        			
        			var fileExt = fileByteS.file_name.split(".");//파일 확장자
	        		var data = "data:image/" + fileExt[fileExt.length-1] + ";base64," + fileByteS.file_content;
        			
        			$("#imgSc").off("click");
		            $("#imgSc").on("click",function(){
		        		var data2 = data;
		        		var w = window.open('about:blank');
		        		var image = new Image();
		        		image.src = data2;
		        		setTimeout(function(){
		        			w.document.write(image.outerHTML);
		        		}, 0);
		        	});
		            
		            $("#imgSc").prop("src",data);
		            $("#sampSc").prop("src",data);
		            $("#imgSc").show();
		            $("#sampSc").show();
		            
        			$("#fileSeq").val(fileByteS.file_seq);
        			
        			$("#fileNameDis").html(fileByteS.file_name);
        			$("#delBtn").show();
        		}else{
        			fileByteS = null;
        		}
        		
        		if(tData.t_kakao != undefined && tData.t_kakao != null){
        			var tKakao = tData.t_kakao;
        			$.each(tKakao, function(index, inArgument){
        				var btnListHtml = "";
        				var btnListAreaHtml = "";
        				
        				if(inArgument.kakao_btn_type == 'WL' || inArgument.kakao_btn_type == 'AL') {
        				
	        				//치환된 Link값 변수명 형태로 원복
	        				var linkA = inArgument.kakao_btn_link_1+"";
	        				var linkArrayA = linkA.split('{{').slice(1);
	        				var exString = "";
	        				for (var i=0; i<linkArrayA.length; i++) {
								exString = linkArrayA[i].split('}}')[0];
	        					linkA = linkA.replaceAll('{{'+linkArrayA[i].slice(0,linkArrayA[i].lastIndexOf('}}')+2),'#{'+exString.slice(linkArrayA[i].indexOf('.',linkArrayA[i].indexOf('.')+1)+1)+'}');
	        				}
	        				
	        				if (!inArgument.kakao_btn_link_2) {	// pcLink의 경우 null값일 경우가 있을 수 있음
		        				var linkB = "";
	        				} else {
	        					var linkB = inArgument.kakao_btn_link_2+"";
		        				var linkArrayB = linkB.split('{{').slice(1);
		        				for (var i=0; i<linkArrayB.length; i++) {
									exString = linkArrayB[i].split('}}')[0];
        							linkB = linkB.replaceAll('{{'+linkArrayB[i].slice(0,linkArrayB[i].lastIndexOf('}}')+2),'#{'+exString.slice(linkArrayB[i].indexOf('.',linkArrayB[i].indexOf('.')+1)+1)+'}');
	        					}
	        				}
	        				
	        				if(inArgument.kakao_btn_type == 'WL') {
		        				btnListHtml += "<tr style='background:#efefef;'>";
		        				btnListHtml += "	<th rowspan='2'>웹링크: <input type='hidden' id='addBtnType' name='addBtnType' value='WL' /></th>";
		        				btnListHtml += "	<td rowspan='2'><input type='text' id='buttonNmWl' name='jsonName' style='width:80px;' placeholder='(최대 28자)' maxlength='28'/ onfocusout='getMsgJsonButton();' value='"+ inArgument.kakao_btn_name +"'"+ "disabled='disabled'" + "></td>";
		        				btnListHtml += "	<td style='font-size:12px;'><input type='text' id='mUrlWl' name='jsonMobile' style='width:150px;' placeholder='Mobile(필수)' maxlength='200' onfocusout='getMsgJsonButton();' " + "disabled='disabled'" + " value='"+ (inArgument.kakao_btn_link_1 == "null" ? "" : linkA )  +"'/></td>";
		        				btnListHtml += "</tr>";
		        				btnListHtml += "<tr style='background:#efefef;'>";
		        				btnListHtml += "	<td style='font-size:12px;'><input type='text' id='pUrlWl' name='jsonPC' style='width:150px;' placeholder='PC(선택)' maxlength='200' onfocusout='getMsgJsonButton();' " + "disabled='disabled'" + "  value='"+ (inArgument.kakao_btn_link_2 == "null" ? "" : linkB ) +"'/></td>";
		        				btnListHtml += "</tr>";
		        				
		        				btnListAreaHtml += "<div  class='Tbtbox' >웹링크</div>";
	        				}
	        				
	        				if(inArgument.kakao_btn_type == 'AL') {
		        				btnListHtml += "<tr style='background:#efefef;'>";
		        				btnListHtml += "	<th rowspan='2'>앱링크: <input type='hidden' id='addBtnType' name='addBtnType' value='AL' /></th>";
		        				btnListHtml += "	<td rowspan='2'><input type='text' id='buttonNmAl' name='jsonName' style='width:80px;' placeholder='(최대 28자)' maxlength='28'/ onfocusout='getMsgJsonButton();' value='"+ inArgument.kakao_btn_name +"'"+ "disabled='disabled'" + "></td>";
		        				btnListHtml += "	<td style='font-size:12px;'><input type='text' id='aUrlAl' name='jsonAndroid' style='width:150px;' placeholder='Android(필수)' maxlength='200' onfocusout='getMsgJsonButton();' " + "disabled='disabled'" + " value='"+ (inArgument.kakao_btn_link_1 == "null" ? "" : linkA )  +"'/></td>";
		        				btnListHtml += "</tr>";
		        				btnListHtml += "<tr style='background:#efefef;'>";
		        				btnListHtml += "	<td style='font-size:12px;'><input type='text' id='iUrlAl' name='jsonIOS' style='width:150px;' placeholder='IOS(필수)' maxlength='200' onfocusout='getMsgJsonButton();' " + "disabled='disabled'" + "  value='"+ (inArgument.kakao_btn_link_2 == "null" ? "" : linkB ) +"'/></td>";
		        				btnListHtml += "</tr>";
		        				
		        				btnListAreaHtml += "<div  class='Tbtbox' >앱링크</div>";
	        				}
        				}
        				
        				if (inArgument.kakao_btn_type == 'DS') {
							btnListHtml += "<tr style='background:#efefef;'>";
							btnListHtml += "	<th>배송조회<input type='hidden' id='addBtnType' name='addBtnType' value='DS' /></th>";
							btnListHtml += "	<td><input type='text' id='buttonNmDs' name='jsonName' style='width:80px;' placeholder='(최대 28자)' maxlength='28'/ onfocusout='getMsgJsonButton();' value='"+ inArgument.kakao_btn_name +"'"+ "disabled='disabled'" + "></td>";
							btnListHtml += "	<td style='font-size:12px;'>* 알림톡 메시지 파싱을 통해 각 택배사에서 제공하는 배송 조회 페이지로 이동합니다.</td>";
							btnListHtml += "</tr>";
        				}
        				
        				$("#btnList").append(btnListHtml);
        				$("#btnListArea").append(btnListAreaHtml);
        				
        				var btnTitWrapHtml = "";
        				btnTitWrapHtml += "<tr>";
        				btnTitWrapHtml += "	<th>버튼타입</th>";
        				btnTitWrapHtml += "	<th>버튼이름</th>";
        				btnTitWrapHtml += "	<th colspan='2'>버튼링크</th>";
        				btnTitWrapHtml += "</tr>";
        				
        				$("#btnTitWrap").html(btnTitWrapHtml);
        			});
        			$("#kakaoBtnJ").val(JSON.stringify(tKakao));
        		}
	            
        		$("#saveUserInfo").val(JSON.stringify(savedUserInfoJO));
        		
        	}
        	
        	chkLen();
        }else{
    		loadMsgForm();
    	}
        //setUserData(userInfo);
        //$("#allPayload").html(JSON.stringify(payload));
	}
   
    function save() {
    	console.log("save 실행");
    	
        var arrObj = new Array();
		var jObj = new Object();
		
		
		//화면 
        jObj.msgType = $("#msgType").val();
        /*jObj.fileName = $("#fileName").val();
        jObj.fileByteS = $("#fileByteS").val();*/
		
		//DE 필드
        jObj.subkey = "{{Event."+eventDefinitionKey+".Subkey}}";
        jObj.phone = "{{Event."+eventDefinitionKey+".Phone}}";
        jObj.name = "{{Event."+eventDefinitionKey+".Name}}";
        jObj.date = "{{Event."+eventDefinitionKey+".Date}}";
        jObj.send_date = "{{Event."+eventDefinitionKey+".Send_Date}}";
        jObj.mobilephone = "{{Event."+eventDefinitionKey+".mobilephone}}";
        jObj.longUrl = "{{Event."+eventDefinitionKey+".longUrl}}";
        
        jObj.testYn = "{{Event."+eventDefinitionKey+".TestYn}}";//테스트 유무 필드
        
		jObj.dataExtensionObj = dataExtensionObj;
        jObj.personalFieldArr = personalFieldArr;
        
        //t_data 객체
        var tDataObj = new Object();
        
        tDataObj.mber_no = userOrg.mber_no;
        tDataObj.org_id = userOrg.org_id;
        tDataObj.content = $("#msg").val();
        tDataObj.subject = $("#subject").val();
        tDataObj.callback = $("#sender").val();
        tDataObj.priority = "S";
        
        var fullDateTime = getTimeStamp();
        
        //예약 여부
        if($("#bookYn").is(":checked")){
        	tDataObj.tmp_book_yn = "Y";
        	tDataObj.date_client_req = $("#searchSdate").val() + " " + $("input[name=start_time]").val() + ":00";
        }else{
        	tDataObj.tmp_book_yn = "N";
        	tDataObj.date_client_req = fullDateTime;
        }
        
    	if($("#nightYn").is(":checked") && $("#advYn1").is(":checked")) {
    		tDataObj.adsend_yn = "Y";
    	}
    	
    	if($("#fPhraseYN").is(":checked")) {
    		tDataObj.adFrontFlag = "Y";
    	} else {
			tDataObj.adFrontFlag = "N";
		}
    	
    	if($("#ePhraseYN").is(":checked")) {
    		tDataObj.adEndFlag = "Y";
    	} else {
			tDataObj.adEndFlag = "N";
		}
		
        if($("#advYn1").is(":checked") == true){
        	tDataObj.msg_cl_type = "1";//광고성
        	tDataObj.ars_080_num = $("#rejectnum").val();
        }else{
        	tDataObj.msg_cl_type = "2";//정보성
        }
        
        if($("#msgType").val() == "KKF"){// SMS : 0, MMS : 2, LMS : 3, 알림톡 : 1008, 친구톡 : 1009    = templete_type
        	tDataObj.templete_type = "1009";
        }else if($("#msgType").val() == "KKO"){
        	tDataObj.templete_type = "1008";
        }else{
        	//smsTitle/lmsTitle/mmsTitle    	//$("#mmsTitle").attr("class");
        	if($("#msgType").val() == "SMS" || $("#smsTitle").attr("class") == "on") tDataObj.templete_type = "0";
        	if($("#msgType").val() == "LMS" || $("#lmsTitle").attr("class") == "on") tDataObj.templete_type = "3";
        	if($("#msgType").val() == "MMS" || $("#mmsTitle").attr("class") == "on") tDataObj.templete_type = "2";
        }
        
        if(tDataObj.templete_type == "1008"){// 알림톡 데이터 세팅
        	tDataObj.msg_cl_type = "2"
        	if($("#kakaoBtnJ").val() != ""){
        		var oldObj = JSON.parse($("#kakaoBtnJ").val());
        		if(oldObj[0].kakao_btn_type == null){
        			tDataObj.t_kakao = fnChgBtnKeyName(oldObj);
        		}else{
        			tDataObj.t_kakao = oldObj;
        		}
	        	//Link를 Key형태로 치환
	        	changBtnLinkToKey(tDataObj.t_kakao);
        	}
	        
        	jObj.templete_id_display = $("#templete_id").val();
        	tDataObj.templete_id = $("#templete_id").val();
        }else if(tDataObj.templete_type == "1009"){// 친구톡 데이터 세팅
            tDataObj.msg_cl_type = "1";//광고성
        	tDataObj.ars_080_num = $("#rejectnum").val();
        	if($("#kakaoBtnJ").val() != ""){
        		var oldObj = JSON.parse($("#kakaoBtnJ").val());
        		if(oldObj[0].kakao_btn_type == null){
        			tDataObj.t_kakao = fnChgBtnKeyName(oldObj);
        		}else{
        			tDataObj.t_kakao = oldObj;
        		}
	        	//Link를 Key형태로 치환
	        	changBtnLinkToKey(tDataObj.t_kakao);
        	}
        	
        	jObj.templete_id_display = $("#templete_id").val();
        	tDataObj.templete_id = $("#templete_id").val();
        	if($("#img_url").val() != "") tDataObj.kakao_img_url = $("#img_url").val();
        	if($("#img_link_url").val() != "") tDataObj.kakao_img_link = $("#img_link_url").val();
        }else if(tDataObj.templete_type == "0"){//SMS
        	
        }else if(tDataObj.templete_type == "2"){//MMS
        	var t_file = new Array();
			var fileData = new Object();
			
			fileData.file_status = "FILE";
			fileData.file_content = fileByteS.file_content;
			fileData.file_name = fileByteS.file_name;
			fileData.file_size = fileByteS.file_size;
			fileData.file_seq = $("#fileSeq").val();
			
			t_file.push(fileData);
			tDataObj.t_file = t_file;
        	
        }else if(tDataObj.templete_type == "3"){//LMS
        	
        }
        
        //group_id 생성
        var payload_name = payload['name']; // ca화면 이름
        //var payload_id = payload['id']; // ca화면 ID
        //화면 이름 공백시 기본값 설정
        if ( payload_name === "" ){
        	payload_name ="Notiforce-prod";
        }
        
        console.log(payload_name);
        //console.log(payload_id);
        
        //var groupId = jnSettings_name + '&' + jnVersion + '&' + payload_name + '&' + payload_id + "&{{Activity.Id}}";//조니 이름 /조니버전/ ca 화면 이름/ca id        //  noti_group_id
        var groupId = jnSettings_name + '&' + jnVersion + '&' + payload_name + "&{{Activity.Id}}";//조니 이름 /조니버전/ ca 화면 이름/ca id        //  noti_group_id
        var messageId = groupId + '&' + '{{Contact.Key}}'; //  noti_id
        //END: group_id 생성
        
        //t_per 세팅
        var t_perArr = new Array();
		var t_perObj = new Object();
		t_perObj.recipient_num = jObj.mobilephone;
		t_perObj.noti_id = messageId;
		
		t_perArr.push(t_perObj);
		tDataObj.t_per = t_perArr;
        
		
		tDataObj.noti_group_id = groupId;
        
        jObj.t_data = tDataObj;
        //END t_data 객체
        
        arrObj.push(jObj);
        payload['arguments'].execute.inArguments = arrObj;
        
        
        payload['metaData'].isConfigured = true;
        
        connection.trigger('updateActivity', payload);
    }
    
    function changBtnLinkToKey(objArr) {
		var personalFieldStr = "";
        var dataExtensionObjStr = "";
        var linkA = "";
        var linkB = "";
        for (var i=0; i<personalFieldArr.length; i++) {
        	personalFieldStr = "#{" + personalFieldArr[i] + "}";
        	dataExtensionObjStr = dataExtensionObj[personalFieldArr[i]];
        	for (var j=0; j<objArr.length; j++) {
        		linkA = objArr[j].kakao_btn_link_1 + "";
        		linkB = objArr[j].kakao_btn_link_2 + "";
        		linkA = linkA.replaceAll(personalFieldStr, dataExtensionObjStr);
        		linkB = linkB.replaceAll(personalFieldStr, dataExtensionObjStr);
        		objArr[j].kakao_btn_link_1 = linkA;
        		objArr[j].kakao_btn_link_2 = linkB;
        	}
        }
    }

    function getMessage() {
        return $('#msg').val();
    }
    
    function fnChgBtnKeyName(jData) {
    	var arrObj = new Array();
    	
    	$.each(jData, function(index, inArgument){
    		var tmpObj = new Object();
    		
    		var kakao_btn_type = inArgument.type;
        	var kakao_btn_name = inArgument.name;
        	if (kakao_btn_type == 'WL') {
	        	var kakao_btn_link_1 = inArgument.url_mobile;
	        	var kakao_btn_link_2 = inArgument.url_pc;
        	} else if (kakao_btn_type == 'AL') {
        		var kakao_btn_link_1 = inArgument.scheme_android;
	        	var kakao_btn_link_2 = inArgument.scheme_ios;
        	}
        	
        	tmpObj.kakao_btn_type = kakao_btn_type;
        	tmpObj.kakao_btn_name = kakao_btn_name;
        	tmpObj.kakao_btn_link_1 = kakao_btn_link_1;
        	tmpObj.kakao_btn_link_2 = kakao_btn_link_2;
        	
        	arrObj.push(tmpObj);
    	});
    	
    	return arrObj;
    	
	}
    
    
    function getTimeStamp() {
    	  var d = new Date();
    	  var s =
    	    leadingZeros(d.getFullYear(), 4) + '-' +
    	    leadingZeros(d.getMonth() + 1, 2) + '-' +
    	    leadingZeros(d.getDate(), 2) + ' ' +

    	    leadingZeros(d.getHours(), 2) + ':' +
    	    leadingZeros(d.getMinutes(), 2) + ':' +
    	    leadingZeros(d.getSeconds(), 2);

    	  return s;
    }

    function leadingZeros(n, digits) {
		var zero = '';
		n = n.toString();

		if (n.length < digits) {
			for (var i = 0; i < digits - n.length; i++)
				zero += '0';
		}
		return zero + n;
	}

});