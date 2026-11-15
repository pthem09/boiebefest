import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const DINNER_OPTIONS = ['Beef', 'Chicken', 'Fish', 'Vegetarian / Vegan'];

const EVENT_DAYS = [
  { key: 'is_coming_friday', label: 'Friday' },
  { key: 'is_coming_saturday', label: 'Saturday' },
  { key: 'is_coming_sunday', label: 'Sunday (Wedding Day)' },
  { key: 'is_coming_monday', label: 'Monday' },
];

export default function RSVP({ session }) {
  const [party, setParty] = useState(null);
  const [guests, setGuests] = useState([]);
  const [openGuestId, setOpenGuestId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPartyAndGuests() {
      setLoading(true);
      setError(null);

      // 1. Find the party_id linked to the logged-in user in party_users
      const { data: partyUserData, error: partyUserError } = await supabase
        .from('party_users')
        .select('party_id')
        .eq('user_id', session.user.id)
        .single();

      if (partyUserError || !partyUserData) {
        setError(`Could not find your party link: ${partyUserError?.message || 'No matching user found.'}`);
        setLoading(false);
        return;
      }

      const partyId = partyUserData.party_id;

      // 2. Fetch the party details using party_id
      const { data: partyData, error: partyError } = await supabase
        .from('parties')
        .select('*')
        .eq('id', partyId)
        .single();

      if (partyError) {
        setError(`Could not load party details: ${partyError.message}`);
        setLoading(false);
        return;
      }

      setParty(partyData);

      // 3. Fetch all guests belonging to that party_id
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('party_id', partyId)
        .order('id', { ascending: true });

      if (guestError) {
        setError(`Could not load guests: ${guestError.message}`);
      } else {
        const loadedGuests = guestData || [];
        setGuests(loadedGuests);
        if (loadedGuests.length > 0) {
          setOpenGuestId(loadedGuests[0].id);
        }
      }

      setLoading(false);
    }

    if (session?.user?.id) {
      loadPartyAndGuests();
    }
  }, [session]);

  const handleGuestChange = (guestId, field, value) => {
    setGuests((prev) =>
      prev.map((guest) =>
        guest.id === guestId ? { ...guest, [field]: value } : guest
      )
    );
  };

  const toggleGuestAccordion = (guestId) => {
    setOpenGuestId((prev) => (prev === guestId ? null : guestId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      for (const guest of guests) {
        const { error: guestUpdateError } = await supabase
          .from('guests')
          .update({
            full_name: guest.full_name || '',
            is_coming: Boolean(guest.is_coming),
            is_coming_friday: Boolean(guest.is_coming_friday),
            is_coming_saturday: Boolean(guest.is_coming_saturday),
            is_coming_sunday: Boolean(guest.is_coming_sunday),
            is_coming_monday: Boolean(guest.is_coming_monday),
            wedding_dinner_choice: guest.wedding_dinner_choice || '',
            will_book_taxi: Boolean(guest.will_book_taxi),
            will_not_book_hotel: Boolean(guest.will_not_book_hotel),
            food_to_stock: guest.food_to_stock || '',
          })
          .eq('id', guest.id);

        if (guestUpdateError) throw guestUpdateError;
      }

      setMessage('Your RSVP has been saved!');
    } catch (err) {
      setError(`Error saving RSVP: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading your invitation...</div>;
  }

  if (!party) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          {error || 'No invitation found for this email address.'}
        </div>
      </div>
    );
  }

    return (
    <div className="container my-5" style={{ maxWidth: '800px' }}>
      <h2 className="mb-2">RSVP for Your Party</h2>
      <p className="text-muted mb-4">
        Click each guest below to expand and update their attendance and meal selections.
      </p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <h4 className="mb-3">Guests in Your Party</h4>
        <div className="accordion mb-4" id="guestsAccordion">
          {guests.map((guest, index) => {
            const isOpen = openGuestId === guest.id;
            const displayName = guest.full_name || `Guest ${index + 1}`;

            return (
              <div className="card mb-3 border-secondary" key={guest.id}>
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleGuestAccordion(guest.id)}
                >
                  <div>
                    <strong>{displayName}</strong>
                    <span
                      className={`badge ms-3 ${
                        guest.is_coming ? 'bg-success' : 'bg-secondary'
                      }`}
                    >
                      {guest.is_coming ? 'Attending' : 'Regretfully Not Attending'}
                    </span>
                  </div>
                  <span>{isOpen ? '▲ Collapse' : '▼ Edit'}</span>
                </div>

                {isOpen && (
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label" htmlFor={`name-${guest.id}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`name-${guest.id}`}
                        value={guest.full_name || ''}
                        onChange={(e) =>
                          handleGuestChange(guest.id, 'full_name', e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`coming-${guest.id}`}
                        checked={Boolean(guest.is_coming)}
                        onChange={(e) =>
                          handleGuestChange(guest.id, 'is_coming', e.target.checked)
                        }
                      />
                      <label className="form-check-label" htmlFor={`coming-${guest.id}`}>
                        <strong>Yes, {guest.full_name || 'this guest'} is attending</strong>
                      </label>
                    </div>

                    {guest.is_coming && (
                      <>
                        <div className="mb-3">
                          <label className="form-label d-block">
                            Which days will {guest.full_name || 'this guest'} attend?
                          </label>
                          {EVENT_DAYS.map((day) => (
                            <div className="form-check form-check-inline" key={day.key}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`${day.key}-${guest.id}`}
                                checked={Boolean(guest[day.key])}
                                onChange={(e) =>
                                  handleGuestChange(guest.id, day.key, e.target.checked)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`${day.key}-${guest.id}`}
                              >
                                {day.label}
                              </label>
                            </div>
                          ))}
                        </div>

                        <div className="mb-3">
                          <label className="form-label" htmlFor={`dinner-${guest.id}`}>
                            Wedding Dinner Choice
                          </label>
                          <select
                            className="form-select"
                            id={`dinner-${guest.id}`}
                            value={guest.wedding_dinner_choice || ''}
                            onChange={(e) =>
                              handleGuestChange(
                                guest.id,
                                'wedding_dinner_choice',
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">Select an entrée...</option>
                            {DINNER_OPTIONS.map((choice) => (
                              <option key={choice} value={choice}>
                                {choice}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`taxi-${guest.id}`}
                            checked={Boolean(guest.will_book_taxi)}
                            onChange={(e) =>
                              handleGuestChange(guest.id, 'will_book_taxi', e.target.checked)
                            }
                          />
                          <label className="form-check-label" htmlFor={`taxi-${guest.id}`}>
                            I acknowledge that I will arrange my own transportation to and from Louchrew Estate.
                          </label>
                        </div>

                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`hotel-${guest.id}`}
                            checked={Boolean(guest.will_not_book_hotel)}
                            onChange={(e) =>
                              handleGuestChange(
                                guest.id,
                                'will_not_book_hotel',
                                e.target.checked
                              )
                            }
                          />
                          <label className="form-check-label" htmlFor={`hotel-${guest.id}`}>
                            I acknowledge that I do NOT need to book a hotel, as Paul and Siman booked Louchrew Estate for me!
                          </label>
                        </div>

                        <div className="mb-3">
                          <label className="form-label" htmlFor={`food-${guest.id}`}>
                            Dinners will be provided and there is a café on site with breakfast and lunch for purchase. However, we also have a kitchen available.
                            Please enter any food items you would like us to stock. (If we stock it, please be sure to eat it!)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id={`food-${guest.id}`}
                            maxLength={250}
                            placeholder="Any favorite snacks, drinks, or dietary notes?"
                            value={guest.food_to_stock || ''}
                            onChange={(e) =>
                              handleGuestChange(guest.id, 'food_to_stock', e.target.value)
                            }
                            required
                          />
                          <small className="text-muted">
                            {(guest.food_to_stock || '').length}/250 characters
                          </small>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={saving}>
          {saving ? 'Saving RSVP...' : 'Save RSVP'}
        </button>
      </form>
    </div>
  );
}