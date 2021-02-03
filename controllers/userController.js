const db = require('../database')
const { validationResult } = require('express-validator')
const cryptojs = require('crypto-js')
const { generateQuery, asyncQuery } = require('../helpers/queryHelp')
const { createToken } = require('../helpers/jwt')

module.exports = {
    showAll: async (req, res) => {
        try {
            const queryUser = 'SELECT * FROM users'
            result = await asyncQuery(queryUser)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    register: async (req, res) => {
        const { username, password, email, role, status } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).send(errors.array().map(i => i.msg))
        try {
            // const registerQue = `SELECT * FROM users`
            const registerQue = `INSERT INTO users (username, password, email, role, uid, token) VALUES (${db.escape(username)}, ${db.escape(password)}, ${db.escape(email)}, ${db.escape(role)}, ${db.escape(Date.now())}, ${db.escape(createToken({ username: username }))})`
            result = await asyncQuery(registerQue)
            const refresh = `SELECT * FROM users`
            result = await asyncQuery(refresh)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        } 
    },
    login: async(req, res) => {
        try {
            const hashPass = cryptojs.HmacMD5(req.body.password, '!@#$%^&*')
            const loginQue = `SELECT * FROM users WHERE password="${hashPass}" OR username=${db.escape(req.body.username)} OR email=${db.escape(req.body.email)} HAVING status=1`
            result = await asyncQuery(loginQue)
            let token = createToken({ username: result[0].username })
            result[0].token = token
            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    deactivate: async(req, res) => {
        try {
            const deactivateQue = `UPDATE users SET status=2 WHERE token=${db.escape(req.body.token)}`
            await asyncQuery(deactivateQue)
            const refresh = `SELECT uid, status FROM users WHERE token=${db.escape(req.body.token)}`
            const result = await asyncQuery(refresh)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    activate: async(req, res) => {
        try {
            const activateQue = `UPDATE users SET status=1 WHERE token=${db.escape(req.body.token)} AND status=2`
            await asyncQuery(activateQue)
            const refresh = `SELECT uid, status FROM users WHERE token=${db.escape(req.body.token)}`
            const result = await asyncQuery(refresh)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    close: async(req, res) => {
        try {
            const closeQue = `UPDATE users SET status=3 WHERE token=${db.escape(req.body.token)}`
            await asyncQuery(closeQue)
            const refresh = `SELECT uid, status FROM users WHERE token=${db.escape(req.body.token)}`
            const result = await asyncQuery(refresh)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}