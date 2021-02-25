import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import DashboardNavBar from '../DashboardNavBar'

const DonorUserDetailList = (props) => {
    
    const [ donationMrchUserDetail, setDonationMrchUserDetail ] = useState([])

    useEffect(() => {
        if(props.donationMrchUserDetail){
            const mrchuserList = props.donationMrchUserDetail
            setDonationMrchUserDetail(list => [...list, ...mrchuserList])
        }
    },[])


    return (
        <>  
            <DashboardNavBar />
            <h3 className='pageTitle'>User Donataion Details</h3>
            <Table responsive bordered size="sm" className='summary_table'>
                <thead>
                    <tr>
                        <th>Event User</th>
                        <th>Event Name</th>
                        <th>Donor Name</th>
                        <th>Donation Amount</th>
                        <th>Donor Phone</th>
                        <th>Donataion Date</th>
                    </tr>
                </thead>
                <tbody>
                        {donationMrchUserDetail.map(item => (
                            <tr>
                                <td>{item.userEmail}</td>
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
                        <th></th>
                        <th>Total =</th>
                        <th>{props.userTotalAmount}</th>
                    </tr>
                </thead>
                <Link to={props.path}>
                    <span className='back_navigator'> Back</span>
                </Link>
            </Table>
        </>
    )
}

const mapStateToProps = (state) => ({
    donationMrchUserDetail: state.mrchEventUsrDetails.donationMrchUserDetail,
    userTotalAmount: state.mrchEventUsrDetails.userTotalAmount,
    path: state.mrchEventUsrDetails.path
})

export default connect(mapStateToProps) (DonorUserDetailList);