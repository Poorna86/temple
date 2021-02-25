export const merchantLogin = (loginStatus, profileData) => ({
    type: 'MERCHANT_LOGIN',
    loginStatus,
    profileData
})

export const merchantSignUp = (merchSignup) => ({
    type: 'MERCHANT_SIGNUP',
    merchSignup
})

export const merchantLogout = () => ({
    type: 'LOGOUT'
})

export const userLogin = (loginStatus, userDetails, userEvent) => ({
    type: 'USER_LOGIN',
    loginStatus,
    userDetails,
    userEvent
})