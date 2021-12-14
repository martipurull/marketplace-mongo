import express from 'express'
import cors from 'cors'
import productsDbRouter from './services/products_dB.js'
import reviewsDbRouter from './services/reviews_dB.js'
import productImageUploaderDb from './services/uploadImage_dB.js'
import { testDbConnection } from './library/db-tools/connect.js'


const server = express()

server.use(express.json())
server.use(cors())

server.use('/products', productsDbRouter)
server.use('/reviews', reviewsDbRouter)
server.use('/products/:productId/upload', productImageUploaderDb)

server.listen(process.env.PORT || 3001, () => {
    console.log("Server running!")
    testDbConnection()
})

server.on("error", (error) => console.log("Server NOT running due to error: ", error))