const config = require("config");
const mail = require("nodemailer");
const trans = mail.createTransport(config.get("mail"));

function send(to, subject, text, verifyToken) {
  var mailOptions = {
    from: config.get("mail.auth.user"),
    to: to,
    subject: subject,
    // text: text,
    html: `
    <div style=\" width:100%;height:100%; text-align:center;\"> 
    <p>Please Verify Your Email by clicking the button below.</p>
    <a style=\" width:150px; height:45px; color:white;background:blue;\" href=\"${config.get(
      "baseurl"
    )}/api/user/verify/${verifyToken}\">Verify Email</a>
    </div>`,
  };
  trans.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
  });
}

// const html =

module.exports = send;