import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //Using .env variable
});

//Login - token recovery
export const loginUser = async (email, password) => {
  const response = await apiClient.post("/user/login", { email, password });
  return response.data;
};

// User profile recovery
export const getUserProfile = async (token) => {
  const response = await apiClient.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//User profile update
export const updateUserProfile = async (token, userData) => {
  const response = await apiClient.put("/user/profile", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
