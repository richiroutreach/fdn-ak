/*
	---------------------------------------------------------------------------
		Helper functions
	---------------------------------------------------------------------------
*/

// Get a value for a given URL parameter
function getURLParameter(name) {
     return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}


// Scroll the viewport to a given anchor
// see: http://stackoverflow.com/questions/8579643/simple-jquery-scroll-to-anchor-up-or-down-the-page
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
	---------------------------------------------------------------------------
		Overlay labels on form elements
	---------------------------------------------------------------------------
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
	---------------------------------------------------------------------------
		On-load Functions
	---------------------------------------------------------------------------
*/

$(document).ready(function() {
	// Overlay labels on forms where needed
	$('.overlay-form input[type="text"], .overlay-form select').each( function() { overlayLabels( $(this) ); });

	// Check our labels on load (solves browser autofill issues)
	window.setTimeout(function() {
		$('.overlay-form input[type="text"], .overlay-form select').each( function() { checkContent( $( this ) ); });
	}, 10);

	// Ensure the form is valid before we submit it - this ensures AK validation won't trigger until we think it's valid
	$('#submit-button').click(function() {
		if( $('#act').valid() ) {
			$('#act').submit();
		}
	});
});


/*
	---------------------------------------------------------------------------
		Override AK Javascript
	---------------------------------------------------------------------------
*/
(function(ak, utils, forms) {

	/*
		-----------------------------------------------------------------------
			Override the Prefil function
		-----------------------------------------------------------------------
	*/	
	forms.prefill = function(overwrite) {
		var prefill_data = ( 
			( ak.context && ak.context.prefill_data ) ? ak.context.prefill_data : ak.args
		);

		$.each(prefill_data, function(field, value) {
			// Custom handling of amount (radio buttons)
			if( field == "amount" ) {
				$('#id_amount_' + value).prop('checked',true);

				$('#id_amount_' + value).parent('label').addClass('checked');
			
			// Amount other field needs some magic
			} else if( field == "amount_other" && value != "" ) {
				$('#amount_other_field').val(value);
				$('#amount_other_field').parent('label').addClass('checked');
			} else if ( field.indexOf("product") >= 0 ) {
				$('#' + field).click();
			// Select proper donation type
			} else if (field == "donation_type") {
				$('input[value="' + value + '"]').click();			
			// Must be another field!
			} else {
				// Is this an input or a select?
				if( $('input[name="' + field + '"]').length == 0 ) {
					$('select[name="' + field + '"]').val(value);
				} else {
					$('input[name="' + field + '"]').val(value);
				}

				$('label[for="' + field + '"]').addClass("has-content");
			}
		});
	}
})(window.actionkit, window.actionkit.utils, window.actionkit.forms);
