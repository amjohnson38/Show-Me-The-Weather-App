$(document).ready(function () {
    
    


    // call function to get the user's location
    getUserLocation();
   
  //display the date and time
var today = new Date();
document.getElementById("dateTime").innerHTML = today;


    
 //allows the button to display either farenheit or celsius when clicked
    $("#button").click(function () {
        $("#farenheitTemp").toggle();
        $("#celsiusTemp").toggle();
    });

});

/*************************************************************************
 *  getUserLocation
 * 		get the user's location
 */
var getUserLocation = function () {
    // Geolocation Data Locator
    var LATITUDE, LONGITUDE;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) { // geolocation success
                LONGITUDE = position.coords.longitude;
                LATITUDE = position.coords.latitude;
                // call the get weather and get location functions
                getWeather(LATITUDE, LONGITUDE);
                getLocationName(LATITUDE, LONGITUDE);
            },
            function (positionError) { // geolocation error
                console.warn("ERROR(' + positionError.code + '): " + positionError.message);
                // alert("please enable geolocation");
                return null;
            });
    }

};

var getLocationName = function (lat, long) {
    var locationCall = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyCViLYBfAt-182hIVoBJU_4uMOVWRMbTo8";
    console.log(locationCall);

    $.ajax({
        url: locationCall,
        success: function (data) {
            var city = data.results[0].address_components[2].long_name;
            var locObj = {
                city: city
            };
            console.log(city);
            displayLocation(locObj);
        },
        error: function (jqXHR, textStatus, errorThrown) {
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
var getWeather = function (lat, long) { //API with geolocation
    var apiCall = "https://api.forecast.io/forecast/" + "29bbab42b5f516976fdfa806e68d54d6" + "/" +
        +lat + "," + long;
    console.log(apiCall);


    $.ajax({
        url: apiCall,
        dataType: "jsonp",
        success: function (data) {
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
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error getting weather");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

        }

    });

};


function displayLocation(location) {
    $("#location").html(location.city);
}


function displayWeather(weather) {
    $("#weatherType").html(weather.weatherDescrip);

    var backgroundImageChange = weather.weatherIcon;
    var weatherImageName;
    switch (backgroundImageChange) {
        case "clear-day": 
        weatherImageName = "bwPZ4rE.jpg";
            break;
        case "clear-night":
        weatherImageName = "XGBsK9p.jpg";
            break;
        case "fog":
        weatherImageName = "YDMW2DL.jpg";
            break;
        case "sleet":
        weatherImageName = "nNsxaPH.jpg";
            break;
        case "rain":
        weatherImageName = "bpvUZ93.jpg";
            break;
        case "wind":
        weatherImageName = "QUmmO3r.jpg";
            break;
        case "cloudy":
        weatherImageName = "GWY3lIc.jpg";
            break;
        case "snow":
        weatherImageName = "4bOm6tc.jpg";
            break;
        case "partly-cloudy-day":
        weatherImageName = "GM27YQL.jpg";
            break;
        case "partly-cloudy-night":
        weatherImageName = "EyXTy5t.jpg";
            break;
        case "hail":
        weatherImageName = "glPNlMA.jpg";
            break;
        case "thunderstorm":
        weatherImageName = "j3MHfVb.jpg";
            break;
        case "tornado":
        weatherImageName = "yOnig5Y.jpg";
            break;
        default: 
        weatherImageName = "6K1ZacA.jpg";
            break;
    }
    
           

    var imgURLString = "https://i.imgur.com/" + weatherImageName;
    console.log(imgURLString);
   // $("body").css("background-image", "url(./images/" + weatherImageName + ")");
$("body").css("background-image", "url(" + imgURLString +  ")");


    //$("#weatherPic").html(weather.weatherIcon);

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

// Convert from miles/second to miles/hour
function windSpeedConversion(windSpeed) {
    return Math.round(windSpeed);
}

