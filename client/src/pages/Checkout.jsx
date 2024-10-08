import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";
import useCart from "../hook/useCart";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaIndianRupeeSign } from "react-icons/fa6";

function Checkout() {
  let [auth] = useAuth();
  let [cart, setCart] = useCart();
  let navigate = useNavigate();
  let [clientToken, setClientToken] = useState("");
  let [instance, setIntance] = useState();
  //this is for totalpriceHandler
  function totalPriceHandler() {
    return cart.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
  }
  //this is for update handler
  let updateAddressHandler=()=>{
     navigate('/dashboard/user/profile',{ state: "/cart" })
  }
  //thi is funciton login handler
  function loginHandler() {
    navigate("/signin", { state: "/cart" });
  }
  //token handler
  async function tokenHandler() {
    let { data } = await axios.get("/api/ecom/braintree/token");
    setClientToken(data.clientToken);
  }
  useEffect(() => {
    tokenHandler();
  }, []);

  // this is for delete cart item
  function DeleteHandler(id){
      let filterCart=cart.filter((item)=>{
        return item._id!==id
      })
      setCart(filterCart)
  }
  //this is for payment handler
  async function paymentHandler() {
    const { nonce } = await instance.requestPaymentMethod();
    let {data}= await axios.post('/api/ecom/braintree/payment',{cart,nonce},{headers:{"Authorization":auth.token}})
    console.log(data)
    if(data.ok)
    {
        setCart([])
        toast('Order Successful')
        navigate('/dashboard/user/order')

    }
  }
  return (
    <Layout title={"Add To Cart || Checkout - ecomm"}>
      <div className="container">
        <div className="m-3 p-2 ">
          <h4 className="text-center">
            Hello {auth?.user?.name ? auth?.user?.name : "Unknown"}
          </h4>
          <p className="m-2 text-center">
            You Have <strong>{cart.length}</strong> items in your cart
          </p>
        </div>
        <div className="row d-flex justify-content-start m-2">
          <div className="col-md-7">
            <div className="row">
              {cart.map((item, i) => {
                return (
                  <div
                    key={i}
                    style={{ border: "1px solid black " }}
                    className="d-flex  align-items-center p-3 mt-3"
                    mb-3
                  >
                    <div className="col-md-5 m-3">
                      <img
                        src={item?.images[0]?.url}
                        alt={item?.images[0]?.url}
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-7 ">
                      <h6>{item?.name}</h6>
                      <p style={{width:"300px"}}>{item?.description}</p>
                      <p>Price:{item?.price}</p>
                      <button className="btn btn-danger" onClick={()=>{
                        DeleteHandler(item._id)
                      }}>REMOVE</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {cart.length>0 && <div className="col-md-5">
            <h4 className="text-center m-2">Cart Summary</h4>
            <p className="text-center"> Total | Checkout | Payment</p>
            <hr />
            <h5 className="text-center">Total:{totalPriceHandler?<FaIndianRupeeSign />:''}{totalPriceHandler()}</h5>
            <div className="d-flex justify-content-center mt-3 mb-3">
              {!auth?.token && (
                <button className="btn btn-warning " onClick={loginHandler}>
                  Please Login to Checkout
                </button>
              )}
            </div>
            <div className="d-flex justify-content-center align-items-center flex-column mt-3 mb-3">
              {auth?.token &&
                (auth?.user.address ? (
                  <>
                    Current Address
                    <p>
                      <strong>{auth?.user?.address}</strong>
                    </p>
                    <button className="btn btn-warning" onClick={updateAddressHandler}>Update Address</button>
                  </>
                ) : (
                  <button className="btn btn-warning" onClick={updateAddressHandler}>Update Address</button>
                ))}
            </div>

            {/* //abc */}
            <div className="row">
              <div className="col">
                {auth.token && clientToken && (
                  <>
                    {" "}
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: { flow: "vault" },
                      }}
                      onInstance={(instance) => {
                        setIntance(instance);
                      }}
                    />
                    <button
                      onClick={paymentHandler}
                      disabled={!instance || !auth.user.address}
                      className="btn btn-warning"
                    >
                      Make Payment
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>}
          
        </div>
      </div>
    </Layout>
  );
}

export default Checkout;
