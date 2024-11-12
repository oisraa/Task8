import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { AppDispatch } from "../store";
import Button from "../components/Button";
import "./SignIn.css";


interface SignInProps {
  logoSrc: string;
}

const SignIn: React.FC<SignInProps> = ({ logoSrc }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loading = useSelector((state: any) => state.auth.loading);
  const authError = useSelector((state: any) => state.auth.error);

  
  // Access the token from Redux state
  const token = useSelector((state: any) => state.auth.token);
  console.log("Token from Redux:", token);  // Log the token


  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    // Dispatch loginUser thunk
    dispatch(loginUser({ email, password }));

    // Clear error after submission (optional)
    setError("");
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <div className="sign-in-card">
          <img src={logoSrc} alt="Logo" className="logo" />
          <h2>SIGN IN</h2>
          <p>Enter your details to log in to your account</p>
          <form onSubmit={handleSignIn}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error-message">{error}</p>}
            {loading ? <p>Loading...</p> : <Button label="SIGN IN" type="submit" />}
          </form>
        </div>
      </div>

      {/* Add SomeComponent here to display the token */}
     
    </div>
  );
};

export default SignIn;
