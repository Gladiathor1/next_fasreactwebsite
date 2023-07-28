import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FeaturedProducts from "./FeaturedProducts";
import SpecialProducts from "./SpecialProducts";

import { featuredProducts } from "../../store/actions/productActions";

class NewArrivalProducts extends Component {
    state = {
        selectedTab : 0
    };

    componentDidMount() {
        const { featuredProducts } = this.props;
        featuredProducts("281");
    }

    selectTab = (selectedTab) => {
        this.setState({ selectedTab });
    }

    render() {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4 font-size-22 black">
                        New Arrivals
                    </div>
                    <div className="col-md-12 hr"> </div>
                    <FeaturedProducts />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        featuredProducts: bindActionCreators(featuredProducts, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(NewArrivalProducts);
