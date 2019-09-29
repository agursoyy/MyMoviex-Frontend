import React from 'react'
import styles from '../styles/login.module.css' // Import css modules stylesheet as styles
import Axios from 'axios';
import Loading from './Loading'

class ForgetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            loading: false,
            email: '',
            error: '',
            passwordLinkFailed: {
                status: false,
                message: []  // message coming from the web service if login fails
            }
        }      
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleElementValidation = this.handleElementValidation.bind(this);
    }
    handleInputChange(event) {
        new Promise((resolve,reject) => {
            this.setState({
                email: event.target.value
            });
            resolve();
        }).then(this.handleElementValidation(event))
        .catch(err => {
            console.error(err);
        })
    }
    handleSubmit(event) {
        event.preventDefault();
        if(this.formValidation()) { // form is valid.
            this.setState({loading: true});
            const data = {
                email: this.state.email,
            };
            Axios.post('http://localhost:5000/api/forgetpassword',data)
            .then(response => {
                console.log(response);
                this.passwordLinkSuccessfull();
                this.clearForm(); // clear form
            }).catch((err,response) => {
                console.error(err);
                this.clearForm();
                if(err.response) // response dönerse
                    this.passwordLinkFailed(err.response.data) // tüm hataların arrayini yolluyorum.

            })
        }
    }
    passwordLinkSuccessfull() {  // email'e link başarılı bir şekilde gönderilmiştir
        this.setState({loading: false});
       alert('Mail adresi sisteme kayıtlı ise şifre yenileme linki mail adresinize gönderilecektir.')
    }
    passwordLinkFailed(message) {
        console.log(message)
        this.setState({passwordLinkFailed: {
            status: true, // password link sending failed
            message: message// error array.
        },
         loading: false});  
    }
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    handleElementValidation(event) {
        const value = event.target.value;
        let error = ''; // hatayı sıfırla
            if(!value || !this.validateEmail(value)) {
                error =  'Geçerli bir mail adresi giriniz';
            }
        this.setState({error});
    }
    formValidation() { // validate entire form.
        let error = '';
        let formIsValid = true;
        if(!this.state.email || !this.validateEmail(this.state.email)) {
            error = 'example@example.com';
            formIsValid = false;
        }
        this.setState({error});
        return formIsValid;
    }
    passwordFailedMessage() { // if password is wrong or the user is unregistered.
        if(this.state.passwordLinkFailed.status && this.state.passwordLinkFailed.message[0]) {
            return(
                <div className= {`${styles.authFailedMessage}`}>
                    <i className='fa fa-warning mr-2'></i>{this.state.passwordLinkFailed.message[0].msg}
                </div>    
            ) 
        }
    }
    clearForm() {
        this.setState({email: ''})
    }
    render() {
        let passwordFailedMessage = this.passwordFailedMessage();
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
                                <h6>ŞİFREMİ UNUTTUM</h6>
                                </div>
                                <div className={` ${styles.form}`}>
                                    <form>
                                        <div className={`form-group ${styles.formGroup}`}>
                                            <input type="email" name='email' value= {this.state.email} onChange= {this.handleInputChange} onBlur= {this.handleElementValidation} className={`form-control ${styles.inputText}`} id="loginEmail" aria-describedby="emailHelp" placeholder=' '/>
                                            <span className={`${styles.placeholder}`}><i className="fa fa-user mr-2"></i>Email Adresinizi giriniz</span>
                                            <span className={`${styles.formError}`}>{this.state.error}</span>
                                        </div>
                                        {passwordFailedMessage} {/** if auth failed from service */}
                                        <div className={`${styles.buttonContainer}`}>
                                            <button type="submit" onClick = {this.handleSubmit} className="btn btn-dark">Giriş</button>
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
export default ForgetPassword;