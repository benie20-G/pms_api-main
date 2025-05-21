import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

export interface Users {
  names: string;
  email: string;
  telephone: string;
  role: string;
}

export interface Parking {
  id: string;
  code: string;
  name: string;
  location: string;
  totalSpaces: number;
  availableSpaces: number;
  feePerHour: number;
  createdAt: string;
}

export interface User {
  id: string;
  names: string;
  email: string;
  telephone: string;
  role: string;
}

export interface CarRecord {
  id: string;
  plateNumber: string;
  parkingId: string;
  userId: string;
  entryTime: string;
  exitTime: string | null;
  chargedAmount: number;
  parking: Parking;
  user: User;
}

export const userColumns = (): ColumnDef<Users>[] => [
  {
    accessorKey: "names",
    header: "Username",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "telephone",
    header: "Phone number",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => info.getValue(),
  },
];

export const parkingColumns = (
  handleEdit?: (parking: Parking) => void,
  handleDelete?: (parking: Parking) => Promise<void>,
  userRole?: string
): ColumnDef<Parking>[] => {
  const baseColumns: ColumnDef<Parking>[] = [
    {
      accessorKey: "name",
      header: "Parking Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "availableSpaces",
      header: "Available Spaces",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "feePerHour",
      header: "Fee per Hour",
      cell: (info) => {
        const value = info.getValue() as number;
        return `$${value.toFixed(2)}`;
      },
    },
  ];

  // Add admin-only columns
  if (userRole === "ADMIN") {
    baseColumns.unshift(
      {
        accessorKey: "code",
        header: "Parking Code",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "totalSpaces",
        header: "Total Spaces",
        cell: (info) => info.getValue(),
      }
    );

    baseColumns.push({
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return date.toLocaleDateString();
      },
    });

    // Add action column for admin
    if (handleEdit || handleDelete) {
      baseColumns.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const parking = row.original;
          return (
            <div className="flex gap-2">
              {handleEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(parking)}
                >
                  Edit
                </Button>
              )}
              {handleDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(parking)}
                >
                  Delete
                </Button>
              )}
            </div>
          );
        },
      });
    }
  }

  return baseColumns;
};

export const carRecordColumns = (
  handleExitRecord?: (record: CarRecord) => void,
  userRole?: string
): ColumnDef<CarRecord>[] => {
  const columns: ColumnDef<CarRecord>[] = [
    {
      accessorKey: "plateNumber",
      header: "Plate Number",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "parking.name",
      header: "Parking Name",
      cell: (info) => info.row.original.parking?.name || "",
    },
    {
      accessorKey: "parking.location",
      header: "Location",
      cell: (info) => info.row.original.parking?.location || "",
    },
    {
      accessorKey: "user.names",
      header: "Attendant",
      cell: (info) => info.row.original.user?.names || "",
    },
    {
      accessorKey: "entryTime",
      header: "Entry Time",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return date.toLocaleString();
      },
    },
    {
      accessorKey: "exitTime",
      header: "Exit Time",
      cell: (info) => {
        const value = info.getValue();
        if (!value) return "Still Parked";
        const date = new Date(value as string);
        return date.toLocaleString();
      },
    },
    {
      accessorKey: "chargedAmount",
      header: "Charged Amount",
      cell: (info) => {
        const value = info.getValue() as number;
        return value === 0 ? "Not Charged" : `$${value.toFixed(2)}`;
      },
    },
  ];

  // Only add the Exit action column for admins
  if (userRole !== "ADMIN") {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) =>
        !row.original.exitTime && handleExitRecord ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExitRecord(row.original)}
          >
            Exit
          </Button>
        ) : null,
    });
  }

  return columns;
};
