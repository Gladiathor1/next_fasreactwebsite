import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { connect } from 'react-redux';
import Navbar from '../../../components/Layout/Navbar';
import AccountSidebar from '../../../components/Sidebar/AccountSidebar';
import Footer from '../../../components/Layout/Footer';

class Address extends Component {
    state = {
        shipping: {},
        billing: {}
    }

    componentDidMount() {
        if(this.props.user.addresses) {
            this.updateState();
        }
    }

    componentDidUpdate(oldProps) {
        const { user } = this.props;
        if(user.addresses !== oldProps.user.addresses) {
            this.updateState();
        }
    }

    updateState = () => {
        const { user: { addresses } } = this.props;
        const billing = addresses.find(e => e.default_billing === true) || {};
        const shipping = addresses.find(e => e.default_shipping === true) || {};
        this.setState({ shipping, billing });
    }

    render() {
        const { billing, shipping } = this.state;
        return (
            <React.Fragment>
                <Navbar />
                <div className="account-main ">
                    <div className="container">
                        <div className="row">
                            <AccountSidebar />
                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <div className="dashboard-main account-information">
                                    <div className="page-title d-flex justify-content-between">
                                        <h1>Address Book</h1>
                                        {/* <Link href="/customer/account">
                                            <button type="button" title="Add New Address" className="button"><span><span>Add New Address</span></span></button>
                                        </Link> */}
                                    </div>
                                    <div className="col2-set addresses-list d-flex justify-content-between">
                                        <div className="col-1 addresses-primary">
                                            <h2>Default Addresses</h2>
                                            <ol>
                                                <li className="item">
                                                    <h3>Default Billing Address</h3>
                                                    { billing.id && 
                                                        <address>
                                                            {billing.firstname} {billing.lastname}<br />
                                                            {billing.street[0]}<br />
                                                            {billing.city}, {billing.postcode}, {billing.region.region}<br />
                                                            {billing.country_id}<br />
                                                            {billing.telephone ? `T: ${billing.telephone}` : ''}
                                                        </address>
                                                    }
                                                    <p><Link href="/customer/account#address"><a>Update Billing Address</a></Link></p>
                                                </li>

                                                <li className="item">
                                                    <h3>Default Shipping Address</h3>
                                                    { shipping.id && 
                                                        <address>
                                                            {shipping.firstname} {shipping.lastname}<br />
                                                            {shipping.street[0]}<br />
                                                            {shipping.city}, {shipping.postcode}, {shipping.region.region}<br />
                                                            {shipping.country_id}<br />
                                                            {shipping.telephone ? `T: ${shipping.telephone}` : ''}
                                                        </address>
                                                    }
                                                    <p><Link href="/customer/account#address"><a>Update Shipping Address</a></Link></p>
                                                </li>
                                            </ol>
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

const mapStateToProps = (state) => {
    return {
        user: state.authReducer.user
    }
}

export default withRouter(connect(mapStateToProps, null)(Address));