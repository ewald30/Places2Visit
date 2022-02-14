# IonicMobile

## Table of contents
* [Introduction](#introduction)
* [Technologies](#technologies)
* [Install](#install)
* [Run the app](#run-the-app)
* [General info](#general-information)
* [Description](#description)

## Introduction
Simple web application that you can use to browse places you should visit posted by other users, or even add your own places that you think are worth visitting. The project's main goal was to experiment with integrating different technologies such as Ionic React for front-end and Node.js for back-end. 

## Technologies
- Ionic: 5.0
- React: 16.13
- Typescript 3.8
- Axios 0.20
- React Google Maps 9.4

## Install
In order to run the application, the node modules have to be installed for both the server and the client. To do that, in a terminal window navigate to `(location of the project)/Client` and run `npm install`. Do the same for the **Server** project, and check that all packages are installed correctly (there should be no errors during this step).

## Run the app
Nabigate again to both the location of the **Client** and the **Server**. Using `npm start` you can back-end the server and after that you can start the front-end. When starting the front-end project you will be promted to run the client on port *3001* insted of *3000* since *3000* is taken by the server, just type **y** in the console.

## General Information
The application is structured in two separate projects, one for front-end and one for back-end. Both of them have to be running, You can find in the [Install](#install) section how to install the app and on the [Run the app](#run-the-app)section how to run it.

The front-end application is responsive but was build with running mainly on mobile devices, some elements don't scale that well to desktop resolutions. Using the browser devtools I suggest trying different resolutions to see how the app adapts to them, but in my opinion it looks the best on the following devices: Iphone 8, Ipad, Anything with 1920 x 1080p resolution. These are the screens that I dedicated most of the time in order to make the app look good on them, for other screen sizes there might be some issues, but that wasn't the project's goal. Also the application features a dark/light theme and I strongly recoomend trying both, this can be done in Chrome by navigating to **Rendering** tab and setting **Emulate CSS media feature prefers-color-scheme** to any of the listed options.

## Description
When the application starts, the user is promted to authenticate to a previously created account or create a new one. For demonstration purposes you can use the account:
>username: ewald

>password: admin

The application uses **JWT (Java Web Token)** to authenticate users and it stores the generating token in the Local Storage so only one authentication is needed, after the token is stored and until the token will expire the useer can close the tab, even the browser and the next time they will visit the application they will be automatically authenticated. 

After authtentication, the user is redirected to the **Home page**. Here the user can browse their own posted locations, can add a new one by clicking the **+** button in the bottom-right corner, or they can edit a location by clicking on it. Clicking on a location or the **+** button will trigger the navigation to another menu where the user can input all the necessary information about the location such as, a title, a description, the geographic location (using the Google Maps api) or a photo of the location (can be added from the gallery or you can take a picture on the spot).

The user can choose to navigate to other pages using the tabs on the bottom. For example by clicking the rightmost tab the user navigates to **Browse** page, here the user can browse all the locations added by all the accounts existing in the application, the list uses pagination and will load the locations while the user scrolls the page. There are some mock locations addedd by me to demonstrate this features (please note that some of them might be duplicated). The user can click on a location and a pop-up will expand containing the title, the full description of the place, the ticket price, and an option for viewing the place on the map.

The other two tabs are for filtering/searching. When searching, the app will use the written keyword to search for matches in the descriptions of the places and will update the results in real-time. As there was for browsing, the user can also click on the found place to view it's details and it's location on the map.

On the back-end side, the application uses **nedb**, a NoSQL sollution for storing data. The data is stored into two separate JSON files, one containing the users and the other containing the places. I decided on using a NoSQL approach mainly because of the simple structure of the application (if we were to create a schema, there would be only two tables with a one-to-many relation between them). The api is structured such that only the endpoints for authentication are exposed publicly, the endpoints for accessing the location data require a **JWT token** to be includedd in the **Authentication** header of the request. The token is created on authentication and after, it is included in the headers of any request to the server.


