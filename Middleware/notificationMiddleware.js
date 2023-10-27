const serverAcount = require(".././config/serverAcount.json");
const notificationModel = require("../Model/notificationModel");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serverAcount),
});

exports.sendPushNotification = async (message) =>{
  let notificationObject = message;
  admin
    .messaging()
    .sendMulticast(notificationObject)
    .then((response) => {
      console.log("Response", response);
    })
    .catch((error) => {
      console.log("Error Sending Message:", error.message);
    });
}
