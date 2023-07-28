import React, { Component } from 'react';
import Router from "next/router";
import Link from './Link';

class AccountSidebar extends Component {
    componentDidMount () {
        if (!localStorage.getItem('authToken')) {
            Router.push("/");
        }
    }

    render () {
        return (
            <div className="col-md-3 col-sm-3 col-xs-12">
                <div className="nav-sidebar nav-sidebar-account">
                    <div className="nav-sidebar-title">
                        <strong><span>My Account</span></strong>
                    </div>
                    <div className="nav-sidebar-content">
                        <ul>
                            <li className="current">
                                <Link href="/customer/account" activeClassName='active'>
                                    <a><i className="fa fa-caret-right" aria-hidden="true"></i> Account Dashboard</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/customer/account/edit" activeClassName='active'>
                                    <a><i className="fa fa-caret-right" aria-hidden="true"></i> Account Information</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/customer/address" activeClassName='active'>
                                    <a><i className="fa fa-caret-right" aria-hidden="true"></i> Address Book</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/customer/order/history" activeClassName='active'>
                                    <a><i className="fa fa-caret-right" aria-hidden="true"></i> My Orders</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/customer/recent-orders" activeClassName='active'>
                                    <a><i className="fa fa-caret-right" aria-hidden="true"></i> Recently Purchased</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default (AccountSidebar);