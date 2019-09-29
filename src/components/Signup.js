import React from 'react'
import styles from '../styles/login.module.css' // Import css modules stylesheet as styles
import Axios from 'axios';
import Loading from './Loading'
import {AuthContext} from '../authenticationContext';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            loading: false,
            username: '',
            email: '',
            password1: '',
            password2: '',
            errors: {},
            registerFailed: {
                status: false,
                message: []  // message coming from the web service if login fails
            },
            registerSucceed: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
        this.handleElementValidation = this.handleElementValidation.bind(this);
    }
    componentDidMount() {
        console.log(process.env.REACT_APP_SIGNUP_URI);
        this.redirect(); // if user has been authenticated.
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        new Promise((resolve,reject) => {
            this.setState({
                [name]: value
                });

            resolve();
        }).then(this.handleElementValidation(event))
        .catch(err => {
            console.error(err);
        })
    }
  
    handleRegisterSubmit(event) {
        event.preventDefault();
        if(this.formValidation()) { // form is valid.
            this.setState({loading: true});
            const loginData = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password1
            };
            console.log(process.env.REACT_APP_SIGNUP_URI);
            Axios.post(process.env.REACT_APP_SIGNUP_URI,loginData)
            .then(response => {
                console.log(response);
                this.registerSuccessfully(response.data);
            }).catch((err,response) => {
                console.error(err);
                if(err.response) // response dönerse
                    console.log(err.response.data);
                this.clearForm();
                this.registerFailed(err.response.data) // tüm hata arrayini yolluyorum 
            })
        }
    }
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    handleElementValidation(event) {
        const name = event.target.name;
        const value = event.target.value;
        const errors = {...this.state.errors};
        errors[name] = ''; // hatayı sıfırla
        if(name === 'username') {
            console.log('ALP');
            if(!value) {
                errors[name] = 'Kullanıcı adınızı giriniz'
            }
        } 
        else if(name === 'email') {
            if(!value || !this.validateEmail(value)) {
                errors[name] =  'Geçerli bir mail adresi giriniz';
            }
        }
        else if(name === 'password1') {
            if(!value || value.length < 8) {
                errors[name] = 'Minimum 8 karakterden oluşan bir parola giriniz'
           }
        }
        else if(name === 'password2') {
            if(!value || value.length < 8) {
                errors[name] = 'Minimum 8 karakterden oluşan bir parola giriniz'
           }
        }
        this.setState({errors});
    }
    formValidation() {
        let errors = {};
        let formIsValid = true;
        if(!this.state.username) {
            errors['username'] = 'Kullanıcı adınızı giriniz'
        }
        if(!this.state.email || !this.validateEmail(this.state.email)) {
            errors['email'] = 'Example@example.com';
            formIsValid = false;
        }
        if(!this.state.password1 || this.state.password1.length < 8) {
             errors['password1'] = 'Minimum 8 karakterden oluşan bir parola giriniz'
             formIsValid = false;
        }
        if(!this.state.password2 || this.state.password2.length < 8) {
            errors['password2'] = 'Minimum 8 karakterden oluşan bir parola giriniz'
            formIsValid = false;
        }
        else if(this.state.password1 !== this.state.password2) {
            errors['password2'] = 'Parolalar eşleşmiyor';
            formIsValid = false;
        }
        this.setState({errors: errors});
        return formIsValid;
    }
    registerSuccessfully(session) {  // render bazında login.
        new Promise((resolve,reject) => {
            this.context.setAuth(session);
            this.setState({registerFailed:{status: false,message: []},registerSucceed: true,loading: false});
            resolve('register is successful');
        }).then(()=> {
            this.clearForm(); // clear form */
            this.props.history.push('/vizyondaki-filmler?page=1')
        }).catch(err => {
            console.error(err);
        })
    }
    registerFailed(message) {
        this.setState({registerFailed: {
            status: true, // auth failed
            message: message// error array.
        },loading: false});
    }
    registerFailedMessage() { // if password is wrong or the user is unregistered.
        if(this.state.registerFailed.status) {
            return(
                <div className= {`${styles.authFailedMessage}`}>
                   <i className='fa fa-warning mr-2'></i> Bu email sisteme kayıtlıdır
                </div>
            ) 
        }
    }
    clearForm() {
        this.setState({username: '',email: '',password1: '', password2: ''})
    }
    redirect() {
        console.log(this.context)
        if(this.context.session.auth) {
            this.props.history.push('/vizyondaki-filmler?page=1')
        }
    }
    render() {
        let registerFailedMessage = this.registerFailedMessage();
        return (
            <>
                <div style={{display: this.state.loading ? 'block' : 'none' }}>
                    <Loading />
                </div>
                <div className={`container-fluid ${styles.authContainer} `}>
                    <div className = {`row ${styles.formContainer}`}>
                        <div className={`col-md-4 offset-md-4`}>
                            <div className={`card ${styles.card}`}>
                                <div className={`card-header ${styles.heading}`}>
                                <h6>Kaydol</h6>
                                </div>
                                <div className={` ${styles.form}`}>
                                    <form>
                                        <div className={`form-group ${styles.formGroup}`}>
                                            <input type="text" className={`form-control ${styles.inputText}`} id="signupUsername" onBlur= {this.handleElementValidation} name='username' value= {this.state.username} onChange= {this.handleInputChange} aria-describedby="usernameHelp" placeholder=" "/>
                                            <span className={`${styles.placeholder}`}><i className="fa fa-user mr-2"></i>Kullanıcı giriniz</span>
                                            <span className={`${styles.formError}`}>{this.state.errors['username']}</span>
                                        </div>
                                        <div className={`form-group ${styles.formGroup}`}>
                                            <input type="email" className={`form-control ${styles.inputText}`} id="signupEmail" name="email" value= {this.state.email} onChange= {this.handleInputChange} onBlur= {this.handleElementValidation} aria-describedby="emailHelp" placeholder=" "/>
                                            <span className={`${styles.placeholder}`}><i className="fa fa-envelope mr-2"></i>Email Adresinizi giriniz</span>
                                            <span className={`${styles.formError}`}>{this.state.errors['email']}</span>
                                        </div>
                                        <div className={`form-group ${styles.formGroup}`}>
                                            <input type="password" className={`form-control ${styles.inputText}`} id="signupPassword1" name="password1" value= {this.state.password1} onChange= {this.handleInputChange} onBlur= {this.handleElementValidation} placeholder=" "/>
                                            <span className={`${styles.placeholder}`}><i className="fa fa-key mr-2"></i>Parolanızı giriniz</span>
                                            <span className={`${styles.formError}`}>{this.state.errors['password1']}</span>
                                        </div>
                                        <div className={`form-group ${styles.formGroup}`}>
                                            <input type="password" className={`form-control ${styles.inputText}`} id="signupPassword2" name="password2" value= {this.state.password2} onChange= {this.handleInputChange} onBlur= {this.handleElementValidation} placeholder=" "/>
                                            <span className={`${styles.placeholder}`}><i className="fa fa-key mr-2"></i>Parolanızı tekrar giriniz</span>
                                            <span className={`${styles.formError}`}>{this.state.errors['password2']}</span>
                                        </div>     
                                        {registerFailedMessage}                                                     
                                        <div className={`${styles.buttonContainer}`}>
                                            <button type="submit" className="btn btn-dark" onClick = {this.handleRegisterSubmit}>Kayıt</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    
                        </div>
                    </div>
                </div>
            </>
           
        )
    }
}
Signup.contextType = AuthContext; 
export default Signup;