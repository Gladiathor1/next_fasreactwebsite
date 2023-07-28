import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Navbar from '../../../../components/Layout/Navbar';
import AccountSidebar from '../../../../components/Sidebar/AccountSidebar';
import Footer from '../../../../components/Layout/Footer';
import { connect } from "react-redux";
import { customerOrderDetail } from '../../../../store/actions/customerActions';
// import { capitalize, monthNames } from '../../../../utils/validations';
import OrderDetail  from '../../../../components/Common/OrderDetail';

class ViewOrder extends Component {
    render() {
        const { orderDetail } = this.props;
        return (
            <React.Fragment>
                <Navbar />
                <div className="account-main ">
                    <div className="container">
                        <div className="row">
                            <AccountSidebar />
                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <OrderDetail orderDetail={orderDetail} />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

ViewOrder.getInitialProps = async ({ store, query: { order } }) => {
    await store.dispatch(customerOrderDetail(order));
}

const mapStateToProps = state => {
    return {
        orderDetail: state.customerReducer.orderDetail,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewOrder));