import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import moment from 'moment'
import { donorFilterList } from '../../actions/auth'

const UpcomingEventReport = (props) => {

    const [eventReportSummary, setEventReportSummary] = useState([])

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
                console.log('total Donations: ', totalDonations.data)
                setDonationList(donationList => [...donationList, ...totalDonations.data])
                const donationsList = totalDonations.data
                var holder = {}
                donationsList.forEach(function(d) {
                if (holder.hasOwnProperty(d.assignEvent)) {
                    holder[d.assignEvent] = holder[d.assignEvent] + d.donAmount;
                } else {
                    holder[d.assignEvent] = d.donAmount;
                }
                });
                var obj2 = [];
                for (var prop in holder) {
                    obj2.push({ assignEvent: prop, donAmount: holder[prop] });
                    } 
                setDonationSummary((donationsSummary) => [...donationsSummary, ...obj2])
            })();
      }, []);

      const onClickStoreEventList = (selectedEvent) => {
          
          const donationDetailList = donationsList.filter((list) => {
                                        return list.assignEvent === selectedEvent
                                    })
          props.donorFilterList(donationDetailList)
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
                                <Link to={`/UserDonarList/${item.assignEvent}`}>
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
    donorFilterList: (donationDetailList) => dispatch(donorFilterList(donationDetailList))
 })

 export default connect(undefined, mapDispatchToProps)(UpcomingEventReport) 