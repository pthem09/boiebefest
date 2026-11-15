import { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { supabase } from '../../supabaseClient'; // Adjust path if needed

export default function ContactUs() {
  const [state, handleSubmit, reset] = useForm('mjywyrqn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadUserEmail() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('party_users')
        .select('email')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.email) {
        setEmail(data.email);
      } else if (user.email) {
        setEmail(user.email);
      }
    }

    loadUserEmail();
  }, []);

  const handleReset = () => {
    setName('');
    setMessage('');
    reset();
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Contact Us</h2>

              {state.succeeded ? (
                <div className="alert alert-success text-center" role="alert">
                  <p className="mb-3">Thanks for reaching out! Your message has been sent.</p>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-md fw-semibold"
                    onClick={handleReset}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <ValidationError prefix="Name" field="name" errors={state.errors} className="text-danger small mt-1" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control-plaintext fw-semibold"
                      id="email"
                      name="email"
                      value={email}
                      readOnly
                      tabIndex="-1"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-danger small mt-1" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-danger small mt-1" />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={state.submitting}
                  >
                    {state.submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}