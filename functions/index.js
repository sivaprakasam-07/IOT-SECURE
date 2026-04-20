const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Your credentials
const TWILIO_ACCOUNT_SID = "ACdc03cc5c2316dcfa0e534f99552eeed5";
const TWILIO_AUTH_TOKEN = "00c1b1f214bd9b89f58e32c4e28cc262";
const TWILIO_PHONE = "+12182768609";
const YOUR_PHONE = "+918072075595";
const SENDGRID_API_KEY = "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";
const YOUR_EMAIL = "tamilmanisivaprakasam5@gmail.com";

sgMail.setApiKey(SENDGRID_API_KEY);
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Monitor Temperature
exports.monitorTemperature = functions.database
    .ref("/sensors/temperature")
    .onWrite(async (change, context) => {
        const temperature = change.after.val();
        if (temperature >= 40) {
            // Send SMS
            await twilioClient.messages.create({
                body: `🚨 ALERT! High Temperature detected: ${temperature}°C`,
                from: TWILIO_PHONE,
                to: YOUR_PHONE,
            });
            // Send Email
            await sgMail.send({
                to: YOUR_EMAIL,
                from: YOUR_EMAIL,
                subject: "🚨 IoT Alert - High Temperature!",
                text: `High Temperature detected: ${temperature}°C. Please check immediately!`,
            });
            console.log("Temperature alert sent!");
        }
        return null;
    });

// Monitor Gas
exports.monitorGas = functions.database
    .ref("/sensors/gasLevel")
    .onWrite(async (change, context) => {
        const gasLevel = change.after.val();
        if (gasLevel >= 300) {
            // Send SMS
            await twilioClient.messages.create({
                body: `🚨 ALERT! High Gas Level detected: ${gasLevel} ppm`,
                from: TWILIO_PHONE,
                to: YOUR_PHONE,
            });
            // Send Email
            await sgMail.send({
                to: YOUR_EMAIL,
                from: YOUR_EMAIL,
                subject: "🚨 IoT Alert - Gas Leak Detected!",
                text: `High Gas Level detected: ${gasLevel} ppm. Please check immediately!`,
            });
            console.log("Gas alert sent!");
        }
        return null;
    });

// Monitor Motion
exports.monitorMotion = functions.database
    .ref("/sensors/motion")
    .onWrite(async (change, context) => {
        const motion = change.after.val();
        if (motion === 1) {
            // Send SMS
            await twilioClient.messages.create({
                body: `🚨 ALERT! Motion Detected in monitored area!`,
                from: TWILIO_PHONE,
                to: YOUR_PHONE,
            });
            // Send Email
            await sgMail.send({
                to: YOUR_EMAIL,
                from: YOUR_EMAIL,
                subject: "🚨 IoT Alert - Motion Detected!",
                text: `Motion has been detected in the monitored area. Please check immediately!`,
            });
            console.log("Motion alert sent!");
        }
        return null;
    });