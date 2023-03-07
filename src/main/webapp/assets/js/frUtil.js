if (window.console == undefined) {console = {log : function(){}};}

var _submitLock = false;
var _inApp = false;

$(function()
{
	$('.onlyNumber').keyup(function ()
    {
		this.value = this.value.replace(/[^0-9,\.]/g,'');
	});
	$(".rollover").mouseover(function()
	{
		$(this).attr("out-img", $(this).attr("src"));
		$(this).attr("src", $(this).attr("over-img"));
	}).mouseout(function()
	{
		$(this).attr("src", $(this).attr("out-img"));
	});
	try
	{
		var standalone = window.navigator.standalone,
	    userAgent = window.navigator.userAgent.toLowerCase(),
	    safari = /safari/.test( userAgent ),
	    ios = /iphone|ipod|ipad/.test( userAgent );
		if( ios )
		{
		    if ( !standalone && safari )
		    {
		    		_inApp = false;
		        //browser
		    } else if ( standalone && !safari )
		    {
		    		_inApp = true;
		        //standalone
		    } else if ( !standalone && !safari )
		    {
		    		_inApp = true;
		    		//alert("uiwebview!");
		        //uiwebview
		    };
		} else
		{
			if (HTTP_X_REQUESTED_WITH.indexOf('com.kakao.talk') > -1)
			{
				_inApp = true;
			}else
			{
				_inApp = false;
			}
			/*
		    var ua = navigator.userAgent;
			var is_native_android = ((ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('Android ') > -1 && ua.indexOf('AppleWebKit') > -1) && (ua.indexOf('Version') > -1));
			if (is_native_android)
			{
				//alert("android inApp!");
				_inApp = true;
			}else
			{
				//alert("android browser!");
				_inApp = false;
			}*/
		};		
	}catch(e)
	{
		//alert(e);
	}
});

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return "";
    }
    else{
       return results[1] || 0;
    }
};

/**
 * 이미지 프리로드
preload(["one.jpg", "two.png", "three.png"], function() {
     //Code here is called once all files are loaded.
});
*/
function preload(files, cb)
{
	try
	{
	    var len = files.length;
	    $($.map(files, function(f)
	    {
	    		//console.log('<img src="'+f+'" />');
	        return '<img src="'+f+'" />';
	    }).join('')).load(function ()
	    {
	        if(--len===0) {
	            cb();
	        }
	    });
	}catch(e){}
}

jQuery.preloadImages=function(arrayOfImages){
    jQuery.each(arrayOfImages,function(){
        jQuery.preloadImage(this);
    });
};

function setCookie(cname, cvalue, exdays)
{	
	
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    //document.cookie = cname + "=" + escape(cvalue) + ";domain=www.merrellkorea.co.kr;path=/;" + expires;
    document.cookie = cname + "=" + escape(cvalue) + ";" + expires;
    //alert(cname+':'+getCookie(cname));
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return unescape(c.substring(name.length, c.length));
    }
    return "";
}
function deleteCookie(cname)
{
	document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.cookie = cname + '=;domain=.www.commandevent.net;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.cookie = cname + '=;domain=www.commandevent.net;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.cookie = cname + '=;domain=.commandevent.net;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function Storage(_mode, _name, _value)
{
	var _returnVal = null;
	if (_mode == 'set')
	{
		setCookie(_name, _value, 10);
		try
		{
			localStorage.setItem(_name, _value);
		}catch(e){}
	}else if (_mode == 'get')
	{
		
		try
		{
			localStorage.setItem('test', 'test');
			_returnVal = localStorage.getItem(_name);
		}catch(e)
		{
			console.log('err');
			_returnVal = getCookie(_name);
			if (_returnVal == '') _returnVal = null;
		}
	}else if (_mode == 'remove')
	{
		try
		{
			deleteCookie(_name);
			localStorage.removeItem(_name);
		}catch(e)
		{
		}
	}
	return _returnVal;
}



var sxsw =
{
	full_bleed: function(boxWidth, boxHeight, imgWidth, imgHeight)
	{
		// Calculate new height and width…
		var initW = imgWidth;
		var initH = imgHeight;
		var ratio = initH / initW;
		imgWidth = boxWidth;
		imgHeight = boxWidth * ratio;
		// If the video is not the right height, then make it so…
		if(imgHeight < boxHeight)
		{
			imgHeight = boxHeight;
			imgWidth = imgHeight / ratio;
		}
		//  Return new size for video
		return{
			width: imgWidth,
			height: imgHeight
		};
	},
	init: function()
	{
		var browserHeight = Math.round(jQuery(window).height());
		var browserWidth = Math.round(jQuery(window).width());
		var videoHeight = $('#videoBg').height();
		var videoWidth = $('#videoBg').width();
		
		var new_size = sxsw.full_bleed(browserWidth, browserHeight, videoWidth, videoHeight);
		$('#videoBg').width(new_size.width).height(new_size.height);
		$('#videoBg').css("width", new_size.width+"px");
		$('#videoBg').css("height", new_size.height+"px");
		
		if (browserHeight < new_size.height)
		{
			$('#videoBg').css("top", -Math.round((new_size.height-browserHeight)/2)+"px");
		}else
		{
			$('#videoBg').css("top", "0px");
		}
		if (browserWidth < new_size.width)
		{
			$('#videoBg').css("left", -Math.round((new_size.width-browserWidth)/2)+"px");
		}else
		{
			$('#videoBg').css("left", "0px");
		}
	}
};

function setVideoStretch(_stretchVideoId, videoWidth, videoHeight, headerMargin)
{
	/**
	 * video strech
	 */
	var browserWidth = Math.round($(window).width());
	var browserHeight = Math.round($(window).height())-headerMargin;
	// var videoHeight = $('#mainYoutube1').height();
	// var videoWidth = $('#mainYoutube1').width();
	// var videoWidth = 853;
	// var videoHeight = 480;
	//var _stretchVideoId = '#mainYoutube1';
	
	var new_size = sxsw.full_bleed(browserWidth, browserHeight, videoWidth, videoHeight);
	$(_stretchVideoId).width(new_size.width).height(new_size.height);
	$(_stretchVideoId).css("width", new_size.width+"px");
	$(_stretchVideoId).css("height", new_size.height+"px");
	
	if (browserHeight < new_size.height)
	{
		$(_stretchVideoId).css("top", -Math.round((new_size.height-browserHeight)/2)+"px");
	}else
	{
		$(_stretchVideoId).css("top", "0px");
	}
	if (browserWidth < new_size.width)
	{
		$(_stretchVideoId).css("left", -Math.round((new_size.width-browserWidth)/2)+"px");
	}else
	{
		$(_stretchVideoId).css("left", "0px");
	}
}
function setVideoStretchBottom(_stretchVideoId, videoWidth, videoHeight, headerMargin)
{
	/**
	 * video strech
	 */
	var browserWidth = Math.round($(window).width());
	var browserHeight = Math.round($(window).height())-headerMargin;
	// var videoHeight = $('#mainYoutube1').height();
	// var videoWidth = $('#mainYoutube1').width();
	// var videoWidth = 853;
	// var videoHeight = 480;
	//var _stretchVideoId = '#mainYoutube1';
	
	var new_size = sxsw.full_bleed(browserWidth, browserHeight, videoWidth, videoHeight);
	$(_stretchVideoId).width(new_size.width).height(new_size.height);
	$(_stretchVideoId).css("width", new_size.width+"px");
	$(_stretchVideoId).css("height", new_size.height+"px");
	
	if (browserHeight < new_size.height)
	{
		//$(_stretchVideoId).css("top", -Math.round((new_size.height-browserHeight)/2)+"px");
		$(_stretchVideoId).css("top", -Math.round((new_size.height-browserHeight)*0.7)+"px");
	}else
	{
		$(_stretchVideoId).css("top", "0px");
	}
	if (browserWidth < new_size.width)
	{
		$(_stretchVideoId).css("left", -Math.round((new_size.width-browserWidth)/2)+"px");
	}else
	{
		$(_stretchVideoId).css("left", "0px");
	}
}
function setSelRange(inputEl, selStart, selEnd)
{ 
   if (inputEl.setSelectionRange) { 
     inputEl.focus(); 
     inputEl.setSelectionRange(selStart, selEnd); 
   } else if (inputEl.createTextRange) { 
     var range = inputEl.createTextRange(); 
     range.collapse(true); 
     range.moveEnd('character', selEnd); 
     range.moveStart('character', selStart); 
     range.select(); 
   } 
}
function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function cloneSO(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = cloneSO(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = cloneSO(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
