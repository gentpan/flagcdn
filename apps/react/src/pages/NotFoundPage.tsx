import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Flag not found.</p>
      <Link to="/" className="btn-primary squircle">
        <i className="fa-solid fa-house" /> Back to home
      </Link>
    </div>
  );
}
