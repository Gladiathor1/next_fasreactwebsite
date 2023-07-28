import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import { ToastContainer, toast, Slide } from "react-toastify";
import he from "he";
import {
  addToCartProduct,
  addItem,
  removeCartProduct,
  getCartProduct,
  createCart,
  getTotals
} from "../../store/actions/cartActions";
import QuickView from "../Modal/QuickView";
import { currentProduct } from "../../store/actions/productActions";
import { addToCart } from "./../../utils/addToCart";

class ProductsCard extends Component {
  state = {
    modalOpen: false,
    products: []
  };

  componentDidMount() {
    this.setProducts();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.products !== this.props.products) {
      this.setProducts();
    }
  }

  setProducts = () => {
    const { products } = this.props;
    this.setState({ products: products.map(x => ({ ...x, selectedQty: 1, selectedVar: {} })) });
  }
  
  handleProductAddToCart = async (data) => {
    if (data.__typename === 'ConfigurableProduct' && !data.selectedVar.id) {
      toast.error("Please select a color.", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } else {
      let params = {};
      if (data.__typename === 'ConfigurableProduct') {
        params = {
          type: 'ConfigurableProduct',
          parent_sku: data.sku,
          variant: {
            sku: data.selectedVar.sku,
            custom_price: false,
            price: parseFloat(0),
            quantity: data.selectedQty,
            purchased: ""
          }
        }
      } else {
        params = {
          type: 'SimpleProduct',
          sku: data.sku,
          custom_price: false,
          price: parseFloat(0),
          quantity: data.selectedQty,
          purchased: ""
        }
      }
      this.saveState(data);
      await addToCart(this.props, toast, params);
    }
  }

  saveState = (data) => {
    const { addItem } = this.props;
    let params = {};
    if(data.__typename === 'ConfigurableProduct') {
      params = {
        product_type: "configurable",
        sku: data.selectedVar.sku,
        qty: data.selectedQty,
        name: data.selectedVar.name,
        price: data.price_range.minimum_price.regular_price.value,
        extension_attributes: { image_url: data.selectedVar.small_image.url }
      }
    } else {
      params = {
        product_type: "simple",
        sku: data.sku,
        qty: data.selectedQty,
        name: data.name,
        price: data.price_range.minimum_price.regular_price.value,
        extension_attributes: { image_url: data.image.url }
      }
    }
    addItem(params);
  }

  handleModel = product => {
    const { currentProduct } = this.props;
    currentProduct(product);
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  IncrementItem = (product) => {
    const products = [...this.state.products];
    const index = products.findIndex(att => att.id === product.id);
    if (index !== -1) {
      products[index].selectedQty = products[index].selectedQty + 1;
    }
    this.setState({ products });
  }

  DecreaseItem = (product) => {
    const products = [...this.state.products];
    const index = products.findIndex(att => att.id === product.id);
    if (index >= 0) {
      products[index].selectedQty = products[index].selectedQty > 1 ? products[index].selectedQty - 1 : products[index].selectedQty;
    }
    this.setState({ products });
  }

  handleQty = (e, i) => {
    const products = [...this.state.products];
    products[i].selectedQty = parseInt(e.target.value);
    this.setState({ products });
  }

  selectVariant = (variant, index) => {
    let products = [...this.state.products];
    products[index].selectedVar = variant.product;
    this.setState({ products });
  }

  render() {
    const { products, modalOpen } = this.state;
    let rProducts = [];

    rProducts = products.map((data, i) => {
      let img = (data.image && data.image.url) || "";
      return (
        <div
          className="col-sm-3 col-6 arrival-col products-col-item"
          key={data.id}
        >
          <div className="single-product-box">
            <div className="product-image">
              <Link
                href="/[product]"
                as={`/${data.url_key}.html`}
              >
                <a>
                  <img src={img} alt="image" />
                </a>
              </Link>

              <ul>
                <li>
                  <a
                    data-tip="Quick View"
                    data-place="left"
                    onClick={e => {
                      e.preventDefault();
                      this.handleModel(data);
                    }}
                  >
                    <i className="far fa-eye"></i>
                  </a>
                </li>
              </ul>
            </div>

            <div className="product-content">
              <Link
                href="/[product]"
                as={`/${data.url_key}.html`}
              >
                <h3>{he.decode(data.name)}</h3>
              </Link>

              <div className="product-price">
                <span className="new-price">
                  $ {data.price_range.minimum_price.regular_price.value.toFixed(2)}
                </span>
              </div>

              <div className="variations col-sm-12">
                <div className="row d-flex variant">
                  {data.variants && data.variants.map((variant, index) =>
                    index < 12 && variant.product && variant.product.small_image && (
                      <div
                        key={variant.product.id}
                        className={`image-container ${ data.selectedVar.id === variant.product.id ? 'active' : '' }`}
                        onClick={() => this.selectVariant(variant, i)}
                      >
                        <div className="image-tooltip">
                          <img src={variant.product.small_image.url} alt="v" />
                        </div>
                        <img src={variant.product.small_image.url} />
                      </div>
                    )
                  )}
                </div>
              </div>

              {data.variants && data.variants.length > 12 &&
                <Link
                  href="/[product]"
                  as={`/${data.url_key}.html`}
                >
                  <div className="view-more-label">
                    <a>
                      {`View All Colors ( 12/${data.variants.length} )`}
                    </a>
                  </div>
                </Link>
              }
            </div>
            <div className="product-details-content">
              <div className="product-add-to-cart">
                <div className="input-counter mb-10">
                  <span
                    className="minus-btn"
                    onClick={() => this.DecreaseItem(data)}
                  >
                    <i className="fas fa-minus"></i>
                  </span>
                  <input
                    type="number"
                    value={data.selectedQty}
                    onChange={(e) => this.handleQty(e, i)}
                  />
                  <span
                    className="plus-btn"
                    onClick={() => this.IncrementItem(data)}
                  >
                    <i className="fas fa-plus"></i>
                  </span>
                </div>

                <button className="btn btn-primary px-2" onClick={() => this.handleProductAddToCart(data)} >
                  <i className="fas fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <React.Fragment>
        <ReactTooltip />
        <ToastContainer transition={Slide} />
        {rProducts}
        {modalOpen ? <QuickView closeModal={this.handleModel} /> : ""}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    cartItems: state.cartReducer.cartItems
  };
};

const mapDispatchToProps = dispatch => {
  return {
    currentProduct: bindActionCreators(currentProduct, dispatch),
    addToCartProduct: bindActionCreators(addToCartProduct, dispatch),
    removeCartProduct: bindActionCreators(removeCartProduct, dispatch),
    getCartProduct: bindActionCreators(getCartProduct, dispatch),
    createCart: bindActionCreators(createCart, dispatch),
    addItem: bindActionCreators(addItem, dispatch),
    getTotals: bindActionCreators(getTotals, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsCard);
