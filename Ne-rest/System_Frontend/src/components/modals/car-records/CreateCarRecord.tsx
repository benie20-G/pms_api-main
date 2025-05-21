import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { createCarRecord } from "../../../services/carRecordService";
import { toast } from "sonner";
import { Parking } from "../../tables/columns";
import axios from "axios";
import API_ENDPOINTS from "../../../constants/api";
import { jwtDecode } from "jwt-decode";

interface CreateCarRecordProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CarRecordFormData {
  plateNumber: string;
  parkingId: string;
  userId: string;
}

const CreateCarRecord: React.FC<CreateCarRecordProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CarRecordFormData>();

  const token = localStorage.getItem("token");
  console.log("Token:", token);
  
  const decodedToken = token ? jwtDecode(token) as { id: string, role: string } : null;
  console.log("Decoded Token:", decodedToken);
  
  const userId = decodedToken?.id;
  console.log("User ID:", userId);
  const userRole = decodedToken?.role;
  console.log("User Role:", userRole);
  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.parking.all, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        console.log("Parkings:", response.data);
        setParkings(response.data);
      } catch (error) {
        console.error("Failed to fetch parkings:", error);
        toast.error("Failed to fetch parking locations");
      }
    };

    if (isOpen) {
      fetchParkings();
    }
  }, [isOpen]);

  const onSubmit = async (data: CarRecordFormData) => {
    setLoading(true);
    try {
      console.log("Form data before submission:", data);
      const submitData = {
        ...data,
        userId: userId!
      };
      console.log("Final submission data:", submitData);
      await createCarRecord(submitData);
      toast.success("Car entry recorded successfully");
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Failed to create car record:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      }
      toast.error("Failed to record car entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
        {userRole !== "ADMIN" && (
          <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Car</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block mb-1">Plate Number</label>
                  <Input 
                    {...register("plateNumber", { 
                      required: true,
                      pattern: {
                        value: /^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/i,
                        message: "Plate number must follow format like RAE123C"
                      }
                    })} 
                  />
                  {errors.plateNumber && (
                    <p className="text-red-600">
                      {errors.plateNumber.message || "Plate Number is required"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1">Parking Location</label>
                  <Select 
                    onValueChange={(value) => {
                      console.log("Selected parking ID:", value);
                      setValue("parkingId", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parking location" />
                    </SelectTrigger>
                    <SelectContent>
                      {parkings.map((parking) => (
                        <SelectItem key={parking.id} value={parking.id}>
                          {parking.name} - {parking.location} (Available: {parking.availableSpaces})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.parkingId && (
                    <p className="text-red-600">Parking location is required</p>
                  )}
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Recording..." : "Record Entry"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
    </>
  );
};

export default CreateCarRecord; 