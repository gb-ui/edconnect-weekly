const DataModel = require('./data_model');

class User {
    constructor(id, firstname, lastname, email, password, matricNumber, program, graduationYear) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.matricNumber = matricNumber;
        this.program = program;
        this.graduationYear = graduationYear;
    }

    getFullName() {
        return `${this.firstname} ${this.lastname}`
    }
}

class Users extends DataModel {
    authenticate(email, password) {
        let response = false;
        this.data.forEach(user => {
            if (user.email === email && user.password === password) {
                response = true
            }
        })
        return response;
    }
    getByEmail(email) {
        let response = null;
        this.data.forEach(user => {
            if (user.email === email) {
                response = user;
            }
        })
        return response;
    }

    getByMatricNumber(matricNumber) {
        let response = null;
        this.data.forEach(user => {
            if (user.matricNumber === matricNumber) {
                response = user;
            }
        })
        return response;
    }

    validate(obj) {
        // this.errors.splice(0, this.errors.length);
        this.errors = []
        for (const key in obj) {
            if (obj[key] === '' || obj[key] === undefined || obj[key] === null) {
                this.errors.push(`${key} should not be empty.`)
            }
        }

        this.data.forEach(user => {
            if (user.email === obj.email) {
                this.errors.push("A user with specified email address already exists");
            }
            if (user.matricNumber === obj.matricNumber) {
                this.errors.push("A user with specified matric number already exists");
            }
        })

        if (obj.password.length < 7) {
            this.errors.push("Password should have at least 7 characters");
        }

        if (this.errors.length > 0) {
            return false;
        } else {
            return true;
        }
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    User,
    Users
};