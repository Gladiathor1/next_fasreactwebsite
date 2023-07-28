import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { connect } from "react-redux";
import { customerOrderDetail } from '../../../../store/actions/customerActions';
import OrderDetail from '../../../../components/Common/OrderDetail';

class ViewOrder extends Component {
    componentDidMount () {
        window.print();
    }

    render() {
        const { orderDetail } = this.props;
        return (
            <React.Fragment>
                <div className="account-main ">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-9 col-sm-9 col-xs-12 offset-1">
                                <OrderDetail orderDetail={orderDetail} hideOtherInfo={true} />
                            </div>
                        </div>
                    </div>
                </div>
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