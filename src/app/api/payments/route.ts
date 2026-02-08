import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch payments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const studentId = searchParams.get('student_id');

    let query = supabase
      .from('payments')
      .select(`
        *,
        students (
          id,
          name,
          phone,
          course,
          monthly_fee
        )
      `)
      .order('payment_date', { ascending: false });

    if (month) {
      query = query.eq('month', parseInt(month));
    }
    if (year) {
      query = query.eq('year', parseInt(year));
    }
    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ payments: data });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST - Create payment record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_id, month, year, amount_paid, payment_date, notes } = body;

    // Validate required fields
    if (!student_id || !month || !year || amount_paid === undefined) {
      return NextResponse.json(
        { error: 'Student ID, month, year, and amount are required' },
        { status: 400 }
      );
    }

    // Get student's info to determine status and check if active
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('monthly_fee, status')
      .eq('id', student_id)
      .single();

    if (studentError) throw studentError;

    // Check if student is active
    if (student.status !== 'active') {
      return NextResponse.json(
        { error: 'Cannot add payment for inactive students' },
        { status: 400 }
      );
    }

    // Determine payment status
    let status = 'unpaid';
    if (amount_paid >= student.monthly_fee) {
      status = 'paid';
    } else if (amount_paid > 0) {
      status = 'partial';
    }

    // Check if payment record already exists for this student/month/year
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('student_id', student_id)
      .eq('month', month)
      .eq('year', year)
      .single();

    let result;
    if (existingPayment) {
      // Update existing payment
      const { data, error } = await supabase
        .from('payments')
        .update({
          amount_paid,
          payment_date: payment_date || new Date().toISOString().split('T')[0],
          status,
          notes
        })
        .eq('id', existingPayment.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new payment
      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            student_id,
            month,
            year,
            amount_paid,
            payment_date: payment_date || new Date().toISOString().split('T')[0],
            status,
            notes
          }
        ])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ payment: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// PUT - Update payment
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, amount_paid, payment_date, notes, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('payments')
      .update({
        amount_paid,
        payment_date,
        notes,
        status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ payment: data });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}

// DELETE - Delete payment
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    );
  }
}