import React from 'react';
import DataTable from 'react-data-table-component';

const DataTableReact = () => {
    const data = [
        { id: 1, name: 'Category 1', image: 'image1.jpg', status: 'Active' },
        { id: 2, name: 'Category 2', image: 'image2.jpg', status: 'Inactive' },
        // Add more data as needed
    ];

    const columns = [
        { name: 'Category Name', selector: 'name' },
        { name: 'Image', selector: 'image' },
        { name: 'Status', selector: 'status' },
    ];

    const customStyles = {
        table: {
            border: '1px solid black',
        },
    };

    return (

        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">

                                        <DataTable
                                            columns={columns}
                                            data={data}
                                            customStyles={customStyles}
                                            pagination
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DataTableReact;
