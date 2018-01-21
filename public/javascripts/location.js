let latitude = -48.876667
let longitude = -123.393333

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
const geolocate = () => {
  // check to see if the browser has navigator.geolocation capabilities
  if (navigator.geolocation) {
    // ping for current location. The parameter runs a function on location
    navigator.geolocation.getCurrentPosition(function(position) {
      // creates a new object called geolocation that stores the coordinates
      const geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('Browser geolocation is: Lat: ' + geolocation.lat + ' Lng: ' + geolocation.lng);
      // return that object for manipulation elsewhere
      latitude = geolocation.lat
      longitude = geolocation.lng
      return geolocation
    });
  }
}

module.exports.Latitude = latitude
module.exports.Longitude = longitude
