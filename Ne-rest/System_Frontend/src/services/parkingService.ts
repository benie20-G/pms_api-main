
import axios from "axios";
import API_ENDPOINTS from "../constants/api";
import { toast } from "sonner";
import { Parking } from "../components/tables/columns";

/**
 * Fetch all parking locations.
 */
export async function getAllParkings() {
  try {
    const response = await axios.get(API_ENDPOINTS.parking.all, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Parkings loaded successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to load parkings";
    toast.error(errorMessage);
    throw error;
  }
}

/**
 * Create a new parking location.
 * @param parkingData - The parking data to create.
 */
export async function createParking(parkingData: Parking) {
  try {
    const response = await axios.post(API_ENDPOINTS.parking.create, parkingData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Parking created successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to create parking";
    toast.error(errorMessage);
    throw error;
  }
}

/**
 * Update an existing parking location.
 * @param id - The parking ID.
 * @param updateData - The fields to update.
 */
export async function updateParking(id: string, updateData: Partial<Parking>) {
  try {
    const response = await axios.put(API_ENDPOINTS.parking.update(id), updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Parking updated successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to update parking";
    toast.error(errorMessage);
    throw error;
  }
}

/**
 * Delete a parking location by ID.
 * @param id - The parking ID.
 */
export async function deleteParking(id: string) {
  try {
    const response = await axios.delete(API_ENDPOINTS.parking.delete(id), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Parking deleted successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to delete parking";
    toast.error(errorMessage);
    throw error;
  }
}

/**
 * Get a parking location by its ID.
 * @param id - The parking ID.
 */
export async function getParkingById(id: string) {
  try {
    const response = await axios.get(API_ENDPOINTS.parking.getById(id), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get parking by ID", error);
    throw error;
  }
}

