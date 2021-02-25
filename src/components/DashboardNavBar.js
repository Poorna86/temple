import React from 'react'
import DashboardHeader from './user_components/DashboardHeader'
import ProfileEditPage from './merch_components/ProfileEditPage'
import { history } from '../routers/AppRouter'

const DashboardNavBar = () => {
        
        return (
            <div>
                <DashboardHeader />
                {history.location.pathname === '/profileedit' && 
                  <ProfileEditPage />
                }
           </div>
        );
    }

export default DashboardNavBar;