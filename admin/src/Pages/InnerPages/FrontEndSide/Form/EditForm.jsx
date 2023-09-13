import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

let url = process.env.REACT_APP_API_URL

const ShowFormDetails = () => {

    const adminToken = localStorage.getItem('token');

    // this data provided by redux store
    const selectFormId = useSelector((state) => state?.FormDataChange?.payload)
    const navigate = useNavigate()
    const [formDetails, setFormDetails] = useState([])
    const [formType, setFormType] = useState()

    useEffect(() => {
        async function getFormDetails() {
            try {
                let response = await axios.get(`${url}/form/get/admin/single/${selectFormId}`, {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                })
                setFormDetails(response?.data?.form || [])
            } catch (error) {

            }
        }

        getFormDetails()
    }, [formDetails])


    // for create formType
    const createFormType = ['Pending', 'Approved', 'Complete']

    // for update formType
    const handleUpdateFormType = async () => {
        try {
            let response = await axios.patch(`${url}/form/update/status/byadmin/${selectFormId}`, { status: formType } ,  {
                headers: {
                    Authorization: `${adminToken}`,
                },
            })
            console.log(response, "rez")
            if (response?.data?.type === 'success') {
                navigate('/showForms')
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className='row'>
                            <div className="col-2 table-heading">
                                Edit Forms
                            </div>
                            <div className="col-12 mt-2">
                                <div className="card">
                                    <div className="card-body">
                                        <form >
                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    User Details :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        User Name :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.userName} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Mobile Number :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="phone" id="phone" value={formDetails?.userMobNo} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    Form Details :
                                                </label>
                                                <div className="mb-1 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Form Id :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?._id} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                                <div className="mb-1 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Form Type :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.type} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                                <div className="mb-1 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Name :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.name} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                                <div className="mb-1 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Age :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.age} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                                <div className="mb-1 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Mobile No :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.mobileNo} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                                <div className="mb-1 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Contact Details :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.contactDetails} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                                <div className="mb-1 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Details :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <textarea type="text" name="name" id="name" value={formDetails?.details} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                                <div className="mb-1 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Extra Details :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <textarea type="text" name="name" id="name" value={formDetails?.extraDetails} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                                <div className="mb-1 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Form Images :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        {formDetails?.images?.map((image => {
                                                            return <img src={image} height={200} width={200} style={{ marginRight: "20px" }} />
                                                        }))}
                                                    </div>
                                                </div>
                                            </div>


                                            <div className='mt-3' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    Address Details :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Full Address:-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <textarea type="text" name="name" id="name" value={formDetails?.address} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">

                                                    </label>
                                                    <div className="col-md-5 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.city} className="form-control" readOnly />
                                                    </div>
                                                    <div className="col-md-5 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.state} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Date :-
                                                    </label>
                                                    <div className="col-md-4 mt-1">
                                                        <input type="text" name="phone" id="phone" value={formDetails?.date} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                            </div>


                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    Created Form :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Date & time :-
                                                    </label>
                                                    <div className="col-md-5 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.formDate} className="form-control" readOnly />
                                                    </div>
                                                    <div className="col-md-5 mt-1">
                                                        <input type="text" name="name" id="name" value={formDetails?.formTime} className="form-control" readOnly />
                                                    </div>

                                                </div>
                                            </div>

                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    Form Status :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Form Id :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <select name="o_type" id="o_type" style={{ width: "30%", height: "100%" }} className="select2" onChange={(e) => setFormType(e.target.value)} required>
                                                            {createFormType?.map((formType, index) => {
                                                                if (formDetails?.status === formType) {
                                                                    return <option key={index} value={index} selected>{formType}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={index}>{formType}</option>
                                                                }
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => navigate('/showForms')}>
                                                            {" "}
                                                            <i className="fas fa-window-close"></i> Cancel{" "}
                                                        </a>
                                                        <a className="btn btn-success" onClick={handleUpdateFormType}>
                                                            {" "}
                                                            <i className="fas fa-save"></i> Save{" "}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShowFormDetails
