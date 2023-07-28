import Link from "next/link";
import { withRouter } from "next/router";
import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import { Slide, toast, ToastContainer } from "react-toastify";
import { bindActionCreators } from "redux";
import Breadcrumb from "../../components/Common/Breadcrumb";
import Footer from "../../components/Layout/Footer";
import Navbar from "../../components/Layout/Navbar";
import { resetPassword } from "../../store/actions/authActions";
import Router from "next/router";

class Index extends Component {
  constructor() {
    super();
    this.state = {
      fields: {
        newPassword: "Password123#",
        confirmPassword: "Password123#"
      },
      errors: {},
      loader: false
    };
  }

  handleChange = e => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  };

  submitResetPassword = async e => {
    e.preventDefault();
    if (this.validateForm()) {
      let fields = {};
      fields["newPassword"] = "";
      fields["confirmPassword"] = "";
      this.setState({ fields: fields });
      this.setState({ loader: true });

      const { router: { query: { token } } } = this.props;

      const data = {
        resetToken: token,
        newPassword: this.state.fields.newPassword,
      };

      const { resetPassword } = this.props;
      resetPassword(data)
        .then(() => {
          toast.success("Your Password has been reseted.", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          setTimeout(() => {
            Router.push("/login");
          }, 2000);
        })
        .catch(err => {
          this.setState({ loader: false });
          const error = err.payload.response.data.message;
          toast.error(error, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        });
    }
  };

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["newPassword"]) {
      formIsValid = false;
      errors["newPassword"] = "*Please enter your password.";
    }

    if (typeof fields["newPassword"] !== "undefined") {
      if (
        !fields["newPassword"].match(
          /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
        )
      ) {
        formIsValid = false;
        errors["newPassword"] = "*Please enter secure and strong password.";
      }
    }

    if (!fields["confirmPassword"]) {
      formIsValid = false;
      errors["confirmPassword"] = "*Please enter your confirm password.";
    }

    if (fields["confirmPassword"]) {
      if (fields["newPassword"] !== fields["confirmPassword"]) {
        formIsValid = false;
        errors["confirmPassword"] =
          "*Password and confirm password should be same.";
      }
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <Breadcrumb title="Reset Password" />
        <section className="signup-area ptb-60">
          <div className="container">
            <div className="signup-content">
              <div className="section-title">
                <h2>Reset Password</h2>
              </div>

              <form
                className="signup-form"
                method="post"
                name="userResetPasswordForm"
                onSubmit={this.submitResetPassword}
              >
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    id="newPassword"
                    name="newPassword"
                    value={this.state.fields.newPassword}
                    onChange={this.handleChange}
                  />
                  <div className="errorMsg">
                    {this.state.errors.newPassword}
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your confirm password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={this.state.fields.confirmPassword}
                    onChange={this.handleChange}
                  />
                  <div className="errorMsg">
                    {this.state.errors.confirmPassword}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={this.state.loader === true}
                >
                  {this.state.loader === true ? (
                    <Loader
                      type="TailSpin"
                      color="#fff"
                      height={15}
                      width={15}
                    />
                  ) : (
                    <>Reset Password</>
                  )}
                </button>
                <Link href="/">
                  <a className="return-store">or Return to Store</a>
                </Link>
              </form>
            </div>
          </div>
        </section>
        <ToastContainer transition={Slide} />
        <Footer />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetPassword: bindActionCreators(resetPassword, dispatch)
  };
};

export default withRouter(connect(null, mapDispatchToProps)(Index));