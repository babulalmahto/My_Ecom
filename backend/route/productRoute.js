import express from 'express'
import { isAdmin, isRequire } from '../middleware/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, filterProductController, getAllProductController, getSingleProductController, productCategoryController, productListController, serchHandlerController, similarProductController, totalProductController, updateProductController } from '../controller/productController.js';
import uploads from '../config/multer.js';


let productRoute = express.Router();
productRoute.post('/create-product', isRequire, isAdmin, uploads.array('images', 4), createProductController)
productRoute.get('/products', getAllProductController)
productRoute.get('/single-product/:id', getSingleProductController)
productRoute.delete('/delete-product/:id', isRequire, isAdmin, deleteProductController)
productRoute.put('/update-product/:id', isRequire, isAdmin, uploads.array('images', 4), updateProductController)
productRoute.post('/filter-product', filterProductController)
productRoute.get('/totalProduct', totalProductController)
productRoute.get('/product-list/:count', productListController)
productRoute.get('/search-product/:keyword', serchHandlerController)
productRoute.get('/similar-product/:p_id/:c_id', similarProductController)
productRoute.get('/product-category/:slug', productCategoryController)
productRoute.get('/braintree/token', braintreeTokenController)
productRoute.post('/braintree/payment', isRequire, braintreePaymentController)
export default productRoute;