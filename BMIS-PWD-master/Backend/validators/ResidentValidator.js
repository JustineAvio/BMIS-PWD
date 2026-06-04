const Joi = require('joi');

const eighteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

const AddResidentSchema = Joi.object({
    GivenName: Joi.string().trim().required().messages({
        'string.empty': 'First name is required.'
    }),
    MiddleName: Joi.string().allow('', null).trim(),
    LastName: Joi.string().trim().required().messages({
        'string.empty': 'Last name is required.'
    }),
    Sex: Joi.string().valid('Male', 'Female', 'Prefer not to say')
        .required()
        .messages({
            'any.only': 'Please select a valid gender.',
            'any.required': 'Sex is a required field.'
        }),
    Birthday: Joi.date()
        .less('now')
        .max(eighteenYearsAgo)
        .required()
        .messages({
            'date.base': 'Please enter a valid date.',
            'date.max': 'Resident must be at least 18 years old.',
            'any.required': 'Birthday is required.'
        }),
    PWD: Joi.string().required().messages({
        'string.empty': 'Please specify PWD status.'
    }),
    email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Please provide a valid email address.'
    }),
    ContactNo: Joi.string().pattern(/^[0-9]+$/).length(11).required().messages({
        'string.pattern.base': 'Contact number must only contain numbers.',
        'string.length': 'Contact number must be exactly 11 digits.'
    }),
    Address: Joi.string().required().messages({
        'string.empty': 'Address is required.'
    }),
    username: Joi.string().alphanum().min(3).max(20).required().messages({
        'string.alphanum': 'Username must only contain letters and numbers.'
    }),
    password: Joi.string().min(6).max(30).required().messages({
        'string.min': 'Password must be at least 6 characters.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match.'
    })
}).options({ stripUnknown: true }); 

const UpdateResidentSchema = Joi.object({
    GivenName: Joi.string().trim().required(),
    MiddleName: Joi.string().allow('', null).trim(),
    LastName: Joi.string().trim().required(),
    Sex: Joi.string().valid('Male', 'Female', 'Prefer not to say').required(),
    Birthday: Joi.date().less('now').max(eighteenYearsAgo).required().messages({
        'date.max': 'Resident must be at least 18 years old.'
    }),
    PWD: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    ContactNo: Joi.string().pattern(/^[0-9]+$/).length(11).required(),
    Address: Joi.string().required(),
}).options({ stripUnknown: true });

const AddResidentValidator = (payload) => {
    return AddResidentSchema.validate(payload, { abortEarly: false });
}

const UpdateResidentValidator = (payload) => {
    return UpdateResidentSchema.validate(payload, { abortEarly: false });
}

exports.AddResidentValidator = AddResidentValidator;
exports.UpdateResidentValidator = UpdateResidentValidator;