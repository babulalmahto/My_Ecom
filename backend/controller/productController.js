import gateway from "../config/payment.js";
import { deleteImageOnCloudinary, uploadImageOnCloudinary } from "../helper/cloudinaryHelper.js";
import categoryModel from "../model/categoryModel.js";
import orderModel from "../model/orderModel.js";
import ProductModel from "../model/ProductModel.js";



//this is for product creation
export let createProductController = async (req, res) => {
    try {
      let { name, price, quantity, description, category, brand, shipping } =
        req.body;
      let images = req.files;
  
      if (
        !name ||
        !price ||
        !quantity ||
        !description ||
        !category ||
        !brand ||
        !shipping
      ) {
        return res.status(200).send({ message: "All fields are required *" });
      }
      if (images.length == 0) {
        return res.status(200).send({ message: "At least Upload one image" });
      }
      let image = await uploadImageOnCloudinary(req.files);
      let product = await new ProductModel({
        name,
        price,
        quantity,
        description,
        category,
        brand,
        shipping,
        images: image,
      }).save();
      res
        .status(201)
        .send({ message: "Product Created Successful", success: true, product });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Somthing wrong while creating productss",
        success: false,
        err,
      });
    }
  };
  //getAllProduct
  export let getAllProductController = async (req, res) => {
    try {
      let products = await productModel
        .find({})
        .populate("category")
        .sort({ createdAt: -1 });
      res.status(200).send({
        message: "All Products",
        success: true,
        products,
        total: products.length,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Somthing wrong while getting Product" });
    }
  };
  //get single product
  export let getSingleProductController = async (req, res) => {
    try {
      let { id } = req.params;
      let product = await productModel.findOne({ _id: id }).populate('category');
      res.status(200).send({ message: "Result", product, success: true });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Somthing wrong while fetching data",
        success: false,
        err,
      });
    }
  };
  //delete product
  export let deleteProductController = async (req, res) => {
    let { id } = req.params;
    let data = await productModel.findOne({ _id: id });
    //do cleanup in cloudinary
    await deleteImageOnCloudinary(data.images);
    let deleteProduct = await productModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      message: "Product Deleted Successfully",
      success: true,
      deleteProduct,
    });
  };
  //this is for update
  export let updateProductController = async (req, res) => {
    try {
      let { name, price, quantity, description, category, brand, shipping } =
        req.body;
      let { id } = req.params;
  
      if (
        !name ||
        !price ||
        !quantity ||
        !description ||
        !category ||
        !brand ||
        !shipping
      ) {
        return res.status(200).send({ message: "All fields are required *" });
      } else {
        let findData = await productModel.findOne({ _id: id });
        let image
        if (req.files.length > 0) {
          await deleteImageOnCloudinary(findData.images)
          image = await uploadImageOnCloudinary(req.files);
        }
        let product = await productModel.findByIdAndUpdate(
          { _id: id },
          { ...req.body, images: image ? image : findData.images },
          { new: true }
        );
        res.status(200).send({
          message: "Product Update Succuessful",
          product,
          success: true,
        });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ message: "Somthing wrong while updating", success: false, err });
    }
  };
  
  //this is for filter product controller
  export let filterProductController = async (req, res) => {
    try {
      let { price, checked } = req.body
      let args = {}
      if (checked.length > 0) args.category = checked
      if (price) args.price = { $gte: price[0], $lte: price[1] }
      const products = await productModel.find(args)
      res.status(200).send({ message: "All Filter Data", products, success: true })
  
    }
    catch (err) {
      console.log(err)
      res.status(500).send({ message: "Somthing wrong while filtering", success: false, err })
    }
    let { price, category } = req.body
  }
  
  // this is for the finding the total product
  export let totalProductController = async (req, res) => {
    try {
      let productCount = await productModel.find({}).estimatedDocumentCount()
      res.status(200).send({ message: "Total Count", total: productCount, success: true })
    } catch (error) {
      res.status(500).send({ message: "Something wrong while finding the total", success: false, error })
    }
  }
  
  //this is for the product list 
  export let productListController = async (req, res) => {
    try {
      let { count } = req.params
      const page = count ? req.params.count : 1
      let perPageContent = 3
      let products = await productModel.find({}).skip((page - 1) * perPageContent).limit(perPageContent)
      res.status(200).send({ message: "Product Result", products, success: true })
    } catch (error) {
      res.status(500).send({ message: "Something wrong while loading ", success: false, error })
    }
  }
  
  
  //this is for the searching
  export let serchHandlerController = async (req, res) => {
    try {
      let { keyword } = req.params;
      let products = await productModel.find({
        $or: [{ name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },],
      });
      res
        .status(200)
        .send({
          message: "Result Found",
          products,
          success: true,
          total: products.count,
        });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ message: "Somthing wrong while searching", err, success: false });
    }
  };
  
  // this is for the similar product
  export let similarProductController = async (req, res) => {
    try {
      let { p_id, c_id } = req.params
      let products = await productModel
        .find({
          category: c_id,
          _id: { $ne: p_id },
        })
        .limit(3);
      res.status(200).send({ message: "Similar Product", products, success: true });
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: "Something wrong in simailar product ", success: false, error })
    }
  }
  
  // this is for the product category controller
  export let productCategoryController = async (req, res) => {
    try {
      let { slug } = req.params
      let category = await categoryModel.find({ slug })
      let product = await productModel.find({ category })
      res.status(200).send({ message: "Find the category", success: true, product, total: product.length })
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: "Something wrong while getting the category", success: false, error })
    }
  }
  // this is for the braintree
  export let braintreeTokenController = async (req, res) => {
    try {
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(response);
        }
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ message: "Somthing wrong while payment", err, success: false });
    }
  };
  
  // this for the braintree payment
  export let braintreePaymentController = async (req, res) => {
    try {
      let { nonce, cart } = req.body;
      let total_ammount = cart.reduce((acc, item) => {
        return acc + item.price;
      }, 0);
      gateway.transaction.sale(
        {
          amount: total_ammount,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (error, result) {
          if (result) {
            const order = new orderModel({
              products: cart,
              payment: result,
              buyer: req.user._id,
            }).save();
            res.json({ ok: true });
          } else {
            res.status(500).send(error);
          }
        }
      );
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "somthing wrong while payment", err });
    }
  };