import express from 'express'
import multer from 'multer'
import path from 'path'
import createHttpError from 'http-errors'
import { getProducts, saveProducts, uploadProductImage } from '../library/fs-tools.js'

const productImageRouter = express.Router()

const productImageUploader = multer({
    fileFilter: (req, file, multerNext) => {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/gif" && file.mimetype !== "image/png") {
            multerNext(createHttpError(400, "File type not supported: please try with a jpeg, gif or png."))
        } else if (file.size > 3000000) {
            multerNext(createHttpError(400, "The image is too large: please upload an image under 3MB."))
        } else {
            multerNext(null, true)
        }
    }
}).single("productImage")

productImageRouter.put('/imageUpload', productImageUploader, async (req, res, next) => {
    console.log(req.file)
    console.log(req.params)
    try {
        const products = await getProducts()
        const productIndex = products.findIndex(product => product.id === req.params.productId)
        const fileName = `${ req.params.productId }.${ path.extname(req.file.originalname) }`
        await saveProductImage(fileName, req.file.buffer)
        products[productIndex].imageUrl = `http://localhost:3001/product-images/${ fileName }`
        await saveProducts(products)
        res.send("image uploaded")
    } catch (error) {
        next(error)
    }
})





export default productImageRouter