// const sgMail = require('@sendgrid/mail');


// const sendGridApiKey = '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'

// sgMail.setApiKey(sendGridApiKey)



// const msg = {
//   to: 'hasyjay@yahoo.com',
//   from: 'jacksas540@gmail.com',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>'
// };
// sgMail.send(msg);

const nodemailer = require('nodemailer')



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.gmail,
    pass: process.env.password
  }
});
let sendWelcomeEmail = (name, email) => {
  
  
  var mailOptions = {
    from: 'jacksas540@gmail.com',
    to: email,
    subject: 'WELCOME EMAIL',
    text: `welcome to our website, update us about the user experience on the long run ${name}`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
 
}

let cancelationEmail = (name, email) => {
  var delOptions = {
    from: 'jacksas540@gmail.com',
    to: email,
    subject: 'Account Deleted',
    text: `Your account was delleted succesfuly ${name}`
  };
  transporter.sendMail(delOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 

}

module.exports = {
  sendWelcomeEmail,
  cancelationEmail
}

