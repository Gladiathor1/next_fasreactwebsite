import React, { Component } from 'react';

class InfoCards extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4 grid-d-1 pb-5 pt-4 border-grid">
                        <p className="font-size-22 text-uppercase black">Welcome to<br></br> <span>Fabric and Sewing</span></p>
                        <p className="font-size-14 grid-d-text">What do you get when you combine a fabric company, first-rate customer service, and a dedication to product consistency?  You get FabricAndSewing.com, the one-stop shop for all of your fabric and sewing needs.</p>
                    </div>

                    <div className="col-md-4 grid-d-2 pb-5 pt-4 border-grid">
                        <p className="font-size-22 text-uppercase black">WHY SHOP WITH US</p>
                        <p className="font-size-14 grid-d-text">We find you the best deals, so you can sit back, relax and shop confidently. Our home page boasts new items and popular items, so you can have the best of both worlds with a simple click on the page. All of our fabrics and sewing accessories are of the highest quality, coupled with our superior customer service.</p>
                    </div>

                    <div className="col-md-4 grid-d-3 pb-5 pt-4">
                        <p className="font-size-22 text-uppercase black">ESPECIALLY FOR YOU</p>

                        <p className="font-size-14 grid-d-text">We love discovering fabric and sewing accessories just as much as you do. Our team of customer service representatives and creative specialists are here to help you with any product information, order questions and return inquiries. And we love hearing from you!</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoCards;
