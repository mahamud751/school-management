import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create sample books
  const book1 = await prisma.book.create({
    data: {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      category: "Fiction",
      quantity: 5,
      available: 5,
      publisher: "J.B. Lippincott & Co.",
      publishedYear: 1960,
      description:
        "A gripping tale of racial injustice and childhood innocence in the American South.",
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      category: "Dystopian Fiction",
      quantity: 3,
      available: 3,
      publisher: "Secker & Warburg",
      publishedYear: 1949,
      description:
        "A dystopian social science fiction novel about totalitarian control and surveillance.",
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "978-0-14-143951-8",
      category: "Romance",
      quantity: 4,
      available: 4,
      publisher: "T. Egerton",
      publishedYear: 1813,
      description:
        "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
    },
  });

  console.log("Created books:", book1.title, book2.title, book3.title);

  // Create sample buses
  const bus1 = await prisma.bus.create({
    data: {
      busNumber: "BUS-001",
      capacity: 40,
      driverName: "John Smith",
      driverPhone: "+1-555-0101",
      route: "North Route - Downtown to North Hills",
      status: "active",
    },
  });

  const bus2 = await prisma.bus.create({
    data: {
      busNumber: "BUS-002",
      capacity: 35,
      driverName: "Maria Garcia",
      driverPhone: "+1-555-0102",
      route: "South Route - Downtown to South Valley",
      status: "active",
    },
  });

  const bus3 = await prisma.bus.create({
    data: {
      busNumber: "BUS-003",
      capacity: 45,
      driverName: "Robert Johnson",
      driverPhone: "+1-555-0103",
      route: "East Route - Downtown to Eastside",
      status: "maintenance",
    },
  });

  console.log("Created buses:", bus1.busNumber, bus2.busNumber, bus3.busNumber);

  console.log("Library and Transport seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
