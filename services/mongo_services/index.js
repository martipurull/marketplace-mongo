import express from 'express'
import ProductModel from './schema.js'

import createHttpError from 'http-errors'
import q2m from 'query-to-mongo'

const ProductsRouter = express.Router()

//

ProductsRouter.post("/", async (req, res, next) => {
    try {
      const newProduct = new ProductModel(req.body) 
      const { _id } = await newProduct.save() 
  
      res.status(201).send({ _id })
    } catch (error) {
      next(error)
    }
  })
  
  ProductsRouter.get("/", async (req, res, next) => {
    try { 
      const mongoQuery = q2m(req.query)
    //   const { total, products } = await ProductModel.findproductsWithAuthors(mongoQuery)
    //   res.send({ links: mongoQuery.links("/products", total), pageTotal: Math.ceil(total / mongoQuery.options.limit), total, products })
    const productId = req.params.productId
  
    const product = await ProductModel.find(productId)
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `product with id ${productId} not found!`))
    }
    } catch (error) {
      next(error)
    }
  })
  
  ProductsRouter.get("/:productId", async (req, res, next) => {
    try {
      const productId = req.params.productId
  
      const product = await ProductModel.findById(productId)
      if (product) {
        res.send(product)
      } else {
        next(createHttpError(404, `product with id ${productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  ProductsRouter.put("/:productId", async (req, res, next) => {
    try {
      const productId = req.params.productId
      const updatedProduct = await ProductModel.findByIdAndUpdate(productId, req.body, { new: true })
      if (updatedProduct) {
        res.send(updatedProduct)
      } else {
        next(createHttpError(404, `product with id ${productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  ProductsRouter.delete("/:productId", async (req, res, next) => {
    try {
      const productId = req.params.productId
      const deletedProduct= await ProductModel.findByIdAndDelete(productId)
      if (deletedProduct) {
        res.status(204).send()
      } else {
        next(createHttpError(404, `product with id ${productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  
  ProductsRouter.post("/:productId", async (req, res, next)=>{
    try {  
    //     const newReview = await new ReviewsModel(req.body) 
    //   const { _id } = await newReview.save()
     
    // if (newReview) {
     
    //   const reviewToInsert = { ...newReview.toObject()} 
    //   console.log(reviewToInsert)
  
      const modifiedproduct = await ProductModel.findByIdAndUpdate(
          
        req.params.productId,
        { $push: { reviews: req.body } }, 
        { new: true } 
      )
      if (modifiedproduct) {
          
        res.send(modifiedproduct)
      } else {
        next(createHttpError(404, `product with id ${req.params.productId} not found!`))
      }
    
    } catch (error) {
      next(error)
      
    }
  })
  
  ProductsRouter.get("/:productId/reviews", async (req, res, next) => {
    try {
      console.log(req.params.productId)
      const product = await ProductModel.findById(req.params.productId)
      if (product) {
        res.send(product.reviews)
      } else {
        next(createHttpError(404, `product with id ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  ProductsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
    try {
      const product = await ProductModel.findById(req.params.productId)
      if (product) {
        const purchasedItem = product.reviews.find(review => review._id.toString() === req.params.reviewId) // You CANNOT compare an ObjectId (review._id) with a string (req.params.reviewId) --> review._id needs to be converted into a string
        if (purchasedItem) {
          res.send(purchasedItem)
        } else {
          next(createHttpError(404, `review with id ${req.params.reviewId} not found!`))
        }
      } else {
        next(createHttpError(404, `product with id ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  ProductsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
    try {
      const product = await ProductModel.findById(req.params.productId)
      if (product) {
        const index = product.reviews.findIndex(review => review._id.toString() === req.params.reviewId)
  
        if (index !== -1) {
         
          product.reviews[index] = { ...product.reviews[index].toObject(), ...req.body } 
          await product.save() 
          res.send(product)
        } else {
          next(createHttpError(404, `comment with id ${req.params.reviewId} not found!`))
        }
      } else {
        next(createHttpError(404, `product with id ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  ProductsRouter.delete("/:productId/reviews/:reviewId", async (req, res, next) => {
    try {
      const modifiedproduct = await ProductModel.findByIdAndUpdate(
        req.params.productId, 
        { $pull: { reviews: { _id: req.params.reviewId } } }, 
        { new: true } 
      )
  
      if (modifiedproduct) {
        res.send(modifiedproduct)
      } else {
        next(createHttpError(404, `product with id ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })






export default ProductsRouter