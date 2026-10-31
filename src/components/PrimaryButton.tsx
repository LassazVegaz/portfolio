import styles from "./PrimaryButton.module.scss";
import cn from "classnames";

export default function PrimaryButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className={cn(styles["primary-btn"], className)}
      {...props}
    />
  );
}
