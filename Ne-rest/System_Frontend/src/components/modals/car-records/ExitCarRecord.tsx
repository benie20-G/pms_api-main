import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { exitCarRecord } from "../../../services/carRecordService";
import { toast } from "sonner";
import { CarRecord } from "../../tables/columns";

interface ExitCarRecordProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  record: CarRecord | null;
  onSuccess: () => void;
}

const ExitCarRecord: React.FC<ExitCarRecordProps> = ({
  isOpen,
  onOpenChange,
  record,
  onSuccess,
}) => {
  const handleExit = async () => {
    if (!record) return;

    try {
      await exitCarRecord(record.id);
      toast.success("Car exit recorded successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to record car exit:", error);
      toast.error("Failed to record car exit");
    }
  };

  if (!record) return null;

  const entryTime = new Date(record.entryTime);
  const currentTime = new Date();
  const durationHours = (currentTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
  const feePerHour = record.parking?.feePerHour ?? 0;
  const totalCharge = durationHours * feePerHour;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Car</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Car Details</h3>
            <p>Plate Number: {record.plateNumber}</p>
            <p>Parking: {record.parking.name}</p>
            <p>Location: {record.parking.location}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Parking Duration</h3>
            <p>Entry Time: {entryTime.toLocaleString()}</p>
            <p>Exit Time: {currentTime.toLocaleString()}</p>
            <p>Duration: {durationHours.toFixed(2)} hours</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Billing</h3>
            <p>Rate: ${feePerHour.toFixed(2)} per hour</p>
            <p className="text-lg font-bold">Total Charge: ${totalCharge.toFixed(2)}</p>
          </div>

          <DialogFooter>
            <Button onClick={handleExit}>Confirm Exit</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitCarRecord; 