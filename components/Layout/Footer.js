import Link from "next/link";
import React, { Component } from 'react';
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { bindActionCreators } from "redux";
import { updateUser } from "../../store/actions/authActions";

class Footer extends Component {

    state = {
        email: '',
        showSubscribedMsg: false
    };

    handleChange = (e) => {
        if(e.target.value.length < 255) {
            this.setState({ email: e.target.value });
        }
    }

    validateForm() {
        let email = this.state.email;
        let errors = {};
        let formIsValid = true;

        if (!email) {
            formIsValid = false;
            errors["email"] = "Please enter your email";
        }

        if (typeof email !== "undefined" && email) {
            var pattern = new RegExp(
                /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
            );
            if (!pattern.test(email)) {
                formIsValid = false;
                errors["email"] = "Please enter valid email.";
            }
        }

        if (email && email.length > 50) {
            formIsValid = false;
            errors["email"] = "You can't enter email more than 50 character.";
        }

        return { formIsValid, errors };
    }

    subscribeUser = e => {
        e.preventDefault();
        const validate = this.validateForm();
        if (validate.formIsValid) {
          let token = localStorage.getItem("authToken");
          if (token) {
            const { user } = this.props;
            if (user) {
              const { extension_attributes } = user;
              if (extension_attributes && !extension_attributes.is_subscribed) {
                user.extension_attributes.is_subscribed = !user.extension_attributes.is_subscribed;
                this.props.updateUser({ customer: user });
                this.setState({ email: "" });
              } else {
                this.setState({ showSubscribedMsg: true }, function() {
                  setTimeout(() => {
                    this.setState({ showSubscribedMsg: false });
                  }, 2000);
                });
              }
            }
          } else {
            localStorage.setItem("subscribeToNewsletter", true);
            Router.push("/login");
          }
        } else {
          toast.error(validate.errors.email, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        }
      };

    render() {
        const gridCols = this.props.isCheckOut ? 'col-lg-3' : 'col-lg-2';
        return (
            <footer className="footer-area">
                <div className="container">
                    <div className="row">
                        <div className={`${gridCols} col-md-6`}>
                            <div className="single-footer-widget">
                                <h3>My Account</h3>

                                <ul className="quick-links">
                                    <li><Link href="/about"><a>About Us</a></Link></li>
                                    {/* <li><Link href="#"><a>Blog</a></Link></li> */}
                                    <li><Link href="/contact-us"><a>Contact Us</a></Link></li>
                                    <li><Link href="/security-privacy"><a>Security & Privacy</a></Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className={`${gridCols} col-md-6`}>
                            <div className="single-footer-widget">
                                <h3>ABOUT</h3>
                                <ul className="quick-links">
                                    <li><Link href="/fabric-glossary"><a>Fabric Glossary</a></Link></li>
                                    <li><Link href="/shipping-return"><a>Shipping & Return</a></Link></li>
                                    <li><Link href="/site-map"><a>Site Map</a></Link></li>
                                    <li><Link href="/terms-conditions"><a>Terms & Condition</a></Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className={`${gridCols} col-md-6`}>
                            <div className="single-footer-widget">
                                <h3>Policy</h3>
                                <ul className="quick-links">
                                    {/* <li><Link href="#"><a>Track Your Order</a></Link></li> */}
                                    <li><Link href="/what-you-think"><a>Tell Us What you think</a></Link></li>
                                    <li><Link href="/become-affiliate"><a>Become an Affiliate</a></Link></li>
                                    <li><Link href="/faq"><a>FAQs</a></Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="single-footer-widget">
                                <h3>Contact Information</h3>

                                <ul className="footer-contact-info">
                                    <li><i className="fas fa-map-marker-alt footer-icon"></i> 1000 E. 14th St. Los Angeles, CA 90021</li>
                                    <li><i className="fas fa-phone"></i><a> 800 678-8569</a></li>
                                </ul>
                            </div>
                        </div>

                        {
                            !this.props.isCheckOut && (<div className="col-lg-3 col-md-6">
                                <div className="single-footer-widget">
                                    <h3>Subscribe Now</h3>
                                    <p>Subscribe to our newsletterget 10% off your first purchase at here for update.</p>
                                    <p>Enter your e-mail Address</p>
                                    <form>
                                        <input type="email" className="form-control scroll-h" placeholder="mail@name.com" name="EMAIL" onChange={this.handleChange} />
                                        <button onClick={this.subscribeUser}><i className="fas fa-paper-plane"></i></button>
                                        {this.state.showSubscribedMsg && <p>Already subscribed</p>}
                                    </form>
                                </div>
                            </div>)
                        }
                    </div>
                </div>

                <div className="copyright-area">
                    <div className="container">
                        <div className="row d-flex align-items-center justify-content-between lower-footer">
                            <ul className="footer-social-icons">
                                <li><a href="https://www.facebook.com/FabricandSewing" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                                <li><a href="https://instagram.com/fabricandsewing/" target="_blank"><i className="fab fa-instagram"></i></a></li>
                                <li><a href="https://www.pinterest.com/fabricandsewing/" target="_blank"><i className="fab fa-pinterest"></i></a></li>
                                <li><a href="https://twitter.com/FabricAndSewing" target="_blank"><i className="fab fa-twitter"></i></a></li>
                            </ul>
                            <div className="footer-copyright"><p>© 2020 Fabric and Sewing. ALL RIGHTS RESERVED</p></div>
                            <div className="footer-cards"><img src={require("../../images/payment-img.png")} /></div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
const mapStateToProps = state => {
    return {
        user: state.authReducer.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUser: bindActionCreators(updateUser, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
