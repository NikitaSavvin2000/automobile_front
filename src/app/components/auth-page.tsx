import { useNavigate } from "react-router-dom";

import { Car, Eye, EyeOff } from "lucide-react";
import { login, register, sendRegCode, registerUser } from "../../api/auth";
import "../../css/auth-page.css";
import { useState, useEffect } from "react";
import { useAutoRefreshToken } from "../../utils/token-refresher";



interface AuthPageProps {
  onLogin: (email: string, password: string, name?: string) => void;
}

export function AuthPage({ onLogin, onChangePassword }: AuthPageProps) {
    const { tokens, setTokens } = useAutoRefreshToken();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean; name?: boolean; code?: boolean }>({});
  const [password, setPassword] = useState("");
  const [errorFields, setErrorFields] = useState<{ email?: boolean; password?: boolean; name?: boolean; code?: boolean }>({});
  const [codeError, setCodeError] = useState(false);
  const navigate = useNavigate();
    const triggerError = (fields: typeof errors) => {
      setErrors(fields); // передаем в хук
      setShake(true);
      setTimeout(() => setShake(false), 400);
    };


    const useShakeInput = (
      value: string,
      setValue: (v: string) => void,
      triggerError: boolean,
      resetError: () => void // функция сброса ошибки
    ) => {
      const [shake, setShake] = useState(false);
    const navigate = useNavigate();

      useEffect(() => {
        if (triggerError) {
          setShake(true);
          const timer = setTimeout(() => {
            setShake(false);
            resetError(); // сбрасываем ошибку после тряски
          }, 500);
          return () => clearTimeout(timer);
        }
      }, [triggerError, resetError]);

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      };

    const className = `w-full px-4 py-3 bg-secondary rounded-xl border-0 outline-none focus:ring-2 transition-all duration-300 ${
      triggerError || shake ? "ring-2 ring-red-400 shake" : "focus:ring-primary/20"
    }`;

      return { value, onChange, className };
    };


    const nameInputProps = useShakeInput(
      name,
      setName,
      errors.name || false,
      () => setErrors(prev => ({ ...prev, name: false }))
    );

    const emailInputProps = useShakeInput(email, setEmail, errors.email || false, () =>
      setErrors((prev) => ({ ...prev, email: false }))
    );
    const passwordInputProps = useShakeInput(password, setPassword, errors.password || false, () =>
      setErrors((prev) => ({ ...prev, password: false }))
    );
    const codeInputProps = useShakeInput(verificationCode, setVerificationCode, errors.code || false, () =>
      setErrors((prev) => ({ ...prev, code: false }))
    );


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage("");

  const newErrors = {
    email: !email.trim(),
    password: !password.trim(),
    name: !isLogin && !name.trim(),
    code: !isLogin && !verificationCode.trim(),
  };

  const hasError = Object.values(newErrors).some(Boolean);
  if (hasError) {
    setErrors(newErrors);
    setErrorFields(newErrors);
    return;
  }

  setErrorFields({});
  setErrors({});

  try {
    if (isLogin) {
      const result = await login(email, password);
      if (!result) {
        setErrorMessage("Неверный логин или пароль");
        return;
      }

      setTokens({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });


      console.log("Токены после входа:", {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });

      onLogin(email, password);

    } else {
      const result = await registerUser(email, password, Number(verificationCode), name);
      if (!result) {
        setErrorMessage("Ошибка регистрации");
        return;
      }

      if (result.access_token) localStorage.setItem("token", result.access_token);
      if (result.refresh_token) localStorage.setItem("refresh_token", result.refresh_token);

      console.log("Токены после регистрации:", {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });

      onLogin(email, password, name);
    }


  } catch (err: any) {
    setErrorMessage(err.message || "Ошибка при запросе к серверу");
  }
};


  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gradient-to-b from-primary/5 to-secondary/30 flex flex-col items-center justify-center p-4">
      {/* Логотип */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-4 shadow-lg">
          <Car className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-2xl text-foreground">Авто История</h1>
        <p className="text-sm text-muted-foreground mt-1">
          История обслуживания вашего автомобиля
        </p>
      </div>

      {/* Форма */}
      <div className="w-full bg-white dark:bg-card rounded-3xl shadow-lg p-6">
        <div className="flex mb-6">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setErrorMessage("");
            setErrors({});
            setErrorFields({});
          }}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            isLogin
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary/50"
          }`}
        >
          Вход
        </button>

          <button
            type="button"
              onClick={() => {
                setIsLogin(false);
                setErrorMessage(""); // <-- сброс ошибки
              }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              !isLogin
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Имя
              </label>

               <input {...nameInputProps} placeholder="Введите ваше имя" />

            </div>
          )}

        <label className="block text-sm text-muted-foreground mb-2">
          Email
        </label>
          <input {...emailInputProps} placeholder="Email или телефон" />


          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Пароль
            </label>
            <div className="relative">
                <input {...passwordInputProps} placeholder="Введите пароль" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
                    {/* ВСТАВЛЯЕШЬ ВОТ ЗДЕСЬ */}
                    {!isLogin && (
                      <>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!name.trim() || !email.trim() || !password.trim()) {
                              triggerError({
                                name: !name.trim(),
                                email: !email.trim(),
                                password: !password.trim(),
                              });
                              return;
                            }

                            try {
                              await sendRegCode(name, email, password);
                              alert("Код отправлен на ваш Email");
                              setErrorMessage("");
                            } catch (err: any) {
                              setErrorMessage(err.message); // выводим ошибку из бэкенда
                            }

                          }}
                          className="w-full py-3.5 bg-yellow-200 text-yellow-900 rounded-xl hover:bg-yellow-300 transition-colors shadow-sm"
                        >
                          Отправить код подтверждения
                        </button>

                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">
                            Код подтверждения
                          </label>
                          <input {...codeInputProps} placeholder="Введите код" />
                        </div>
                      </>
                    )}
          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm mt-6"
          >
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

            {/* Карточка ошибки */}
            {errorMessage && (
              <button
                type="button"
                className="w-full py-3.5 bg-red-400 text-white rounded-xl shadow-sm mt-4 cursor-default pointer-events-none"
              >
                {errorMessage}
              </button>
            )}

        {isLogin && (
        <button
          type="button"
          className="w-full mt-4 text-sm text-primary hover:underline"
          onClick={onChangePassword}
        >
          Забыли пароль?
        </button>



        )}
      </div>

      {/* Информация */}
      <p className="text-xs text-muted-foreground text-center mt-6 px-8">
        Нажимая "{isLogin ? "Войти" : "Зарегистрироваться"}", вы соглашаетесь с условиями использования
      </p>
    </div>
  );
}
