import React, { useEffect, useState } from "react";
import styles from "./LoginPage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import { FacebookIcon, GoogleIcon } from "../../assets/assets";

export const LoginPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Odeslání formuláře
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Odesláno:", formData);
  };

  const handleIsRegistered = () => {
    setIsRegistered((prev) => !prev);
  };

  return (
    <body>
      <Header />

      <div className={styles.loginPage}>
        <h1>{isRegistered ? "Přihlásit se" : "Registrace"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            style={{ display: isRegistered ? "block" : "none" }}
            type="text"
            name="usernameOrEmail"
            placeholder="Uživatelské jméno nebo email"
            value={formData.usernameOrEmail}
            onChange={handleChange}
          />
          <input
            style={{ display: isRegistered ? "none" : "block" }}
            type="text"
            name="username"
            placeholder="Uživatelské jméno"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            style={{ display: isRegistered ? "none" : "block" }}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Heslo"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">
            {isRegistered ? "Přihlásit se" : "Založit účet"}
          </button>
        </form>
        <p>
          {isRegistered ? "Účet nemáte?" : "Máte účet?"}{" "}
          <button onClick={() => handleIsRegistered()}>
            {isRegistered ? "Zaregistrujte se" : "Přihlásit se"}
          </button>
        </p>

        <div>
          <span></span>
          <p>nebo</p>
          <span></span>
        </div>
        <Button text="" image={GoogleIcon} border />
        <Button text="" image={FacebookIcon} border />
      </div>
    </body>
  );
};
