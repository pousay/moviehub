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
import AuthService from "../api/auth";

/* ─── types ─── */
type Status = "idle" | "loading" | "success" | "error";

interface State {
  username: string;
  password: string;
  confirmPassword: string;
  showPw: boolean;
  showConfirmPw: boolean;
  usernameErr: boolean;
  passwordErr: boolean;
  confirmPasswordErr: boolean;
  errorMsg: string;
  status: Status;
  shake: boolean;
}

type Action =
  | {
      type: "SET_FIELD";
      field: "username" | "password" | "confirmPassword";
      value: string;
    }
  | { type: "TOGGLE_PW" }
  | { type: "TOGGLE_CONFIRM_PW" }
  | {
      type: "VALIDATE_FAIL";
      fields: Partial<
        Pick<State, "usernameErr" | "passwordErr" | "confirmPasswordErr">
      >;
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
  confirmPassword: "",
  showPw: false,
  showConfirmPw: false,
  usernameErr: false,
  passwordErr: false,
  confirmPasswordErr: false,
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
    case "TOGGLE_CONFIRM_PW":
      return { ...state, showConfirmPw: !state.showConfirmPw };
    case "VALIDATE_FAIL":
      return {
        ...state,
        ...action.fields,
        errorMsg: action.errorMsg,
        shake: true,
      };
    case "LOADING":
      return {
        ...state,
        status: "loading",
        usernameErr: false,
        passwordErr: false,
        confirmPasswordErr: false,
        errorMsg: "",
      };
    case "SUCCESS":
      return { ...state, status: "success", shake: false };
    case "ERROR":
      return {
        ...state,
        status: "error",
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
        confirmPasswordErr: false,
        errorMsg: "",
        status: "idle",
      };
    default:
      return state;
  }
}

/* ─── field props ─── */
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

/* ─── floating field — your exact implementation ─── */
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

      {rightSlot && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

/* ─── password strength ─── */
function getStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Too short", color: "#e84040" },
    { label: "Weak", color: "#e84040" },
    { label: "Fair", color: "#f59e0b" },
    { label: "Good", color: "#6ee7b7" },
    { label: "Strong", color: "#10b981" },
  ];
  return { score, ...map[score] };
}

function StrengthBar({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);
  if (!password) return null;
  return (
    <div className="px-1">
      <div className="flex gap-1.5 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{
              background: i <= score ? color : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>
      <p className="text-[11px] transition-colors" style={{ color }}>
        {label}
      </p>
    </div>
  );
}

/* ─── eye toggle button ─── */
function EyeToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-white/35 hover:text-white/70 transition-colors cursor-pointer bg-transparent border-none p-1"
    >
      {show ? <IconEyeOff /> : <IconEyeOpen />}
    </button>
  );
}

/* ─── component ─── */
export default function Signup() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    username,
    password,
    confirmPassword,
    showPw,
    showConfirmPw,
    usernameErr,
    passwordErr,
    confirmPasswordErr,
    errorMsg,
    status,
    shake,
  } = state;

  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const triggerShake = () => {
    setTimeout(() => dispatch({ type: "SHAKE_DONE" }), 420);
  };

  /* validation */
  const validate = (): boolean => {
    dispatch({ type: "RESET_ERRORS" });

    if (!username && !password && !confirmPassword) {
      dispatch({
        type: "VALIDATE_FAIL",
        fields: {
          usernameErr: true,
          passwordErr: true,
          confirmPasswordErr: true,
        },
        errorMsg: "Please fill in all fields.",
      });
      triggerShake();
      return false;
    }
    if (!username) {
      dispatch({
        type: "VALIDATE_FAIL",
        fields: { usernameErr: true },
        errorMsg: "Please enter a username.",
      });
      triggerShake();
      return false;
    }
    if (username.length < 3) {
      dispatch({
        type: "VALIDATE_FAIL",
        fields: { usernameErr: true },
        errorMsg: "Username must be at least 3 characters.",
      });
      triggerShake();
      return false;
    }
    if (!password) {
      dispatch({
        type: "VALIDATE_FAIL",
        fields: { passwordErr: true },
        errorMsg: "Please enter a password.",
      });
      triggerShake();
      return false;
    }
    if (password.length < 8) {
      dispatch({
        type: "VALIDATE_FAIL",
        fields: { passwordErr: true },
        errorMsg: "Password must be at least 8 characters.",
      });
      triggerShake();
      return false;
    }
    if (!confirmPassword) {
      dispatch({
        type: "VALIDATE_FAIL",
        fields: { confirmPasswordErr: true },
        errorMsg: "Please confirm your password.",
      });
      triggerShake();
      return false;
    }
    if (password !== confirmPassword) {
      dispatch({
        type: "VALIDATE_FAIL",
        fields: { passwordErr: true, confirmPasswordErr: true },
        errorMsg: "Passwords do not match.",
      });
      triggerShake();
      return false;
    }
    return true;
  };

  /* submit */
  const handleSignup = async () => {
    if (status === "loading" || status === "success") return;
    if (!validate()) return;

    dispatch({ type: "LOADING" });

    try {
      const data = await AuthService.signup({ username, password });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      dispatch({ type: "SUCCESS" });
      setTimeout(() => navigate("/"), 800);
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Something went wrong. Please try again.";
      dispatch({ type: "ERROR", errorMsg: msg });
      triggerShake();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") handleSignup();
  };

  const btnBg =
    status === "success" ? "bg-emerald-500" : "bg-[#e84040] hover:bg-[#ff6b6b]";

  return (
    <>
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div
          style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,64,64,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        className="relative z-10 flex min-h-screen items-center justify-center p-4 py-10"
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
              S
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#f0f0f5]">
              Create an account
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Start watching in seconds
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
                className="flex items-center gap-2.5 rounded-2xl px-4 py-3 mb-5 text-sm text-[#ff6b6b]"
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
              <div className="fade-up-3 flex flex-col gap-2">
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
                    <EyeToggle
                      show={showPw}
                      onToggle={() => dispatch({ type: "TOGGLE_PW" })}
                    />
                  }
                />
                <StrengthBar password={password} />
              </div>

              {/* confirm password */}
              <div className="fade-up-4">
                <FloatingField
                  id="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(v) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "confirmPassword",
                      value: v,
                    })
                  }
                  hasError={confirmPasswordErr}
                  icon={<IconLock />}
                  rightSlot={
                    <EyeToggle
                      show={showConfirmPw}
                      onToggle={() => dispatch({ type: "TOGGLE_CONFIRM_PW" })}
                    />
                  }
                />
              </div>

              {/* submit */}
              <button
                onClick={handleSignup}
                disabled={status === "loading" || status === "success"}
                className={[
                  "btn-shine fade-up-4 w-full h-[52px] rounded-2xl text-white font-bold text-sm mt-1",
                  "flex items-center justify-center gap-2 border-none cursor-pointer transition-colors",
                  btnBg,
                  status === "loading" || status === "success"
                    ? "opacity-90 cursor-not-allowed"
                    : "",
                ].join(" ")}
              >
                {status === "idle" && (
                  <>
                    <span>Create Account</span>
                    <IconArrow />
                  </>
                )}
                {status === "loading" && (
                  <>
                    <span>Creating account...</span>
                    <IconSpinner />
                  </>
                )}
                {status === "success" && (
                  <>
                    <span>All done!</span>
                    <IconCheck />
                  </>
                )}
                {status === "error" && (
                  <>
                    <span>Create Account</span>
                    <IconArrow />
                  </>
                )}
              </button>

              {/* login link */}
              <p className="text-center text-sm text-white/40 fade-up-5">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white/80 font-semibold hover:text-white transition-colors ml-1"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* footer */}
          <p className="text-center text-xs text-white/20 mt-6 fade-up-5">
            By creating an account you agree to our{" "}
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
