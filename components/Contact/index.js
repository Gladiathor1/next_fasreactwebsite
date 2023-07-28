import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastContainer, toast, Slide } from "react-toastify";
import Loader from "react-loader-spinner";
import Head from "../SEO/head";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Breadcrumb from "../Common/Breadcrumb";
import { contactUs } from "../../store/actions/authActions";

import "react-toastify/dist/ReactToastify.css";

class Contact extends Component {
  constructor() {
    super();
    this.state = {
      fields: {
        name: "",
        email: "",
        phoneNo: "",
        message: ""
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

  onChange = e => {
    const re = /^[0-9\b]+$/;

    if (e.target.value === "" || re.test(e.target.value)) {
      this.handleChange(e);
    }
  };

  submituserRegistration = e => {
     e.preventDefault();
    if (this.validateForm()) {
      let fields = {};
      fields["name"] = "";
      fields["email"] = "";
      fields["phoneNo"] = "";
      fields["message"] = "";
      this.setState({ fields: fields });
      this.setState({ loader: true });

      const data = {
        contactUsFormData: {
          name: this.state.fields.name,
          email: this.state.fields.email,
          phone_number: this.state.fields.phoneNo,
          message: this.state.fields.message
        }
      };

      const { contactUs } = this.props;

      contactUs(data)
        .then(() => {
          this.setState({ loader: false });
          toast.success("Message has sent successfully..", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
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

    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "*Please enter your name.";
    }

    if (typeof fields["name"] !== "undefined") {
      if (!fields["name"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["name"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "*Please enter your email.";
    }

    if (typeof fields["email"] !== "undefined" && fields["email"]) {
      //regular expression for email validation
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(fields["email"])) {
        formIsValid = false;
        errors["email"] = "*Please enter valid email.";
      }
    }

    if (!fields["phoneNo"]) {
      formIsValid = false;
      errors["phoneNo"] = "*Please enter your phone no.";
    }

    if (typeof fields["phoneNo"] !== "undefined" && fields["phoneNo"]) {
      if (!fields["phoneNo"].match(/^\d{10}/)) {
        formIsValid = false;
        errors["phoneNo"] = "*Please enter valid phone no.";
      }
    }

    if (!fields["message"]) {
      formIsValid = false;
      errors["message"] = "*Please enter your message.";
    }

    if (typeof fields["message"] !== "undefined" && fields["message"]) {
      if (!fields["message"].trim()) {
        formIsValid = false;
        errors["message"] = "*Please enter valid message.";
      }
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  render() {
    const { title, url } = this.props;
    return (
      <React.Fragment>
        <Head
            title={title}
            description={""}
            image={""}
            url={url}
        />
        <Navbar />
        <Breadcrumb title={title} />
        <section className="contact-area ptb-60">
          <div className="container">
            <div className="section-title">
              <h2>{title}</h2>
            </div>

            <div className="row">
              <div className="col-lg-5 col-md-12">
                <div className="contact-info">
                  <h3>Here to Help</h3>
                  <p>
                    Have a question? You may find an answer in our FAQs. But you
                    can also contact us.
                  </p>

                  <ul className="contact-list">
                    <li>
                      <i className="fas fa-map-marker-alt"></i> Location: 1000 E. 14th St. Los Angeles, CA 90021
                    </li>
                    <li>
                      <i className="fas fa-phone"></i> Call Us:{" "}
                      <a href="#">800 678-8569</a>
                    </li>
                    <li>
                      <i className="far fa-envelope"></i> Email Us:{" "}
                      <a href="#">sales@fabricandsewing.com</a>
                    </li>
                  </ul>

                  <h3>Opening Hours:</h3>
                  <ul className="opening-hours">
                    <li>
                       Monday – Friday 9am – 5pm Pacific Standard Time (PST)
                    </li>
                    <li>
                      Email 24 hours/ 7 days a week
                    </li>
                    <li>
                      sales@fabricandsewing.com
                    </li>
                  </ul>

                  <h3>Follow Us:</h3>
                  <ul className="social">
                    <li>
                      <a
                        target="_blank"
                        href="https://www.facebook.com/FabricandSewing"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://twitter.com/FabricAndSewing">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        href="https://instagram.com/fabricandsewing/"
                      >
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        href="https://www.pinterest.com/fabricandsewing/"
                      >
                        <i className="fab fa-pinterest-p"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-7 col-md-12">
                <div className="contact-form">
                  <h3>Drop Us A Message</h3>
                  <p>
                    We’re happy to answer any questions you have or provide you
                    with an estimate. Just send us a message in the form below
                    with any questions you may have.
                  </p>
                  <div className="mt-10">
                    <form
                      className="contactForm"
                      onSubmit={this.submituserRegistration}
                    >
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>NAME</label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="form-control"
                              value={this.state.fields.name}
                              placeholder="Enter your name"
                              onChange={this.handleChange}
                            />
                            <div className="errorMsg">
                              {this.state.errors.name}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>EMAIL</label>
                            <input
                              type="text"
                              name="email"
                              id="email"
                              className="form-control"
                              value={this.state.fields.email}
                              placeholder="Enter your email"
                              onChange={this.handleChange}
                            />
                            <div className="errorMsg">
                              {this.state.errors.email}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>PHONE NUMBER</label>
                            <input
                              type="text"
                              name="phoneNo"
                              id="phoneNo"
                              className="form-control"
                              value={this.state.fields.phoneNo}
                              placeholder="Enter your phone nO"
                              onChange={this.onChange}
                            />
                            <div className="errorMsg">
                              {this.state.errors.phoneNo}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>YOUR MESSAGE</label>
                            <textarea
                              name="message"
                              id="message"
                              cols="30"
                              rows="8"
                              className="form-control contact-message"
                              placeholder="Enter your Message"
                              value={this.state.fields.message}
                              onChange={this.handleChange}
                            />
                            <div className="errorMsg">
                              {this.state.errors.message}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <button
                            type="submit"
                            className="btn btn-primary width-30"
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
                              <>Send Message</>
                            )}
                          </button>
                          <div
                            id="msgSubmit"
                            className="h3 text-center hidden"
                          ></div>
                          <div className="clearfix"></div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
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
    contactUs: bindActionCreators(contactUs, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(Contact);
