import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Navbar from "../components/Layout/Navbar";
import Banner from "../components/homepage/Banner";
import CategoryProducts from "../components/homepage/CategoryProducts";
import DiscountsBanner from "../components/homepage/DiscountsBanner";
import InfoCards from "../components/homepage/InfoCards";
import PopularProducts from "../components/homepage/PopularProducts";
import NewArrivalProducts from "../components/homepage/NewArrivalProducts";
import Footer from "../components/Layout/Footer";
import AddsModal from "../components/Modal/AddsModal";

import { getCustomerBearer } from "./../store/actions/authActions";

class Index extends Component {
  state = {};

  componentDidMount() {
    const isNewsletterShown = sessionStorage.getItem('isNewsletterShown') ? JSON.parse(sessionStorage.getItem('isNewsletterShown')) : false;
    sessionStorage.setItem('isNewsletterShown', true);
    this.setState({ isNewsletterShown: isNewsletterShown });

    const { getCustomerBearer } = this.props;
    const getSession = window.sessionStorage && sessionStorage.getItem("customerBearer");
    getCustomerBearer(getSession);
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <Banner />
        <CategoryProducts />
        <DiscountsBanner />
        <NewArrivalProducts />
        <InfoCards />
        <PopularProducts />
        <Footer /> 
        { 'isNewsletterShown' in this.state && 
          <AddsModal isNewsletterShown={this.state.isNewsletterShown}/> 
        }
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCustomerBearer: bindActionCreators(getCustomerBearer, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(Index);
