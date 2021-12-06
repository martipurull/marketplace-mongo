import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import { join } from 'path'
import { badRequestHandler, unauthorisedHandler, notFoundHandler, genericErrorHandler } from './errorHandlers.js'
import productsRouter from './services/products.js'
import reviewsRouter from './services/reviews.js'
import productImageRouter from './services/uploadImage.js'

const server = express()
const port = 3001

const publicFolderPath = join(process.cwd(), './public')
console.log("this is the path to the public folder:", publicFolderPath)

//middleware
server.use(express.static(publicFolderPath))
server.use(cors())
server.use(express.json())

//endpoints
server.use('/products', productsRouter)
server.use('/products/:productId', productImageRouter)
server.use('/products/:productId/reviews', reviewsRouter)

//error handlers
server.use(badRequestHandler)
server.use(unauthorisedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server running on port: ${ port }`)
})