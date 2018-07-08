var express = require('express');
var router = express.Router();
var http = require('request-promise-json');
var Promise = require('promise');
var UrlPattern = require('url-pattern');
var queryString = require('query-string');
var config = require('config');
var session;
var api_url = new UrlPattern('(:protocol)\\://(:host)(:api)/(:operation)');
var _apis = config.get('APIs');


router.get('/', function (req, res) {
  session = req.session;

  setGetCustomersOptions(req, res)
    .then(sendApiReq)
    .then(sendResponse)
    .catch(renderErrorPage)
    .done();

});

function setGetCustomersOptions(req, res) {
  var qs = queryString.stringify(req.query);
  var customer_url = api_url.stringify({
    protocol: _apis.protocol,
    host: _apis.customer.service_name,
    api: _apis.customer.base_path,
    operation: "customer/search?"+qs
  });
  var getCustomer_options = {
    method: 'GET',
    url: customer_url,
    strictSSL: false,
    headers: {}
  };
  return new Promise(function (fulfill) {
    fulfill({
      options: getCustomer_options,
      res: res
    })
  });
}


function sendApiReq(function_input) {
  var options = function_input.options;
  var res = function_input.res;

  console.log("MY OPTIONS:\n" + JSON.stringify(options));

  // Make API call for Customer data
  return new Promise(function (fulfill, reject) {
    http.request(options)
      .then(function (result) {
        //console.log("Order call succeeded with result: " + JSON.stringify(result));
        fulfill({
          data: result,
          res: res
        });
      })
      .fail(function (reason) {
        console.log("Customer call failed with reason: " + JSON.stringify(reason));
        reject({
          err: reason,
          res: res
        });
      });
  });
}

function sendResponse(function_input) {
  var data = function_input.data;
  var res = function_input.res;

  // Render the page with the results of the API call
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
}

function renderErrorPage(function_input) {
  var err = function_input.err;
  var res = function_input.res;

  // Render the error message in JSON
  res.setHeader('Content-Type', 'application/json');
  res.send(err);

}


module.exports = router;
