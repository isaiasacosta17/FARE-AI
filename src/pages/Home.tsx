/**
 * Home page: Landing dashboard with navigation to the 3 simulation cases
 * Design: Neural Canvas - gradient bg, glass cards, spring animations
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Users,
  TrendingUp,
  Target,
  Brain,
  ArrowRight,
  Sparkles,
  BarChart3,
  Shield,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

const cases = [
  {
    id: "churn",
    path: "/churn",
    title: "Predicción de Churn",
    subtitle: "Caso 1 — Retail",
    description:
      "Identifica qué clientes están a punto de dejar de comprar. Activa campañas de retención a tiempo y reduce la pérdida de clientes.",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
    borderColor: "border-rose-100",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663448965180/diJACkPyKq5zDs5dUSARpR/hero-churn-YjREJimCttc6WyQ3qJoCKX.webp",
    tags: ["Clasificación", "Retención"],
    impact: "Reducir abandono 10-25%",
  },
  {
    id: "ventas",
    path: "/ventas",
    title: "Forecast de Ventas",
    subtitle: "Caso 2 — E-commerce",
    description:
      "Predice cuánto vas a vender el próximo mes para planificar inventario, marketing y producción de forma inteligente.",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663448965180/diJACkPyKq5zDs5dUSARpR/hero-sales-dDjE8fo88v2rJbMnMmcadk.webp",
    tags: ["Regresión", "Forecast"],
    impact: "Reducir quiebres 20-30%",
  },
  {
    id: "leads",
    path: "/leads",
    title: "Priorización de Leads",
    subtitle: "Caso 3 — B2B",
    description:
      "Determina qué leads tienen mayor probabilidad de compra para que tu equipo comercial se enfoque en los que realmente convierten.",
    icon: Target,
    color: "from-emerald-500 to-teal-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-100",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663448965180/diJACkPyKq5zDs5dUSARpR/hero-leads-iqJXVQuzWMTu3HJDmo6cip.webp",
    tags: ["Scoring", "Conversión"],
    impact: "Mejorar conversión 20-40%",
  },
];

export default function Home() {
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
                FARE AI Analytics
              </p>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                Sistema Predictivo
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed mt-3">
            Simulaciones interactivas que demuestran cómo la inteligencia artificial
            transforma datos empresariales en decisiones comerciales accionables.
            Selecciona un caso para explorar el modelo predictivo.
          </p>

          {/* Stats bar */}
          <div className="flex gap-6 mt-6">
            {[
              { icon: Sparkles, label: "Precisión", value: "85%+" },
              { icon: BarChart3, label: "Variables", value: "8-10" },
              { icon: Shield, label: "Confianza", value: "70%+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-sm font-semibold text-slate-700 font-mono-nums">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cases.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
              >
                <Link href={c.path}>
                  <div className="group glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-white/40 hover:border-white/60">
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex gap-1.5">
                        {c.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            {c.subtitle}
                          </p>
                          <h3 className="font-heading font-semibold text-slate-800 text-sm">
                            {c.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {c.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${c.lightColor} ${c.textColor}`}
                        >
                          {c.impact}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-indigo-500 font-medium group-hover:gap-2 transition-all">
                          Explorar
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-center"
        >
          <p className="text-xs text-slate-400">
            Estas simulaciones utilizan modelos simplificados con fines demostrativos.
            Los modelos reales se entrenan con los datos específicos de cada empresa.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
