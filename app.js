'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const INTENT_WELCOME = "input.welcome";
const INTENT_CHECK_BALANCE = "check_balance";

app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  console.log('Request headers: ' + JSON.stringify(req.headers));
  console.log('Request body: ' + JSON.stringify(req.body));

  function init (assistant) {
    assistant.data.cashMoney = 2000;
    assistant.data.bills = [
      { recepient: "Anime Mystery Box", cost: 50.00 },
      { recepient: "University of Waterloo Tuition Bill", cost: 8000.00 },
      { recepient: "Waterloo North Hydro", cost: 120.00 }
    ];
    assistant.ask('Sup fam, Budgetbot at your service.');
  }

  function checkBalance (assistant) {
    assistant.ask("Your account balance is " + assistant.data.cashMoney + " dollars.");
  }

  let actionMap = new Map();
  actionMap.set(INTENT_WELCOME, init);
  actionMap.set(INTENT_CHECK_BALANCE, checkBalance);

  assistant.handleRequest(actionMap);
});

if (module === require.main) {
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;
