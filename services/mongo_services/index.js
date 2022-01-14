import express from 'express'
import ProductModel from './schema.js'
import createHttpError from 'http-errors'
import q2m from 'query-to-mongo'

const productsRouter = express.Router()

//products endpoints
productsRouter.post('/', async (req, res, next) => {
    try {
        const newProduct = new ProductModel(req.body)
        await newProduct.save()
        res.status(201).send(newProduct)
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/', async (req, res, next) => {
    try {
        const mongoQuery = q2m(req.query)
        const noOfProducts = await ProductModel.countDocuments(mongoQuery.criteria)
        const products = await ProductModel.find(mongoQuery.criteria)
            .limit(mongoQuery.options.limit)
            .skip(mongoQuery.options.skip)
            .sort(mongoQuery.options.sort)
        res.send({ link: mongoQuery.links('/blogPosts', noOfProducts), pageTotal: Math.ceil(noOfProducts / mongoQuery.options.limit), noOfProducts, products })
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/:productId', async (req, res, next) => {
    try {
        const foundProduct = await ProductModel.findById(req.params.productId)
        if (foundProduct) {
            res.send(foundProduct)
        } else {
            next(createHttpError(404, `Product with id ${ req.params.productId } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.put('/:productId', async (req, res, next) => {
    try {
        const editedProduct = await ProductModel.findByIdAndUpdate(req.params.productId, req.body, { new: true })
        if (editedProduct) {
            res.send(editedProduct)
        } else {
            next(createHttpError(404, `Product with id ${ req.params.productId } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.delete('/:productId', async (req, res, next) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.productId)
        if (deletedProduct) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `Product with id ${ req.params.productId } did not exist or had already been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})

//reviews endpoints
productsRouter.post('/:productId/reviews', async (req, res, next) => {
    try {
        const productToAddReviewTo = await ProductModel.findByIdAndUpdate(req.params.productId, { $push: { reviews: req.body } }, { new: true })
        if (productToAddReviewTo) {
            res.send(productToAddReviewTo)
        } else {
            next(createHttpError(404, `Product with id ${ req.params.productId } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/:productId/reviews', async (req, res, next) => {
    try {
        const mongoQuery = q2m(req.query)
        const productReviews = await ProductModel.find({ _id: req.params.productId }, { reviews: { $slice: mongoQuery.options.limit } })
        if (productReviews) {
            res.send(productReviews)
        } else {
            next(createHttpError(404, `Product with id ${ req.params.productId } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/:productId/reviews/:reviewId', async (req, res, next) => {
    try {
        const productToGetReviewFrom = await ProductModel.findById(req.params.productId)
        if (productToGetReviewFrom) {
            const selectedReview = productToGetReviewFrom.reviews.find(review => review._id.toString() === req.params.reviewId)
            if (selectedReview) {
                res.send(selectedReview)
            } else {
                next(createHttpError(404, `Review with id ${ req.params.reviewId } does not exist or has been deleted.`))
            }
        } else {
            next(createHttpError(404, `Product with id ${ req.params.productId } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.put('/:productId/reviews/:reviewId', async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId)
        if (product) {
            const reviewIndex = product.reviews.findIndex(review => review._id.toString() === req.params.reviewId)
            if (reviewIndex !== -1) {
                const reviewToEdit = { ...product.reviews[reviewIndex].toObject(), ...req.body }
                product.reviews[reviewIndex] = reviewToEdit
                await product.save()
                res.send(product)
            } else {
                next(createHttpError(404, `Review with id ${ req.params.reviewId } does not exist or has been deleted.`))
            }
        } else {
            next(createHttpError(404, `Product with id ${ req.params.productId } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.delete('/:productId/reviews/:reviewId', async (req, res, next) => {
    try {
        const modifiedProduct = await ProductModel.findByIdAndUpdate(req.params.productId, { $pull: { reviews: { _id: req.params.reviewId } } }, { new: true })
        if (modifiedProduct) {
            res.send(modifiedProduct)
        } else {
            next(createHttpError(404, `Product with id ${ req.params.productId } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})


export default ProductsRouter