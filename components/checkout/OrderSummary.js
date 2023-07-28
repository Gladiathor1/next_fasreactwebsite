import React, { Component } from "react";
import { connect } from "react-redux";
import { getCartProduct, getTotals } from "../../store/actions/cartActions";
import { bindActionCreators } from "redux";

class OrderSummary extends Component {
  state = {
    cartItems: [],
    gettotal: "0"
  };

  async componentDidMount() {
    const { getCartProduct } = this.props;
    await getCartProduct();
    getTotals();
  }

  componentDidUpdate(oldProps) {
    const { products } = this.props;
    if (oldProps.products !== products) {
      this.setState({ cartItems: products });
      let getPrice = products.map(item => item.qty * item.price);
      let gettotal = getPrice.reduce(function (qty, val) {
        return qty + val;
      }, 0);
      gettotal = gettotal.toFixed(2);
      this.setState({ gettotal });
    }
  }

  render() {
    const { gettotal } = this.state;
    const { orderSummary } = this.props;
    return (
      <div className="order-table table-responsive">
        <table className="table table-bordered">
          <tbody>
            {orderSummary !== undefined && orderSummary.length > 0 ?
              orderSummary.map((data, idx) => (
                <tr key={idx}>
                  <td className="product-name">
                    <a href="#">{data.title}</a>
                  </td>

                  <td className="product-total">
                    <span className="subtotal-amount">
                      ${data.value}
                    </span>
                  </td>
                </tr>
              )) :
              <>
                <tr>
                  <td className="product-name">
                    Subtotal
                  </td>
                  <td className="product-total">
                    <span className="subtotal-amount">
                      ${gettotal}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="product-name">
                    Shipping & Handling (Flat Rate - Fixed)
                  </td>
                  <td className="product-total">
                    <span className="subtotal-amount">
                      $0
                  </span>
                  </td>
                </tr>
                <tr>
                  <td className="product-name">
                    Tax
                  </td>
                  <td className="product-total">
                    <span className="subtotal-amount">
                      $0
                  </span>
                  </td>
                </tr>
                <tr>
                  <td className="product-name">
                    Grand Total
                  </td>
                  <td className="product-total">
                    <span className="subtotal-amount">
                      ${gettotal}
                    </span>
                  </td>
                </tr>
              </>}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.cartReducer.cartItems,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCartProduct: bindActionCreators(getCartProduct, dispatch),
    getTotals: bindActionCreators(getTotals, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
