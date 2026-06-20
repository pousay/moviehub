import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
      }}
      className="mt-20 w-30 h-10 cursor-pointer rounded bg-red-500 text-white"
    >
      log out
    </button>
  );
}

export default Settings;
