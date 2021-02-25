import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import { Table } from 'react-bootstrap'
import axios from 'axios'
import UserDashboardNavBar from './UserDashboardNavBar'

const UserDonarList = (props) => {
    const [totalAmount, setTotalAmount] = useState()
    const [donationDetailList, setDonationDetailList] = useState([])
    
    useEffect(() => {
        if(props.donationDetailList) {
            const userHolder = props.donationDetailList
            setDonationDetailList(list => [...list,...userHolder])
            
            const output = Object.values(userHolder.reduce((acc, curr) => {
                    if (acc[curr.assignEvent]) acc[curr.assignEvent].donAmount += curr.donAmount;
                    else acc[curr.assignEvent] = { ...curr };
                    return acc;
                }, {}));
            const sumAmount = output[0]
            
            setTotalAmount(sumAmount.donAmount)
        }
    }, []);
    
    return (
        <>  
            <UserDashboardNavBar />
            <h3 className='pageTitle'>Donataion Details</h3>
            <Table responsive bordered size="sm" className='summary_table'>
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>donor Name</th>
                        <th>donor Amount</th>
                        <th>donor Phone</th>
                        <th>donation Date</th>
                    </tr>
                </thead>
                <tbody>
                        {donationDetailList.map(item => (
                            <tr key = {donationDetailList.donorName}>
                                <td>{item.assignEvent}</td>
                                <td>{item.donorName}</td>
                                <td>{item.donAmount}</td>
                                <td>{item.donPhone}</td>
                                <td>{item.donationDate}</td>
                            </tr>
                        ))}
                </tbody>
                <thead>
                    <tr>
                        <th></th>
                        <th>Total =</th>
                        <th>{totalAmount}</th>
                    </tr>
                </thead>
            </Table>
        </>
    )
}

const mapStateToProps = (state) => ({
    donationDetailList: state.userDondetails.donationDetailList
})

export default connect(mapStateToProps) (UserDonarList);