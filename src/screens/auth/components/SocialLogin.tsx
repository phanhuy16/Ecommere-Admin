import { Button } from "antd";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../../firebase/firebaseConfig";

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
provider.setCustomParameters({
  login_hint: "hn790078@gmail.com",
});

const SocialLogin = () => {
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      if (result) {
        const user = result.user;

        if (user) {
          const data = {
            fullName: user.displayName,
            email: user.email,
          };
        }
      } else {
        console.log("Can not login with google");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-3">
      <Button
        onClick={handleLoginWithGoogle}
        style={{
          width: "100%",
        }}
        size="large"
        icon={
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/color/24/google-logo.png"
            alt="google-logo"
          />
        }
      >
        Sign in with Google
      </Button>
    </div>
  );
};

export default SocialLogin;
