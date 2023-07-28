import React, { Component } from 'react';

class ProductImage extends Component {
    render() {
        const { image } = this.props;
        return (
            <div className="col-lg-5 col-md-4 col-sm-12">
                <div className="products-page-gallery">
                    <div className="product-page-gallery-main">
                        <div className="item">
                            <img src={image} alt="image" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductImage;
