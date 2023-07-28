import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import Link from 'next/link';
import { connect } from "react-redux";
import { updateUser } from "../../store/actions/authActions";
import Router from "next/router";

class AddsModal extends Component {
    _isMounted = false;
    state = {
        open: false,
        email: ''
    };

    isUserLoggedIn = () => {
        return localStorage.getItem("authToken");
    }

    componentDidMount() {
        if (!this.isUserLoggedIn() && !this.props.isNewsletterShown) {
            this.setState({ open: true });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) {
            if (this.isUserLoggedIn()) {
                let { user } = this.props;
                if (user) {
                    const { extension_attributes } = user;
                    if (extension_attributes && !extension_attributes.is_subscribed) {
                        if (localStorage.getItem('subscribeToNewsletter')) {
                            user.extension_attributes.is_subscribed = !user.extension_attributes.is_subscribed;
                            this.props.updateUser({ customer: user });
                            localStorage.removeItem('subscribeToNewsletter')
                        } else {
                            if (!this.props.isNewsletterShown) {
                                this.setState({ open: true });
                            }
                        }
                    } else {
                        localStorage.removeItem('subscribeToNewsletter')
                    }
                }
            }
        }
    }

    closeModal = (e) => {
        this._isMounted = true;
        if (e) e.preventDefault();
        this.setState({
            open: false
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = (e) => {
        if(e.target.value.length < 255) {
            this.setState({ email: e.target.value });
        }
    }

    subscribeUser = async (e) => {
        e.preventDefault();
        if (this.isUserLoggedIn()) {
            let { user } = this.props;
            user.extension_attributes.is_subscribed = !user.extension_attributes.is_subscribed;
            await this.props.updateUser({ customer: user });
            this.closeModal();
        } else {
            localStorage.setItem('subscribeToNewsletter', true);
            Router.push('/login')
        }
    }

    render() {
        let { open } = this.state;
        return (
            <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
                <div className="bts-popup-container">
                    <h3>Newsletter</h3>
                    <p>Subscribe for our new items and special offers</p>

                    <form>
                        <input type="email" className="form-control" placeholder="mail@name.com" name="EMAIL" required={true} onChange={this.handleChange} />
                        <button onClick={this.subscribeUser}><i className="far fa-paper-plane"></i></button>
                    </form>

                    <ul>
                        <li><a href="https://www.facebook.com/FabricandSewing" target="_blank" className="facebook"><i className="fab fa-facebook-f"></i></a></li>
                        <li><a href="https://twitter.com/FabricAndSewing" target="_blank" className="twitter"><i className="fab fa-twitter"></i></a></li>
                        <li><a href="https://instagram.com/fabricandsewing/" target="_blank" className="instagram"><i className="fab fa-instagram"></i></a></li>
                        <li><a href="https://www.pinterest.com/fabricandsewing/" target="_blank" className="pinterest"><i className="fab fa-pinterest"></i></a></li>
                    </ul>

                    <Link href="#">
                        <a onClick={this.closeModal} className="bts-popup-close"></a>
                    </Link>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddsModal);
