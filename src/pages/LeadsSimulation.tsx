/**
 * CASO 3 - LEADS: Probabilidad de compra / Priorización de leads
 * Empresa B2B con equipo comercial
 * 
 * Design: Neural Canvas
 * Input: Lead data (company size, interactions, source, budget, etc.)
 * Output: Purchase probability, priority ranking, recommended actions
 */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Building2,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Users,
  ArrowRight,
  RotateCcw,
  Star,
  Trophy,
  Clock,
  MessageSquare,
  Brain,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import AppLayout from "@/components/AppLayout";
import SimulationHeader from "@/components/SimulationHeader";
import PredictionLoader from "@/components/PredictionLoader";
import ResultCard from "@/components/ResultCard";

interface FormData {
  leadName: string;
  companyName: string;
  companySize: string;
  industry: string;
  leadSource: string;
  interactions: number;
  daysSinceFirstContact: number;
  estimatedBudget: string;
  decisionMaker: string;
  engagementLevel: string;
}

interface PredictionResult {
  purchaseProbability: number;
  priorityLevel: "A" | "B" | "C";
  leadScore: number;
  estimatedDealValue: number;
  timeToClose: string;
  recommendations: { icon: React.ElementType; text: string; timing: string }[];
  scoringFactors: { name: string; score: number; maxScore: number }[];
}

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663448965180/diJACkPyKq5zDs5dUSARpR/hero-leads-iqJXVQuzWMTu3HJDmo6cip.webp";

function simulateLeadScoring(data: FormData): PredictionResult {
  let score = 0;

  // Company size
  if (data.companySize === "grande") score += 20;
  else if (data.companySize === "mediana") score += 15;
  else score += 8;

  // Interactions
  score += Math.min(data.interactions * 3, 20);

  // Days since first contact (sweet spot: 7-30 days)
  if (data.daysSinceFirstContact >= 7 && data.daysSinceFirstContact <= 30) score += 15;
  else if (data.daysSinceFirstContact < 7) score += 10;
  else if (data.daysSinceFirstContact <= 60) score += 8;
  else score += 3;

  // Budget
  if (data.estimatedBudget === "alto") score += 18;
  else if (data.estimatedBudget === "medio") score += 12;
  else score += 5;

  // Decision maker
  if (data.decisionMaker === "si") score += 15;
  else score += 5;

  // Engagement
  if (data.engagementLevel === "alto") score += 12;
  else if (data.engagementLevel === "medio") score += 7;
  else score += 2;

  // Lead source bonus
  if (data.leadSource === "referido") score += 10;
  else if (data.leadSource === "inbound") score += 7;
  else score += 3;

  const purchaseProbability = Math.min(95, Math.max(8, score + Math.random() * 6 - 3));
  const priorityLevel: "A" | "B" | "C" =
    purchaseProbability > 65 ? "A" : purchaseProbability > 35 ? "B" : "C";

  const leadScore = Math.round(purchaseProbability);

  const dealValues: Record<string, number> = { alto: 15000000, medio: 8000000, bajo: 4000000 };
  const estimatedDealValue = dealValues[data.estimatedBudget] || 6000000;

  const timeToClose =
    purchaseProbability > 65
      ? "2-3 semanas"
      : purchaseProbability > 35
      ? "4-6 semanas"
      : "8+ semanas";

  const recommendations =
    priorityLevel === "A"
      ? [
          { icon: Phone, text: "Agendar llamada de cierre con el lead de forma inmediata", timing: "Hoy" },
          { icon: Mail, text: "Enviar propuesta comercial personalizada con caso de éxito relevante", timing: "24 horas" },
          { icon: Users, text: "Involucrar al director comercial en la siguiente reunión", timing: "Esta semana" },
        ]
      : priorityLevel === "B"
      ? [
          { icon: Mail, text: "Enviar contenido educativo sobre el problema que resuelves", timing: "Esta semana" },
          { icon: Phone, text: "Agendar demo personalizada del producto o servicio", timing: "Próxima semana" },
          { icon: MessageSquare, text: "Nutrir con casos de éxito de empresas similares", timing: "2 semanas" },
        ]
      : [
          { icon: Mail, text: "Incluir en secuencia de nurturing automatizada", timing: "Inmediato" },
          { icon: Globe, text: "Compartir contenido de blog y recursos educativos", timing: "Semanal" },
          { icon: Clock, text: "Re-evaluar en 30 días para verificar cambio de comportamiento", timing: "30 días" },
        ];

  const scoringFactors = [
    { name: "Tamaño de empresa", score: data.companySize === "grande" ? 20 : data.companySize === "mediana" ? 15 : 8, maxScore: 20 },
    { name: "Nivel de interacción", score: Math.min(data.interactions * 3, 20), maxScore: 20 },
    { name: "Presupuesto estimado", score: data.estimatedBudget === "alto" ? 18 : data.estimatedBudget === "medio" ? 12 : 5, maxScore: 18 },
    { name: "Tomador de decisión", score: data.decisionMaker === "si" ? 15 : 5, maxScore: 15 },
    { name: "Engagement", score: data.engagementLevel === "alto" ? 12 : data.engagementLevel === "medio" ? 7 : 2, maxScore: 12 },
    { name: "Fuente del lead", score: data.leadSource === "referido" ? 10 : data.leadSource === "inbound" ? 7 : 3, maxScore: 10 },
  ];

  return {
    purchaseProbability: Math.round(purchaseProbability),
    priorityLevel,
    leadScore,
    estimatedDealValue,
    timeToClose,
    recommendations,
    scoringFactors,
  };
}

export default function LeadsSimulation() {
  const [formData, setFormData] = useState<FormData>({
    leadName: "",
    companyName: "",
    companySize: "",
    industry: "",
    leadSource: "",
    interactions: 3,
    daysSinceFirstContact: 14,
    estimatedBudget: "",
    decisionMaker: "",
    engagementLevel: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = useCallback(() => {
    setIsProcessing(true);
    setResult(null);
    setTimeout(() => {
      const prediction = simulateLeadScoring(formData);
      setIsProcessing(false);
      setResult(prediction);
    }, 2800);
  }, [formData]);

  const handleReset = () => {
    setResult(null);
    setFormData({
      leadName: "",
      companyName: "",
      companySize: "",
      industry: "",
      leadSource: "",
      interactions: 3,
      daysSinceFirstContact: 14,
      estimatedBudget: "",
      decisionMaker: "",
      engagementLevel: "",
    });
  };

  const isFormValid =
    formData.leadName.trim() !== "" &&
    formData.companyName.trim() !== "" &&
    formData.companySize !== "" &&
    formData.industry !== "" &&
    formData.leadSource !== "" &&
    formData.estimatedBudget !== "" &&
    formData.decisionMaker !== "" &&
    formData.engagementLevel !== "";

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <SimulationHeader
          title="Priorización de Leads"
          subtitle="Caso 3 — B2B"
          description="Empresa B2B con equipo comercial que necesita saber a qué leads priorizar para mejorar la conversión y la eficiencia del equipo."
          icon={Target}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/20"
          heroImage={HERO_IMAGE}
          tags={["Scoring", "Conversión", "Clasificación"]}
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
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-slate-800">
                  Datos del Lead
                </h3>
                <p className="text-xs text-slate-400">
                  Ingresa la información del lead a evaluar
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Lead Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    Nombre del contacto
                  </Label>
                  <Input
                    placeholder="Ej: Carlos Pérez"
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                    className="bg-white/60"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    Empresa
                  </Label>
                  <Input
                    placeholder="Ej: TechCorp SAS"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="bg-white/60"
                  />
                </div>
              </div>

              {/* Company Size */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <Building2 className="w-3.5 h-3.5 inline mr-1" />
                  Tamaño de empresa
                </Label>
                <Select
                  value={formData.companySize}
                  onValueChange={(v) => setFormData({ ...formData, companySize: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grande">Grande (+200 empleados)</SelectItem>
                    <SelectItem value="mediana">Mediana (50-200 empleados)</SelectItem>
                    <SelectItem value="pequena">Pequeña (-50 empleados)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Industry */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Industria
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(v) => setFormData({ ...formData, industry: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar industria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnologia">Tecnología</SelectItem>
                    <SelectItem value="retail">Retail / E-commerce</SelectItem>
                    <SelectItem value="servicios">Servicios profesionales</SelectItem>
                    <SelectItem value="manufactura">Manufactura</SelectItem>
                    <SelectItem value="salud">Salud</SelectItem>
                    <SelectItem value="educacion">Educación</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lead Source */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <Globe className="w-3.5 h-3.5 inline mr-1" />
                  Fuente del lead
                </Label>
                <Select
                  value={formData.leadSource}
                  onValueChange={(v) => setFormData({ ...formData, leadSource: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="¿Cómo llegó el lead?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="referido">Referido</SelectItem>
                    <SelectItem value="inbound">Inbound (web/contenido)</SelectItem>
                    <SelectItem value="outbound">Outbound (prospección)</SelectItem>
                    <SelectItem value="evento">Evento / Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interactions */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                  Interacciones totales: <span className="font-mono-nums text-emerald-600">{formData.interactions}</span>
                </Label>
                <Slider
                  value={[formData.interactions]}
                  onValueChange={([v]) => setFormData({ ...formData, interactions: v })}
                  min={0}
                  max={15}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 interacciones</span>
                  <span>15 interacciones</span>
                </div>
              </div>

              {/* Days since first contact */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Días desde primer contacto: <span className="font-mono-nums text-emerald-600">{formData.daysSinceFirstContact}</span>
                </Label>
                <Slider
                  value={[formData.daysSinceFirstContact]}
                  onValueChange={([v]) => setFormData({ ...formData, daysSinceFirstContact: v })}
                  min={1}
                  max={90}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Budget */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                  Presupuesto estimado
                </Label>
                <Select
                  value={formData.estimatedBudget}
                  onValueChange={(v) => setFormData({ ...formData, estimatedBudget: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar rango" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alto">Alto (+$10M COP)</SelectItem>
                    <SelectItem value="medio">Medio ($5M-$10M COP)</SelectItem>
                    <SelectItem value="bajo">Bajo (-$5M COP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Decision Maker */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  ¿Es tomador de decisión?
                </Label>
                <Select
                  value={formData.decisionMaker}
                  onValueChange={(v) => setFormData({ ...formData, decisionMaker: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, toma decisiones</SelectItem>
                    <SelectItem value="no">No, es influenciador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Engagement */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Nivel de engagement
                </Label>
                <Select
                  value={formData.engagementLevel}
                  onValueChange={(v) => setFormData({ ...formData, engagementLevel: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alto">Alto (responde rápido, hace preguntas)</SelectItem>
                    <SelectItem value="medio">Medio (responde pero sin urgencia)</SelectItem>
                    <SelectItem value="bajo">Bajo (respuestas esporádicas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handlePredict}
                  disabled={!isFormValid || isProcessing}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Evaluar Lead
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
                  <PredictionLoader label="Evaluando probabilidad de compra..." />
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Main Result */}
                  <div
                    className={`rounded-2xl p-6 shadow-sm border ${
                      result.priorityLevel === "A"
                        ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
                        : result.priorityLevel === "B"
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                        : "bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Lead Scoring
                        </p>
                        <h3 className="font-heading font-bold text-xl text-slate-800 mt-1">
                          {formData.leadName} — {formData.companyName}
                        </h3>
                      </div>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-heading font-extrabold ${
                          result.priorityLevel === "A"
                            ? "bg-emerald-100 text-emerald-700"
                            : result.priorityLevel === "B"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {result.priorityLevel}
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.4 }}
                          className={`text-5xl font-heading font-extrabold font-mono-nums ${
                            result.priorityLevel === "A"
                              ? "text-emerald-600"
                              : result.priorityLevel === "B"
                              ? "text-blue-600"
                              : "text-slate-500"
                          }`}
                        >
                          {result.purchaseProbability}%
                        </motion.div>
                        <p className="text-xs text-slate-500 mt-1">
                          Probabilidad de Compra
                        </p>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.purchaseProbability}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${
                              result.priorityLevel === "A"
                                ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                                : result.priorityLevel === "B"
                                ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                                : "bg-gradient-to-r from-slate-300 to-slate-400"
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>Baja probabilidad</span>
                          <span>Alta probabilidad</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {result.priorityLevel === "A" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : result.priorityLevel === "B" ? (
                        <AlertTriangle className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-xs text-slate-600">
                        Prioridad{" "}
                        <strong>
                          {result.priorityLevel === "A"
                            ? "Alta — Contactar inmediatamente"
                            : result.priorityLevel === "B"
                            ? "Media — Nutrir y dar seguimiento"
                            : "Baja — Incluir en nurturing"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <ResultCard
                      icon={Trophy}
                      label="Lead Score"
                      value={result.leadScore}
                      suffix="/100"
                      color="emerald"
                      delay={0.5}
                    />
                    <ResultCard
                      icon={DollarSign}
                      label="Deal Estimado"
                      value={`$${(result.estimatedDealValue / 1000000).toFixed(0)}M`}
                      color="blue"
                      delay={0.6}
                    />
                    <ResultCard
                      icon={Clock}
                      label="Tiempo Cierre"
                      value={result.timeToClose}
                      color="indigo"
                      delay={0.7}
                    />
                  </div>

                  {/* Scoring Factors */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="glass-card rounded-2xl p-5 shadow-sm"
                  >
                    <h4 className="font-heading font-semibold text-sm text-slate-700 mb-3">
                      Desglose del Score
                    </h4>
                    <div className="space-y-3">
                      {result.scoringFactors.map((factor, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-slate-600 w-36 shrink-0">
                            {factor.name}
                          </span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(factor.score / factor.maxScore) * 100}%`,
                              }}
                              transition={{ duration: 0.8, delay: 0.9 + i * 0.1 }}
                              className={`h-full rounded-full ${
                                factor.score / factor.maxScore > 0.7
                                  ? "bg-emerald-400"
                                  : factor.score / factor.maxScore > 0.4
                                  ? "bg-blue-400"
                                  : "bg-slate-300"
                              }`}
                            />
                          </div>
                          <span className="text-[11px] font-mono-nums text-slate-400 w-12 text-right">
                            {factor.score}/{factor.maxScore}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recommendations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
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
                            transition={{ delay: 1.1 + i * 0.15 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-slate-100"
                          >
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                              <RecIcon className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {rec.text}
                              </p>
                            </div>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0">
                              {rec.timing}
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
                    <Target className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-400 mb-2">
                    Evaluación de Lead
                  </h3>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Completa los datos del lead y ejecuta la evaluación para ver la
                    probabilidad de compra y las acciones recomendadas.
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
