import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'
import axios from "axios";

function Signup() {
  //env way
  //cosole.log(porcess.env.REACT_APP_PROXY)
  let [formData, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
  });
  let navigate = useNavigate();
  // this is for setting up form data
  function formDataHandler(e) {
    setData((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  }
  async function submitHandler(e) {
    try {
      e.preventDefault();
      //inline validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.answer ||
        !formData.password
      ) {
        console.log("All Fields are required * ");
      } else {
        console.log(formData);

        // api hitting
        let res = await axios.post(`/api/ecom/register`, { ...formData });
        let data = res.data;
        if (data.success) {
          toast(data.message);
          console.log(data.message);
          navigate("/signin");
        } else {
          toast(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout title="Registration -ecomm">
      <h4 className="text-center m-5">Registration Form </h4>
      <div className="container" style={{ height: "70vh" }}>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-5">
            <form>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={formDataHandler}
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={formDataHandler}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter your Password"
                  value={formData.password}
                  onChange={formDataHandler}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="Enter your Mobile No."
                  value={formData.phone}
                  onChange={formDataHandler}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="answer"
                  name="answer"
                  placeholder="What is Your Nick name"
                  value={formData.answer}
                  onChange={formDataHandler}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={formDataHandler}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                onClick={submitHandler}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Signup;
