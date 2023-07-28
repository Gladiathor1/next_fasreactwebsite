export const handleLogin = async (props, data, toast, handleLoading, redirect) => {
  const { login, customerCart, mergeCarts } = props;
  try {
    const res = await login(data);
    const token = res.payload;
    const guestCart = localStorage.getItem("cartID");
    localStorage.removeItem('cartID');
    localStorage.setItem('authToken', token);
    const cart = await customerCart(token);
    const userCart = cart.payload.customerCart.id
    localStorage.setItem('cartID', userCart)
    await mergeCarts(guestCart, userCart, token);

    handleLoading();
    redirect();
  } catch (err) {
    const error = err.payload.response.data.message;
    toast.error(error, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
    handleLoading();
  }
}