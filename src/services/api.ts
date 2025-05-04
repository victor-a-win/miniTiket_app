import axios from "axios";

const API_URL = "http://localhost:8080"; // Sesuaikan dengan port BE Anda

export const fetchEvents = async (params?: {
  category?: string;
  location?: string;
  search?: string;
}) => {
  const response = await axios.get(`${API_URL}/events`, { params });
  return response.data;
};

export const fetchEventDetails = async (id: string) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};