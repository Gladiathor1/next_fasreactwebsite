import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { bindActionCreators } from "redux";
import he from "he";
import { addToCart } from "./../../utils/addToCart";
import {
  addToCartProduct,
  getCartProduct,
  createCart,
  addItem,
  getTotals
} from "../../store/actions/cartActions";
import "react-toastify/dist/ReactToastify.css";

class QuickView extends Component {
  state = {
    quantity: 1,
    selectedVariant: '',
    showAll: false,
  };

  handleShowAllInfo = () => {
    this.setState({ showAll: !this.state.showAll });
  }

  handleProductAddToCart = async (price, label) => {
    const { productDetail } = this.props;
    const { selectedVariant } = this.state;
    if (productDetail.__typename === 'ConfigurableProduct' && selectedVariant === '') {
      toast.error("Please select a color.", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } else {
      const { quantity } = this.state;
      let data = {};
      if (productDetail.__typename === 'ConfigurableProduct') {
        data = {
          type: 'ConfigurableProduct',
          parent_sku: productDetail.sku,
          variant: {
            sku: selectedVariant.product.sku,
            custom_price: price === 1 || price === 8 ? true : false,
            price: parseFloat(price),
            purchased: label,
            quantity,
          }
        }
      } else {
        data = {
          type: 'SimpleProduct',
          sku: productDetail.sku,
          custom_price: price === 1 || price === 8 ? true : false,
          price: parseFloat(price),
          purchased: label,
          quantity
        }
      }
      this.saveState(productDetail, selectedVariant, price, label);
      await addToCart(this.props, toast, data);
    }
  }

  saveState = (data, variant, price, label) => {
    const { addItem } = this.props;
    let params = {};
    if(data.__typename === 'ConfigurableProduct') {
      params = {
        product_type: "configurable",
        sku: variant.product.sku,
        qty: this.state.quantity,
        name: variant.product.name,
        price,
        extension_attributes: { image_url: variant.product.small_image.url, purchased: label }
      }
    } else {
      params = {
        product_type: "simple",
        sku: data.sku,
        qty: this.state.quantity,
        name: data.name,
        price,
        extension_attributes: { image_url: data.image.url, purchased: label }
      }
    }
    addItem(params);
  }

  IncrementItem = () => {
    this.setState(prevState => ({ quantity: prevState.quantity + 1 }));
  }

  DecreaseItem = () => {
    if (this.state.quantity > 1) {
        this.setState(prevState => ({ quantity: prevState.quantity - 1 }));
    }
  }

  handleChange = e => {
    this.setState({ quantity: parseInt(e.target.value) })
  }

  onVariantSelection = (v) => {
    this.setState({ selectedVariant: v });
  }

  render() {
    const { quantity, selectedVariant, showAll } = this.state;
    const { closeModal, productDetail } = this.props;
    let img = productDetail.image && productDetail.image.url ? `${productDetail.image.url}` : '';
    const price = productDetail.price_range ? productDetail.price_range.minimum_price.regular_price.value : 0.00;
    return (
      <div className="modal fade productQuickView show" style={{ display: 'block' }}>
        <ToastContainer />
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <button type="button" onClick={closeModal} className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i className="fas fa-times"></i></span>
            </button>
            <div className="row">
              <div className="col-md-5 col-sm-12">
                <div className="productQuickView-image">
                  <img src={img} alt="image" />
                </div>
              </div>

              <div className="col-md-7 col-sm-12">
                <div className="product-details-content">
                  <h3><a href="#">{he.decode(productDetail.name)}</a></h3>
                    <div className="price">
                        <span className="new-price">$ {parseFloat(price).toFixed(2)} </span>
                        <small>(USD) per Yard</small>
                    </div>

                  <div className="row product-variations">
                    <div className="col-sm-12 colors">
                      <div className="row">
                        {productDetail.variants && productDetail.variants.map((v, index) => {
                          return (
                            (!showAll && index < 30) || showAll ?
                            <div key={v.product.id} className="col-sm-2 color" onClick={() => this.onVariantSelection(v)}>
                              <div className={`image-container ${selectedVariant && selectedVariant.product.id === v.product.id ? `active` : ``}`}>
                                <div className="image-tooltip">
                                  <img src={v.product.small_image.url} alt="v" />
                                </div>
                                <img src={v.product.small_image.url} alt="v" />
                              </div>
                              <p>{v.attributes && v.attributes.length ? v.attributes[0].label: null}</p>
                            </div> : null
                          )
                        })}
                      </div>
                      { productDetail.variants && productDetail.variants.length > 30 &&
                          <div className="view-more-label">
                              <a onClick={this.handleColors}>
                                  { this.state.viewAll ?
                                      `View Less Colors ( ${productDetail.variants.length}/${productDetail.variants.length} )` :
                                      `View All Colors ( 30/${productDetail.variants.length} )`
                                  }
                              </a>
                          </div>
                      }
                    </div>
                  </div>
                  <div className="product-add-to-cart mt-3 d-inline-flex">
                    {productDetail.stock_status === 'IN_STOCK' ?
                      <div className="input-counter">
                        <span
                          className="minus-btn"
                          onClick={this.DecreaseItem}
                        >
                          <i className="fas fa-minus"></i>
                        </span>
                        <input
                          type="number"
                          value={quantity}
                          onChange={this.handleChange}
                        />
                        <span
                          className="plus-btn"
                          onClick={this.IncrementItem}
                        >
                          <i className="fas fa-plus"></i>
                        </span>
                      </div> :
                      <div>
                        <p className="text-danger">Out of Stock</p>
                      </div>
                    }
                  </div>

                  <div className="d-inline-flex mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary mx-2"
                      onClick={() => this.handleProductAddToCart(price, "")}
                    >
                      <i className="fas fa-cart-plus mr-1"></i> Add to Cart
                    </button>
                  </div>
                  <button className="btn btn-light mt-3 mr-2 d-inline-flex btn-font-transform" onClick={() => this.handleProductAddToCart(1, "Swatch")}>
                    <i className="fas fa-cart-plus mr-1"></i> Order swatch $1
                  </button>
                  <button className="btn btn-light mt-3 d-inline-flex btn-font-transform" onClick={() => this.handleProductAddToCart(8, "Color Card")}>
                    <i className="fas fa-cart-plus mr-1"></i> Order color card $8
                  </button>
                </div>
             
                <Link href="/[product]" as={`/${productDetail.url_key}.html`}>
                  <a className="view-full-info" onClick={closeModal}>View full info</a>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    productDetail: state.productReducer.productDetail
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCartProduct: bindActionCreators(addToCartProduct, dispatch),
    getCartProduct: bindActionCreators(getCartProduct, dispatch),
    createCart: bindActionCreators(createCart, dispatch),
    addItem: bindActionCreators(addItem, dispatch),
    getTotals: bindActionCreators(getTotals, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickView);
