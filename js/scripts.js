function getParagraph() {
	return "<p>" + $("p:first", $("#ts")).html() + "</p>";
}

$(document).ready(function () {
	
	$(".ih").each(function () {
		$(this).unbind("click").bind("click", function () {
			$(".content").css("height", $(this).text());
			$("#ts").makeScroll();
			return false;
		});
	});
	
	$(".iw").each(function () {
		$(this).unbind("click").bind("click", function () {
			$("#ts")
				.html("<div class=\"ds\"><hr>start<hr>" + Array(parseInt($(this).text()) + 1).join(getParagraph()) + "<hr>end<hr></div>")
				.makeScroll();
			return false;
		});
	});
});