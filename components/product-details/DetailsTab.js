import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProductAttributes } from '../../store/actions/productActions';

class DetailsTab extends Component {
    componentDidMount() {
        this.fetchAttributes();
    }

    componentDidUpdate(oldProps) {
        const { productDetail } = this.props;
        if(productDetail !== oldProps.productDetail) {
            this.fetchAttributes();
        }
    }

    fetchAttributes = () => {
        const { productDetail, getProductAttributes } = this.props;
        if(productDetail.variants && productDetail.variants.length > 0) {
            getProductAttributes(productDetail.variants[0].product.sku);
        } else {
            getProductAttributes(productDetail.sku);
        }
    }

    openTabSection = (evt, tabNmae) => {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabs_item");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("fadeInUp");
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByTagName("li");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace("current", "");
        }

        document.getElementById(tabNmae).style.display = "block";
        document.getElementById(tabNmae).className += " fadeInUp animated";
        evt.currentTarget.className += "current";
    }

    render() {
        const { productDetail, attributes, selectedVariant, getSpecificationOfSelectedVariant } = this.props;
        let variantSpecifications = {};
        if (selectedVariant) {
            variantSpecifications = getSpecificationOfSelectedVariant(selectedVariant);
        }
        
        return (
            <div className="col-lg-12 col-md-12">
                <div className="tab products-details-tab my-5">
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <ul className="tabs">
                                <li 
                                    onClick={(e) => {e.preventDefault(); this.openTabSection(e, 'tab1')}}
                                    className="current"
                                >
                                    <a href="#">
                                        <div className="dot"></div> SPECIFICATION
                                    </a>
                                </li>
                                
                                <li onClick={(e) => {e.preventDefault(); this.openTabSection(e, 'tab2')}}>
                                    <a href="#">
                                        <div className="dot"></div> DESCRIPTION
                                    </a>
                                </li>

                                <li onClick={(e) => {e.preventDefault(); this.openTabSection(e, 'tab3')}}>
                                    <a href="#">
                                        <div className="dot"></div> WASHING DISCLAIMER
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-lg-12 col-md-12">
                            <div className="tab_content">
                                <div id="tab1" className="tabs_item">
                                    <div className="products-details-tab-content">
                                        <div className="table-responsive">
                                            <table className="table table-striped specs-table">
                                                <tbody>
                                                    <tr>
                                                        <td>SKU:</td>
                                                        <td>{selectedVariant ? selectedVariant.product.sku : productDetail.sku}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Color:</td>
                                                        <td>{variantSpecifications.color ? variantSpecifications.color : attributes.color}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Content All:</td>
                                                        <td>{attributes.content_all}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Width:</td>
                                                        <td>{attributes.width} {attributes.width_cm && `/ ${attributes.width_cm} CM (+/-)`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Weight Classification:</td>
                                                        <td>{attributes.weight_classification}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Weight:</td>
                                                        <td>{attributes.weight_linear && `${attributes.weight_linear} Oz per Linear Yard`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Weight ( GSM / GM2 ):</td>
                                                        <td>{attributes.weight_gm && `${attributes.weight_gm} Grams per Square Meter`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Stretch:</td>
                                                        <td>{attributes.stretch}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Shrinkage:</td>
                                                        <td>{attributes.shrinkage}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Care Instructions:</td>
                                                        <td>{attributes.care_instructions}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div id="tab2" className="tabs_item">
                                    <div className="products-details-tab-content">
                                        { productDetail.description && <p>{productDetail.description.html}</p> }
                                    </div>
                                </div>

                                <div id="tab3" className="tabs_item">
                                    <div className="products-details-tab-content">
                                        <p>We recommend you check the shrinkage for your new fabric by washing and drying an 8" square using the same method and temperature as you intend for the garment you are making. FabricAndSewing.com cannot take responsibility for fabric shrinkage.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        attributes: state.productReducer.attributes
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProductAttributes: bindActionCreators(getProductAttributes, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsTab);
