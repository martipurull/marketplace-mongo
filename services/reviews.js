import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import { reviewsValidation } from './validations.js'
import createHttpError from 'http-errors'
import { getProducts, saveProducts } from '../library/fs-tools.js'

const reviewsRouter = express.Router()

reviewsRouter.post('/', reviewsValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, "There are some problems with your review, please check and submit again."))
        } else {
            const products = await getProducts()
            const selectedProductIndex = products.findIndex(product => product.id === req.params.productId)
            const newReview = { ...req.body, createdAt: new Date(), id: uuidv4(), productId: req.params.productId }
            if (products[selectedProductIndex].reviews) {
                products[selectedProductIndex].reviews.push(newReview)
            } else {
                products[selectedProductIndex].reviews = []
                products[selectedProductIndex].reviews.push(newReview)
            }
            await saveProducts(products)
            res.status(201).send(`Comment added successfully for ${ products[selectedProductIndex].name }`)
        }
    } catch (error) {
        next(error)
    }
})

reviewsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        res.send(selectedProduct.reviews)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.get('/:reviewId', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        const selectedReview = selectedProduct.reviews.find(review => review.id === req.params.reviewId)
        res.send(selectedReview)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.put('/reviewId', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        const reviewToEditIndex = selectedProduct.reviews.findIndex(review => review.id === req.params.reviewId)
        const editedReview = { ...selectedProduct.reviews[reviewToEditIndex], ...req.body, updatedAt: new Date() }
        selectedProduct.reviews[reviewToEditIndex] = editedReview
        await saveProducts(products)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.delete('/reviewId', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        const remainingReviews = selectedProduct.reviews.filter(review => review.id !== req.params.reviewId)
        selectedProduct.reviews = remainingReviews
        await saveProducts(products)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default reviewsRouter