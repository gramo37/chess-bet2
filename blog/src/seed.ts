import payload from "payload";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const seedUser = async () => {
  try {
    // Seed the user
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: true, // Run Payload in local mode
    });

    const user = await payload.create({
      collection: "users", // Collection slug
      data: {
        name: process.env.ADMIN_NAME,
        role: "admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASS,
      },
    });

    console.log("User seeded successfully:", user);
  } catch (error) {
    console.error("Error seeding user:", error);
  } finally {
    // Disconnect from the database
    process.exit();
  }
};

seedUser();
