import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import { join } from 'path'
import { badRequestHandler, unauthorisedHandler, notFoundHandler, genericErrorHandler } from './errorHandlers.js'
import productsRouter from './services/products.js'
import reviewsRouter from './services/reviews.js'
import productImageRouter from './services/uploadImage.js'
import downloadPDFRouter from './services/downloadPDF.js'

const server = express()
const port = process.env.PORT


//middleware
const publicFolderPath = join(process.cwd(), './public')
server.use(express.static(publicFolderPath))

const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL]
const corsOptions = {
    origin: function (origin, next) {
        console.log("ORIGIN: ", origin)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            next(null, true)
        } else {
            next(new Error("CORS ERROR!"))
        }
    }
}
server.use(cors(corsOptions))
server.use(express.json())

//endpoints
server.use('/products', productsRouter)
server.use('/products/:productId', productImageRouter)
server.use('/products/:productId', downloadPDFRouter)
server.use('/products/:productId/reviews', reviewsRouter)

//error handlers
server.use(badRequestHandler)
server.use(unauthorisedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server running on port ${ port }`)
})