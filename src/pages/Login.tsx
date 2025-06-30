import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Toaster, toast } from "sonner";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import VisualPanel from "../components/VisualPainel";
import Logo from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData);
      toast.success("Login bem-sucedido!", {
        description: "Redirecionando para a sua jornada...",
      });
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao fazer login. Verifique suas credenciais.";
      toast.error("Falha no Login", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Visual Panel - Left Side */}
      <div className="hidden lg:flex lg:w-3/5">
        <VisualPanel
          title="Cultive sua jornada"
          subtitle="Entre no jardim do foco e transforme tarefas em conquistas."
        />
      </div>

      {/* Form Panel - Right Side */}
      <div className="flex-1 lg:w-2/5 flex items-center justify-center p-8 bg-gradient-to-br from-black via-gray-900 to-black relative">
        {/* Background effects for mobile */}
        <div className="lg:hidden absolute inset-0 bg-toivo-cosmic opacity-50" />
        <div className="lg:hidden absolute inset-0 bg-toivo-glow opacity-30" />

        <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center mb-6">
              <img
                src={Logo}
                alt="Toivo Logo"
                className="w-16 h-16 object-contain animate-glow-pulse"
              />
            </div>

            <h1 className="text-3xl font-bold text-white font-heading">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-400">
              Continue sua jornada de crescimento
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={updateField("email")}
              error={errors.email}
            />

            <FormInput
              type="password"
              label="Senha"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={updateField("password")}
              error={errors.password}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-white/5 text-toivo-purple-500 focus:ring-toivo-purple-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Lembrar de mim
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-toivo-purple-400 hover:text-toivo-purple-300 transition-colors font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <FormButton type="submit" loading={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </FormButton>
          </form>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-gray-400">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-toivo-purple-400 hover:text-toivo-purple-300 transition-colors font-semibold">
                Cadastre-se
              </Link>
            </p>
          </div>

          {/* Mobile decorative elements */}
          <div className="lg:hidden flex justify-center space-x-2 pt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-toivo-purple-400 rounded-full opacity-50 animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
