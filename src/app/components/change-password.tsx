import { useState, useEffect } from "react";
import { Eye, EyeOff, Car } from "lucide-react";
import API from "../../api/config";


const useShakeInput = (
  value: string,
  setValue: (v: string) => void,
  triggerError: boolean,
  resetError: () => void
) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (triggerError) {
      setShake(true);
      const t = setTimeout(() => {
        setShake(false);
        resetError();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [triggerError]);

  return {
    value,
    onChange: (e: any) => setValue(e.target.value),
    className: `w-full px-4 py-3 bg-secondary rounded-xl border-0 outline-none focus:ring-2 transition-all duration-300 ${
      triggerError || shake ? "ring-2 ring-red-400 shake" : "focus:ring-primary/20"
    }`
  };
};

export default function ChangePasswordPage({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean; code?: boolean }>({});

  const emailInputProps = useShakeInput(email, setEmail, !!errors.email, () =>
    setErrors(p => ({ ...p, email: false }))
  );
  const passwordInputProps = useShakeInput(password, setPassword, !!errors.password, () =>
    setErrors(p => ({ ...p, password: false }))
  );
  const codeInputProps = useShakeInput(code, setCode, !!errors.code, () =>
    setErrors(p => ({ ...p, code: false }))
  );

  const sendCode = async () => {
    if (!email.trim() || !password.trim()) {
      setErrors({
        email: !email.trim(),
        password: !password.trim()
      });
      return;
    }

    setErrorMessage("");

    const res = await fetch(API.auth.send_change_password_code, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      setErrorMessage(data.message || data.detail);
      return;
    }
  };

  const handleChangePassword = async () => {
    if (!email.trim() || !password.trim() || !code.trim()) {
      setErrors({
        email: !email.trim(),
        password: !password.trim(),
        code: !code.trim()
      });
      return;
    }

    setErrorMessage("");

    const res = await fetch(API.auth.change_password, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, code })
    });

    const data = await res.json();
    if (!res.ok) {
      setErrorMessage(data.message || data.detail);
      return;
    }

    alert("Пароль изменён");
    onBack();
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gradient-to-b from-primary/5 to-secondary/30 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-4 shadow-lg">
          <Car className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-2xl text-foreground">Смена пароля</h1>
      </div>

      <div className="w-full bg-white dark:bg-card rounded-3xl shadow-lg p-6 space-y-4">
        <label className="block text-sm text-muted-foreground mb-2">Email</label>
        <input {...emailInputProps} placeholder="Email" />

        <label className="block text-sm text-muted-foreground mb-2">Новый пароль</label>
        <div className="relative">
          <input
            {...passwordInputProps}
            type={showPassword ? "text" : "password"}
            placeholder="Новый пароль"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="button"
          onClick={async () => {
            if (!email.trim()) {
              setErrors({ email: true });
              return;
            }

            setErrorMessage("");

            try {
              await sendChangePasswordCode(email);
            } catch (err: any) {
              setErrorMessage(err.message);
            }
          }}
          className="w-full py-3.5 bg-yellow-200 text-yellow-900 rounded-xl hover:bg-yellow-300 transition-colors shadow-sm"
        >
          Отправить код
        </button>

        <label className="block text-sm text-muted-foreground mb-2">Код подтверждения</label>
        <input {...codeInputProps} placeholder="Введите код" />

        <button
          type="button"
          onClick={async () => {
            if (!email.trim() || !password.trim() || !code.trim()) {
              setErrors({
                email: !email.trim(),
                password: !password.trim(),
                code: !code.trim()
              });
              return;
            }

            setErrorMessage("");

            try {
              await changePassword(email, password, Number(code));
              alert("Пароль изменён");
              onBack();
            } catch (err: any) {
              setErrorMessage(err.message);
            }
          }}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
        >
          Изменить пароль
        </button>

        {errorMessage && (
          <button
            type="button"
            className="w-full py-3.5 bg-red-400 text-white rounded-xl shadow-sm pointer-events-none"
          >
            {errorMessage}
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="w-full text-sm text-primary hover:underline"
        >
          Назад
        </button>
      </div>
    </div>
  );
}
