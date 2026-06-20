import { useReducer, useRef, type KeyboardEvent } from "react";
import {
  IconAlert,
  IconCheck,
  IconSpinner,
  IconEyeOff,
  IconArrow,
  IconEyeOpen,
  IconUser,
  IconLock,
} from "../components/Icons";
import { Link, useNavigate } from "react-router-dom";
import { fetcher } from "../api/base";
import AuthService from "../api/auth";

/* ─── types ─── */
type Status = "idle" | "loading" | "success" | "error";

interface State {
  username: string;
  password: string;
  showPw: boolean;
  usernameErr: boolean;
  passwordErr: boolean;
  errorMsg: string;
  status: Status;
  shake: boolean;
}

type Action =
  | { type: "SET_FIELD"; field: "username" | "password"; value: string }
  | { type: "TOGGLE_PW" }
  | {
      type: "VALIDATE_FAIL";
      usernameErr: boolean;
      passwordErr: boolean;
      errorMsg: string;
    }
  | { type: "LOADING" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; errorMsg: string }
  | { type: "SHAKE_DONE" }
  | { type: "RESET_ERRORS" };

/* ─── reducer ─── */
const initialState: State = {
  username: "",
  password: "",
  showPw: false,
  usernameErr: false,
  passwordErr: false,
  errorMsg: "",
  status: "idle",
  shake: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_PW":
      return { ...state, showPw: !state.showPw };
    case "VALIDATE_FAIL":
      return {
        ...state,
        usernameErr: action.usernameErr,
        passwordErr: action.passwordErr,
        errorMsg: action.errorMsg,
        shake: true,
      };
    case "LOADING":
      return {
        ...state,
        status: "loading",
        usernameErr: false,
        passwordErr: false,
        errorMsg: "",
      };
    case "SUCCESS":
      return { ...state, status: "success", shake: false };
    case "ERROR":
      return {
        ...state,
        status: "error",
        usernameErr: true,
        passwordErr: true,
        errorMsg: action.errorMsg,
        shake: true,
      };
    case "SHAKE_DONE":
      return { ...state, shake: false };
    case "RESET_ERRORS":
      return {
        ...state,
        usernameErr: false,
        passwordErr: false,
        errorMsg: "",
        status: "idle",
      };
    default:
      return state;
  }
}

/* ─── floating field ─── */
interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
}
function FloatingField({
  id,
  label,
  type,
  value,
  onChange,
  hasError,
  icon,
  rightSlot,
}: FieldProps) {
  const lifted = value.length > 0;
  return (
    <div className="relative">
      {/* left icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10">
        {icon}
      </div>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=""
        style={{
          paddingTop: 5,
          paddingBottom: 6,
          borderColor: hasError ? "rgba(232,64,64,0.7)" : undefined,
          boxShadow: hasError ? "0 0 0 3px rgba(232,64,64,0.08)" : undefined,
        }}
        className={[
          "w-full h-[58px] rounded-2xl text-[#f0f0f5] text-sm pl-11 pr-12 transition-all",
          "bg-white/[0.06] border border-white/10",
          "focus:outline-none focus:border-[rgba(232,64,64,0.55)] focus:bg-white/[0.08]",
          "focus:shadow-[0_0_0_3px_rgba(232,64,64,0.1)]",
        ].join(" ")}
      />

      {/* floating label */}
      <label
        htmlFor={id}
        className={`absolute ${lifted && "bg-[rgba(232,64,64,0.8)] rounded-2xl px-3 py-1"} text-white left-11 pointer-events-none transition-all duration-200 origin-left`}
        style={{
          top: lifted ? -10 : "50%",
          transform: lifted ? "translateY(0) scale(0.75)" : "translateY(-50%)",
          fontSize: 16,
          color: lifted ? "white" : "rgba(240,240,245,0.35)",
        }}
      >
        {label}
      </label>

      {/* right slot (eye toggle) */}
      {rightSlot && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

/* ─── login response type ─── */
interface LoginResponse {
  id: number;
  username: string;
  access_token: string;
  refresh_token: string;
  exp_at: string | null;
}

/* ─── component ─── */
export default function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    username,
    password,
    showPw,
    usernameErr,
    passwordErr,
    errorMsg,
    status,
    shake,
  } = state;
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /* shake cleanup */
  const triggerShake = () => {
    setTimeout(() => dispatch({ type: "SHAKE_DONE" }), 420);
  };

  /* validation */
  const validate = (): string | null => {
    if (!username && !password)
      return "Please enter your username and password.";
    if (!username) return "Please enter your username.";
    if (!password) return "Please enter your password.";
    return null;
  };

  /* submit */
  const handleLogin = async () => {
    if (status === "loading" || status === "success") return;

    dispatch({ type: "RESET_ERRORS" });

    const err = validate();
    if (err) {
      dispatch({
        type: "VALIDATE_FAIL",
        usernameErr: !username,
        passwordErr: !password,
        errorMsg: err,
      });
      triggerShake();
      return;
    }

    dispatch({ type: "LOADING" });

    try {
      const data = await AuthService.login(username, password);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      dispatch({ type: "SUCCESS" });
      setTimeout(() => navigate("/"), 800);
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Invalid username or password.";
      dispatch({ type: "ERROR", errorMsg: msg });
      triggerShake();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") handleLogin();
  };

  const btnBg =
    status === "success" ? "bg-emerald-500" : "bg-[#e84040] hover:bg-[#ff6b6b]";

  return (
    <>
      <div
        className="relative z-10 w-full flex min-h-screen items-center justify-center p-4"
        onKeyDown={onKeyDown}
      >
        <div className="w-full max-w-[420px]">
          {/* logo */}
          <div className="flex flex-col items-center mb-8 fade-up-1">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-white mb-4"
              style={{
                background: "#e84040",
                boxShadow: "0 8px 24px rgba(232,64,64,0.35)",
              }}
            >
              :)
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#f0f0f5]">
              Welcome back
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Sign in to continue watching
            </p>
          </div>

          {/* card */}
          <div
            ref={cardRef}
            className={`glass-card rounded-3xl p-7 sm:p-8 ${shake ? "card-shake" : ""}`}
          >
            {/* error banner */}
            {errorMsg && (
              <div
                className="flex items-center gap-2.5 rounded-2xl px-4 py-3 mb-5 text-sm text-[#ff6b6b] fade-up-1"
                style={{
                  background: "rgba(232,64,64,0.1)",
                  border: "1px solid rgba(232,64,64,0.25)",
                }}
              >
                <IconAlert />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* username */}
              <div className="fade-up-2">
                <FloatingField
                  id="username"
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(v) =>
                    dispatch({ type: "SET_FIELD", field: "username", value: v })
                  }
                  hasError={usernameErr}
                  icon={<IconUser />}
                />
              </div>

              {/* password */}
              <div className="fade-up-3">
                <FloatingField
                  id="password"
                  label="Password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(v) =>
                    dispatch({ type: "SET_FIELD", field: "password", value: v })
                  }
                  hasError={passwordErr}
                  icon={<IconLock />}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "TOGGLE_PW" })}
                      className="text-white/35 hover:text-white/70 transition-colors cursor-pointer bg-transparent border-none p-1"
                    >
                      {showPw ? <IconEyeOff /> : <IconEyeOpen />}
                    </button>
                  }
                />
              </div>

              {/* forgot */}
              <div className="flex justify-end -mt-1 fade-up-3">
                <button className="text-xs text-white/35 hover:text-[#ff6b6b] transition-colors cursor-pointer bg-transparent border-none">
                  Forgot password?
                </button>
              </div>

              {/* submit */}
              <button
                onClick={handleLogin}
                disabled={status === "loading" || status === "success"}
                className={[
                  "btn-shine fade-up-4 w-full h-[52px] rounded-2xl text-white font-bold text-sm",
                  "flex items-center justify-center gap-2 border-none cursor-pointer transition-colors",
                  btnBg,
                  status === "loading" || status === "success"
                    ? "opacity-90 cursor-not-allowed"
                    : "",
                ].join(" ")}
              >
                {status === "idle" && (
                  <>
                    <span>Sign In</span>
                    <IconArrow />
                  </>
                )}
                {status === "loading" && (
                  <>
                    <span>Signing in...</span>
                    <IconSpinner />
                  </>
                )}
                {status === "success" && (
                  <>
                    <span>Welcome back!</span>
                    <IconCheck />
                  </>
                )}
                {status === "error" && (
                  <>
                    <span>Sign In</span>
                    <IconArrow />
                  </>
                )}
              </button>

              {/* register */}
              <p className="text-center text-sm text-white/40 fade-up-5">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-white/80 font-semibold hover:text-white transition-colors ml-1"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* footer */}
          <p className="text-center text-xs text-white/20 mt-6 fade-up-5">
            By signing in you agree to our{" "}
            <span className="underline cursor-pointer hover:text-white/40 transition-colors">
              Terms
            </span>{" "}
            and{" "}
            <span className="underline cursor-pointer hover:text-white/40 transition-colors">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
