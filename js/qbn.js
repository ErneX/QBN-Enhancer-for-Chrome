var spam_button = '<a class="pbutton block" id="report_spam" href="#""><span>Report Spam</span></a>';
var current_post = '';
var current_opened_post = '';
var posting = false;

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
