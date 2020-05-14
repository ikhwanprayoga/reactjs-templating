import React from 'react';
import paginationFactory from "react-bootstrap-table2-paginator";

const Pagination = paginationFactory({
    page: 1,
    alwaysShowAllBtns: true,
    showTotal: true,
    withFirstAndLast: false,
    sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
      <div className="dataTables_length dataTables_filter px-4 pb-1" id="datatable-basic_length">
        <label>
          {/* Show{" "} */}
          {
            <select
              name="datatable-basic_length"
              aria-controls="datatable-basic"
              className="form-control form-control-sm"
              onChange={e => onSizePerPageChange(e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          }{" "}
          {/* entries. */}
        </label>
      </div>
    )
});

export default Pagination