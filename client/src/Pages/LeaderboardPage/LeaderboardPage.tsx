import React, { useEffect, useState } from "react";
import styles from "./LeaderboardPage.module.css";
import Header from "../../Components/Header/Header";
import { eloRed, lightbulbBlue, lightbulbRed } from "../../assets/assets";
import { UserApiClient } from "../../API/UserApi"; // Import klienta pro uživatele
import { UserModel } from "../../Model/UserModel";
import { useNavigate } from "react-router-dom";

export const LeaderboardPage = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserApiClient.getAllUsers();
        console.log("Fetched users:", data);

        if (Array.isArray(data)) {
          // Seřazení podle ELO a při shodě podle počtu výher (wins)
          const sortedUsers = data.sort((a, b) => {
            if ((b.elo || 0) !== (a.elo || 0)) {
              return (b.elo || 0) - (a.elo || 0); // Nejprve podle ELO
            }
            return (b.wins || 0) - (a.wins || 0); // Pokud mají stejné ELO, tak podle výher
          });

          setUsers(sortedUsers);
        } else {
          console.error("API did not return an array:", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  console.log("Current users state:", users); // Zobrazí obsah users po změně stavu

  const handleRowClick = (uuid: string) => {
    navigate(`/users/${uuid}`);
  };
  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.leaderboardWrapper}>
        <h1 className={styles.leaderboardTitle}>Žebříček</h1>
        <p className={styles.leaderboardText}>Probojuj se na vrchol!</p>

        {loading ? (
          <p>Načítání...</p>
        ) : (
          <table className={styles.leaderboard}>
            <thead>
              <tr>
                <th>Pozice</th>
                <th>Uživatel</th>
                <th>ELO</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user.uuid || index}
                    onClick={() => user.uuid && handleRowClick(user.uuid)}
                    className={styles.row}
                  >
                    <td>{index + 1}.</td> {/* Přidá číslování umístění */}
                    <td>
                      <img
                        className={`${styles.leaderboardPosition} ${
                          index === 0 ? styles.firstPlace : styles.otherPlace
                        }`}
                        src={index === 0 ? lightbulbBlue : lightbulbRed}
                        alt="pozice"
                      />
                      {user.username}
                    </td>
                    <td>
                      <div className={styles.eloContainer}>
                        <p>{user.elo ? Math.round(user.elo) : "N/A"}</p>
                        <img src={eloRed} alt="ELO" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>Žádní uživatelé nenalezeni</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
