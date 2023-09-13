import axios from 'axios'
import React, { useEffect, useState } from 'react'
import rejectImage from '../../../src/resources/assets/images/reject_order.png'
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

let url = process.env.REACT_APP_API_URL

const DashBoard = () => {

    const adminToken = localStorage.getItem('token');

    const [formData, setFormData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const data = {
        startDate: startDate,
        endDate: endDate
    }


    useEffect(() => {
        async function fetchFormData() {
            try {
                const res = await axios.post(`${url}/form/get/byStatus/forAdmin`,
                    data,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                setFormData(res.data || []);
            } catch (error) {
                console.log(error)
            }
        }

        fetchFormData(startDate, endDate);
    }, [startDate, endDate]);

    const handleClearFilters = () => {
        setStartDate("")
        setEndDate("")
    };


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className='row'>
                            <div className="col-2 table-heading">
                                DashBoard
                            </div>
                            <div className="col-12 mt-2">
                                <div className="mt-4">
                                    <div className="card-body">

                                        <TextField
                                            label='Start Date'
                                            type='date'
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ margin: '5px', width: "135px" }}
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                        <TextField
                                            label='End Date'
                                            type='date'
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ margin: '5px', width: "135px" }}
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />

                                        <a className="btn btn-danger waves-effect waves-light" style={{ margin: '12px' }} onClick={() => handleClearFilters()}>
                                            Clear Filters
                                        </a>

                                        <div className="row mt-2">

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="total-revenue-chart" data-colors='["--bs-primary"]'>
                                                                <img src={rejectImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{formData?.totalForm}</span></h4>
                                                            <p className="text-muted mb-0">Total Form</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                                className="mdi mdi-arrow-up-bold me-1"></i>2.65%</span>
                                                            since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="forms-chart" data-colors='["--bs-success"]'>
                                                                <img src={rejectImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{formData?.PendingForm}</span></h4>
                                                            <p className="text-muted mb-0">Pending Form</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-danger me-1"><i
                                                                className="mdi mdi-arrow-down-bold me-1"></i>0.82%</span>
                                                            since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="growth-chart" data-colors='["--bs-warning"]'>
                                                                <img src={rejectImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{formData?.ApprovedForm}</span></h4>
                                                            <p className="text-muted mb-0">Approved Forms</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                            className="mdi mdi-arrow-up-bold me-1"></i>10.51%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="customers-chart" data-colors='["--bs-primary"]'>
                                                                <img src={rejectImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{formData?.CompleteForm}</span></h4>
                                                            <p className="text-muted mb-0">Complete Forms</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-danger me-1"><i
                                                            className="mdi mdi-arrow-down-bold me-1"></i>6.24%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashBoard
