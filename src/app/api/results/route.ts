import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/results - Get all results
export async function GET() {
  try {
    const results = await prisma.result.findMany({
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        exam: {
          include: {
            subject: true,
            class: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

// POST /api/results - Create a new result
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.studentId || !body.examId || body.marks === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: studentId, examId, marks" },
        { status: 400 }
      );
    }

    // Calculate grade based on marks
    let grade = "F";
    if (body.marks >= 90) grade = "A+";
    else if (body.marks >= 80) grade = "A";
    else if (body.marks >= 70) grade = "B";
    else if (body.marks >= 60) grade = "C";
    else if (body.marks >= 50) grade = "D";
    else grade = "F";

    const result = await prisma.result.create({
      data: {
        studentId: body.studentId,
        examId: body.examId,
        marks: parseFloat(body.marks),
        grade,
      },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        exam: {
          include: {
            subject: true,
            class: true,
          },
        },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating result:", error);

    // Handle Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A result for this student and exam already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create result" },
      { status: 500 }
    );
  }
}

// PUT /api/results/:id - Update a result
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Check if result exists
    const existingResult = await prisma.result.findUnique({
      where: { id },
    });

    if (!existingResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Calculate grade based on marks
    let grade = "F";
    if (body.marks >= 90) grade = "A+";
    else if (body.marks >= 80) grade = "A";
    else if (body.marks >= 70) grade = "B";
    else if (body.marks >= 60) grade = "C";
    else if (body.marks >= 50) grade = "D";
    else grade = "F";

    const result = await prisma.result.update({
      where: { id },
      data: {
        marks: body.marks !== undefined ? parseFloat(body.marks) : undefined,
        grade: body.marks !== undefined ? grade : undefined,
      },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        exam: {
          include: {
            subject: true,
            class: true,
          },
        },
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error updating result:", error);

    return NextResponse.json(
      { error: "Failed to update result" },
      { status: 500 }
    );
  }
}

// DELETE /api/results/:id - Delete a result
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if result exists
    const existingResult = await prisma.result.findUnique({
      where: { id },
    });

    if (!existingResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    await prisma.result.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error("Error deleting result:", error);
    return NextResponse.json(
      { error: "Failed to delete result" },
      { status: 500 }
    );
  }
}
