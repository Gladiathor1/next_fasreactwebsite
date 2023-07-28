import React from "react";

const RecentProducts = ({ recentItems, cartItems, handleAdd, handleDecrement }) => (
  recentItems.length > 0 &&
  <div className="recent-items mb-2 row">
    { recentItems.map(item => {
      const weight = item.custom_attributes.find(att => att.attribute_code === "weight_per_item");
      const image = item.media_gallery_entries.length > 0 ? item.media_gallery_entries[0].file : "";
      const addedItem = cartItems.find(s => s.sku === item.sku);
      return (
        <div key={item.id} className="col-12 recent-item">
          <div className="item">
            <div className="left-section">
              <div className="product-image">
                <img src={`${process.env.productImage}${image}`} />
              </div>
              <div className="product-info">
                <span>{item.name}</span>
                { weight ?
                  <span>${(parseFloat(weight.value) * parseFloat(item.price)).toFixed(2)}</span> :
                  <span>${item.price}</span>
                }
                { weight && <span className="est-value">${ parseFloat(item.price).toFixed(2) } / LB </span> }
                { weight && addedItem && <span className="est-value">Est. total weight {(weight.value * addedItem.qty).toFixed(2)} LB</span>}
              </div>
            </div>
            <div className="right-section">
              <div className="input-counter">
                <span className="minus-btn" onClick={() => handleDecrement(addedItem)}>
                  <i className="fas fa-minus"></i>
                </span>
                <input readOnly value={addedItem ? addedItem.qty : 0} />
                <span className="plus-btn" onClick={() => handleAdd(addedItem, item, weight, `${process.env.productImage}${image}`)}>
                  <i className="fas fa-plus"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    })}
  </div>
);

export default RecentProducts;
