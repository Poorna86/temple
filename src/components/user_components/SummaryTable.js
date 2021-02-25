import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import moment from 'moment'
import { userDonorFilterList } from '../../actions/userDonationDetails'

const SummaryTable = (props) => {

    const [donationsSummary, setDonationSummary] = useState([])
    const [donationsList, setDonationList] = useState([])

    useEffect(() => {
            (async () => {
                const totalDonations = await axios.get(
                    "http://localhost:3000/api/userdashboard"
                );
                totalDonations.data.map(item => {
                    const donationDate = item.donationDate.substring(0,10)
                    item.donationDate = moment(donationDate,'YYYY-MM-DD').format('DD MMM YYYY')
                    return item
                })
                
                setDonationList(donationList => [...donationList, ...totalDonations.data])
                const userHolder = totalDonations.data
                
                var output = Object.values(userHolder.reduce((acc, curr) => {
                    if (acc[curr.assignEvent]) acc[curr.assignEvent].donAmount += curr.donAmount;
                    else acc[curr.assignEvent] = { ...curr };
                    return acc;
                    }, {}));
                console.log('output : ', output)    
                setDonationSummary((donationsSummary) => [...donationsSummary, ...output])
            })();
      }, []);

      const onClickStoreEventList = (selectedEvent) => {
          
          const donationDetailList = donationsList.filter((list) => {
                                        return list.assignEvent === selectedEvent
                                    })
          props.userDonorFilterList(donationDetailList)
      }

    return (
        <>
            <h3 className='pageTitle'>Donataion Summary</h3>
            <Table striped bordered hover size="sm" className='summary_table'>
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {donationsSummary.length ?
                        donationsSummary.map(item => (
                            <tr key = {donationsSummary.assignEvent}>
                                <Link to={`/userdashboard/UserDonorList/${item.assignEvent}/${item.userEmail}`}>
                                    <td onClick={() => onClickStoreEventList(item.assignEvent)}>{item.assignEvent}</td>
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
        </>
    )
}

const mapDispatchToProps = (dispatch) => ({
    userDonorFilterList: (donationDetailList) => dispatch(userDonorFilterList(donationDetailList))
 })

 export default connect(undefined, mapDispatchToProps)(SummaryTable) 