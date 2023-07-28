import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ToastContainer, toast, Slide } from "react-toastify";
import Loader from "react-loader-spinner";

import { login, getUserDetail } from "../../store/actions/authActions";
import { mergeCarts, getCartProduct, getTotals } from "../../store/actions/cartActions";

class PasswordModal extends Component {
  state = {
    password: "",
    loading: false
  }

  handleChange = (e) => {
    this.setState({ password: e.target.value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { emailAddress, login, mergeCarts, getUserDetail, getCartProduct, handlePassword } = this.props;
    const { password } = this.state;
    const data = {
      username: emailAddress,
      password: password
    }
    this.setState({ loading: true });
    try {
      const res = await login(data);
      const token = res.payload;
      const cartID = localStorage.getItem("cartID");
      localStorage.removeItem('cartID');
      localStorage.setItem('authToken', token);
      await mergeCarts(cartID, token);
      await getUserDetail();
      await getCartProduct();
      await getTotals()
      handlePassword();

      this.setState({ loading: false });
    } catch (err) {
      const error = err.payload.response.data.message;
      toast.error(error, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      this.setState({ loading: false });
    }
  }

  render() {
    const { handlePassword } = this.props;
    const { loading } = this.state;
    
    return (
      <div className="bts-popup is-visible" role="alert">
        <div className="bts-popup-container">
          <h3>Login</h3>
          <p>Please enter your password.</p>

          <form onSubmit={this.handleSubmit}>
            <input type="password" className="form-control" name="password" required={true} onChange={this.handleChange} style={{ height: 45 }} />
            <button className="d-flex align-items-center" disabled={loading} type="submit">
              <Loader
                visible={loading}
                type="TailSpin"
                color="#fff"
                height={15}
                width={15}
              />
              <span style={{ marginLeft: 2 }}>Login</span>
            </button>
          </form>

          <a onClick={handlePassword} className="bts-popup-close"></a>
        </div>
        <ToastContainer transition={Slide} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authReducer.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    mergeCarts: bindActionCreators(mergeCarts, dispatch),
    login: bindActionCreators(login, dispatch),
    getUserDetail: bindActionCreators(getUserDetail, dispatch),
    getCartProduct: bindActionCreators(getCartProduct, dispatch),
    getTotals: bindActionCreators(getTotals. dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordModal);
