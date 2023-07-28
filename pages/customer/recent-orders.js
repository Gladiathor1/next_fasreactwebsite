import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { ToastContainer, toast, Slide } from "react-toastify";
import { debounce } from "debounce";

import Navbar from '../../components/Layout/Navbar';
import AccountSidebar from '../../components/Sidebar/AccountSidebar';
import Footer from '../../components/Layout/Footer';
import RecentProducts from "../../components/cart/RecentProducts";
import {
  getRecentItems,
  addToCartProduct,
  getCartProduct,
  createCart,
  addItem,
  updateCartProduct,
  updateCart,
  getTotals
} from "../../store/actions/cartActions";
import { getProductInfo } from "../../store/actions/productActions";
import { addToCart } from "../../utils/addToCart";

class RecentOrders extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      selected: [],
      clicked: []
    }

    this.callUpdate = debounce(this.callUpdate, 500);
    this.handleProductAddToCart = debounce(this.handleProductAddToCart, 1000);
  }

  async componentDidMount() {
    const { getRecentItems, getProductInfo } = this.props;
    if(localStorage.getItem("authToken")) {
      this.setState({ loading: true });
      const res = await getRecentItems();
      Promise.all(
        res.payload.getRecentlyOrderedItems.items.map(async item => {
          return getProductInfo(item.sku);
        })
      ).then(() => {
        this.setState({ loading: false });
      })
    }
  }

  handleAdd = async (addedItem, data, weight, image) => {
    if(addedItem && addedItem.item_id) {
      this.IncrementItem(addedItem);
    } else {
      const index = this.state.clicked.findIndex(c => c.sku === data.sku);
      if(index === -1) {
        await this.setState(({clicked}) => ({
          clicked: [ ...clicked, { sku: data.sku, qty: 1 } ]
        }));
        const i = this.state.clicked.find(c => c.sku === data.sku);
        data.quantity = i ? i.qty : 1;
        this.saveState(data, weight, image);
      } else {
        const { updateCart } = this.props;
        await this.setState(({clicked}) => ({
          clicked: [
            ...clicked.slice(0, index),
            { ...clicked[index], qty: clicked[index].qty + 1 },
            ...clicked.slice(index + 1)
          ]
        }));
        const i = this.state.clicked.find(c => c.sku === data.sku);
        data.quantity = i ? i.qty : 1;
        updateCart({ id: data.sku, qty: data.quantity });
      }
      this.handleProductAddToCart(data, weight);
    }
  }

  handleProductAddToCart = async (data, weight) => {
    const { createCart } = this.props;
    const cartID = localStorage.getItem("cartID");
    let price = null;

    if (weight) {
      price = parseFloat(weight.value) * data.price;
      price = price.toFixed(2);
    }
    if (!cartID) {
      await createCart();
    }
    addToCart(this.props, toast, data, price);
  }

  saveState = (data, weight, image) => {
    const { addItem } = this.props;
    const payload = {
      name: data.name,
      qty: data.quantity,
      sku: data.sku,
      price: weight ? (parseFloat(weight) * parseFloat(data.price)).toFixed(2) : data.price,
      extension_attributes: { image_url: image, comments: "", substitute: false }
    }
    addItem(payload);
  }

  IncrementItem = (product) => {
    this.handleUpdate(product, product.qty + 1)
  };

  handleDecrement = (product) => {
    if(product && product.qty >= 1) {
      this.handleUpdate(product, product.qty - 1)
    }
  };

  handleUpdate = async (product, qty) => {
    const { cartItems, updateCart } = this.props;
    const link = cartItems.find(item => item.sku === product.extension_attributes.link_sku);
    if (qty >= 1) {
      updateCart({id: product.sku, qty})
      if(link) {
        updateCart({id: link.sku, qty})
      }
      this.callUpdate(product, link, qty)
    }
  }

  callUpdate = async (product, link, qty) => {
    const { updateCartProduct, createCart } = this.props;
    const cartID = localStorage.getItem("cartID");
    if (!cartID) {
      await createCart();
    }
    await updateCartProduct(product.item_id, qty)
    if (link) {
      await updateCartProduct(link.item_id, qty);
    }
  }

  handleNotification = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }

  render() {
    const { loading } = this.state;
    const { recentItems, cartItems } = this.props;
    return (
      <>
        <Navbar />
        <div className="account-main my-4">
          <div className="container">
            <div className="row">
              <AccountSidebar />
              <div className="col-md-9 col-sm-12">
                { loading ?
                  <Loader
                    className="text-center"
                    type="TailSpin"
                    color="#3954a5"
                    height={25}
                    width={25}
                  /> :
                  <RecentProducts
                    recentItems={recentItems}
                    cartItems={cartItems}
                    handleAdd={this.handleAdd}
                    handleDecrement={this.handleDecrement}
                  />
                }
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <ToastContainer transition={Slide} />
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    recentItems: state.cartReducer.recentItems,
    cartItems: state.cartReducer.cartItems,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getRecentItems: bindActionCreators(getRecentItems, dispatch),
    getProductInfo: bindActionCreators(getProductInfo, dispatch),
    addToCartProduct: bindActionCreators(addToCartProduct, dispatch),
    getCartProduct: bindActionCreators(getCartProduct, dispatch),
    createCart: bindActionCreators(createCart, dispatch),
    addItem: bindActionCreators(addItem, dispatch),
    updateCartProduct: bindActionCreators(updateCartProduct, dispatch),
    updateCart: bindActionCreators(updateCart, dispatch),
    getTotals: bindActionCreators(getTotals, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecentOrders);
