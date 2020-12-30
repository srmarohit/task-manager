const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const subscribeMail = (email, name) => {
    const msg = {
        to: email,
        from: 'srmarohit@gmail.com',
        subject: 'Thank You for Joining Us.',
        text : `Hi ${name}, Thank you for subscribing us .We always touch with you.`
    }

    sgMail.send(msg);
}

const unsubscribeMail = (email, name) => {
    const msg = {
        to: email,
        from: 'srmarohit@gmail.com',
        subject: 'Unsubscription Alert.',
        text: `Hi ${name}, You have unsubscribed us . and i hope you to come soon .`
    }

    sgMail.send(msg);
}

module.exports = {subscribeMail, unsubscribeMail};