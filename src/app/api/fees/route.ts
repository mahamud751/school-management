import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const fees = await prisma.fee.findMany({
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        dueDate: "desc",
      },
    });

    return NextResponse.json(fees);
  } catch (error) {
    console.error("Error fetching fees:", error);
    return NextResponse.json(
      { error: "Failed to fetch fees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fee = await prisma.fee.create({
      data: {
        amount: parseFloat(body.amount),
        dueDate: new Date(body.dueDate),
        paidDate: body.paidDate ? new Date(body.paidDate) : null,
        status: body.status,
        description: body.description,
        studentId: body.studentId,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    console.error("Error creating fee record:", error);
    return NextResponse.json(
      { error: "Failed to create fee record" },
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

    const fee = await prisma.fee.update({
      where: { id },
      data: {
        amount: parseFloat(body.amount),
        dueDate: new Date(body.dueDate),
        paidDate: body.paidDate ? new Date(body.paidDate) : null,
        status: body.status,
        description: body.description,
        studentId: body.studentId,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(fee);
  } catch (error) {
    console.error("Error updating fee record:", error);
    return NextResponse.json(
      { error: "Failed to update fee record" },
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

    await prisma.fee.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Fee record deleted successfully" });
  } catch (error) {
    console.error("Error deleting fee record:", error);
    return NextResponse.json(
      { error: "Failed to delete fee record" },
      { status: 500 }
    );
  }
}
