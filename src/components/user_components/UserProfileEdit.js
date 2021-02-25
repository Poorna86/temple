import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { userLogin } from '../../actions/auth'
import axios from 'axios'
import UserDashboardNavBar from '../user_components/UserDashboardNavBar'


const UserProfielEdit = (props) => {
    // const [apiuserid, setApiuserid] = useState()
    const [apiphone, setApiPhone] = useState()
    const [apiemail, setApiEmail] = useState()

    useEffect(() => {
        if(!props.userDetails){
            (async () => {
            
            if (!props.userDetails) {
                const users = await axios.get(
                    "http://localhost:3000/api/userprofileedit"
                );
                const {userphone, useremail} = users.data
                // setApiuserid(userID)
                setApiPhone(userphone)
                setApiEmail(useremail)
            }
            })();
        }
      }, []);
    
    const reduxPhone = props.userDetails ? props.userDetails.userphone : apiphone
    const reduxEmail = props.userDetails ? props.userDetails.useremail : apiemail
    // const reduxUserId = props.userDetails ? props.userDetails.userID : apiuserid

    const [userContact, setUserContact] = useState(reduxPhone)
    const [userEmail, setUserEmail] = useState(reduxEmail)    
    const [oldPassword, setOldPassword] = useState('')
    const [editPassword, setEditPassword] = useState('')
    const [editReEnterPassword, setEditReEnterPassword] = useState('')
    const [contactEdit, setContactEdit] = useState(false)
    const [emailEdit, setEmailEdit] = useState(false)
    const [passwordEdit, setPasswordEdit] = useState(false)       
    const [phoneErrorMsg, setPhoneErrorMsg] = useState('')
    const [emailErrorMsg, setEmailErrorMsg] = useState('')
    const [pswdErrorMsg, setPswdErrorMsg] = useState('')
    const [phoneSuccesfulUpdateMsg, setPhoneSuccesfulUpdateMsg] = useState('')
    const [emailSuccesfulUpdateMsg, setEmailSuccesfulUpdateMsg] = useState('')
    const [pswdSuccesfulUpdateMsg, setPswdSuccesfulUpdateMsg] = useState('')

    const onChangePhone = (e) => {
        const phone = e.target.value;
        var pattern = new RegExp(/^[0-9\b]+$/);
        //below !phone will allow user to remove input amount
        if(!phone || phone.match(pattern)) {
            setPhoneErrorMsg('')
            setUserContact(phone)
        } else {
            setPhoneErrorMsg('Please valid phone number')
        }
    }

    const onSaveProfileContactEdits = () => {
        const profileEditData = {
            phone: userContact
        }
        callApiAxios(profileEditData)
    }
    // const onSaveProfileEmailEdits = () => {
    //     const profileEditData = {
    //         email: userEmail
    //     }
    //     callApiAxios(profileEditData)
    // }

    const onSaveProfilePswdEdits = () => {
        const profileEditData = {
            oldPassword: oldPassword,
            password: editPassword,
            repassword: editReEnterPassword
        }
        callApiAxios(profileEditData)
    }

    const handleSuccsfulProfileEdit = (userphone,useremail) => {
        const loginStatus = true
        const userDetails = {userphone, useremail}                    
        props.userLogin(loginStatus, userDetails)
    }

    const callApiAxios = (profileEditData) => {
        axios
            .patch('http://localhost:3000/api/userprofileedit', profileEditData)
            .then((response) => {
                setPhoneErrorMsg('')
                setEmailErrorMsg('')
                setPswdErrorMsg('')
                setPhoneSuccesfulUpdateMsg('')
                setEmailSuccesfulUpdateMsg('')
                setPswdSuccesfulUpdateMsg('')
                const {phone,email, pswdstatus} = response.data
                console.log('response data: ', response.data)
                if (phone !== reduxPhone) {
                    setPhoneSuccesfulUpdateMsg('phone number updated successfully !!')
                }
                // if (email !== reduxEmail) {
                //     setEmailSuccesfulUpdateMsg('Email updated successfully !!')
                // }
                if (pswdstatus === 'OK'){
                    setPswdSuccesfulUpdateMsg('Password changed successfully !!')   
                }
                
                handleSuccsfulProfileEdit(phone,email)
            })
            .catch((err) => {
                setPhoneErrorMsg('')
                setEmailErrorMsg('')
                setPswdErrorMsg('')
                setPhoneSuccesfulUpdateMsg('')
                setEmailSuccesfulUpdateMsg('')
                setPswdSuccesfulUpdateMsg('')
                
                const {phone,password,repassword} = err.response.data
                if (phone){
                    setPhoneErrorMsg(phone)
                }
                // if (email){
                //     setEmailErrorMsg(email)
                // }
                if (password){
                    setPswdErrorMsg(password)
                } else if(repassword){
                    setPswdErrorMsg(repassword)
                }
            })
    }
    
        return (
            <div>
                <UserDashboardNavBar />
                <h3 className='profile_header'> Profile Edit Page</h3>
                <Form>
                    {/* <Form.Group className='profile_group'>
                        <Form.Control
                        disabled
                        type="text"
                        value={reduxUserId}
                        />
                    </Form.Group> */}
                    <Form.Group className='profile_group'>
                        <Form.Control
                        disabled
                        type="email"
                        value={reduxEmail}
                        />
                        {/* <img src='/images/pencil-icon.jpg' height='20px' onClick={() => setEmailEdit(!emailEdit)} /> */}
                    </Form.Group> 
                    {/* {emailEdit && 
                        <Form.Group className='profile_group-edit'>
                            <Form.Control
                            type="email"
                            placeholder='edit email'
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            />
                            {emailErrorMsg && <p className="errorMsg">{emailErrorMsg}</p>}
                            {emailSuccesfulUpdateMsg && <p className="successful_update-Msg">{emailSuccesfulUpdateMsg}</p>}
                            <span onClick={onSaveProfileEmailEdits} className='profile_save'>save changes</span>
                        </Form.Group> 
                    } */}
                                        <Form.Group className='profile_group'>
                        <Form.Control
                        disabled
                        type="number"
                        value={reduxPhone}
                        />
                        <img src='/images/pencil-icon.jpg' height='20px' onClick={(e) => setContactEdit(!contactEdit)} />
                    </Form.Group> 
                    {contactEdit && 
                        <Form.Group className='profile_group-edit'>
                            <Form.Control
                            type="text"
                            placeholder='edit contact number'
                            value={userContact}
                            onChange={onChangePhone}
                            maxLength="10"
                            />
                            {phoneErrorMsg && <p className="errorMsg">{phoneErrorMsg}</p>}
                            {phoneSuccesfulUpdateMsg && <p className="successful_update-Msg">{phoneSuccesfulUpdateMsg}</p>}
                            <span onClick={onSaveProfileContactEdits} className='profile_save'>save changes</span>
                        </Form.Group> 
                    }
                    <Form.Group className='profile_group-password'>
                        <Form.Control
                        disabled
                        type="password"
                        placeholder="Change Password"
                        />
                        <img src='/images/pencil-icon.jpg' height='20px' onClick={() => setPasswordEdit(!passwordEdit)} />
                    </Form.Group> 
                    {passwordEdit && 
                        <Form.Group className='profile_group-edit'>
                            <Form.Control
                                type="password"
                                placeholder='old password'
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <Form.Control
                                type="password"
                                placeholder='new password'
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                            />
                            <Form.Control
                                type="password"
                                placeholder='Re-enter new password'
                                value={editReEnterPassword}
                                onChange={(e) => setEditReEnterPassword(e.target.value)}
                            />
                            {pswdErrorMsg && <p className="errorMsg">{pswdErrorMsg}</p>}
                            {pswdSuccesfulUpdateMsg && <p className="successful_update-Msg">{pswdSuccesfulUpdateMsg}</p>}
                            <span onClick={onSaveProfilePswdEdits} className='profile_save'>save changes</span>
                        </Form.Group> 
                    }   
                </Form>        
            </div>
        )
    }

const mapStateToProps = (state) => ({
        userDetails: state.auth.userDetails
})

const mapDispatchToProps = (dispatch) => ({
    userLogin: (loginStatus, userDetails) => dispatch(userLogin(loginStatus, userDetails))
})

export default connect(mapStateToProps,mapDispatchToProps) (UserProfielEdit);