import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import he from "he";
import Loader from "react-loader-spinner";
import { debounce } from "debounce";
import {
  getCartProduct,
  removeCartProduct,
  addToCartProduct,
  updateCartProduct,
  createCart,
  updateCart,
  deleteItem,
  getTotals
} from "../../store/actions/cartActions";
import "react-toastify/dist/ReactToastify.css";

class CartProduct extends Component {
  constructor() {
    super();
    this.state = {
      gettotal: "0",
      cartLoader: false
    };

    this.callUpdate = debounce(this.callUpdate, 500);
  }

  async componentDidMount() {
    this.setState({ cartLoader: true });
    const { getCartProduct, getTotals } = this.props;
    await getCartProduct();
    await getTotals();
    this.setState({ cartLoader: false });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cartItems !== this.props.cartItems) {
      this.countTotalPrice(this.props.cartItems);
    }
  }

  countTotalPrice = (cartItems) => {
    if (cartItems && cartItems.length > 0) {
      let getPrice = cartItems.map(qty => qty.quantity * qty.price);
      let gettotal = getPrice.reduce(function(qty, val) {
        return qty + val;
      }, 0);
      if (gettotal) {
        this.setState({ gettotal });
      }
    }
  }

  handleRemove = async (product) => {
    const { removeCartProduct, getCartProduct, getTotals, createCart, deleteItem } = this.props;
    const cartID = localStorage.getItem("cartID");

    deleteItem(product.sku);
    if (!cartID) {
      await createCart();
    }
    await removeCartProduct(product.item_id)
    await getCartProduct();
    getTotals();
  }

  IncrementItem = (product) => {
    this.handleUpdate(product, product.qty + 1);
  }

  DecreaseItem = (product) => {
    if (product.qty > 1) {
      this.handleUpdate(product, product.qty - 1);
    } else {
      this.handleRemove(product);
    }
  }

  handleUpdate = async (product, qty) => {
    const { updateCart } = this.props;
    if (qty >= 1) {
      updateCart({id: product.sku, qty})
      this.callUpdate(product, qty)
    }
  }

  callUpdate = async (product, qty) => {
    const { updateCartProduct, getCartProduct, createCart } = this.props;
    const cartID = localStorage.getItem("cartID");
    if (!cartID) {
      await createCart();
    }
    await updateCartProduct(product.item_id, qty)
    getCartProduct();
  }

  render() {
    const { cartItems } = this.props;
    let cartItemsList = cartItems.length > 0 && cartItems.map((data, idx) => {
      return (
        <tr key={idx}>
          <td className="product-thumbnail">
            <a>
              <img
                src={`${data.extension_attributes.image_url}`}
                alt="item"
              />
            </a>
          </td>

          <td className="product-name">
            <a>
              {he.decode(data.name)}
              {data.extension_attributes.purchased ? ` (${data.extension_attributes.purchased})` : ``}
            </a>
          </td>

          <td className="product-price">
            <span className="unit-amount">${data.price}</span>
          </td>

          <td className="product-quantity">
            <div className="input-counter">
              <span
                className="minus-btn"
                onClick={() => this.DecreaseItem(data, data.qty)}
              >
                <i className="fas fa-minus"></i>
              </span>
              <input readOnly type="text" value={data.qty} min={1} />
              <span
                className="plus-btn"
                onClick={() => this.IncrementItem(data)}
              >
                <i className="fas fa-plus"></i>
              </span>
            </div>
          </td>

          <td className="product-subtotal">
            <div className="subtotal">
              <span className="subtotal-amount">
                ${parseFloat(data.price * data.qty).toFixed(2)}
              </span>
            </div>
          </td>

          <td>
            <a
              className="remove w-100 text-right"
              onClick={() => this.handleRemove(data)}
            >
              <i className="far fa-trash-alt mr-2"></i>
            </a>
          </td>
        </tr>
      );
    });

    return (
      <>
        {cartItems.length ? (
          <>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Name</th>
                  <th scope="col">Unit Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>{cartItemsList}</tbody>
            </table>
          </>
        ) : (
          <div className="text-center">
            <p className="text-center cart-page-icon">
              <i className="fa fa-shopping-cart"></i>
            </p>
            {this.state.cartLoader === true ? (
              <Loader type="TailSpin" color="#0c9495" height={50} width={50} />
            ) : (
              <p className="text-center">Your cart is empty</p>
            )}
          </div>
        )}
      </>
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
    getCartProduct: bindActionCreators(getCartProduct, dispatch),
    removeCartProduct: bindActionCreators(removeCartProduct, dispatch),
    addToCartProduct: bindActionCreators(addToCartProduct, dispatch),
    createCart: bindActionCreators(createCart, dispatch),
    updateCartProduct: bindActionCreators(updateCartProduct, dispatch),
    updateCart: bindActionCreators(updateCart, dispatch),
    deleteItem: bindActionCreators(deleteItem, dispatch),
    getTotals: bindActionCreators(getTotals, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartProduct);
