const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const { userController } = require('../controllers')
const { login } = require('../controllers/userController')

const registerValidation = [
    body('username')
        .notEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ min: 6 })
        .withMessage('Username must have a minimum of 6 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 6 })
        .withMessage('Password must have a minimum of 6 characters')
        .matches(/[0-9]/)
        .withMessage('Password must include a number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must include a symbol')
    ,
    body('email')
        .isEmail()
        .withMessage('Email is invalid')
]

router.post('/showAll', userController.showAll)
router.post('/register', registerValidation, userController.register)
router.post('/login', userController.login)
router.patch('/deactivate', userController.deactivate)
router.patch('/activate', userController.activate)
router.patch('/close', userController.close)

module.exports = router