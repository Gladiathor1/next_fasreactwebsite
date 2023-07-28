import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { shippingInfo, shippingMethod } from "../../store/actions/shipActions";

class ShippingMethod extends Component {
  state = {
    checked: ""
  }

  async componentDidMount() {
    const address = Object.assign({}, this.props.shipping_address);
    address.street = [""];
    await this.props.shippingMethod({ address });
  }

  componentDidUpdate(oldProps) {
    const { methods, updated } = this.props;

    if(methods !== oldProps.methods) {
      this.getShippingInfo(methods[0].method_code);
    }
    if(updated === true && updated !== oldProps.updated) {
      this.getShippingInfo(this.state.checked);
    }
  }

  handleChange = (e) => {
    this.getShippingInfo(e.target.value);
  }

  getShippingInfo = (method_code) => {
    const { methods, shippingInfo } = this.props;
    const carrier_code = methods.find(m => m.method_code === method_code);
    const payload = { addressInformation: this.setPayload(carrier_code ? carrier_code.carrier_code : "", method_code)}
    this.setState({ checked: method_code });

    shippingInfo(payload);
  }

  setPayload = (carrier_code, method_code) => {
    const { ship_address_id, bill_address_id, shippingAppartment, billingAppartment, same_address, handleUpdated, updated } = this.props;
    const shipping_address = Object.assign({}, this.props.shipping_address);
    const billing_address = Object.assign({}, this.props.billing_address);
    shipping_address.street = [shipping_address.street];
    billing_address.street = [billing_address.street];
    if(ship_address_id) {
      shipping_address.customerAddressId = ship_address_id;
    }
    if(bill_address_id) {
      billing_address.customerAddressId = bill_address_id
    }
    if(shippingAppartment) {
      shipping_address.street.push(shippingAppartment);
    }
    if(billingAppartment) {
      billing_address.street.push(billingAppartment);
    }
    if(!same_address) {
      billing_address.firstname = shipping_address.firstname,
      billing_address.lastname = shipping_address.lastname,
      billing_address.email = shipping_address.email,
      billing_address.telephone = shipping_address.telephone
    }

    const data = {
      shipping_address: shipping_address,
      billing_address: same_address ? shipping_address : billing_address,
      shipping_carrier_code: carrier_code,
      shipping_method_code: method_code
    }

    if(updated === true) {
      handleUpdated();
    }
    return data;
  }

  render() {
    const { methods } = this.props;
    const { checked } = this.state;
    return (
      <>
        <h3 className="title">Shipping Methods</h3>
        <section className="checkout-section mb-3">
          <ul>
            { methods.map(m =>
              <li key={m.method_code} className="d-flex align-items-center">
                <input
                  className="mr-2"
                  type="radio"
                  name="method"
                  value={m.method_code}
                  checked={checked === m.method_code}
                  onChange={this.handleChange}
                />
                <label className="no-flex m-0">
                  { m.carrier_title === m.method_title ?
                    `${m.carrier_title} | +$${parseFloat(m.price_incl_tax).toFixed(2)}`:
                    `${m.carrier_title}, ${m.method_title} | +$${parseFloat(m.price_incl_tax).toFixed(2)}`
                  }
                </label>
              </li>
            )}
          </ul>
        </section>
      </>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    methods: state.shipReducer.methods
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    shippingMethod: bindActionCreators(shippingMethod, dispatch),
    shippingInfo: bindActionCreators(shippingInfo, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShippingMethod);
