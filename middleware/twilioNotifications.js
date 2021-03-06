var twilioClient = require('../twilioClient');
var viewers = require('../config/viewers.json');

function formatMessage(errorToReport) {
  return 'It appears the server is' +
    'having issues. Exception: ' + errorToReport +
    '. Go to: http://newrelic.com ' +
    'for more details.';
};

exports.notifyOnError = function(appError, request, response, next) {
  viewers.forEach(function(viewer) {
    var messageToSend = formatMessage(appError.message);
    twilioClient.sendSms(viewer.phoneNumber, messageToSend);
  });
  next(appError);
};