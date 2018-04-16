var infoWindow;
var map;
var geocoder;

$(document).ready(function() {

    $('.js-search-myself').click(function () {
        $('.doughnut-popup__search').slideDown();
        if (!$(this).hasClass('active')) {
            $('.button').removeClass('active');
            $(this).addClass('active');
        }
    });

});

function initMap() {

    // Set default settings of map before geolocation kicks in
    var defaultLocation = {lat: 51.5210727, lng: -0.2444021};

    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 3
    });

    $('.js-find-me').click(function () {
        $('.button').removeClass('active');
        $(this).addClass('active');
        $('.doughnut-popup').append('<div class="loading-overlay"><img class="loading-overlay__spinner" src="assets/img/loading-spinner.png" alt="Loading spinner" aria-label="hidden" /></div>');
        navigator.geolocation.getCurrentPosition(success, error);
    });

    function success(currentLocation) {

        var currentLocationCoords = currentLocation.coords;
        var userLocation = new google.maps.LatLng(currentLocationCoords.latitude, currentLocationCoords.longitude);

        map.setCenter(userLocation);
        map.setZoom(15);

        infoWindow = new google.maps.InfoWindow({
            maxWidth: '250'
        });

        var request = {
            location: userLocation,
            radius: '500',
            query: 'doughnuts'
        };

        var userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            icon: 'assets/img/user.png'
        });

        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);

        closePopup();
    }

    function error() {
        alert("Awww, geolocation is not enabled on your device :(\nTry searching with an address instead.");
        $('.doughnut-popup__search').slideDown();
        $('#doughnut-popup__field').focus();
        $('.js-search-myself').addClass('active');
        $('.loading-overlay').remove();
        $('.js-find-me').removeClass('active');
        $('.js-find-me').addClass('disabled');
        $('.js-find-me').blur();
    }

}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var doughnutIcon = 'favicon.ico';

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: doughnutIcon
    });

    google.maps.event.addListener(marker, 'click', function() {

        infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '</div>');
        infoWindow.open(map, this);
    });
}

function codeAddress() {
    var address = document.getElementById('doughnut-popup__field').value;

    if (address === '') {
        alert("Please enter a location to search.");
        return;
    }

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status === 'OK') {
            var userLocation = results[0].geometry.location;
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);

            infoWindow = new google.maps.InfoWindow({
                maxWidth: '250'
            });

            var request = {
                location: userLocation,
                radius: '500',
                query: 'doughnuts'
            };

            var userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                icon: 'assets/img/user.png'
            });

            var service = new google.maps.places.PlacesService(map);
            service.textSearch(request, callback);

            $('.map-popup').show();
            closePopup();

        } else {
            $('.error-message').html('Geocode was not successful for the following reason: ' + status);
            $('.error-message').css('display', 'block');
        }
    });
}

$("#location-search").submit(function(e) {
    e.preventDefault();
    codeAddress();
});

function closePopup() {
    $('#map').removeClass('inactive');
    $('.page-overlay').remove();
    $('.doughnut-popup').fadeOut();
}