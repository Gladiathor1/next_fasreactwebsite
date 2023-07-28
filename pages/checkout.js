import React, { Component } from 'react';
import Head from '../components/SEO/head';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import Breadcrumb from '../components/Common/Breadcrumb';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CheckoutAmountLimitError from '../components/Modal/CheckoutAmoutLimitError';

class Index extends Component {
    state = {
        hasError: false
    }
    checkoutNotAllowed = (cartValue) => {
        this.setState({ hasError: true, cartValue })
    }
    render() {
        let { hasError } = this.state;
        return (
            <React.Fragment>
                <Head
                    title={"Checkout"}
                    description={""}
                    image={""}
                    url={""}
                />
                <Navbar />
                <Breadcrumb title="Checkout" />
                {
                    !hasError && <CheckoutForm checkoutNotAllowed={this.checkoutNotAllowed}/>
                }
                {
                    hasError && <CheckoutAmountLimitError cartValue={this.state.cartValue}/>
                }
                
                <Footer isCheckOut />
            </React.Fragment>
        );
    }
}

export default Index;
