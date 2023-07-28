import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import he from 'he';
import { debounce } from 'debounce';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { searchProducts } from '../../store/actions/productActions';

class TopHeader extends Component {
    constructor() {
        super();

        this.state = {
            searchStr: '',
            loading: false
        };
        this.handleSearchForm = debounce(this.handleSearchForm, 500);
    }

    handleSearchForm = async str => {
        this.setState({ loading: true, searchStr: str });
        try {
            await this.props.searchProducts(str, 1);
            this.setState({ loading: false });
        } catch (err) {
            this.setState({ loading: false, options: [] });
        }
    }

    handlePaginate = (e) => {
        e.preventDefault();
        const { router } = this.props;
        const { searchStr } = this.state;
        if (searchStr && searchStr.length) {
            router.push(`/catalog-search/${searchStr}`);
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="top-header">
                    <div className="container">
                        <div className="row header-elements">
                            <div className="header-logo logo">
                                <Link href="/">
                                    <a className="navbar-brand">
                                        <img src={require("../../images/logo.png")} alt="logo" />
                                    </a>
                                </Link>
                            </div>

                            <div className="header-search search">
                                <AsyncTypeahead
                                    id="search"
                                    className="search-input"
                                    labelKey="name"
                                    isLoading={this.state.loading}
                                    name="search"
                                    placeholder="Search"
                                    onSearch={this.handleSearchForm}
                                    options={this.props.searched}
                                    onKeyDown={(e)=>{if(e.keyCode===13){
                                        this.handlePaginate(e);
                                    }}}
                                    selectHintOnEnter={true}
                                    filterBy={(option, props) => {
                                        if (props.options.length) {
                                            return true;
                                        }
                                        return false;
                                    }}
                                    renderMenuItemChildren={(option) => {
                                        let img = (option.small_image && option.small_image.url) ? option.small_image.url : "";
                                        return (
                                            <Link
                                                key={option.id}
                                                href="/[product]"
                                                as={`/${option.url_key}.html`}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <img className="search-item-image" src={img} />
                                                    <span>{he.decode(option.name)}</span>
                                                </div>
                                            </Link>
                                        )
                                    }}
                                />
                                <button className="search-button" onClick={this.handlePaginate}><i className="fas fa-search"></i></button>
                            </div>

                            <Link href="/shipping-return">
                                <div className="header-free-shipping">
                                    <img src={require("../../images/free-home.png")} />
                                    <div className="text">
                                        <span>Free</span>
                                        <span>Shipping </span>
                                    </div>
                                </div>
                            </Link>

                            <div className="header-wholesale">
                                <span>For Wholesale Inquiries</span>
                                <span>Please Call: 800-678-8569</span>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        searched: state.productReducer.searched
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        searchProducts: bindActionCreators(searchProducts, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopHeader));
