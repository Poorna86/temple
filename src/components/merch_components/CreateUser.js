import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import DashboardNavBar from '../DashboardNavBar'
import Header from '../header'

const CreateUser = (props) => {
        
    const [userCreate, setUserCreate] = useState()
    const [assignEvent, setAssignEvent] = useState()
    const [assignUser, setAssignUser] = useState()
    const [userEmail, setUserEmail] = useState()
    const [userPhone, setUserPhone] = useState()
    const [errorUserEmail, setErrorUserEmail] = useState()
    const [errorUserPhone, setErrorUserPhone] = useState()
    const [errorUserEvent, setErrorUserEvent] = useState()
    const [errorMsg, setErrorMsg] = useState() 
    const [eventNameList, setEventNameList] = useState([])
    const [apimerchantid, setApiMerchantid] = useState()
    const [phoneEmail,setPhoneEmail] = useState([])
    const [options, setOptions] = useState([])

    useEffect(() => {
        console.log('phoneEmail: ', phoneEmail.length)
        if (!props.profileData || !phoneEmail.length > 0) {
            (async () => {
                const eventsList = await axios.get(
                    "http://localhost:3000/api/createuser"
                );
                    console.log(eventsList.data)
                    setEventNameList(eventNameList => [...eventNameList, eventsList.data.eventName])
                    setPhoneEmail(phoneEmail => [...phoneEmail, ...eventsList.data.usercolsDetails])
                    setOptions(options => [...options, ...eventsList.data.userDetails])
                    setApiMerchantid(eventsList.data.merchantid)
                    if(!eventsList.data.eventName.length > 0){
                        setErrorMsg('Please create Event and then add User !!')
                    }
            })();
        }
    }, []);

    const handleOnSelect = (item) => {
        const email = item.name
        phoneEmail.map((element) => {
            if(element.userEmail === email){
                setUserEmail(element.userEmail)
                setUserPhone(element.userphone)
            }
        })
    }
    
    const reduxMrchId = props.profileData ? props.profileData.merchantid : apimerchantid

    var eventList = eventNameList.length > 0 &&
                        eventNameList[0].map((item) => {
                            return (
                                <option>{item}</option>
                                )
                            })

    const redirectToCreateUserPage = () => {
        setUserCreate(true)
        setUserEmail('')
        setUserPhone('')
        setErrorMsg('')
    }

    const onChangeEvent = (e) => {
        setUserCreate(false)
        setAssignEvent(e.target.value)
    }

    const onChangeEmail = (e) => {
        if(userCreate === true){
            setUserCreate(false)
        }
        setUserEmail(e.target.value)
    }

    const onChangePhone = (e) => {
        if(userCreate === true){
            setUserCreate(false)
        }
        setUserPhone(e.target.value)
    }

    const onUserCreatetSubmit = (e) => {
        e.preventDefault()
        if (!userEmail || !userPhone) {
            setErrorMsg('please enter user Email and phone number!!')
        } else if(!assignEvent) {
            setErrorMsg('please select Event Name!!')
        } else{
            setErrorMsg('')
            const userDetails = {
                merchantid: reduxMrchId,
                userEvent: assignEvent,
                userEmail: userEmail,
                userPhone: userPhone
            }

            axios
            .post('http://localhost:3000/api/createuser', userDetails)
            .then((response) => {
                // setNewUser(response.data.userID)
                redirectToCreateUserPage()
            })
            .catch(err => {
                setErrorUserEmail('')
                setErrorUserPhone('')
                const {useremail,phone, event} = err.response.data
                if(useremail){
                    setErrorUserEmail(useremail)
                }
                if(phone){
                    setErrorUserPhone(phone)
                }
                if(event){
                    setErrorUserEvent(event)
                }
            });
        }
    }    

        return (
            <div>
                <DashboardNavBar />
                <Header />
                <h2 className="pageTitle">Create User</h2>
                <Form >
                    <>
                        <Form.Group controlId="formBasicNameList" className='user_form'>
                            <Form.Label>Select User</Form.Label>
                            <div >
                                <select className="event_dropdown" onChange={(e) => setAssignUser(e.target.value)} > 
                                    <option>New User</option>
                                    <option>Old User</option>
                                </select>
                            </div>
                        </Form.Group>
                        {assignUser === 'Old User' && 
                        <div className='search_disp'>
                            <ReactSearchAutocomplete
                                items={options}
                                onSelect={handleOnSelect}
                                placeholder="search user"
                                autoFocus
                            />
                        </div>}
                        <Form.Group controlId="formBasicNameList" className='user_form'>
                            <Form.Label>Event Name</Form.Label>
                            <div >
                                <select className="event_dropdown" onChange={onChangeEvent} > { eventNameList.length > 0 ?
                                    eventList : <option>No Events</option>
                                    }
                                </select>
                            </div>
                            {errorUserEvent && <p className="sign_errorMsg">{errorUserEvent}</p>}
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail" className='user_form'>
                            <Form.Label>User mail ID</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter User mail ID"
                                value={userEmail}
                                onChange={onChangeEmail}
                            />
                            {errorUserEmail && <p className="sign_errorMsg">{errorUserEmail}</p>}
                        </Form.Group>
                        <Form.Group controlId="formBasicPhone" className='user_form'>
                            <Form.Label>User Phone number</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter User Phone Number"
                                value={userPhone}
                                onChange={onChangePhone}
                            />
                            {errorUserPhone && <p className="sign_errorMsg">{errorUserPhone}</p>}
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <NavLink to="/createuser">
                                {!userCreate ?
                                    <Button className="addButton" type="submit" onClick = {onUserCreatetSubmit}>Create User</Button> :
                                    <Button className="addButton">Create User</Button>
                                }
                            </NavLink>
                            {userCreate && 
                                <div className="successful_update-Msg">
                                    <p >User succeffully created !! </p>
                                    <p > <a className='click_here' onClick={redirectToCreateUserPage}>Click Here</a>  to create another user</p>
                                    <p > <Link to="/dashboard">Click Here</Link> Navigate to dashboard page </p>
                                </div>
                            }        
                        </Form.Group>
                        {errorMsg && <p className="sign_errorMsg">{errorMsg}</p>}
                    </>
                </Form>
            </div>
        );
    }

const mapStateToProps = (state) => ({
    profileData: state.auth.profileData
})

// const mapDispatchToProps = (dispatch) => ({
//     merchantLogin: (loginStatus, profileData) => dispatch(merchantLogin(loginStatus, profileData))
// })

export default connect(mapStateToProps) (CreateUser);