'use strict';

const {
    sanitizeEntity
} = require('strapi-utils');

const formatError = error => [{
    messages: [{
        id: error.id,
        message: error.message,
        field: error.field
    }]
}];

module.exports = {
    index: async ctx => {

        if (!ctx.state.user) {
            return ctx.unauthorized(`You're not allowed to perform this action!`);
        }

        const {
            oldPassword,
            password,
            confirmPassword
        } = ctx.request.body;
        const {
            id
        } = ctx.state.user;

        if (!oldPassword) {
            return ctx.badRequest(
                null,
                formatError({
                    id: 'Auth.form.error.oldPassword.provide',
                    message: 'Please provide your old password.',
                })
            );
        }
        
        if (!password) {
            return ctx.badRequest(
                null,
                formatError({
                    id: 'Auth.form.error.password.provide',
                    message: 'Please provide your new password.',
                })
            );
        }
        
        if (!confirmPassword) {
            return ctx.badRequest(
                null,
                formatError({
                    id: 'Auth.form.error.password.provide',
                    message: 'Please provide your new password confirmation.',
                })
            );
        }
        
        if (
            password &&
            confirmPassword &&
            password !== confirmPassword
        ) {
            return ctx.badRequest(
                null,
                formatError({
                    id: 'Auth.form.error.password.matching',
                    message: 'New Passwords do not match.',
                })
            );
        }

        const user = await strapi.query('user', 'users-permissions').findOne({ id });
        const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(oldPassword, user.password);
        if (!validPassword) {
            return ctx.badRequest(
               null,
                formatError({
                    id: 'Auth.form.error.invalid',
                    message: 'Identifier or password invalid.',
                })
            );
        }

        const passwordHash = await strapi.plugins['users-permissions'].services.user.hashPassword({
            password,
        });
        await strapi
            .query('user', 'users-permissions')
            .update({
                id
            }, {
                resetPasswordToken: null,
                password: passwordHash
            });

        return ctx.send({ success: true });
    }
};