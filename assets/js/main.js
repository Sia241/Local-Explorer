
// In Case the api request are over, please check the link, login and recieve your own API for free
/******************** A never use API key for weatherAPI : edb204619cmshb1c0f3b0ab1b76dp167d54jsn5356c39298eb ****************** */
const weatherApiKey = 'a9ac20c2f4msh7e4f73e040b99d8p1eb50cjsne5e5a702db19'; // Link of Weather API : https://rapidapi.com/worldapi/api/open-weather13
                                                                            // Link of reverse geocoding API : https://rapidapi.com/Noggle/api/reverse-geocoding-and-geolocation-service
const imageAndMapApiKey = 'a80ab969d52173044f8c616ece4c55d5042df70c'; // Link of API : https://serper.dev/
const openGPTAPI = ''; //Please add the key here

let chagptInput;
let chatGptContext = []; 
// const askedQuestions = [];
let city;
let countryId;
let map;
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // Cache expiration time in milliseconds (5 minutes)
const cache = {};

/***************** RETRIEVING THE CITY OF THE NAVIGATOR ****************** */
async function getCachedWeatherForCity(cityName) {
    console.log(`Hello I am in getCachedWeatherForCity()  `);
    if (cache[cityName] && Date.now() - cache[cityName].timestamp < CACHE_EXPIRATION_TIME) {
        
    console.log(`Hello I am in getCachedWeatherForCity()  also 1`);
        return cache[cityName].data;
    } else {
        const weatherData = await getWeatherForCity(cityName);
        cache[cityName] = {
            timestamp: Date.now(),
            data: weatherData,
        };
        console.log(`Hello I am in getCachedWeatherForCity()  also 2`);
        return weatherData;
    }
}

/***************** RETRIEVING THE CITY OF THE NAVIGATOR ****************** */
async function getCityFromCoords(latitude, longitude) {
    console.log(`Hello I am in getCityFromCoords()  `);
    const apiKey = weatherApiKey;

    const options = {
        method: 'GET',
        url: 'https://geocodeapi.p.rapidapi.com/GetNearestCities',
        params: {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            range: '0'
        },
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'geocodeapi.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);

        if (response.data && response.data.length > 0) {
            city = response.data[0].City;
            countryId = response.data[0].CountryId;
            return city;
        } else {
            return null; // Unable to determine city
        }
    } catch (error) {
        console.error('Error getting city from coordinates:', error);
        throw error;
    }
}


//***************** GETTING THE LOCATION OF THE NAVIGATOR (long,lat) ****************** */

function getLocation() {
    console.log(`Hello I am in getLocation()  `);
    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    } else {
        return Promise.reject("Geolocation is not supported by this browser.");
    }
}

//########################### GETTING THE WEATHER CONDITIONS BASED ON CITY #######
// BUT ALSO PREPARING FOR THE CHATGPT INITIAL INPUT ##############################
async function getWeatherForCity(cityName) {
    const apiKey = weatherApiKey;

    const options = {
        method: 'GET',
        url: `https://open-weather13.p.rapidapi.com/city/${encodeURIComponent(cityName)}`,
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
        }
    };

    try {
      

        const response = await axios.request(options);
        const weatherData = response.data;

        const temperature = weatherData.main.temp;
        const conditions = weatherData.weather[0].description;
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;


const formattedContent = `I am working on local Explorer, a personalized activity recommendation app that leverages real-time geolocation and weather data to suggest tailored experiences.So  I am relying on you chatGPT  to suggest me activities both indoor and outdoor like visit a nearer specific restaurant or movie theater, or maybe suggest to just stay at home and watch netflix (i insist for you to suggest me an activity like  watch netflix at home).
and please don't be vague, give me specific place in case you re suggesting outdoor activity like the name of the restaurant or the name of the nearest movie teather. Imprtant : specify the place in the title (like 'Visiting Restaurant Tasty' as a title) and don't forget indoor activities like watching netflix and don't specify if its an outdoor or indoor activity.
So now Given the weather data for ${cityName}:
- Temperature: 15 degrees
- Conditions: raining
- Wind Speed: ${windSpeed}
- Humidity: ${humidity}
- Time: ${new Date().toLocaleString()}
        
Give me one suggested activity in ${cityName} and based on the weather conditions
Please chatgpt, I highly insist for the output to be like this each time i ask you for a new activity suggestion : 
Title : A name for the activity 
Description : A description for the activity 
`;
        console.log(formattedContent);
        return formattedContent;
    } catch (error) {
        console.error('Error getting weather data:', error);
        return null;
    }
}


//************** *CHATGPT LOGIC IS DOWN HERE ************** */

async function fetchData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Adding OpenAI API key here
            'Authorization': `Bearer ${openGPTAPI}`,
        },
        body: JSON.stringify(data),
    });

    return await response.json();
}

async function getChatGptResponse(userMessage, systemPrompts = []) {

    
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

    const openaiData = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: userMessage },
            ...systemPrompts.map((prompt) => ({ role: 'assistant', content: prompt })),
        ],
        temperature: 0.9,
        max_tokens: 256,
    };

  

    try {
        // Calling OpenAI API
        const openaiResponse = await fetchData(apiEndpoint, openaiData, {
             'Authorization': `Bearer ${openGPTAPI}`,
        });
    
        // Check if choices array exists and is not empty
        if (openaiResponse.choices && openaiResponse.choices.length > 0) {
            const openaiGptResponse = openaiResponse.choices[0].message.content;
    
            console.log('OpenAI Response:', openaiGptResponse);
    
            // Extracting title and description based on OpenAI API response structure
            const titleMatch = openaiGptResponse.match(/Title:\s*(.*)/);
            const descriptionMatch = openaiGptResponse.match(/Description:\s*(.*)/);
    
            // Check if title and description matches were found
            if (titleMatch && descriptionMatch) {
                const title = titleMatch[1];
                const description = descriptionMatch[1];
    
                console.log('Title:', title);
                console.log('Description:', description);
    
                // Adding user and assistant messages to the conversation history
                addToChatHistory('user', userMessage);
                addToChatHistory('assistant', openaiGptResponse);
    
                return [title, description];
            } else {
                console.error('Title or description not found in OpenAI response.');
                return null;
            }
        } else {
            console.error('No choices found in OpenAI response.');
            return null;
        }
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        // Handling error as needed
        return null;
    }
}



//########################### FOR CHATGPT HISTORY CONTENT ##############################
// Function to add messages to the conversation history
function addToChatHistory(role, content) {
    chatGptContext.push({
        role: role,
        content: content,
    });
}



//########################### API FOR RELEVANT IMAGES OF THE ACTIVITY SUGGESTION ##############################
async function getImageUrlFromApi(query) {
    const apiKey = imageAndMapApiKey;

    try {
        const response = await axios.post('https://google.serper.dev/images', {
            q: query
        }, {
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            }
        });

        
        const imageUrl = response.data.images[0].imageUrl;

        return imageUrl;
    } catch (error) {
        console.error('Error getting image from API:', error);
        return null;
    }
}




//########################### DISPLAYING THE NEW SUGGESTIONS ON THE CAROUSSEL ##############################
function onNewSuggestionCreated(title, description, imageUrl) {
    const owlCarousel = $('.owl-carousel');

    // Creating a new card HTML structure
    var newCardHTML = `
        <!-- ... Previous code ... -->
      
        <div class="new-cards-item">
          <div class="single-new-cards-item">
            <div class="row">
              <div class="col-md-7 col-sm-12">
                <div class="new-cards-img">
                  <img src="${imageUrl}"/>
                </div><!--/.new-cards-img-->
              </div>
              <div class="col-md-5 col-sm-12">
                <div class="new-cards-txt">
                  <h2><a href="#">${title} </a></h2>
                  <p>
                  ${description}
                  </p>
                </div><!--/.new-cards-txt-->	
                
              </div><!--/.col-->
            </div><!--/.row-->
          </div><!--/.single-new-cards-item-->
        </div><!--/.new-cards-item-->
        <div class="section-header" id="dislike-like">
            <button class="btn green"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i></button>
            <button class="btn red"><i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i></button>
        </div>
      
        <!-- ... Next code ... -->
    `;
    
    // Using the Owl Carousel API to add the new item
    var newItem = $(newCardHTML);
    owlCarousel.trigger('add.owl.carousel', [newItem, 0]).trigger('refresh.owl.carousel');

    // Getting references to the dynamically generated buttons within the new item
    var btn1 = newItem.find('.btn.green');
    var btn2 = newItem.find('.btn.red');
     

    // Binding event listeners to the buttons within the new item
    btn1.on('click', function() {
        if (btn2.hasClass('red')) {
            btn2.removeClass('red');
        }
        $(this).toggleClass('green');
        const placeToSearchFor = title + " at "+ city;
        console.log(placeToSearchFor);
        displayLocationOnMap(placeToSearchFor);

        // Handling like event
        return handleFeedback(title, 'like');
    });

    btn2.on('click', function() {
        if (btn1.hasClass('green')) {
            btn1.removeClass('green');
        }
        $(this).toggleClass('red');

        // Handling dislike event
        return handleFeedback(title, 'dislike'); 
    });
}





//########################### HANDLING FEEDBACK FUNCTION ##############################

// Function to handle like/dislike events
function handleFeedback(activityTitle, feedback) {
    // Retrieve existing feedback from localStorage or initialize an empty array
    let feedbackArray = JSON.parse(localStorage.getItem('userFeedback')) || [];

    // Check if both activityTitle and feedback are provided
    if (activityTitle && feedback) {
        // Check if the user has already given feedback for this activity
        const existingFeedbackIndex = feedbackArray.findIndex(item => item.activity === activityTitle);

        if (existingFeedbackIndex !== -1) {
            // Trigger SweetAlert to notify the user about duplicate feedback
            Swal.fire("You already gave your feedback for this activity!");
        } else {
            // Push the new feedback to the array
            feedbackArray.push({ activity: activityTitle, feedback: feedback });

            // Append the feedback to the testimonial carousel section
            appendFeedbackToCarousel(activityTitle, feedback);

            // Store the updated feedback array back in localStorage
            localStorage.setItem('userFeedback', JSON.stringify(feedbackArray));
            console.log(feedbackArray);
        }
    } else if (!activityTitle && !feedback) {
        // If no parameters are provided, return all existing feedback
        return feedbackArray;
    } else {
        // Log a message indicating that activityTitle or feedback is missing
        console.log("Activity title or feedback is missing.");
    }

    // Return the updated feedback array
    return feedbackArray;
}





//########################### DISPLAYING THE FEEDBACK HISTORY ##############################

// Function to append feedback to the testimonial carousel section
function appendFeedbackToCarousel(activityTitle, feedback) {
    const testimonialCarousel = document.getElementById('feedback');
    let img = "";
    if (feedback == 'like') {
       img = "assets/images/clients/1.png";
    } else {
        img = "assets/images/clients/2.png";
    }

    const newTestimonialDiv = document.createElement("div");
    newTestimonialDiv.className = "col-sm-3 col-xs-12";

    // Creating HTML for the new testimonial
    newTestimonialDiv.innerHTML = `
        <div class="single-testimonial-box">
            <div class="testimonial-description">
                <div class="testimonial-info">
                    <div class="testimonial-img">
                        <img src="${img}" alt="Testimonial Image" />
                    </div><!--/.testimonial-img-->
                </div><!--/.testimonial-info-->
                <div class="testimonial-person">
                    <br>
                    <h2>${activityTitle}</h2>
                </div><!--/.testimonial-person-->
            </div><!--/.testimonial-description-->
        </div><!--/.single-testimonial-box-->
    `;

    // Appending the new testimonial div to the testimonial carousel
    testimonialCarousel.appendChild(newTestimonialDiv);
}







//########################### FUCNTION FOR THE NEXT BUTTON ##############################

async function getNextChatGptResponse() {
    clearMap();
    // Generating system prompts based on conversation history
    const systemPrompts = chatGptContext
        .filter((message) => message.role === 'assistant')
        .map((message) => message.content);

    // Creating a new user message including user feedback
    const userFeedback =  handleFeedback('',''); // Implement this function to get user feedback
    console.log(userFeedback);
    const userMessage = `Give me another activity suggestion based on my feedback: ${userFeedback}. 
        Please ensure it's relevant to the city: ${city}and weather conditions mentioned earlier. 
        Also, I insist the output format to be like this: 
        Title: A name for the activity 
        Description: A description for the activity`;

    // Calling ChatGPT API with conversation history
    const chatgptOutput = await getChatGptResponse(userMessage, systemPrompts);
    // Fetch image URL based on the city name
    const imageUrl = await getImageUrlFromApi(chatgptOutput[0]);

    // Adding user and assistant messages to the conversation history
    addToChatHistory('user', userMessage);
    addToChatHistory('assistant', chatgptOutput[0]);

    // Initialize Owl Carousel once the document is ready
    $(document).ready(function () {
        var owl = $('.owl-carousel');

        // Initialize Owl Carousel
        owl.owlCarousel();

        // Listen to owl events
        owl.on('changed.owl.carousel', function (event) {
            // Handle the event here
            console.log('Owl Carousel changed event:', event);
        });

        
        //DISPLAY THE NEW SUGGESTION
        onNewSuggestionCreated(chatgptOutput[0], chatgptOutput[1],imageUrl );
    });
}




//########################### FUCNTION FOR THE TRY BUTTON ##############################

  async function displayInitialSuggestion() {
    try {
         // Show loading spinner and hide the try button
         
         const tryButton = document.getElementById('try-button');

        const position = await getLocation();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const loadingSpinner = document.getElementById('loading');
        const newCardsSection = document.getElementById('new-cards');


        loadingSpinner.style.display = 'block';
         tryButton.style.display = 'none';

        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        const city = await getCityFromCoords(latitude, longitude);
        console.log(`City: ${city} `);

        if (city) {
            chagptInput = await getWeatherForCity(city);
            
            const chatgptOutput = await getChatGptResponse(chagptInput);
             
            // Fetch image URL based on the city name
            const imageUrl = await getImageUrlFromApi(chatgptOutput[0]);
            console.log(chatgptOutput);
            onNewSuggestionCreated(chatgptOutput[0],chatgptOutput[1],imageUrl);
            loadingSpinner.style.display = 'none';
            // Scroll to the newCardsSection
            newCardsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.log('Unable to determine city.');
        }
    } catch (error) {
        console.error(error);
    }
}














//########################### FOR MAP DISPLAY ##############################
// Function to get location details from the API and display on map
async function displayLocationOnMap(title) {
    try {
        const response = await axios.post('https://google.serper.dev/places', {
            q: title,
            gl:countryId
        }, {
            headers: {
                'X-API-KEY': imageAndMapApiKey,
                'Content-Type': 'application/json'
            }
        });

        const places = response.data.places;
        console.log(places);
        
        // Initialize Leaflet map
        const map = L.map('map').setView([places[0].latitude, places[0].longitude], 13);

        // Add OpenStreetMap tiles to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers for each location
        places.forEach(place => {
            L.marker([place.latitude, place.longitude])
            .addTo(map)
            .bindPopup(`<b>${place.title}</b><br>${place.address}<br>Rating: ${place.rating}`)
            .openPopup();
        });
    } catch (error) {
        console.error('Error fetching location:', error);
    }
}

// Function to update the map markers based on liked suggestions
function updateMapMarkers() {
    // Remove existing markers from the map
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add markers for each liked suggestion
    likedSuggestions.forEach(function (suggestion) {
        L.marker([suggestion.latitude, suggestion.longitude]).addTo(map);
    });
}

// Function to clear all markers from the map
function clearMap() {
    // Check if map is initialized and has the eachLayer method
    if (map && typeof map.eachLayer === 'function') {
        // Remove all layers (markers) from the map
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
    } else {
        console.warn('Map is not properly initialized or does not have the eachLayer method.');
    }
}

//########################### MAIN Function ##############################
async function main() {
    // Add an event listener for the "Give it a try" button
const tryButton = document.getElementById('try-button');
if (tryButton) {
    tryButton.addEventListener('click', displayInitialSuggestion);
}

// You can also add an event listener for the "Next" button

const nextButton = document.getElementById('newSuggestionButton');;
if (nextButton) {
    console.log(`Hello I am in main() nextButton `);
    nextButton.addEventListener('click', getNextChatGptResponse);
}
}




document.addEventListener('DOMContentLoaded', main);

main();



////////////////////////////////////////////////////////////////////////////////////////////



// async function generateAndAskQuestion() {
//     // Call GPT API to generate a question
//     const generatedQuestion = await generateQuestionWithGPT();
    

// const userResponse = await Swal.fire({
//   title: "Getting to know you better :)",
//   input: "text",
//   inputLabel: generatedQuestion,
//   generatedQuestion,
//   showCancelButton: true,
//   inputValidator: (value) => {
//     if (!value) {
//       return "Please write something!";
//     }
//   }
// });
//     // Store the user's response for future use
//     if (userResponse.isConfirmed) {
//         const answer = userResponse.value;
//         addToChatHistory('assistant', generatedQuestion);
//         addToChatHistory('user', answer);
//         Swal.fire(`Thank you !`);
//         askedQuestions.push(generatedQuestion);
//     }
// }

// Simulate GPT API call (replace with actual GPT API integration)
// async function generateQuestionWithGPT() {
//     // Simulate GPT response
//     const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
//     const prompt = 'I am developing a personalized activity recommendation app called Local Explorer. The app uses real-time geolocation and weather data to suggest activities based on the user\'s preferences and current circumstances. Generate a question to gather additional information from the user for enhancing their experience. PS: avoid these questions: ' + askedQuestions.join(', ');    // Your GPT prompt
//     const openaiData = {
//         model: 'gpt-3.5-turbo',
//         messages: [
//             { role: 'user', content: prompt },
//         ],
//         temperature: 0.9,
//         max_tokens: 256,
//     };

  

//     try {
//          // Call OpenAI API
//          const openaiResponse = await fetchData(apiEndpoint, openaiData, {
//             'Authorization': `Bearer ${apiKey}`,
//         });

//         const openaiGptResponse = openaiResponse.choices[0].message.content;

//         console.log('OpenAI Response:', openaiGptResponse);
//         return openaiGptResponse;
//     }catch (error) {
//         console.error(error);
//     }
    
// };




// Initialize feedbackArray when the script is loaded
// Function to clear localStorage on page load
window.onload = function() {
    localStorage.removeItem('userFeedback');
};
