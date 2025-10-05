import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/borrowings - Get all borrowings
export async function GET() {
  try {
    const borrowings = await prisma.borrowing.findMany({
      include: {
        book: true,
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

    return NextResponse.json(borrowings);
  } catch (error) {
    console.error("Error fetching borrowings:", error);
    return NextResponse.json(
      { error: "Failed to fetch borrowings" },
      { status: 500 }
    );
  }
}

// POST /api/borrowings - Create a new borrowing
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.bookId || !body.studentId || !body.dueDate) {
      return NextResponse.json(
        { error: "Missing required fields: bookId, studentId, dueDate" },
        { status: 400 }
      );
    }

    // Check if the book is available
    const book = await prisma.book.findUnique({
      where: { id: body.bookId },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.available <= 0) {
      return NextResponse.json(
        { error: "No copies of this book are available" },
        { status: 400 }
      );
    }

    // Create the borrowing record
    const borrowing = await prisma.borrowing.create({
      data: {
        bookId: body.bookId,
        studentId: body.studentId,
        dueDate: new Date(body.dueDate),
        status: "borrowed",
      },
      include: {
        book: true,
        student: {
          include: {
            user: true,
            class: true,
          },
        },
      },
    });

    // Update book availability
    await prisma.book.update({
      where: { id: body.bookId },
      data: {
        available: book.available - 1,
      },
    });

    return NextResponse.json(borrowing, { status: 201 });
  } catch (error: any) {
    console.error("Error creating borrowing:", error);

    return NextResponse.json(
      { error: "Failed to create borrowing" },
      { status: 500 }
    );
  }
}

// PUT /api/borrowings/:id - Update a borrowing (e.g., return a book)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Check if borrowing exists
    const existingBorrowing = await prisma.borrowing.findUnique({
      where: { id },
      include: { book: true },
    });

    if (!existingBorrowing) {
      return NextResponse.json(
        { error: "Borrowing record not found" },
        { status: 404 }
      );
    }

    // If returning the book, update book availability
    let bookUpdateData = {};
    if (body.status === "returned" && existingBorrowing.status !== "returned") {
      bookUpdateData = {
        available: existingBorrowing.book.available + 1,
      };
    }

    const borrowing = await prisma.borrowing.update({
      where: { id },
      data: {
        returnedDate: body.returnedDate
          ? new Date(body.returnedDate)
          : undefined,
        status: body.status,
      },
      include: {
        book: true,
        student: {
          include: {
            user: true,
            class: true,
          },
        },
      },
    });

    // Update book availability if returning
    if (Object.keys(bookUpdateData).length > 0) {
      await prisma.book.update({
        where: { id: existingBorrowing.bookId },
        data: bookUpdateData,
      });
    }

    return NextResponse.json(borrowing);
  } catch (error: any) {
    console.error("Error updating borrowing:", error);

    return NextResponse.json(
      { error: "Failed to update borrowing" },
      { status: 500 }
    );
  }
}

// DELETE /api/borrowings/:id - Delete a borrowing record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if borrowing exists
    const existingBorrowing = await prisma.borrowing.findUnique({
      where: { id },
      include: { book: true },
    });

    if (!existingBorrowing) {
      return NextResponse.json(
        { error: "Borrowing record not found" },
        { status: 404 }
      );
    }

    // If the book was borrowed, update book availability
    if (existingBorrowing.status === "borrowed") {
      await prisma.book.update({
        where: { id: existingBorrowing.bookId },
        data: {
          available: existingBorrowing.book.available + 1,
        },
      });
    }

    await prisma.borrowing.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Borrowing record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting borrowing:", error);
    return NextResponse.json(
      { error: "Failed to delete borrowing record" },
      { status: 500 }
    );
  }
}
