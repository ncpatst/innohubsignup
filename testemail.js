var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "Outlook365",
    host: 'smtp.office365.com',
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'signup-notification@ncpachina.org',
        pass: 'fJG7H3,W'
    }
});


var n = "gedfn cegrnfdmn cegnrufids cgerxnfsduhcm gxnerfsdhc"
var mailOptions = {
    from: 'signup-notification@ncpachina.org',
    to: '2250027@ncpachina.org',
    cc:'2240317@ncpachina.org',
    subject: 'Innohub signup',
    text: n,

};													
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error.message)
    }
});