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

// Custom validation function because the default email validator
// isn't as strict as the default AK one. See actionkit.js for source.
jQuery.validator.addMethod('akemail', function(value, element) {
	var regex = !/^\s*\S+@\S+\.\S+\s*$/;
	return this.optional(element) || /^\s*\S+@\S+\.\S+\s*$/.test(value);
}, "Invalid email address.");

/*
	---------------------------------------------------------------
		Overlay labels on form elements
	---------------------------------------------------------------
*/

function checkContent(field) {
	var label = $("label[for='" + $(field).attr('id') + "']");

	var is_select = $(field).prop("selectedIndex");

	if( $(field).val() || is_select) {
		label.addClass("has-content");
	} else {
		label.removeClass("has-content");
	}
}

function overlayLabels(field) {
	var label = $("label[for='"+$(field).attr('id')+"']");

	$(field).not(
		'.has-overlay'
	).focus(function() {
		label.addClass('focus');

		checkContent(field);
	}).blur(function() {
		label.removeClass('focus');

		checkContent(field);
	}).bind('keydown', function() {
		label.addClass('has-content');
	}).bind('dragenter', function() {
		label.addClass('has-content');
	}).bind('dragleave', function() {
		setTimeout(function() {
			checkContent(field);
		}, 1)
	}).bind( 'change',
		checkContent(field)
	).bind( 'keyup', 
		checkContent(field)
	).on( 'input', function() {
		checkContent(field);
	}).addClass(
		'has-overlay'
	);

	// Hides labels when browser prefills due to "back" button
	checkContent(field);
}


/*
	---------------------------------------------------------------
		On-load Functions
	---------------------------------------------------------------
*/

$(document).ready(function() {
	// Overlay labels on forms where needed
	$('.overlay-form input[type="text"], .overlay-form select').each( function() { overlayLabels( $(this) ); });

	// Check our labels on load (solves browser autofill issues)
	window.setTimeout(function() {
		$('.overlay-form input[type="text"], .overlay-form select').each( function() { checkContent( $( this ) ); });
	}, 10);
});
