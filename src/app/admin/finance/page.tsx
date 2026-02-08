"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Student = {
  id: string;
  name: string;
  monthly_fee: number;
};

type Expense = {
  id: string;
  title: string;
  amount: number;
};

export default function FinancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: studentData } = await supabase
      .from("students")
      .select("*");

    const { data: expenseData } = await supabase
      .from("expenses")
      .select("*");

    setStudents(studentData || []);
    setExpenses(expenseData || []);
  }

  async function addStudent() {
    if (!name || !fee) return;

    await supabase.from("students").insert({
      name,
      monthly_fee: parseInt(fee),
    });

    setName("");
    setFee("");
    fetchData();
  }

  async function addExpense() {
    if (!expenseTitle || !expenseAmount) return;

    await supabase.from("expenses").insert({
      title: expenseTitle,
      amount: parseInt(expenseAmount),
    });

    setExpenseTitle("");
    setExpenseAmount("");
    fetchData();
  }

  const totalFees = students.reduce(
    (sum, s) => sum + s.monthly_fee,
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const net = totalFees - totalExpenses;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">
        Academy Finance Dashboard
      </h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <p>Total Monthly Fees</p>
          <p className="text-xl font-bold">Rs {totalFees}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <p>Total Expenses</p>
          <p className="text-xl font-bold">Rs {totalExpenses}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <p>Net Profit</p>
          <p className="text-xl font-bold">Rs {net}</p>
        </div>
      </div>

      {/* Add Student */}
      <div className="bg-white p-4 shadow rounded-xl space-y-3">
        <h2 className="font-semibold">Add Student</h2>
        <input
          className="border p-2 w-full"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Monthly fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />
        <button
          onClick={addStudent}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Student
        </button>
      </div>

      {/* Students List */}
      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="font-semibold mb-2">Students</h2>
        <ul>
          {students.map((s) => (
            <li key={s.id} className="border-b py-1">
              {s.name} — Rs {s.monthly_fee}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Expense */}
      <div className="bg-white p-4 shadow rounded-xl space-y-3">
        <h2 className="font-semibold">Add Expense</h2>
        <input
          className="border p-2 w-full"
          placeholder="Expense title"
          value={expenseTitle}
          onChange={(e) => setExpenseTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />
        <button
          onClick={addExpense}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="font-semibold mb-2">Expenses</h2>
        <ul>
          {expenses.map((e) => (
            <li key={e.id} className="border-b py-1">
              {e.title} — Rs {e.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
