
let yourWeather=document.querySelector(".yourweather");
let searchWeather=document.querySelector(".searchweather");
let info_results=document.querySelector(".info-results");
let searchbar=document.querySelector(".searchbar");
let searchbox=document.querySelector("#searchbox");
let search_btn=document.querySelector(".search-btn");
let container=document.querySelector(".container");
let loading=document.querySelector(".loading");
let not_found=document.querySelector(".not-found");
let access_btn=document.querySelector(".access-btn");
let permission_div=document.querySelector(".permission");

let city=document.querySelector(".location");
let flag=document.querySelector(".flag");
let description=document.querySelector(".description");
let weatherimage=document.querySelector(".weatherimage");
let curr_temp=document.querySelector(".curr-temp");
let wind_data=document.querySelector(".wind-data");
let humidity_data=document.querySelector(".humidity-data");
let clouds_data=document.querySelector(".clouds-data");

API_KEY="d9731566c730cfc11e47b769174bc4ac";
var lat;
var longi;

function isAlpha(str) {
    return /^[A-Za-z]+$/.test(str);
}


function searchbycity()
{
    let user_city=searchbox.value;
    if(isAlpha(user_city))
        {
            getdatabycity(user_city.toLowerCase());
        }
    else
        {
            alert("City name is not valid");
        }
    console.log(searchbox.textContent);
}

function getmyloction()
{
    if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(showposition, showerror);
        }
    else
    {
        console.log("Nahi mila");
    }
}

function showposition(response)
    {
        permission_div.classList.remove("permissionactive");
        loading.classList.add("alagactive");
        lat=response.coords.latitude;
        longi=response.coords.longitude;
        getdatabylatlog(lat, longi);
        changeclickevent();
    }

function showerror(error)
{
    alert("Please grant Location");
}

function changeclickevent()
{
    yourWeather.addEventListener("click", function()
        {
            searchbar.classList.remove("active");
            info_results.classList.remove("active");
            not_found.classList.remove("hide");
            getmyloction();
        })
}


async function getdatabycity(city){

    try
    {
    console.log("APi call ke pahle wla");
    info_results.classList.remove("active");
    not_found.classList.remove("hide");
    loading.classList.add("alagactive");
    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    let results=await response.json();

    let message=results?.message;
    if(message=="city not found")
        {
            throw new Error('Network response was not ok');
        }

    console.log("Ui update ke pahle wla");
    uiUpdate(results);
    loading.classList.remove("alagactive");
    info_results.classList.add("active");
    console.log("Ui update ke baad wla");

    }
    catch(error)
    {
        loading.classList.remove("alagactive");
        not_found.classList.add("hide");
    }
    
};

async function getdatabylatlog(lat, longi){

    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&appid=${API_KEY}`);
    let results=await response.json();

    console.log(results);

    uiUpdate(results);
    loading.classList.remove("alagactive");
    console.log("abcd");
    info_results.classList.add("active");
    console.log("abhi wala");

};


function uiUpdate(results)
{
        city.textContent=results?.name;
        flag.src=`https://countryflagsapi.netlify.app/flag/${results?.sys?.country}.svg`;
        description.textContent=results?.weather?.[0]?.description;
        weatherimage.src=`https://openweathermap.org/img/wn/${results?.weather?.[0]?.icon}@2x.png`;
        curr_temp.textContent=`${results?.main?.temp}°C`;
        wind_data.textContent=`${results?.wind?.speed}m/s`;
        humidity_data.textContent=`${results?.main?.humidity}%`;
        clouds_data.textContent=`${results?.main?.clouds}%`;
        // console.log("flag aa gya");
};



searchbox.addEventListener("keydown", function(event)
    {
        if(event.key=="Enter")
            {
                search_btn.click();
            }
    });



    // alternative

    // document.addEventListener('keydown', function(event) {
    //     // Check if the Enter key was pressed and the event target is the input element
    //     if (event.key === 'Enter' && event.target.id === 'searchbox') {
    //         // Trigger the click event on the div
    //         search_btn.click();
    //     }
    // });


search_btn.addEventListener("click",function()
    {
        searchbycity();
    })


access_btn.addEventListener("click",function()
    {
        getmyloction();
    })

// yourWeather.addEventListener("click", function()
//     {
//         searchbar.classList.remove("active");
//         info_results.classList.remove("active");
//         not_found.classList.remove("hide");
//         getmyloction();
//     })

searchWeather.addEventListener("click", function()
    {
        searchbox.value="";
        permission_div.classList.remove("permissionactive");
        searchbar.classList.add("active");
        info_results.classList.remove("active");
    })


    // start

async function permission()
{
    if(navigator.permissions)
        {
            try{
            let access=navigator.permissions.query({name:'geolocation'});
            let curr_state=(await access).state;
            console.log(curr_state);

            if(curr_state=="prompt" || curr_state=="denied")
                {
                    // console.log("Curr_state");
                    permission_div.classList.add("permissionactive");

                    yourWeather.addEventListener("click", function()
                        {
                            searchbar.classList.remove("active");
                            info_results.classList.remove("active");
                            not_found.classList.remove("hide");
                            permission_div.classList.add("permissionactive");
                        })
                }
            else if(curr_state=="granted")
                {
                    searchbar.classList.remove("active");
                    info_results.classList.remove("active");
                    not_found.classList.remove("hide");
                    getmyloction();
                    yourWeather.addEventListener("click", function()
                        {
                            searchbar.classList.remove("active");
                            info_results.classList.remove("active");
                            not_found.classList.remove("hide");
                            getmyloction();
                        })
                }
            }
            catch{

            }
        }
}

permission();