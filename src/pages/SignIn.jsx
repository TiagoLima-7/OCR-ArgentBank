import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { loginThunk } from "../redux/slices/authSlice";

function SignIn() {
  const savedEmail = localStorage.getItem("rememberedEmail");
  const [email, setEmail] = useState(savedEmail || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(!!savedEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  // Si déjà connecté -> redirige vers /profile
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      // Connexion réussie
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email); // sauvegarde l'email
      } else {
        localStorage.removeItem("rememberedEmail"); // supprime si décoché
      }
      navigate("/profile");
    }
    // Connexion échouée -> on ne touche pas au localStorage
  };

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-remember">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          {error && (
            <p data-testid="error-message" style={{ color: "red" }}>
              {error}
            </p>
          )}
          <button
            className="sign-in-button"
            disabled={isLoading}
            data-testid="sign-in-button"
            role="button"
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default SignIn;
