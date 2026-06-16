const Joi = require("joi");

const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.empty': 'Username cannot be empty.',
        'any.required': 'Username is required to log in.'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password cannot be empty.',
        'any.required': 'Password is required.'
    })
});

const signUpSchema = Joi.object({
    GivenName: Joi.string().required().trim().messages({
        'string.empty': 'First name is required.',
        'any.required': 'First name is required.'
    }),
    MiddleName: Joi.string().allow('', null).trim(),
    LastName: Joi.string().required().trim().messages({
        'string.empty': 'Last name is required.',
        'any.required': 'Last name is required.'
    }),
    Sex: Joi.string().valid('Male', 'Female', 'Prefer not to say')
        .required()
        .messages({
            'any.only': 'Please select a valid gender from the list.',
            'any.required': 'Sex is a required field.',
            'string.empty': 'Please choose your sex.'
        }),
    Birthday: Joi.date().less('now') 
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18))) 
    .required()
    .messages({
        'date.base': 'Please enter a valid date.',
        'date.less': 'Birthday cannot be in the future.',
        'date.max': 'You must be at least 18 years old to register.',
        'any.required': 'Birthday is required.'
    }),
    PWD: Joi.string().required().messages({
        'string.empty': 'Please specify if you are a PWD or not.',
        'any.required': 'Please select a PWD status.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address.',
        'string.empty': 'Email address is required.',
        'any.required': 'Email is required.'
    }),
    PhoneNo: Joi.string().pattern(/^[0-9]+$/).min(11).max(11).required().messages({
        'string.pattern.base': 'Contact number must only contain numbers.',
        'string.min': 'Contact number must be exactly 11 digits.',
        'string.max': 'Contact number must be exactly 11 digits.',
        'any.required': 'Contact number is required.'
    }),
    Address: Joi.string().required().messages({
        'string.empty': 'Complete address is required.',
        'any.required': 'Address is required.'
    }),
    username: Joi.string().alphanum().min(3).max(20).required().messages({
        'string.alphanum': 'Username must only contain letters and numbers.',
        'string.min': 'Username must be at least 3 characters.',
        'string.max': 'Username cannot exceed 20 characters.',
        'any.required': 'Username is required.'
    }),
    password: Joi.string().min(6).max(30).required().messages({
        'string.min': 'Password must be at least 6 characters long.',
        'string.max': 'Password is too long (max 30).',
        'any.required': 'Password is required.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match.',
        'any.required': 'Please confirm your password.'
    })
});

const forgotpassSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Enter a valid email to receive the reset link.',
        'any.required': 'Email is required.'
    })
});

const resetpassSchema = Joi.object({
    password: Joi.string().min(6).max(30).required().messages({
        'string.min': 'New password must be at least 6 characters.',
        'any.required': 'New password is required.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirmation password does not match.',
        'any.required': 'Please confirm your new password.'
    })
});

// Validator functions remain the same
const LoginValidator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });
const signUpValidator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });
const forgotpassValidator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });
const resetpassValidator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

exports.LoginValidator = LoginValidator(loginSchema);
exports.signUpValidator = signUpValidator(signUpSchema);
exports.forgotpassValidator = forgotpassValidator(forgotpassSchema);
exports.resetpassValidator = resetpassValidator(resetpassSchema);