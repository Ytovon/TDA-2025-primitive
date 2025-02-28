import React, { useEffect, useState } from "react";
import styles from "./PlayerListPage.module.css";
import Header from "../../Components/Header/Header";
import { UserApiClient } from "../../API/UserApi"; // API pro uživatele
import { UserModel } from "../../Model/UserModel";
import { lightbulbWhite } from "../../assets/assets";
import ToggleButton from "../../Components/Button/ToggleButton/ToggleButton"; // Import ToggleButton

export const PlayerListPage = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [editedElo, setEditedElo] = useState<{ [key: string]: number }>({});

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

  // Funkce pro změnu banu uživatele
  const handleBanUser = async (uuid: string, currentStatus: boolean) => {
    const newStatus = !currentStatus; // Přepne stav
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.uuid === uuid ? { ...user, isBanned: newStatus } : user
      )
    );

    try {
      await UserApiClient.updateUserBanStatus(uuid, newStatus);
    } catch {
      console.error("Chyba při odesílání změny banu");
    }
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
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={
                        user.uuid
                          ? editedElo[user.uuid] ?? Math.round(user.elo)
                          : Math.round(user.elo)
                      }
                      className={styles.eloInput}
                    />
                  </td>
                  <td>
                    <ToggleButton
                      isOn={!!user.isBanned}
                      onToggle={() =>
                        user.uuid && handleBanUser(user.uuid, !!user.isBanned)
                      }
                    />
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
