import axios from "axios";

const API_URL = "http://localhost:3001/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
});

//Login - token recovery
export const loginUser = async (email, password) => {
  const response = await apiClient.post("/user/login", { email, password });
  return response.data;
};

// User profile recovery
export const getUserProfile = async (token) => {
  const response = await apiClient.post("/user/profile", null, {
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
