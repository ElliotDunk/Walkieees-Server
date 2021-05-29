"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const LETTERS_NUMBERS_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
const NAME_REGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
function validate({ email, password, confirmPassword, firstName, lastName, DOB, terms }) {
    if (email && (email.length <= 0 || !EMAIL_REGEX.test(email)))
        return false;
    if (password && (password.length < 8 || !LETTERS_NUMBERS_REGEX.test(password)))
        return false;
    if (password && confirmPassword && password !== confirmPassword)
        return false;
    if (firstName && !NAME_REGEX.test(firstName))
        return false;
    if (lastName && !NAME_REGEX.test(lastName))
        return false;
    const minAgeDate = Date.now() - 504910816000; //16 Years Ago From Today
    if (DOB && (DOB.length <= 0 || minAgeDate < Date.parse(DOB)))
        return false;
    if (terms && terms !== "true")
        return false;
    return true;
}
exports.default = validate;
