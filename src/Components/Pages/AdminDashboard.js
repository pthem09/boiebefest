import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Adjust path to match your project

const ADMIN_EMAILS = ['pthem09@gmail.com', 'simanhuang90@gmail.com'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [guests, setGuests] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadGuestList() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      setIsAuthorized(true);

      const { data, error } = await supabase
        .from('guests')
        .select(`
          id,
          full_name,
          is_coming,
          is_coming_friday,
          is_coming_saturday,
          is_coming_sunday,
          is_coming_monday,
          wedding_dinner_choice,
          will_book_taxi,
          will_not_book_hotel,
          food_to_stock,
          parties ( party_name )
        `)
        .order('full_name', { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setGuests(data || []);
      }
      setLoading(false);
    }

    loadGuestList();
  }, []);

  // Helper to convert rows to CSV and trigger browser download
  const exportToCSV = (rows, filename) => {
    const headers = [
      'Party',
      'Full Name',
      'Status',
      'Friday',
      'Saturday',
      'Sunday',
      'Monday',
      'Dinner Choice',
      'Needs Taxi',
      'No Hotel Needed',
      'Food to Stock'
    ];

    const escapeCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const formatStatus = (isComing) => {
      if (isComing === true) return 'Attending';
      if (isComing === false) return 'Declined';
      return 'Awaiting Response';
    };

    const csvContent = [
      headers.join(','),
      ...rows.map((g) =>
        [
          g.parties?.party_name || '',
          g.full_name,
          formatStatus(g.is_coming),
          g.is_coming_friday,
          g.is_coming_saturday,
          g.is_coming_sunday,
          g.is_coming_monday,
          g.wedding_dinner_choice,
          g.will_book_taxi,
          g.will_not_book_hotel,
          g.food_to_stock
        ]
          .map(escapeCell)
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="container my-5 text-center">Loading guest list...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  const attendingGuests = guests.filter((g) => g.is_coming === true);
  const declinedGuests = guests.filter((g) => g.is_coming === false);
  const awaitingGuests = guests.filter((g) => g.is_coming === null || g.is_coming === undefined);

  return (
    <div className="container my-5">
      <h1 className="mb-4 fw-bold">Boiebefest Guest Tracker</h1>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {/* Top Table: Attending */}
      <div className="card shadow mb-5">
        <div className="card-header d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0 text-success">
            Attending ({attendingGuests.length})
          </h4>
          <button
            className="btn btn-success btn-sm"
            onClick={() => exportToCSV(attendingGuests, 'boiebefest_attending.csv')}
            disabled={attendingGuests.length === 0}
          >
            Export Attending CSV
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Party</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Sun</th>
                <th>Mon</th>
                <th>Dinner</th>
                <th>Taxi</th>
                <th>No Hotel</th>
                <th>Food to Stock</th>
              </tr>
            </thead>
            <tbody>
              {attendingGuests.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-muted">
                    No confirmed RSVPs yet.
                  </td>
                </tr>
              ) : (
                attendingGuests.map((g) => (
                  <tr key={g.id}>
                    <td className="fw-semibold">{g.full_name}</td>
                    <td>{g.parties?.party_name}</td>
                    <td>{g.is_coming_friday ? '✓' : '—'}</td>
                    <td>{g.is_coming_saturday ? '✓' : '—'}</td>
                    <td>{g.is_coming_sunday ? '✓' : '—'}</td>
                    <td>{g.is_coming_monday ? '✓' : '—'}</td>
                    <td>{g.wedding_dinner_choice || '—'}</td>
                    <td>{g.will_book_taxi ? 'Yes' : 'No'}</td>
                    <td>{g.will_not_book_hotel ? 'Yes' : 'No'}</td>
                    <td>{g.food_to_stock || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Middle Table: Declined */}
      <div className="card shadow mb-5">
        <div className="card-header d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0 text-danger">
            Declined ({declinedGuests.length})
          </h4>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => exportToCSV(declinedGuests, 'boiebefest_declined.csv')}
            disabled={declinedGuests.length === 0}
          >
            Export Declined CSV
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Party</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {declinedGuests.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No declines!
                  </td>
                </tr>
              ) : (
                declinedGuests.map((g) => (
                  <tr key={g.id}>
                    <td className="fw-semibold">{g.full_name}</td>
                    <td>{g.parties?.party_name}</td>
                    <td>{g.food_to_stock || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Table: Awaiting Response */}
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0 text-warning">
            Awaiting Response ({awaitingGuests.length})
          </h4>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => exportToCSV(awaitingGuests, 'boiebefest_awaiting.csv')}
            disabled={awaitingGuests.length === 0}
          >
            Export Awaiting CSV
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Party</th>
              </tr>
            </thead>
            <tbody>
              {awaitingGuests.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-muted">
                    Everyone has responded!
                  </td>
                </tr>
              ) : (
                awaitingGuests.map((g) => (
                  <tr key={g.id}>
                    <td className="fw-semibold">{g.full_name}</td>
                    <td>{g.parties?.party_name}</td>
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