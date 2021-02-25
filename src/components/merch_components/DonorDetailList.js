import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { history } from '../../routers/AppRouter'
import DashboardNavBar from '../DashboardNavBar'
import { donorMrchUserFilterList } from '../../actions/mrchEventUsrList'

const DonorDetailList = (props) => {

    const [usersSum, setUsersSum] = useState([])
    const [donationUserList, setDonationUserList] = useState([])

    useEffect(() => {
        if (props.donationMrchDetailList){
            const userHolder = props.donationMrchDetailList
            setDonationUserList(list => [...list, ...userHolder])
            var output = Object.values(userHolder.reduce((acc, curr) => {
                    if (acc[curr.userEmail]) acc[curr.userEmail].donAmount += curr.donAmount;
                    else acc[curr.userEmail] = { ...curr };
                    return acc;
                }, {}));
            
            setUsersSum((summary) => [...summary, ...output])
        }
    }, [])
    const path = history.location.pathname
    const onClickStoreEventList = (selectedUser, userTotalAmount) => {
        
        const donationMrchUserDetail = donationUserList.filter((list) => {
                                    return list.userEmail === selectedUser
                                })
        props.donorMrchUserFilterList(donationMrchUserDetail,userTotalAmount,path)
    }

    return (
        <>  
            <DashboardNavBar />
            <h3 className='pageTitle'>Event Donataion Details</h3>
            <Table responsive bordered size="sm" className='summary_table'>
                <thead>
                    <tr>
                        <th>Event User</th>
                        <th>Event Name</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                        {usersSum.map(item => (
                            <tr>
                                <Link to={`/MrchUserDonorList/${item.userEmail}`}>
                                    <td onClick={() => onClickStoreEventList(item.userEmail,item.donAmount)}>{item.userEmail}</td>
                                </Link>
                                <td>{item.assignEvent}</td>
                                <td>{item.donAmount}</td>
                            </tr>
                        ))}
                </tbody>
                <thead>
                    <tr>
                        <th></th>
                        <th>Total =</th>
                        <th>{props.eventTotalAmount}</th>
                    </tr>
                </thead>
                <Link to={`/dashboard`}>
                        <span className='back_navigator'> Back</span>
                </Link>
            </Table>
        </>
    )
}

const mapStateToProps = (state) => ({
    donationMrchDetailList: state.mrchEventList.donationMrchDetailList,
    eventTotalAmount: state.mrchEventList.eventTotalAmount
})

const mapDispatchToProps = (dispatch) => ({
    donorMrchUserFilterList: (donationMrchUserDetail,userTotalAmount,path) => dispatch(donorMrchUserFilterList(donationMrchUserDetail,userTotalAmount, path))
 })

export default connect(mapStateToProps, mapDispatchToProps) (DonorDetailList);