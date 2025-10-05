import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        sections: true,
        students: true,
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const classItem = await prisma.class.create({
      data: {
        name: body.name,
        level: body.level,
      },
      include: {
        sections: true,
        students: true,
      },
    });

    return NextResponse.json(classItem, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
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

    const classItem = await prisma.class.update({
      where: { id },
      data: {
        name: body.name,
        level: body.level,
      },
      include: {
        sections: true,
        students: true,
      },
    });

    return NextResponse.json(classItem);
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json(
      { error: "Failed to update class" },
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

    // Delete associated sections first
    await prisma.section.deleteMany({
      where: { classId: id },
    });

    // Delete the class
    await prisma.class.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 }
    );
  }
}
