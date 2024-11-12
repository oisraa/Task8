import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/authSlice";
import { AppDispatch } from "../store";
import Button from "../components/Button";
import "./SignUp.css";
import cloudIcon from "../assets/cloudicon.png";

interface SignUpProps {
  logoSrc: string;
}

const SignUp: React.FC<SignUpProps> = ({ logoSrc }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("Form Data Submitted:");
    console.log({
      firstName,
      lastName,
      userName,
      email,
      password,
      confirmPassword,
      profileImage,
    });

    if (!firstName || !lastName || !userName || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    dispatch(
      registerUser({
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword,
        profileImage,
      })
    );

    setFirstName("");
    setLastName("");
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setProfileImage(null);
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(file);
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-box">
        <div className="sign-up-card">
          <img src={logoSrc} alt="Logo" className="logo" />
          <h2>SIGN UP</h2>
          <form onSubmit={handleSignUp}>
            <label>Name</label>
            <div className="input-row">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <div className="input-row">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <label>Profile Image</label>
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                id="file-upload"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="file-upload" className="upload-area">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile Preview"
                    className="preview-image"
                  />
                ) : (
                  <img src={cloudIcon} alt="Upload" className="cloud-icon" />
                )}
              </label>
            </div>
            {error && <p className="error-message">{error}</p>}
            <Button label="SIGN UP" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
