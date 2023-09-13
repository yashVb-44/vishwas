import React, { useEffect, useState } from "react";
import logo_sm from "../../resources/assets/images/image_2023_08_19T05_11_01_553Z.png";
import logo_dark from "../../resources/assets/images/logo-dark.png";
import axios from "axios";
import { Route, useNavigate } from "react-router-dom";

let url = process.env.REACT_APP_API_URL

const Header = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()

    const [settingsData, setSettingsData] = useState({})
    const [adminName, setAdminName] = useState("")

    useEffect(() => {
        async function getSettings() {
            try {
                const res = await axios.get(`${url}/app/settings/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setSettingsData(res?.data?.Settings);
                setAdminName('Admin')
            } catch (error) {
                console.log(error)
            }
        }
        getSettings()
    }, [settingsData])


    const handleSingOut = () => {
        localStorage.removeItem('token');
        Navigate("/login")
    }

    return (
        <>
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box">
                            <a className="logo logo-dark">
                                <span className="logo-sm">
                                    <img src={settingsData?.app_logo} alt="" height="22" />
                                </span>
                                <span className="logo-lg">
                                    <img src={settingsData?.app_logo} alt="" height="20" />
                                </span>
                            </a>

                            <a className="logo logo-light">
                                <span className="logo-sm">
                                    <img src={settingsData?.app_logo} alt="" height="22" />
                                </span>
                                <span className="logo-lg">
                                    <img src={settingsData?.app_logo} alt="" height="20" />
                                </span>
                            </a>
                        </div>

                        <button
                            type="button"
                            className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
                            onClick={() => {
                                document.querySelector('.vertical-menu').classList.toggle("active")
                                document.body.setAttribute("data-sidebar-size", "lg")
                                document.body.classList.add("lg")
                                document.body.classList.remove("sm")
                            }}
                        >
                            <i className="fa fa-fw fa-bars"></i>
                        </button>

                        <form className="app-search d-none d-lg-block">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                />
                                <span className="uil-search">
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                </span>
                            </div>
                        </form>
                    </div>

                    <div className="d-flex">
                        <div className="dropdown d-inline-block d-lg-none ms-2">
                            <button
                                type="button"
                                className="btn header-item noti-icon waves-effect"
                                id="page-header-search-dropdown"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className="uil-search"></i>
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </button>
                            <div
                                className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                aria-labelledby="page-header-search-dropdown"
                            >
                                <form className="p-3">
                                    <div className="m-0">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search ..."
                                                aria-label="Recipient's username"
                                            />
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="submit">
                                                    <i className="mdi mdi-magnify"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="dropdown d-inline-block">

                        </div>

                        <div className="dropdown d-inline-block">
                            <button
                                type="button"
                                className="btn header-item waves-effect"
                                id="page-header-user-dropdown"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <img
                                    className="rounded-circle header-profile-user"
                                    src={settingsData?.app_logo}
                                    alt="Admin"
                                />
                                <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15">
                                    {adminName}
                                </span>
                                <i className="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end">
                                <a className="dropdown-item" onClick={() => Navigate('/generalSettings')}>
                                    <i className="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>{" "}
                                    <span className="align-middle">Settings</span>
                                </a>

                                <a className="dropdown-item" onClick={() => handleSingOut()}>
                                    <i className="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>{" "}
                                    <span className="align-middle" >Sign out</span>
                                </a>
                            </div>
                        </div>

                        <div className="dropdown d-inline-block">
                            <button
                                type="button"
                                className="btn header-item noti-icon right-bar-toggle waves-effect"
                                onClick={() => {
                                    document.body.classList.add("right-bar-enabled")
                                }}
                            >
                                <i className="uil-cog fa fa-cog"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
