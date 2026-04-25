const Joi = require('joi');

const AddResidentSchema = Joi.object({
    GivenName: Joi.string().required(),
    MiddleName: Joi.string().allow('', null),
    LastName: Joi.string().required(),
    Sex: Joi.string().valid('Male', 'Female', 'Prefer not to say') 
        .required()
        .messages({
            'any.only': 'Please select a valid gender (Male, Female or Prefer not to say).',
            'any.required': 'Sex is a required field.',
            'string.empty': 'Please choose your sex from the list.'
        }),
    Birthday: Joi.date().required(),
    PWD: Joi.string().required().messages({
        'string.empty': 'Please specify if you are a PWD or not.',
        'any.required': 'Please select a PWD status.'
    }),
    email: Joi.string().email().required(),
    ContactNo: Joi.string().required(),
    Address: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')),
    // childGivenName: Joi.string().optional(),
    // childSex: Joi.string().optional(),
    // childBirthday: Joi.date().optional(),
    // childIsPWD: Joi.boolean().optional()
}).unknown(true); 

const UpdateResidentSchema = Joi.object({
    GivenName: Joi.string().required(),
    MiddleName: Joi.string().allow('', null),
    LastName: Joi.string().required(),
    Sex: Joi.string().valid('Male', 'Female', 'Prefer not to say') // Ensures they don't send "Select..."
        .required()
        .messages({
            'any.only': 'Please select a valid gender (Male, Female or Prefer not to say).',
            'any.required': 'Sex is a required field.',
            'string.empty': 'Please choose your sex from the list.'
        }),
    Birthday: Joi.date().required(),
    PWD: Joi.string().required().messages({
        'string.empty': 'Please specify if you are a PWD or not.',
        'any.required': 'Please select a PWD status.'
    }),
    email: Joi.string().email().required(),
    ContactNo: Joi.string().required(),
    Address: Joi.string().required(),
}).unknown(true);

const AddResidentValidator = (payload) => {
    return AddResidentSchema.validate(payload, { abortEarly: false });
}

const UpdateResidentValidator = (payload) => {
    return UpdateResidentSchema.validate(payload, { abortEarly: false });
}


exports.AddResidentValidator = AddResidentValidator;
exports.UpdateResidentValidator = UpdateResidentValidator;
