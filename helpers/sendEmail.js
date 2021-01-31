const config = require('./../config')
const nodemailer = require('nodemailer')


module.exports = (email, code) => {
    return new Promise(async (resolve, reject) => {
        try {
            let smtp = await nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: config.mailer.username,
                    pass: config.mailer.password
                }
            })

            let mailOptions = {
                to: email,
                subject: 'Password Recovery',
                from: config.mailer.username,
                text: 'Recovery code ' + code + ' expires in 1 hour'
            }

            smtp.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })

        } catch (e) {
            reject(e)
        }
    })
}
