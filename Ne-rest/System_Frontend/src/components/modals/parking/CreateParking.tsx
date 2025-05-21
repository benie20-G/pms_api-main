import React, { useEffect, useState } from "react";
// Dialog is a component that is used to create modal dialogs.
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
  createParking,
  updateParking,
} from "../../../services/parkingService";
import { Parking } from "@/components/tables/columns";

interface CreateEditParkingProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  parkingToEdit?: Parking | null;
  onSuccess: () => void;
}

interface ParkingFormData {
  code: string;
  name: string;
  location: string;
  totalSpaces: number;
  availableSpaces: number;
  feePerHour: number;
}

const CreateEditParking: React.FC<CreateEditParkingProps> = ({
  isOpen,
  onOpenChange,
  parkingToEdit,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParkingFormData>();
  const [loading, setLoading] = useState(false);

  // Prefill form when editing
  useEffect(() => {
    if (parkingToEdit) {
      reset({
        code: parkingToEdit.code,
        name: parkingToEdit.name,
        location: parkingToEdit.location,
        totalSpaces: parkingToEdit.totalSpaces,
        availableSpaces: parkingToEdit.availableSpaces,
        feePerHour: parkingToEdit.feePerHour,
      });
    } else {
      reset({});
    }
  }, [parkingToEdit, reset]);

  const onSubmit = async (data: ParkingFormData) => {
    setLoading(true);
    try {
      if (parkingToEdit) {
        await updateParking(parkingToEdit.id, data);
      } else {
        await createParking(data as unknown as Parking);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save parking", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {parkingToEdit ? "Edit Parking" : "Create Parking"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Parking Code</label>
            <Input {...register("code", { required: true })} />
            {errors.code && (
              <p className="text-red-400">Parking Code is required</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Parking Name</label>
            <Input {...register("name", { required: true })} />
            {errors.name && (
              <p className="text-red-400">Parking Name is required</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Location</label>
            <Input {...register("location", { required: true })} />
            {errors.location && (
              <p className="text-red-600">Location is required</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Total Spaces</label>
            <Input type="number" {...register("totalSpaces", { required: true, valueAsNumber: true })} />
            {errors.totalSpaces && (
              <p className="text-red-600">Total Spaces is required</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Available Spaces</label>
            <Input type="number" {...register("availableSpaces", { required: true, valueAsNumber: true })} />
            {errors.availableSpaces && (
              <p className="text-red-600">Available Spaces is required</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Fee per Hour</label>
            <Input type="number" step="0.01" {...register("feePerHour", { required: true, valueAsNumber: true })} />
            {errors.feePerHour && (
              <p className="text-red-400">Fee per Hour is required</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditParking;
