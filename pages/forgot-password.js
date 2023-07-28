import React, { Component } from "react";
import Link from "next/link";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import Breadcrumb from "../components/Common/Breadcrumb";
import Loader from "react-loader-spinner";
import { forgotPassword } from "./../store/actions/authActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastContainer, toast, Slide } from "react-toastify";
import Router from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { withRouter } from 'next/router';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        emailid: ""
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

  submitForgotPassword = async e => {
    e.preventDefault();
    if (this.validateForm()) {
      let fields = {};
      fields["firstname"] = "";
      fields["lastname"] = "";
      fields["emailid"] = "";
      fields["password"] = "";
      this.setState({ fields: fields });
      this.setState({ loader: true });

      const data = {
        email: this.state.fields.emailid,
        template: 'email_reset',
        reactStoreUrl: `${window.location.origin}`,
      };

      const { forgotPassword } = this.props;
      forgotPassword(data)
        .then(() => {
          toast.success("Please check your email Email has been sent.", {
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
        }).catch(err => {
          this.setState({ loader: false });
          const error = "Email not found!";
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

    if (!fields["emailid"]) {
      formIsValid = false;
      errors["emailid"] = "*Please enter your email-ID.";
    }

    if (typeof fields["emailid"] !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(fields["emailid"])) {
        formIsValid = false;
        errors["emailid"] = "*Please enter valid email-ID.";
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
        <Breadcrumb title="Forgot Password" />
        <section className="signup-area ptb-60">
          <div className="container">
            <div className="signup-content">
              <div className="section-title">
                <h2>Forgot password</h2>
              </div>

              <form
                className="signup-form"
                method="post"
                name="forgotPasswordForm"
                onSubmit={this.submitForgotPassword}
              >
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email id"
                    id="emailid"
                    name="emailid"
                    value={this.state.fields.emailid}
                    onChange={this.handleChange}
                  />
                  <div className="errorMsg">{this.state.errors.emailid}</div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={this.state.loader === true}>
                  {this.state.loader === true ?
                      <Loader type="TailSpin" color="#fff" height={15} width={15} /> :
                      <>Forgot Password</>
                    }
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
    forgotPassword: bindActionCreators(forgotPassword, dispatch)
  };
};

export default withRouter(connect(null, mapDispatchToProps)(Index));
