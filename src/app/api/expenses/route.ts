import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch expenses
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const category = searchParams.get('category');

    let query = supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false });

    if (month) {
      query = query.eq('month', parseInt(month));
    }
    if (year) {
      query = query.eq('year', parseInt(year));
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ expenses: data });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST - Create expense
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, amount, expense_date, notes } = body;

    // Validate required fields
    if (!title || !category || !amount) {
      return NextResponse.json(
        { error: 'Title, category, and amount are required' },
        { status: 400 }
      );
    }

    // Extract month and year from expense_date
    const date = expense_date ? new Date(expense_date) : new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          title,
          category,
          amount,
          expense_date: expense_date || new Date().toISOString().split('T')[0],
          month,
          year,
          notes
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ expense: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}

// PUT - Update expense
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, category, amount, expense_date, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    // Extract month and year if expense_date is updated
    let updates: any = { title, category, amount, notes };
    if (expense_date) {
      const date = new Date(expense_date);
      updates.expense_date = expense_date;
      updates.month = date.getMonth() + 1;
      updates.year = date.getFullYear();
    }

    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ expense: data });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    );
  }
}

// DELETE - Delete expense
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}