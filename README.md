# webApp
Link to github-https://github.com/avivdimri/webApp. \
Link for the presentation of Web App- \

A Web app server that implements a REST-API for the clients,and a single web-page.\
The server supports parallelism requests. which given a flight data - find irregular behavior at the flight and report it to the client.\
There is two possible ways to connect to the server -\
1. By the client web page appliction - the client just need to upload the files and the app will connect to the server by itself.\
2. By himself - the client could connect dircet to the server and ask for the answers.

## Collaborators
This program was developed by four student, Ori Choen, Ori Abramnovich, Aviv Dimri and Yosef Berebi, CS students from Bar-Ilan university, Israel.

## Code Design:
We use with the node.js technology for the server app, and the client web-page with html&css. all this by the MVC architecture. 

## REST-API:
The sever is bind to the port - 8080 and the ip is your localhost if you download this project to your own computer.
There are a few http functions that the API supports and  will extend for each one of them which type is it and what it is url.
1. GET - '/' - by the '/' the client will get the web-page that he can connect to the server from there - \
The client shold upload two files - train and test file, and also to choose  which algoritem he want to test the flight.\
There are two possible algoritems -\
A. Line Regression.\
B. MinCircle.\
After uploading the files - the server return him which features have irregular activity and when the devion started and when its ended.

2. GET- /api/amodel - given a id of the client the server will return is status by a json, the given id should by at the query with the name 'model_type'.

3. GET- /api/amodels - the server will return all the clients that where connect to him by a json.

4. POST -/detect -the client should upload two files - if just one of them will upload the server will return an error,\
the names of the files should be at the body request by the name - train and test. And the server will return the irregular activity by json to the client.

5. DELETE - /api/model - given an id of the client - the server will erase him from his list of models.

## Structure project:
There are a few folders:

1.In the view folder you have the the view control for the web-page.

2.In the Model folder - there is the model server that do all the work behind.

3.In node_models folder there are all the liberys you need.

4.In the files folder - there are the files you may upload to the server - train and test file.

# Installation for running the App:
1. Use git clone https://github.com/avivdimri/webApp.git to downloads the project.
2. Make sure you already has a node on your computer - if not you may downloads from here for free - https://nodejs.org/en/download/.you may use any operation systeam you want.
3. Use node contorller.js to run the server.
4. Try to connect the server from any browser or progream language to connect the server by port - 8080,you may change it if you want.
5. You may use one or any of the function we declare at the REST-API above.

## UML:
We can see in the UML below of the App which based on the MVC architecture.The User can use in thw web app(The View) to send http request to the the controller. Then the controller which implements the REST-API, which mentioned above, and activate the Model to make all the calculations behinds. 
Then the model return all the relevant information to the controller and update the all the data.
Finally the controller send back to the View the relevant html with the response and the Browser parse the View and show to the User the response of the server.
 
In our app,the request of the User can be the home page of the web app,or the http post request to upload the files and to request the anomalies in the test. 
The controller call to the model(Anomaly detector) which find the relevant anmalies and return to the controller.
The controller create dynamic table accordingly to the data which he got from the model and send it to the view and show the relevant anomalies to the User.


![UML](https://user-images.githubusercontent.com/80414213/120098860-f062b300-c140-11eb-87eb-0e46f113292d.png)





