import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from "react-loader-spinner";
import Head from '../../components/SEO/head';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import Breadcrumb from '../../components/Common/Breadcrumb';
import LeftSidebar from '../../components/Sidebar/LeftSidebar';
import ProductsFilterOptions from '../../components/Common/ProductsFilterOptions';
import ProductsCard from '../../components/products/ProductsCard';
import { searchProducts, getFilterOptionsForSeachedProducts } from '../../store/actions/productActions';

class Index extends Component {

    state = {
        gridClass: '',
        filters: '',
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
        const { searchProducts, router: { query: { query } } } = this.props;
        let filters = ``;
        filterValues.forEach(fil => {
            let values = "";
            if (fil.attr === "price") {
                fil.values.forEach(val => {
                    if (val[0] === "-") {
                        values = `to: "${val[1]}"`;
                    } else if (!val[2]) {
                        values = `from: "${val[0]}"`;
                    } else {
                        values = `from: "${val[0]}" to: "${val[2]}"`
                    }
                })
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
        const search = filters ? true : false;
        await searchProducts(query, 1, search, filters);
        this.setState({ filters, pageLoader: false });
    }

    clearQuery = async () => {
        this.setState({ filters: "", pageLoader: true });
        const { searchProducts, router: { query: { query } } } = this.props;
        await searchProducts(query, 1, false)
        this.setState({ pageLoader: false });
    }

    fetchMoreProducts = async () => {
        const { router: { query: { query } }, pagination, searchProducts } = this.props;
        if (pagination.total / pagination.size > 1) {
            this.setState({ loading: true });
            await searchProducts(query, (pagination.current + 1), true);
            this.setState({ loading: false });
        }
    }

    render() {
        const { gridClass, loading, filters } = this.state;
        const { pagination, searched, router, router: { query: { query } } } = this.props;
        return (
            <React.Fragment>
                <Head
                    title={`Search Results for: ${query}`}
                    description={""}
                    image={searched.length > 0 && searched[0].image && searched[0].image ? searched[0].image : "" }
                    url={`catalog-search/${query}`}
                />
                <Navbar />
                <Breadcrumb title={query} />

                <section className="products-collections-area py-4">
                    <div className="container-fluid">
                        <div className="section-title">
                            <h2>Search Results for: {query}</h2>
                        </div>
                        {!filters && searched.length === 0 ?
                            <div className="col-md-12 text-center no-product-found">
                                <span className="text-capitalize font-weight-bold">No Product Found</span>
                            </div> :
                            <div className="row">
                                <div className="col-sm-3">
                                    <LeftSidebar handleQuery={this.handleQuery} clearQuery={this.clearQuery} handleFilter={this.handleFilter} router={router} />
                                </div>

                                {searched.length === 0 ?
                                    <div className="col-sm-9 product-height">
                                        <h4 className="text-center">No Product Found</h4>
                                    </div> :
                                    <div className="col-sm-9">
                                        <ProductsFilterOptions onClick={this.handleGrid} handleFilter={this.handleFilter} />
                                        <div id="products-filter" className={`products-collections-listing row d-flex justify-content-center ${gridClass}`}>
                                            <InfiniteScroll
                                                pageStart={pagination.current - 1}
                                                loadMore={this.fetchMoreProducts}
                                                hasMore={!loading && pagination.total > searched.length ? true : false}
                                                className="products-collection-scroll w-100"
                                                loader={""}
                                                initialLoad={false}
                                            >
                                                <ProductsCard products={searched} />
                                            </InfiniteScroll>
                                        </div>

                                        {pagination.total > searched.length &&
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
                <Footer />
            </React.Fragment >
        );
    }
}

Index.getInitialProps = async ({ store, query: { query } }) => {
    await store.dispatch(searchProducts(query, 1, true));
    await store.dispatch(getFilterOptionsForSeachedProducts(query));
}

const mapStateToProps = state => {
    return {
        pagination: state.productReducer.pagination,
        searched: state.productReducer.searched
    };
};

const mapDispatchToProps = dispatch => {
    return {
        searchProducts: bindActionCreators(searchProducts, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));