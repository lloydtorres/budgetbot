'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const INTENT_WELCOME = "input.welcome";
const INTENT_CHECK_BALANCE = "check_balance";
const INTENT_CHECK_BILLS = "check_bills";

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

  function checkBills (assistant) {
    let billsArray = assistant.data.bills;
    var statement = "Good job, no bills are due for this month!";
    if (billsArray.length > 0) {
      statement = "The following bills are due by the end of the month: ";
      for (var i=0; i < billsArray.length; i++) {
        let bill = billsArray[i];
        statement = statement + bill["recepient"] + " at " + bill["cost"] + "dollars";
        if (i == billsArray.length - 1) {
          statement = statement + ".";
        } else if (i == billsArray.length - 2) {
          statement = statement + ", and ";
        } else {
          statement = statement + ", ";
        }
      }
    }
    assistant.ask(statement);
  }

  let actionMap = new Map();
  actionMap.set(INTENT_WELCOME, init);
  actionMap.set(INTENT_CHECK_BALANCE, checkBalance);
  actionMap.set(INTENT_CHECK_BILLS, checkBills);

  assistant.handleRequest(actionMap);
});

if (module === require.main) {
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;
