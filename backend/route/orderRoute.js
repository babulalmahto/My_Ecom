import express from 'express'
import { isAdmin, isRequire } from '../middleware/authMiddleware.js'
import { allOrderController, updateOrderStatusController, userOrderController } from '../controller/orderController.js'

let orderRoute = express.Router()

// order || GET (userOrder)
orderRoute.get('/order', isRequire, userOrderController)
// order || GET (allOrder)
orderRoute.get('/all-order', isRequire, isAdmin, allOrderController)
// Update status ||PUT
orderRoute.put('/update-order/:id', isRequire, isAdmin, updateOrderStatusController)
export default orderRoute