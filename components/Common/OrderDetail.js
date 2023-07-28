import React, { Component } from 'react';
import { capitalize, monthNames } from '../../utils/validations';
import Link from 'next/link';
import { addToCartProduct, createCart } from '../../store/actions/cartActions';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Router from "next/router";

class OrderDetail extends Component {

    reOrder = async (e) => {
        e.preventDefault();
        const { items } = this.props.orderDetail;
        const { addToCartProduct, createCart } = this.props;
        const cartID = localStorage.getItem("cartID");
        if (!cartID) {
            await createCart();
        }
        items.map(async(item) => {
            const data = {
                quantity: item.qty_ordered,
                sku: item.sku,
            }
            await addToCartProduct(data, item.qty_ordered);
        });
        Router.push("/cart");
    }

    render() {
        const { orderDetail, hideOtherInfo } = this.props;
        const orderDate = new Date(orderDetail.created_at);
        const shippingInfo = orderDetail.extension_attributes.shipping_assignments[0].shipping;
        const cardInfo = orderDetail.extension_attributes.payment_additional_info;
        const cardType = (cardInfo.find(card => card.key == "cc_type")).value;
        const cardNumber = (cardInfo.find(card => card.key == "cc_number")).value;

        return (
            <div className="dashboard-main my-account">
                <div className="page-head button-level">
                    { hideOtherInfo ? 
                        <><h3>Order #{orderDetail.increment_id}</h3></> 
                    : <> 
                    <h3>Order #{orderDetail.increment_id} - {capitalize(orderDetail.status)}</h3>
                    <a href="#" onClick={this.reOrder} className="link-cart">Reorder</a>
                    <span className="pipe"> | </span>
                    <Link href="/customer/order/print/[order]" as={`/customer/order/print/${orderDetail.entity_id}`}>
                        <a target="_blank">Print Order</a>
                    </Link>
                    </>}
                </div>
                { !hideOtherInfo &&
                <div className="order-access">
                    <div className="order-info">
                        About This Order:
                        <ul>
                            <li className="selected">Order Information</li>
                        </ul>
                    </div>
                </div>
                }

                <p>Order Date: {monthNames[orderDate.getMonth()] + ' ' + orderDate.getDate() + ', ' + orderDate.getFullYear()} </p>
                <div className="col2-set generic-box d-flex">
                    <div className="col-1">
                        <h4>Shipping Address</h4>
                        <address className="no-margin">
                            <p>{capitalize(shippingInfo.address.firstname) + ' ' + capitalize(shippingInfo.address.lastname)}</p>
                            <p>{shippingInfo.address.street[0]}</p>
                            <p>{shippingInfo.address.city + ', ' + shippingInfo.address.region + ', ' + shippingInfo.address.postcode}</p>
                            <p>United States</p>
                            <p>T: {shippingInfo.address.telephone}</p>
                            <p>F: {shippingInfo.address.telephone}</p>
                        </address>
                    </div>
                    <div className="col-2">
                        <h4>Shipping Method</h4>
                        <p className="grey-color">{orderDetail.shipping_description}</p>
                    </div>
                </div>
                <div className="col2-set generic-box d-flex">
                    <div className="col-1">
                        <h4>Billing Address</h4>
                        <address className="no-margin">
                            <p>{capitalize(orderDetail.billing_address.firstname) + ' ' + capitalize(orderDetail.billing_address.lastname)}</p>
                            <p>{orderDetail.billing_address.street[0]}</p>
                            <p>{orderDetail.billing_address.city + ', ' + orderDetail.billing_address.region + ', ' + orderDetail.billing_address.postcode}</p>
                            <p>United States</p>
                            <p>T: {orderDetail.billing_address.telephone}</p>
                            <p>F: {orderDetail.billing_address.telephone}</p>
                        </address>
                    </div>
                    <div className="col-2">
                        <h4>Payment Method</h4>
                        <p className="grey-color"><strong>Credit Card (Note: Your Credit Card WILL NOT Be Charged Until Your Order is Verified)</strong>
                        </p>
                        <table className="customer-account-card-info">
                            <tbody>
                                <tr>
                                    <th><strong>Credit Card Type:</strong></th>
                                </tr>
                                <tr className="grey-color">
                                    <td>{cardType}</td>
                                </tr>
                                <tr>
                                    <th><strong>Credit Card Number:</strong></th>
                                </tr>
                                <tr className="grey-color">
                                    <td>{cardNumber}</td>
                                </tr>
                                <tr>
                                    <th><strong>Name on the Card:</strong></th>
                                </tr>
                                <tr className="grey-color">
                                    <td>{capitalize(orderDetail.customer_firstname) + ' ' + capitalize(orderDetail.customer_lastname)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col2-set generic-box d-flex">
                    <div className="col-1">
                        <h4>Delivery Date</h4>
                    </div>
                    <div className="col-2">
                        <h4>Comment</h4>
                    </div>
                </div>
                <div className="order-items order-details">
                    <h2 className="table-caption">Items Ordered </h2>
                    <div className="account-table">
                        <table className="">
                            <thead>
                                <tr className="first last">
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th className="a-right">Price</th>
                                    <th className="a-center">Qty</th>
                                    <th className="a-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr className="subtotal first">
                                    <td colSpan="4" className="a-right">
                                        Subtotal
                                                        </td>
                                    <td className="last a-right">
                                        <span className="price">${orderDetail.subtotal}</span>
                                    </td>
                                </tr>
                                <tr className="additionalfee">
                                    <td colSpan="4" className="a-right">
                                        CRV Tax
                                                        </td>
                                    <td className="last a-right">
                                        <span className="price">$0.00</span>
                                    </td>
                                </tr>
                                <tr className="shipping">
                                    <td colSpan="4" className="a-right">
                                        Shipping &amp; Handling
                                                        </td>
                                    <td className="last a-right">
                                        <span className="price">${orderDetail.base_shipping_amount}</span>
                                    </td>
                                </tr>
                                <tr className="grand_total last">
                                    <td colSpan="4" className="a-right">
                                        <strong>Grand Total</strong>
                                    </td>
                                    <td className="last a-right">
                                        <strong><span className="price">${orderDetail.grand_total}</span></strong>
                                    </td>
                                </tr>
                            </tfoot>
                            <tbody className="odd">
                                {orderDetail.items.map(item => {
                                    return (
                                        <tr className="border first" id="order-item-row-3027" key={item.item_id}>
                                            <td><h3 className="product-name">{item.name}</h3>
                                            </td>
                                            <td>{item.sku}</td>
                                            <td className="a-right">
                                                <span className="price-excl-tax">
                                                    <span className="cart-price">
                                                        <span className="price">${item.price}</span>
                                                    </span>
                                                </span>
                                                <br />
                                            </td>
                                            <td className="a-right">
                                                <span className="nobr">
                                                    Ordered: {item.qty_ordered}
                                                </span>
                                            </td>
                                            <td className="a-right last">
                                                <span className="price-excl-tax">
                                                    <span className="cart-price">
                                                        <span className="price">${item.base_row_total}</span>
                                                    </span>
                                                </span>
                                                <br />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    { !hideOtherInfo &&
                    <div className="buttons-set">
                        <p className="back-link">
                            <Link href="/customer/order/history">
                                <a><small>« </small>Back to My Orders</a>
                            </Link>
                        </p>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        addToCartProduct: bindActionCreators(addToCartProduct, dispatch),
        createCart: bindActionCreators(createCart, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
