import { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import reducer from "../Reducer/ProductReducers.js";
import {
  errorWhileProductApi,
  fetchedData,
  initalData,
  singlError,
  singleFetchedProduct,
  singleloading,
} from "../Action/ActionCreator";

export let productContext = createContext();
let initalState = {
  loading: false,
  products: [],
  total:'',
  error: "",
  product:{},
  single_loader:false,
  single_error:''
};

function ProductContext({ children }) {
  let [productChange,setProductChange]=useState(false)
  let [state, dispatch] = useReducer(reducer, initalState);
  async function getAllProduct() {
    try {
      dispatch(initalData());
      let { data } = await axios.get("/api/ecom/products");
      dispatch(fetchedData(data.products));
    } catch (err) {
      console.log(err);
      dispatch(errorWhileProductApi(err.message));
    }
  }
  async function singleProduct(url)
  {
    try {
      dispatch(singleloading());
      let { data } = await axios.get(url);
      dispatch(singleFetchedProduct(data.product));
    } catch (err) {
      console.log(err);
      dispatch(singlError(err));
    } 
  }

  useEffect(() => {
    getAllProduct();
  }, [productChange]);
  return (
    <productContext.Provider value={{ ...state ,singleProduct,productChange,setProductChange}}>
      {children}
    </productContext.Provider>
  );
}

export default ProductContext;
