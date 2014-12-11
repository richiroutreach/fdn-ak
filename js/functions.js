/*
	Get a value for a given URL parameter
*/
function getURLParameter(name) {
     return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}


/*
	Scroll the viewport to a given anchor
	see: http://stackoverflow.com/questions/8579643/simple-jquery-scroll-to-anchor-up-or-down-the-page
*/
function scrollToAnchor(aid){
	var aTag = $("a[name='"+ aid +"']");
	$('html,body').animate({scrollTop: aTag.offset().top},'slow');
}


/*
	---------------------------------------------------------------
		Overlay labels on form elements
	---------------------------------------------------------------
*/

function checkContent(field) {
	var label = $("label[for='"+$(this).attr('id')+"']");

	var is_select = $(this).prop("selectedIndex");

	if( $(this).val() || is_select) {
		label.addClass("has-content");
	} else {
		label.removeClass("has-content");
	}
}

function overlayLabels(field) {
	$(field).focus(function() {
		var label = $("label[for='"+$(field).attr('id')+"']");

		label.addClass("focus");
	}).blur(function() {
		var label = $("label[for='"+$(field).attr('id')+"']");

		label.removeClass("focus");
	}).bind('keydown', function() {
		var label = $("label[for='"+$(field).attr('id')+"']");

		label.addClass("has-content");
	}).bind('dragenter', function() {
		label.addClass("has-content");
	}).bind('dragleave', function() {
		setTimeout(function() {
			checkContent(this);
		},1);
	}).bind('change', checkContent).bind('keyup', checkContent);
}