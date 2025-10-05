import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        class: true,
        section: true,
        parent: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create user first
    const hashedPassword = await hashPassword(body.password || "password123");

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
          role: "STUDENT",
          phone: body.phone,
          address: body.address,
        },
      });
    } catch (userError: any) {
      if (
        userError.code === "P2002" &&
        userError.meta?.target?.includes("email")
      ) {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
      throw userError;
    }

    // Create student record
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        studentId: body.studentId,
        rollNumber: parseInt(body.rollNumber),
        classId: body.classId,
        sectionId: body.sectionId,
        parentId: body.parentId || null, // Make parentId optional
      },
      include: {
        user: true,
        class: true,
        section: true,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);

    // Handle Prisma errors
    if (error.code === "P2002") {
      if (error.meta?.target?.includes("studentId")) {
        return NextResponse.json(
          { error: "A student with this student ID already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Update user
    const user = await prisma.user.update({
      where: { id: body.userId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
      },
    });

    // Update student record
    const student = await prisma.student.update({
      where: { id },
      data: {
        studentId: body.studentId,
        rollNumber: parseInt(body.rollNumber),
        classId: body.classId,
        sectionId: body.sectionId,
        parentId: body.parentId || null, // Make parentId optional
      },
      include: {
        user: true,
        class: true,
        section: true,
      },
    });

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("Error updating student:", error);

    // Handle Prisma errors
    if (error.code === "P2002") {
      if (error.meta?.target?.includes("studentId")) {
        return NextResponse.json(
          { error: "A student with this student ID already exists" },
          { status: 409 }
        );
      }
      if (error.meta?.target?.includes("email")) {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // First get the student to get the userId
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Delete student record
    await prisma.student.delete({
      where: { id },
    });

    // Delete user record
    await prisma.user.delete({
      where: { id: student.userId },
    });

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
