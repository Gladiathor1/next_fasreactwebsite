import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Navbar from '../../../components/Layout/Navbar';
import AccountSidebar from '../../../components/Sidebar/AccountSidebar';
import Footer from '../../../components/Layout/Footer';
import { Formik, Form, Field } from 'formik';
import { validateText, validateCard, validateEmail, validatePassword } from '../../../utils/validations';
import { states } from "../../../components/checkout/statesList";

class NewAddress extends Component {
    state = {
        
    }

    render() {
        return (
            <React.Fragment>
                <Navbar />
                <div className="account-main">
                    <div className="container">
                        <div className="row">
                            <AccountSidebar />
                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <div className="account-information">
                                    <div className="page-title">
                                        <h1>Add New Address</h1>
                                    </div>
                                    <div className="box-account box-recent">
                                        <Formik initialValues={this.state}
                                            validate={values => {
                                                const errors = {};
                                                return errors;
                                            }}
                                        >
                                            {({ errors, touched, setFieldValue, handleBlur, isSubmitting }) => (
                                                <div className="card">
                                                    <div className="page-title">
                                                        <h1>CONTACT INFORMATION</h1>
                                                    </div>
                                                    <Form ref={this.inputRef}>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        First Name <span className="required">*</span>
                                                                    </label>
                                                                    <Field name="firstname" validate={validateText} className="form-control" />
                                                                    {errors.firstname && touched.firstname && <p className="help-block text-danger">{errors.firstname}</p>}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Last Name <span className="required">*</span>
                                                                    </label>
                                                                    <Field name="lastname" validate={validateText} className="form-control" />
                                                                    {errors.lastname && touched.lastname && <p className="help-block text-danger">{errors.lastname}</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-12 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Company
                                                                    </label>
                                                                    <Field name="company" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Telephone <span className="required">*</span>
                                                                    </label>
                                                                    <Field name="telephone" className="form-control" />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Fax
                                                                    </label>
                                                                    <Field name="fax" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-12 col-md-12">
                                                                <div className="page-title">
                                                                    <h1>ADDRESS</h1>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Street Address <span className="required">*</span>
                                                                    </label>
                                                                    <Field name="street_address" className="form-control" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <Field name="street_address2" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        City <span className="required">*</span>
                                                                    </label>
                                                                    <Field name="city" className="form-control" />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        State/Province <span className="required">*</span>
                                                                    </label>
                                                                    {/* <Field name="state" className="form-control" /> */}
                                                                    <Field as="select" name="state" className="form-control">
                                                                        {states.map(e =>
                                                                            <option key={e.code} value={e.code}>{e.name}</option>
                                                                        )}
                                                                    </Field>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Zip/Postal Code <span className="required">*</span>
                                                                    </label>
                                                                    <Field name="zip_code" className="form-control" />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Country <span className="required">*</span>
                                                                    </label>
                                                                    <Field name="country" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-12 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        <input type="checkbox" value="default_billing_address" /> Use as my default billing address
                                                                    </label>
                                                                    <br />
                                                                    <label>
                                                                        <input type="checkbox" value="default_shipping_address" /> Use as my default shipping address
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12 text-right">
                                                                <button type="submit" className={`btn btn-primary`}>
                                                                    Save Address
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                </div>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}

export default withRouter((NewAddress));