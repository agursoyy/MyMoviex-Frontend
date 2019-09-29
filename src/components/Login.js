import React from 'react'
import styles from '../styles/login.module.css' // Import css modules stylesheet as styles
import Axios from 'axios';
import Loading from './Loading'
import { Link } from "react-router-dom";
import {AuthContext} from '../authenticationContext';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            loading: false,
            email: '',
            password: '',
            rememberMe: false,
            errors: {},
            loginFailed: {
                status: false,
                message: []  // message coming from the web service if login fails
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleElementValidation = this.handleElementValidation.bind(this);
    }
    componentDidMount() {
        this.nameAutoFocus = false;
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
    handleLoginSubmit(event) {
        event.preventDefault();
        if(this.formValidation()) { // form is valid.
            this.setState({loading: true});
            const loginData = {
                email: this.state.email,
                password: this.state.password
            };
            Axios.post(process.env.REACT_APP_LOGIN_URI, loginData)
            .then(response => {
                console.log(response);
                this.loginSuccessfully(response.data);
            }).catch((err,response) => {
                console.error(err);
                this.clearForm();
                if(err.response) // response dönerse
                    this.loginFailed(err.response.data) // tüm hataların arrayini yolluyorum.
            })
        }
    }
    loginSuccessfully(session) {  // render bazında login.
        new Promise((resolve,reject) => {
            this.context.setAuth(session);
            this.setState({loginFailed:{status: false,message: []},errors: {},loading: false});
            resolve('login is successful');
        }).then(()=> {
            this.clearForm(); // clear form
            this.redirect();
        }).catch(err => {
            console.error(err);
        })
    }
    loginFailed(message) {
        console.log(message)
        this.setState({loginFailed: {
            status: true, // auth failed
            message: message// error array.
        },loading: false});
    }
    loginFailedMessage() { // if password is wrong or the user is unregistered.
        if(this.state.loginFailed.status && this.state.loginFailed.message[0]) {
            return(
                <div className= {`${styles.authFailedMessage}`}>
                    <i className='fa fa-warning mr-2'></i>{this.state.loginFailed.message[0].msg}
                </div>
            ) 
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
        if(name === 'email') {
            if(!value || !this.validateEmail(value)) {
                errors[name] =  'Geçerli bir mail adresi giriniz';
            }
        }
        else if(name === 'password') {
            if(!value || value.length < 8) {
                errors[name] = 'Minimum 8 karakterden oluşan bir parola giriniz'
           }
        }
        this.setState({errors});
    }
    formValidation() { // validate entire form.
        let errors = {};
        let formIsValid = true;
        if(!this.state.email || !this.validateEmail(this.state.email)) {
            errors['email'] = 'example@example.com';
            formIsValid = false;
        }
        if(!this.state.password || this.state.password.length < 8) {
             errors['password'] = 'Minimum 8 karakterden oluşan bir parola giriniz'
             formIsValid = false;
        }
        this.setState({errors: errors});
        return formIsValid;
    }
    clearForm() {
        this.setState({email: '',password: '', rememberMe: false})
    }


    redirect() {
        if(this.context.session.auth) {
            const locationState = this.props.location.state;
            if(locationState) {
                const next = this.props.location.state.next;
                this.props.history.push(next);
            }
            else 
                this.props.history.push('/vizyondaki-filmler?page=1');
        }
    }
    render() {
        let loginFailedMessage = this.loginFailedMessage();
        return (
            <>
                <div style={{display: this.state.loading ? 'block' : 'none' }}>
                    <Loading />
                </div>
                <div className={`container-fluid ${styles.authContainer} `}>
                    <div className = {`row`}>
                        <div className={`col-md-4 offset-md-4`}>
                            <div className={`card ${styles.card}`}>
                                <div className={`card-header ${styles.heading}`}>
                                <h6>GİRİŞ YAP</h6>
                                </div>
                                <div className={` ${styles.form}`}>
                                    <form>
                                        <div className={`form-group ${styles.formGroup}`}>
                                            <input type="email" name='email' value= {this.state.email} onChange= {this.handleInputChange} onBlur= {this.handleElementValidation} className={`form-control ${styles.inputText}`} id="loginEmail" aria-describedby="emailHelp" placeholder=' '/>
                                            <span className={`${styles.placeholder}`}><i className="fa fa-user mr-2"></i>Email Adresinizi giriniz</span>
                                            <span className={`${styles.formError}`}>{this.state.errors['email']}</span>
                                        </div>
                                        <div className={`form-group ${styles.formGroup}`}>
                                            <input type="password" name='password' value = {this.state.password} onChange = {this.handleInputChange} onBlur = {this.handleElementValidation} className={`form-control ${styles.inputText}`} id="loginPassword"  placeholder=' '/>
                                            <span className={`${styles.placeholder}`}><i className="fa fa-key mr-2"></i>Parolanızı giriniz</span>
                                            <span className={`${styles.formError}`}>{this.state.errors['password']}</span>                              
                                        </div>
                                        <div className= {`${styles.formCheckBoxContainer}`}>
                                            <div className="form-check">
                                                <input type="checkBox" className="form-check-input" id="loginRememberMe" name="rememberMe"  checked={this.state.rememberMe} onChange={this.handleInputChange}/>
                                                <label className="form-check-label" htmlFor="loginRememberMe">Beni Hatırla</label>
                                            </div>
                                            <div>
                                                <Link to="/uyelik/sifremi-unuttum">Şifremi Unuttum?</Link>
                                            </div>
                                        </div>
                                        {loginFailedMessage} {/** if auth failed from service */}
                                        <div className={`${styles.buttonContainer}`}>
                                            <button type="submit" onClick = {this.handleLoginSubmit} className="btn btn-dark">Giriş</button>
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
Login.contextType = AuthContext; 

export default Login;