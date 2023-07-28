import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import Head from '../components/SEO/head';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

class Index extends Component {
    render() {
        const { router: { query: { order } } } = this.props;
        return (
            <React.Fragment>
                <Navbar />
                <Head
                    title={"Thank You for shopping with Us!"}
                    description={""}
                    image={""}
                    url={""}
                />
                <div className="thank-you-area">
                    <div className="container">
                        <h1>Thank You for your Purchase</h1>
                        <p className="text-center">Here is your Order ID: {order}</p>
                        <Link href="/">
                            <a className="btn btn-primary">Continue Shopping</a>
                        </Link>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default withRouter(Index);
