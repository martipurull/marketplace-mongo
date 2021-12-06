import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { productValidation } from './validations.js'
import { getProducts, saveProducts } from '../library/fs-tools.js'

const productsRouter = express.Router({ mergeParams: true })

productsRouter.post('/', productValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, 'There are some errors in your submission, namely: ', { errorList }))
        } else {
            const products = await getProducts()
            const newProduct = { ...req.body, id: uuidv4(), createdAt: new Date() }
            products.push(newProduct)
            await saveProducts(products)
            res.status(201).send(`New product added with id: ${ newProduct.id }`)
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getProducts()
        if (req.query && req.query.name) {
            const filteredProducts = products.filter(product => product.name.includes(req.query.name))
            res.send(filteredProducts)
        } else {
            res.send(products)
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/:productId', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        if (selectedProduct) {
            res.send(selectedProduct)
        } else {
            next(createHttpError(404, "Sorry, the product selected doesn't seem to exist."))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.put('/:productId', async (req, res, next) => {
    try {
        const products = getProducts()
        const selectedProductIndex = products.findIndex(product => product.id === req.params.productId)
        const editedProduct = { ...products[selectedProductIndex], ...req.body, updatedAt: new Date() }
        products[selectedProductIndex] = editedProduct
        await saveProducts(products)
        res.send(editedProduct)
    } catch (error) {
        next(error)
    }
})

productsRouter.delete('/:productId', async (req, res, next) => {
    try {
        const products = getProducts()
        const remainingProducts = products.filter(product => product.id !== req.params.productId)
        await saveProducts(remainingProducts)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})


export default productsRouter