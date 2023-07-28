import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "next/link";
import Loader from "react-loader-spinner";
import he from "he";
import { ToastContainer, toast, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from "debounce";
import {
  getCartProduct,
  removeCartProduct,
  addToCartProduct,
  createCart,
  updateCartProduct,
  openCartModel,
  applyCoupon,
  updateCart,
  deleteItem,
  getTotals
} from "../../store/actions/cartActions";

class Cart extends Component {
  constructor() {
    super();
    this.state = {
      productId: "",
      coupon: "",
      couponError: false,
      display: false,
      loader: false
    };

    this.callUpdate = debounce(this.callUpdate, 500);
  }

  checkTheIndex = value => {
    return value;
  };

  handleProductRemove = async (product) => {
    const { removeCartProduct, getCartProduct, createCart, deleteItem, getTotals } = this.props;
    const cartID = localStorage.getItem("cartID");

    deleteItem(product.sku);
    if (!cartID) {
      await createCart();
    }
    await removeCartProduct(product.item_id)
    await getCartProduct();
    getTotals();
  };

  closeCart = () => {
    this.props.onClick(this.state.display);
  };

  IncrementItem = (product, qty) => {
    this.handleUpdate(product, qty + 1);
  };

  DecreaseItem = (product, qty) => {
    if (product.qty > 1) {
      this.handleUpdate(product, qty - 1);
    } else {
      this.handleProductRemove(product);
    }
  };

  handleUpdate = async (product, qty) => {
    const { updateCart } = this.props;
    if (qty >= 1) {
      updateCart({id: product.sku, qty})
      this.callUpdate(product, qty)
    }
  }

  callUpdate = async (product, qty) => {
    const { updateCartProduct, getCartProduct, createCart, getTotals } = this.props;
    const cartID = localStorage.getItem("cartID");
    if (!cartID) {
      await createCart();
    }
    await updateCartProduct(product.item_id, qty)
    await getCartProduct();
    getTotals();
  }

  handleChange = (e) => {
    this.setState({ coupon: e.target.value });
  }

  handleClick = async () => {
    const { getCartProduct, applyCoupon, getTotals } = this.props;
    const { coupon } = this.state;

    if(coupon) {
      this.setState({ loader: true });
      const res = await applyCoupon(coupon);
      if(!res.payload.applyCouponToCart) {
        this.setState({ couponError: true });
        toast.error("Coupon Code does not exist.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      } else {
        this.setState({ couponError: false });
        await getCartProduct();
        await getTotals();
      }
      this.setState({ loader: false, coupon: "" });
    }
  }

  componentWillUnmount() {
    this.props.onClick(this.state.display);
  }

  render() {
    const { openCartModel, displayCartModal, cartList, cartTotals } = this.props;
    return (
      <div
        className="modal right fade show shoppingCartModal"
        style={{
          display: `${displayCartModal ? "block" : ""}`,
          paddingRight: "16px"
        }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={this.closeCart}
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div className="modal-body">
              <h3>My Cart ({cartList.length})</h3>
              <div className="product-cart-content">
                { cartList.length > 0 ? cartList.map((product, idx) => (
                  <div className="product-cart" key={idx}>
                    <div className="product-image">
                      <img
                        src={product.extension_attributes.image_url}
                        alt="image"
                      />
                    </div>

                    <div className="product-content">
                      <button className="close" onClick={() => this.handleProductRemove(product)} type="button">
                        <span>×</span>
                      </button>
                      <h3 className="pr-3">
                        {he.decode(product.name)}
                        {product.extension_attributes.purchased ? ` (${product.extension_attributes.purchased})` : ``}
                      </h3>

                      <div className="product-details-content product-qty-add">
                        <div className="product-add-to-cart">
                          <div className="input-counter">
                            <span
                              className="minus-btn"
                              onClick={() => this.DecreaseItem(product, product.qty)}
                            >
                              <i className="fas fa-minus"></i>
                            </span>
                            <input
                              type="text"
                              readOnly
                              min={1}
                              value={product.qty}
                            />
                            <span
                              className="plus-btn"
                              onClick={() => this.IncrementItem(product, product.qty)}
                            >
                              <i className="fas fa-plus"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="product-price">
                        <span className="price"> {product.qty} </span>
                        <span>x</span>
                        <span className="price">$ {product.price}</span>
                      </div>
                    </div>
                  </div>
                )) :
                  <div className="text-center">
                    <p className="text-center cart-modal-icon">
                      <i className="fa fa-shopping-cart"></i>
                    </p>
                    <p className="text-center">Your cart is empty</p>

                    <Link href="/">
                      <button
                        className="btn btn-light"
                        onClick={() => openCartModel(false)}
                      >
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                }
              </div>

              { cartList.length > 0 &&
                <>
                  <div className="product-cart-subtotal">
                    <span>Subtotal</span>

                    <span className="subtotal">
                      ${cartTotals.subtotal ? parseFloat(cartTotals.subtotal).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="product-cart-subtotal">
                    <span>Discount</span>

                    <span className="subtotal">
                      {cartTotals.discount ? parseFloat(cartTotals.discount).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="product-cart-subtotal">
                    <span>Total</span>

                    <span className="subtotal">
                      ${cartTotals.total ? parseFloat(cartTotals.total).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="coupon-area">
                    <p>Add Coupon Code</p>
                    <div className="coupon-actions">
                      <input className="coupon-input" value={this.state.coupon} onChange={this.handleChange} />
                      <button className="btn btn-primary coupon-btn" onClick={this.handleClick}>
                        <span className="d-flex align-items-center">
                          <Loader visible={this.state.loader} className="spinner mr-1" type="TailSpin" color="#0c9495" height={15} width={15} />
                          APPLY
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="product-cart-btn">
                    <Link href="/checkout">
                      <button
                        className="btn btn-primary"
                        onClick={() => openCartModel(false)}
                      >
                        Proceed to Checkout
                      </button>
                    </Link>
                    <Link href="/cart">
                      <button
                        className="btn btn-light"
                        onClick={() => openCartModel(false)}
                      >
                        View Shopping Cart
                      </button>
                    </Link>
                  </div>
                </>
              }
            </div>
          </div>
        </div>
        { this.state.couponError && <ToastContainer transition={Slide} /> }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    total: state.cartReducer.total,
    cartList: state.cartReducer.cartItems,
    cart: state.cartReducer.cart,
    cartTotals: state.cartReducer.cartTotals
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCartProduct: bindActionCreators(getCartProduct, dispatch),
    removeCartProduct: bindActionCreators(removeCartProduct, dispatch),
    updateCartProduct: bindActionCreators(updateCartProduct, dispatch),
    addToCartProduct: bindActionCreators(addToCartProduct, dispatch),
    createCart: bindActionCreators(createCart, dispatch),
    openCartModel: bindActionCreators(openCartModel, dispatch),
    applyCoupon: bindActionCreators(applyCoupon, dispatch),
    updateCart: bindActionCreators(updateCart, dispatch),
    deleteItem: bindActionCreators(deleteItem, dispatch),
    getTotals: bindActionCreators(getTotals, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
