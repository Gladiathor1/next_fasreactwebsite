import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from "next/link";
import { withRouter } from 'next/router';
import Navbar from '../../../components/Layout/Navbar';
import AccountSidebar from '../../../components/Sidebar/AccountSidebar';
import Footer from '../../../components/Layout/Footer';
import Address from '../../../components/account/shipping';
import OrderHistory from '../../../components/account/history';
import { capitalize } from '../../../utils/validations';
import { updateUser } from '../../../store/actions/authActions';
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Account extends Component {
    state = {
        loading: false
    }

    saveShippingAddress = (data) => {
        let { user } = this.props;
        const index = user.addresses.length ? user.addresses.findIndex(e => e.default_shipping === true) : -1;
        let userAddresses = this.fixStreetFieldType(user.addresses);
        user.addresses = userAddresses;
        this.handleUpdate(data, index);
    }

    saveBillingAddress = (data) => {
        let { user } = this.props;
        const index = user.addresses.length ? user.addresses.findIndex(e => e.default_billing === true) : -1;
        let userAddresses = this.fixStreetFieldType(user.addresses);
        user.addresses = userAddresses;
        this.handleUpdate(data, index);
    }

    fixStreetFieldType = (data) => {
        let addresses = data.map(add => {
            if (typeof add.street === 'string') {
                add.street = [add.street];
            }
            return add;
        })
        return addresses;
    }

    handleUpdate = async (data, index) => {
        let user = Object.assign({}, this.props.user);
        if(index > -1) {
            user.addresses[index] = data;
        } else {
            user.addresses.push(data);
        }
        this.setState({ loading: true });
        await this.props.updateUser({ customer: user });
        toast.success("Address updated successfully.", {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
        this.setState({ loading: false });
    }

    render() {
        const { user } = this.props;
        return (
            <React.Fragment>
                <Navbar />
                <div className="account-main my-4">
                    <ToastContainer transition={Slide}/>
                    <div className="container">
                        <div className="row">
                            <AccountSidebar />
                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <div className="dashboard-main">
                                    <div className="page-title">
                                        <h1>My Dashboard</h1>
                                    </div>
                                    <div className="welcome-msg">
                                        <p className="hello"><strong>Hello, {capitalize(user.firstname) + ' ' + capitalize(user.lastname)}!</strong></p>
                                        <p>From your My Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information. Select a link below to view or edit information.</p>
                                    </div>
                                    <div className="box-account box-recent">
                                        <OrderHistory />
                                    </div>
                                    <div className="box-account box-recent">
                                        <div className="box-head">
                                            <h2>Account Information</h2>
                                            <a href="#">View All</a>
                                        </div>
                                        <div className="col2-set d-flex justify-content-between">
                                            <div className="col-1">
                                                <div className="box">
                                                    <div className="box-title">
                                                        <h3>Contact Information</h3>
                                                        <Link href="/customer/account/edit">
                                                            <a>Edit</a>
                                                        </Link>
                                                    </div>
                                                    <div className="box-content">
                                                        <p>
                                                            {capitalize(user.firstname) + ' ' + capitalize(user.lastname)}<br />
                                                            {user.email}<br />
                                                            <Link href="/customer/account/edit">
                                                                <a>Change Password</a>
                                                            </Link>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div className="box">
                                                    <div className="box-title">
                                                        <h3>Newsletters</h3>
                                                    </div>
                                                    <div className="box-content">
                                                        <p>You are currently not subscribed to any newsletter.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="address" className="col2-set">
                                            <div className="box">
                                                <div className="box-title">
                                                    <h3>Address Book</h3>
                                                </div>
                                                <div className="d-flex flex-column box-content">
                                                    <div id="billing" className="col-12 my-4">
                                                        <h4>Default Billing Address</h4>
                                                        <Address comp="billing" saveAddress={this.saveBillingAddress} loading={this.state.loading} />
                                                    </div>
                                                    <div id="shipping" className="col-12">
                                                        <h4>Default Shipping Address</h4>
                                                        <Address comp="shipping" saveAddress={this.saveShippingAddress} loading={this.state.loading} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.authReducer.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUser: bindActionCreators(updateUser, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Account));