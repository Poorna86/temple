import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import DashboardHeader from '../user_components/DashboardHeader'
import { merchantLogin } from '../../actions/auth'
import axios from 'axios'


const ProfielEditPage = (props) => {
    const [apimerchantid, setApiMerchantid] = useState()
    const [apiphone, setApiPhone] = useState()
    const [apiemail, setApiEmail] = useState()

    useEffect(() => {
        (async () => {
          console.log(props.profileData)
          if (!props.profileData) {
              const users = await axios.get(
                "http://localhost:3000/api/profileedit"
               );
              const {merchantid, phone,email} = users.data
              setApiMerchantid(merchantid)
              setApiPhone(phone)
              setApiEmail(email)
          }
        })();
      }, []);
    
    const reduxPhone = props.profileData ? props.profileData.phone : apiphone
    const reduxEmail = props.profileData ? props.profileData.email : apiemail
    const reduxMrchId = props.profileData ? props.profileData.merchantid : apimerchantid
    const [merchantContact, setMerchantContact] = useState(reduxPhone)
    const [merchantEmail, setMerchantEmail] = useState(reduxEmail)    
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

    const onSaveProfileContactEdits = () => {
        const profileEditData = {
            phone: merchantContact
        }
        callApiAxios(profileEditData)
    }
    const onSaveProfileEmailEdits = () => {
        const profileEditData = {
            email: merchantEmail
        }
        callApiAxios(profileEditData)
    }

    const onSaveProfilePswdEdits = () => {
        const profileEditData = {
            oldPassword: oldPassword,
            password: editPassword,
            repassword: editReEnterPassword
        }
        callApiAxios(profileEditData)
    }

    const handleSuccsfulProfileEdit = (merchantid,phone,email) => {
        const loginStatus = true
        const profileData = {merchantid: merchantid,
                             phone: phone, 
                             email: email}                    
        props.merchantLogin(loginStatus, profileData)
    }

    const callApiAxios = (profileEditData) => {
        axios
            .patch('http://localhost:3000/api/profileedit', profileEditData)
            .then((response) => {
                setPhoneErrorMsg('')
                setEmailErrorMsg('')
                setPswdErrorMsg('')
                setPhoneSuccesfulUpdateMsg('')
                setEmailSuccesfulUpdateMsg('')
                setPswdSuccesfulUpdateMsg('')
                const {merchantid, phone,email, pswdstatus} = response.data
                if (phone !== props.profileData.phone) {
                    setPhoneSuccesfulUpdateMsg('phone number updated successfully !!')
                }
                if (email !== props.profileData.email) {
                    setEmailSuccesfulUpdateMsg('Email updated successfully !!')
                }
                if (pswdstatus === 'OK'){
                    setPswdSuccesfulUpdateMsg('Password changed successfully !!')   
                }

                handleSuccsfulProfileEdit(merchantid,phone,email)
            })
            .catch((err) => {
                setPhoneErrorMsg('')
                setEmailErrorMsg('')
                setPswdErrorMsg('')
                setPhoneSuccesfulUpdateMsg('')
                setEmailSuccesfulUpdateMsg('')
                setPswdSuccesfulUpdateMsg('')
                const {phone,email,password,repassword} = err.response.data
                if (phone){
                    setPhoneErrorMsg(phone)
                }
                if (email){
                    setEmailErrorMsg(email)
                }
                if (password){
                    setPswdErrorMsg(password)
                } else if(repassword){
                    setPswdErrorMsg(repassword)
                }
            })
    }
    
        return (
            <div>
                <DashboardHeader />
                <h3 className='profile_header'> Profile Edit Page</h3>
                <Form>
                    <Form.Group className='profile_group'>
                        <Form.Control
                        disabled
                        type="text"
                        value={reduxMrchId}
                        />
                    </Form.Group>
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
                            type="number"
                            placeholder='edit contact number'
                            value={merchantContact}
                            onChange={(e) => setMerchantContact(e.target.value)}
                            />
                            {phoneErrorMsg && <p className="errorMsg">{phoneErrorMsg}</p>}
                            {phoneSuccesfulUpdateMsg && <p className="successful_update-Msg">{phoneSuccesfulUpdateMsg}</p>}
                            <span onClick={onSaveProfileContactEdits} className='profile_save'>save changes</span>
                        </Form.Group> 
                    }
                    <Form.Group className='profile_group'>
                        <Form.Control
                        disabled
                        type="email"
                        value={reduxEmail}
                        />
                        <img src='/images/pencil-icon.jpg' height='20px' onClick={() => setEmailEdit(!emailEdit)} />
                    </Form.Group> 
                    {emailEdit && 
                        <Form.Group className='profile_group-edit'>
                            <Form.Control
                            type="email"
                            placeholder='edit email'
                            value={merchantEmail}
                            onChange={(e) => setMerchantEmail(e.target.value)}
                            />
                            {emailErrorMsg && <p className="errorMsg">{emailErrorMsg}</p>}
                            {emailSuccesfulUpdateMsg && <p className="successful_update-Msg">{emailSuccesfulUpdateMsg}</p>}
                            <span onClick={onSaveProfileEmailEdits} className='profile_save'>save changes</span>
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
        profileData: state.auth.profileData
})

const mapDispatchToProps = (dispatch) => ({
    merchantLogin: (loginStatus, profileData) => dispatch(merchantLogin(loginStatus, profileData))
})

export default connect(mapStateToProps,mapDispatchToProps) (ProfielEditPage);