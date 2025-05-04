import axios from "axios";

const API_URL = "http://localhost:8000"; // Sesuaikan dengan URL BE Anda

export const fetchEvents = async (params?: {
  category?: string;
  location?: string;
  search?: string;
}) => {
  const response = await axios.get(`${API_URL}/events`, { params });
  return response.data;
};