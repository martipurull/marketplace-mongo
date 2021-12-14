import express from 'express'
import pool from '../library/db-tools/connect.js'
import moment from 'moment'

const productsDbRouter = express.Router({ mergeParams: true })

productsDbRouter.post('/', async (req, res, next) => {
    try {
        const { name, brand, category, description, price } = req.body
        const result = await pool.query(
            "INSERT INTO product (name, brand, category, description, price) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
            [name, brand, category, description, price]
        )
        res.status(201).send(result.rows[0])
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})

productsDbRouter.get('/', async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM product;")
        res.send(result.rows)
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})

productsDbRouter.get('/:productId', async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT * FROM product WHERE product_id = $1;",
            [req.params.productId]
        )
        if (result.rows[0]) {
            res.send(result.rows[0])
        } else {
            res.status(404).send(`Sorry, product with id ${ req.params.productId } not found.`)
        }
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})

productsDbRouter.put('/:productId', async (req, res, next) => {
    try {
        const updateDetails = Object.entries(req.body).map(([key, value]) => `${ key } = '${ value }'`).join(', ')
        const updatedAt = moment().format("YYYY-MM-DD hh:mm:ss")
        const result = await pool.query(
            `UPDATE product SET ${ updateDetails }, updated_at='${ updatedAt }' WHERE product_id = ${ req.params.productId } RETURNING *;`
        )
        res.send(result.rows[0])
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})

productsDbRouter.delete('/:productId', async (req, res, next) => {
    try {
        await pool.query(`DELETE FROM product WHERE product_id = ${ req.params.productId }`)
        res.status(404).send()
    } catch (error) {
        res.status(500).send(`Generic server error: ${ error }`)
    }
})





export default productsDbRouter