import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import moment from 'moment'
import UserDashboardNavBar from '../user_components/UserDashboardNavBar'

const UserDonationReceipt = (props) => {

    const maxDate = moment().format('YYYY-MM-DD')
    const [donorName, setDonorName] = useState()
    const [donationCreated, setDonationCreated] = useState()
    const [assignEvent, setAssignEvent] = useState()
    const [apiUserEvent, setApiUserEvent] = useState([])
    const [donAmount, setDonAmount] = useState()
    const [errorMsgAmount, setErrorMsgAmount] = useState()
    const [donPhone, setDonPhone] = useState()
    const [errorMsgPhone, setErrorMsgPhone] = useState()
    const [successfulMsg, setSuccessfulMsg] = useState()
    const [errorMsg, setErrorMsg] = useState()

    useEffect(() => {
        if(!props.userEvent){
            (async () => {
                const users = await axios.get(
                    "http://localhost:3000/api/userdonorreceipt"
                );
                setApiUserEvent(apiUserEvent => [...apiUserEvent, users.data.eventName])
            })();
        }
      }, []);
    
    const eventNameList = props.userEvent ? props.userEvent : apiUserEvent

    var eventList = eventNameList.length > 0 &&
                                                eventNameList[0].map((item) => {
                                                    return (
                                                        <option>{item}</option>
                                                        )
                                                    })
    const eventError = eventNameList.length > 0 ? '' : 'You dont have any Events, please contact merchant'

    const onChangeDonorName = (e) => {
        setSuccessfulMsg('')
        if(donationCreated){
            setDonPhone('')
            setDonAmount('')
            setDonationCreated(false)
        }
        setDonorName(e.target.value)
    }

    const onChangeEvent = (e) => {
        setSuccessfulMsg('')
        setAssignEvent(e.target.value)
    }

    const onChangeAmount = (e) => {
        setSuccessfulMsg('')
        if(donationCreated){
            setDonorName('')
            setDonPhone('')
            setDonationCreated(false)
        }
        const amount = e.target.value
        //below !amount will allow user to remove input amount
        if (!amount || amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
            setDonAmount(amount)
        } else {
            setErrorMsgAmount('Please enter valid amount')
        }
    }

    const onChangePhone = (e) => {
        setSuccessfulMsg('')
        if(donationCreated){
            setDonorName('')
            setDonAmount('')
            setDonationCreated(false)
        }
        const phone = e.target.value;
        var pattern = new RegExp(/^[0-9\b]+$/);
        //below !phone will allow user to remove input amount
        if(!phone || phone.match(pattern)) {
            setErrorMsgPhone('')
            setDonPhone(phone)
        } else {
          setErrorMsgPhone('Please valid phone number')
        }
    }

    const onUserSubmit = (e) => {
        e.preventDefault()
        
        if(!eventError){
            if (!donorName || !donAmount || !donPhone ) {
                setErrorMsg('please enter all fields!!')
            } else {
                setErrorMsg('')
                const donorDetails = {
                    donorName, 
                    donAmount,
                    donPhone,
                    assignEvent,
                    donationDate: maxDate
                }
                axios
                .post("http://localhost:3000/api/userdonorreceipt", donorDetails)
                .then((response) => {
                    setErrorMsg('')
                    setDonationCreated(true)
                    setSuccessfulMsg('submitted Successfully!!')
                })
                .catch(err => {
                    console.log('error: ', err)
                });
            }  
        }    
    }

    return (
        <>
            <UserDashboardNavBar />
            <h3 className='pageTitle'>Donataion Form</h3>
            <Form onSubmit={onUserSubmit}>
                <Form.Group className='donation_receipt'>
                    <Form.Label>Donation Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="date"
                        value={maxDate}
                        // max={moment(todayDate).format("YYYY-MM-DD")}
                        // onChange={(e) => setTodayDate(e.target.value)}
                    />
                </Form.Group >
                <Form.Group className='donation_receipt'>   
                    <Form.Label>Donor Name</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Donor Name"
                        value={donorName}
                        onChange={onChangeDonorName}
                    />
                </Form.Group>
                <Form.Group className='donation_receipt'>   
                    <Form.Label>Event Name</Form.Label>
                    <div >
                        <select className="event_dropdown" onChange={onChangeEvent} > { eventNameList.length > 0 ?
                            eventList : <option>No Events</option>
                            }
                        </select>
                    </div>
                    {!eventNameList.length > 0 && <p className="errorMsg">{eventError}</p>}
                </Form.Group>
                <Form.Group className='donation_receipt'>   
                    <Form.Label>Donation Amount</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Amount"
                        value={donAmount}
                        onChange={onChangeAmount}
                    />
                    {errorMsgAmount && <p className="errorMsg">{errorMsgAmount}</p>}
                </Form.Group>
                <Form.Group className='donation_receipt'>   
                    <Form.Label>Donor Phone</Form.Label>
                    <Form.Control 
                            type="text"
                            placeholder="Mobile Number"
                            value={donPhone}
                            onChange={onChangePhone}
                            maxLength="10"
                    />
                    {errorMsgPhone && <p className="errorMsg">{errorMsgPhone}</p>}
                </Form.Group>
                <Button variant="primary" type="submit" block> Submit </Button>
                {errorMsg && <p className="login_errormsg">{errorMsg}</p>}
                {successfulMsg && <p className="submitted_successful-Msg">{successfulMsg}</p>}
            </Form>
        </>
    )
}

const mapStateToProps = (state) => ({
    userDetails: state.auth.userDetails,
    userEvent: state.auth.userEvent
})

export default connect(mapStateToProps) (UserDonationReceipt);