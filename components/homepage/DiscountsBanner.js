import React, { Component } from 'react';

class DiscountsBanner extends Component {
    render() {
        return (
            <div className="container discount-offers">
                <div className="col-md-12 mt-4 p-3">
                    <ul className="discounts">
                        <li>Free Shipping on Orders $75 and More!</li>
                        <li></li>
                        <div className="d-flex flex-column align-items-center tiered-pricing">
                            <span>Tiered Pricing</span>
                            <ul>
                                <li>10% Off 10-24 Yards</li>
                                <li></li>
                                <li>20% Off 25-49 Yards</li>
                                <li></li>
                                <li>40% Off 50+ Yards</li>
                            </ul>
                            <span>Exclusions Apply</span>
                        </div>
                    </ul>
                </div>
            </div>
        );
    }
}

export default DiscountsBanner;
