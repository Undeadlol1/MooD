import { matchedData, sanitize } from 'express-validator/filter'
import { check, validationResult, checkSchema } from 'express-validator/check'
/**
 * this is a copypaste. verything is wrong
 */
export default {
    // getOne: checkSchema({
    //     slug: {
    //         trim: true,
    //         exists: true,
    //         errorMessage: 'Is required', // FIXME: tests
    //     }
    // }),
    // get: checkSchema({
    //     parentId: {
    //         exists: true,
    //         errorMessage: 'Is required', // FIXME: tests
    //     },
    //     // FIXME: tests
    //     page: {
    //         isInt: true,
    //         toInt: true, // is this working?ß
    //         optional: true,
    //         errorMessage: 'Is required',
    //     }
    // }),
    // put: checkSchema({
    //     // Params validation.
    //     threadsId: {
    //         trim: true,
    //         exists: true,
    //         isUUID: true,
    //         errorMessage: 'Is required',
    //         // TODO: tests
    //         // errorMessage: ''
    //     },
    //     // Body validation.
    //     // Every other field in body will be ignored.
    //     text: {
    //         trim: true,
    //         exists: true,
    //         errorMessage: 'Is required',
    //         isLength: {
    //         options: { min: 5 },
    //         errorMessage: 'Text should be atleast 5 characters long',
    //         }
    //     },
    // }),
    // FIXME: this validations are a mess
    // NOTE: node can be created with just url
    post: checkSchema({
        MoodId: {
            trim: true,
            exists: true,
            errorMessage: 'Is required',
            isLength: {
                options: { min: 1, max: 100 },
                errorMessage: 'Must be between 5 and 100 characters long',
            },
        },
        contentId: {
            optional: true,
            trim: true,
            // exists: true,
            errorMessage: 'Is required',
            isLength: {
                options: { min: 5, max: 100 },
                errorMessage: 'Must be between 5 and 100 characters long',
            },
        },
        provider: {
            optional: true,
            trim: true,
            // exists: true,
            isIn: {
                options: ['youtube'],
                errorMessage: 'Unsupported provider'
            },
            // errorMessage: 'Is required',
            // isLength: {
            //     options: { min: 5, max: 100 },
            //     errorMessage: 'Must be between 5 and 100 characters long',
            // }
        },
        type: {
            optional: true,
            trim: true,
            // exists: true,
            isIn: {
                options: ['video'],
                errorMessage: 'Unsupported type'
            },
            // errorMessage: 'Is required',
        },
        url: {
            trim: true,
            exists: {
                errorMessage: 'Is required',
            },
            isURL: {
                errorMessage: 'Is not valid url'
            },
        }
    }),

}