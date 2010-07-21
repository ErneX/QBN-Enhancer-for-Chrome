var spam_button = '<a class="pbutton block" id="report_spam" href="#""><span>Report Spam</span></a>';

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
	
}
