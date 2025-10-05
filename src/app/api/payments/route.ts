import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/payments - Get all payments
export async function GET() {
  try {
    const payments = await prisma.fee.findMany({
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.studentId || !body.amount || !body.dueDate || !body.status) {
      return NextResponse.json(
        {
          error: "Missing required fields: studentId, amount, dueDate, status",
        },
        { status: 400 }
      );
    }

    const payment = await prisma.fee.create({
      data: {
        studentId: body.studentId,
        amount: parseFloat(body.amount),
        dueDate: new Date(body.dueDate),
        paidDate: body.paidDate ? new Date(body.paidDate) : null,
        status: body.status,
        description: body.description || null,
      },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error("Error creating payment:", error);

    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}

// PUT /api/payments/:id - Update a payment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Check if payment exists
    const existingPayment = await prisma.fee.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const payment = await prisma.fee.update({
      where: { id },
      data: {
        amount: body.amount !== undefined ? parseFloat(body.amount) : undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        paidDate: body.paidDate ? new Date(body.paidDate) : null,
        status: body.status,
        description: body.description,
      },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
      },
    });

    return NextResponse.json(payment);
  } catch (error: any) {
    console.error("Error updating payment:", error);

    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}

// DELETE /api/payments/:id - Delete a payment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if payment exists
    const existingPayment = await prisma.fee.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    await prisma.fee.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
