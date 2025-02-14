import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import { FacebookIcon, GoogleIcon } from "../../assets/assets";

export const LoginPage = () => {
  const [isRegistered, setIsRegistered] = useState(true);
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

      <div className={styles.formContainer}>
        <h1 className={styles.pageTitle}>
          {isRegistered ? "Přihlásit se" : "Registrace"}
        </h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            style={{ display: isRegistered ? "block" : "none" }}
            type="text"
            name="usernameOrEmail"
            placeholder="Uživatelské jméno nebo email"
            value={formData.usernameOrEmail}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            style={{ display: isRegistered ? "none" : "block" }}
            type="text"
            name="username"
            placeholder="Uživatelské jméno"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            style={{ display: isRegistered ? "none" : "block" }}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Heslo"
            value={formData.password}
            onChange={handleChange}
          />

          <button className={styles.submitBtn} type="submit">
            {isRegistered ? "Přihlásit se" : "Založit účet"}
          </button>

          <p>
            {isRegistered ? "Účet nemáte?" : "Máte účet?"}{" "}
            <button
              className={styles.link}
              onClick={() => handleIsRegistered()}
            >
              {isRegistered ? "Zaregistrujte se" : "Přihlásit se"}
            </button>
          </p>
        </form>

        <div className={styles.or}>
          <span className={styles.line}></span>
          <p>nebo</p>
          <span className={styles.line}></span>
        </div>
        <div className={styles.socialBtns}>
          <Button text="" image={GoogleIcon} border />
          <Button text="" image={FacebookIcon} border />
        </div>
      </div>
    </body>
  );
};
