// capheshift 2016
// author: tw
/*global $, google */

/**
 * reference from here
 * https://developers.google.com/maps/documentation/javascript/events
 */

$(document).on('ready', function() {
	var map, mapOptions, center, currentMarker;
	center = new google.maps.LatLng(10.81416666666667, 106.66694444444444);
	mapOptions = {
		center: center,
		zoom: 16,
		scrollwheel: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var getLatLon = function() {
		var $detailData = $('.jsdata-detail');
		return {
			lat: $detailData.attr('data-lat'),
			lng: $detailData.attr('data-lng')
		};
	};

	var setCurrentMarker = function(latLng) {
		if (currentMarker) {
			currentMarker.setMap(null);
		}
		currentMarker = new google.maps.Marker({
			position: latLng,
			map: map,
			icon: 'http://maps.google.com/mapfiles/ms/icons/red.png'
		});
	};

	var initChiTiet = function() {
		var gPosition;
		var position = getLatLon();

		gPosition = new google.maps.LatLng(position.lat, position.lng);
		map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
		map.setCenter(gPosition);
		setCurrentMarker(gPosition);
	};

	// only apply for dang-tin page
	if ($('.container').hasClass('jspage-chi-tiet')) {
		initChiTiet();

		$('.main-content').off('click.gallery', '.fancybox-thumb').on('click.gallery', '.fancybox-thumb', function(e) {
			e.preventDefault();

			$.fancybox.open($(this).closest('.gallery').find('.fancybox-thumb'), {
				helpers: {
					prevEffect: 'none',
					nextEffect: 'none',
					title: {
						type: 'outside'
					},
					thumbs: {
						width: 50,
						height: 50
					}
				}
			});
		});
	}
});
