import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import mongoose from 'mongoose'
import ProductsRouter from './services/mongo_services/index.js'
import CartRouter from './services/mongo_services/cart/index.js'
import UserRouter from './services/mongo_services/users/index.js'
import { badRequestHandler, unauthorisedHandler, notFoundHandler, genericErrorHandler } from './errorHandlers.js'

const server = express()

const port = process.env.PORT || 3001

//middleware
server.use(cors())
server.use(express.json())

//endpoints
server.use('/products', ProductsRouter)

//error handlers
server.use(badRequestHandler)
server.use(unauthorisedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("Connected to Mongo!")
})

server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server running on port: ${ port }`)
})

mongoose.connection.on("error", err => {
    console.log(err)
})