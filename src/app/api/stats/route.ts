import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch statistics for a given month/year
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    // Fetch all active students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*');

    if (studentsError) throw studentsError;

    const activeStudents = students.filter(s => s.status === 'active');

    // Fetch payments for the month
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('month', month)
      .eq('year', year);

    if (paymentsError) throw paymentsError;

    // Fetch expenses for the month
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('month', month)
      .eq('year', year);

    if (expensesError) throw expensesError;

    // Calculate statistics
    const totalStudents = students.length;
    const activeStudentsCount = activeStudents.length;

    const totalCollection = payments
      .filter(p => p.status === 'paid' || p.status === 'partial')
      .reduce((sum, p) => sum + p.amount_paid, 0);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const expectedRevenue = activeStudents.reduce((sum, s) => sum + s.monthly_fee, 0);

    const collectionRate = expectedRevenue > 0 ? (totalCollection / expectedRevenue) * 100 : 0;

    const paidCount = payments.filter(p => p.status === 'paid').length;
    const partialCount = payments.filter(p => p.status === 'partial').length;
    const unpaidCount = activeStudentsCount - paidCount - partialCount;

    // Calculate expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Get students who haven't paid
    const paidStudentIds = new Set(
      payments
        .filter(p => p.status === 'paid' || p.status === 'partial')
        .map(p => p.student_id)
    );

    const unpaidStudents = activeStudents
      .filter(s => !paidStudentIds.has(s.id))
      .map(s => ({
        id: s.id,
        name: s.name,
        phone: s.phone,
        monthly_fee: s.monthly_fee
      }));

    return NextResponse.json({
      stats: {
        totalStudents,
        activeStudents: activeStudentsCount,
        monthlyCollection: totalCollection,
        monthlyExpenses: totalExpenses,
        expectedRevenue,
        collectionRate,
        netProfit: totalCollection - totalExpenses,
        paidCount,
        partialCount,
        unpaidCount
      },
      expensesByCategory,
      unpaidStudents,
      month,
      year
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

// GET yearly statistics
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { year } = body;

    if (!year) {
      return NextResponse.json(
        { error: 'Year is required' },
        { status: 400 }
      );
    }

    // Fetch all payments for the year
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('year', year);

    if (paymentsError) throw paymentsError;

    // Fetch all expenses for the year
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('year', year);

    if (expensesError) throw expensesError;

    // Calculate monthly breakdown
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthPayments = payments.filter(p => p.month === month);
      const monthExpenses = expenses.filter(e => e.month === month);

      const collection = monthPayments
        .filter(p => p.status === 'paid' || p.status === 'partial')
        .reduce((sum, p) => sum + p.amount_paid, 0);

      const expense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

      return {
        month,
        monthName: new Date(year, i).toLocaleString('default', { month: 'long' }),
        collection,
        expenses: expense,
        profit: collection - expense,
        studentsPaid: new Set(monthPayments.map(p => p.student_id)).size
      };
    });

    const totalYearlyCollection = monthlyData.reduce((sum, m) => sum + m.collection, 0);
    const totalYearlyExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
    const totalYearlyProfit = totalYearlyCollection - totalYearlyExpenses;

    return NextResponse.json({
      year,
      monthlyData,
      totals: {
        collection: totalYearlyCollection,
        expenses: totalYearlyExpenses,
        profit: totalYearlyProfit
      }
    });
  } catch (error) {
    console.error('Error fetching yearly statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch yearly statistics' },
      { status: 500 }
    );
  }
}