export default (state = {}, action) => {
    switch (action.type) {
        case 'MRCH_DONORUSERFILTERLIST':
            return {
                donationMrchUserDetail: action.donationMrchUserDetail,
                userTotalAmount: action.userTotalAmount,
                path: action.path
            }
        default: 
            return state
    }
}