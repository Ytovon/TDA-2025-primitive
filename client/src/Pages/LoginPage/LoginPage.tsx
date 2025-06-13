import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import Header from "../../Components/Header/Header";
import { UserApiClient } from "../../API/UserApi";
import { UserModel } from "../../Model/UserModel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export const LoginPage = () => {
  const { validate } = useAuth();

  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(true);
  const [formData, setFormData] = useState<Partial<UserModel>>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Heslo musí mít alespoň 8 znaků.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Heslo musí obsahovat alespoň jedno velké písmeno.";
    }
    if (!/[a-z]/.test(password)) {
      return "Heslo musí obsahovat alespoň jedno malé písmeno.";
    }
    if (!/[0-9]/.test(password)) {
      return "Heslo musí obsahovat alespoň jednu číslici.";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Heslo musí obsahovat alespoň jeden speciální znak.";
    }
    return null; // Heslo je platné
  };

  const register = async () => {
    if (!formData.username || !formData.password || !formData.email) {
      setError("Vyplňte všechny údaje");
      return;
    }

    const passwordError = validatePassword(formData.password!);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    const response = await UserApiClient.registerUser(newUser);

    if (response.status === 409) {
      setError("Uživatel s tímto jménem nebo emailem již existuje");
    } else if (response.status === 500) {
      setError("Chyba serveru");
    } else if (response.status === 200) {
      setError("Registrace úspěšná");
    } else {
      setError(response.message);
    }
  };

  const loginOnClick = async () => {
    if (formData.username === "" || formData.password === "") {
      setError("Vyplňte všechny údaje");
    } else {
      const user = {
        username: formData.username || "",
        password: formData.password || "",
      };

      const response: any = await UserApiClient.loginUser({
        usernameOrEmail: user.username,
        password: user.password,
      });

      setError(response);

      if (
        response.accessToken !== undefined &&
        response.refreshToken !== undefined
      ) {
        validate();
        navigate("/");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRegistered) {
      await register();
      await loginOnClick();
    } else {
      await loginOnClick();
    }
  };

  const handleIsRegistered = () => {
    setIsRegistered((prev) => !prev);
  };

  return (
    <div>
      <Header />

      <div className={styles.formContainer}>
        <h1 className={styles.pageTitle}>
          {isRegistered ? "Přihlásit se" : "Registrace"}
        </h1>
        <p className={error.length == 0 ? styles.none : styles.message}>
          {error}
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="username"
            placeholder={
              isRegistered
                ? "Uživatelské jméno nebo email"
                : "Uživatelské jméno"
            }
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
      </div>
    </div>
  );
};
