import React, { useEffect, useState } from "react";
import styles from "./PlayerListPage.module.css";
import Header from "../../Components/Header/Header";
import { UserApiClient } from "../../API/UserApi"; // API pro uživatele
import { UserModel } from "../../Model/UserModel";
import { lightbulbWhite } from "../../assets/assets";

export const PlayerListPage = () => {
  const [users, setUsers] = useState<UserModel[]>([]);

  // Načtení uživatelů při načtení stránky
  useEffect(() => {
    UserApiClient.getAllUsers()
      .then((response) => {
        if (Array.isArray(response)) {
          setUsers(response);
        } else {
          console.error("Unexpected response type:", response);
        }
      })
      .catch((error) => console.error("Chyba při načítání uživatelů:", error));
  }, []);

  // Funkce pro zabanování uživatele
  const handleBanUser = (uuid: string) => {
    // Najdeme uživatele a změníme jeho stav (lokálně)
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.uuid === uuid ? { ...user, isBanned: !user.isBanned } : user
      )
    );

    // Pokud chceš banování odeslat na server, můžeš přidat volání API:
    // UserApiClient.banUser(uuid);
  };

  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.playerListWrapper}>
        <h1 className={styles.listTitle}>Seznam hráčů</h1>

        <table className={styles.playerList}>
          <thead>
            <tr>
              <th>Uživatel</th>
              <th>Elo</th>
              <th>Ban</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.uuid}>
                  <td className={styles.user}>
                    <img
                      style={{ backgroundColor: "var(--color4)" }}
                      className={styles.userImg}
                      src={lightbulbWhite}
                      alt=""
                    />
                    {user.username}
                  </td>
                  <td>{user.elo}</td>
                  <td>
                    <button
                      className={
                        user.isBanned ? styles.banned : styles.unbanned
                      }
                      onClick={() => user.uuid && handleBanUser(user.uuid)}
                    >
                      {user.isBanned ? "Odbanovat" : "Zabanovat"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>Žádní uživatelé nenalezeni</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
