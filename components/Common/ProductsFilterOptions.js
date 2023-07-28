import React from "react";

const ProductsFilterOptions = ({ onClick, handleFilter }) => {
  const handleGrid = (evt, e) => {
    onClick(e);
    let i, aLinks;

    aLinks = document.getElementsByTagName("a");
    for (i = 0; i < aLinks.length; i++) {
      aLinks[i].className = aLinks[i].className.replace("active", "");
    }

    evt.currentTarget.className += " active";
  };

  return (
    <div className="products-filter-options">
      <div className="row align-items-center">
        <div className="col d-flex">
          <div className="view-list-row">
            <span>View:</span>
            <div className="view-column">
              <a className="icon-view-two" onClick={e => {
                  e.preventDefault();
                  handleGrid(e, "products-col-two");
                }}
              >
                <span></span>
                <span></span>
              </a>
              <a className="icon-view-three" onClick={e => { e.preventDefault();
                  handleGrid(e, "products-col-three");
                }}
              >
                <span></span>
                <span></span>
                <span></span>
              </a>
              <a className="icon-view-four active" onClick={e => {
                  e.preventDefault();
                  handleGrid(e, "");
                }}
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilterOptions;
