var infoWindow;
var map;
var geocoder;

var DoughnutApp = {
    elements: {
        doughnutPopup: document.querySelector('.js-doughnut-popup'),

        searchForm: document.querySelector('#location-search'),
        searchContainer: document.querySelector('.js-search-location'),
        searchButton: document.querySelector('.js-search-myself'),
        searchField: document.querySelector('.js-search-field'),
        searchErrorMessage: document.querySelector('.js-search-error'),

        userSearchButton: document.querySelector('.js-search-myself'),
        userFind: document.querySelector('.js-find-me'),

        map: document.querySelector('#map'),
        mapPopup: document.querySelector('.js-map-popup')
    },
    methods: {
        removeButtonActiveStates: function() {
            var buttons = document.querySelectorAll('.button');

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('active')
            }
        },
        closePopup: function() {
            var pageOverlay = document.querySelector('.page-overlay');

            DoughnutApp.elements.map.classList.remove('inactive');
            pageOverlay.remove();
            DoughnutApp.elements.doughnutPopup.remove();
        },
        geolocationSuccess: function(currentLocation) {
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
                icon: DoughnutApp.images.userIcon
            });

            var service = new google.maps.places.PlacesService(map);
            service.textSearch(request, DoughnutApp.methods.callback);

            DoughnutApp.methods.closePopup();
        },
        geolocationError: function() {
            alert("Awww, geolocation is not enabled on your device :(\nTry searching with an address instead.");

            var loadingOverlay = document.querySelector('.loading-overlay');

            DoughnutApp.elements.searchContainer.style.display = 'block';
            DoughnutApp.elements.searchField.focus();
            DoughnutApp.elements.userSearchButton.classList.add('active');
            loadingOverlay.remove();
            DoughnutApp.elements.userFind.classList.remove('active');
            DoughnutApp.elements.userFind.classList.add('disabled');
            DoughnutApp.elements.userFind.blur();
        },
        callback: function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    DoughnutApp.methods.createMarker(results[i]);
                }
            }
        },
        createMarker: function(place) {
            var placeLoc = place.geometry.location;
            var doughnutIcon = DoughnutApp.images.doughnutIcon;

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
        },
        codeAddress: function() {
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
                        icon: DoughnutApp.images.userIcon
                    });

                    var service = new google.maps.places.PlacesService(map);
                    service.textSearch(request, DoughnutApp.methods.callback);

                    DoughnutApp.elements.mapPopup.style.display = 'block';
                    DoughnutApp.methods.closePopup();

                } else {
                    DoughnutApp.elements.searchErrorMessage.innerText = 'Geocode was not successful for the following reason: ' + status;
                    DoughnutApp.elements.searchErrorMessage.style.display = 'block';
                }
            });
        }
    },
    images: {
        loadingSpinner: 'assets/img/doughnut.png',
        doughnutIcon: 'assets/img/doughnut-icon.png',
        userIcon: 'assets/img/user-icon.png'
    }
};

function initMap() {
    // Set default settings of map before geolocation kicks in
    var defaultLocation = {lat: 51.5210727, lng: -0.2444021};

    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 3
    });
}


// Event listeners
DoughnutApp.elements.searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    DoughnutApp.methods.codeAddress();
});

DoughnutApp.elements.searchButton.addEventListener('click', function() {
    DoughnutApp.elements.searchContainer.style.display = 'block';
    if (!this.classList.contains('active')) {
        DoughnutApp.methods.removeButtonActiveStates();
        this.classList.add('active');
    }
});

DoughnutApp.elements.userFind.addEventListener('click', function() {
    var doughnutPopup = document.querySelector('.js-doughnut-popup');
    var loadingOverlay = document.createElement('div');

    loadingOverlay.innerHTML = '<div class="loading-overlay"><img class="loading-overlay__spinner" src="' + DoughnutApp.images.loadingSpinner + '" alt="" /></div>';

    DoughnutApp.methods.removeButtonActiveStates();
    this.classList.add('active');

    doughnutPopup.appendChild(loadingOverlay);
    navigator.geolocation.getCurrentPosition(DoughnutApp.methods.geolocationSuccess, DoughnutApp.methods.geolocationError);
});