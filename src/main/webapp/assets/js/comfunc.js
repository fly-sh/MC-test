// 페이지 공통 스크립트 처리

// 레이어 팝업
function showAlertLayer(msg){
	$("#alertMsg").html(msg);
	$("#popAlertLayer").show();
}

// 알림함 목록 조회 처리
function chkNewNote(){
	//console.log("call chkNewNote !!");
	var dataString = "";
	var strNote = "";
	$.ajax({
		url: "/note"+"?d="+new Date().getTime(),
		type: "get",
		data: dataString,
		error: function(xhr, status, e) {
			if (xhr.status == 500) {
				console.log("chkNewNote error 500");
			} else {
				console.log("chkNewNote error");
			}
		},
		beforeSubmit: function() {
		},
		success: function(data) {
			if(data.result.code == "C200"){
				strNote = "";
				//console.log(data);
				
				if(data.notes){					
					if(data.notesCnt > 0){
						$("#comAlarmCnt").html(data.notesCnt);
						$("#comAlarmCnt").show();
						
						for(var i=0; i<data.notes.length; i++){
							//console.log("> "+data.notes[i].strIdx);
							if(data.notes[i].alarm_type == "M"){	// 계정 승인
								strNote += "<li>";
								strNote += "<div class='L_text' onclick='approv_member()'>"+data.notes[i].msg+"</div>";
								strNote += "<img src='/assets/images/pop_closeBtn.png' class='closeBt' onclick=\"readAlarm(\'"+data.notes[i].strIdx+"\')\" />";
								strNote += "</li>";
							}else{									// 캠페인 승인. 캠페인번호가 필요하다면 data.notes[i].serialnum
								strNote += "<li>";
								strNote += "<div class='L_text' onclick='approv_campaign()'>"+data.notes[i].msg+"</div>";
								strNote += "<img src='/assets/images/pop_closeBtn.png' class='closeBt' onclick=\"readAlarm(\'"+data.notes[i].strIdx+"\')\" />";
								strNote += "</li>";							
							}
						}						
					}else{
						$("#comAlarmCnt").html("0");
						$("#comAlarmCnt").hide();
						
						//console.log("not found data notes .");
						strNote += "<li>";
						strNote += "<div class='L_text'>읽지 않은 게시물이 없습니다. </div>";					
						strNote += "</li>";	
					}  
					
					$("#comAlarmBody").html(strNote);
				}				
				
			}else if(data.result.code == "C4033"){		// 로그인 안됨
				location.href="/";
			}else{
				console.log("Error : "+data.result.code);
			}
			
			$("#alarmBody").html(strNote);
		}
	});	
}

// 알림 내용 읽음 처리
function readAlarm(num){
	var dataString = "";
	$.ajax({
		url: "/note/read/"+num,
		type: "get",
		data: dataString,
		timeout: 15000,
		tryCount: 0,
		retryLimit: 3,
		error: function(xhr, status, e) {
			if (xhr.status == 500) {
				console.log("readAlarm error 500");
			} else {
				this.tryCount++;

				if (this.tryCount <= this.retryLimit) {
					$.ajax(this);
				} else {
					console.log("readAlarm error");
				}
			}
		},
		beforeSubmit: function() {
		},
		success: function(data) {
			//console.log(data);
			if(data.result.code == "C200"){
				//console.log("result code : "+data.result.code);
				chkNewNote(); // 다시 로드
			}else{
				//console.log("에러입니다.");
				console.log(data.result.message);
			}
			
		}
	});	
}

$(function() {
	// ie readonly cursor remove
	$('input[readonly]').on("focus", function() {
	    this.blur();
	});
});

