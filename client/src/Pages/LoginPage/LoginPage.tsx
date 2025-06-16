import React, { useState, useEffect } from "react";
import styles from "./LoginPage.module.css";
import Header from "../../Components/Header/Header";
import { UserApiClient } from "../../API/UserApi";
import { UserModel } from "../../Model/UserModel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export const LoginPage = () => {
  const { validate } = useAuth();

  const navigate = useNavigate();
  const [isOnLoginPage, setIsOnLoginPage] = useState(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState<Partial<UserModel>>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  interface Response {
    message: string;
    success: boolean;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setError("");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error]);
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

  const handleLoginMessages = (response: any): Response => {
    if (response.status === 400) {
      return {
        message: "Vyplňte prosím všechna pole",
        success: false,
      };
    } else if (response.status === 401) {
      return {
        message: "Nesprávné heslo",
        success: false,
      };
    } else if (response.status === 404) {
      return {
        message: "Uživatel nenalezen",
        success: false,
      };
    } else if (response.status === 500) {
      return {
        message: "Uživatelské heslo jsme nebyli schopni dohledat",
        success: false,
      };
    } else if (response.status === 200) {
      return {
        message: "Přihlášení úspěšné",
        success: true,
      };
    } else {
      return {
        message: response.message || "Neznámá chyba",
        success: false,
      };
    }
  };

  const handleRegisterMessages = (response: any): Response => {
    if (response.status === 409) {
      return {
        message: "Uživatel s tímto jménem nebo emailem již existuje",
        success: false,
      };
    } else if (response.status === 400) {
      return {
        message: "Vyplnte všechna pole",
        success: false,
      };
    } else if (response.status === 201) {
      return {
        message: "Registrace proběhla úspěšně",
        success: true,
      };
    } else {
      return {
        message: response.message || "Neznámá chyba",
        success: false,
      };
    }
  };

  const register = async (): Promise<boolean> => {
    const passwordError = validatePassword(formData.password!);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    const newUser = {
      username: formData.username || "",
      email: formData.email || "",
      password: formData.password || "",
    };

    const apiResponse = await UserApiClient.registerUser(newUser);
    const response: Response = handleRegisterMessages(apiResponse);

    console.log(response.success);

    setError(response.message);
    setSuccess(response.success);
    return response.success;
  };

  const loginOnClick = async () => {
    const user = {
      username: formData.username || "",
      password: formData.password || "",
    };

    const response: any = await UserApiClient.loginUser({
      usernameOrEmail: user.username,
      password: user.password,
    });

    const loginResponse: Response = handleLoginMessages(response);

    if (
      response.accessToken !== undefined &&
      response.refreshToken !== undefined
    ) {
      checkAndNavigate();
    }
    setSuccess(loginResponse.success);
    setError(loginResponse.message);
  };

  const checkAndNavigate = () => {
    validate();
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timeout);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hehelhfef");

    if (!isOnLoginPage) {
      // if on register... call register fn
      const success = await register();

      if (success == true) {
        checkAndNavigate();
      }
      return;
    }
    await loginOnClick();
  };

  const handleIsRegistered = () => {
    setIsOnLoginPage((prev) => !prev);
    setError("");
    setIsVisible(false);
  };

  return (
    <div>
      <Header />
      {
        <div
          className={`${styles.message} ${!isVisible ? styles.hidden : ""}`}
          style={{
            backgroundColor: success ? "var(--color1)" : "var(--color5)",
          }}
        >
          <FontAwesomeIcon
            icon={success ? faCircleCheck : faCircleExclamation}
          />
          <p>{error}</p>
        </div>
      }

      <div className={styles.formWrappper}>
        <div className={styles.formContainer}>
          <h1 className={styles.pageTitle}>
            {isOnLoginPage ? "Přihlásit se" : "Registrace"}
          </h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              name="username"
              placeholder={
                isOnLoginPage
                  ? "Uživatelské jméno nebo email"
                  : "Uživatelské jméno"
              }
              value={formData.username}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              style={{ display: isOnLoginPage ? "none" : "block" }}
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
              {isOnLoginPage ? "Přihlásit se" : "Založit účet"}
            </button>

            <p>
              {isOnLoginPage ? "Účet nemáte?" : "Máte účet?"}{" "}
              <button
                type="button"
                className={styles.link}
                onClick={() => handleIsRegistered()}
              >
                {isOnLoginPage ? "Zaregistrujte se" : "Přihlásit se"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
