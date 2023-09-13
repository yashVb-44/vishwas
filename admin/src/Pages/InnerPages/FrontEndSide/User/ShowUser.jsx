import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination, GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import userImage from '../../../../resources/assets/images/3135715.png'
import { useDispatch } from "react-redux";
import { editUser } from "../../../../Redux/Actions/FronendActions/UserActionsAction";

let url = process.env.REACT_APP_API_URL

const ShowUser = () => {

    const adminToken = localStorage.getItem('token');

    const [userData, setUserData] = useState([]);
    const [userName, setUserName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)

    const Navigate = useNavigate()
    const dispatch = useDispatch()

    const columns = [
        {
            field: "_id",
            width: 220,
            headerName: "Id",
        },
        {
            field: "name",
            headerName: "Name",
            width: 130,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "image",
            headerName: "Image",
            width: 110,
            renderCell: (params) => (
                <img
                    src={`${params?.value}` !== "undefined" ? `${params?.value}` : userImage}
                    alt="User Image"
                    height={35}
                    width={35}
                    style={{ borderRadius: '50%' }}
                />
            ),
            sortable: false,
        },
        {
            field: "email",
            headerName: "Email",
            width: 190,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "mobileNo",
            headerName: "Mobile No",
            width: 115,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        // {
        //     field: "Block",
        //     headerName: "Block",
        //     width: 85,
        //     renderCell: (params) => (
        //         <div className="form-check form-switch-user">
        //             <input
        //                 type="checkbox"
        //                 className="form-check-input"
        //                 id={`customSwitch-${params.id}`}
        //                 onChange={() => handleUserStatus(params.row, !params.value)}
        //                 checked={params.value}
        //                 onClick={(event) => event.stopPropagation()}
        //             />
        //             <label
        //                 className="form-check-label"
        //                 htmlFor={`customSwitch-${params.id}`}
        //                 style={{ color: params.value ? "red" : "grey" }}
        //             >
        //                 {params.value ? "Block" : "UnBlock"}
        //             </label>
        //         </div>
        //     ),
        //     filterable: false,
        //     sortable: true,
        //     hide: false,
        // },
        {
            field: "action",
            headerName: "Action",
            width: 80,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleUserDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
    ];

    useEffect(() => {
        async function getUser() {
            try {
                const res = await axios.get(`${url}/user/get/all`, {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                });
                setUserData(res?.data?.user || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getUser();
    }, []);


    const handleUserDelete = (id) => {
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
                    .delete(`${url}/user/delete/${id}`, {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                    .then(() => {
                        setUserData(userData.filter((d) => d?._id !== id) || []);
                        Swal.fire("Success!", "User has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "User has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultipleUserDelete = () => {
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
                    .delete(`${url}/user/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                    .then(() => {
                        setUserData(userData?.filter((d) => !idsToDelete?.includes(d?._id)) || []);
                        Swal.fire("Success!", "User has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "User has not been deleted!", "error");
                    });
            }
        });
    };

    // const handleUserStatus = async (user, newStatus) => {
    //     try {
    //         await axios.patch(
    //             `${url}/user/update/status/${user?._id}`,
    //             {
    //                 Block: newStatus,
    //             }
    //         );

    //         const updatedUserData = userData.map((c) =>
    //             c._id === user._id ? { ...c, Block: newStatus } : c
    //         );
    //         setUserData(updatedUserData || []);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const handleFilter = () => {
        const filteredUserList = userData?.filter((user) => {
            const formattedUserName = (user?.name || "").toUpperCase().replace(/\s/g, "");
            let isUserName = true;
            if (userName) {
                isUserName = formattedUserName.includes(userName.toUpperCase().replace(/\s/g, ""));
            }

            return isUserName;
        });

        // Apply search query filtering
        const filteredData = filteredUserList.filter((user) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(user);
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

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2 table-heading">
                            User List
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
                                        <div>{selectedRows.length} Users selected</div>
                                        <DeleteIcon
                                            style={{ color: "red" }}
                                            className="cursor-pointer"
                                            onClick={() => handleMultipleUserDelete()}
                                        />
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowUser;
