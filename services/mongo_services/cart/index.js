import express from 'express'
import CartModel from './schema.js'
import ProductModel from '../schema.js'
import createHttpError from 'http-errors'

const CartRouter = express.Router()

//endpoints
CartRouter.post('/:userId/addToCart', async (req, res, next) => {
    try {
        const { sku, quantity } = req.body
        const productToBuy = await ProductModel.findOne({ sku })
        if (productToBuy) {
            const isProductInCart = await CartModel.findOne({ userId: req.params.userId, status: 'active', "products.sku": sku })
            if (isProductInCart) {
                const cart = await CartModel.findOneAndUpdate(
                    { userId: req.params.userId, status: 'active', "products.sku": sku },
                    { $inc: { "products.$.quantity": quantity, "products.$.price": (productToBuy.price * quantity).toFixed(2) } },
                    { new: true })
                const itemsInCart = cart.products.length
                const subtotalArr = cart.products.map(product => product.price)
                const reducer = (previousValue, currentValue) => previousValue + currentValue
                const cartTotal = subtotalArr.reduce(reducer)
                res.send({ cart, itemsInCart, cartTotal })
            } else {
                const productToAdd = { ...productToBuy.toObject(), quantity }
                const cart = await CartModel.findOneAndUpdate(
                    { userId: req.params.userId, status: 'active' },
                    { $push: { products: productToAdd } },
                    { new: true, upsert: true })
                res.send(cart)
            }
        } else {
            next(createHttpError(404, `Product with sku ${ sku } does not exist or has been deleted.`))
        }
    } catch (error) {
        next(error)
    }
})





export default CartRouter