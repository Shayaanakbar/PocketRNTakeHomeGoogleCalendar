const functions = require("firebase-functions");
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar('v3');

const googleCredentials = require('./credentials.json');

const ERROR_RESPONSE = {
  status: "500",
  message: "There was an error adding an event to your google calendar!"
}
const TIME_ZONE = "EST";

exports.addEventToCalendar = functions.https.onRequest((request, response) => {
  const eventData = {
    eventName: request.body.eventName,
    description: request.body.description,
    startTime: request.body.startTime,
    endTime: request.body.endTime
  };
  const oAuth2Client = new OAuth2(
      googleCredentials.web.client_id,
      googleCredentials.web.client_secret,
      googleCredentials.web.redirect_uris[0]
  );

  oAuth2Client.setCredentials({
    refresh_token: googleCredentials.refresh_token
  });

  addEvent(eventData, oAuth2Client).then(data => {
    response.status(200).send(data);
    return;
  }).catch(err => {
    console.log('Error adding event' + err.message);
    response.status(500).send(ERROR_RESPONSE);
    return
  });
});
