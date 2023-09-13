//  latest for use

import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Select from 'react-select';
// import './Datatabledemo.css'


const Datatabledemo = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [categoryName, setCategoryName] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('');
    // const dispatch = useDispatch()
    // const navigate = useNavigate()

    const getCategoryOptions = () => {
        // Replace with your category options
        return [
            { value: '1', label: 'sports' },
            { value: '2', label: 'Category 2' },
            { value: '3', label: 'Category 3' },
        ];
    };

    const columns = [
        {
            name: '_id',
            label: 'Id',
            options: {
                display: 'excluded',
                filter: false,
            },
        },
        {
            name: 'Category_Name',
            label: 'Category Name',
            options: {
                filter: true,
                filterType: 'custom',
                customFilterListOptions: {
                    render: (value) => `Category: ${value}`,
                },
                customFilterRender: (filterValue, onChange) => (
                    <Select
                        isClearable
                        placeholder="Filter by Category"
                        value={filterValue}
                        onChange={(selectedOption) => {
                            setCategoryFilter(selectedOption ? selectedOption.value : '');
                            onChange(selectedOption ? selectedOption.value : '');
                        }}
                        options={getCategoryOptions()} // Replace with your category options
                    />
                ),
            },
        },
        {
            name: 'Category_Image',
            label: 'Image',
            options: {
                customBodyRender: (image) => <img src={`http://localhost:5000/${image?.path}`} height={40} width={40} />,
                filter: false,
                sort: false
            },
        },
        {
            name: 'Category_Status',
            label: 'Status',
            options: {
                customBodyRender: (status, tableMeta) => (
                    <a style={{ padding: '6px' }} className={`btn btn-${status ? 'success' : 'danger'} m-b-10 m-l-5`} onClick={() => handleCategoryStatus(tableMeta?.rowData, !status)}>
                        {status ? 'Enable' : 'Disable'}
                    </a>
                ),
                customFilterListOptions: { render: (v) => `Status: ${v === true ? 'Enable' : 'Disable'}` },
            },
        },
        {
            name: 'action',
            label: 'Action',
            options: {
                customBodyRender: (value, tableMeta) => {
                    const id = tableMeta?.rowData[0];
                    const category = tableMeta?.rowData
                    return (
                        <Stack direction="row">
                            <IconButton aria-label="delete" onClick={() => handleCategoryDelete(id)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton>
                                <EditIcon onClick={() => handleCategoryUpdate(category)} />
                            </IconButton>
                        </Stack>
                    );
                },
                filter: false,
                sort: false
            },
        },
    ];

    useEffect(() => {
        async function getCategory() {
            const res = await axios.get('http://localhost:5000/category/get');
            setCategoryData(res?.data?.category);
        }
        getCategory();
    }, []);

    // for delete category
    const handleCategoryDelete = (id) => {
        swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios
                    .delete(`http://localhost:5000/category/delete/${id}`)
                    .then(() => {
                        setCategoryData(categoryData.filter((d) => d?._id !== id))
                        swal('Success! Category has been deleted!', {
                            icon: 'success',
                        });
                    })
                    .catch((err) => {
                        console.log(err)
                        swal('Error! Category has not deleted!', {
                            icon: 'error',
                        });
                    });
            }
        });
    };

    // update category
    const handleCategoryUpdate = (category) => {
        // dispatch(updateCategory(category))
        // navigate('/home/editCategory')
    }

    // for update status
    const handleCategoryStatus = async (category, newStatus) => {
        try {
            const confirmed = await swal({
                title: "Are you sure?",
                text: `for ${newStatus ? 'enable' : 'disable'} ${category?.[1]}!`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            });

            if (confirmed) {
                await axios.patch(
                    `http://localhost:5000/category/update/status/${category?.[0]}`,
                    {
                        status: newStatus,
                    }
                );

                swal(`Success! ${category?.[1]} has been ${newStatus ? 'enabled' : 'disabled'}!`, {
                    icon: "success",
                });

                const res = await axios.get('http://localhost:5000/category/get');
                setCategoryData(res?.data?.category);
            }
        } catch (error) {
            console.log(error);
            swal(`Error! ${category?.[1]} has not been ${newStatus ? 'enabled' : 'disabled'}!`, {
                icon: "error",
            });
        }
    }


    const customSearchRender = (searchText, handleSearch, hideSearch, options) => {
        console.log("handlese", searchText)
        return (
            <div className="custom-search">
                <input
                    type="text"
                    className="custom-search-input"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search category..."
                />
                <IconButton
                    aria-label="clear search"
                    onClick={hideSearch}
                >
                    <ClearIcon />
                </IconButton>
            </div>
        );
    };

    const handleFilter = () => {
        const filteredCategoryList = categoryData?.filter((category) => {
            const formattedCategoryName = (category?.name || '').toUpperCase().replace(/\s/g, '');
            let isCategoryName = true;
            if (categoryName) {
                isCategoryName = formattedCategoryName.includes(categoryName.toUpperCase().replace(/\s/g, ''));
            }

            return isCategoryName

        })
        return filteredCategoryList
    }

    const options = {
        selectableRows: 'multiple',
        onRowsDelete: (rowsDeleted) => {
            const idsToDelete = rowsDeleted?.data?.map((d) => categoryData[d.dataIndex]?._id);
            swal({
                title: 'Are you sure?',
                text: 'Once deleted, you will not be able to recover this!',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    axios
                        .delete('http://localhost:5000/category/deletes', { data: { ids: idsToDelete } })
                        .then(() => {
                            swal('Success! Categorys has been deleted!', {
                                icon: 'success',
                            });
                            setCategoryData(categoryData?.filter((d) => !idsToDelete?.includes(d?._id)));
                        })
                        .catch((err) => {
                            console.log(err)
                            swal('Error! Categorys has not deleted!', {
                                icon: 'error',
                            });
                            setCategoryData(categoryData?.filter((d) => !idsToDelete?.includes(d?._id)));
                        });
                }
            });
        },
        rowsPerPage: [3],
        rowsPerPageOptions: [3, 5, 10, 15],
        jumpToPage: true,
        tableBodyHeight: '430px',
        responsive: 'scroll',
        fixedHeader: true,
        textLabels: {
            pagination: {
                next: 'Next >',
                previous: '< Previous',
                rowsPerPage: 'Total items Per Page',
                displayRows: 'OF',
            },
        },

        customSearchRender: customSearchRender,
        // searchText: categoryName, // Pass the search text to MUIDataTable options
        customToolbar: () => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '16px' }}>
                    <Select
                        isClearable
                        placeholder="Filter by Category"
                        value={categoryFilter}
                        onChange={(selectedOption) => {
                            setCategoryFilter(selectedOption ? selectedOption?.value : '');
                        }}
                        options={getCategoryOptions()} // Replace with your category options
                    />
                </div>
                <div>
                    {/* Include the search bar component here */}
                </div>
            </div>
        ),
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
                        <div class="row">
                            <div class="col-12">
                                <div class="card">

                                    <MUIDataTable
                                        // title="Category List"
                                        data={handleFilter()}
                                        columns={columns}
                                        options={options} />
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
