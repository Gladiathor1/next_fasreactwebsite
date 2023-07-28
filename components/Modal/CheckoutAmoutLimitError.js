import React, { Component } from 'react';
import Link from 'next/link';

class CheckoutAmountLimitError extends Component {

    state = {
        display: false
    };

    componentDidMount() {
        this.setState({ display: true })
    }

    render() {
        return (
            <div className={`bts-popup ${this.state.display ? 'is-visible' : ''}`} role="alert">
                <div className="bts-popup-container">
                    <p>Your order total does not meet the $100.00 minimum order total.
                      Please add to your cart items worth ${(100 - this.props.cartValue).toFixed(2)} to proceed to checkout.</p>
                    <Link href="/">
                        <button className="btn btn-primary">Continue shopping</button>
                    </Link>
                    <Link href="/cart">
                        <a className="bts-popup-close"></a>
                    </Link>
                </div>
            </div>
        );
    }
}

export default CheckoutAmountLimitError;
