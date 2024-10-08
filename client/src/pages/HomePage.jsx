import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Checkbox, Radio } from "antd";
import useProduct from "../hook/useProduct";
import useCategory from "../hook/useCategory";
import { Price } from "../components/Price";
import axios from "axios";
import MoreDeatils from "../components/form/MoreDeatails";
import { useNavigate } from "react-router-dom";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { Flex, Spin } from "antd";
import AddToCart from "../components/form/AddToCart";

function HomePage() {
  let navigate = useNavigate()
  let [selectedCategory, setSelectedCategory] = useState([]);
  let [price, setPrice] = useState("");
  let { categories } = useCategory();
  let [filterData, setFilterData] = useState([]);
  let [limitProduct, setLimitProduct] = useState([]);
  let [scrollPosition, setScrollPosition] = useState('')
  //product count
  let [productCount, setProductCount] = useState("");
  //pageCount
  let [pageCount, setPageCount] = useState(1);

  //this is for handling category
  function changeCategoryHandler(e, id) {
    let all = [...selectedCategory];
    let checked = e.target.checked;
    if (checked) {
      all.push(id);
    } else {
      all = all.filter((data) => {
        return data !== id;
      });
    }
    setSelectedCategory([...all]);
  }
  //this is for price handler
  function priceHandler(e) {
    setPrice(e.target.value);
  }
  //this is filteration
  async function filterHanlder() {
    let res = await axios.post("/api/ecom/filter-product", {
      price,
      checked: selectedCategory,
    });
    setFilterData(res.data.products);
  }
  //this is for totalCount
  async function totalCount() {
    try {
      let { data } = await axios.get("/api/ecom/totalProduct");
      setProductCount(data.total);
    } catch (err) {
      console.log(err);
    }
  }

  //this is for product-list
  async function productList() {
    let { data } = await axios.get(`/api/ecom/product-list/${pageCount}`);

    setLimitProduct([...limitProduct, ...data.products]);
  }
  useEffect(() => {
    productList()
  }, [pageCount]);
  //this useEffect for total count
  useEffect(() => {
    totalCount();
  }, []);
  //this useEffect for filteration
  useEffect(() => {
    filterHanlder();
  }, [price, selectedCategory]);
  //this is for singlepageHandler
  function singlPageHandler(id) {
    navigate(`/product-details/${id}`)
  }



  
  // window.addEventListener('scroll', () => {
  //   let scroll = window.scrollY
  //   setScrollPosition(scroll)
  // })

  // useEffect(() => {
  //   productList()
  //   let id = setTimeout(() => {
  //     if (scrollPosition >100) {
  //       setPageCount(pageCount + 1)
  //     }
  //   }, 500);
  //   return () => {
  //     clearTimeout(id)
  //   }
  // }, [scrollPosition,pageCount])


  return (
    <Layout title="Best Offer -ecomm">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="category-checkbox mt-2">
              <h6>All Category</h6>
              <hr />
              <div className="mt-1">
                {categories.map((item) => {
                  return (
                    <div key={item._id}>
                      <Checkbox
                        value={item._id}
                        className="p-2"
                        style={{ fontSize: "16px" }}
                        onChange={(e) => {
                          changeCategoryHandler(e, item._id);
                        }}
                      >
                        {item.name}
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="price-range mt-2">
              <h6> Filter By Price</h6>
              <hr />
              <div className="mt-2">
                <Radio.Group onChange={priceHandler}>
                  {Price.map((item) => {
                    return (
                      <div key={item._id} className="p-2">
                        <Radio value={item.array}>{item.name}</Radio>
                      </div>
                    );
                  })}
                </Radio.Group>
              </div>
            </div>
            <div className="mt-2">
              <button
                className="btn btn-danger"
                onClick={() => {
                  window.location.reload();
                }}
              >
                CLEAR ALL
              </button>
            </div>
          </div>
          <div className="col-md-9">
            <h3 className="text-center mt-2" style={{ color: "#32752b" }}>Products </h3>
            <p className="text-end">
              {price || selectedCategory.length > 0 ? (
                <p>
                  {filterData.length}/{productCount} Found
                </p>
              ) : (
                `Total Products : ${productCount}`
              )}
            </p>
            <div className="row">
              {limitProduct.length === 0 && <Flex gap="small" vertical>
                <Spin tip="Loading" size="large">
                  <div className="content" />
                </Spin>
              </Flex>}
              {limitProduct.length > 0 && (
                <>
                  {(selectedCategory.length > 0 || price
                    ? filterData
                    : limitProduct
                  ).map((item, i) => {
                    let {
                      name = "unknow",
                      price = 0,
                      brand = "unknown",
                      images = "https://newhorizoncollegeofengineering.in/applied_science_elementor/wp-content/uploads/2020/01/default-placeholder.png",
                    } = item;
                    return (
                      <div className="col-md-4 mb-3" key={i}>
                        <div className="card">
                          <div className="card-body">
                            <div className="img">
                              <img
                                src={images[0]?.url}
                                alt={images[0]?.url}
                                className="img-fluid"
                              />
                            </div>
                            <div className="card-footer">
                              <p>
                                <b>{name}</b>
                              </p>
                              <p>{brand}</p>
                              <p><LiaRupeeSignSolid /> {price}</p>
                              <div className="action d-flex">
                                <MoreDeatils p_id={item._id} singlPageHandler={singlPageHandler} />
                                <AddToCart prod={item} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-center m-3">
            {productCount > limitProduct.length && (
              <button
                className="btn btn-warning"
                style={{ border: "none", }}
                onClick={() => {
                  setPageCount(pageCount + 1);
                }}
              >Load More</button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
