import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

pages /Loginpage.jsx  
const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("ログイン成功:", result.user);


      navigate("/class");
    } catch (err) {
      console.error("ログイン失敗:", err);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <button 
        onClick={handleLogin}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        Googleでログイン
      </button>
    </div>
  );
}