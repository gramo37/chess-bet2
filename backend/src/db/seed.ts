import bcrypt from 'bcrypt';
import { db } from '.';
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASS } from '../constants';
async function main() {
  
  const hashedPassword = await bcrypt.hash(ADMIN_PASS, 10); 
  // Create the admin user
  const admin = await db.user.upsert({
    where: { email: ADMIN_EMAIL }, 
    update: {}, 
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL, 
      password: hashedPassword,
      role: 'ADMIN', 
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
