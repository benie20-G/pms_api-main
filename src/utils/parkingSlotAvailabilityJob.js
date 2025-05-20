const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const startParkingSlotAvailabilityJob = () => {
    // Run every 5 minutes
    setInterval(async () => {
        try {
            // Get all parking locations
            const parkings = await prisma.parking.findMany();

            for (const parking of parkings) {
                // Count active entries (cars that haven't exited)
                const activeEntries = await prisma.parkingEntry.count({
                    where: {
                        parkingId: parking.id,
                        exitDateTime: null
                    }
                });

                // Update available spaces
                await prisma.parking.update({
                    where: { id: parking.id },
                    data: {
                        availableSpaces: parking.totalSpaces - activeEntries
                    }
                });
            }

            console.log('Parking slot availability updated successfully');
        } catch (error) {
            console.error('Error updating parking slot availability:', error);
        }
    }, 5 * 60 * 1000); // 5 minutes
};

module.exports = {
    startParkingSlotAvailabilityJob
}; 