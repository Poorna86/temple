import React from 'react'
import { connect } from 'react-redux'
import UserDashboardNavBar from './UserDashboardNavBar'
import SummaryTable from './SummaryTable'

const UserDashboard = () => {

    return (
        <div>
            <UserDashboardNavBar />
            <SummaryTable />
        </div>
    );
}

const mapStateToProps = (state) => ({
    userDetails: state.auth.userDetails
})

export default connect(mapStateToProps) (UserDashboard)