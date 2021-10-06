const wrapper = document.querySelector(".wrapper");
backArrow = wrapper.querySelector("header i");
inputCity = document.querySelector(".input-city");
inputField = document.querySelector(".user-input");
inputZip = document.querySelector(".input-zip");
infoTxt = inputField.querySelector(".info-txt");
deviceLocationBtn = inputField.querySelector("button");
weatherSection = wrapper.querySelector(".weather-section");
wIcon = weatherSection.querySelector("img");

const API_KEY = config.MY_API_TOKEN;
let api;

inputCity.addEventListener("keyup", e =>{
    if (e.key == "Enter" && inputCity.value != "") {
        requestApi(inputCity.value);
    }
});

inputZip.addEventListener("keyup", e =>{
    if (e.key == "Enter" && inputZip.value != ""){
        requestApi(inputZip.value);
    }
});

deviceLocationBtn.addEventListener("click", () =>{
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Sorry but your browser does not support geolocation api");
    }
});

function requestApi(input){
    if (isNaN(input)) {
        api = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=${API_KEY}`;
    } else {
        api = `https://api.openweathermap.org/data/2.5/weather?zip=${input}&units=imperial&appid=${API_KEY}`;
    }
    getWeatherData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`;
    getWeatherData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function getWeatherData(){
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if (info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} is not a valid input`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800){
            wIcon.src = "img/icons/clear.png";
        } else if(id >= 200 && id <= 232) {
            wIcon.src = "img/icons/storm.png";  
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "img/icons/snow.png";
        } else if(id >= 701 && id <= 781) {
            wIcon.src = "img/icons/haze.png";
        } else if(id >= 801 && id <= 804) {
            wIcon.src = "img/icons/cloud.png";
        } else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            wIcon.src = "img/icons/rain.png";
        }
        
        weatherSection.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherSection.querySelector(".weather").innerText = description;
        weatherSection.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherSection.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherSection.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

backArrow.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
    api = ""
});

