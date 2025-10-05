import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/library - Get all books
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST /api/library - Create a new book
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.author) {
      return NextResponse.json(
        { error: "Missing required fields: title, author" },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author,
        isbn: body.isbn || null,
        category: body.category || null,
        quantity: body.quantity ? parseInt(body.quantity) : 1,
        available: body.available ? parseInt(body.available) : 1,
        publisher: body.publisher || null,
        publishedYear: body.publishedYear ? parseInt(body.publishedYear) : null,
        description: body.description || null,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    console.error("Error creating book:", error);

    // Handle Prisma errors
    if (error.code === "P2002" && error.meta?.target?.includes("isbn")) {
      return NextResponse.json(
        { error: "A book with this ISBN already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}

// PUT /api/library/:id - Update a book
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = await prisma.book.update({
      where: { id },
      data: {
        title: body.title,
        author: body.author,
        isbn: body.isbn,
        category: body.category,
        quantity: body.quantity ? parseInt(body.quantity) : undefined,
        available: body.available ? parseInt(body.available) : undefined,
        publisher: body.publisher,
        publishedYear: body.publishedYear
          ? parseInt(body.publishedYear)
          : undefined,
        description: body.description,
      },
    });

    return NextResponse.json(book);
  } catch (error: any) {
    console.error("Error updating book:", error);

    // Handle Prisma errors
    if (error.code === "P2002" && error.meta?.target?.includes("isbn")) {
      return NextResponse.json(
        { error: "A book with this ISBN already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

// DELETE /api/library/:id - Delete a book
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check if there are active borrowings for this book
    const activeBorrowings = await prisma.borrowing.count({
      where: {
        bookId: id,
        status: "borrowed",
      },
    });

    if (activeBorrowings > 0) {
      return NextResponse.json(
        { error: "Cannot delete book with active borrowings" },
        { status: 400 }
      );
    }

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
