"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function BorrowingsPage() {
  const { data: session, status } = useSession();
  const [borrowings, setBorrowings] = useState<any>([]);
  const [books, setBooks] = useState<any>([]);
  const [students, setStudents] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBorrowing, setEditingBorrowing] = useState<any>(null);
  const [formData, setFormData] = useState({
    bookId: "",
    studentId: "",
    dueDate: "",
    returnedDate: "",
    status: "borrowed",
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [borrowingsRes, booksRes, studentsRes] = await Promise.all([
        fetch("/api/borrowings"),
        fetch("/api/library"),
        fetch("/api/students"),
      ]);

      const borrowingsData = await borrowingsRes.json();
      const booksData = await booksRes.json();
      const studentsData = await studentsRes.json();

      setBorrowings(borrowingsData);
      setBooks(booksData);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingBorrowing
        ? `/api/borrowings/${editingBorrowing.id}`
        : "/api/borrowings";
      const method = editingBorrowing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchData();
        setShowModal(false);
        setEditingBorrowing(null);
        setFormData({
          bookId: "",
          studentId: "",
          dueDate: "",
          returnedDate: "",
          status: "borrowed",
        });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save borrowing record");
      }
    } catch (error) {
      console.error("Error saving borrowing record:", error);
      alert("Failed to save borrowing record");
    }
  };

  const handleEdit = (borrowing: any) => {
    setEditingBorrowing(borrowing);
    setFormData({
      bookId: borrowing.bookId,
      studentId: borrowing.studentId,
      dueDate: borrowing.dueDate.split("T")[0],
      returnedDate: borrowing.returnedDate
        ? borrowing.returnedDate.split("T")[0]
        : "",
      status: borrowing.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this borrowing record?"))
      return;

    try {
      const response = await fetch(`/api/borrowings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete borrowing record");
      }
    } catch (error) {
      console.error("Error deleting borrowing record:", error);
      alert("Failed to delete borrowing record");
    }
  };

  const openModal = () => {
    setEditingBorrowing(null);
    setFormData({
      bookId: "",
      studentId: "",
      dueDate: "",
      returnedDate: "",
      status: "borrowed",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBorrowing(null);
    setFormData({
      bookId: "",
      studentId: "",
      dueDate: "",
      returnedDate: "",
      status: "borrowed",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "returned":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "returned") return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading borrowings...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Book Borrowings
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage book borrowing and returns.
          </p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Borrowing
        </button>
      </div>
      <div className="border-t border-gray-200">
        {loading ? (
          <div className="px-4 py-5 sm:px-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading borrowings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Book
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Borrowed Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Returned Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowings.map((borrowing: any) => (
                  <tr key={borrowing.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrowing.book.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.student.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrowing.student.class.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(borrowing.borrowedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(borrowing.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {borrowing.returnedDate
                        ? new Date(borrowing.returnedDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          isOverdue(borrowing.dueDate, borrowing.status)
                            ? "overdue"
                            : borrowing.status
                        )}`}
                      >
                        {isOverdue(borrowing.dueDate, borrowing.status)
                          ? "Overdue"
                          : borrowing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(borrowing)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(borrowing.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {borrowings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Borrowings Found
                </h3>
                <p className="text-gray-500">
                  Get started by adding a new borrowing record.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editingBorrowing ? "Edit Borrowing" : "Add Borrowing"}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="bookId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Book
                    </label>
                    <select
                      id="bookId"
                      value={formData.bookId}
                      onChange={(e) =>
                        setFormData({ ...formData, bookId: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a book</option>
                      {books.map((book: any) => (
                        <option key={book.id} value={book.id}>
                          {book.title} by {book.author} ({book.available}{" "}
                          available)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="studentId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Student
                    </label>
                    <select
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) =>
                        setFormData({ ...formData, studentId: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a student</option>
                      {students.map((student: any) => (
                        <option key={student.id} value={student.id}>
                          {student.user.name} ({student.class.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="dueDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  {editingBorrowing && (
                    <>
                      <div>
                        <label
                          htmlFor="returnedDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Returned Date
                        </label>
                        <input
                          type="date"
                          id="returnedDate"
                          value={formData.returnedDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              returnedDate: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="borrowed">Borrowed</option>
                          <option value="returned">Returned</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingBorrowing ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
