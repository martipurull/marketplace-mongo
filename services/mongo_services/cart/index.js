import express from 'express'
import CartModel from './schema.js'
import ProductModel from '../schema.js'
import createHttpError from 'http-errors'
import q2m from 'query-to-mongo'

const CartRouter = express.Router()

//endpoints
CartRouter.post('/:userId/addToCart', async (req, res, next) => {
    try {
        const { productId, quantity } = req.body
        const productToBuy = await ProductModel.findById(productId)
        if (productToBuy) {
            const isProductInCart = await CartModel.findOne({ userId: req.params.userId, status: 'active', "products.originalId": productId })
            if (isProductInCart) {
                const cart = await CartModel.findOneAndUpdate({ userId: req.params.userId, status: 'active', "products.originalId": productId }, { $inc: { "products.$.quantity": quantity } }, { new: true })
                res.send(cart)
            } else {
                const productToAdd = { ...productToBuy.toObject(), quantity }
                const cart = await CartModel.findOneAndUpdate({ userId: req.params.userId, status: 'active' }, { $push: { products: productToAdd } }, { new: true, upsert: true })
                res.send(cart)
            }
        } else {
            next(createHttpError(404, `Product with id ${ req.params.productId } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})





export default CartRouter