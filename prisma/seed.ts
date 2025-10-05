import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await hashPassword("admin123");

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@school.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  const admin = await prisma.admin.create({
    data: {
      userId: adminUser.id,
    },
  });

  console.log("Created admin user:", adminUser);

  // Create sample classes
  const class1 = await prisma.class.create({
    data: {
      name: "Grade 10",
      level: "Secondary",
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: "Grade 11",
      level: "Higher Secondary",
    },
  });

  console.log("Created classes:", class1, class2);

  // Create sample sections
  const sectionA = await prisma.section.create({
    data: {
      name: "A",
      classId: class1.id,
    },
  });

  const sectionB = await prisma.section.create({
    data: {
      name: "B",
      classId: class1.id,
    },
  });

  console.log("Created sections:", sectionA, sectionB);

  // Create sample subjects
  const math = await prisma.subject.create({
    data: {
      name: "Mathematics",
      code: "MATH101",
    },
  });

  const science = await prisma.subject.create({
    data: {
      name: "Science",
      code: "SCI101",
    },
  });

  const english = await prisma.subject.create({
    data: {
      name: "English",
      code: "ENG101",
    },
  });

  console.log("Created subjects:", math, science, english);

  // Associate classes with subjects
  await prisma.classSubject.create({
    data: {
      classId: class1.id,
      subjectId: math.id,
    },
  });

  await prisma.classSubject.create({
    data: {
      classId: class1.id,
      subjectId: science.id,
    },
  });

  await prisma.classSubject.create({
    data: {
      classId: class2.id,
      subjectId: english.id,
    },
  });

  console.log("Associated classes with subjects");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
