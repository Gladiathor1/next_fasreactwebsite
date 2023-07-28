import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import Navbar from '../../../components/Layout/Navbar';
import AccountSidebar from '../../../components/Sidebar/AccountSidebar';
import Footer from '../../../components/Layout/Footer';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { validateText, validateCard, validateEmail, validatePassword } from '../../../utils/validations';
import { updateUser, changePassword } from '../../../store/actions/authActions';
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "react-loader-spinner";
class EditAccount extends Component {
    state = {
        firstname: '',
        lastname: '',
        email: '',
        currentPassword: '',
        changePassword: false,
        newpassword: '',
        confirmPassword: ''
    }

    componentDidUpdate(oldProps) {
        const { user } = this.props;
        if (oldProps.user !== user) {
            this.setState({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
            });
        }
    }

    changePassword = () => {
        this.setState(prevState => ({
            changePassword: !prevState.changePassword
        }));
    }

    updateAccountInfo = async (values) => {
        let { user, updateUser, changePassword } = this.props;
        user.firstname = values.firstname;
        user.lastname = values.lastname;
        user.email = values.email;
        this.setState({ loading: true });
        await updateUser({ customer: user });
        if (values.changePassword) {
            await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newpassword,
            })
        }
        toast.success("Account info updated successfully.", {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
        this.setState({ loading: false });
    }

    render() {
        const { user } = this.props;
        const { loading } = this.state;
        return (
            <React.Fragment>
                <Navbar />
                <div className="account-main">
                    <ToastContainer transition={Slide} />
                    <div className="container">
                        <div className="row">
                            <AccountSidebar />
                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <div className="account-information">
                                    <div className="page-title">
                                        <h1>Edit Account Information</h1>
                                    </div>
                                    <div className="box-account box-recent">
                                        <Formik initialValues={this.state}
                                            enableReinitialize
                                            validate={values => {
                                                const errors = {};
                                                if (this.state.changePassword === true) {
                                                    if (validatePassword(values.confirmPassword)) {
                                                        errors.confirmPassword = "Please enter secure and strong password";
                                                    } else if (values.newpassword != values.confirmPassword) {
                                                        errors.confirmPassword = "Password does not matched";
                                                    }
                                                }
                                                return errors;
                                            }}
                                            onSubmit={values => {
                                                this.updateAccountInfo(values);
                                            }}>
                                            {({ errors, touched, setFieldValue, handleBlur, isSubmitting }) => (
                                                <div className="card">
                                                    <div className="page-title">
                                                        <h1>ACCOUNT INFORMATION</h1>
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
                                                                        Email Address <span className="required">*</span>
                                                                    </label>
                                                                    <Field name="email" validate={validateEmail} className="form-control" />
                                                                    {errors.email && touched.email && <p className="help-block text-danger">{errors.email}</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-12 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Current Password <span className="required">*</span>
                                                                    </label>
                                                                    <Field name="currentPassword" validate={validatePassword} className="form-control" type="password" />
                                                                    {errors.currentPassword && touched.currentPassword && <p className="help-block text-danger">{errors.currentPassword}</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-12 col-md-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        <input type="checkbox" value="" onChange={this.changePassword} /> Change Password
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {this.state.changePassword === true &&
                                                            <div className="row">
                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="page-title">
                                                                        <h1>CHANGE PASSWORD</h1>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            New Password <span className="required">*</span>
                                                                        </label>
                                                                        <Field name="newpassword" validate={validatePassword} className="form-control" type="password" />
                                                                        {errors.newpassword && touched.newpassword && <p className="help-block text-danger">{errors.newpassword}</p>}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Confirm Password <span className="required">*</span>
                                                                        </label>
                                                                        <Field name="confirmPassword" onBlur={handleBlur} className="form-control" type="password" />
                                                                        {errors.confirmPassword && touched.confirmPassword && <p className="help-block text-danger">{errors.confirmPassword}</p>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className="row">
                                                            <div className="col-md-12 text-right">
                                                                <button type="submit" className={`btn btn-primary align-items-center`} disabled={loading}>
                                                                    {loading === true && <Loader type="TailSpin" color="#fff" height={20} width={20} />} Save
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

const mapStateToProps = state => {
    return {
        user: state.authReducer.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUser: bindActionCreators(updateUser, dispatch),
        changePassword: bindActionCreators(changePassword, dispatch),
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditAccount));