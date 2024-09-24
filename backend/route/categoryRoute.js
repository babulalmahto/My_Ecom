import express from 'express'
import { isAdmin, isRequire } from '../middleware/authMiddleware.js'
import { allCategoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controller/categoryController.js'



let route = express.Router()

route.post('/create-category', isRequire, isAdmin, createCategoryController)

route.get('/all-category', allCategoryController)

route.delete('/delete-category/:id', isRequire, isAdmin, deleteCategoryController)

route.get('/single-category/:slug', singleCategoryController)

route.put('/update-category/:id', isRequire, isAdmin, updateCategoryController)

export default route