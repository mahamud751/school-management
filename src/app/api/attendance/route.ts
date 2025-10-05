import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const attendanceRecords = await prisma.attendance.findMany({
      include: {
        student: {
          include: {
            user: true,
          },
        },
        class: true,
        subject: true,
        takenBy: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const attendanceRecord = await prisma.attendance.create({
      data: {
        date: new Date(body.date),
        status: body.status,
        studentId: body.studentId,
        classId: body.classId,
        subjectId: body.subjectId || null,
        teacherId: body.teacherId,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        class: true,
        subject: true,
        takenBy: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(attendanceRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating attendance record:", error);
    return NextResponse.json(
      { error: "Failed to create attendance record" },
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

    const attendanceRecord = await prisma.attendance.update({
      where: { id },
      data: {
        date: new Date(body.date),
        status: body.status,
        studentId: body.studentId,
        classId: body.classId,
        subjectId: body.subjectId || null,
        teacherId: body.teacherId,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        class: true,
        subject: true,
        takenBy: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(attendanceRecord);
  } catch (error) {
    console.error("Error updating attendance record:", error);
    return NextResponse.json(
      { error: "Failed to update attendance record" },
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

    await prisma.attendance.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    return NextResponse.json(
      { error: "Failed to delete attendance record" },
      { status: 500 }
    );
  }
}
