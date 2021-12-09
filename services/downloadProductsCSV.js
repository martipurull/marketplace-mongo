import express from 'express'
import { pipeline } from 'stream'
import { getProductsReadableStream } from '../library/fs-tools.js'
import json2csv from 'json2csv'

const downloadProductsCSVRouter = express.Router({ mergeParams: true })

downloadProductsCSVRouter.get('/downloadProductsCSV', async (req, res, next) => {
    console.log("I'M IN!!!!")
    try {
        res.setHeader("Content-Disposition", "attachment; filename=products.csv")
        const source = getProductsReadableStream()
        console.log(source)
        const transform = new json2csv.Transform({ fields: ["name", "description", "artist", "imageUrl", "price", "category", "id", "createdAt"] })
        const destination = res

        pipeline(source, transform, destination, err => {
            if (err) next(err)
        })
    } catch (error) {
        next(error)
    }
})






export default downloadProductsCSVRouter