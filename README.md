# webApp
Link to github-https://github.com/avivdimri/webApp. \
Link for the presentation of Web App- \

A Web app server that implement a REST-API for the clients,and a single web-page.\
The server is support parallelism requests.which given a flight data - find irregular behavior at the flight and report it to the client.\
There is tow possible ways to connect to the server -\
A. by the client web page appliction - the client just need to upload the files and the app will connect to the server by itself.\
B.by himself - the client could connect dircet to the server and ask for the answers.

## Collaborators
This program was developed by four student, Ori Choen, Ori Abramnovich, Aviv Dimri and Yosef Berebi, CS students from Bar-Ilan university, Israel.

## Code Design:
Ue use at the node.js technology for the server app,and the client web-page with html&css.all this by the MVC architecture. 
## REST-API:
The sever is bind to the port - 8080 and the ip his your localhost if you downloads this project to your own computer.\
There is a few http functions that we are support and we will exstend for each one of them which type it and what it is url -\
1.GET - '/' - by the '/' the client will get the web-page that he can connect to the server from there - \
The client shold upload tow files - train and test file,and also to choose with which algoritem he want to test the flight.\
There is tow possible algoritem -\
A. Line Regression.\
B. MinCircle.\
After uploading the files - the server return him which features has irregular activity and went the devion start and when its ended.

2.GET- /api/amodel - given a id of the client the server will return is status by a json.

3.GET- /api/amodels - the server will return all the clients that where connect to him by a json.

4.POST -/api/anomaly -the client should upload tow files - if just one of them will upload the server will return an error,\
and the server will return the irregular activity by json to the client.

5.DELETE - /api/model - given an id of the client - the server will erase him from his list of models.

## Structure project:
There is a few folders:

1.In the view folder you have the the view control for the web-page.

2.In the Model folder - there is the model server that do all the work behind.

3.In node_models folder there is all the liberys you need.

4.In the files folder - there the diles you may upload to the server - train and test file.

# Installation for running the App:
1. Use git clone https://github.com/avivdimri/webApp.git to downloads the project.
2. Make sure you already has a node on your computer - if not you may downloads from here for free - https://nodejs.org/en/download/.you may use any operation systeam you want.
3. Use node contorller.js to run the server.
4. Try to connect the server from any browser or progream language to connect the server by port - 8080,you may change it if you want.
5. You may use one or any of the function we declare at the REST-API above.







