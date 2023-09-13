import React from 'react'
import Header from '../../Components/HeaderComp/Header'
import LeftSide from '../../Components/SideBarComp/LeftSide'
import RightSide from '../../Components/SideBarComp/RightSide'
import { Outlet, Route, Routes } from 'react-router-dom'
import ShowUser from '../InnerPages/FrontEndSide/User/ShowUser'
import AddChargesSettings from '../SettingsPages/ChargesSettings/AddChargesSettings'
import ShowForm from '../InnerPages/FrontEndSide/Form/ShowForm'
import MemberShipSettings from '../SettingsPages/ChargesSettings/MemberShipSettings'
import EditUser from '../InnerPages/FrontEndSide/User/EditUser'
import GeneralSettingsMain from '../SettingsPages/GeneralSettings/GeneralSettingsMain'
import GeneralSettings from '../SettingsPages/GeneralSettings/GeneralSettings'
import PageSettings from '../SettingsPages/PagesSettings/PageSettings'
import EditForm from '../InnerPages/FrontEndSide/Form/EditForm'
import DashBoard from './DashBoard'


const HomePage = () => {
    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <LeftSide />
            </div>
            <RightSide />

            <Routes>

                {/* User */}
                <Route exact path='/showUser' element={<ShowUser />} />
                <Route exact path='/editUser' element={<EditUser />} />

                {/* Order */}
                <Route exact path='/showForms' element={<ShowForm />} />
                <Route exact path='/editForm' element={<EditForm />} />

                {/* Settings */}
                <Route exact path='/generalSettings' element={<GeneralSettingsMain />} />
                <Route exact path='/pageSettings' element={<PageSettings />} />

                {/* DashBoard */}
                <Route exact path='/' element={<DashBoard />} />

            </Routes>
        </>
    )
}

export default HomePage
