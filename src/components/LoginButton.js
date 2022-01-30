import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { MyButton } from "./MyButton";
import { navbarStyles as styles } from "../styles/globalStyles";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <MyButton
      title="Login"
      onPress={() => loginWithRedirect()}
      touchableStyles={styles.button}
      textStyles={styles.text}
    />
  );
};

export default LoginButton;
