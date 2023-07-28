import React, { Component } from 'react';
import Head from '../components/SEO/head';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import Breadcrumb from '../components/Common/Breadcrumb';

class Index extends Component {
    render() {
        return (
            <React.Fragment>
                <Head
                    title={"About Us"}
                    description={""}
                    image={""}
                    url={"about"}
                />
                <Navbar />
                <Breadcrumb title="About Us" />
                <section className="about-area ptb-60">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-12 col-md-12">
                                <div className="about-content">
                                    <h3 className="title-border">About Us</h3>
                                    <p className="text-justify">
                                        What do you get when you combine a fabric company, first-rate customer service, and a dedication to product
                                        consistency? You get FabricAndSewing.com, the one-stop shop for all of your fabric and sewing needs. Founded
                                        as a retail arm of its sister company, StyleTex, a leading fabric wholesaler since 1992, FabricAndSewing.com
                                        brings its many years of industry experience to retail customers of all ages and locales
                                        FabricAndSewing.com’s extensive, diverse product selection is not all that sets it apart from other
                                        competing retailers; FabricAndSewing.com provides fabric by the yard as well as wholesale to the public,
                                        and has built a reputation of consistency and reliability within the fabric industry. This is based on the
                                        thousands of designs, colors, and materials we carry, year after year. We also maintain a high regard for
                                        customer service and continued satisfaction. The success of FabricAndSewing.com has made it more than a
                                        simple fabric and notions company it has established itself as an extraordinary, highly creative resource
                                        for both new and long-standing members of its far-reaching customer base. We welcome you to join our email
                                        newsletter for the latest product updates and event information. We think you will find our selection
                                        and prices the most competitive in the market. And our close-knit staff is the friendliest around, really!
                                        Please feel free to contact us with any questions, concerns, or inquiries by phone: (800) 678-8569
                                        or email: sales@fabricandsewing.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </React.Fragment>
        );
    }
}

export default Index;
