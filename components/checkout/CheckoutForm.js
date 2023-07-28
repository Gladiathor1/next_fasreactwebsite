import React, { Component } from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast, Slide } from "react-toastify";
import Loader from "react-loader-spinner";
import CreditCardInput from 'react-credit-card-input';
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import MaskedInput from 'react-text-mask';
import creditCardType from 'credit-card-type';

import OrderSummary from "./OrderSummary";
import { CCType } from "./CCType";
import { states, caStates } from "./statesList";
import PasswordModal from "../Modal/PasswordModal";
import ShippingMethod from "./ShippingMethods";
import { validateText, validateCard, validateEmail, validatePhone, validateCity, validatePostalCode, validateCVV } from '../../utils/validations';
import { shippingMethod, shippingInfo, processTransaction, customerCardToken } from "./../../store/actions/shipActions";
import { getUserDetail, findExistance } from "../../store/actions/authActions";

import "react-toastify/dist/ReactToastify.css";

class CheckoutForm extends Component {
  initialState = {
    region: "Alabama",
    region_code: "AL",
    country_id: "US",
    street: "",
    postcode: "",
    city: "",
    region_id: 1,
    firstname: "",
    lastname: "",
    email: "",
    telephone: ""
  };

  state = {
    shipping_address: this.initialState,
    billing_address: this.initialState,
    search: '',
    value: '',
    shippingApprtment: '',
    billingAppartment: '',
    payment_token: '',
    comment: '',
    shipping_search: '',
    billing_search: '',
    ship_address: '',
    bil_address: '',
    cardError: '',
    alert: '',
    customer_card: '',
    ship_address_id: '',
    bill_address_id: '',
    emailAddress: '',
    cardInfo: {
      month: '1',
      year: "2020",
      cardNumber: '',
      cardCode: '',
      expiry: ''
    },
    checkoutSubmitErrors: {},
    orderSummary: [],
    existing_cards: [],
    same_address: true,
    new_card: true,
    new_shipping: true,
    new_billing: false,
    loader: false,
    exist: false,
    getPassword: false,
    updated: false
  }

  componentDidMount() {
    const { customerCardToken, getUserDetail, user } = this.props;
    if (user && !user.email) {
      if (localStorage.getItem('authToken')) {
        getUserDetail();
      }
    }
    customerCardToken().then(data => {
      if (data.payload.customerPaymentTokens) {
        let items = data.payload.customerPaymentTokens.items;
        items.forEach((item, index) => {
          items[index].details = JSON.parse(item.details);
        })
        this.setState({ existing_cards: items })
      }
    })
  }

  handleSubmit = async () => {
    this.setState({ loader: true });
    if (this.state.new_shipping === false) {
      const existShipAddress = this.props.user.addresses.find(address => address.id == this.state.ship_address_id);
      const shippingAddress = this.state.shipping_address;
      shippingAddress.street = existShipAddress.street[0];
      shippingAddress.firstname = existShipAddress.firstname;
      shippingAddress.lastname = existShipAddress.lastname;
      shippingAddress.email = this.props.user.email;
      shippingAddress.city = existShipAddress.city;
      shippingAddress.postcode = existShipAddress.postcode;
      shippingAddress.region_code = existShipAddress.region.region_code;
      shippingAddress.telephone = existShipAddress.telephone;
      shippingAddress.region_id = existShipAddress.region.region_id;
      shippingAddress.country_id = existShipAddress.country_id;
      shippingAddress.region = existShipAddress.region.region;
      this.setState({ shipping_address: shippingAddress  });
    }
    let AcceptError = false;
    const Accept = window.Accept;
    let secureData = {}, cardData = {}, authData = {};

    if (this.state.same_address == true) {
      this.setState({
        billing_address: { ...this.state.shipping_address }
      })
    } else {
      if (this.state.new_billing === false) {
        const existBillingAddress = this.props.user.addresses.find(address => address.id == this.state.bill_address_id);
        const billingAddress = this.state.billing_address;
        billingAddress.street = existBillingAddress.street[0];
        billingAddress.firstname = existBillingAddress.firstname;
        billingAddress.lastname = existBillingAddress.lastname;
        billingAddress.email = this.props.user.email;
        billingAddress.city = existBillingAddress.city;
        billingAddress.postcode = existBillingAddress.postcode;
        billingAddress.region_code = existBillingAddress.region.region_code;
        billingAddress.telephone = existBillingAddress.telephone;
        billingAddress.region_id = existBillingAddress.region.region_id;
        billingAddress.country_id = existBillingAddress.country_id;
        billingAddress.region = existBillingAddress.region.region;
        this.setState({ billing_address: billingAddress });
      }
    }
    const cNum = this.state.cardInfo.cardNumber.replace(/ /g, '');
    const month = this.state.cardInfo.month.replace(/ /g, '');
    cardData.cardNumber = cNum;
    cardData.month = month;
    cardData.year = this.state.cardInfo.year.toString().slice(-2);
    cardData.zip = this.state.billing_address.postcode;
    cardData.cardCode = this.state.cardInfo.cardCode;
    authData.clientKey = process.env.AUTH_CLIENTKEY;
    authData.apiLoginID = process.env.AUTH_LOGINID;
    secureData.cardData = cardData;
    secureData.authData = authData;
    let checkoutSubmitErrors = {};
    if (this.state.new_card === true) {
      Accept.dispatchData(secureData, (response) => {
        if (response.messages.resultCode === 'Error') {
          for (var i = 0; i < response.messages.message.length; i++) {
            checkoutSubmitErrors[response.messages.message[i].code] = response.messages.message[i].text;
          }
          this.setState({ checkoutSubmitErrors });
          this.setState({ loader: false });
          AcceptError = true;
          return;
        }
        this.setState({
          payment_token: response.opaqueData.dataValue
        }, () => {
          const shippingRegion = states.find(x => x.code === this.state.shipping_address.region_code);
          this.setState(prevState => ({
            shipping_address: {
              ...prevState.shipping_address,
              region: shippingRegion.name
            }
          }))
          const billingRegion = states.find(x => x.code === this.state.billing_address.region_code);
          this.setState(prevState => ({
            billing_address: {
              ...prevState.billing_address,
              region: billingRegion.name
            }
          }))
          const billingPhone = this.state.shipping_address.telephone
          this.setState(prevState => ({
            billing_address: {
              ...prevState.billing_address,
              telephone: billingPhone
            }
          }))
          this.placeOrder();
        })
      });
    }
  }

  handleSameOrDifferentAddressChange = (event) => {
    event.target.value === "same_address" ? this.setState({
      same_address: true,
      new_billing: false
    }) : this.setState({
      same_address: false,
      new_billing: true
    });
  }

  handleSameOrDifferentCard = (event) => {
    event.target.value === "new_card" ? this.setState({
      new_card: true
    }) : this.setState({
      new_card: false
    });
    this.setState({ customer_card: event.target.value })
  }

  handleNewOrExistingShippingAddress = (event) => {
    event.target.value === "new_address" ? this.setState({
      new_shipping: true
    }) : this.setState({
      new_shipping: false,
      ship_address_id: event.target.value 
    });

    this.handleUpdated();
  }

  handleNewOrExistingBillingAddress = (event) => {
    event.target.value === "new_address" ? this.setState({
      new_billing: true
    }) : this.setState({
      new_billing: false,
      bill_address_id: event.target.value
    });

    this.handleUpdated();
  }

  placeOrder = () => {
    const { processTransaction } = this.props;
    const billing_address = Object.assign({}, this.state.billing_address);
    billing_address.street = [billing_address.street];
    const cc_number = this.state.cardInfo.cardNumber;
    const cc_type = creditCardType(this.state.cardInfo.cardNumber.replace(/ /g, ''))[0].type;
    let additional_data;
    if (this.state.new_card == true) {
      additional_data = {
        cc_id: "0",
        cc_type: CCType(cc_type),
        cc_exp_year: `20${this.state.cardInfo.year.replace(/ /g, '')}`,
        cc_exp_month: this.state.cardInfo.month.replace(/ /g, ''),
        cc_save: "1",
        opaque_number: cc_number.slice(cc_number.length - 4),
        opaque_descriptor: "COMMON.ACCEPT.INAPP.PAYMENT",
        opaque_value: this.state.payment_token,
      };
    } else {
      additional_data = {
        cc_id: this.state.customer_card
      }
    }
    const obj = {
      email: billing_address.email,
      paymentMethod: {
        method: "iwd_authcim",
        additional_data: additional_data,
        extension_attributes: {
          order_comment: this.state.comment
        }
      },
      billing_address: billing_address
    }
    if (this.state.new_shipping === false || this.state.same_address === false && this.state.new_billing === false) {
      obj.billing_address.customerAddressId = this.state.ship_address_id ? this.state.ship_address_id : this.state.bill_address_id;
    }
    processTransaction(obj)
      .then((response) => {
        localStorage.removeItem("cartID");
        this.confirmOrder(response.payload);
        this.setState({ loader: false });
      })
      .catch(err => {
        toast.error("Transaction declined", {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        this.setState({ loader: false });
      })
  }

  confirmOrder = (id) => {
    const { router } = this.props;
    toast.success("Order has been confirmed", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });

    router.push(`/thankyou?order=${id}`);
  }

  findEmail = async (e) => {
    const { findExistance, user } = this.props;
    if(!user.email) {
      const { target: { value } } = e;
      const available = await findExistance(value);
      this.setState({ exist: !available.payload, emailAddress: value });
    }
  }

  handlePassword = () => {
    this.setState({ getPassword: !this.state.getPassword })
  }

  handleUpdated = () => {
    this.setState(prevState => ({ updated: !prevState.updated }))
  }

  render() {
    const { user } = this.props;
    const { shipping_search, billing_search, ship_address, bil_address, existing_cards, exist, getPassword, emailAddress } = this.state;

    return (
      <section className="checkout-area ptb-20">
        <ToastContainer transition={Slide} />
        <div className="container">
          <Formik
            initialValues={this.state}
            validate={values => {
              const errors = {};
              if (this.state.new_shipping === true && !values.shipping_address.street) {
                errors.ship_address = 'The field is required';
              }
              if (this.state.new_billing === true && this.state.same_address === false && !values.billing_address.street) {
                errors.bil_address = 'The field is required';
              }
              if (this.state.new_card === true) {
                if (validateCard(values.cardInfo.cardNumber) || validateCVV(values.cardInfo.cardCode) || !values.cardInfo.year) {
                  errors.cardError = "This is not valid card";
                } else if (values.cardInfo.year < 20) {
                  errors.cardError = "Expiry year cannot be in the past";
                }
              }
              return errors;
            }}
            onSubmit={values => {
              if (values.shipping_address.street.indexOf("Appartment no:") === -1) {
                values.shipping_address.street = `${values.shipping_address.street}${values.shippingApprtment ? `, Appartment no: ${values.shippingApprtment}` : ""}`;
                values.billing_address.street = `${values.billing_address.street}${values.billingAppartment ? `, Appartment no: ${values.billingAppartment}` : ""}`;
              }
              values.ship_address = this.state.ship_address;
              values.bil_address = this.state.bil_address;
              values.existing_cards = this.state.existing_cards;
              values.new_card = this.state.new_card;
              values.new_billing = this.state.new_billing;
              values.new_shipping = this.state.new_shipping;
              values.bill_address_id = this.state.bill_address_id;
              values.ship_address_id = this.state.ship_address_id;
              values.customer_card = this.state.customer_card;
              values.same_address = this.state.same_address;
              this.setState(values);
              this.handleSubmit();
            }} >
            {({ errors, touched, setFieldValue, handleBlur, values }) => {
              let shipStates = values.shipping_address.country_id === "CA" ? caStates : states;
              let billStates = values.billing_address.country_id === "CA" ? caStates : states;
              return (
                <Form ref={this.inputRef}>
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <div className="billing-details">
                        <h3 className="title">Shipping Address</h3>
                        <div className="row">
                          <div className="col-lg-12 col-md-6">
                            <div className="form-group">
                              <select className="form-control" onChange={this.handleNewOrExistingShippingAddress}>
                                <option value="new_address">New Address</option>
                                {this.props.user.addresses && this.props.user.addresses.map((address) =>
                                  <option key={address.id} value={address.id}>{address.street[0] + ', ' + address.city + ', ' + address.region.region_code}</option>
                                )}
                              </select>
                            </div>
                          </div>
                        </div>
                        {this.state.new_shipping === true &&
                        <>
                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                First Name <span className="required">*</span>
                              </label>
                              <Field name="shipping_address.firstname" validate={validateText} className="form-control" />
                              {errors.shipping_address && touched.shipping_address && touched.shipping_address.firstname && errors.shipping_address.firstname && <p className="help-block text-danger">{errors.shipping_address.firstname}</p>}
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                Last Name <span className="required">*</span>
                              </label>
                              <Field name="shipping_address.lastname" validate={validateText} className="form-control" />
                              {errors.shipping_address && touched.shipping_address && touched.shipping_address.lastname && errors.shipping_address.lastname && <p className="help-block text-danger">{errors.shipping_address.lastname}</p>}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                Email <span className="required">*</span>
                              </label>
                              <Field name="shipping_address.email" validate={validateEmail} className="form-control" onBlur={this.findEmail} />
                              {!user.email && exist && <p>It seems you already have an account with us. Do you want to <a onClick={this.handlePassword}><b style={{ color: "#3954a5" }}>Login</b></a>?</p>}
                              {errors.shipping_address && touched.shipping_address && touched.shipping_address.email && errors.shipping_address.email && <p className="help-block text-danger">
                                {errors.shipping_address.email}</p>}
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                Phone <span className="required">*</span>
                              </label>
                              <Field name={`shipping_address.telephone`} validate={validatePhone}>
                                {({ field }) => (
                                    <MaskedInput mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                      {...field}
                                      id={`shipping_address.telephone`}
                                      className="form-control"
                                    />
                                  )}
                              </Field>
                              {errors.shipping_address && touched.shipping_address && touched.shipping_address.telephone && errors.shipping_address.telephone && <p className="help-block text-danger">
                                {errors.shipping_address.telephone}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 col-md-6">
                            <div className="form-group">
                              <label>
                                Address <span className="required">*</span>
                              </label>
                              <ReactGoogleMapLoader
                                params={{
                                  key: process.env.GOOGLE_API_KEY,
                                  libraries: "places,geocode",
                                }}
                                render={googleMaps =>
                                  googleMaps && (
                                    <ReactGooglePlacesSuggest
                                      googleMaps={googleMaps}
                                      autocompletionRequest={{
                                        input: shipping_search,
                                      }}
                                      onSelectSuggest={geocodedPrediction => {
                                        let address = '';
                                        this.setState({
                                          shipping_search: "",
                                          ship_address: "",
                                        });
                                        geocodedPrediction.address_components.forEach(item => {
                                          if(item.types[0] === "country") {
                                            setFieldValue("shipping_address.country_id", item.short_name)
                                          }
                                          if (item.types[0] == "administrative_area_level_1") {
                                            let state = states.find(state => state.code == item.short_name);
                                            if(!state) {
                                              state = caStates.find(state => state.code == item.short_name);
                                            }
                                            if (state) {
                                              setFieldValue('shipping_address.region_code', item.short_name);
                                              setFieldValue('shipping_address.region', state.name);
                                              setFieldValue('shipping_address.region_id', state.id);
                                            }
                                          }
                                          if (item.types[0] == "locality") {
                                            setFieldValue('shipping_address.city', item.short_name)
                                          }
                                          if (item.types[0] == "postal_code") {
                                            setFieldValue('shipping_address.postcode', item.short_name)
                                          }
                                          if (item.types[0] == "street_number" || item.types[0] == "premise") {
                                            address = item.long_name;
                                          }
                                          if (item.types[0] == "route" || item.types[0] == "political") {
                                            address = address + ' ' + item.long_name;
                                          }
                                        })
                                        this.setState({
                                          ship_address: address,
                                        });
                                        setFieldValue('shipping_address.street', address);
                                        this.handleUpdated();
                                      }}
                                      textNoResults="No results"
                                      customRender={prediction => (
                                        <div className="customWrapper">
                                          {prediction
                                            ? prediction.description
                                            : "No results"}
                                        </div>
                                      )}
                                    >
                                      <input
                                        type="text"
                                        name="ship_address"
                                        className="form-control"
                                        value={ship_address}
                                        onBlur={handleBlur}
                                        autoComplete="none"
                                        onChange={e => {
                                          var value = e.target.value;
                                          this.setState({ shipping_search: value, ship_address: value })
                                          setFieldValue('shipping_address.street', value)
                                        }}
                                      />
                                      {errors.ship_address && touched.ship_address && <p className="help-block text-danger"> {errors.ship_address}</p>}
                                    </ReactGooglePlacesSuggest>
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>Appartment No.</label>
                              <Field name="shippingApprtment" id="apartment" className="form-control" onBlur={this.handleUpdated} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                City <span className="required">*</span>
                              </label>
                              <Field name="shipping_address.city" validate={validateCity} className="form-control" onBlur={this.handleUpdated} />
                              {errors.shipping_address && touched.shipping_address && touched.shipping_address.city && errors.shipping_address.city && <p className="help-block text-danger">
                                {errors.shipping_address.city}</p>}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                Postcode / Zip <span className="required">*</span>
                              </label>
                              <Field name="shipping_address.postcode" validate={validatePostalCode} className="form-control" onBlur={this.handleUpdated} />
                              {errors.shipping_address && touched.shipping_address && touched.shipping_address.postcode && errors.shipping_address.postcode && <p className="help-block text-danger">
                                {errors.shipping_address.postcode}</p>}
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                State <span className="required">*</span>
                              </label>
                              <Field as="select" name="shipping_address.region_code" className="form-control" onBlur={this.handleUpdated}>
                                {shipStates.map(e =>
                                  <option key={e.code} value={e.code}>{e.code}</option>
                                )}
                              </Field>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                Country <span className="required">*</span>
                              </label>
                              <Field as="select" name="shipping_address.country_id" className="form-control" onBlur={this.handleUpdated} onChange={(e) => {
                                setFieldValue("shipping_address.country_id", e.target.value)
                                setFieldValue("shipping_address.region", shipStates[0].name);
                                setFieldValue("shipping_address.region_id", shipStates[0].id);
                                setFieldValue("shipping_address.region_code", shipStates[0].code);
                              }}>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                              </Field>
                            </div>
                          </div>
                        </div>
                        </>}
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                      <ShippingMethod
                        shipping_address={values.shipping_address}
                        billing_address={values.billing_address}
                        shippingAppartment={values.shippingApprtment}
                        billingAppartment={values.billingAppartment}
                        same_address={this.state.same_address}
                        updated={this.state.updated}
                        ship_address_id={this.state.ship_address_id}
                        bill_address_id={this.state.bill_address_id}
                        handleUpdated={this.handleUpdated}
                      />
                      <div className="credit-card-form billing-details">
                        <h3 className="title">Add Your Credit Card</h3>
                          {existing_cards.length > 0 &&
                          <div className="">
                            <div className="card-details">
                              <div className="form-group">
                                <select className="form-control" onChange={this.handleSameOrDifferentCard}>
                                  <option key="new_card" value="new_card">New Credit Card</option>
                                  {existing_cards.map(card =>
                                    <option key={card.public_hash} value={card.public_hash}>{card.details.maskedCC + ` (${card.details.type})`}</option>
                                  )}
                                </select>
                              </div>
                            </div>
                          </div>
                          }
                          
                        {this.state.new_card &&
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <CreditCardInput
                                  cardCVCInputProps={{
                                    onChange: e => setFieldValue('cardInfo.cardCode', e.target.value),
                                  }}
                                  cardExpiryInputProps={{
                                    onChange: e => {
                                      let expiry = e.target.value;
                                      let value = expiry.split('/');
                                      setFieldValue('cardInfo.expiry', e.target.value);
                                      setFieldValue('cardInfo.month', value[0]);
                                      if (value[1]) {
                                        setFieldValue('cardInfo.year', value[1]);
                                      }
                                    },
                                  }}
                                  cardNumberInputProps={{
                                    onChange: e => setFieldValue('cardInfo.cardNumber', e.target.value),
                                  }}
                                  dangerTextClassName="text-danger"
                                  inputClassName="form-control"
                                  containerClassName="custom-card-wrapper"
                                />
                                {
                                  errors.cardError &&
                                  <p className="help-block text-danger"> {errors.cardError} </p>
                                }
                              </div>
                            </div>
                          </div>
                        }

                        <div className="row">
                          {this.state.checkoutSubmitErrors && this.state.checkoutSubmitErrors.hasOwnProperty('E_WC_08')
                            && <p className="help-block text-danger">{this.state.checkoutSubmitErrors.E_WC_08}</p>}
                        </div>

                        <div className="">
                          <div className="billing-details">
                            <h3 className="title">Billing Details</h3>
                            <div>
                              <ul className="select-address">
                                <li className="d-flex align-items-center">
                                    <input
                                      type="radio"
                                      name="radio"
                                      value="same_address"
                                      checked={this.state.same_address === true}
                                      onChange={this.handleSameOrDifferentAddressChange}
                                    />
                                  <label className="no-flex m-0">Same as shipping address</label>
                                </li>
                                <li className="d-flex align-items-center my-2">
                                    <input
                                      type="radio"
                                      name="radio"
                                      value="different_address"
                                      checked={this.state.same_address !== true}
                                      onChange={this.handleSameOrDifferentAddressChange}
                                    />
                                  <label className="no-flex m-0">Use a different billing address</label>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {!this.state.same_address && 
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <select className="form-control" onChange={this.handleNewOrExistingBillingAddress}>
                                    <option value="new_address">New Address</option>
                                    {this.props.user.addresses && this.props.user.addresses.map((address) =>
                                      <option key={address.id} value={address.id}>{address.street[0] + ', ' + address.city + ', ' + address.region.region_code}</option>
                                    )}
                                  </select>
                                </div>
                              </div>
                            </div>
                            }
                          { this.state.new_billing === true &&
                            <>
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>
                                    First Name <span className="required">*</span>
                                  </label>
                                  <Field name="billing_address.firstname" validate={validateText} className="form-control" />
                                  {errors.billing_address && touched.billing_address && touched.billing_address.firstname && errors.billing_address.firstname && <p className="help-block text-danger">
                                    {errors.billing_address.firstname}</p>}
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>
                                    Last Name <span className="required">*</span>
                                  </label>
                                  <Field name="billing_address.lastname" validate={validateText} className="form-control" />
                                  {errors.billing_address && touched.billing_address && touched.billing_address.lastname && errors.billing_address.lastname && <p className="help-block text-danger">
                                    {errors.billing_address.lastname}</p>}
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>
                                    Email <span className="required">*</span>
                                  </label>
                                  <Field name="billing_address.email" validate={validateEmail} className="form-control" />
                                  {errors.billing_address && touched.billing_address && touched.billing_address.email && errors.billing_address.email && <p className="help-block text-danger">
                                    {errors.billing_address.email}</p>}
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>
                                    Phone <span className="required">*</span>
                                  </label>
                                  <Field name={`billing_address.telephone`} validate={validatePhone}>
                                    {({ field }) => (
                                        <MaskedInput mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                          {...field}
                                          id={`billing_address.telephone`}
                                          className="form-control"
                                        />
                                      )}
                                  </Field>
                                  {errors.billing_address && touched.billing_address && touched.billing_address.telephone && errors.billing_address.telephone && <p className="help-block text-danger">
                                    {errors.billing_address.telephone}</p>}
                                </div>
                              </div>
                              
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>
                                    Address <span className="required">*</span>
                                  </label>
                                  <ReactGoogleMapLoader
                                    params={{
                                      key: process.env.GOOGLE_API_KEY,
                                      libraries: "places,geocode",
                                    }}
                                    render={googleMaps =>
                                      googleMaps && (
                                        <ReactGooglePlacesSuggest
                                          googleMaps={googleMaps}
                                          autocompletionRequest={{
                                            input: billing_search,
                                          }}
                                          onSelectSuggest={geocodedPrediction => {
                                            let address = '';
                                            this.setState({
                                              billing_search: "",
                                              bil_address: ""
                                            });
                                            geocodedPrediction.address_components.forEach(item => {
                                              if(item.types[0] === "country") {
                                                setFieldValue("billing_address.country_id", item.short_name)
                                              }
                                              if (item.types[0] == "administrative_area_level_1") {
                                                let state = states.find(state => state.code == item.short_name);
                                                if(!state) {
                                                  state = caStates.find(state => state.code == item.short_name);
                                                }
                                                if (state) {
                                                  setFieldValue('billing_address.region_code', item.short_name);
                                                  setFieldValue('billing_address.region', state.name);
                                                  setFieldValue('billing_address.region_id', state.id);
                                                }
                                              }
                                              if (item.types[0] == "locality") {
                                                setFieldValue('billing_address.city', item.short_name)
                                              }
                                              if (item.types[0] == "postal_code") {
                                                setFieldValue('billing_address.postcode', item.short_name)
                                              }
                                              if (item.types[0] == "street_number" || item.types[0] == "premise") {
                                                address = item.long_name;
                                              }
                                              if (item.types[0] == "route" || item.types[0] == "political") {
                                                address = address + ' ' + item.long_name;
                                              }
                                            })
                                            this.setState({
                                              bil_address: address
                                            });
                                            setFieldValue('billing_address.street', address);
                                            this.handleUpdated();
                                          }}
                                          textNoResults="No results"
                                          customRender={prediction => (
                                            <div className="customWrapper">
                                              {prediction
                                                ? prediction.description
                                                : "No results"}
                                            </div>
                                          )}
                                        >
                                          <input
                                            type="text"
                                            name="bil_address"
                                            className="form-control"
                                            value={bil_address}
                                            onBlur={handleBlur}
                                            autoComplete="none"
                                            onChange={e => {
                                              var value = e.target.value;
                                              this.setState({ billing_search: value, bil_address: value })
                                              setFieldValue('billing_address.street', value)
                                            }}
                                          />
                                          {errors.bil_address && touched.bil_address && <p className="help-block text-danger"> {errors.bil_address}</p>}
                                        </ReactGooglePlacesSuggest>
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>Appartment No.</label>
                                  <Field name="billingAppartment" id="billing_apartment" className="form-control" onBlur={this.handleUpdated} />
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>
                                    City <span className="required">*</span>
                                  </label>
                                  <Field name="billing_address.city" validate={validateCity} className="form-control" onBlur={this.handleUpdated} />
                                  {errors.billing_address && touched.billing_address && touched.billing_address.city && errors.billing_address.city && <p className="help-block text-danger">
                                    {errors.billing_address.city}</p>}
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>
                                    Postcode / Zip <span className="required">*</span>
                                  </label>
                                  <Field name="billing_address.postcode" validate={validatePostalCode} className="form-control" onBlur={this.handleUpdated} />
                                  {errors.billing_address && touched.billing_address && touched.billing_address.postcode && errors.billing_address.postcode && <p className="help-block text-danger">
                                    {errors.billing_address.postcode}</p>}
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>
                                    State <span className="required">*</span>
                                  </label>
                                  <div className="select-box">
                                    <Field as="select" name="billing_address.region_code" className="form-control" onBlur={this.handleUpdated}>
                                      {billStates.map(e =>
                                        <option key={e.code} value={e.code}>{e.code}</option>
                                      )}
                                    </Field>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>
                                    Country <span className="required">*</span>
                                  </label>
                                  <Field as="select" name="billing_address.country_id" className="form-control" onBlur={this.handleUpdated} onChange={(e) => {
                                    setFieldValue("billing_address.country_id", e.target.value)
                                    setFieldValue("billing_address.region", billStates[0].name);
                                    setFieldValue("billing_address.region_id", billStates[0].id);
                                    setFieldValue("billing_address.region_code", billStates[0].code);
                                  }}>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                  </Field>
                                </div>
                              </div>
                            </div>
                            </>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="order-details">
                        <h3 className="title">Your Order</h3>
                        <OrderSummary orderSummary={this.props.orderSummary} checkoutNotAllowed={this.props.checkoutNotAllowed} />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-lg-12 col-md-12">
                      <button type="submit" className={`btn btn-primary w-100`} disabled={this.state.loader === true}>
                        {this.state.loader === true ?
                          <Loader type="TailSpin" color="#fff" height={25} width={25} /> :
                          <>Submit</>
                        }
                      </button>
                    </div>
                  </div>

                </Form>
              )
            }}
          </Formik>

        </div>
        { getPassword && <PasswordModal emailAddress={emailAddress} handlePassword={this.handlePassword} />}
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    total: state.cartReducer.total,
    shipping: state.cartReducer.shipping,
    user: state.authReducer.user,
    orderSummary: state.shipReducer.orderSummary
  };
};

const mapDispatchToProps = dispatch => {
  return {
    shippingInfo: bindActionCreators(shippingInfo, dispatch),
    shippingMethod: bindActionCreators(shippingMethod, dispatch),
    processTransaction: bindActionCreators(processTransaction, dispatch),
    customerCardToken: bindActionCreators(customerCardToken, dispatch),
    getUserDetail: bindActionCreators(getUserDetail, dispatch),
    findExistance: bindActionCreators(findExistance, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CheckoutForm));
