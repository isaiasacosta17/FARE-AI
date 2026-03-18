/**
 * Neural Canvas Design: App Layout with sidebar navigation
 * - Dark sidebar with glass morphism
 * - Gradient background for main content
 * - Smooth transitions between sections
 */
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Target,
  Brain,
  ChevronRight,
  BarChart3,
  Home,
} from "lucide-react";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    path: "/",
    label: "Inicio",
    icon: Home,
    description: "Panel principal",
  },
  {
    path: "/churn",
    label: "Churn",
    icon: Users,
    description: "Predicción de abandono",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
  },
  {
    path: "/ventas",
    label: "Ventas",
    icon: TrendingUp,
    description: "Forecast de ventas",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    path: "/leads",
    label: "Leads",
    icon: Target,
    description: "Probabilidad de compra",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex gradient-bg">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 72 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground z-50 flex flex-col border-r border-sidebar-border overflow-hidden"
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border min-h-[72px]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="font-heading font-bold text-base tracking-tight text-white">
                FARE AI
              </h1>
              <p className="text-[11px] text-sidebar-foreground/60 leading-none">
                Analytics
              </p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarOpen && (
            <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-3 font-medium">
              Simulaciones
            </p>
          )}
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? "bg-sidebar-accent text-white"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? item.bgColor || "bg-indigo-500/20"
                        : "bg-transparent group-hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? item.color || "text-indigo-400"
                          : "text-sidebar-foreground/60"
                      }`}
                    />
                  </div>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm font-medium truncate">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-sidebar-foreground/40 truncate">
                        {item.description}
                      </p>
                    </motion.div>
                  )}
                  {sidebarOpen && isActive && (
                    <ChevronRight className="w-4 h-4 text-sidebar-foreground/40" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Toggle */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/50 hover:text-white hover:bg-sidebar-accent/50 transition-colors text-xs"
          >
            <BarChart3 className="w-4 h-4" />
            {sidebarOpen && <span>Colapsar</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 72 }}
      >
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
