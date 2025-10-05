import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/transport - Get all buses
export async function GET() {
  try {
    const buses = await prisma.bus.findMany({
      include: {
        studentTransport: {
          include: {
            student: {
              include: {
                user: true,
                class: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    return NextResponse.json(
      { error: "Failed to fetch buses" },
      { status: 500 }
    );
  }
}

// POST /api/transport - Create a new bus
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.busNumber || !body.capacity || !body.driverName || !body.route) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: busNumber, capacity, driverName, route",
        },
        { status: 400 }
      );
    }

    const bus = await prisma.bus.create({
      data: {
        busNumber: body.busNumber,
        capacity: parseInt(body.capacity),
        driverName: body.driverName,
        driverPhone: body.driverPhone || null,
        route: body.route,
        status: body.status || "active",
      },
      include: {
        studentTransport: true,
      },
    });

    return NextResponse.json(bus, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bus:", error);

    // Handle Prisma errors
    if (error.code === "P2002" && error.meta?.target?.includes("busNumber")) {
      return NextResponse.json(
        { error: "A bus with this bus number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create bus" },
      { status: 500 }
    );
  }
}

// PUT /api/transport/:id - Update a bus
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Check if bus exists
    const existingBus = await prisma.bus.findUnique({
      where: { id },
    });

    if (!existingBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    const bus = await prisma.bus.update({
      where: { id },
      data: {
        busNumber: body.busNumber,
        capacity: body.capacity ? parseInt(body.capacity) : undefined,
        driverName: body.driverName,
        driverPhone: body.driverPhone,
        route: body.route,
        status: body.status,
      },
      include: {
        studentTransport: true,
      },
    });

    return NextResponse.json(bus);
  } catch (error: any) {
    console.error("Error updating bus:", error);

    // Handle Prisma errors
    if (error.code === "P2002" && error.meta?.target?.includes("busNumber")) {
      return NextResponse.json(
        { error: "A bus with this bus number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update bus" },
      { status: 500 }
    );
  }
}

// DELETE /api/transport/:id - Delete a bus
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if bus exists
    const existingBus = await prisma.bus.findUnique({
      where: { id },
    });

    if (!existingBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    // Check if there are active student transports for this bus
    const activeTransports = await prisma.studentTransport.count({
      where: {
        busId: id,
        status: "active",
      },
    });

    if (activeTransports > 0) {
      return NextResponse.json(
        { error: "Cannot delete bus with active student transports" },
        { status: 400 }
      );
    }

    await prisma.bus.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    return NextResponse.json(
      { error: "Failed to delete bus" },
      { status: 500 }
    );
  }
}
