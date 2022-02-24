'use strict';
const nodemailer = require('nodemailer')
const template = require('./template');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async sendEmail(ctx) {
        const {
            type,
            condition,
            PV01,
            PV02,
            maxTemp,
            minTemp,
            maxHumidity,
            minHumidity,
            loc,
            uid,
            ts,
        } = ctx.request.body;
        
        const devices = await strapi.query('device').find();
        const device = devices.find((d) => d.uid === uid);

        if (!device) {
            return { success: true };
        }

        const {
            name,
            configuration: { notifyEmail, fromAddress },
            mailSettings: {
                host,
                port,
                username,
                password,
                autoTLS,
                authentication,
            }
        } = device;

        const auth = {};
        if (authentication) {
            auth.user = username;
            auth.pass = password;
        }
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: autoTLS,
            auth,
        });

        const msg = condition === 'Neutral'
            ? `${ name }: ${ type } back to normal`
            : `${ name }: Alert ${ type } is ${ condition }`;

        await transporter.sendMail({
            from: `${ name } THUM Alert <${ fromAddress }>`,
            to: notifyEmail.split(';').join(', '),
            subject: msg,
            html: template(ts, msg, {
                value: PV01,
                high: maxTemp,
                low: minTemp
            }, {
                value: PV02,
                high: maxHumidity,
                low: minHumidity 
            }),
        })

        return { success: true };
    }
};
