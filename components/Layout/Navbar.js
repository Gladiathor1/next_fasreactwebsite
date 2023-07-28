import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import TopHeader from './TopHeader';
import MegaMenu from './MegaMenu';
import { getCategories } from '../../store/actions/categoryActions';

class Navbar extends Component {
    componentWillMount() {
        const { getCategories, categories } = this.props;
        if (!categories.length) {
            getCategories();
        }
    }

    render() {
        return (
            <React.Fragment>
                <TopHeader />
                <MegaMenu categories={this.props.categories} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    let categories = state.categoryReducer.categories;
    if (categories && categories.length) {
        categories = categories.slice(0, 7);
    }
    return { categories };
};

const mapDispatchToProps = dispatch => {
    return {
        getCategories: bindActionCreators(getCategories, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
