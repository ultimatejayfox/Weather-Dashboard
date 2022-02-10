var btn = document.querySelector("#btn-search");
var containerHistoricCities = document.querySelector("#historic-Cities");
var containerCurrent = document.querySelector("#targetCity");
var containerForecast = document.querySelector("#infoCity");

var dataStore = JSON.parse(localStorage.getItem('cities')) || [];

var urlIcon;
    if (location.protocol === 'http:') {
        urlIcon = 'http://openweathermap.org/img/wn/';
     } else {
        urlIcon = 'https://openweathermap.org/img/wn/';
     }


var weatherCondition = [];

function start() {

    // load the localStore
    loadCity();

}

//retrieve from local store
var loadCity = function(){

 
    cleaningElement(containerHistoricCities);

        if(dataStore){
            var ulElement = document.createElement("ul");
            ulElement.classList.add("list-unstyled");
            ulElement.classList.add("w-100");
            
            for(var i = 0; i < dataStore.length; i++){
                
                var liElement = document.createElement("li");
                liElement.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+dataStore[i]+"'>" + dataStore[i] + "</button>";
                ulElement.appendChild(liElement);
                }

                containerHistoricCities.appendChild(ulElement); 
            }
};


$(document).on("click", ".list-group-item", function(event) {

    event.preventDefault();

    var city = $(this).attr("attr");
    callApiFetch(city);
});


var cleaningElement = function(element){
    element.innerHTML = "";
};

var converTemp = function(temp){
    return (Math.floor((parseFloat(temp) -32) * (5/9))).toString();
};


var convertWSpeed = function(speed){
    return (Math.floor(parseFloat(speed) * 1.609)).toString();
};

// uv intensity
var findUV = function(uv){

 

    var indexUV = parseFloat(uv);
    var bgColor;                           
    
    if(indexUV < 3){
        bgColor = "bg-success";             
    }
    else if( indexUV < 6){
            bgColor = "bg-warning";        
        }
        else if(indexUV < 8){
                bgColor = "bg-danger";      
            }
            else {
                    bgColor = "bg-dark";    
            }
    return bgColor;
};

var weatherHTML = function (city, uv) {

    //clean 
    cleaningElement(containerCurrent);
    cleaningElement(containerForecast); 

    //Current City 
    var ctn1 = document.createElement("div");                         
    ctn1.classList.add("col-6");                                      
    var ctn2 = document.createElement("div");                          
    ctn2.classList.add("col-6");                                       
    var cityEl = document.createElement("h2");
    var imageCurrent = document.createElement("img");

    cityEl.textContent = city + " (" + weatherCondition[0].dateT +")";
    imageCurrent.setAttribute("src", weatherCondition[0].icon);
    imageCurrent.classList.add("bg-info");                            
    ctn1.appendChild(cityEl);
    ctn2.appendChild(imageCurrent);
 // div for humidity, wind speed, UV index and temperature
    var ctn3  = document.createElement("div");
    ctn3.classList.add("col-12");                       
    ctn3.innerHTML =    "<p>Temperature: " + weatherCondition[0].temp + " °F / " + converTemp(weatherCondition[0].temp) + " °C</p>" + 
                        "<p>Humidity: " + weatherCondition[0].humidity + "% </p>" +
                        "<p>Wind Speed: " + weatherCondition[0].speed + " MPH / " + convertWSpeed(weatherCondition[0].speed) + " KPH </p>" +
                        "<p>UV index: <span class='text-white "+ findUV(uv) + "'>" + uv + "</span></p>";
    containerCurrent.appendChild(ctn1);
    containerCurrent.appendChild(ctn2);
    containerCurrent.appendChild(ctn3);

    //forecast
    var ctn6 = document.createElement("div");        
    ctn6.classList.add("row");                        
    var ctn7 = document.createElement("div");         
    ctn7.classList.add("col-12");                     
    ctn7.innerHTML = "<h2>5-Day Forecast</h2>";
    ctn6.appendChild(ctn7);
    containerForecast.appendChild(ctn6);

    var ctn8 = document.createElement("div");         
    ctn8.classList.add("d-flex");                     

     //weather condition loop
    for(var i=1; i<weatherCondition.length; i++){    
        
        var ctn4  = document.createElement("div");     
        //div classes
        ctn4.classList.add("card");                     
        ctn4.classList.add("bg-primary");               
        ctn4.classList.add("text-white");               
        ctn4.classList.add("rounded");                  
        ctn4.classList.add("mr-2");                     
        ctn4.classList.add("flex-fill");
        var ctn5  = document.createElement("div");    
        ctn5.classList.add("card-body");
        var title = document.createElement("h6");
        title.classList.add("card-title");
        var imageForecast = document.createElement("img");
        title.textContent = weatherCondition[i].dateT;
        imageForecast.setAttribute("src", weatherCondition[i].icon);
        var pEl1 = document.createElement("p");
        var pEl2 = document.createElement("p");
        pEl1.classList.add("small");
        pEl1.textContent =   "Temperature: " + weatherCondition[i].temp + " °F";
        pEl2.classList.add("small");
        pEl2.textContent =  "Humidity: " + weatherCondition[i].humidity + "%";
        ctn5.appendChild(title);
        ctn5.appendChild(imageForecast);
        ctn5.appendChild(pEl1);
        ctn5.appendChild(pEl2)
        ctn4.appendChild(ctn5);        
        ctn8.appendChild(ctn4);
    }
    containerForecast.appendChild(ctn8);
    
};


var saveCity = function(city){

    var flag = false
    if(dataStore){
        for(var i = 0; i < dataStore.length; i++){
            if(dataStore[i] === city){
                flag = true;
            }
        }
        if(flag){
            displayAlertMessage("The City: "+city+" already exists")
            
        }
    }
    if(!flag){
        dataStore.push(city);
        localStorage.setItem("cities",JSON.stringify(dataStore));
    }
    
    loadCity();
}
var searchForDate9AM = function (str) {
    var hour = str.split(" ")[1].split(":")[0];
    var flag = false;
    
    if(hour === "09"){
        flag = true;
    }        
    
    return flag;
};

// date formating
var formatDate = function(strDate){

    var newDate = strDate.split(" ")[0].split("-");

    return (newDate[1]+"/"+newDate[2]+"/"+newDate[0]);
};


var createDataObject = function(list, position){

    
    if(weatherCondition.length)
        weatherCondition = [];

  
    var obj = {
        dateT : formatDate(list[0].dt_txt),
        humidity : list[0].main.humidity,
        speed: list[0].wind.speed,
        temp: list[0].main.temp,
        icon : urlIcon + list[0].weather[0].icon + ".png",
        lat : position.lat,
        lon: position.lon
    };

    weatherCondition.push(obj);

    for(var i=1; i<list.length; i++){

        if(searchForDate9AM(list[i].dt_txt)){
            obj = {
                dateT : formatDate(list[i].dt_txt),
                humidity : list[i].main.humidity,
                speed: list[i].wind.speed,
                temp: list[i].main.temp,
                icon : urlIcon + list[i].weather[0].icon + ".png",
                lat : position.lat,
                lon: position.lon
            };
            weatherCondition.push(obj);
        }
    }

};

var displayAlertMessage = function(msg) {
    alert(msg);
};

// call for weather
var callApiFetch = function(city){

    var url;
    if (location.protocol === 'http:') {
        url = 'http://api.openweathermap.org/data/2.5/forecast?appid=b262298fbe39ad30d243f31f6e1297bc&units=imperial&q='+city;
     } else {
        url = 'https://api.openweathermap.org/data/2.5/forecast?appid=b262298fbe39ad30d243f31f6e1297bc&units=imperial&q='+city;
     }

    fetch(url)
      //weather responses
    .then(function(weatherResponse) {
        return weatherResponse.json();
     })
    .then(function(weatherResponse) {

        if (weatherResponse.cod != "200") {
            
            displayAlertMessage("Unable to find "+ city +" in OpenWeathermap.org");

            return;
        } else {
                createDataObject(weatherResponse.list, weatherResponse.city.coord);
            }

            var url1;
        if (location.protocol === 'http:') {
            url1 = 'http://api.openweathermap.org/data/2.5/uvi?appid=b262298fbe39ad30d243f31f6e1297bc&lat='+weatherCondition[0].lat+'&lon='+weatherCondition[0].lon;
        } else {
            url1 = 'https://api.openweathermap.org/data/2.5/uvi?appid=b262298fbe39ad30d243f31f6e1297bc&lat='+weatherCondition[0].lat+'&lon='+weatherCondition[0].lon;
        }

        fetch(url1)

        .then(function(uvResponse) {
          return uvResponse.json();
        })
        .then(function(uvResponse) {

          if (!uvResponse) {   
            displayAlertMessage('OpenWeathermap.org could not find anything for latitude and Longitude');

            return;
          } else {

          
            saveCity(city);

         
            weatherHTML(city, uvResponse.value);
          }
        })
    })
         //for connect errors
        .catch(function(error) {
            displayAlertMessage("Unable to connect to OpenWeathermap.org");
            return;
          });
};

// click button 
var search = function(event){
    event.preventDefault();

    var inputElement = document.querySelector("#searchCity");
    var textInput = inputElement.value.trim();

    if(inputElement.value === ""){
        alert("Weather Dashbord\n   You must enter a City");
        return;
    }
   
    else{
   
        callApiFetch(textInput);

    }

};

start();

btn.addEventListener("click", search);