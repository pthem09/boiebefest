import { Link } from 'react-router-dom';
const importAll = (r) => r.keys().map(r);
const carouselImages = importAll(
  require.context('../../Assets/Carousel', false, /\.(png|jpe?g|webp|gif)$/i)
);

export default function Home() {
  return (
    <div className="container my-5" style={{ maxWidth: '900px' }}>
      {/* Hero Banner */}
      <div className="card border-primary mb-4 text-center shadow">
        <div className="card-body py-5 px-4">
          <span className="badge bg-primary text-uppercase mb-2 px-3 py-2">
            Boiebefest 2027 • County Meath, Ireland
          </span>
          <h1 className="display-4 fw-bold mb-3">Come Celebrate With Us!</h1>
          <p className="lead text-muted mb-4">
            Paul & Siman cordially invite you to celebrate our love and marriage.
          </p>

          {/* Dynamic Photo Carousel */}
          {carouselImages.length > 0 && (
            <div
              id="venueCarousel"
              className="carousel slide mb-4 rounded overflow-hidden shadow-sm mx-auto"
              data-bs-ride="carousel"
              style={{ maxWidth: '720px' }}
            >
              <div className="carousel-indicators">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#venueCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : undefined}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="carousel-inner">
                {carouselImages.map((imgSrc, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                  >
                    <img
                      src={imgSrc}
                      className="d-block w-100"
                      alt={`Wedding carousel ${index + 1}`}
                      style={{ height: '420px', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>

              {carouselImages.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#venueCarousel"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#venueCarousel"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          )}

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/rsvp" className="btn btn-primary btn-lg px-4">
              Complete Your RSVP
            </Link>
            <a
              href="https://www.loughcrew.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-lg px-4"
            >
              Explore Loughcrew Estate
            </a>
          </div>
        </div>
      </div>

      {/* Dates & Location Grid */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100 border-secondary">
            <div className="card-body p-4">
              <h4 className="card-title text-primary mb-3">When</h4>
              <p className="mb-2">
                <strong>Weekend Dates:</strong>
                <br />
                Friday, 1 October – Monday, 4 October 2027
              </p>
              <div className="alert alert-info py-2 px-3 mt-3 mb-0">
                <strong>Rehearsal Dinner:</strong>
                <br />
                Saturday, 2 October 2027
                <br />
                <strong>Wedding Ceremony &amp; Dinner:</strong>
                <br />
                Sunday, 3 October 2027
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 border-secondary">
            <div className="card-body p-4">
              <h4 className="card-title text-primary mb-3">Where</h4>
              <p className="mb-2">
                <strong>Loughcrew Estate</strong>
                <br />
                Oldcastle, Co. Meath
                <br />
                A82 X4Y1, Ireland
              </p>
              <p className="small text-muted fst-italic mb-3">
                Approximately 1 hour northwest of Dublin Airport.
              </p>
              <a
                href="https://www.loughcrew.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-info"
              >
                Visit Venue Website ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Key Travel & Stay Information */}
      <div className="card border-secondary mb-4">
        <div className="card-header bg-dark">
          <h4 className="mb-0">Key Guest Information</h4>
        </div>
        <div className="card-body p-4">
          {/* Accommodation Callout */}
          <div className="alert alert-success mb-4">
            <h5 className="alert-heading fw-bold">Accommodation Is Taken Care Of For The Entire Wedding Weekend!</h5>
            <p className="mb-0">
              Please <strong>do NOT book a hotel</strong> near the venue—you will be staying on-site at the estate with us.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <h5 className="text-info">Flights &amp; Transportation</h5>
              <p className="mb-0">
                We recommend flying into <strong>Dublin Airport (DUB)</strong>. Please book your own flights as well as your transportation to and from Loughcrew Estate (roughly a 1-hour drive).
              </p>
            </div>

            <div className="col-md-6">
              <h5 className="text-info">Food &amp; Dietary Preferences</h5>
              <p className="mb-0">
                Please share your wedding dinner selection, dietary restrictions, and favorite snacks or drinks to stock on your{' '}
                <Link to="/rsvp" className="text-decoration-underline">
                  RSVP form
                </Link>
                .
              </p>
            </div>
          </div>

          <hr className="my-4" />

          {/* Passport & Visa Notice */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="text-warning mb-1">Passport &amp; Visa Check</h5>
              <p className="mb-0">
                Ensure your passport and any required travel authorization expire <strong>after May 2028</strong>.
              </p>
            </div>
            <a
              href="https://www.ireland.ie/en/dfa/visas-for-ireland/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-warning text-nowrap"
            >
              Irish Visa Requirements ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}