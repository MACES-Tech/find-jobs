
const nodemailer = require('nodemailer');

// Create a SMTP transporter object
exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

