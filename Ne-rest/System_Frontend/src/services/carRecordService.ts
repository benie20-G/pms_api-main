import axios from "axios";
import API_ENDPOINTS from "../constants/api";

export const createCarRecord = async (data: {
  plateNumber: string;
  parkingId: string;
  userId: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_ENDPOINTS.carRecords.create, data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
};

export const updateCarRecord = async (
  id: string,
  data: {
    exitTime?: string;
    chargedAmount?: number;
  }
) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(API_ENDPOINTS.carRecords.update(id), data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
};

export const deleteCarRecord = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(API_ENDPOINTS.carRecords.delete(id), {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
};

export const exitCarRecord = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    API_ENDPOINTS.carRecords.exit(id),
    {}, // No body needed unless you want to send custom exitTime/chargedAmount
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  return response.data;
}; 