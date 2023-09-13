import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination, GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from '@mui/material/CircularProgress'
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { editForm } from "../../../../Redux/Actions/FronendActions/FormActions";
import { useDispatch } from "react-redux";
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


let url = process.env.REACT_APP_API_URL

const ShowForm = () => {

    const adminToken = localStorage.getItem('token');

    const dispatch = useDispatch()

    const [formData, setFormData] = useState([]);
    const [formName, setFormName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [minAmountFilter, setMinAmountFilter] = useState('');
    const [maxAmountFilter, setMaxAmountFilter] = useState('');
    const [formTypeFilter, setFormTypeFilter] = useState('')
    const [formStatusFilter, setFormStatusFilter] = useState('')


    const Navigate = useNavigate()

    const columns = [
        {
            field: "_id",
            width: 140,
            headerName: "Id",
        },
        {
            field: "userName",
            width: 140,
            headerName: "User Name",
        },
        {
            field: "userMobNo",
            headerName: "Mobile No",
            width: 130,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "type",
            headerName: "Form Type",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "formDate",
            headerName: "Date",
            width: 130,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "formTime",
            headerName: "Time",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "state",
            headerName: "State",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "city",
            headerName: "City",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "status",
            headerName: "Form Status",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleFormDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="update"
                        onClick={() => handleFormUpdate(params.row._id)}
                    >
                        <i class="fas fa-pencil-alt font-size-16 font-Icon-Up"></i>
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
    ];


    useEffect(() => {
        async function getForm() {
            try {
                const res = await axios.get(`${url}/form/get/all/byadmin`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setFormData(res?.data?.form || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getForm();
    }, [startDateFilter, endDateFilter]);

    const handleFormUpdate = (id) => {
        dispatch(editForm(id))
        Navigate('/editForm')
    }

    const handleFormDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${url}/form/delete/single/${id}`, {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                    .then(() => {
                        setFormData(formData.filter((d) => d?._id !== id) || []);
                        Swal.fire("Success!", "Form has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Form has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultipleFormDelete = () => {
        let idsToDelete = selectedRows

        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${url}/form/deletes/multiple`, {
                        data: {
                            ids: idsToDelete,
                        },
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                    .then(() => {
                        setFormData(formData?.filter((d) => !idsToDelete?.includes(d?._id)) || []);
                        Swal.fire("Success!", "Form has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Form has not been deleted!", "error");
                    });
            }
        });
    };


    const handleFilter = () => {

        const filteredFormList = formData?.filter((form) => {
            const formattedFormName = (form?.name || "").toUpperCase().replace(/\s/g, "");
            let isFormName = true;
            if (formName) {
                isFormName = formattedFormName.includes(formName.toUpperCase().replace(/\s/g, ""));
            }
            return isFormName;
        });

        // Apply date filtering
        let filteredByDate = filteredFormList;
        if (startDateFilter || endDateFilter) {
            filteredByDate = filteredFormList?.filter((form) => {
                let formDate = form?.Date;
                const [day, month, year] = formDate?.split('/');
                const newDate = new Date(year, month - 1, day);
                newDate.setHours(0, 0, 0, 0);

                let isDateInRange = true;
                if (startDateFilter && endDateFilter) {
                    const startDate = new Date(startDateFilter);
                    startDate.setHours(0, 0, 0, 0);

                    const endDate = new Date(endDateFilter);
                    endDate.setHours(0, 0, 0, 0);

                    isDateInRange = newDate >= startDate && newDate <= endDate;
                } else if (startDateFilter) {
                    const startDate = new Date(startDateFilter);
                    startDate.setHours(0, 0, 0, 0);
                    isDateInRange = newDate >= startDate;
                } else if (endDateFilter) {
                    const endDate = new Date(endDateFilter);
                    endDate.setHours(0, 0, 0, 0);
                    isDateInRange = newDate <= endDate;
                }
                return isDateInRange;
            });
        }

        // Apply form type filtering
        let filteredByFormType = filteredByDate;
        if (formTypeFilter) {
            filteredByFormType = filteredByDate?.filter((form) =>
                form?.type?.toUpperCase() === formTypeFilter.toUpperCase()
            );
        }

        // Apply form type filtering
        let filteredByFormStatus = filteredByFormType;
        if (formStatusFilter) {
            filteredByFormStatus = filteredByFormType?.filter((form) =>
                form?.status?.toUpperCase() === formStatusFilter.toUpperCase()
            );
        }

        // Apply form amount filtering
        // let filteredByAmount = filteredByDate;
        // if (minAmountFilter || maxAmountFilter) {
        //     filteredByAmount = filteredByDate?.filter((form) => {
        //         const formAmount = parseFloat(form?.FinalPrice);
        //         let isAmountInRange = true;
        //         if (minAmountFilter && maxAmountFilter) {
        //             const minAmount = parseFloat(minAmountFilter);
        //             const maxAmount = parseFloat(maxAmountFilter);
        //             isAmountInRange = formAmount >= minAmount && formAmount <= maxAmount;
        //         } else if (minAmountFilter) {
        //             const minAmount = parseFloat(minAmountFilter);
        //             isAmountInRange = formAmount >= minAmount;
        //         } else if (maxAmountFilter) {
        //             const maxAmount = parseFloat(maxAmountFilter);
        //             isAmountInRange = formAmount <= maxAmount;
        //         }
        //         return isAmountInRange;
        //     });
        // }



        // Apply search query filtering
        const filteredData = filteredByFormStatus?.filter((form) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(form);
            for (let i = 0; i < rowValues.length; i++) {
                const formattedRowValue = String(rowValues[i]).toUpperCase().replace(/\s/g, "");
                if (formattedRowValue.includes(formattedSearchQuery)) {
                    return true;
                }
            }
            return false;
        });

        return filteredData;
    };


    const getRowId = (row) => row._id;

    const handleCellClick = (params, event) => {
        if (event.target.type !== "checkbox") {
            event.stopPropagation();
        }
    };

    const handleClearFilters = () => {
        setStartDateFilter('');
        setEndDateFilter('');
        setMinAmountFilter('');
        setMaxAmountFilter('');
        setFormTypeFilter('')
        setFormStatusFilter('')
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2 table-heading">
                            Form List
                        </div>
                        <div className="searchContainer mb-3">
                            <div className="searchBarcontainer">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="searchBar"
                                />
                                <ClearIcon className="cancelSearch" onClick={() => setSearchQuery("")} />
                            </div>
                        </div>
                        <div className="col-12">

                            <TextField
                                label='Start Date'
                                type='date'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: '5px', width: "135px" }}
                                value={startDateFilter}
                                onChange={(e) => setStartDateFilter(e.target.value)}
                            />
                            <TextField
                                label='End Date'
                                type='date'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: '5px', width: "135px" }}
                                value={endDateFilter}
                                onChange={(e) => setEndDateFilter(e.target.value)}
                            />
                            <FormControl style={{ margin: '2px', width: "135px" }} variant="outlined" className="dropdown">
                                <InputLabel>Form Type</InputLabel>
                                <Select
                                    value={formTypeFilter}
                                    onChange={(e) => setFormTypeFilter(e.target.value)}
                                    label="Form Type"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="Criminal">Criminal</MenuItem>
                                    <MenuItem value="Lost">Lost</MenuItem>
                                    <MenuItem value="Dead">Dead</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl style={{ margin: '2px', width: "135px" }} variant="outlined" className="dropdown">
                                <InputLabel>Form Status</InputLabel>
                                <Select
                                    value={formStatusFilter}
                                    onChange={(e) => setFormStatusFilter(e.target.value)}
                                    label="Form Status"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Approved">Approved</MenuItem>
                                    <MenuItem value="Complete">Complete</MenuItem>
                                </Select>
                            </FormControl>


                            {/* <TextField
                                label='Min Amount'
                                type='number'
                                value={minAmountFilter}
                                onChange={(e) => setMinAmountFilter(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: '5px', width: "120px" }}
                                placeholder='Min Amount'
                            />
                            <TextField
                                label='Max Amount'
                                type='number'
                                value={maxAmountFilter}
                                onChange={(e) => setMaxAmountFilter(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: '5px', width: "120px" }}
                                placeholder='Max Amount'
                            /> */}

                            <a className="btn btn-danger waves-effect waves-light" style={{ margin: '12px' }} onClick={() => handleClearFilters()}>
                                Clear Filters
                            </a>

                            {/* <div className="card"> */}
                            <div className="datagrid-container">
                                <DataGrid
                                    style={{ textTransform: "capitalize" }}
                                    rows={handleFilter()}
                                    columns={columns}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    getRowId={getRowId}
                                    filterPanelDefaultOpen
                                    filterPanelPosition="top"
                                    slots={{
                                        toolbar: (props) => (
                                            <div>
                                                <GridToolbar />
                                            </div>
                                        ),
                                    }}
                                    loading={isLoading}
                                    onCellClick={handleCellClick}
                                    onRowSelectionModelChange={(e) => setSelectedRows(e)}
                                    initialState={{
                                        pagination: { paginationModel: { pageSize: 10 } },
                                    }}
                                    pageSizeOptions={[10, 25, 50, 100]}
                                />
                                {selectedRows.length > 0 && (
                                    <div className="row-data">
                                        <div>{selectedRows.length} Categories selected</div>
                                        <DeleteIcon
                                            style={{ color: "red" }}
                                            className="cursor-pointer"
                                            onClick={() => handleMultipleFormDelete()}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowForm;
