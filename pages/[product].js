import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import he from 'he';
import Head from '../components/SEO/head';
import Navbar from '../components/Layout/Navbar';
import Breadcrumb from '../components/Common/Breadcrumb';
import Footer from '../components/Layout/Footer';
import ProductImage from '../components/product-details/ProductImage';
import ProductContent from '../components/product-details/ProductContent';
import DetailsTab from '../components/product-details/DetailsTab';
import Error from './_error';
import RelatedProducts from '../components/product-details/RelatedProducts';

import { getProduct } from '../store/actions/productActions';

class Index extends Component {
    state = {
        image: '',
        selected: ''
    }

    componentDidMount() {
        this.setInitialValues();
    }

    componentDidUpdate(oldProps) {
        const { productDetail } = this.props;
        if(oldProps.productDetail !== productDetail) {
            this.setInitialValues();
        }
    }

    setInitialValues = () => {
        const { productDetail } = this.props;
        if(productDetail.image) {
            this.setState({
                image: productDetail.image.url,
                selected: productDetail.variants && productDetail.variants.length > 0 ?
                    productDetail.variants[0] : ''
            });
        }
    }

    getSpecificationOfSelectedVariant = (variant) => {
        if (variant) {
            let variantAttributes = {};
            variant.attributes.map(attribute => {
                variantAttributes[attribute.code] = attribute.label;
            })
            return variantAttributes;
        }
    }

    onVariantSelection = (variant) => {
        this.setState({
            selected: variant,
            image: variant.product.image.url
        });
    }

    render() {
        const { productDetail, router: { query: { product } } } = this.props;
        return (
            productDetail.name ?
            <React.Fragment>
                <Head
                    title={productDetail.name}
                    description={he.decode(productDetail.description.html)}
                    image={this.state.image}
                    url={product}
                />
                <Navbar />
                <Breadcrumb title={he.decode(productDetail.name)} />

                <section className='products-details-area pt-60'>
                    <div className='container'>
                        <div className='row'>
                            <ProductImage image={this.state.image} />
                            <ProductContent
                                productDetail={productDetail}
                                onVariantSelection={this.onVariantSelection}
                                selectedVariant={this.state.selected}
                            />
                            <DetailsTab
                                productDetail={productDetail}
                                selectedVariant={this.state.selected}
                                getSpecificationOfSelectedVariant={this.getSpecificationOfSelectedVariant}
                            />
                        </div>
                    </div>

                    {/* <RelatedProducts productID={productDetail.id} categoryID={productDetail.extension_attributes.category_links[1].category_id} /> */}
                </section>

                <Footer />
            </React.Fragment>
            :
            <Error statusCode="404" />
        );
    }
}

Index.getInitialProps = async ({ store, query: { product } }) => {
    await store.dispatch(getProduct(product.split('.html')[0]));
}

const mapStateToProps = state => {
    return {
        productDetail: state.productReducer.productDetail
    };
};

export default withRouter(connect(mapStateToProps, null)(Index));;
