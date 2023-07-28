import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from "react-loader-spinner";
import he from "he";
import Head from '../../components/SEO/head';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import Breadcrumb from '../../components/Common/Breadcrumb';
import LeftSidebar from '../../components/Sidebar/LeftSidebar';
import ProductsFilterOptions from '../../components/Common/ProductsFilterOptions';
import ProductsCard from '../../components/products/ProductsCard';

import { getCategoryID, getProducts } from '../../store/actions/categoryActions';

class Index extends Component {

    state = {
        gridClass: "",
        filters: "",
        loading: false,
        display: false,
        pageLoader: false,
    }

    handleFilter = () => {
        this.setState({ display: !this.state.display });
    }

    handleGrid = (e) => {
        this.setState({
            gridClass: e
        });
    }

    handleQuery = async (filterValues) => {
        this.setState({ pageLoader: true });
        const { getProducts, categoryID } = this.props;
        let filters = ``;
        filterValues.forEach(fil => {
            let values = "";
            if (fil.attr === "price") {
                values = `from: "${fil.values[0]}" to: "${fil.values[1]}"`;
                filters = `${filters} ${fil.attr}: { ${values} }`
            } else {
                fil.values.forEach(val => {
                    if (values.length > 0) {
                        values = `${values}, `;
                    }
                    values = `${values}"${val}"`
                })
                filters = `${filters} ${fil.attr}: { in: [${values}] }`
            }
        })

        try {
            await getProducts(categoryID, 1, filters);
            this.setState({ filters, pageLoader: false });
        } catch(err) {
            this.setState({ filters: "", pageLoader: false });
        }
    }

    clearQuery = async () => {
        const { getProducts, categoryID } = this.props;
        this.setState({ filters: "", pageLoader: true });
        await getProducts(categoryID, 1)
        this.setState({ pageLoader: false });
    }

    fetchMoreProducts = async () => {
        const { categoryID, pagination, getProducts } = this.props;
        const { filters } = this.state;
        if (pagination.total / pagination.size > 1) {
            this.setState({ loading: true });
            await getProducts(categoryID, (pagination.current + 1), filters);
            this.setState({ loading: false });
            if (window.scrollY > 170 && window.innerWidth > 1200) {
                let elementId = document.getElementById("fixed-filter-sidebar");
                if(elementId) {
                    elementId.classList.add("sticky-top");
                }
            }
        }
    }

    render() {
        const { gridClass, loading, filters, pageLoader } = this.state;
        const { category, pagination, products, router, router: { query } } = this.props;

        return (
            <React.Fragment>
                <Head
                    title={he.decode(category.name)}
                    description={""}
                    image={products.length > 0 && products[0].image && products[0].image ? products[0].image : "" }
                    url={`category/${query.category}`}
                />
                <Navbar />
                <Breadcrumb title={he.decode(category.name)} />

                <section className="products-collections-area py-3">
                    <div className="container-fluid">
                        <div className="section-title">
                            <h2>{he.decode(category.name)}</h2>
                        </div>

                        {!filters && products.length === 0 && !pageLoader ?
                            <div className="col-md-12 text-center no-product-found">
                                <span className="text-capitalize font-weight-bold">No Product Found</span>
                            </div> :
                            <div className="row">
                                <div className="col-sm-3 sidebar-height">
                                    <LeftSidebar handleQuery={this.handleQuery} clearQuery={this.clearQuery} handleFilter={this.handleFilter} router={router} />
                                </div>

                                {products.length === 0 ?
                                    <div className="col-sm-9 product-height">
                                        <h4 className="text-center">No Product Found</h4>
                                    </div> :
                                    <div className="col-sm-9">
                                        <ProductsFilterOptions onClick={this.handleGrid} handleFilter={this.handleFilter} />
                                        <div id="products-filter" className={`products-collections-listing row d-flex justify-content-center ${gridClass}`}>
                                            <InfiniteScroll
                                                pageStart={pagination.current - 1}
                                                loadMore={this.fetchMoreProducts}
                                                hasMore={!loading && pagination.total > products.length ? true : false}
                                                className="products-collection-scroll w-100"
                                                loader={""}
                                                initialLoad={false}
                                            >
                                                <ProductsCard products={products} />
                                            </InfiniteScroll>
                                        </div>

                                        { pagination.total > products.length &&
                                            <div className="col-md-12 my-2">
                                                <p className="text-center">
                                                    <button disabled={loading} className="btn btn-light" onClick={this.fetchMoreProducts}>
                                                        {loading ?
                                                            <span className="d-flex">
                                                                <Loader className="mr-1" type="TailSpin" color="#0c9495" height={20} width={20} /> Loading
                                                            </span> :
                                                            "Load More"
                                                        }
                                                    </button>
                                                </p>
                                            </div>
                                        }

                                        { this.state.pageLoader &&
                                            <div className="listing-loader">
                                                <Loader className="spinner" type="TailSpin" color="#0c9495" height={50} width={50} />
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </section>

                {this.props.isHidden ? null : <Footer />}
            </React.Fragment>
        );
    }
}

Index.getInitialProps = async ({ store, query: { category } }) => {
    const path = category.split(".html")[0];
    if(path === "default-category") {
        await store.dispatch(getProducts(2, 1));
    } else {
        const res = await store.dispatch(getCategoryID(path));
        await store.dispatch(getProducts(res.payload.categoryList[0].id, 1));
    }
}

const mapStateToProps = state => {
    return {
        category: state.categoryReducer.category,
        categoryID: state.categoryReducer.categoryID,
        pagination: state.productReducer.pagination,
        products: state.productReducer.products,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getProducts: bindActionCreators(getProducts, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));