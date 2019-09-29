import React from 'react'
import styles from '../styles/login.module.css' // Import css modules stylesheet as styles
import Axios from 'axios';

class ForgetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            password1: '',
            password2: '',
            errors: {},
            passwordLinkFailed: {
                status: false,
                message: []  // message coming from the web service if login fails
            }
        }      
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleElementValidation = this.handleElementValidation.bind(this);
    }
    componentDidMount() {
      this.getUserToken();
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
    getUserToken() {
      const token = this.props.match.params.token;
      console.log(token);
      return token;
    }
    handleSubmit(event) {
        event.preventDefault();
        if(this.formValidation()) { // form is valid.
            const token = this.getUserToken();
            const data = {
                password: this.state.password1,
            };
            console.log(data);
            Axios.post(process.env.REACT_APP_CHANGE_PASSWORD_URI,data,
            {
              method: 'POST',
              headers: {
                  'x-access-token': token
              }
          })
            .then(response => {
                console.log(response);
                this.changePasswordSuccessfully();
                this.clearForm(); // clear form
            }).catch((err,response) => {
                console.error(err);
                this.clearForm();
                if(err.response) // response dönerse
                    this.changePasswordFailed(err.response.data) // tüm hataların arrayini yolluyorum.

            })
        }
    }
    changePasswordSuccessfully() {  // email'e link başarılı bir şekilde gönderilmiştir
        new Promise((resolve,reject) => {
            alert('Şifreniz başarıyla değiştirilmiştir, lüften giriş yapınız.');
            resolve();
        }).then(() => {
           this.redirect();
        }).catch(err => {
          console.error(err);
        });
    }
    changePasswordFailed(message) {
        console.log(message)
        this.setState({passwordLinkFailed: {
            status: true, // password link sending failed
            message: message// error array.
        }})
    }

    handleElementValidation(event) {
      const name = event.target.name;
      const value = event.target.value;
      const errors = {...this.state.errors};
      errors[name] =''; // hatayı sıfırla
      if(name === 'password1') {
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
    formValidation() { // validate entire form.
      let errors = {};
      let formIsValid = true;
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
    changePasswordFailedMessage() { // if password is wrong or the user is unregistered.
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
    redirect() {
        this.props.history.push('/uyelik/giris')
    }
    render() {
        let changePasswordFailedMessage = this.changePasswordFailedMessage();
        return (
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
                                        <input type="password" name='password1' value= {this.state.password1} onChange= {this.handleInputChange} onBlur= {this.handleElementValidation} className={`form-control ${styles.inputText}`} id="changePassword1" placeholder=' '/>
                                        <span className={`${styles.placeholder}`}><i className="fa fa-user mr-2"></i>Yeni şifrenizi giriniz</span>
                                        <span className={`${styles.formError}`}>{this.state.errors['password1']}</span>
                                    </div>
                                    <div className={`form-group ${styles.formGroup}`}>
                                        <input type="password" name='password2' value= {this.state.password2} onChange= {this.handleInputChange} onBlur= {this.handleElementValidation} className={`form-control ${styles.inputText}`} id="changePassword2" placeholder=' '/>
                                        <span className={`${styles.placeholder}`}><i className="fa fa-user mr-2"></i>Şifrenizi tekrar giriniz</span>
                                        <span className={`${styles.formError}`}>{this.state.errors['password2']}</span>
                                    </div>
                                    {changePasswordFailedMessage} {/** if auth failed from service */}
                                    <div className={`${styles.buttonContainer}`}>
                                        <button type="submit" onClick = {this.handleSubmit} className="btn btn-dark">Giriş</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                  
                    </div>
                 </div>
            </div>
        )
    }
}
export default ForgetPassword;