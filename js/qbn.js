var spam_button = '<a class="pbutton block" id="report_spam" href="#""><span>Report Spam</span></a>';
var current_post = '';
var current_opened_post = '';
var posting = false;

if ($("#comment_list").length > 0) {

	chrome.extension.sendRequest({name: "getPreferences"},
	     function(response)
	     {
	        if (response.qbnShowImages == "false") {
						$("#comment_list li dl img").css("display","none"); //hide all images
						//turn images into links
						$("#comment_list li dl div.imgsizer").each(function(index) {
							url = $(this).find("img").attr("src");
							url_text = (url.length > 70) ? url.substring(0,70) + "…" : url;
							$(this).replaceWith('<a title="' + url + '" href="' + url + '" target="_blank">' + url_text + '</a><br />');
						});		
					}
					if (response.qbnShowVideos == "false") {
						$("#comment_list li dl object").css("display","none"); //hide all videos
						//turn videos into links
						$("#comment_list li dl p object").each(function(index) {
							url = $(this).children(0).attr("value");
							$(this).parent().replaceWith('<a title="' + url + '" href="' + url + '" target="_blank">' + url + '</a><br />');
						});						
					}
					if (JSON.parse(response.qbnIgnoreList).length > 0) {
						//ignore users
						elems = $("#comment_list ul li dl dt a").filter(function(index) {
							ignorelist = JSON.parse(response.qbnIgnoreList);
							for (i=0;i<ignorelist.length;i++) {
								var filter = new RegExp("^" + ignorelist[i] + "$");
								if (filter.test($(this).text())) {
									return $(this);
								}
							}
						});
						elems.each(function(index) {
							$(this).parent().parent().find("dd.comment_notes").css("display","none");
							$(this).parent().parent().css("display","none");
							$(this).parent().parent().before('<div class="ignored"><span class="ignore_info">ignored comment by <strong>' + $(this).html() + '</strong></span></div>');
						});
						$("div.ignored").each(function(index){
							$(this).bind('click',function() {
								$(this).next("dl").css("display","block");
								$(this).next("dl").find(".comment_notes").css("display","block");
								$(this).remove();
							});
						});
					}
			}
	);
}

if ($("#pv_summary").length > 0) {
	var pathname = window.location.pathname;
	if (!$(document).getUrlParam("page") && $("p#login_area").html().indexOf("Welcome,") >= 0) {
		chrome.extension.sendRequest({}, function(response) {});
		$("#pv_summary p").next().append(spam_button);
		$("#report_spam").attr("href","http://www.qbn.com/topics/577886/?spam_url=" + pathname + "&spam_user=" + $("#main_content #comment_list ul li dl dt a").html());
	}

	if ($(document).getUrlParam("spam_url")) {
		$("#id_text").attr("value","The user:\nhttp://www.qbn.com/" + $(document).getUrlParam("spam_user") + "/\n\nHas posted spam in the thread:\nhttp://www.qbn.com" + $(document).getUrlParam("spam_url"));
		$("#id_text").focus();
		$("#id_text").effect("pulsate", { times:3 }, 450);
	}
	
	$("li.reply").hover(
	  function () {
			current_post = $(this).attr("id");
			$("#add_note_bottom_" + current_post.substr(6)).find("img").click(function(){
				posting = true;
			});
			$("a.add_note_link").find("img").click(function(){
				posting = true;
			});
	  }, 
	  function () {
			current_post = '';
	  }
	);

	$('body').keypress(function(e) {
	  if (current_post != '' && e.keyCode == 114 && !posting) {
			$("a.note_cancel_link").click();
			$("a#add_note_bottom_" + current_post.substr(6)).click();
			if (current_post.substr(6) != current_opened_post && e.keyCode == 114) {
				$("#note_textarea_" + current_post.substr(6)).attr("value","");
				current_opened_post = current_post.substr(6);
				return false;
			}
		}
	});
	
	$("#id_text").focusin(function (){
		posting = true;
	});
	$("#id_text").focusout(function (){
		posting = false;
	});
	
}
