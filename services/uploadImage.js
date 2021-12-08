import express from 'express'
import multer from 'multer'
import path from 'path'
import createHttpError from 'http-errors'
import { getProducts, saveProducts, uploadProductImage } from '../library/fs-tools.js'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { encodeImage } from '../library/pdf-tools.js'

const productImageRouter = express.Router({ mergeParams: true })

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET
})

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'strive-blog',
    },
});

const parser = multer({ storage: cloudinaryStorage });

productImageRouter.put('/imageUpload', parser.single('productImage'), async (req, res, next) => {
    console.log(req.file)
    console.log(req.params)
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        selectedProduct.imageUrl = req.file.path
        selectedProduct.encodedImage = await encodeImage(selectedProduct.imageUrl)
        console.log(selectedProduct)
        await saveProducts(products)
        res.send(req.file)
    } catch (error) {
        next(error)
    }
})




// const productImageUploader = multer({
//     fileFilter: (req, file, multerNext) => {
//         if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/gif" && file.mimetype !== "image/png") {
//             multerNext(createHttpError(400, "File type not supported: please try with a jpeg, gif or png."))
//         } else if (file.size > 3000000) {
//             multerNext(createHttpError(400, "The image is too large: please upload an image under 3MB."))
//         } else {
//             multerNext(null, true)
//         }
//     }
// }).single("productImage")

// productImageRouter.put('/imageUpload', productImageUploader, async (req, res, next) => {
//     console.log(req.file)
//     console.log(req.params)
//     try {
//         const products = await getProducts()
//         const productIndex = products.findIndex(product => product.id === req.params.productId)
//         const fileName = `${ req.params.productId }.${ path.extname(req.file.originalname) }`
//         await saveProductImage(fileName, req.file.buffer)
//         products[productIndex].imageUrl = `http://localhost:3001/product-images/${ fileName }`
//         await saveProducts(products)
//         res.send("image uploaded")
//     } catch (error) {
//         next(error)
//     }
// })

export default productImageRouter