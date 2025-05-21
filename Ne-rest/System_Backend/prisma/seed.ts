// prisma/seed.ts
import { PrismaClient, Role, VerificationStatus, PasswordResetStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'iratuzibeniegiramata@gmail.com';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10); // use a secure password

  await prisma.user.create({
    data: {
      names: 'Admin User',
      email: adminEmail,
      telephone: '+250795192369',
      password: hashedPassword,
      role: Role.ADMIN,
      verificationStatus: VerificationStatus.VERIFIED,
      passwordResetStatus: PasswordResetStatus.IDLE,
    },
  });

  console.log('Admin user created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
