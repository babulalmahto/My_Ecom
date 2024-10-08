import React, { useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
function ForgetPassword() {
  let [auth, setAuth] = useAuth();
  let location = useLocation();
  //env way
  //console.log(process.env.REACT_APP_PROXY)
  let [formData, setData] = useState({
    password: "",
    email: "",
    answer: "",
  });
  let navigate = useNavigate();

  //this is for setting the value of form
  function formDataHandler(e) {
    setData((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  }

  async function submitHandler(e) {
    try {
      e.preventDefault();
      //inline validation
      if (!formData.email || !formData.password || !formData.answer) {
        console.log("All field are required");
      } else {
        //reset password
        let res = await axios.post(`/api/ecom/reset-password`, { ...formData });
        let data = res.data;
        if (data.success) {
          toast(data.message);
          setAuth(data);
          navigate(location.state || "/signin");
        } else {
          toast(data.message);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Layout title="Login -ecomm">
      <h4 className="text-center m-5">Recover Password </h4>
      <div className="container" style={{ height: "70vh" }}>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-5">
            <form>
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
                  placeholder="Enter your  NewPassword"
                  value={formData.password}
                  onChange={formDataHandler}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="answer"
                  name="answer"
                  placeholder="Enter your  Nick Name"
                  value={formData.answer}
                  onChange={formDataHandler}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={submitHandler}
              >
                RESET
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ForgetPassword;
