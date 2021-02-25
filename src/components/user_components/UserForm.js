import React,{useState} from 'react'
import {NavLink} from 'react-router-dom'
import Card from "react-bootstrap/Card"
import { Modal, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { connect } from 'react-redux'
import { userLogin } from '../../actions/auth'
import { history } from '../../routers/AppRouter'

const UserForm  =  (props) => {
    const [userEmail, setUserEmail] = useState('')
    const [userPswd, setUserPswd] = useState('')
    const [userRePswd, setUserRePswd] = useState('')
    const [userSignUp, setUserSignUp] = useState(false)
    const [showUser, setShowUser] = useState(false)
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [errorRePassword, setErrorRePassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [successfulMsg, setSuccessfulMsg] = useState('')

    const handleShowUser = () => {setShowUser(true)
                                 setUserSignUp(false)}
                                
    const handleCloseUser = () => setShowUser(false);
    const onUserSignUp = () => setUserSignUp(true);
    const onUserLogin = () => setUserSignUp(false);

    const handleSuccsfulLogin = (userphone, useremail, userEvent) => {
        const loginStatus = true
        const userDetails = {userphone, useremail}
        props.userLogin(loginStatus, userDetails, userEvent)
        history.push('/userdashboard')
    }

    const handleSuccsfulSignUp = () => {
        const signupStatus = true
        console.log('user logged in')
        //props.userSignUp(signupStatus)
    }

    const onUserSubmit = (e) => {
        e.preventDefault()
        if (!userEmail || !userPswd) {
            setErrorMsg('please enter Id and password!!')
        } else {
            setErrorMsg('')
            const loginUser = {
                userEmail: userEmail,
                password: userPswd
            }
            
            axios
            .post('http://localhost:3000/api/user/login', loginUser)
            .then((response) => {
                setErrorMsg('')
                const {userphone, useremail, eventName} = response.data
                console.log('response data: ', response.data)
                // const eventName = [...eventName, response.data.eventName]
                handleSuccsfulLogin(userphone, useremail, eventName)
            })
            .catch(err => {
                console.log('error: ', err)
                setErrorMsg('')
                const {usermail,password} = err.response.data
                if (usermail){
                    setErrorMsg(usermail)
                }
                if (password){
                    setErrorMsg(password)
                }
                if(!usermail && !password){
                    setErrorMsg('System error please contact Admin!!')
                }
            });
        }
    }

    const onUserCreatetSubmit = (e) => {
        e.preventDefault()
        if (!userEmail || !userPswd || !userRePswd) {
            setErrorMsg('please enter Id and password!!')
        } else {
            setErrorMsg('')
            const signupUser = {
                userEmail: userEmail,
                password: userPswd,
                repassword: userRePswd
            }
            axios
            .post('http://localhost:3000/api/user/signup', signupUser)
            .then((response) => {
                    setErrorEmail('')
                    setErrorPassword('')
                    setErrorRePassword('')
                    setErrorMsg('')
                    setSuccessfulMsg('')
                    setSuccessfulMsg('Password created successfully!!')
                    handleSuccsfulSignUp()
                })
            .catch((err) => {
                setErrorEmail('')
                setErrorPassword('')
                setErrorRePassword('')
                setErrorMsg('')
                setSuccessfulMsg('')
                console.log(err.response)
                const {userEmail,password,repassword} = err.response.data
                if (userEmail){
                    setErrorEmail(userEmail)
                }
                if (password){
                    setErrorPassword(password)
                }
                if (repassword){
                    setErrorRePassword(repassword)
                }
                if(!userEmail && !password && !repassword){
                    setErrorMsg('System error please contact Admin!!')
                }
            });
        }
    }
    return (  
        <div>
            <Card.Text>Sign in with User</Card.Text>
            <NavLink to="/user/login">
            <button className="btn_merchant" onClick={handleShowUser}>User</button>
            </NavLink>
                <form >
                    <Modal show={showUser} onHide={handleCloseUser}>
                        <Modal.Header closeButton>
                            <Modal.Title>User {userSignUp ?
                                            'Sign Up' : 'Log in'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit= {userSignUp ? 
                                    onUserCreatetSubmit :
                                    onUserSubmit}
                                    className="form_margin">
                                {userSignUp ?
                                    <div>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>User ID</Form.Label>
                                            <Form.Control
                                            type="text"
                                            placeholder="Enter User ID"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            />
                                        </Form.Group>
                                        {errorEmail && <p className="login_errormsg">{errorEmail}</p>}
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={userPswd}
                                            onChange={(e) => setUserPswd(e.target.value)}
                                            />
                                        </Form.Group>
                                        {errorPassword && <p className="login_errormsg">{errorPassword}</p>}
                                        <Form.Group controlId="formBasicRePassword">
                                            <Form.Label>Re-enter Password</Form.Label>
                                            <Form.Control
                                            type="password"
                                            placeholder="Re-enter Password"
                                            value={userRePswd}
                                            onChange={(e) => setUserRePswd(e.target.value)}
                                            />
                                        </Form.Group>
                                        {errorRePassword && <p className="login_errormsg">{errorRePassword}</p>}
                                        <Form.Group controlId="formBasicCheckbox">
                                        <NavLink to="/user/login">
                                            <span className="mrch_login" onClick={onUserLogin}>Login</span>
                                        </NavLink>    
                                        </Form.Group>    
                                        <Button variant="primary" type="submit" block>
                                            Create password
                                        </Button>
                                        {errorMsg && <p className="login_errormsg">{errorMsg}</p>}
                                        {successfulMsg && <p className="login_successful-Msg">{successfulMsg}</p>}
                                    </div>
                                :   
                                    <div>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>User ID</Form.Label>
                                            <Form.Control
                                            type="text"
                                            placeholder="Enter User ID"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={userPswd}
                                            onChange={(e) => setUserPswd(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" className="label_float" label="Remember Me!" />
                                            <NavLink to="/user/signup">
                                                <span className="mrch_signup" onClick={onUserSignUp}>Signup</span>
                                            </NavLink>
                                        </Form.Group>
                                        <Button variant="primary" type="submit" block>
                                            Login
                                        </Button>
                                        {errorMsg && <p className="login_errormsg">{errorMsg}</p>}
                                    </div>
                                }
                            </Form>
                        </Modal.Body>
                    </Modal>
                </form>
        </div>
    );   
}

const mapDispatchToProps = (dispatch) => ({
    userLogin: (loginStatus, userDetails, userEvent) => dispatch(userLogin(loginStatus, userDetails, userEvent))
 })

 export default connect(undefined, mapDispatchToProps)(UserForm)