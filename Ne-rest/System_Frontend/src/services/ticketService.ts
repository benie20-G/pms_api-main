import axios from "axios";
import API_ENDPOINTS from "../constants/api";

export const createTicket = async (data: { carRecordId: string }) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_ENDPOINTS.ticket.create, data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
};

export const getAllTickets = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_ENDPOINTS.ticket.all, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
};

export const getTicketById = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_ENDPOINTS.ticket.getById(id), {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
};

export const deleteTicket = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(API_ENDPOINTS.ticket.delete(id), {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
};