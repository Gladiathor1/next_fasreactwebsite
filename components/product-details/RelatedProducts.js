import React, { Component } from "react";
import Link from "next/link";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
const OwlCarousel = dynamic(import("react-owl-carousel3"));
import QuickView from "../Modal/QuickView";

import { featuredProducts } from "../../store/actions/productActions";
import { openCartModel } from "../../store/actions/cartActions";

const options = {
  loop: false,
  nav: false,
  dots: true,
  autoplayHoverPause: true,
  autoplay: true,
  navText: [
    "<i className='fas fa-chevron-left'></i>",
    "<i className='fas fa-chevron-right'></i>"
  ],
  responsive: {
    0: {
      items: 1
    },
    576: {
      items: 2
    },
    768: {
      items: 2
    },
    1024: {
      items: 3
    },
    1200: {
      items: 4
    }
  }
};

class RelatedProducts extends Component {
  state = {
    display: false
  };

  async componentDidMount() {
    const { featuredProducts, categoryID } = this.props;
    await featuredProducts(categoryID, 1);
    this.setState({ display: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cartOpenModel !== this.props.cartOpenModel) {
      this.setState({ cart: this.props.cartOpenModel });
    }
  }

  handleProductAddToCart = e => {
    const { openCartModel } = this.props;
    openCartModel(true);

    toast.success("Added to the cart", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  render() {
    const { featured, productID } = this.props;
    const { display } = this.state;
    return (
      <React.Fragment>
        <ReactTooltip />
        <ToastContainer transition={Slide} />
        <div className="related-products-area">
          <div className="container">
            <div className="section-title">
              <h2>
                <span className="dot"></span> Related Products
              </h2>
            </div>

            <div className="row">
              { display ? (
                <OwlCarousel
                  className="trending-products-slides owl-carousel owl-theme"
                  {...options}
                >
                  {featured.map((data, idx) => {
                    let img = data.custom_attributes.find(
                      att => att.attribute_code === "image"
                    );
                    img = img ? `${process.env.productImage}${img.value}` : "";
                    return (
                      data.id !== productID && (
                        <div
                          className="col-lg-12 col-md-12 single-product-box"
                          key={data.id}
                        >
                          <div className="product-image">
                            <Link
                              href="/[product]"
                              as={`/${data.url_key}.html`}
                            >
                              <a className="image-container">
                                <img src={img} alt="image" />
                              </a>
                            </Link>
                          </div>

                          <div className="product-content">
                            <h3>
                              <a>{data.name}</a>
                            </h3>

                            <div className="product-price">
                              <span className="new-price">{data.price}</span>
                            </div>

                            <div className="col-lg-12 col-md-12 mb-10">
                              <Link
                                href="/[product]"
                                as={`/${data.url_key}.html`}
                              >
                                <a className="btn btn-primary">
                                  View Product
                                </a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })}
                </OwlCarousel>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    featured: state.productReducer.featured
  };
};

const mapDispatchToProps = dispatch => {
  return {
    featuredProducts: bindActionCreators(featuredProducts, dispatch),
    openCartModel: bindActionCreators(openCartModel, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelatedProducts);
