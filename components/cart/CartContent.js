import React, { Component } from "react";
import Link from "next/link";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ToastContainer, toast, Slide } from "react-toastify";
import CartProduct from "./CartProduct";
import {
  getCartProduct,
  getTotals
} from "../../store/actions/cartActions";
import "react-toastify/dist/ReactToastify.css";

class CartContent extends Component {
  async componentDidMount() {
    const { getCartProduct } = this.props;
    await getCartProduct();
    getTotals();
  }

  render() {
    const { cartItems, cartTotals } = this.props;
    return (
      <section className="cart-area ptb-60">
        <ToastContainer transition={Slide} />
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <form>
                <div className="cart-table table-responsive">
                  <CartProduct />
                </div>

                <div className={cartItems.length > 0 ? "cart-buttons" : "cart-buttons text-center"}>
                  <div className="row align-items-center">
                    <div className="col-lg-12 col-md-12">
                      <div className="continue-shopping-box">
                        <Link href="/">
                          <a className="btn btn-light">Continue Shopping</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                { cartItems.length > 0 &&
                  <div className="cart-totals">
                    <h3>Summary</h3>
                    <br></br>
                    <ul>
                      <li>
                        Subtotal <span>${cartTotals.subtotal ? parseFloat(cartTotals.subtotal).toFixed(2) : '0.00'}</span>
                      </li>
                      <li>
                        Discount <span>{cartTotals.discount ? parseFloat(cartTotals.discount).toFixed(2) : '0.00'}</span>
                      </li>
                      <li>
                        Total <span><b>${cartTotals.total ? parseFloat(cartTotals.total).toFixed(2) : '0.00'}</b></span>
                      </li>
                    </ul>
                    <Link href="/checkout">
                      <button className="btn btn-primary">Proceed to Checkout</button>
                    </Link>
                  </div>
                }
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    cartItems: state.cartReducer.cartItems,
    cartTotals: state.cartReducer.cartTotals
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCartProduct: bindActionCreators(getCartProduct, dispatch),
    getTotals: bindActionCreators(getTotals, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartContent);
