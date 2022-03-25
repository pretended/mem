const functions = require("firebase-functions");

exports.helloUser = functions.auth.user().onCreate((user) => {
    const email = user.email; // The email of the user.
    const displayName = user.displayName; // The display name of the user.
    functions.logger.info("New user with email " + email + " and displayName " + displayName, {structuredData: true});
});
