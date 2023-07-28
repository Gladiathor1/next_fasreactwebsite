import React, { Component } from "react";
import LeftSidebar from "../Sidebar/LeftSidebar";

class LeftFilters extends Component {
  render() {
    const { display, handleFilter } = this.props;
    return (
      <div
        className="modal left fade productsFilterModal show"
        style={{
          display: display ? "block" : "none",
          paddingRight: "16px"
        }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleFilter}
            >
              <span aria-hidden="true">
                <i className="fas fa-times"></i> Close
              </span>
            </button>

            <div className="modal-body">
              <div className="woocommerce-sidebar-area">
                <LeftSidebar handleQuery={this.props.handleQuery} clearQuery={this.props.clearQuery} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeftFilters;
