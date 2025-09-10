// src/App.jsx
import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../firebase";

function App() {
  const [user, setUser] = useState(null);

  // Googleログイン
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  // ログアウト
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {user ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            ようこそ {user.displayName} さん！
          </h2>
          <img
            src={user.photoURL}
            alt="profile"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <p className="mb-4">{user.email}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          Googleでログイン
        </button>
      )}
    </div>
  );
}

export default App;
