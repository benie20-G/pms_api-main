const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    try {
        // Check if admin already exists
        const adminExists = await prisma.user.findUnique({
            where: { email: 'admin@neparking.com' }
        });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await prisma.user.create({
                data: {
                    email: 'admin@neparking.com',
                    password: hashedPassword,
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'ADMIN',
                    isVerified: true
                }
            });
            console.log('Admin user created successfully');
        }

        // Create sample parking locations
        const parkingLocations = [
            {
                code: 'DT',
                name: 'Downtown Parking',
                totalSpaces: 100,
                availableSpaces: 100,
                location: '123 Main St',
                feePerHour: 5.00
            },
            {
                code: 'MALL',
                name: 'Mall Parking',
                totalSpaces: 200,
                availableSpaces: 200,
                location: '456 Shopping Ave',
                feePerHour: 3.50
            }
        ];

        for (const location of parkingLocations) {
            await prisma.parking.upsert({
                where: { code: location.code },
                update: location,
                create: location
            });
        }

        console.log('Sample parking locations created successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 