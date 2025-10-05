import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/student-transport - Get all student transport records
export async function GET() {
  try {
    const studentTransports = await prisma.studentTransport.findMany({
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        bus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(studentTransports);
  } catch (error) {
    console.error("Error fetching student transport records:", error);
    return NextResponse.json(
      { error: "Failed to fetch student transport records" },
      { status: 500 }
    );
  }
}

// POST /api/student-transport - Create a new student transport record
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.studentId || !body.busId || !body.startDate) {
      return NextResponse.json(
        { error: "Missing required fields: studentId, busId, startDate" },
        { status: 400 }
      );
    }

    // Check if student and bus exist
    const student = await prisma.student.findUnique({
      where: { id: body.studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const bus = await prisma.bus.findUnique({
      where: { id: body.busId },
    });

    if (!bus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    // Create the student transport record
    const studentTransport = await prisma.studentTransport.create({
      data: {
        studentId: body.studentId,
        busId: body.busId,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: body.status || "active",
      },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        bus: true,
      },
    });

    return NextResponse.json(studentTransport, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student transport record:", error);

    return NextResponse.json(
      { error: "Failed to create student transport record" },
      { status: 500 }
    );
  }
}

// PUT /api/student-transport/:id - Update a student transport record
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Check if student transport record exists
    const existingStudentTransport = await prisma.studentTransport.findUnique({
      where: { id },
    });

    if (!existingStudentTransport) {
      return NextResponse.json(
        { error: "Student transport record not found" },
        { status: 404 }
      );
    }

    const studentTransport = await prisma.studentTransport.update({
      where: { id },
      data: {
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: body.status,
      },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        bus: true,
      },
    });

    return NextResponse.json(studentTransport);
  } catch (error: any) {
    console.error("Error updating student transport record:", error);

    return NextResponse.json(
      { error: "Failed to update student transport record" },
      { status: 500 }
    );
  }
}

// DELETE /api/student-transport/:id - Delete a student transport record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if student transport record exists
    const existingStudentTransport = await prisma.studentTransport.findUnique({
      where: { id },
    });

    if (!existingStudentTransport) {
      return NextResponse.json(
        { error: "Student transport record not found" },
        { status: 404 }
      );
    }

    await prisma.studentTransport.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Student transport record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student transport record:", error);
    return NextResponse.json(
      { error: "Failed to delete student transport record" },
      { status: 500 }
    );
  }
}
