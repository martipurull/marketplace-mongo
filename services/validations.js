import { body } from 'express-validator'

export const productValidation = [
    body("name").exists().withMessage("We need the product's name!"),
    body("description").exists().withMessage("You'd better provide a description for your product!"),
    body("brand").exists().withMessage("We need a brand for your product!"),
    body("price").exists().withMessage("Every product has a price, and so does each of us."),
    body("category").exists().withMessage("Please select a category.")
]

export const reviewsValidation = [
    body("comment").exists().withMessage("leave your comment to our product!"),
    body("rate").exists().withMessage("rate our product!")
]