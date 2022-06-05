var citySearchEl = document.querySelector("#search-nav-bar");
var citySearchContainerEl = document.querySelector("#city-search-container");
var cityInputEl = document.querySelector("#city-name");
var todaysWeatherContainer = document.querySelector("#todaysWeather");
var forecastContainer = document.querySelector("#forecast-container");

var cityArr = [];

var citySearchHandler = function(event)
{
    if(event.target.id == "searchBtn")
    {
        var cityName = cityInputEl.value;

        if(cityName)
        {
            getLocation(cityName);

            cityInputEl.value = "";
        }
        else
        {
            window.alert("Please enter a city name");
        }
    }
    else if(event.target.type == "button")
    {
        getLocation(event.target.textContent);
    }
    
};

var getLocation = function(city)
{
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" +  city + "&limit=1&appid=2eb6beb9db14f1d13ccbe17bee16e2a1";

    fetch(apiUrl).then(function(response)
    {
        if(response.ok)
        {   
            response.json().then(function(data)
            {
                if(data.length)
                {
                    var latitude = data[0].lat;
                    var longitude = data[0].lon;
                    
                    getWeatherData(latitude, longitude, city);
                }
                else
                {
                    // if no data is returned
                    window.alert("Invalid city name, Please try again!");
                }
                
            });
        }
        else
        {
            window.alert("Error Loading Data.");
        }
    })
    .catch(function(error)
    {
        window.alert("Error Loading Data. " + error);
    });
};

var getWeatherData = function(lat,long, city)
{
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon="+ long + "&units=imperial&appid=2eb6beb9db14f1d13ccbe17bee16e2a1";
    
    fetch(apiUrl).then(function(response)
    {
        if(response.ok)
        {
            response.json().then(function(data)
            {         
                todaysWeatherContainer.style.visibility = "visible";
                forecastContainer.style.visibility = "visible";
                displayWeatherData(city, data);

                // Success Store City to city Array and create Element
                createHistoryEl(city);
            });
        }
        else
        {
            window.alert("Error Loading Data.");
        }
    })
    .catch(function(error)
    {
        window.alert("Error Loading Data. " + error);
    });
};

var displayWeatherData = function(city, weatherData)
{
    var date = moment().format("l");

    console.log(weatherData);
    // Clear old contents if they exist
    if(document.getElementById("todaysContainer"))
    {
        document.getElementById("todaysContainer").remove();
        // Clear Existing ForecastData
        for(var j = 1; j <6; j++)
        {
            document.getElementById("forecastContainer" + String(j)).remove();
        }
    } 
    
    // Create new container
    var container = document.createElement("div");
    container.setAttribute("id","todaysContainer");

    // Display Today's Weather Data in the Main box
    var cityNameEl = document.createElement("h3");
    cityNameEl.classList.add("fw-bold");
    cityNameEl.textContent = city + " (" + date + ") ";

    // Status Image
    var statusEl = document.createElement("img");
    var weatherstatus = getWeatherStatusUrl(weatherData.daily[0].weather[0].id);
    statusEl.setAttribute("src", weatherstatus);

    // Temperature
    var tempEl = document.createElement("p");
    tempEl.innerHTML = "Temp: " + weatherData.daily[0].temp.day + " &degF";

    // Wind
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + weatherData.daily[0].wind_speed + " MPH";

    // Humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + weatherData.daily[0].humidity + " %";

    var uvIndexEl = document.createElement("p");
    var uvi = weatherData.daily[0].uvi;
    if(uvi <= 3)
    {
        // UV Index is Good
        uvIndexEl.innerHTML = "UV Index: <span class='bg-success text-white rounded px-1 py-1'>" + uvi + "</span>";
    }
    else if(uvi <= 8)
    {
        // UV Index is Mild
        uvIndexEl.innerHTML = "UV Index: <span class='bg-warning text-white rounded px-1 py-1'>" + uvi + "</span>";
    }
    else
    {
        // UV Index is Severe
        uvIndexEl.innerHTML = "UV Index: <span class='bg-danger text-white rounded px-1 py-1'>" + uvi + "</span>";
    }

    container.appendChild(cityNameEl);
    container.appendChild(statusEl);
    container.appendChild(tempEl);
    container.appendChild(windEl);
    container.appendChild(humidityEl);
    container.appendChild(uvIndexEl);

    todaysWeatherContainer.appendChild(container);

    // Create Display for 5-Day Forecast
    for(var i = 1; i < 6; i++)
    {
        // Create Container for Forecast Data
        var container2 = document.createElement("div");
        container2.setAttribute("id","forecastContainer" + String(i));
        container2.classList.add("forecast-card");

        // Display Forecasted Date
        var dateForecastEl = document.createElement("p");
        dateForecastEl.classList.add("fw-bold");
        date = moment().add(i,"days").format("l");
        dateForecastEl.textContent = date;

        // Status Image
        var statusForecastEl = document.createElement("img");
        weatherstatus = getWeatherStatusUrl(weatherData.daily[i].weather[0].id);
        statusForecastEl.setAttribute("src", weatherstatus);

        // Temperature
        var tempForecastEl = document.createElement("p");
        tempForecastEl.innerHTML = "Temp: " + weatherData.daily[i].temp.day + " &degF";

        // Wind
        var windForecastEl = document.createElement("p");
        windForecastEl.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";

        // Humidity
        var humidityForecastEl = document.createElement("p");
        humidityForecastEl.textContent = "Humidity: " + weatherData.daily[i].humidity + " %";

        container2.appendChild(dateForecastEl);
        container2.appendChild(statusForecastEl);
        container2.appendChild(tempForecastEl);
        container2.appendChild(windForecastEl);
        container2.appendChild(humidityForecastEl);

        document.getElementById("forecast").appendChild(container2);
    }
};

var getWeatherStatusUrl = function(weathercode)
{
    var statusApiUrl = "https://openweathermap.org/img/wn/";
    var imgCode = "";

    switch(weathercode)
    {
        // Thunderstorms
        case 200:
        case 201:
        case 202:
        case 210:
        case 211:
        case 212:
        case 221:
        case 230:
        case 231:
        case 232: 
            imgCode = "11d";
            break;
        // Drizzle
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
        case 520:
        case 521:
        case 522:
        case 531:
            imgCode = "09d";
            break;
        // Rain
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
            imgCode = "10d";
            break;
        // Freezing Rain/Snow
        case 511:
        case 600:
        case 601:
        case 602:
        case 611:
        case 612:
        case 613:
        case 615:
        case 616:
        case 620:
        case 621:
        case 622:
            imgCode = "13d";
            break;
        // Atmosphere
        case 701:
        case 711:
        case 721:
        case 731:
        case 741:
        case 751:
        case 761:
        case 762:
        case 771:
        case 781:
            imgCode = "50d";
            break;
        // Clear
        case 800:
            imgCode = "01d";
            break;
        // Few Clouds
        case 801:
            imgCode = "02d";
            break;
        // scattered clouds
        case 802:
            imgCode = "03d";
            break;
        // lots of clouds
        case 803:
        case 804:
            imgCode = "04d";
            break;
    }

    return statusApiUrl += imgCode + "@2x.png"; 
};

var createHistoryEl = function(city)
{
    // Check see if the City already exists 
    for(var i = 0; i < cityArr.length; i++)
    {
        if(cityArr[i] == city)
        {
            return;
        }
    }

    // else create new city button
    var cityBtn = document.createElement("button");
    cityBtn.setAttribute("type","button");
    cityBtn.classList.add("btn","city-btn","bg-secondary","text-white","form-control","mt-3");
    cityBtn.textContent = city;
    cityArr.push(city);

    citySearchEl.appendChild(cityBtn);
};

citySearchEl.addEventListener("click", citySearchHandler);