import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { MyButton } from "./MyButton";
import { navbarStyles as styles } from "../styles/globalStyles";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <MyButton
      title="Logout"
      onPress={() => logout({ returnTo: window.location.origin })}
      touchableStyles={styles.button}
      textStyles={styles.text}
    />
  );
};

export default LogoutButton;
