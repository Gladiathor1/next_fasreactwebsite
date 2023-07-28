import React, { Component } from 'react';
import Navbar from '../../../components/Layout/Navbar';
import AccountSidebar from '../../../components/Sidebar/AccountSidebar';
import OrderHistory from '../../../components/account/history';
import Footer from '../../../components/Layout/Footer';

class History extends Component {
    render() {
        return (
            <React.Fragment>
                <Navbar />
                <div className="account-main ">
                    <div className="container">
                        <div className="row">
                            <AccountSidebar />
                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <OrderHistory />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

export default History;