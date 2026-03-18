/**
 * CASO 1 - CHURN: Predicción de abandono de clientes
 * Empresa de retail con clientes recurrentes
 * 
 * Design: Neural Canvas - glassmorphism cards, indigo accents, spring animations
 * Input: Customer behavior data (frequency, recency, monetary, complaints, etc.)
 * Output: Churn probability %, risk level, recommended actions
 */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Clock,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  Zap,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Gift,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import AppLayout from "@/components/AppLayout";
import SimulationHeader from "@/components/SimulationHeader";
import PredictionLoader from "@/components/PredictionLoader";
import ResultCard from "@/components/ResultCard";

interface FormData {
  clientName: string;
  monthsSinceLastPurchase: number;
  purchaseFrequency: string;
  avgTicket: number;
  complaints: number;
  satisfactionScore: number;
  hasLoyaltyProgram: string;
  channelPreference: string;
}

interface PredictionResult {
  churnProbability: number;
  riskLevel: "alto" | "medio" | "bajo";
  retentionScore: number;
  lifetimeValue: number;
  recommendations: { icon: React.ElementType; text: string; priority: string }[];
  factors: { name: string; impact: number; direction: "up" | "down" }[];
}

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663448965180/diJACkPyKq5zDs5dUSARpR/hero-churn-YjREJimCttc6WyQ3qJoCKX.webp";

function simulateChurnPrediction(data: FormData): PredictionResult {
  // Simulated ML model logic
  let score = 0;

  // Recency impact (months since last purchase)
  if (data.monthsSinceLastPurchase > 6) score += 30;
  else if (data.monthsSinceLastPurchase > 3) score += 15;
  else score += 5;

  // Frequency impact
  if (data.purchaseFrequency === "muy_baja") score += 25;
  else if (data.purchaseFrequency === "baja") score += 15;
  else if (data.purchaseFrequency === "media") score += 8;
  else score += 2;

  // Complaints impact
  score += Math.min(data.complaints * 8, 20);

  // Satisfaction impact (inverse)
  score += Math.max(0, (5 - data.satisfactionScore) * 6);

  // Loyalty program
  if (data.hasLoyaltyProgram === "no") score += 10;

  // Average ticket (low ticket = higher churn risk)
  if (data.avgTicket < 30000) score += 8;
  else if (data.avgTicket < 80000) score += 4;

  // Clamp between 5 and 95
  const churnProbability = Math.min(95, Math.max(5, score + Math.random() * 8 - 4));

  const riskLevel: "alto" | "medio" | "bajo" =
    churnProbability > 70 ? "alto" : churnProbability > 40 ? "medio" : "bajo";

  const retentionScore = Math.round(100 - churnProbability);
  const lifetimeValue = Math.round(data.avgTicket * (data.purchaseFrequency === "alta" ? 24 : data.purchaseFrequency === "media" ? 12 : 6));

  const recommendations =
    riskLevel === "alto"
      ? [
          { icon: Phone, text: "Contactar al cliente de forma inmediata con llamada personalizada", priority: "Urgente" },
          { icon: Gift, text: "Ofrecer descuento exclusivo del 20% en próxima compra", priority: "Alta" },
          { icon: Mail, text: "Enviar encuesta de satisfacción para identificar problemas", priority: "Alta" },
        ]
      : riskLevel === "medio"
      ? [
          { icon: Mail, text: "Activar campaña de email con ofertas personalizadas", priority: "Media" },
          { icon: Gift, text: "Incluir en programa de fidelización con beneficios extra", priority: "Media" },
          { icon: Phone, text: "Agendar seguimiento comercial en 2 semanas", priority: "Baja" },
        ]
      : [
          { icon: CheckCircle2, text: "Cliente estable - mantener comunicación regular", priority: "Baja" },
          { icon: Gift, text: "Incluir en campañas de upselling y cross-selling", priority: "Baja" },
          { icon: Mail, text: "Enviar newsletter mensual con novedades", priority: "Baja" },
        ];

  const factors = [
    {
      name: "Recencia de compra",
      impact: data.monthsSinceLastPurchase > 3 ? 85 : 25,
      direction: data.monthsSinceLastPurchase > 3 ? "up" as const : "down" as const,
    },
    {
      name: "Frecuencia de compra",
      impact: data.purchaseFrequency === "muy_baja" ? 78 : data.purchaseFrequency === "baja" ? 55 : 20,
      direction: data.purchaseFrequency === "media" || data.purchaseFrequency === "alta" ? "down" as const : "up" as const,
    },
    {
      name: "Quejas registradas",
      impact: Math.min(data.complaints * 22, 90),
      direction: data.complaints > 0 ? "up" as const : "down" as const,
    },
    {
      name: "Satisfacción del cliente",
      impact: data.satisfactionScore < 3 ? 72 : data.satisfactionScore < 4 ? 40 : 15,
      direction: data.satisfactionScore >= 4 ? "down" as const : "up" as const,
    },
    {
      name: "Programa de lealtad",
      impact: data.hasLoyaltyProgram === "no" ? 45 : 12,
      direction: data.hasLoyaltyProgram === "no" ? "up" as const : "down" as const,
    },
  ];

  return { churnProbability: Math.round(churnProbability), riskLevel, retentionScore, lifetimeValue, recommendations, factors };
}

export default function ChurnSimulation() {
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    monthsSinceLastPurchase: 2,
    purchaseFrequency: "",
    avgTicket: 50000,
    complaints: 0,
    satisfactionScore: 4,
    hasLoyaltyProgram: "",
    channelPreference: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = useCallback(() => {
    setIsProcessing(true);
    setResult(null);
    setTimeout(() => {
      const prediction = simulateChurnPrediction(formData);
      setIsProcessing(false);
      setResult(prediction);
    }, 2800);
  }, [formData]);

  const handleReset = () => {
    setResult(null);
    setFormData({
      clientName: "",
      monthsSinceLastPurchase: 2,
      purchaseFrequency: "",
      avgTicket: 50000,
      complaints: 0,
      satisfactionScore: 4,
      hasLoyaltyProgram: "",
      channelPreference: "",
    });
  };

  const isFormValid =
    formData.clientName.trim() !== "" &&
    formData.purchaseFrequency !== "" &&
    formData.hasLoyaltyProgram !== "" &&
    formData.channelPreference !== "";

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <SimulationHeader
          title="Predicción de Churn"
          subtitle="Caso 1 — Retail"
          description="Empresa de retail con clientes recurrentes. El modelo identifica qué clientes están a punto de dejar de comprar para activar campañas de retención a tiempo."
          icon={Users}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/20"
          heroImage={HERO_IMAGE}
          tags={["Clasificación", "Retención", "Machine Learning"]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-slate-800">
                  Datos del Cliente
                </h3>
                <p className="text-xs text-slate-400">
                  Ingresa la información del cliente a evaluar
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Client Name */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Nombre del cliente
                </Label>
                <Input
                  placeholder="Ej: María García"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  className="bg-white/60"
                />
              </div>

              {/* Months since last purchase */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Meses desde última compra: <span className="font-mono-nums text-indigo-600">{formData.monthsSinceLastPurchase}</span>
                </Label>
                <Slider
                  value={[formData.monthsSinceLastPurchase]}
                  onValueChange={([v]) =>
                    setFormData({ ...formData, monthsSinceLastPurchase: v })
                  }
                  min={0}
                  max={12}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 meses</span>
                  <span>12 meses</span>
                </div>
              </div>

              {/* Purchase Frequency */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <ShoppingCart className="w-3.5 h-3.5 inline mr-1" />
                  Frecuencia de compra
                </Label>
                <Select
                  value={formData.purchaseFrequency}
                  onValueChange={(v) =>
                    setFormData({ ...formData, purchaseFrequency: v })
                  }
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta (semanal)</SelectItem>
                    <SelectItem value="media">Media (mensual)</SelectItem>
                    <SelectItem value="baja">Baja (trimestral)</SelectItem>
                    <SelectItem value="muy_baja">Muy baja (semestral+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Average Ticket */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                  Ticket promedio (COP): <span className="font-mono-nums text-indigo-600">${formData.avgTicket.toLocaleString()}</span>
                </Label>
                <Slider
                  value={[formData.avgTicket]}
                  onValueChange={([v]) =>
                    setFormData({ ...formData, avgTicket: v })
                  }
                  min={10000}
                  max={500000}
                  step={5000}
                  className="mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$10,000</span>
                  <span>$500,000</span>
                </div>
              </div>

              {/* Complaints */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                  Quejas en últimos 6 meses: <span className="font-mono-nums text-indigo-600">{formData.complaints}</span>
                </Label>
                <Slider
                  value={[formData.complaints]}
                  onValueChange={([v]) =>
                    setFormData({ ...formData, complaints: v })
                  }
                  min={0}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Satisfaction */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Satisfacción del cliente: <span className="font-mono-nums text-indigo-600">{formData.satisfactionScore}/5</span>
                </Label>
                <Slider
                  value={[formData.satisfactionScore]}
                  onValueChange={([v]) =>
                    setFormData({ ...formData, satisfactionScore: v })
                  }
                  min={1}
                  max={5}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Muy insatisfecho</span>
                  <span>Muy satisfecho</span>
                </div>
              </div>

              {/* Loyalty Program */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Programa de fidelización
                </Label>
                <Select
                  value={formData.hasLoyaltyProgram}
                  onValueChange={(v) =>
                    setFormData({ ...formData, hasLoyaltyProgram: v })
                  }
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="¿Está inscrito?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, está inscrito</SelectItem>
                    <SelectItem value="no">No está inscrito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Channel */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Canal de compra preferido
                </Label>
                <Select
                  value={formData.channelPreference}
                  onValueChange={(v) =>
                    setFormData({ ...formData, channelPreference: v })
                  }
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tienda">Tienda física</SelectItem>
                    <SelectItem value="online">E-commerce</SelectItem>
                    <SelectItem value="ambos">Ambos canales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handlePredict}
                  disabled={!isFormValid || isProcessing}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Ejecutar Predicción
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                {result && (
                  <Button variant="outline" onClick={handleReset} className="bg-white/60">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl shadow-sm"
                >
                  <PredictionLoader label="Analizando comportamiento del cliente..." />
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Main Prediction */}
                  <div
                    className={`rounded-2xl p-6 shadow-sm border ${
                      result.riskLevel === "alto"
                        ? "bg-gradient-to-br from-rose-50 to-red-50 border-rose-200"
                        : result.riskLevel === "medio"
                        ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                        : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Resultado de Predicción
                        </p>
                        <h3 className="font-heading font-bold text-xl text-slate-800 mt-1">
                          {formData.clientName || "Cliente"}
                        </h3>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          result.riskLevel === "alto"
                            ? "bg-rose-100 text-rose-700"
                            : result.riskLevel === "medio"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {result.riskLevel === "alto" && <XCircle className="w-3 h-3 inline mr-1" />}
                        {result.riskLevel === "medio" && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        {result.riskLevel === "bajo" && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                        Riesgo {result.riskLevel}
                      </div>
                    </div>

                    {/* Churn Gauge */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.3 }}
                          className={`text-5xl font-heading font-extrabold font-mono-nums ${
                            result.riskLevel === "alto"
                              ? "text-rose-600"
                              : result.riskLevel === "medio"
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {result.churnProbability}%
                        </motion.div>
                        <p className="text-xs text-slate-500 mt-1">
                          Probabilidad de Churn
                        </p>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.churnProbability}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${
                              result.riskLevel === "alto"
                                ? "bg-gradient-to-r from-rose-400 to-red-500"
                                : result.riskLevel === "medio"
                                ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                : "bg-gradient-to-r from-emerald-400 to-green-500"
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>Bajo riesgo</span>
                          <span>Alto riesgo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      icon={ShieldCheck}
                      label="Score de Retención"
                      value={result.retentionScore}
                      suffix="/100"
                      color="emerald"
                      delay={0.4}
                    />
                    <ResultCard
                      icon={DollarSign}
                      label="Lifetime Value Est."
                      value={`$${result.lifetimeValue.toLocaleString()}`}
                      color="blue"
                      delay={0.5}
                    />
                  </div>

                  {/* Key Factors */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card rounded-2xl p-5 shadow-sm"
                  >
                    <h4 className="font-heading font-semibold text-sm text-slate-700 mb-3">
                      Factores Clave del Modelo
                    </h4>
                    <div className="space-y-3">
                      {result.factors.map((factor, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <TrendingDown
                            className={`w-3.5 h-3.5 shrink-0 ${
                              factor.direction === "up"
                                ? "text-rose-500 rotate-180"
                                : "text-emerald-500"
                            }`}
                          />
                          <span className="text-xs text-slate-600 flex-1">
                            {factor.name}
                          </span>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${factor.impact}%` }}
                              transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                              className={`h-full rounded-full ${
                                factor.direction === "up"
                                  ? "bg-rose-400"
                                  : "bg-emerald-400"
                              }`}
                            />
                          </div>
                          <span className="text-[11px] font-mono-nums text-slate-400 w-8 text-right">
                            {factor.impact}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recommendations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="glass-card rounded-2xl p-5 shadow-sm"
                  >
                    <h4 className="font-heading font-semibold text-sm text-slate-700 mb-3">
                      Acciones Recomendadas
                    </h4>
                    <div className="space-y-2.5">
                      {result.recommendations.map((rec, i) => {
                        const RecIcon = rec.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + i * 0.15 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-slate-100"
                          >
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                              <RecIcon className="w-3.5 h-3.5 text-indigo-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {rec.text}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                                rec.priority === "Urgente"
                                  ? "bg-rose-100 text-rose-600"
                                  : rec.priority === "Alta"
                                  ? "bg-amber-100 text-amber-600"
                                  : rec.priority === "Media"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {rec.priority}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-400 mb-2">
                    Resultado de Predicción
                  </h3>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Completa los datos del cliente y ejecuta la predicción para ver
                    la probabilidad de churn y las acciones recomendadas.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
