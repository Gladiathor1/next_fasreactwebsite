import validator from 'validator';

export function validateText(value) {
    let error;
    if (validator.isEmpty(value)) {
        error = "The field is required";
    } else if (!value.match(/^[a-zA-Z ]*$/)) {
        error = "Should contain only Alphabets";
    }
    return error;
}

export function validateCard(value) {
    let error;
    if (validator.isEmpty(value)) {
        error = "The field is required";
    } else if (!validator.isCreditCard(value)) {
        error = "This is not valid card";
    } else {
        error = "";
    }
    return error;
}

export function validateEmail(value) {
    let error;
    if (validator.isEmpty(value)) {
        error = "The field is required";
    } else if (!validator.isEmail(value)) {
        error = "This is not a valid email-id";
    }
    return error;
}

export function validatePhone(value) {
    let error;
    if (validator.isEmpty(value)) {
        error = "The field is required";
    } else if (!validator.isMobilePhone(value)) {
        error = "This is not valid telephone number";
    }
    return error;
}

export function validateAddress(value) {
    let error;
    if (validator.isEmpty(value)) {
        error = "The field is required";
    }
    return error;
}

export function validateCity(value) {
    let error;
    if (validator.isEmpty(value)) {
        error = "The field is required";
    }
    return error;
}

export function validatePostalCode(value) {
    let error;
    if (validator.isEmpty(value)) {
        error = "The field is required";
    }
    return error;
}

export function validateCVV(value) {
    let error;
    value = value.replace('_', '');
    if (validator.isEmpty(value)) {
        error = "The field is required";
    } else if (!validator.isLength(value, {
            min: 3,
            max: 4
        })) {
        error = "This is not valid cvv";
    }
    return error;
}

export function validatePassword(value) {
    let error;
    if (!value.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
        error = "Please enter secure and strong password";
    }
    return error;
}

export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];