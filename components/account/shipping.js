import React, { Component } from "react";
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import Loader from "react-loader-spinner";
import { states, caStates } from "../checkout/statesList";

const statesList = {
  "US": [...states],
  "CA": [...caStates]
};

class Shipping extends Component {
  state = {
    address: {
      region: {
        region: "Alabama",
        region_code: "AL",
        region_id: 1
      },
      region_id: 1,
      country_id: "US",
      street: "",
      postcode: "",
      city: "",
      telephone: "",
      firstname: "",
      lastname: ""
    }
  }

  componentDidMount() {
    this.updateState();
  }

  componentDidUpdate(oldProps) {
    const { user } = this.props;
    if(oldProps.user !== user) {
      this.updateState();
    }
  }

  updateState = () => {
    const { comp, user } = this.props;
    let address = {};
    if(user.addresses && user.addresses.length) {
      if(comp === "billing") {
        address = user.addresses.find(e => e.default_billing === true) || Object.assign({}, this.state.address);
      } else {
        address = user.addresses.find(e => e.default_shipping === true) || Object.assign({}, this.state.address);
      }
      address.street = typeof address.street === "object" ? address.street[0] : address.street;
    }
    if (Object.keys(address).length) {
      this.setState({ address });
    }
  }

  render() {
    const { comp, saveAddress, loading } = this.props;
    return (
      <section className="row shipping-address-section">
        <div className="col-12">
          <Formik initialValues={this.state.address} enableReinitialize onSubmit={values => {
            if(comp === "billing") {
              values.default_billing = true;
            } else {
              values.default_shipping  = true;
            }
            values.street = [values.street];
            let region = statesList[values.country_id];
            region = region.find(s => s.id === parseInt(values.region_id));
            let otherValues = {
              region: {
                region: region.name,
                region_code: region.code,
                region_id: region.id
              }
            }
            values = { ...values, ...otherValues};
            saveAddress(values);
          }}>
            {({ values }) => {
              return (
                <Form>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>First Name</label>
                        <Field type="text" name="firstname" className="form-control" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>Last Name</label>
                        <Field type="text" name="lastname" className="form-control" />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>Address</label>
                        <Field type="text" name="street" className="form-control" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>Phone Number</label>
                        <Field type="text" name="telephone" className="form-control"/>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>City</label>
                        <Field type="text" name="city" className="form-control" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>ZIP Code</label>
                        <Field type="text" name="postcode" className="form-control" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>State</label>
                        <Field as="select" className="form-control" name="region_id">
                          { statesList[values.country_id].map(state =>
                            <option key={state.id} value={state.id}>{state.name}</option>
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>Country</label>
                        <Field as="select" className="form-control" name="country_id">
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                        </Field>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary d-flex align-items-center" disabled={loading}>
                    { loading === true && <Loader type="TailSpin" color="#fff" height={20} width={20} /> } Save
                  </button>
                </Form>
              )
            }}
          </Formik>
        </div>
      </section>
    )
  }
}

const mapStateToProps = state => {
  return {
      user: state.authReducer.user,
  };
};

export default connect(mapStateToProps, null)(Shipping);
