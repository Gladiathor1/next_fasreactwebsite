import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import he from "he";
import { ToastContainer, toast } from "react-toastify";
import { getCartProduct, addToCartProduct, createCart, addItem, getTotals } from "../../store/actions/cartActions";
import { addToCart } from './../../utils/addToCart';
import 'react-toastify/dist/ReactToastify.css';

class ProductContent extends Component {
    state = {
        quantity: 1,
        viewAll: false
    };

    componentDidUpdate(prevProps) {
        if (prevProps.productDetail.id != this.props.productDetail.id) {
            this.setState({ quantity: 1 });
        }
    }

    handleProductAddToCart = async (price, label) => {
        const { selectedVariant, productDetail } = this.props;
        const { quantity } = this.state;
        let data = {};

        if (productDetail.__typename === 'ConfigurableProduct') {
            data = {
                type: 'ConfigurableProduct',
                parent_sku: productDetail.sku,
                variant: {
                    sku: selectedVariant.product.sku,
                    custom_price: price === 1 || price === 8 ? true : false,
                    price: parseFloat(price),
                    purchased: label,
                    quantity,
                }
            }
        } else {
            data = {
                type: 'SimpleProduct',
                sku: productDetail.sku,
                custom_price: price === 1 || price === 8 ? true : false,
                price: parseFloat(price),
                purchased: label,
                quantity
            }
        }
        this.saveState(productDetail, selectedVariant, price, label);
        await addToCart(this.props, toast, data);
    }

    saveState = (data, variant, price, label) => {
        const { addItem } = this.props;
        let params = {};
        if(data.__typename === 'ConfigurableProduct') {
            params = {
                product_type: "configurable",
                sku: variant.product.sku,
                qty: this.state.quantity,
                name: variant.product.name,
                price,
                extension_attributes: { image_url: variant.product.small_image.url, purchased: label }
            }
        } else {
            params = {
                product_type: "simple",
                sku: data.sku,
                qty: this.state.quantity,
                name: data.name,
                price,
                extension_attributes: { image_url: data.image.url, purchased: label }
            }
        }
        addItem(params);
    }

    IncrementItem = () => {
        this.setState(prevState => ({ quantity: prevState.quantity + 1 }));
    }

    DecreaseItem = () => {
        if (this.state.quantity > 1) {
            this.setState(prevState => ({ quantity: prevState.quantity - 1 }));
        }
    }

    handleQty = (e) => {
        this.setState({
            quantity: parseInt(e.target.value)
        })
    }

    handleUnit = (e) => {
        this.setState({ shopBy: e.target.value });
    }

    handleColors = () => {
        this.setState({ viewAll: !this.state.viewAll });
    }

    renderVariations = (v) => {
        const { onVariantSelection, selectedVariant } = this.props;
        return (
            <div key={v.product.id} className="col-sm-2 col-3 color" onClick={() => onVariantSelection(v)}>
                <div className={`image-container ${selectedVariant && selectedVariant.product.id === v.product.id ? `active` : ``}`}>
                    <div className="image-tooltip">
                        <img src={v.product.small_image.url} alt="v" />
                    </div>
                    <img src={v.product.small_image.url} alt="v" />
                </div>
                <p>{v.attributes && v.attributes.length ? v.attributes[0].label: null}</p>
            </div>
        )
    }

    render() {
        const { quantity } = this.state;
        const { productDetail, selectedVariant } = this.props;
        const tiers = productDetail.variants ? productDetail.variants.length ? productDetail.variants[0].product.price_tiers.length : productDetail.price_tiers : 0;
        const stock = productDetail.stock_status === "IN_STOCK" ? true : false;
        const price = productDetail.price_range ? productDetail.price_range.minimum_price.regular_price.value : 0.00;
        const tierPrices = selectedVariant ? selectedVariant.product.price_tiers : productDetail.price_tiers;

        return (
            <div className="col-lg-7 col-md-8 col-sm-12">
                <ToastContainer />
                <div className="product-details-content">
                    <h3>{he.decode(selectedVariant ? selectedVariant.product.name : productDetail.name)}</h3>

                    <div className="price">
                        <span className="new-price">$ {parseFloat(price).toFixed(2)}</span>
                        <span> (USD) per Yard</span>
                    </div>

                    { tiers > 0 && !selectedVariant && productDetail.variants.length > 0 &&
                        <div className="alert alert-primary fas-alert-primary">
                            For Wholesale/Tiered Pricing, please select a color.
                        </div>
                    }

                    { tierPrices.length > 0 &&
                        <div className="tier-table">
                            <p>NEW TIERED PRICING (DOUBLE THE SAVINGS)</p>
                            <ul>
                                { tierPrices.map((tier, i) => 
                                    <li key={i}>
                                        Buy {tier.quantity} YARDS for ${tier.final_price.value} each and <b>save {Math.round(tier.discount.percent_off)}%</b>
                                    </li>
                                )}
                            </ul>
                        </div>
                    }

                    <p>{he.decode(productDetail.description.html)}</p>

                    <div className="alert alert-secondary fas-alert-secondary">
                        For wholesale prices and minimums, please contact us at 800-678-8569
                    </div>

                    <ul className="product-info my-3">
                        <li><span>Availability:</span> <a href="#">
                            {stock ? " In stock" : " Not Available"}
                        </a></li>
                    </ul>
                    { productDetail.variants &&
                        <div className="row product-variations">
                            <div className="col-sm-12 colors">
                                <div className="row">
                                    {productDetail.variants.map((v, index) => {
                                        return (
                                            this.state.viewAll ? 
                                            this.renderVariations(v) :
                                            index < 30 &&
                                            this.renderVariations(v)
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    }

                    { productDetail.variants && productDetail.variants.length > 30 &&
                        <div className="view-more-label">
                            <a onClick={this.handleColors}>
                                { this.state.viewAll ?
                                    `View Less Colors ( ${productDetail.variants.length}/${productDetail.variants.length} )` :
                                    `View All Colors ( 30/${productDetail.variants.length} )`
                                }
                            </a>
                        </div>
                    }

                    <div className="product-add-to-cart d-flex mt-4">
                        <div className="input-counter">
                            <span
                                className="minus-btn"
                                onClick={() => this.DecreaseItem()}
                            >
                                <i className="fas fa-minus"></i>
                            </span>
                            <input
                                type="number"
                                value={quantity}
                                onChange={this.handleQty}
                            />
                            <span
                                className="plus-btn"
                                onClick={() => this.IncrementItem()}
                            >
                                <i className="fas fa-plus"></i>
                            </span>
                        </div>
                        <button className="btn btn-primary mx-2" onClick={() => this.handleProductAddToCart(price, "")}>
                            <i className="fas fa-cart-plus mr-1"></i> Add to cart
                        </button>
                    </div>
                    <button className="btn btn-light mt-2 mr-2" onClick={() => this.handleProductAddToCart(1, "Swatch")}>
                        <i className="fas fa-cart-plus mr-1"></i> Order Swatch $1
                    </button>
                    <button className="btn btn-light mt-2" onClick={() => this.handleProductAddToCart(8, "Color Card")}>
                        <i className="fas fa-cart-plus mr-1"></i> Order Color Card $8
                    </button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getCartProduct: bindActionCreators(getCartProduct, dispatch),
        addToCartProduct: bindActionCreators(addToCartProduct, dispatch),
        createCart: bindActionCreators(createCart, dispatch),
        addItem: bindActionCreators(addItem, dispatch),
        getTotals: bindActionCreators(getTotals, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(ProductContent);
