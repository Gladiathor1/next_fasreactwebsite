import React, { Component } from "react";
import Link from "next/link";
import Router from "next/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastContainer, toast, Slide } from "react-toastify";
import Loader from "react-loader-spinner";
import Head from "../components/SEO/head";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import Breadcrumb from "../components/Common/Breadcrumb";
import { register, login } from "./../store/actions/authActions";
import { mergeCarts, customerCart } from "./../store/actions/cartActions";
import { handleLogin } from "../utils/handleLogin";

class Index extends Component {
  constructor() {
    super();
    this.state = {
      fields: {
        firstname: "",
        lastname: "",
        emailid: "",
        password: ""
      },
      errors: {},
      loader: false
    };
  }

  handleChange = e => {
    let fields = this.state.fields;
    if (e.target.name === 'firstname' || e.target.name === 'lastname') {
      if (e.target.value.length <= 15) {
        fields[e.target.name] = e.target.value;
        this.setState({ fields });
      }
    } else {
      fields[e.target.name] = e.target.value;
      this.setState({ fields });
    }
  };

  submituserRegistration = async (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      const { register } = this.props;
      const data = {
        customer: {
          email: this.state.fields.emailid,
          firstname: this.state.fields.firstname,
          lastname: this.state.fields.lastname
        },
        password: this.state.fields.password
      };
      const loginData = {
        username: this.state.fields.emailid,
        password: this.state.fields.password
      }
      this.handleLoading();

      register(data).then(data => {
        toast.success("Your account has been successfully created.", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        handleLogin(this.props, loginData, toast, this.handleLoading, this.redirect);
      }).catch(err => {
        this.handleLoading();
        toast.error(err.payload.response.data.message, {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      })
    }
  }

  redirect = () => {
    Router.push("/");
  }

  handleLoading = () => {
    this.setState({ loader: !this.state.loader })
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["firstname"]) {
      formIsValid = false;
      errors["firstname"] = "*Please enter your first name.";
    }

    if (typeof fields["firstname"] !== "undefined") {
      if (!fields["firstname"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["firstname"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["lastname"]) {
      formIsValid = false;
      errors["lastname"] = "*Please enter your last name.";
    }

    if (typeof fields["lastname"] !== "undefined") {
      if (!fields["lastname"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["lastname"] = "*Please enter alphabet characters only.";
      }
    }

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

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    if (typeof fields["password"] !== "undefined") {
      if (
        !fields["password"].match(
          /^.*(?=.{6,})(?=.*\d)(?=.*[a-z]).*$/
        )
      ) {
        formIsValid = false;
        errors["password"] = "*Please enter secure and strong password.";
      }
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  render() {
    return (
      <React.Fragment>
        <Head
          title={"Sign Up"}
          description={"Create a new account, its free!"}
          image={""}
          url={"signup"}
        />
        <Navbar />
        <Breadcrumb title="Signup" />
        <section className="signup-area ptb-60">
          <div className="container">
            <div className="signup-content">
              <div className="section-title">
                <h2>Create An Account</h2>
              </div>

              <form
                className="signup-form"
                method="post"
                name="userRegistrationForm"
                onSubmit={this.submituserRegistration}
              >
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your first name"
                    id="firstname"
                    name="firstname"
                    value={this.state.fields.firstname}
                    onChange={this.handleChange}
                    maxLength="15"
                  />
                  <div className="errorMsg">{this.state.errors.firstname}</div>
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your last name"
                    id="lastname"
                    name="lastname"
                    value={this.state.fields.lastname}
                    onChange={this.handleChange}
                    maxLength="15"
                  />
                  <div className="errorMsg">{this.state.errors.lastname}</div>
                </div>

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

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    id="password"
                    name="password"
                    value={this.state.fields.password}
                    onChange={this.handleChange}
                  />
                  <div className="errorMsg">{this.state.errors.password}</div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={this.state.loader === true}>
                  {this.state.loader === true ?
                      <Loader type="TailSpin" color="#fff" height={15} width={15} /> :
                      <>Signup</>
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

const mapStateToProps = state => {
  return {
    registerData: state.authReducer.register
  };
};

const mapDispatchToProps = dispatch => {
  return {
    register: bindActionCreators(register, dispatch),
    mergeCarts: bindActionCreators(mergeCarts, dispatch),
    login: bindActionCreators(login, dispatch),
    customerCart: bindActionCreators(customerCart, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
