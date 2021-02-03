const db = require('../database')
const { asyncQuery } = require('../helpers/queryHelp')

module.exports = {
    showAll: async (req, res) => {
        try {
            const queryUser = 
            `
                SELECT 
                mm.name, mm.release_date, mm.release_month, mm.release_year, mm.duration_min, mm.genre, mm.description, mm.status, ll.location, st.time
                FROM movies mm 
                LEFT JOIN schedules ss ON ss.movie_id = mm.id
                LEFT JOIN locations ll ON ll.id = ss.location_id 
                LEFT JOIN show_times st ON st.id = ss.time_id
            `
            result = await asyncQuery(queryUser)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    showSpecific: async (req, res) => {
        try {
            const queryUser = 
            `
            SELECT mm.name, mm.release_date, mm.release_month, mm.release_year, mm.duration_min, mm.genre, mm.description, mm.status, ll.location, st.time 
            FROM schedules ss 
            JOIN locations ll ON ll.id = ss.location_id 
            JOIN movies mm ON mm.id = ss.movie_id 
            JOIN show_times st ON st.id = ss.time_id
            WHERE status=${db.escape(req.query.status)} OR location=${db.escape(req.query.location)} OR time=${db.escape(req.query.time)}
            `
            result = await asyncQuery(queryUser)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    add: async (req, res) => {
        const { name, genre, release_date, release_month, release_year, duration_min, description } = req.body
        try {
            const addQuery = `INSERT INTO movies (name, genre, release_date, release_month, release_year, duration_min, description) 
            values (
                ${db.escape(name)}, ${db.escape(genre)}, ${db.escape(release_date)}, ${db.escape(release_month)}, 
                ${db.escape(release_year)}, ${db.escape(duration_min)}, ${db.escape(description)}
            )`
            await asyncQuery(addQuery)
            
            const refresh = `
            SELECT 
                mm.name, mm.release_date, mm.release_month, mm.release_year, mm.duration_min, mm.genre, mm.description, mm.status, ll.location, st.time
                FROM movies mm 
                LEFT JOIN schedules ss ON ss.movie_id = mm.id
                LEFT JOIN locations ll ON ll.id = ss.location_id 
                LEFT JOIN show_times st ON st.id = ss.time_id
            `
            const result = await asyncQuery(refresh)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    edit: async (req, res) => {
        try {
            const changeQue = `UPDATE movies JOIN schedules USING(id) SET movies.status=${db.escape(req.body.status)} WHERE id=${db.escape(req.params.id)}`
            // AND token=${db.escape(req.body.token)}
            await asyncQuery(changeQue)
            
            const refresh = `
            SELECT  ss.movie_id
                FROM movies mm 
                LEFT JOIN schedules ss ON ss.movie_id = mm.id
                LEFT JOIN locations ll ON ll.id = ss.location_id 
                LEFT JOIN show_times st ON st.id = ss.time_id
            WHERE ss.id=${db.escape(req.params.id)}`
            const result = await asyncQuery(refresh)
            result[0].message = 'Status has been changed'
            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    set: async (req, res) => {
        try {
            const setQue1 = `UPDATE schedules JOIN locations USING (id) SET schedules.location_id=${db.escape(req.body.location_id)} WHERE id=${db.escape(req.params.id)}`
            const setQue2 = `UPDATE schedules JOIN show_times USING (id) SET schedules.time_id=${db.escape(req.body.time_id)} WHERE id=${db.escape(req.params.id)}`
            await asyncQuery(setQue1)
            await asyncQuery(setQue2)
            
            const refresh = `
            SELECT 
                ss.location_id, ss.time_id
                FROM movies mm 
                LEFT JOIN schedules ss ON ss.movie_id = mm.id
                LEFT JOIN locations ll ON ll.id = ss.location_id 
                LEFT JOIN show_times st ON st.id = ss.time_id            
            WHERE ss.id=${db.escape(req.params.id)}`
            const result = await asyncQuery(refresh)
            result[0].message = 'Schedule has been changed'
            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}