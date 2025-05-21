import { PrismaClient, Role, VerificationStatus, PasswordResetStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'iratuzibeniegiramata@gmail.com';
  const adminTelephone = '+250795192369';

  // Check if admin with same email or telephone exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { email: adminEmail },
        { telephone: adminTelephone },
      ],
    },
  });

  if (existingAdmin) {
    console.log('Admin user already exists (by email or telephone).');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.create({
    data: {
      names: 'Admin User',
      email: adminEmail,
      telephone: adminTelephone,
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
