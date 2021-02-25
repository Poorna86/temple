import React from 'react';
import { connect } from 'react-redux';
import {NavLink, Redirect} from 'react-router-dom';
import Card from "react-bootstrap/Card";
import { Modal, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { UserForm } from './UserForm';
import { merchantLogin, merchantSignUp } from '../actions/auth';

class MerchantLogin extends React.Component {
    constructor(props) {
        super (props)
        this.state = {
            merchantid: '',
            mrchpswd: '',
            mrchRePswd: '',
            merchantsignUp: false,
            showMerchant: true,
            loginstatus: false,
            errorMerchantid: '',
            errorPassword: '',
            errorRePassword: '' ,
            errorMsg: ''
        }
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

    handleSuccsfulLogin = () => {
        console.log('handlesuccessfullogin')
        const loginDetails = {
            loginStatus: true,
            merchantid: this.state.merchantid
        }

        this.props.merchantLogin(loginDetails)
    }

    handleSuccsfulSignUp = () => {
        console.log('handlesuccesfulsignup')
        const signupStatus = true
        this.props.merchantSignUp(signupStatus)
    }

    onMrchntSubmit = (e) => {
        e.preventDefault()
        console.log('error')
        if (!this.state.merchantid || !this.state.mrchpswd) {
            this.setState(() => ({error: 'please enter Id and password!!' }));
        } else {
            this.setState(() => ({error: ''}))
            const loginmrchnt = {
                merchantid: this.state.merchantid,
                password: this.state.mrchpswd
            }
            
            axios
            .post('http://localhost:3000/merch/login', loginmrchnt, { withCredentials: true })
            .then((response) => {
                this.setState({errorMsg: ''})
                this.setState({status: response.statusText,
                                loginstatus: true    })
                console.log('response data merchantid: ', response.data.merchantid)
                this.handleSuccsfulLogin(response.data.merchantid)
                //props.history.push("/dashboard")
                //window.location.reload()
            })
            .catch(err => {
                this.setState({errorMsg: ''})
                console.log('err response data: ', err.response.data)
                const {merchantid,password} = err.response.data

                if (merchantid){
                    console.log('here 1')
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
        if (!this.state.merchantid || !this.state.mrchpswd || !this.state.mrchRePswd) {
            this.setState(() => ({error: 'please enter Id and password!!' }));
        } else {
            this.setState(() => ({error: ''}))
            const signupMerchant = {
                merchantid: this.state.merchantid,
                password: this.state.mrchpswd,
                repassword: this.state.mrchRePswd
            }
            
            axios
            .post('http://localhost:3000/merchant/signup', signupMerchant, { withCredentials: true })
            .then((response) => {
                this.setState({errorMerchantid: '',
                                errorPassword: '',
                                errorRePassword: '',
                                errorMsg: ''
                })
                console.log('response: ', response)
                this.setState({loginstatus: true})
                this.handleSuccsfulSignUp()
                
            })
            .catch((err) => {
                this.setState({errorMerchantid: '',
                                errorPassword: '',
                                errorRePassword: '',
                                errorMsg: ''
                })
                console.log('error in signup', err)
                const {merchantid,password,repassword} = err.response.data
                if (merchantid){
                    this.setState({errorMerchantid: merchantid})
                }
                if (password){
                    this.setState({errorPassword: password})
                }
                if (repassword){
                    this.setState({errorRePassword: repassword})
                }
                if(!merchantid && !password && !repassword){
                    this.setState({errorMsg: 'System error please contact Admin!!'})
                }
            });
        }
    }

      render() {
        return (  
            <div>
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
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Merchant ID</Form.Label>
                                                <Form.Control
                                                type="text"
                                                placeholder="Enter Merchant ID"
                                                value={this.state.merchantid}
                                                onChange={this.onMerchantIdChange}
                                                />
                                                {this.state.errorMerchantid && <p className="errorMsg">{this.state.errorMerchantid}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={this.state.mrchpswd}
                                                onChange={this.onMerchantPswdChange}
                                                />
                                                {this.state.errorPassword && <p className="errorMsg">{this.state.errorPassword}</p>}
                                            </Form.Group>

                                            <Form.Group controlId="formBasicRePassword">
                                                <Form.Label>Re-enter Password</Form.Label>
                                                <Form.Control
                                                type="password"
                                                placeholder="Re-enter Password"
                                                value={this.state.mrchRePswd}
                                                onChange={this.onMerchantRePswdChange}
                                                />
                                                {this.state.errorRePassword && <p className="errorMsg">{this.state.errorRePassword}</p>}
                                            </Form.Group>
                                            <Form.Group controlId="formBasicCheckbox">
                                            <NavLink to="/merch/login">
                                                <span className="mrch_login" onClick={this.onMerchantLogin}>Login</span>
                                            </NavLink>    
                                            </Form.Group>    
                                            <Button variant="primary" type="submit" block>
                                                Create password
                                            </Button>
                                            {this.state.errorMsg && <p className="errorMsg">{this.state.errorMsg}</p>}
                                        </div>
                                    :   
                                        <div>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Merchant ID</Form.Label>
                                                <Form.Control
                                                type="text"
                                                placeholder="Enter Merchant ID"
                                                value={this.state.merchantid}
                                                onChange={this.onMerchantIdChange}
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={this.state.mrchpswd}
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
                                            {this.state.errorMsg && <p className="errorMsg">{this.state.errorMsg}</p>}
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
    merchantLogin: (loginDetails) => dispatch(merchantLogin(loginDetails)),
    merchantSignUp: (signupStatus) => dispatch(merchantSignUp(signupStatus))
 })

 export default connect(undefined, mapDispatchToProps)(MerchantLogin);