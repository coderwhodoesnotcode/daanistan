// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  X,
  Clock
} from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EXPENSE_CATEGORIES = [
  'Rent',
  'Utilities',
  'Salaries',
  'Supplies',
  'Marketing',
  'Maintenance',
  'Other'
];

export default function AcademyManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    monthlyCollection: 0,
    monthlyExpenses: 0,
    expectedRevenue: 0,
    collectionRate: 0,
    netProfit: 0
  });

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchPayments();
    fetchExpenses();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const url = viewMode === 'all' 
        ? '/api/payments'
        : `/api/payments?month=${selectedMonth}&year=${selectedYear}`;
      const response = await fetch(url);
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const url = viewMode === 'all'
        ? '/api/expenses'
        : `/api/expenses?month=${selectedMonth}&year=${selectedYear}`;
      const response = await fetch(url);
      const data = await response.json();
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/stats?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      setStats(data.stats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddStudent = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        await fetchStudents();
        await fetchStats();
        setShowAddStudent(false);
        alert('Student added successfully!');
      } else {
        alert('Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (id, updates) => {
    setLoading(true);
    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (response.ok) {
        await fetchStudents();
        await fetchStats();
        setShowEditStudent(false);
        alert('Student updated successfully!');
      } else {
        alert('Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student? All payment records will also be deleted.')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchStudents();
        await fetchStats();
        alert('Student deleted successfully!');
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        await fetchPayments();
        await fetchStats();
        setShowPaymentModal(false);
        setSelectedStudent(null);
        alert('Payment recorded successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to record payment: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Error recording payment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        await fetchExpenses();
        await fetchStats();
        setShowAddExpense(false);
        alert('Expense added successfully!');
      } else {
        alert('Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchExpenses();
        await fetchStats();
        alert('Expense deleted successfully!');
      } else {
        alert('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getFilteredStudents = (statusFilter = null) => {
    let filtered = students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm)) ||
      (s.course && s.course.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (statusFilter) {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Academy Management</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Since April 1, 2025</p>
            </div>
            
            {/* Mobile responsive controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <select 
                value={viewMode}
                onChange={(e) => {
                  setViewMode(e.target.value);
                  setTimeout(() => {
                    fetchPayments();
                    fetchExpenses();
                  }, 0);
                }}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
              >
                <option value="current">Current Month</option>
                <option value="all">All Time</option>
              </select>
              {viewMode === 'current' && (
                <div className="flex gap-3 w-full sm:w-auto">
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                  >
                    {MONTHS.map((month, idx) => (
                      <option key={idx} value={idx + 1}>{month}</option>
                    ))}
                  </select>
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                  >
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Active Students"
              value={stats.activeStudents || 0}
              subtitle={`Total: ${stats.totalStudents || 0}`}
              color="blue"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Monthly Collection"
              value={formatCurrency(stats.monthlyCollection)}
              subtitle={`Expected: ${formatCurrency(stats.expectedRevenue)}`}
              color="green"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Collection Rate"
              value={`${(stats.collectionRate || 0).toFixed(1)}%`}
              subtitle={`${formatCurrency(stats.monthlyCollection)} / ${formatCurrency(stats.expectedRevenue)}`}
              color="purple"
            />
            <StatCard
              icon={<Calendar className="w-6 h-6" />}
              title="Net Profit"
              value={formatCurrency(stats.netProfit || 0)}
              subtitle={`Expenses: ${formatCurrency(stats.monthlyExpenses)}`}
              color="orange"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex -mb-px min-w-max">
              <TabButton 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </TabButton>
              <TabButton 
                active={activeTab === 'students'} 
                onClick={() => setActiveTab('students')}
              >
                Students
              </TabButton>
              <TabButton 
                active={activeTab === 'payments'} 
                onClick={() => setActiveTab('payments')}
              >
                Payments
              </TabButton>
              <TabButton 
                active={activeTab === 'expenses'} 
                onClick={() => setActiveTab('expenses')}
              >
                Expenses
              </TabButton>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <OverviewTab 
                stats={stats} 
                formatCurrency={formatCurrency}
                students={students}
                payments={payments}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            )}
            {activeTab === 'students' && (
              <StudentsTab 
                students={getFilteredStudents()}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddStudent={() => setShowAddStudent(true)}
                onEditStudent={(student) => {
                  setSelectedStudent(student);
                  setShowEditStudent(true);
                }}
                onDeleteStudent={handleDeleteStudent}
                onMarkPayment={(student) => {
                  if (student.status !== 'active') {
                    alert('Cannot add payment for inactive students. Please change status to "active" first.');
                    return;
                  }
                  setSelectedStudent(student);
                  setShowPaymentModal(true);
                }}
                formatCurrency={formatCurrency}
              />
            )}
            {activeTab === 'payments' && (
              <PaymentsTab 
                payments={payments}
                students={students}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                formatCurrency={formatCurrency}
                viewMode={viewMode}
              />
            )}
            {activeTab === 'expenses' && (
              <ExpensesTab 
                expenses={expenses}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onAddExpense={() => setShowAddExpense(true)}
                onDeleteExpense={handleDeleteExpense}
                formatCurrency={formatCurrency}
                viewMode={viewMode}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddStudent && (
        <AddStudentModal 
          onClose={() => setShowAddStudent(false)}
          onSubmit={handleAddStudent}
          loading={loading}
        />
      )}
      
      {showEditStudent && selectedStudent && (
        <EditStudentModal 
          student={selectedStudent}
          onClose={() => {
            setShowEditStudent(false);
            setSelectedStudent(null);
          }}
          onSubmit={(updates) => handleUpdateStudent(selectedStudent.id, updates)}
          loading={loading}
        />
      )}
      
      {showAddExpense && (
        <AddExpenseModal 
          onClose={() => setShowAddExpense(false)}
          onSubmit={handleAddExpense}
          loading={loading}
        />
      )}
      
      {showPaymentModal && selectedStudent && (
        <PaymentModal 
          student={selectedStudent}
          month={selectedMonth}
          year={selectedYear}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedStudent(null);
          }}
          onSubmit={handleAddPayment}
          loading={loading}
        />
      )}
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${colorClasses[color]} text-white p-2 rounded-lg`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{value}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 truncate">{subtitle}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );
}

function OverviewTab({ stats, formatCurrency, students, payments, selectedMonth, selectedYear }) {
  const activeStudents = students.filter(s => s.status === 'active');
  
  const currentMonthPayments = payments.filter(
    p => p.month === selectedMonth && p.year === selectedYear
  );
  
  const paidStudentIds = new Set(
    currentMonthPayments
      .filter(p => p.status === 'paid')
      .map(p => p.student_id)
  );
  
  const partialPaymentStudents = currentMonthPayments
    .filter(p => p.status === 'partial')
    .map(payment => {
      const student = activeStudents.find(s => s.id === payment.student_id);
      return student ? {
        ...student,
        amountPaid: payment.amount_paid,
        remaining: student.monthly_fee - payment.amount_paid,
        paymentDate: payment.payment_date,
        notes: payment.notes
      } : null;
    })
    .filter(Boolean);
  
  const unpaidStudents = activeStudents.filter(
    s => !paidStudentIds.has(s.id) && 
         !partialPaymentStudents.find(p => p.id === s.id)
  );

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
        Monthly Overview - {MONTHS[selectedMonth - 1]} {selectedYear}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 sm:p-6 border border-green-200">
          <h3 className="font-semibold text-green-800 mb-4 text-sm sm:text-base">Revenue Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-700">Expected Revenue:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(stats.expectedRevenue)}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-700">Actual Collection:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(stats.monthlyCollection)}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-700">Pending:</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(stats.expectedRevenue - stats.monthlyCollection)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 sm:p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-4 text-sm sm:text-base">Profit Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-700">Total Collection:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(stats.monthlyCollection)}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-700">Total Expenses:</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(stats.monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm sm:text-base">
              <span className="text-gray-700 font-semibold">Net Profit:</span>
              <span className={`font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.netProfit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h4 className="font-semibold text-green-800 text-sm sm:text-base">Fully Paid</h4>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {paidStudentIds.size}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            {formatCurrency(
              currentMonthPayments
                .filter(p => p.status === 'paid')
                .reduce((sum, p) => sum + p.amount_paid, 0)
            )}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <h4 className="font-semibold text-yellow-800 text-sm sm:text-base">Partial Payment</h4>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">
            {partialPaymentStudents.length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            {formatCurrency(
              partialPaymentStudents.reduce((sum, s) => sum + s.amountPaid, 0)
            )} paid
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h4 className="font-semibold text-red-800 text-sm sm:text-base">Not Paid</h4>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-600">
            {unpaidStudents.length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            {formatCurrency(
              unpaidStudents.reduce((sum, s) => sum + s.monthly_fee, 0)
            )} pending
          </p>
        </div>
      </div>

      {/* Partial Payment Students */}
      {partialPaymentStudents.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-yellow-800 text-base sm:text-lg">
              ⚠️ Partial Payment Students ({partialPaymentStudents.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {partialPaymentStudents.map(student => (
              <div key={student.id} className="bg-white p-4 rounded-lg border border-yellow-300 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="font-semibold text-gray-900 truncate">{student.name}</p>
                    <p className="text-sm text-gray-600 truncate">{student.course}</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded whitespace-nowrap">
                    Partial
                  </span>
                </div>
                
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Monthly Fee:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(student.monthly_fee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Paid:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(student.amountPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm pt-2 border-t border-yellow-200">
                    <span className="font-semibold text-gray-700">Remaining:</span>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(student.remaining)}
                    </span>
                  </div>
                </div>
                
                {student.notes && (
                  <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">
                    Note: {student.notes}
                  </p>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Last payment: {new Date(student.paymentDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <p className="text-xs sm:text-sm text-yellow-800">
              <strong>Total Partial Payments:</strong> {formatCurrency(
                partialPaymentStudents.reduce((sum, s) => sum + s.amountPaid, 0)
              )} collected, {formatCurrency(
                partialPaymentStudents.reduce((sum, s) => sum + s.remaining, 0)
              )} remaining
            </p>
          </div>
        </div>
      )}

      {/* Unpaid Students */}
      {unpaidStudents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-red-800 text-base sm:text-lg">
              ❌ Unpaid Students ({unpaidStudents.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unpaidStudents.map(student => (
              <div key={student.id} className="flex justify-between items-center bg-white p-3 rounded border border-red-300">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="font-medium text-gray-900 truncate">{student.name}</p>
                  <p className="text-sm text-gray-600 truncate">{student.course}</p>
                </div>
                <span className="font-semibold text-red-600 whitespace-nowrap">
                  {formatCurrency(student.monthly_fee)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-100 rounded-lg">
            <p className="text-xs sm:text-sm text-red-800">
              <strong>Total Pending:</strong> {formatCurrency(
                unpaidStudents.reduce((sum, s) => sum + s.monthly_fee, 0)
              )}
            </p>
          </div>
        </div>
      )}

      {/* All Paid Message */}
      {unpaidStudents.length === 0 && partialPaymentStudents.length === 0 && activeStudents.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl sm:text-5xl mb-3">🎉</div>
          <h3 className="font-bold text-green-800 text-lg sm:text-xl mb-2">
            All Students Have Paid!
          </h3>
          <p className="text-green-700 text-sm sm:text-base">
            All {paidStudentIds.size} active students have completed their payment for {MONTHS[selectedMonth - 1]} {selectedYear}.
          </p>
        </div>
      )}
    </div>
  );
}

function StudentsTab({ students, searchTerm, setSearchTerm, onAddStudent, onEditStudent, onDeleteStudent, onMarkPayment, formatCurrency }) {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStudents = students.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const activeCount = students.filter(s => s.status === 'active').length;
  const inactiveCount = students.filter(s => s.status === 'inactive').length;
  const graduatedCount = students.filter(s => s.status === 'graduated').length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Students</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <button 
            onClick={onAddStudent}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
            statusFilter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({students.length})
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
            statusFilter === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setStatusFilter('inactive')}
          className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
            statusFilter === 'inactive'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Inactive ({inactiveCount})
        </button>
        <button
          onClick={() => setStatusFilter('graduated')}
          className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
            statusFilter === 'graduated'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Graduated ({graduatedCount})
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Fee</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Join Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-8 text-center text-gray-500 text-sm">
                    No students found. Add your first student to get started!
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{student.course}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {formatCurrency(student.monthly_fee)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                      {new Date(student.join_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : student.status === 'graduated'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {student.status === 'active' && (
                          <button 
                            onClick={() => onMarkPayment(student)}
                            className="text-green-600 hover:text-green-900"
                            title="Mark Payment"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => onEditStudent(student)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button 
                          onClick={() => onDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PaymentsTab({ payments, students, selectedMonth, selectedYear, formatCurrency, viewMode }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Payment Records {viewMode === 'current' && `- ${MONTHS[selectedMonth - 1]} ${selectedYear}`}
        </h2>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base">
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          Export
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                {viewMode === 'all' && (
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
                )}
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Payment Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={viewMode === 'all' ? 6 : 5} className="px-4 sm:px-6 py-8 text-center text-gray-500 text-sm">
                    No payment records found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const student = students.find(s => s.id === payment.student_id);
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {student?.name || 'Unknown Student'}
                      </td>
                      {viewMode === 'all' && (
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {MONTHS[payment.month - 1]} {payment.year}
                        </td>
                      )}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {formatCurrency(payment.amount_paid)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : payment.status === 'partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {payment.notes || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ExpensesTab({ expenses, selectedMonth, selectedYear, onAddExpense, onDeleteExpense, formatCurrency, viewMode }) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Expenses {viewMode === 'current' && `- ${MONTHS[selectedMonth - 1]} ${selectedYear}`}
        </h2>
        <button 
          onClick={onAddExpense}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Add Expense
        </button>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {Object.entries(expensesByCategory).map(([category, amount]) => (
          <div key={category} className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
            <p className="text-xs sm:text-sm text-gray-600 capitalize truncate">{category}</p>
            <p className="text-lg sm:text-xl font-bold text-orange-600 truncate">
              {formatCurrency(amount)}
            </p>
          </div>
        ))}
        <div className="bg-gray-100 rounded-lg p-3 sm:p-4 border border-gray-300">
          <p className="text-xs sm:text-sm text-gray-600">Total Expenses</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800 truncate">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Notes</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-8 text-center text-gray-500 text-sm">
                    No expenses recorded
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {expense.title}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 capitalize">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                      {new Date(expense.expense_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                      {expense.notes || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-900" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddStudentModal({ onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    monthly_fee: '',
    join_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.course || !formData.monthly_fee) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold">Add New Student</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name *
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course *
            </label>
            <input 
              type="text" 
              value={formData.course}
              onChange={(e) => setFormData({...formData, course: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Fee *
            </label>
            <input 
              type="number" 
              value={formData.monthly_fee}
              onChange={(e) => setFormData({...formData, monthly_fee: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Join Date
            </label>
            <input 
              type="date" 
              value={formData.join_date}
              onChange={(e) => setFormData({...formData, join_date: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditStudentModal({ student, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: student.name,
    phone: student.phone || '',
    email: student.email || '',
    course: student.course,
    monthly_fee: student.monthly_fee,
    status: student.status,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold">Edit Student</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name *
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course *
            </label>
            <input 
              type="text" 
              value={formData.course}
              onChange={(e) => setFormData({...formData, course: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Fee *
            </label>
            <input 
              type="number" 
              value={formData.monthly_fee}
              onChange={(e) => setFormData({...formData, monthly_fee: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive (Leave)</option>
              <option value="graduated">Graduated</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Note: Changing to 'Inactive' will prevent new payments but keep payment history
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddExpenseModal({ onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold">Add New Expense</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Title *
            </label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              required
            >
              <option value="">Select Category</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input 
              type="number" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input 
              type="date" 
              value={formData.expense_date}
              onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PaymentModal({ student, month: defaultMonth, year: defaultYear, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    student_id: student.id,
    month: defaultMonth,
    year: defaultYear,
    amount_paid: student.monthly_fee,
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  
  const [existingPayment, setExistingPayment] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  useEffect(() => {
    fetchExistingPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.month, formData.year]);

  const fetchExistingPayment = async () => {
    setIsLoadingPayment(true);
    try {
      const response = await fetch(
        `/api/payments?student_id=${student.id}&month=${formData.month}&year=${formData.year}`
      );
      const data = await response.json();
      
      if (data.payments && data.payments.length > 0) {
        setExistingPayment(data.payments[0]);
      } else {
        setExistingPayment(null);
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const totalPaid = existingPayment ? existingPayment.amount_paid : 0;
  const remaining = student.monthly_fee - totalPaid;
  const isFullyPaid = totalPaid >= student.monthly_fee;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newAmount = parseInt(formData.amount_paid);
    const newTotal = totalPaid + newAmount;
    
    if (newTotal > student.monthly_fee && !confirm(
      `Total amount (₹${newTotal}) will exceed monthly fee (₹${student.monthly_fee}). Continue?`
    )) {
      return;
    }
    
    const finalAmount = existingPayment ? newTotal : newAmount;
    
    onSubmit({
      ...formData,
      amount_paid: finalAmount,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold">Mark Payment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600">Student</p>
          <p className="font-semibold text-sm sm:text-base">{student.name}</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">Course</p>
          <p className="font-semibold text-sm sm:text-base">{student.course}</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">Monthly Fee</p>
          <p className="font-semibold text-sm sm:text-base">{formatCurrency(student.monthly_fee)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month *
              </label>
              <select 
                value={formData.month}
                onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                required
              >
                {MONTHS.map((monthName, idx) => (
                  <option key={idx} value={idx + 1}>{monthName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <select 
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                required
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          </div>

          {isLoadingPayment ? (
            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
              Loading payment info...
            </div>
          ) : existingPayment ? (
            <div className={`p-4 rounded-lg border-2 ${
              isFullyPaid 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isFullyPaid ? '✓ Fully Paid' : '⚠ Partial Payment'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Paid on: {new Date(existingPayment.payment_date).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span className={`text-base sm:text-lg font-bold ${
                  isFullyPaid ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              
              {!isFullyPaid && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                </div>
              )}
              
              {existingPayment.notes && (
                <p className="mt-2 text-xs text-gray-600 italic">
                  Note: {existingPayment.notes}
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                No payment recorded for this month yet
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {existingPayment && !isFullyPaid ? 'Additional Amount to Pay *' : 'Amount Paid *'}
            </label>
            <input 
              type="number" 
              value={formData.amount_paid}
              onChange={(e) => setFormData({...formData, amount_paid: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              required
              min="0"
              disabled={isFullyPaid}
            />
            {existingPayment && !isFullyPaid && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Already Paid:</span>
                  <span className="font-medium">{formatCurrency(totalPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Adding Now:</span>
                  <span className="font-medium">{formatCurrency(parseInt(formData.amount_paid) || 0)}</span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-blue-200">
                  <span className="font-semibold text-gray-700">New Total:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(totalPaid + (parseInt(formData.amount_paid) || 0))}
                  </span>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {isFullyPaid 
                ? '✓ This month is already fully paid'
                : `Remaining to pay: ${formatCurrency(remaining)}`
              }
            </p>
          </div>

          {existingPayment && !isFullyPaid && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Select:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, amount_paid: remaining})}
                  className="px-2 sm:px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium"
                >
                  Remaining<br/>{formatCurrency(remaining)}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, amount_paid: Math.floor(remaining / 2)})}
                  className="px-2 sm:px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium"
                >
                  Half<br/>{formatCurrency(Math.floor(remaining / 2))}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, amount_paid: 1000})}
                  className="px-2 sm:px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-medium"
                >
                  ₹1000
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input 
              type="date" 
              value={formData.payment_date}
              onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              disabled={isFullyPaid}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={2}
              placeholder="e.g., Paid via UPI, Cash, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              disabled={isFullyPaid}
            />
          </div>

          {!isFullyPaid && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> You can add multiple partial payments. They will be combined automatically.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base"
              disabled={loading || isFullyPaid}
            >
              {loading ? 'Saving...' : existingPayment ? 'Add Payment' : 'Mark as Paid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}