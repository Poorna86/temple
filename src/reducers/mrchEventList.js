export default (state = {}, action) => {
  switch (action.type) {
      case 'MRCH_DONOREVENTFILTERLIST': 
          return {
              donationMrchDetailList: action.donationMrchDetailList,
              eventTotalAmount: action.eventTotalAmount
      }
      default: 
          return state    
  }
}