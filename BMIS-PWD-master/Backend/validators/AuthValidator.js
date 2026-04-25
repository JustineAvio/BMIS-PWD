const Joi = require("joi");

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const signUpSchema = Joi.object({
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
    username: Joi.string().required(),
    password: Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')),
    // childGivenName: Joi.string().optional(),
    // childSex: Joi.string().optional(),
    // childBirthday: Joi.date().optional(),
    // childIsPWD: Joi.boolean().optional()
})

const forgotpassSchema = Joi.object({
    email: Joi.string().email().required()
})

const resetpassSchema = Joi.object({
    password: Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password'))
})


const LoginValidator = (schema) => (payload) =>{
    return schema.validate(payload, { abortEarly: false});
}

const signUpValidator = (schema) => (payload) =>{
    return schema.validate(payload, { abortEarly: false });
}

const forgotpassValidator = (schema) => (payload) => {
    return schema.validate(payload, { abortEarly: false })
}

const resetpassValidator = (schema) => (payload) => {
    return schema.validate(payload, { abortEarly: false })
}

exports.LoginValidator = LoginValidator(loginSchema);
exports.signUpValidator = signUpValidator(signUpSchema);
exports.forgotpassValidator = forgotpassValidator(forgotpassSchema);
exports.resetpassValidator = resetpassValidator(resetpassSchema);