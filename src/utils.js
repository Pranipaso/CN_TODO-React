import axios from "axios";
import { saveProducts } from "./Redux/ProductSlice";

export const getProducts = async (dispatch) => {
  try {
    const response = await axios.get(
      "https://my-json-server.typicode.com/Pranipaso/CN_E-Mart/products"
    );
    console.log(response.data);
    dispatch(saveProducts(response.data));
  } catch (error) {
    console.log("eroor getting products ", error);
  }
};
