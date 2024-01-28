# ${This\ is\  {\color{red}Keiken\ Technical\ Test}}\ $

### Additional Notes :
:loudspeaker: [Please find a brief video of this app](https://drive.google.com/file/d/14Ra52X4d1Ne17f-7hYPrXLUgk1eJNQke/view)  , and don't overlook the option to enhance video quality in the parameters. This not only boosts the overall quality of the app but also ensures a more immersive viewing experience :smiley:

- To run this code, just download the repository, open it in vs code and click on Go live 

## 🚀 Why did I picked the second project :question:
I opted for the second challenge as it presents an enticing level of complexity. As someone who thrives on challenges :muscle:, it have waken my inner drive to deliver my best and produce high-quality work. 


## 🌟 What is Local Explorer?


 This project, Local Explorer,is about the development of a sophisticated AI-driven web application designed to offer personalized activity recommendations based on the user's real-time location, weather conditions, and the current time. The challenge lies in creating a highly user-centric interface that seamlessly integrates with geolocation and weather APIs, employs GPT-3 for generating diverse and contextually relevant activity suggestions, incorporates Google Maps for location visualization, and dynamically adapts recommendations based on user interactions.
 
## 🚀 Features

- **Smart Recommendations:** Powered by cutting-edge AI (thanks, GPT-3!), Local Explorer crafts personalized activity suggestions based on your current location, real-time weather conditions, and the magic of the moment.

- **Seamless Geolocation:** This app smoothly integrates with geolocation services, ensuring you get the most accurate suggestions wherever you are.

- **Google Maps Magic:** The Google Maps integration provides real-time locations, ensuring your journey is as smooth as your latte.

- **Dynamic Suggestions:** Local Explorer keeps it fresh by dynamically updating suggestions based on your interactions, making every exploration unique.

## 🎨 User-Centric UI/UX

- **Swipe into Fun:** Swipe through activities effortlessly with our intuitive, swipe-based interface. The user journey should be as smooth as a slide!

- **Tech-Savvy or Not:** Whether you're a tech guru or just getting started, the UI caters to all levels of tech-savviness. Everyone deserves a seamless experience.

- **Visually Appealing:** Feast your eyes! I incorporated visually appealing elements and smooth transitions to enhance the user's journey through Local Explorer.


## :key: API Used For This Project :

[Open Weather API](https://rapidapi.com/worldapi/api/open-weather13)

- OpenWeatherMap provides a weather data API that developers can use to integrate weather information into their applications.
- I utilized this API immediately after obtaining the longitude and latitude information from the user's navigator.


[Reverse Geocoding and Geolocation Service](https://rapidapi.com/Noggle/api/reverse-geocoding-and-geolocation-service)


- This API translates latitude and longitude coordinates into detailed location information, including addresses, landmarks, and place names.

- I employed this API to obtain the city information of the user's navigator based on the given longitude and latitude. This was necessary as the Open Weather API exclusively accepts city names as inputs to retrieve weather information.

[Chatgpt](https://rapidapi.com/rphrp1985/api/chatgpt-42)

- Chagpt API is giving developers access to cutting-edge language (not just chat!) and speech-to-text capabilities. 

[serper API](https://serper.dev/)

- Location Data Retrieval: The Serper API allows me to retrieve longitude and latitude coordinates based on search queries. This is particularly useful for my local explorer application because it enables me to search for specific places or activities mentioned by users and obtain their geographic coordinates. These coordinates are then used to display the location on a map.

- Image Retrieval: Additionally, the Serper API provides functionality for retrieving relevant images based on search queries. In my application, this feature is utilized to fetch images related to the suggested activities. These images enhance the user experience by providing visual context for the recommended activities, making them more appealing and informative.

## Libraries Used For This Project :
[Leaflet.js](https://leafletjs.com/) is a lightweight and versatile JavaScript library for interactive maps. It's beneficial for your application because:

- Ease of Use: Leaflet.js is easy to integrate and use, making it accessible for developers of all levels. Its simple and intuitive API allows you to quickly create interactive maps with minimal effort.

## :bulb: The customization of recommendations is achieved through several key steps:

- API Integration: I've integrated multiple APIs to gather relevant data for personalized recommendations. These APIs provide information such as weather conditions, location details, images, and places of interest.

- User Feedback Handling: The application allows users to provide feedback on suggested activities through a like/dislike mechanism. This feedback is stored locally using localStorage, enabling the app to learn user preferences over time.

- ChatGPT Integration: ChatGPT is used to generate personalized activity suggestions based on user input, weather conditions, and location data. It engages users in conversation, solicits feedback, and provides tailored recommendations.

- Dynamic Content Display: New suggestions are dynamically displayed in a carousel format on the user interface. Each recommendation includes a title, description, and relevant image fetched from the API. Users can interact with these recommendations by liking or disliking them. For the liked activities, I display the map which also indicates the address for the specific activity and its rating.

- Real-Time Map Display: The application leverages Leaflet.js to display interactive maps with markers indicating recommended activity locations. The map is updated dynamically based on user interactions and newly generated recommendations.

### Additional Notes :
:loudspeaker: [Please find a brief video of this app](https://drive.google.com/file/d/14Ra52X4d1Ne17f-7hYPrXLUgk1eJNQke/view) 

