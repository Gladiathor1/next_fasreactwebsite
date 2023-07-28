import React, { Component } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import he from "he";
const OwlCarousel = dynamic(import("react-owl-carousel3"));

import { popularProducts } from "../../store/actions/productActions";

import "react-toastify/dist/ReactToastify.css";

const options = {
    loop: false,
    nav: true,
    dots: false,
    autoplayHoverPause: true,
    autoplay: false,
    navText: [
        "<i className='fas theme-text-color font-size-20 fa-chevron-left'></i>",
        "<i className='fas theme-text-color font-size-20 fa-chevron-right'></i>"
    ],
    responsive: {
        0: {
            items: 1
        },
        576: {
            items: 1
        },
        768: {
            items: 2
        },
        1024: {
            items: 2
        },
        1200: {
            items: 2
        }
    }
};

class PopularProducts extends Component {
    state = {
        dispaly: false
    }

    async componentDidMount() {
        const { popularProducts } = this.props;
        await popularProducts("280");
        this.setState({ dispaly: true });
    }

    render() {
        const { popular } = this.props;
        const { dispaly } = this.state;

        return (
            <div className="container pb-5 mb-5">
                <div className="row">
                    <div className="col-md-12 pt-4 hr-bottom">
                        <p className="font-size-22 black bottom-para">Popular products</p>
                    </div>
                    { dispaly &&
                        <OwlCarousel
                            className="owl-carousel owl-theme  popular-con popular-slider"
                            {...options}
                        >
                            { popular.map(product => {
                                return (
                                    <div key={product.id} className="col-sm-12 item mt-5">
                                        <div className="wrapper row">
                                            <div className="preview col-md-5">
                                                <Link href="/[product]" as={`/${product.url_key}.html`}>
                                                    <a>
                                                        <div className="preview-pic">
                                                            <img src={product.image.url} />
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                            <div className="details col-md-7">
                                                <Link href="/[product]" as={`/${product.url_key}.html`}>
                                                    <a>
                                                        <p className="product-description">{he.decode(product.name)}</p>
                                                    </a>
                                                </Link>
                                                <p className="font-size-25 theme-text-coloright-600">
                                                    {product.price_range.minimum_price.regular_price.value}
                                                    <span className="arrival-text-c"> (USD) per Yard</span>
                                                </p>
                                                <p className="black font-size-14 m-0">
                                                    Available Colors:
                                                </p>

                                                <ul className="preview-thumbnail nav nav-tabs">
                                                    {product.variants && product.variants.map((variant, index) =>
                                                        index < 3 && variant.product.small_image && (
                                                        <li key={variant.product.id}>
                                                            <img src={variant.product.small_image.url} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </OwlCarousel>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        popular: state.productReducer.popular,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        popularProducts: bindActionCreators(popularProducts, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PopularProducts);
