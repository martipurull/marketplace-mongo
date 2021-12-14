import express from 'express'

const reviewsDbRouter = express.Router({ mergeParams: true })

reviewsDbRouter.post('/', async (req, res, next) => {
    try {
        const { comment, rate } = req.body
        const result = await pool.query(
            "INSERT INTO review (comment, rate) VALUES ($1, $2) RETURNING *;",
            [comment, rate]
        )
        res.status(201).send(result.rows[0])
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})

reviewsDbRouter.get('/', async (req, res, next) => {
    try {
        const result = await pool.query(`SELECT * FROM review;`)
        res.send(result.rows)
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})

reviewsDbRouter.get('/:reviewId', async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT * FROM review WHERE review_id = ${ req.params.reviewId };`,
        )
        if (result.rows[0]) {
            res.send(result.rows[0])
        } else {
            res.status(404).send(`Sorry, review with id ${ req.params.reviewId } not found.`)
        }
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})

reviewsDbRouter.put('/:reviewId', async (req, res, next) => {
    try {
        const updateDetails = Object.entries(req.body).map(([key, value]) => `${ key } = '${ value }'`).join(', ')
        const updatedAt = moment().format("YYYY-MM-DD hh:mm:ss")
        const result = await pool.query(
            `UPDATE review SET ${ updateDetails }, updatedAt='${ updatedAt }' WHERE review_id = ${ req.params.reviewId } RETURNING *;`
        )
        res.send(result.rows[0])
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})

reviewsDbRouter.delete('/:reviewId', async (req, res, next) => {
    try {
        await pool.query(`DELETE FROM review WHERE review_id = ${ req.params.reviewId }`)
        res.status(404).send()
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})














export default reviewsDbRouter