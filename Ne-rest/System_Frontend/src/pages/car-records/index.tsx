import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../../components/tables";
import { carRecordColumns, CarRecord } from "../../components/tables/columns";
import API_ENDPOINTS from "../../constants/api";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import Loader from "../../components/commons/loader";
import CreateCarRecord from "../../components/modals/car-records/CreateCarRecord";
import ExitCarRecord from "../../components/modals/car-records/ExitCarRecord";
import { jwtDecode } from "jwt-decode";

const CarRecordsPage: React.FC = () => {
  const [carRecords, setCarRecords] = useState<CarRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CarRecord | null>(null);

  // Get user role from JWT
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) as { role?: string } : null;
  const userRole = decodedToken?.role;

  const fetchCarRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_ENDPOINTS.carRecords.all, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      // If your API wraps data in a "data" field, use response.data.data
      setCarRecords(response.data.data || response.data);
    } catch (err) {
      console.error("Car records fetch error:", err);
      setError("Failed to fetch car records");
      toast.error("Failed to fetch car records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarRecords();
  }, []);

  const handleCreateRecord = () => {
    setSelectedRecord(null);
    setIsEntryDialogOpen(true);
  };

  const handleExitRecord = (record: CarRecord) => {
    setSelectedRecord(record);
    setIsExitDialogOpen(true);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Car Records</h2>
        {userRole !== "ADMIN" && (
          <Button onClick={handleCreateRecord}>Record Car</Button>
        )}
      </div>

      <DataTable<CarRecord>
        data={carRecords}
        columns={carRecordColumns(handleExitRecord, userRole)}
        role={userRole}
      />

      {userRole !== "ADMIN" && (
        <CreateCarRecord
          isOpen={isEntryDialogOpen}
          onOpenChange={setIsEntryDialogOpen}
          onSuccess={fetchCarRecords}
        />
      )}

      {userRole !== "ADMIN" && (
        <ExitCarRecord
          isOpen={isExitDialogOpen}
          onOpenChange={setIsExitDialogOpen}
          record={selectedRecord}
          onSuccess={fetchCarRecords}
        />
      )}
    </div>
  );
};

export default CarRecordsPage; 