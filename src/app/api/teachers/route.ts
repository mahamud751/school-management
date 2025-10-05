import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        subjects: true,
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create user first
    const hashedPassword = await hashPassword(body.password || "password123");

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        role: "TEACHER",
        phone: body.phone,
        address: body.address,
      },
    });

    // Create teacher record
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        employeeId: body.employeeId,
      },
      include: {
        user: true,
        subjects: true,
      },
    });

    // Assign subjects if provided
    if (body.subjectIds && body.subjectIds.length > 0) {
      await prisma.teacher.update({
        where: { id: teacher.id },
        data: {
          subjects: {
            connect: body.subjectIds.map((id: string) => ({ id })),
          },
        },
        include: {
          user: true,
          subjects: true,
        },
      });
    }

    // Refetch teacher with subjects
    const updatedTeacher = await prisma.teacher.findUnique({
      where: { id: teacher.id },
      include: {
        user: true,
        subjects: true,
      },
    });

    return NextResponse.json(updatedTeacher, { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
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

    // Update teacher record
    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        employeeId: body.employeeId,
      },
      include: {
        user: true,
        subjects: true,
      },
    });

    // Update subjects if provided
    if (body.subjectIds) {
      await prisma.teacher.update({
        where: { id },
        data: {
          subjects: {
            set: body.subjectIds.map((id: string) => ({ id })),
          },
        },
        include: {
          user: true,
          subjects: true,
        },
      });
    }

    // Refetch teacher with subjects
    const updatedTeacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        subjects: true,
      },
    });

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
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

    // First get the teacher to get the userId
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Delete teacher record
    await prisma.teacher.delete({
      where: { id },
    });

    // Delete user record
    await prisma.user.delete({
      where: { id: teacher.userId },
    });

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
