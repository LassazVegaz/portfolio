import styles from "./loading.module.scss";

const Loader = () => (
  <div className={styles["main-loader"]}>
    <div className={styles.circle} />
    <div className={styles["loader-text"]}>L</div>
  </div>
);

export default Loader;
