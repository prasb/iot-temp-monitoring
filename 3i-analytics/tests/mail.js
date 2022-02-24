"use strict";
const nodemailer = require("nodemailer");

async function sendEmail(ctx) {
  const transporter = nodemailer.createTransport({
    host: "172.16.210.10",
    port: 25,
    secure: false,
  });

  const loc = "MainServer";

  let fromAddress = "";

  if (loc == "MainServer") {
    fromAddress = "2aflrtemprtmntr@softtek.com";
  } else {
    fromAddress = "stkind2flrbtempalert@softtek.com";
  }

  const mailResponse = await transporter.sendMail({
    from: fromAddress,
    to: "sid@zethic.com",
    subject: "Testing",
    html: "Testing",
  });

  console.log("mail response", mailResponse);

  return { success: true };
}

sendEmail();
