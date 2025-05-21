import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../../components/tables";
import {
  parkingColumns as getParkingColumns,
  Parking,
} from "../../components/tables/columns";
import API_ENDPOINTS from "../../constants/api";
import CreateEditParking from "../../components/modals/parking/CreateParking";
import { Button } from "../../components/ui/button";
import { deleteParking } from "../../services/parkingService";
import { toast } from "sonner";
import Loader from "../../components/commons/loader";

/**
 * Parking management page component
 * Displays a list of parking records and allows admins to manage them
 */
const ParkingPage: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);

  // Get user role from localStorage
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : {};
  const userRole = parsedUser.role?.toUpperCase();

  /**
   * Fetch all parking records from the backend
   */
  const fetchParkings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_ENDPOINTS.parking.all, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      setParkings(response.data);
    } catch (err) {
      console.error("Parking fetch error:", err);
      setError("Failed to fetch parking records");
      toast.error("Failed to fetch parking records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings();
  }, []);

  const handleEdit = (parking: Parking) => {
    setSelectedParking(parking);
    setIsDialogOpen(true);
  };

  const handleCreateParking = () => {
    setSelectedParking(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (parking: Parking) => {
    if (window.confirm("Are you sure you want to delete this parking record?")) {
      try {
        await deleteParking(parking.id!);
        toast.success("Parking record deleted successfully");
        fetchParkings();
      } catch (err) {
        console.error("Parking delete error:", err);
        toast.error("Failed to delete parking record");
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {userRole === "ADMIN" ? "Parking Management" : "Available Parkings"}
        </h2>
        {userRole === "ADMIN" && (
          <Button onClick={handleCreateParking}>Add Parking</Button>
        )}
      </div>

      <DataTable<Parking>
        data={parkings}
        columns={getParkingColumns(
          userRole === "ADMIN" ? handleEdit : undefined,
          userRole === "ADMIN" ? handleDelete : undefined,
          userRole
        )}
        role={userRole}
      />

      {userRole === "ADMIN" && (
        <CreateEditParking
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          parkingToEdit={selectedParking}
          onSuccess={fetchParkings}
        />
      )}
    </div>
  );
};

export default ParkingPage;
