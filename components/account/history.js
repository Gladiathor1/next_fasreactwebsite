import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Link from 'next/link';
import Router from "next/router";
import Loader from "react-loader-spinner";
import { customerOrders } from '../../store/actions/customerActions';
import { addToCartProduct, createCart } from '../../store/actions/cartActions';
import { getUserDetail } from "../../store/actions/authActions";
import { capitalize } from '../../utils/validations';

class History extends Component {
    state = {
        loader: false,
        reorder: ''
    }

    async componentDidMount() {
        const { customerOrders, user, orders, getUserDetail} = this.props;
        if (user && user.email && !orders.items) {
           this.setState({ loader : true });
           await customerOrders(user.email);
           this.setState({ loader: false });
        } else {
            if (localStorage.getItem('authToken') && !orders.items) {
                this.setState({ loader: true });
                await getUserDetail();
                const { user } = this.props;
                await customerOrders(user.email);
                this.setState({ loader: false });
            } 
        }
    }

    reOrder = async (orderID) => {
        this.setState({ reorder: orderID });
        const { orders } = this.props;
        const order = orders.items.find(item => item.entity_id == orderID);
        const { addToCartProduct, createCart } = this.props;
        const cartID = localStorage.getItem("cartID");
        if (!cartID) {
            await createCart();
        }
        order.items.map(async (item) => {
            const data = {
                quantity: item.qty_ordered,
                sku: item.sku,
            }
            await addToCartProduct(data, item.qty_ordered);
        });
        Router.push("/cart");
    }

    render() {
        const { orders } = this.props;
        return (
            <>
                <div className="dashboard-main account-information">
                    <div className="page-title">
                        <h1>My Orders</h1>
                    </div>
                </div>
                <div className="account-table">
                    <table className="data-table" id="my-orders-table">
                        <thead>
                            <tr className="first last">
                                <th>Order #</th>
                                <th>Date</th>
                                <th>Ship To</th>
                                <th><span className="nobr">Order Total</span></th>
                                <th><span className="nobr">Order Status</span></th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.loader === true && 
                                <tr>
                                    <td colSpan="6" align="center">
                                        <Loader
                                            type="TailSpin"
                                            color="#3954a5"
                                            height={25}
                                            width={25}
                                        />
                                    </td>
                                </tr>
                            }
                            {orders.items && orders.items.length > 0 && orders.items.map(item => {
                                const orderDate = new Date(item.created_at);
                                const orderCreated = (orderDate.getMonth() + 1) + '/' + orderDate.getDate() + '/' + orderDate.getFullYear();
                                const shippingInfo = item.extension_attributes.shipping_assignments[0].shipping;
                                return (
                                    <tr className="first last odd" key={item.increment_id}>
                                    <td>{item.increment_id }</td>
                                    <td><span className="nobr">{orderCreated }</span></td>
                                    <td>{capitalize(shippingInfo.address.firstname) + ' ' + capitalize(shippingInfo.address.lastname)}</td>
                                    <td><span className="price">${item.grand_total}</span></td>
                                    <td><em>{item.status }</em></td>
                                    <td className="a-center last">
                                        {this.state.reorder == item.entity_id ? 
                                            <Loader
                                                type="TailSpin"
                                                color="#3954a5"
                                                height={25}
                                                width={25}
                                            /> :
                                        <>
                                            <span className="nobr">
                                                <Link href="/customer/order/view/[order]" as={`/customer/order/view/${item.entity_id}`}>
                                                    <a>View Order</a>
                                                </Link>
                                                <span className="separator">|</span>
                                                <a href="#"
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        this.reOrder(item.entity_id)
                                                    }}
                                                    className="link-reorder">
                                                    Reorder
                                                </a>
                                            </span>
                                        </>}
                                    </td>
                                </tr>
                                )
                            }) }
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}


const mapStateToProps = state => {
    return {
        orders: state.customerReducer.orders,
        user: state.authReducer.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        customerOrders: bindActionCreators(customerOrders, dispatch),
        addToCartProduct: bindActionCreators(addToCartProduct, dispatch),
        createCart: bindActionCreators(createCart, dispatch),
        getUserDetail: bindActionCreators(getUserDetail, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(History);