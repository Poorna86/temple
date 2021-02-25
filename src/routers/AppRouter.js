import React, { useEffect } from 'react'
import {Router, Route , Switch} from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import Cookies from 'js-cookie'
import { HomePage } from '../components/HomePage'
import DashboardPage from '../components/DashboardPage'
import ProfileEditPage from '../components/merch_components/ProfileEditPage'
import CreateUser from '../components/merch_components/CreateUser'
import CreateEvent from '../components/merch_components/CreateEvent'
import UserDashboard from '../components/user_components/UserDashboard'
import UserProfielEdit from '../components/user_components/UserProfileEdit'
import UserDonationReceipt from '../components/user_components/UserDonationReceipt'
import UserDonorList from '../components/user_components/UserDonorList'
import DonorDetailList from '../components/merch_components/DonorDetailList'
import DonorUserDetailList from '../components/merch_components/DonorUserDetailList'

export const history = createHistory()

const AppRouter = () => {
    
    useEffect(() => {
        const token = Cookies.get('auth_token')
        
        if (!token) {
            const userToken = Cookies.get('user_token')
            if(userToken) {
                history.push('/userdashboard')
            } else {
                history.push('/')
            }
        } else if(token){
            history.push('/dashboard')
        }
    }, []);

    return (
        <Router history={history}>
            <>
                <Switch>
                    <Route path={["/","/merch/login","/merch/signup","/user/login","/user/signup"]} component={HomePage} exact={true}/>
                    <Route path="/dashboard" component={DashboardPage} />
                    <Route path="/profileedit" component={ProfileEditPage} />
                    <Route path="/createuser" component={CreateUser} />
                    <Route path="/createevent" component={CreateEvent} />
                    <Route path="/userdashboard" component={UserDashboard} exact />
                    <Route path="/Userprofileedit" component={UserProfielEdit} /> 
                    <Route path="/userdonorreceipt" component={UserDonationReceipt} />
                    <Route path="/userdashboard/UserDonorList/:event/:user" component={UserDonorList} />
                    <Route path="/MrchDonorList/:id" component={DonorDetailList} />
                    <Route path="/MrchUserDonorList/:id" component={DonorUserDetailList} />
                </Switch>
            </>
        </Router>
        )
    }

export {AppRouter as default}