import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import { getAllUsers } from "../../services/userService"; 
import {getAllParkings} from "../../services/parkingService"

const DashboardPage: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [parkingCount, setParkingCount] = useState<number>(0);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getAllUsers(); 
        setUserCount(userData.length);
        const parkingData = await getAllParkings();
        setParkingCount(parkingData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Dashboard Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Number of Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-black">{userCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Number of Parkings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-black">{parkingCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
