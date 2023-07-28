import React, { Component } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import he from "he";

class SpecialProducts extends Component {
  render() {
    const { special } = this.props;
    return (
      <div className="container pb-5">
        <div className="row">
          { special.map(product => {
            return (
              <div key={product.id} className="col-md-3 arrival-col col-12">
                <div className="my-list">
                  <div className="wrapper">
                    <div className="preview-pic">
                      <img src={product.image.url} />
                    </div>
                    <div className="details">
                      <p className="font-size-14">{he.decode(product.name)}</p>
                      <p className="font-size-25 theme-text-color">
                        ${product.price_range.minimum_price.regular_price.value} <span className="arrival-text-c font-weight-normal">USD per Yard</span>
                      </p>
                      <div className="detail">
                        <Link href="/[product]" as={`/${product.url_key}.html`}>
                          <a className="btn btn-sm btn-light">View</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )})
          }
        </div>   
      </div> 
    );
  }
}

const mapStateToProps = (state) => {
  return {
    special: state.productReducer.special
  };
};

export default connect(mapStateToProps, null)(SpecialProducts);
