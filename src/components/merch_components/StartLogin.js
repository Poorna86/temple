import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Card from "react-bootstrap/Card"
import { Modal, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import UserForm from '../user_components/UserForm'
import { merchantLogin, merchantSignUp } from '../../actions/auth'
import { history } from '../../routers/AppRouter'

class StartLogin extends React.Component {
    constructor(props) {
        super (props)
        this.state = {
            merchantid: '',
            merchantName: '',
            merchantPhone: '',
            merchantEmail: '',
            mrchpswd: '',
            mrchRePswd: '',
            merchantsignUp: false,
            merchSuccissfulSignUp: false,
            showMerchant: false,
            loginstatus: false,
            errorMerchantid: '',
            errorMerchantidName: '',
            errorPhone: '',
            errorEmail: '',
            errorPassword: '',
            errorRePassword: '' ,
            errorMsg: '',
            profileData: {
                merchantID: '',
                phoneNum: '',
                emailID: ''
            }
        }
    }

    handleShowMerchant = () => {
        this.setState({showMerchant: true})
    }
    handleCloseMerchant = () => {
        this.setState ({showMerchant: false})
      }

    handleCloseSignup = () => {
        this.setState ({merchantsignUp: false})
      }

    onMerchantIdChange = (e) => {
        this.setState({merchantid: e.target.value})
    }

    onMerchantNameChange = (e) => {
        this.setState({merchantName: e.target.value})
    }

    onMerchantPhoneChange = (e) => {
        this.setState({merchantPhone: e.target.value})
    }

    onMerchantEmailChange = (e) => {
        this.setState({merchantEmail: e.target.value})
    }

    onMerchantPswdChange = (e) => {
        this.setState({ mrchpswd : e.target.value})
    }

    onMerchantRePswdChange = (e) => {
        this.setState({ mrchRePswd : e.target.value})
    }

    onMerchantsignUp = (e) => {
        this.setState({merchantsignUp: true})
    }

    onMerchantLogin = (e) => {
        this.setState({merchantsignUp: false})
    }

    handleSuccsfulLogin = (merchantid,phone,email) => {
        const loginStatus = true
        const profileData = {merchantid: merchantid,
                             phone: phone, 
                             email: email}
        this.props.merchantLogin(loginStatus, profileData)
        history.push("/dashboard")
    }

    handleSuccsfulSignUp = () => {
        const signupStatus = true
        this.props.merchantSignUp(signupStatus)
        history.push('/')
        window.location.reload(true)
    }

    onMrchntSubmit = (e) => {
        e.preventDefault()
        if (!this.state.merchantid || !this.state.mrchpswd) {
            this.setState(() => ({errorMsg: 'please enter Id and password!!' }));
        } else {
            this.setState(() => ({errorMsg: ''}))
            const loginmrchnt = {
                merchantid: this.state.merchantid,
                password: this.state.mrchpswd
            }
            
            axios
            .post('http://localhost:3000/merch/login', loginmrchnt)
            .then((response) => {
                this.setState({errorMsg: ''})
                const {merchantid, phone,email} = response.data
                this.handleSuccsfulLogin(merchantid,phone,email)
            })
            .catch(err => {
                this.setState({errorMsg: ''})
                console.log('err response data: ', err)
                const {merchantid,password} = err.response.data

                if (merchantid){
                    this.setState({errorMsg: merchantid})
                }
                if (password){
                    console.log('here 2')
                    this.setState({errorMsg: password})
                }
                if(!merchantid && !password){
                    console.log('here 3')
                    this.setState({errorMsg: 'System error please contact Admin!!'})
                }
            });
        }
    }

    onMrchnCreatetSubmit = (e) => {
        e.preventDefault()
        if (!this.state.merchantid || !this.state.mrchpswd || !this.state.mrchRePswd || !this.state.merchantName || !this.state.merchantPhone || !this.state.merchantEmail) {
            this.setState(() => ({errorMsg: 'please enter all input fields!!' }));
        } else {
            const signupMerchant = {
                merchantid: this.state.merchantid,
                merchantName: this.state.merchantName,
                phone: this.state.merchantPhone,
                email: this.state.merchantEmail,
                password: this.state.mrchpswd,
                repassword: this.state.mrchRePswd
            }
            
            axios
            .post('http://localhost:3000/merchant/signup', signupMerchant)
            .then((response) => {
                this.setState({errorMerchantid: '',
                                errorMerchantName: '',
                                errorPhone: '',
                                errorEmail: '',
                                errorPassword: '',
                                errorRePassword: '',
                                errorMsg: ''
                })
                console.log('response: ', response)
                this.handleSuccsfulSignUp()
                this.setState({merchSuccissfulSignUp: true})
            })
            .catch((err) => {
                e.preventDefault()
                this.setState({errorMerchantid: '',
                                errorMerchantName: '',
                                errorPhone: '',
                                errorEmail: '',
                                errorPassword: '',
                                errorRePassword: '',
                                errorMsg: ''
                })
                console.log('error in signup', err)
                const {merchantid,merchantName,phone,email,password,repassword} = err.response.data
                if (merchantid){
                    this.setState({errorMerchantid: merchantid})
                }
                if (merchantName){
                    this.setState({errorMerchantName: merchantName})
                }
                if (phone){
                    this.setState({errorPhone: phone})
                }
                if (email){
                    this.setState({errorEmail: email})
                }
                if (password){
                    this.setState({errorPassword: password})
                }
                if (repassword){
                    this.setState({errorRePassword: repassword})
                }
                if(!merchantid && !password && !repassword && !merchantName && !phone && !email){
                    this.setState({errorMsg: 'System error please contact Admin!!'})
                }
            });
        }
    }

      render() {
        return (  
            <div>
                <Card.Text>Sign in with Merchant</Card.Text>
                <NavLink to="/merch/login">
                    <button className="btn_merchant" onClick={this.handleShowMerchant}>Merchant</button>
                </NavLink>
                <UserForm />
                    <form >
                        <Modal show={this.state.showMerchant} onHide={this.handleCloseMerchant}>
                            <Modal.Header closeButton>
                                <Modal.Title>Merchant {this.state.merchantsignUp ?
                                               'Sign Up' : 'Log in'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit= {this.state.merchantsignUp ? 
                                        this.onMrchnCreatetSubmit :
                                        this.onMrchntSubmit}
                                        className="form_margin">
                                    {this.state.merchantsignUp ?
                                        <div>
                                            <Form.Group controlId="formBasicID">
                                                <Form.Label>Merchant ID</Form.Label>
                                                <Form.Control
                                                type="text"
                                                placeholder="Enter Merchant ID"
                                                value={this.state.merchantid}
                                                onChange={this.onMerchantIdChange}
                                                />
                                                {this.state.errorMerchantid && <p className="sign_errorMsg">{this.state.errorMerchantid}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="formBasicName">
                                                <Form.Label>Merchant Name</Form.Label>
                                                <Form.Control
                                                type="text"
                                                placeholder="Enter Merchant Name"
                                                value={this.state.merchantName}
                                                onChange={this.onMerchantNameChange}
                                                />
                                                {this.state.errorMerchantName && <p className="sign_errorMsg">{this.state.errorMerchantName}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPhone">
                                                <Form.Label>Merchant Phone</Form.Label>
                                                <Form.Control
                                                type="number"
                                                placeholder="Enter Merchant contact"
                                                value={this.state.merchantPhone}
                                                onChange={this.onMerchantPhoneChange}
                                                />
                                                {this.state.errorPhone && <p className="sign_errorMsg">{this.state.errorPhone}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Merchant Email</Form.Label>
                                                <Form.Control
                                                type="email"
                                                placeholder="Enter Merchant Email"
                                                value={this.state.merchantEmail}
                                                onChange={this.onMerchantEmailChange}
                                                />
                                                {this.state.errorEmail && <p className="sign_errorMsg">{this.state.errorEmail}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                //value={this.state.mrchpswd}
                                                onChange={this.onMerchantPswdChange}
                                                />
                                                {this.state.errorPassword && <p className="sign_errorMsg">{this.state.errorPassword}</p>}
                                            </Form.Group>

                                            <Form.Group controlId="formBasicRePassword">
                                                <Form.Label>Re-enter Password</Form.Label>
                                                <Form.Control
                                                type="password"
                                                placeholder="Re-enter Password"
                                                //value={this.state.mrchRePswd}
                                                onChange={this.onMerchantRePswdChange}
                                                />
                                                {this.state.errorRePassword && <p className="sign_errorMsg">{this.state.errorRePassword}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="formBasicCheckbox">
                                            <NavLink to="/merch/login">
                                                <span className="mrch_login" onClick={this.onMerchantLogin}>Login</span>
                                            </NavLink>    
                                            </Form.Group>    
                                            <Button variant="primary" type="submit" block>
                                                Create password
                                            </Button>
                                            {this.state.errorMsg && <p className="sign_errorMsg">{this.state.errorMsg}</p>}
                                        </div>
                                    :   
                                        <div>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Merchant ID</Form.Label>
                                                <Form.Control
                                                type="text"
                                                placeholder="Enter Merchant ID"
                                                //value={this.state.merchantid}
                                                onChange={this.onMerchantIdChange}
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                //value={this.state.mrchpswd}
                                                onChange={this.onMerchantPswdChange}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicCheckbox">
                                                <Form.Check type="checkbox" className="label_float" label="Remember Me!" />
                                                <NavLink to="/merch/signup">
                                                    <span className="mrch_signup" onClick={this.onMerchantsignUp}>Signup</span>    
                                                </NavLink>
                                            </Form.Group>
                                            <Button variant="primary" type="submit" block>
                                                Login
                                            </Button>
                                            {this.state.errorMsg && <p className="sign_errorMsg">{this.state.errorMsg}</p>}
                                        </div>
                                    }
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </form>
            </div>
        );
    }    
}

const mapDispatchToProps = (dispatch) => ({
    merchantLogin: (loginStatus, profileData) => dispatch(merchantLogin(loginStatus, profileData)),
    merchantSignUp: (signupStatus) => dispatch(merchantSignUp(signupStatus))
 })

 export default connect(undefined, mapDispatchToProps)(StartLogin);