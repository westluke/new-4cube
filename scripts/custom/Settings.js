var Settings = new Object();

Settings.displayPoints = function() {
	$(".gui-container").css("display", "none");
	$("#points-edit").css("display", "block")
}

Settings.returnToSettings = function() {
	$(".gui-container").css("display", "block")
	$("#points-edit").css("display", "none");
}
