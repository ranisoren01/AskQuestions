const Joi = require('joi');

module.exports.questionSchema = Joi.object({
   
    title: Joi.string().required(),
    description: Joi.string().required()
    
}).required();

module.exports.answerSchema = Joi.object({
    answer : Joi.string().required(),
    question : Joi.string().required()
}).required();