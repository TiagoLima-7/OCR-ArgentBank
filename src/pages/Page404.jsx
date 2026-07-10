import { Link } from "react-router-dom";

function Page_404() {
  return (
    <main className="main bg-light">
      <div className="header">
        <h1>404</h1>
        <p>Oops! The page you are looking for does not exist.</p>
        <Link to="/" className="edit-button">
          Back to home
        </Link>
      </div>
    </main>
  );
}

export default Page_404;
