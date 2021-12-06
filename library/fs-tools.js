import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data')
const productImagesPublicFolderPath = join(process.cwd(), './public/product-images')
const productsJSONPath = join(dataFolderPath, "./products.json")

export const getProducts = () => readJSON(productsJSONPath)
export const saveProducts = (content) => writeJSON(productsJSONPath, content)
export const uploadProductImage = (fileName, fileContentAsBuffer) => writeFile(join(productImagesPublicFolderPath, fileName), fileContentAsBuffer)