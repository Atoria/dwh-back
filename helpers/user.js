const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('./../modules/model').User;
const jwt = require('jsonwebtoken');
const jwt_secret = require('./../config').jwt_secret


validateUserRegistration = async function (data) {
    let errors = [];
    if (data.password !== data.repeat_password) {
        errors.push({message: "Password does not match"});
    }

    if (!data.hasOwnProperty('first_name') || !data.hasOwnProperty('last_name') || !data.hasOwnProperty('password') ||
        !data.hasOwnProperty('repeat_password') || !data.hasOwnProperty('email') || data.password.toString().trim().length < 6 ||
        !data.hasOwnProperty('phone_number') || !isNumber(data.phone_number)) {
        errors.push({message: "Invalid request"});
    }

    for (let key in data) {
        if (data[key].toString().trim().length === 0) {
            return {message: "Please fill all the fields"}
        }
    }

    let user = await User.findOne({
        where: {
            phone_number: data.phone_number
        }
    });

    if (user) {
        errors.push({message: 'User with this number already exists'});
    }

    user = await User.findOne({
        where: {
            email: data.email
        }
    });

    if (user) {
        errors.push({message: 'User with this email already exists'});
    }

    if (errors.length > 0) {
        return {success: false, errors: errors};
    }

    return {success: true};
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}


getCurrentUser = async function (token) {
    try {
        if (!token) {
            return null;
        }
        let user = await jwt.verify(token, jwt_secret);
        return await User.findOne({where: {id: user.id}});

    } catch (e) {
        return null
    }
}





module.exports = {
    getCurrentUser,
    validateUserRegistration
}
