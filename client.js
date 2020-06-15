const axios = require('axios')
const constants = require('./constants');


const ax = axios.create({
    baseURL: 'http://'+constants.HOSTNAME+':'+constants.PORT,
    timeout:1000
  });


module.exports = {
    httpPOST: function (path,data) {
      return ax.post(path, data)
        .then(function (response) {
          return response
        })
        .catch(function (error) {
          console.log("An error occurred. Check server")
        });
    },

    httpGET: function (path){
      return ax.get(path)
        .then(function (response) {
          return response
        })
        .catch(function (error) {
          console.log("An error occurred. Check server")
        });
    }
}
  
