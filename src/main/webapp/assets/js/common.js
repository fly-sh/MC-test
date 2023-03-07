
/* lnb */
(function($){
  
  var lnbUI = {
    click : function (target, speed) {
      var _self = this,
          $target = $(target);
      _self.speed = speed || 300;
      
      $target.each(function(){
        if(findChildren($(this))) {
          return;
        }
        $(this).addClass('noDepth');
      });
      
      function findChildren(obj) {
        return obj.find('> ul').length > 0;
      }
      
      $target.on('click','a', function(e){
          e.stopPropagation();
          var $this = $(this),
              $depthTarget = $this.next(),
              $siblings = $this.parent().siblings();
        
        $this.parent('li').find('ul li').removeClass('on');
        $siblings.removeClass('on');
        $siblings.find('ul').slideUp(250);
        
        if($depthTarget.css('display') == 'none') {
          _self.activeOn($this);
          $depthTarget.slideDown(_self.speed);
        } else {
          $depthTarget.slideUp(_self.speed);
          _self.activeOff($this);
        }
        
      });
      
    },
    activeOff : function($target) {
      $target.parent().removeClass('on');
    },
    activeOn : function($target) {
      $target.parent().addClass('on');
    }
  };
  
  
  // Call lnbUI
  $(function(){
    lnbUI.click('#lnb li', 300)
  });
  
  
}(jQuery));




/*
 * Replace all SVG images with inline SVG
 */
$(function(){
    jQuery('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
    
        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');
    
            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }
    
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            
            // Check if the viewport is set, else we gonna set it if we can.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
            }
    
            // Replace image with new SVG
            $img.replaceWith($svg);
    
        }, 'xml');
    
    });
});



$(function() {
    $( "#testDatepicker" ).datepicker({
        showButtonPanel: true, 
         currentText: '오늘 날짜', 
         //closeText: '닫기', 
         dateFormat: "yy.mm.dd",
         dayNamesMin: ['월', '화', '수', '목', '금', '토', '일'], 
         monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
         monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
    });
});

$(function() {
    $( "#testDatepicker2" ).datepicker({
        showButtonPanel: true, 
         currentText: '오늘 날짜', 
         //closeText: '닫기', 
         dateFormat: "yy.mm.dd",
         dayNamesMin: ['월', '화', '수', '목', '금', '토', '일'], 
         monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
         monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
    });
});


$(document).ready(function() {
        // INPUT 박스에 들어간 ID값을 적어준다.
        $("#START_TIME,#END_TIME").timepicker({
            'minTime': '09:00am', // 조회하고자 할 시작 시간 ( 09시 부터 선택 가능하다. )
            'maxTime': '24:00pm', // 조회하고자 할 종료 시간 ( 20시 까지 선택 가능하다. )
            'timeFormat': 'H:i',
            'step': 30 // 30분 단위로 지정. ( 10을 넣으면 10분 단위 )
        });
        
        $(window).scroll(function(){
            $(".ui-timepicker-wrapper").hide();
        });
 
    });


$(document).ready(function(){
    
    $('ul.tabs > li').click(function(){
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#"+tab_id).addClass('current');
    });

});

$(document).ready(function(){
    
    $('ul.tabs2 > li').click(function(){
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs2 li').removeClass('current');
        $('.tab-content2').removeClass('current');

        $(this).addClass('current');
        $("#"+tab_id).addClass('current');
    });

});

$(document).ready(function(){
    
    $('ul.tabs3 > li').click(function(){
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs3 li').removeClass('current');
        $('.tab-content3').removeClass('current');

        $(this).addClass('current');
        $("#"+tab_id).addClass('current');
    });

});


$(document).ready(function(){
	
	$('.modal .pop_close').click(function(){
		$('.modal').hide();
		$('.modal-bg').hide();
	});
	
});




function openPop(_id){
    
    $('#'+_id).show();
    //$('html,body').css('overflow','hidden');
}

function closePop(_id){
    
    $('#'+_id).hide();
    $('html,body').css('overflow','auto');
    return false;
    
}

function alertModal(msg) {
	
	$("#alText").html(msg);
	$(".Al").show();
	$(".modal-bg").show();
}




   jQuery(function() {
   window.setTimeout(function() {
      jQuery('.Art_Box').addClass('tran');
   }, 400);
   });



//   $(function () {
//	    //사용 예시 **************************
//	    $(document).on("click", "#confirm", function () {
//	        action_popup.confirm("hello world confirm test !!!", function (res) {
//	            if (res) {
//	                action_popup.alert("확인창을 눌렀습니다.");
//	            }
//	        })
//	    });
//
//	    $(document).on("click", "#alert", function () {
//	        action_popup.alert("경고창 테스트!!!");
//	    });
//
//	    $(".modal_close").on("click", function () {
//	        action_popup.close(this);
//	    });
//	    //사용 예시 **************************
//	});


   var action_popup = {
		    timer: 0,
		    confirm: function (txt, callback) {
		        if (txt == null || txt.trim() == "") {
		            console.warn("confirm message is empty.");
		            return;
		        } else if (callback == null || typeof callback != 'function') {
		            console.warn("callback is null or not function.");
		            return;
		        } else {
		            $(".Del .pop_check").on("click", function () {
		                $(this).unbind("click");
		                callback(true);
		                action_popup.close(this);
		            });
		            this.open("Del", txt);
		        }
		    },

		    alert: function (txt, callback) {
		        if (txt == null || txt.trim() == "") {
		            console.warn("confirm message is empty.");
		            return;
		        } else {
		        	$(".Al .pop_close").on("click", function () {
		                $(this).unbind("click");
		                if(callback != null && callback != undefined)callback();
		                action_popup.close(this);
		            });
		            this.open("Al", txt);
		        }
		    },

		    load: function (callback) {
	        	$(".Lo .pop_close").on("click", function () {
	                $(this).unbind("click");
	                if(callback != null && callback != undefined)callback();
	                action_popup.close(this);
	            });
	            this.open("Lo", '');
		    },

		    open: function (type, txt) {
		        var popup = $("." + type);
		        //popup.find(".menu_msg").text(txt);
		        //$("body").append("<div class='dimLayer'></div>");
		        //$(".dimLayer").css('height', $(document).height()).attr("target", type);
		        //popup.fadeIn(this.timer);
		        if (type !== "Lo") {
		        	$("#alText").html(txt);
		        	$("#confText").html(txt);
		        }
		        popup.show();
		    	$(".modal-bg").show();
		    },

		    close: function (target) {
		        //var modal = $(target).closest(".modal-section");
		        //var dimLayer;
//		        if (modal.hasClass("type-confirm")) {
//		            dimLayer = $(".dimLayer[target=type-confirm]");
//		        } else if (modal.hasClass("type-alert")) {
//		            dimLayer = $(".dimLayer[target=type-alert]")
//		        } else {
//		            console.warn("close unknown target.")
//		            return;
//		        }
		    	$('.modal').hide();
				$('.modal-bg').hide();
		        //modal.fadeOut(this.timer);
//		        setTimeout(function () {
//		            dimLayer != null ? dimLayer.remove() : "";
//		        }, this.timer);
		    }
		}




