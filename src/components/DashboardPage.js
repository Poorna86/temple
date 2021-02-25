import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import axios from 'axios'
import moment from 'moment'
import DashboardNavBar from './DashboardNavBar'
import Header from './Header'
import { donorMrchFilterList } from '../actions/mrchEventList'

const DashboardPage = (props) => {
    const [eventList, setEventList] = useState([])
    const [donationUsersList, setDonationUsersList] = useState([])
    const [eventSummary, setEventSummary] = useState([])

    useEffect(() => {
        if (!props.profileData || !eventList.length > 0) {
            (async () => {
            const eventsList = await axios.get("http://localhost:3000/api/dashboard")
            const response = eventsList.data.upcomingEventDetails
            
            setEventList((eventList) => [...eventList, ...response])
            
            const donationsList = eventsList.data.donationUserList

            donationsList.map(item1 => {
                const donationDate = item1.donationDate.substring(0,10)
                item1.donationDate = moment(donationDate,'YYYY-MM-DD').format('DD MMM YYYY')
                return item1
            })
            
            setDonationUsersList((donationList) => [...donationList, ...donationsList])
            
                let userHolder = Object.values(donationsList.reduce((acc, curr) => {
                    if (acc[curr.eventName]) acc[curr.eventName].donAmount += curr.donAmount;
                    else acc[curr.eventName] = { ...curr };
                    return acc;
                   }, {}));
                
            setEventSummary((summary) => [...summary, ...userHolder])
            })();
        }
    }, [])

    const eventListRender = eventList.length > 0 ?
                          eventList.map((item) => { 
                              const eventDate = item.eventDate.substring(0,10)
                          return    <Carousel.Item className='event_background'>
                                        <p>{item.eventName}</p>
                                        <p>{moment(eventDate,'YYYY-MM-DD').format('DD MMM YYYY')}</p>
                                    </Carousel.Item>
                          }) :
                          <Carousel.Item className='no_event'>No upcoming events</Carousel.Item>
    
    const onClickStoreEventList = (selectedEvent, eventTotalAmount) => {
        
        const donationMrchDetailList = donationUsersList.filter((list) => {
                                    return list.assignEvent === selectedEvent
                                })
                                
        props.donorMrchFilterList(donationMrchDetailList,eventTotalAmount)
    }
    
    return (
        <div>
            <DashboardNavBar />
            <Header />
            <div className='header_title'>
                {eventList.length > 0 && <h3>Upcoming Events</h3>}
                <Carousel>
                    {eventListRender}
                </Carousel>
            </div>
            <Table striped bordered hover size="sm" className='summary_table'>
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {eventSummary.length ?
                        eventSummary.map(item => (
                            <tr key = {eventSummary.assignEvent}>
                                <Link to={`/MrchDonorList/${item.assignEvent}`}>
                                    <td onClick={() => onClickStoreEventList(item.assignEvent,item.donAmount)}>{item.assignEvent}</td>
                                </Link>
                                <td>{item.donAmount}</td>
                            </tr>
                        )) :
                            <tr>
                                <td>No Donations</td>
                            </tr>
                    }
                </tbody>
            </Table>    
        </div>
    );
}

const mapStateToProps = (state) => ({
    profileData: state.auth.profileData
})

const mapDispatchToProps = (dispatch) => ({
    donorMrchFilterList: (donationMrchDetailList, eventTotalAmount) => dispatch(donorMrchFilterList(donationMrchDetailList, eventTotalAmount))
 })

export default connect(mapStateToProps, mapDispatchToProps) (DashboardPage);