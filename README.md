Stateless Microservice

It has the implementation of three microservices, 1 public and 2 protected. The public api is for login which accepts any credentials and returns a token. This token is used for the remaining 2 protected api's.

Usage
-----

Public api
----------
Method - post
/api/login

This api takes the inputs username and password and returns a token for the accessing of the 2 protected api's.

Private api's
-------------
To access these api's token is a must. If the token doesn't match or is expired we cannot acces the api's.

Method - post
/api/patch-json

This api takes the json object as 'jsondata'and patch json object as 'patchdata' variables respectively. Here the json object is patch with the patch json object according to the operations provided and returns the resulting json object.

Method - post
/api/thumbnail

This api takes the imageurl as the input, downloads the image from the given url to a local destination, resizes the image to 50x50 pixles and returns the resulting thumbnail.

Setup
-----

Use 'npm install' command to download all the required libraries.

Once the libraries are installed use 'npm start' command to start the application.

The application will be running on http://localhost:4000.
