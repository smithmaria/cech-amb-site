const {setGlobalOptions} = require("firebase-functions");
const logger = require("firebase-functions/logger");

setGlobalOptions({ maxInstances: 10 });

const {initializeApp} = require("firebase-admin/app");

initializeApp();

const {deleteUsers} = require("./src/deleteUsers");

exports.deleteUsers = deleteUsers;
