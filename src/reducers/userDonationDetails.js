export default (state = {}, action) => {
    switch (action.type) {
        case 'USER_DONORFILTERLIST': 
            return {
                donationDetailList: action.donationDetailList
        }
        default: 
            return state    
    }
}