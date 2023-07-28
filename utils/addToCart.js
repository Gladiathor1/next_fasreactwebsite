export const addToCart = async (props, toast, data) => {
  const { addToCartProduct, getCartProduct, createCart, getTotals } = props;
  const cartID = localStorage.getItem("cartID");
  if (!cartID) {
    await createCart();
  }
  await addToCartProduct(data);
  await getCartProduct();
  getTotals()
  toast.success("Product is added to the cart", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });
}
