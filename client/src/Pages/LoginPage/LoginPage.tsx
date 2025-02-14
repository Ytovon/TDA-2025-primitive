import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import Header from "../../Components/Header/Header";
import { Button } from "../../Components/Button/Button";
import { FacebookIcon, GoogleIcon } from "../../assets/assets";
import { UserApiClient } from "../../API/UserApi";
import { UserModel } from "../../Model/UserModel";
import {
  getRefreshToken,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../../API/tokenstorage"; // Your token storage functions
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kontrola UI chyb
    if (!isRegistered) {
      if (
        formData.username === "" ||
        formData.password === "" ||
        formData.email === ""
      ) {
        setError("Vyplňte všechny údaje");
      } else {
        const newUser = {
          username: formData.username || "",
          email: formData.email || "",
          password: formData.password || "",
        };

        const response = await UserApiClient.registerUser(newUser);
        // kontrola backend chyb
        if (response.status === 409) {
          setError("Uživatel s tímto jménem nebo emailem již existuje");
        } else if (response.status === 500) {
          setError("Chyba serveru");
        } else if (response.status === 200) {
          setError("Registrace úspěšná");
        } else {
          setError(response.message);
        }
      }
    } else {
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

        // kontrola backend chyb
        if (response.status === 404) {
          setError("Uživatel neexistuje");
        } else if (response.status === 500) {
          setError("Heslo v db chybí");
        } else if (response.status === 200) {
          setError("Přihlášení úspěšné");
        } else if (response.status === 401) {
          setError("Špatné heslo");
        }

        if (
          response.accessToken !== undefined &&
          response.refreshToken !== undefined
        ) {
          setAccessToken(response.accessToken);
          setRefreshToken(response.refreshToken);
          navigate("/");
        }
      }
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
        <p className={styles.message} style={{ color: "red" }}>
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
        <p>
          <button
            className={styles.link}
            type="submit"
            onClick={handleIsRegistered}
          ></button>
        </p>

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
    </div>
  );
};
