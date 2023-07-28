import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Link from 'next/link';
import Router from "next/router";
import he from "he";
import Cart from "../Modal/Cart";
import { getUserDetail, logoutUser } from "../../store/actions/authActions";
import { getCartProduct, openCartModel, getTotals } from "../../store/actions/cartActions";
class MegaMenu extends Component {
    state = {
        displayCartModal: false,
        collapsed: true
    };

    componentDidMount() {
        if (window.innerWidth > 992) {
            let elementId = document.getElementById("navbar");
            document.addEventListener("scroll", () => {
                if (window.scrollY > 170) {
                    elementId.classList.add("is-sticky");
                } else {
                    elementId.classList.remove("is-sticky");
                }
            });
        }
        window.scrollTo(0, 0);

        window.addEventListener('resize', () => {
            this.setState({
                isMobile: window.innerWidth < 1200
            });
        }, false);
        const { getUserDetail, getCartProduct, getTotals } = this.props;
        if (localStorage.getItem("authToken")) {
            getUserDetail();
        }
        getCartProduct();
        getTotals();
    }

    componentDidUpdate(prevProps, ) {
        if (prevProps.cartOpenModel !== this.props.cartOpenModel) {
            this.setState({ displayCartModal: this.props.cartOpenModel });
        }
    }

    click = (e) => {
        const checkClass = e.target.parentNode.className.trim();
        let elems;
        if (e.target.parentNode.className.search('open') >= 0) {
            e.target.parentNode.classList.toggle('open')
        } else {
            if (checkClass == "nav-item p-relative") {
                elems = document.querySelectorAll(".nav-item.p-relative");
            } else if (checkClass == "dropdown-submenu nav-item") {
                elems = document.querySelectorAll(".dropdown-submenu.nav-item");
            } else if (checkClass == "dropdown-submenu nav-item level2") {
                elems = document.querySelectorAll(".dropdown-submenu.nav-item.level2");
            } else if (checkClass == "dropdown-submenu nav-item level4") {
                elems = document.querySelectorAll(".dropdown-submenu.nav-item.level4");
            } else {
                elems = document.querySelectorAll(".dropdown-submenu.nav-item.level3");
            }
            [].forEach.call(elems, function (el) {
                el.classList.remove("open");
            });

            e.target.parentNode.classList.add('open')
        }
    }

    handleCart = value => {
        const { openCartModel } = this.props;
        openCartModel(value);
    };

    toggleNavbar = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    logout = async () => {
        const { logoutUser } = this.props;
        logoutUser();
        setTimeout(() => {
            Router.push('/');
        }, 500);
    };

    render() {
        const { collapsed, isMobile } = this.state;
        const { user, categories } = this.props;
        const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
        const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
        const MobileMenu = isMobile ? 'container-fluid' : 'container';
        return (
            <React.Fragment>
                <div className="navbar-area">
                    <div id="navbar" className="fas-nav desktop">
                        <div className="dashed-border">
                            <div className={MobileMenu}>
                                <nav className="navbar navbar-expand-lg navbar-light">
                                    <button
                                        onClick={this.toggleNavbar}
                                        className={classTwo}
                                        type="button"
                                        data-toggle="collapse"
                                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                        aria-expanded="false"
                                        aria-label="Toggle navigation"
                                    >
                                        <span className="navbar-toggler-icon"></span>
                                    </button>

                                    <div className={`d-flex justify-content-between align-items-center ${classOne}`} id="navbarSupportedContent">
                                        <ul className="navbar-nav nav-left-sction">
                                            {categories.map(category => {
                                                const url_key = category.name.toLowerCase() === "color" ? `default-category.html` : `${category.url_key}.html`;
                                                return (
                                                    <li className="nav-item pr-3" key={category.id}>
                                                        <Link href="/category/[category]" as={`/category/${url_key}`}>
                                                            <a className="nav-link">
                                                                {he.decode(category.name)}
                                                            </a>
                                                        </Link>
                                                        {category.children && category.children.length > 0 &&
                                                            <SubCategories parentName={category.name} props={category.children} level="1" toggleNavbar={this.toggleNavbar} />
                                                        }
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        <ul className="d-flex align-items-center nav-right-section">
                                            <li className="account-link pr-3">
                                                { !user.id ?
                                                    <Link href="/login">
                                                        <a>Login</a>
                                                    </Link> :
                                                    <div className="d-flex flex-column">
                                                        <Link href="/customer/account">
                                                            <a>{user.firstname} {user.lastname}</a>
                                                        </Link>
                                                        <a onClick={this.logout}>Logout</a>
                                                    </div>
                                                }
                                            </li>

                                            <li className="cart-link">
                                                <div className="d-flex align-items-center cart-info">
                                                    <img src={require("../../images/cart-icon.png")} />
                                                    <span className="cart-count">{this.props.cartTotalQty}</span>
                                                    <div className="d-flex flex-column">
                                                        <a onClick={this.props.cartTotalQty > 0 ? () => this.props.openCartModel(true) : null}>My Cart</a>
                                                        { this.props.cartTotalQty > 0 &&
                                                            <Link href="/checkout">
                                                                <a>Checkout</a>
                                                            </Link>
                                                        }
                                                    </div>
                                                </div>
                                                { this.props.cartTotalQty === 0 &&
                                                    <ul className="dropdown-menu dropdown-menu-show">
                                                        <li className="nav-item">
                                                            <a className="nav-link">Your cart is empty</a>
                                                        </li>
                                                    </ul>
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="navbar" className="mobile-navbar-menu">
                    <div className={MobileMenu}>
                        <nav className="navbar navbar-expand-lg d-flex navbar-light">
                            <button
                                onClick={this.toggleNavbar}
                                className={classTwo + ' mr-auto'}
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="pr-3 mt-1 mob-log">
                                { !user.id ?
                                    <Link href="/login">
                                        <a>Login</a>
                                    </Link> :
                                    <div className="d-flex flex-column">
                                        <Link href="/customer/account">
                                            <a>{user.firstname} {user.lastname}</a>
                                        </Link>
                                        <a onClick={this.logout}>Logout</a>
                                    </div>
                                }
                            </div>

                            <div className="d-flex align-items-center mobile-cart-info">
                                <img src={require("../../images/cart-icon.png")} />
                                <span className="cart-count">{this.props.cartTotalQty}</span>
                                <div className="d-flex flex-column">
                                    <a onClick={this.props.cartTotalQty > 0 ? () => this.props.openCartModel(true) : null}>My Cart</a>
                                    { this.props.cartTotalQty > 0 &&
                                        <Link href="/checkout">
                                            <a>Checkout</a>
                                        </Link>
                                    }
                                </div>
                            </div>

                            <div className={classOne} id="navbarSupportedContent">
                                <button
                                    onClick={this.toggleNavbar}
                                    className={classTwo + ' cross-btn'}
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                >
                                    <span> <i className="fa fa-times"></i></span>
                                </button>
                                <ul className="navbar-nav">
                                    { categories.map(category => {
                                        const url_key = category.name.toLowerCase() === "color" ? `default-category.html` : `${category.url_key}.html`;
                                        return (
                                            <li className="nav-item p-relative" key={category.id} onClick={this.click}>
                                                <Link href="/category/[category]" as={`/category/${url_key}`}>
                                                    <a className="nav-link" onClick={this.toggleNavbar}>{he.decode(category.name)}</a>
                                                </Link>
                                                {category.children && category.children.length > 0 &&
                                                    <i className="fas fa-chevron-right"></i>
                                                }
                                                {category.children &&
                                                    <SubCategories parentName={category.name} props={category.children} level="1" toggleNavbar={this.toggleNavbar} />
                                                }
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
                <Cart onClick={() => this.handleCart(false)} displayCartModal={this.state.displayCartModal} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    let cartItems = state.cartReducer.cartItems
    let cartTotalQty = cartItems.length || 0;
    return {
        user: state.authReducer.user,
        cartOpenModel: state.cartReducer.cartOpen,
        cartTotalQty,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getUserDetail: bindActionCreators(getUserDetail, dispatch),
        logoutUser: bindActionCreators(logoutUser, dispatch),
        getCartProduct: bindActionCreators(getCartProduct, dispatch),
        openCartModel: bindActionCreators(openCartModel, dispatch),
        getTotals: bindActionCreators(getTotals, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MegaMenu);

const SubCategories = (data) => {
    const level = parseInt(data.level) + 1;
    const view = data.view;
    const showMenu = (view == "desktop" ? (level <= 2 ? true : false) : true);
    
    return (
        <ul className="dropdown-menu">
            {data.props.map(child => {
                const url_key = data.parentName.toLowerCase() === "color" ? `default-category.html` : `${child.url_key}.html`;
                return (
                    <li className={child.children ? `dropdown-submenu nav-item ${level ? "level" + level : ''}` : "nav-item"} key={child.id}>
                        { url_key === "default-category.html" ?
                            <Link
                                href={{ pathname: `/category/[category]`, query: { color: child.name } }}
                                as={{ pathname: `/category/${url_key}`, query: { color: child.name } }}
                            >
                                <a className="nav-link active" onClick={data.toggleNavbar}>{child.name}</a>
                            </Link> : 
                            <Link href={`/category/[category]`} as={`/category/${url_key}`} >
                                <a className="nav-link active" onClick={data.toggleNavbar}>{child.name}</a>
                            </Link>
                        }
                        
                        { showMenu && child.children && child.children.length > 0 &&
                            <i className="fas fa-chevron-right"></i>
                        }
                        { showMenu && child.children && child.children.length > 0 &&
                            <SubCategories parentName={child.name} props={child.children} view={view} level={level} toggleNavbar={data.toggleNavbar} />
                        }
                    </li>
                )
            })}
        </ul>
    );
}
