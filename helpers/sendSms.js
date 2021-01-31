const config = require('./../config')
const smsConfig = config.sms;
const Nexmo = require('nexmo');


module.exports = (text, to) => {
    return new Promise(async (resolve, reject) => {
        try {
            const nexmo = new Nexmo({
                apiKey: smsConfig.api_key,
                apiSecret: smsConfig.api_secret,
            });
            nexmo.message.sendSms(smsConfig.from, to, text, (err, responseData) => {
                if (err) {
                    reject({success:false, error:err})
                } else {
                    if (responseData.messages[0]['status'] === "0") {
                        resolve({success:true})
                    } else {
                        reject({success:false, error:responseData.messages[0]['error-text']})
                    }
                }
            })

        } catch (e) {
            reject(e)
        }
    })
}
