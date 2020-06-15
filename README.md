### At a glance
* All requirements from requirements.docx are implemented. 
* app.js is the server/API. I used Express, since it is the de facto standard for these kinds of projects. 
* client.js is the client. I used axios for the HTTP requests, since the requirement of this exercise was building the API, not the client side. 
* test.js contains testing code. I used Mocha and Chai for testing. 
* No GUI.

### Functionality to be added
* Handling user error more gracefully. This server only works using the "happy path". Anything else may require a server restart. 
* No HTTPS
* Turning off the discount code by the admin. I added a boolean to make it trivial, but it is not accessible. 
* Authentication
* GUI


### Assumptions
* Started with default n value and discount code. Since this server is supposed to be updating the discount functionality automatically, I thought that made sense. No discount until the number of purchases required is reached. 
* Purchase is made despite invalid discount code. 
* Number of items per purchase is ignored; each purchase only counts once. 
* Discount code can be used multiple times, but only one discount code is active in the store at a time. 
* If admin changes n, the discount will be immediately applied if the required number of purchases have been made. 

### Setup
Node version v13.12.0
npm install

### Usage
The data from the server is printed to the console.  Client.js has convenience functions for making requests to the server. They are used in test.js for testing. The test script relies on being the first query to hit the server, since the start is one of the only times there is no active discount code. 

##### To start the server
node app.js

##### To run the tests
npm test
Alternatively, here's a working example using cURL:

curl --header "Content-Type: application/json" --request POST --data '{"username":"dummy user"}' http://localhost:3000/customer/login

Browser is viable too:
http://localhost:3000/admin/report
