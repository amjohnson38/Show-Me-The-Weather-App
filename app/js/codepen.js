$(document).ready(function() {
	// call function to get the user's location
	getUserLocation();

   var momemntDate = moment();
   
   console.log(momemntDate.format('ddd MMM, YYYY'));
   var dateString = momemntDate.format('ddd MMM DD, YYYY');
  //display the date and time
    // var today = new Date();
    // console.log("date " + today);
  document.getElementById("dateTime").innerHTML = moment().format("MMMM Do YYYY, h:mm:ss a");

	//allows the button to display either farenheit or celsius when clicked
	$("#button").click(function() {
		$("#farenheitTemp").toggle();
		$("#celsiusTemp").toggle();
	});

});

//get the user's location

var getUserLocation = function() {
	// Geolocation Data Locator
	var LATITUDE, LONGITUDE;

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(position) { // geolocation success
				LONGITUDE = position.coords.longitude;
				LATITUDE = position.coords.latitude;
				// call the get weather and get location functions
				getWeather(LATITUDE, LONGITUDE);
				getLocationName(LATITUDE, LONGITUDE);
			},
			function(positionError) { // geolocation error
				console.warn("ERROR(' + positionError.code + '): " + positionError.message);
		    	 alert("Please enable geolocation.");
			});
	}

};

var getLocationName = function(lat, long) {
	var locationCall = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyCViLYBfAt-182hIVoBJU_4uMOVWRMbTo8";
	console.log(locationCall);

	$.ajax({
		url: locationCall,
		success: function(data) {
			var city = data.results[0].address_components[2].long_name;
			var locObj = {
				city: city
			};
			console.log(city);
			displayLocation(locObj);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("error getting location");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}

	});
};

/*****************************************************************************
 * getWeather
 * 		call the weather API and get the weather information
 */
var getWeather = function(lat, long) { //API with geolocation
	var apiCall = "https://api.forecast.io/forecast/" + "29bbab42b5f516976fdfa806e68d54d6" + "/" +
		+lat + "," + long;
	console.log(apiCall);

	$.ajax({
		url: apiCall,
		dataType: "jsonp",
		success: function(data) {
			var weatherDescrip = data.currently.summary;
			var airMoisture = data.currently.humidity;
			var farenheit = data.currently.temperature;
			var windSpeed = data.currently.windSpeed;
			var weatherIcon = data.currently.icon;
			var weatherObj = {
				weatherDescrip: weatherDescrip,
				airMoisture: airMoisture,
				farenheit: farenheit,
				windSpeed: windSpeed,
				weatherIcon: weatherIcon
			};
			displayWeather(weatherObj);
			console.log("here");
			console.log(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("error getting weather");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);

		}

	});

};
// display the location data via the html element assigned
function displayLocation(location) {
	$("#location").html(location.city);
}
//display the type of weather via the html element assigned
function displayWeather(weather) {
	$("#weatherType").html(weather.weatherDescrip);
	
//allows the background picture to change as the weather.icon data from the api changes, which is dependent on the type of weather occurring.
	var backgroundImageChange = weather.weatherIcon;
	var weatherImageName;
	switch (backgroundImageChange) {
		case "clear-day":
			weatherImageName = "v1464200456/photo-1422405153578-4bd676b19036_amruhd.jpg";
			break;
		case "clear-night":
			weatherImageName = "v1464200354/photo-1443456066412-3e3ea69ee37c_nxzzyv.jpg";
			break;
		case "fog":
			weatherImageName = "v1464200391/photo-1434532628716-fb9cef84f469_ip1wjz.jpg";
			break;
		case "sleet":
			weatherImageName = "v1464398173/nNsxaPH_r57oy4.jpg";
			break;
		case "rain":
			weatherImageName = "v1464200393/photo-1433863448220-78aaa064ff47_xfu5hs.jpg";
			break;
		case "wind":
			weatherImageName = "v1464200415/7a2fd8ac_uokc4h.jpg";
			break;
		case "cloudy":
			weatherImageName = "v1464200375/photo-1448032279986-c25cf997c38e_fmfkk8.jpg";
			break;
		case "snow":
			weatherImageName = "v1464200361/photo-1431036101494-66a36de47def_ugasc1.jpg";
			break;
		case "partly-cloudy-day":
			weatherImageName = "v1464200436/158H_hkwqzm.jpg";
			break;
		case "partly-cloudy-night":
			weatherImageName = "v1464398621/EyXTy5t_hmybfw.jpg";
			break;
		case "hail":
			weatherImageName = "v1464200423/hail_r6kprs.jpg";
			break;
		case "thunderstorm":
			weatherImageName = "v1464398837/j3MHfVb_ij1uyb.jpg";
			break;
		case "tornado":
			weatherImageName = "v1464200424/9WTNHBFJUX_upj8yp.jpg";
			break;
		default:
			weatherImageName = "v1464200420/photo-1460500063983-994d4c27756c_rgonym.jpg";
			break;
	}
	var imgURLString = "https://res.cloudinary.com/angiemjohnson/image/upload/" + weatherImageName;
	

	console.log(imgURLString);
// connects the background image to the body of the app.
	$(".backgroundContainer").css("background-image", "url(" + imgURLString + ")");

	

	//Displaying humidity value
	var humidity = humidityToPercent(weather.airMoisture);
	$("#airMoisture").html(humidity + "% " + " Humidity");
	//Displaying windspeed in mph as oppose to miles/sec
	var windSpeedChange = windSpeedConversion(weather.windSpeed);
	$("#wind").html(windSpeedChange + " mph " + " wind");

	//calling the function celToFar to convert from Farenheit to Celsius 
	var cTemp = farToCel(weather.farenheit);
	// Displaying Celsius and Farenheit values
	$("#celsiusTemp").html(cTemp + "&#8451");
	$("#farenheitTemp").html(weather.farenheit.toFixed(0) + "&#8457");

}

//convert humidity to a percent
function humidityToPercent(airMoisture) {
	return (airMoisture * 100).toFixed(0);
}

// convert farenheit to celsius
function farToCel(farenheit) {
	return ((farenheit - 32) * 5 / 9).toFixed(0);
}

// rounds the wind value to the nearest integer
function windSpeedConversion(windSpeed) {
	return Math.round(windSpeed);
}