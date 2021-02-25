import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import addMonths from 'date-fns/addMonths';
import format from 'date-fns/format';
import DashboardNavBar from '../DashboardNavBar';
import Header from '../Header';

const CreateEvent = (props) => {
    const [eventCreate, setEventCreate] = useState('')
    const [eventName, setEventName] = useState('')
    const [eventManager, setEventManager] = useState('')
    const [eventManagerPhone, seteventManagerPhone] = useState('')
    const [eventDate, setEventDate] = useState(format(new Date(), "yyyy-MM-dd"))
    const maxDate = format(addMonths(new Date(), 3), "yyyy-MM-dd")
    const [errorPhoneMsg, setErrorPhoneMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const onEventCreatetSubmit = (e) => {
        e.preventDefault()

        if (!eventName || !eventDate) {
            setErrorMsg('please enter Event name and date!!')
        } else {
            const eventDetails = {
                eventName: eventName,
                eventManager: eventManager,
                eventManagerPhone: eventManagerPhone,
                eventDate: eventDate
            }

            axios
            .post('http://localhost:3000/api/createevent', eventDetails)
            .then((response) => {
                setEventName(response.data.eventName)
                setEventCreate(true)
            })
            .catch(err => {
                setErrorMsg('')
                console.log(err.response.data)
                const {eventManagerPhone} = err.response.data
                if(eventManagerPhone){
                    setErrorPhoneMsg(eventManagerPhone)
                }
            });
        }
    }

    return (
        <div>
            <DashboardNavBar />
            <Header />
            <h2 className="pageTitle">Create Event</h2>
            <Form >
                <div>
                    <Form.Group className='user_form'>
                        <Form.Label>Event Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter event name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className='user_form'>
                        <Form.Label>Event manager name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Manager name"
                            value={eventManager}
                            onChange={(e) => setEventManager(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className='user_form'>
                        <Form.Label>Event manager Phone number</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Manager Phone Number"
                            value={eventManagerPhone}
                            onChange={(e) => seteventManagerPhone(e.target.value)}
                        />
                        {errorPhoneMsg && <p className="sign_errorMsg">{errorPhoneMsg}</p>}
                    </Form.Group>
                    <Form.Group controlId="formBasicDate" className='user_form'>
                        <Form.Label>Event date</Form.Label>
                        <Form.Control
                            type="date"
                            max={maxDate}
                            name="date"
                            placeholder="select date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group >
                    <NavLink to="/createevent">
                        {!eventCreate ? 
                            <Button className="addButton" type="submit" onClick = {onEventCreatetSubmit}>Create event</Button> :
                            <Button className="addButton" >Create event</Button>
                        }
                    </NavLink>
                    {eventCreate && 
                        <div className="successful_update-Msg">
                            <p >Event succeffully created !! </p>
                            <p > <Link to="/dashboard">Click Here</Link> Navigate to dashboard page </p>
                        </div>
                    }
                    </Form.Group>
                    {errorMsg && <p className="sign_errorMsg">{errorMsg}</p>}
                </div>
            </Form>
        </div>
    );
}

const mapStateToProps = (state) => ({
    profileData: state.auth.profileData
})

export default connect(mapStateToProps) (CreateEvent);