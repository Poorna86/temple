export default (state = {}, action) => {
    switch (action.type) {
        case 'MERCHANT_LOGIN': 
            return {
                loginStatus: action.loginStatus,
                profileData: action.profileData
            }
        case 'USER_LOGIN': 
            return {
                loginStatus: action.loginStatus,
                userDetails: action.userDetails
            }
        case 'MERCHANT_SIGNUP': 
            return {
                merchSignup: action.merchSignup
        }
        case 'USER_DONORFILTERLIST': 
            return {
                donationDetailList: action.donationDetailList
        }
        case 'MRCH_DONORFILTERLIST': 
            return {
                donationMrchDetailList: action.donationMrchDetailList,
                eventTotalAmount: action.eventTotalAmount
        }
        case 'MRCH_DONORUSERFILTERLIST':
            return {
                donationMrchUserDetail: action.donationMrchUserDetail,
                userTotalAmount: action.userTotalAmount
            }
        case 'LOGOUT': 
            return {}
        default: 
            return state    
    }
}