export const donorMrchUserFilterList = (donationMrchUserDetail,userTotalAmount,path) => ({
    type: 'MRCH_DONORUSERFILTERLIST',
    donationMrchUserDetail,
    userTotalAmount,
    path
})