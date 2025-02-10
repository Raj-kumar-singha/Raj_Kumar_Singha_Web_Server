const dotenv = require('dotenv');

dotenv.config();

exports.PORT = process.env.PORT || 5050;
exports.DB_URL = process.env.DB_URL;
exports.googlePwd = process.env.GOOGLE_APP_PASSWORD;
exports.myApp = process.env.GOOGLE_APP_NAME;
exports.myMail = process.env.MAIL_ID;
