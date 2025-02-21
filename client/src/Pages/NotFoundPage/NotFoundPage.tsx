import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";
import { NotFoundPageImg } from "../../assets/assets";
import Header from "../../Components/Header/Header";

export default function NotFoundPage() {
  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.error_container}>
        <div className={styles.error_images}>
          <h1 className={styles.error_img}>4</h1>
          <img className={styles.error_img} src={NotFoundPageImg} alt="0" />
          <h1 className={styles.error_img}>4</h1>
        </div>

        <p className={styles.error_text}>Oops. Tuhle stránku jsme nenašli.</p>
      </div>
    </div>
  );
}
