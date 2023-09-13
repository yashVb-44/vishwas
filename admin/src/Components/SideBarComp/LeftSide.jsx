import React, { useEffect, useState } from "react";
import logo_sm from "../../resources/assets/images/image_2023_08_19T05_11_01_553Z.png";
// import logo_sm from "../../resources/assets/images/logo-sm.png";
import logo_dark from "../../resources/assets/images/logo-dark.png";
import down_arrow from "../../resources/assets/images/down-arrow.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

let url = process.env.REACT_APP_API_URL

const LeftSide = () => {
    const Navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("");

    // get current url
    useEffect(() => {
        const currentURL = window.location.href;
        const url = new URL(currentURL);
        const point = url.pathname.split("/").pop();
        setActiveMenu(point);
    });

    const [settingsData, setSettingsData] = useState({})

    useEffect(() => {
        async function getSettings() {
            try {
                try {
                    const res = await axios.get(`${url}/app/settings/get`);
                    setSettingsData(res?.data?.Settings);
                } catch (error) {

                }
            } catch (error) {

            }
        }
        getSettings()
    }, [settingsData])

    return (
        <>
            <div className="vertical-menu">
                <div className="navbar-brand-box">
                    <a className="logo logo-dark">
                        <span className="logo-sm">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                        <span className="logo-lg">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                    </a>

                    <a className="logo logo-light">
                        <span className="logo-sm">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                        <span className="logo-lg">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                    </a>
                </div>

                <button
                    type="button"
                    className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
                    onClick={() => {
                        document.body.setAttribute("data-sidebar-size", "sm");
                        document.body.classList.add("sidebar-enable");
                        document.body.classList.add("sm");
                        document.body.classList.remove("lg");
                    }}
                >
                    <i className="fa fa-fw fa-bars"></i>
                </button>

                <div data-simplebar className="sidebar-menu-scroll">
                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                            <li className="menu-title">Menu</li>

                            <li
                                className={`${activeMenu === "" ? "mm-active" : ""}`}
                                onClick={() => {
                                    Navigate("/");
                                }}
                            >
                                <a className={`${activeMenu === "" ? "active" : ""}`}>
                                    <i className="uil-home-alt">
                                        <i className="fas fa-home" aria-hidden="true"></i>
                                    </i>
                                    <span>Dashboard</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === "generalSettings" ||
                                    activeMenu === "pageSettings"
                                    ? "mm-active" : ""}`}
                            >
                                <a
                                    className={`${activeMenu === "generalSettings" ||
                                        activeMenu === "pageSettings"

                                        ? "active" : ""
                                        } waves-effect d-flex sub-drop`}
                                    onClick={() => {
                                        document
                                            .querySelector(".sub-menu1")
                                            .classList.toggle("active");
                                        document.querySelector("#w-243").classList.toggle("active");
                                    }}
                                >
                                    <div>
                                        <i className="uil-store">
                                            <i className="fas fa-cogs" aria-hidden="true"></i>
                                        </i>
                                        <span style={{ marginLeft: "3px" }}>Settings</span>
                                    </div>
                                    <img className="w-24" id="w-243" src={down_arrow} />
                                </a>
                                <ul className="sub-menu sub-menu1" aria-expanded="false">

                                    <li
                                        onClick={() => {
                                            Navigate("/generalSettings");
                                        }}
                                        style={{ cursor: "pointer" }}
                                        className={`${activeMenu === "generalSettings" ? "mm-active" : ""}`}

                                    >
                                        <a>General Settings</a>
                                    </li>
                                    <li
                                        onClick={() => {
                                            Navigate("/pageSettings");
                                        }}
                                        style={{ cursor: "pointer" }}
                                        className={`${activeMenu === "pageSettings" ? "mm-active" : ""}`}

                                    >
                                        <a>Page Settings</a>
                                    </li>
                                </ul>
                            </li>


                            <li className="menu-title">Apps</li>


                            <li
                                className={`${activeMenu === `showUser`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showUser");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showUser`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-user"></i>
                                    </i>
                                    <span>Users</span>
                                </a>
                            </li>


                            <li
                                className={`${activeMenu === `showForms` ||
                                    activeMenu === `editForm`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showForms");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showForms` ||
                                        activeMenu === `editForm`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-clipboard-list"></i>
                                    </i>
                                    <span>Forms</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showTimeZone` ||
                                    activeMenu === `addTimeZone` ||
                                    activeMenu === `editTimeZone`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showTimeZone");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showTimeZone` ||
                                        activeMenu === `addTimeZone` ||
                                        activeMenu === `editTimeZone`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-clock"></i>
                                    </i>
                                    <span>Time Zone</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeftSide;
