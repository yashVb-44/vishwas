//  latest for use

import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

const Datatabledemo = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    // const dispatch = useDispatch()
    const navigate = useNavigate()

    const columns = [
        {
            name: "_id",
            label: "Id",
            options: {
                display: "excluded",
                filter: false,
            },
        },
        {
            name: "Category_Name",
            label: "Name",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "Category_Image",
            label: "Image",
            options: {
                customBodyRender: (image) => (
                    <img
                        src={`http://localhost:5000/${image?.path}`}
                        height={40}
                        width={40}
                    />
                ),
                filter: false,
                sort: false,
            },
        },
        {
            name: "Category_Status",
            label: "Status",
            options: {
                customBodyRender: (status, tableMeta) => (
                    <div className="form-check form-switch">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitch1"
                            onChange={() => handleCategoryStatus(tableMeta?.rowData, !status)}
                            checked={status}
                        />
                        <label className="form-check-label" for="customSwitch1"
                            style={{ color: status ? "green" : "grey" }}>
                            {status ? "Enable" : "Disable"}
                        </label>
                    </div>
                ),
                customFilterListOptions: {
                    render: (v) => `Status: ${v ? "Enable" : "Disable"}`,
                },
            },
        },
        {
            name: "action",
            label: "Action",
            options: {
                customBodyRender: (value, tableMeta) => {
                    const id = tableMeta?.rowData[0];
                    const category = tableMeta?.rowData;
                    return (
                        <Stack direction="row">
                            <IconButton
                                aria-label="delete"
                                onClick={() => handleCategoryDelete(id)}
                            >
                                <DeleteIcon className="deleteIcon" />
                            </IconButton>
                            <IconButton>
                                <EditIcon
                                    className="editIcon"
                                    onClick={() => handleCategoryUpdate(category)}
                                />
                            </IconButton>
                        </Stack>
                    );
                },
                filter: false,
                sort: false,
            },
        },
    ];

    useEffect(() => {
        async function getCategory() {
            const res = await axios.get("http://localhost:5000/category/get");
            setCategoryData(res?.data?.category);
        }
        getCategory();
    }, []);

    // for delete category
    const handleCategoryDelete = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios
                    .delete(`http://localhost:5000/category/delete/${id}`)
                    .then(() => {
                        setCategoryData(categoryData.filter((d) => d?._id !== id));
                        swal("Success! Category has been deleted!", {
                            icon: "success",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        swal("Error! Category has not deleted!", {
                            icon: "error",
                        });
                    });
            }
        });
    };

    // update category
    const handleCategoryUpdate = (category) => {
        // dispatch(updateCategory(category))
        // navigate('/home/editCategory')
    };

    // for update status
    const handleCategoryStatus = async (category, newStatus) => {
        try {
            await axios.patch(
                `http://localhost:5000/category/update/status/${category?.[0]}`,
                {
                    Category_Status: newStatus,
                }
            );

            const res = await axios.get("http://localhost:5000/category/get");
            setCategoryData(res?.data?.category);
        } catch (error) {
            console.log(error);
        }
    };

    const customSearchRender = (
        searchText,
        handleSearch,
        hideSearch,
        options
    ) => {
        console.log("handlese", searchText);
        return (
            <div className="custom-search">
                <input
                    type="text"
                    className="custom-search-input"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search category..."
                />
                <IconButton aria-label="clear search" onClick={hideSearch}>
                    <ClearIcon />
                </IconButton>
            </div>
        );
    };

    const handleFilter = () => {
        const filteredCategoryList = categoryData?.filter((category) => {
            const formattedCategoryName = (category?.name || "")
                .toUpperCase()
                .replace(/\s/g, "");
            let isCategoryName = true;
            if (categoryName) {
                isCategoryName = formattedCategoryName.includes(
                    categoryName.toUpperCase().replace(/\s/g, "")
                );
            }

            return isCategoryName;
        });
        return filteredCategoryList;
    };

    const options = {
        selectableRows: "multiple",
        onRowsDelete: (rowsDeleted) => {
            const idsToDelete = rowsDeleted?.data?.map(
                (d) => categoryData[d.dataIndex]?._id
            );
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    axios
                        .delete("http://localhost:5000/category/deletes", {
                            data: { ids: idsToDelete },
                        })
                        .then(() => {
                            swal("Success! Categorys has been deleted!", {
                                icon: "success",
                            });
                            setCategoryData(
                                categoryData?.filter((d) => !idsToDelete?.includes(d?._id))
                            );
                        })
                        .catch((err) => {
                            console.log(err);
                            swal("Error! Categorys has not deleted!", {
                                icon: "error",
                            });
                            setCategoryData(
                                categoryData?.filter((d) => !idsToDelete?.includes(d?._id))
                            );
                        });
                }
            });
        },
        rowsPerPage: [10],
        rowsPerPageOptions: [10, 25, 50, 100],
        jumpToPage: true,
        tableBodyHeight: "424px",
        responsive: "scroll",
        fixedHeader: true,
        textLabels: {
            pagination: {
                next: "Next >",
                previous: "< Previous",
                rowsPerPage: "Total items Per Page",
                displayRows: "OF",
            },
        },

        customSearchRender: customSearchRender,
        // searchText: categoryName, // Pass the search text to MUIDataTable options
    };

    return (
        <>
            <style>
                {`
        .custom-search {
          display: flex;
          align-items: center;
        }

        .custom-search-input {
          width: 300px;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}
            </style>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <MUIDataTable
                                        className="borders"
                                        title="Category List"
                                        data={handleFilter()}
                                        columns={columns}
                                        options={options}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Datatabledemo;
