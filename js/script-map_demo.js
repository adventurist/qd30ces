$(document).ready(function() {
	// Is the info block in the bottom left open?
	var infoOpen = false;

	// Checks whether the .readmore div within the .event div is empty, and if so removes the .event div entirely (to remove the grey block and decorative hash pattern)
	$('.event').each(function() {
		if ($(this).find('.readmore').children().length == 0) {
			$(this).remove();
		}
	});


	// This block covers all of the .closemenu 'X' buttons (legend and map-info)
	$('.closemenu').on('mouseenter', function() {
		$(this).find('span').show();
	}).on('mouseleave', function() {
		$(this).find('span').hide();
	}).on('click tap', function() {
		$(this).parent().parent().children('div').fadeOut(150);
		$(this).parent().parent().delay(50).animate({width:'toggle'}, 300);
		if ($(this).parent().hasClass('closeinfo')) {
			infoOpen = false;
			$('.selected').removeClass('selected');
		}
	});

	// Opening the legend when the '?' button is clicked
	$('button.legend').on('click tap', function() {
		$('.map-legend-info').animate({width:'toggle'}, 300);
		$('.map-legend-info > div').delay(150).fadeIn(150);
	});

	// Showing the info block when a store/building is clicked
	$('.TESTbuilding').on('click tap', function() {
		// The clicked building's identifying number is parsed from the building's ID
		buildingID = parseInt($(this).attr('id').replace('building',''), 10);

		// The behaviour of the .map-info div. If the info is not open, then the .map-info will slide in from the left. Otherwise, the new .map-info will fade in and the current one will fade out.
		if (infoOpen == false && !$('#store' + buildingID).hasClass('selected')) {
			$('#store' + buildingID).animate({width:'toggle'},300)
			.children('div').delay(150).fadeIn(150);

			infoOpen = true;
			$('#store' + buildingID).addClass('selected');

		} else if (infoOpen == true && !$('#store' + buildingID).hasClass('selected')) {
			$('.selected').fadeOut(400).removeClass('selected')
			.children('div').fadeOut(200);

			$('#store' + buildingID).fadeIn(100).addClass('selected')
			.children('div').fadeIn(400);

		}

	});

});
