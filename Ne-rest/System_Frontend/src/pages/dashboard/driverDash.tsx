import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_ENDPOINTS from "../../constants/api";
import { CarRecord } from "../../components/tables/columns";

const UserDashboard: React.FC = () => {
  const [carRecords, setCarRecords] = useState<CarRecord[]>([]);
  const [loading, setLoading] = useState(false);
 

  // Get user info from token
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) as { names?: string; role?: string } : null;
  const userName = decodedToken?.names || "Parking Attendant";
  const userRole = decodedToken?.role;

  // Fetch car records for this user
  const fetchCarRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.carRecords.all, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      // Filter to only show this user's records if not admin
      const allRecords = response.data.data || response.data;
      const filteredRecords = userRole === "ADMIN"
        ? allRecords
        : allRecords.filter((rec: CarRecord) => rec.user?.names === userName);
      setCarRecords(filteredRecords);
    } catch (err) {
      setCarRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarRecords();
  }, []);

  // Quick stats
  const totalEntriesToday = carRecords.filter(
    (rec) => new Date(rec.entryTime).toDateString() === new Date().toDateString()
  ).length;
  const currentlyParked = carRecords.filter((rec) => !rec.exitTime).length;
  const totalTickets = carRecords.length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
      <p className="mb-6 text-gray-600">Role: {userRole}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{totalEntriesToday}</div>
          <div>Entries Today</div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{currentlyParked}</div>
          <div>Currently Parked</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{totalTickets}</div>
          <div>Total Tickets</div>
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;