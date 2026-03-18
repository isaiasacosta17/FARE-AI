/**
 * CASO 2 - VENTAS: Forecast de ventas para e-commerce
 * 
 * Design: Neural Canvas
 * Input: Historical sales data, category, season, marketing spend
 * Output: Sales forecast, inventory recommendations, confidence intervals
 */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  BarChart3,
  ArrowRight,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Truck,
  AlertCircle,
  Brain,
  Zap,
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
  productCategory: string;
  currentMonthSales: number;
  lastMonthSales: number;
  season: string;
  marketingBudget: number;
  avgPrice: number;
  stockLevel: string;
  promotionActive: string;
}

interface PredictionResult {
  forecastedSales: number;
  forecastedRevenue: number;
  growthRate: number;
  confidence: number;
  recommendedStock: number;
  stockoutRisk: string;
  monthlyBreakdown: { month: string; sales: number; revenue: number }[];
  insights: { text: string; type: "positive" | "warning" | "neutral" }[];
}

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663448965180/diJACkPyKq5zDs5dUSARpR/hero-sales-dDjE8fo88v2rJbMnMmcadk.webp";

function simulateSalesForecast(data: FormData): PredictionResult {
  const baseSales = data.currentMonthSales;
  const trend = (data.currentMonthSales - data.lastMonthSales) / Math.max(data.lastMonthSales, 1);

  let seasonMultiplier = 1;
  if (data.season === "alta") seasonMultiplier = 1.35;
  else if (data.season === "media") seasonMultiplier = 1.1;
  else seasonMultiplier = 0.85;

  const marketingEffect = 1 + (data.marketingBudget / 10000000) * 0.15;
  const promotionEffect = data.promotionActive === "si" ? 1.2 : 1;

  const forecastedSales = Math.round(
    baseSales * (1 + trend * 0.6) * seasonMultiplier * marketingEffect * promotionEffect + (Math.random() * 20 - 10)
  );

  const forecastedRevenue = forecastedSales * data.avgPrice;
  const growthRate = Math.round(((forecastedSales - baseSales) / Math.max(baseSales, 1)) * 100);
  const confidence = Math.min(92, Math.max(68, 85 - Math.abs(trend) * 20 + (data.marketingBudget > 3000000 ? 5 : 0)));

  const recommendedStock = Math.round(forecastedSales * 1.2);
  const stockoutRisk =
    data.stockLevel === "bajo" ? "Alto" : data.stockLevel === "medio" ? "Medio" : "Bajo";

  const months = ["Mes 1", "Mes 2", "Mes 3"];
  const monthlyBreakdown = months.map((month, i) => ({
    month,
    sales: Math.round(forecastedSales * (1 + (i * 0.05 * (trend > 0 ? 1 : -1))) + Math.random() * 15 - 7),
    revenue: 0,
  }));
  monthlyBreakdown.forEach((m) => (m.revenue = m.sales * data.avgPrice));

  const insights: PredictionResult["insights"] = [];
  if (growthRate > 10) insights.push({ text: `Se proyecta un crecimiento del ${growthRate}% en ventas respecto al mes actual`, type: "positive" });
  else if (growthRate < -5) insights.push({ text: `Se anticipa una caída del ${Math.abs(growthRate)}% en ventas. Considerar acciones correctivas`, type: "warning" });
  else insights.push({ text: `Las ventas se mantienen estables con variación del ${growthRate}%`, type: "neutral" });

  if (stockoutRisk === "Alto") insights.push({ text: "Riesgo alto de quiebre de stock. Se recomienda reabastecer de inmediato", type: "warning" });
  if (data.promotionActive === "si") insights.push({ text: "La promoción activa impulsa un incremento estimado del 20% en unidades", type: "positive" });
  if (data.season === "alta") insights.push({ text: "Temporada alta detectada. Preparar inventario adicional y logística", type: "positive" });

  return {
    forecastedSales,
    forecastedRevenue,
    growthRate,
    confidence: Math.round(confidence),
    recommendedStock,
    stockoutRisk,
    monthlyBreakdown,
    insights,
  };
}

export default function SalesSimulation() {
  const [formData, setFormData] = useState<FormData>({
    productCategory: "",
    currentMonthSales: 150,
    lastMonthSales: 130,
    season: "",
    marketingBudget: 2000000,
    avgPrice: 85000,
    stockLevel: "",
    promotionActive: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = useCallback(() => {
    setIsProcessing(true);
    setResult(null);
    setTimeout(() => {
      const prediction = simulateSalesForecast(formData);
      setIsProcessing(false);
      setResult(prediction);
    }, 2800);
  }, [formData]);

  const handleReset = () => {
    setResult(null);
    setFormData({
      productCategory: "",
      currentMonthSales: 150,
      lastMonthSales: 130,
      season: "",
      marketingBudget: 2000000,
      avgPrice: 85000,
      stockLevel: "",
      promotionActive: "",
    });
  };

  const isFormValid =
    formData.productCategory !== "" &&
    formData.season !== "" &&
    formData.stockLevel !== "" &&
    formData.promotionActive !== "";

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <SimulationHeader
          title="Forecast de Ventas"
          subtitle="Caso 2 — E-commerce"
          description="Empresa de e-commerce que necesita predecir cuánto va a vender para planificar inventario, marketing y producción de forma inteligente."
          icon={TrendingUp}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/20"
          heroImage={HERO_IMAGE}
          tags={["Regresión", "Forecast", "Inventario"]}
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
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-slate-800">
                  Datos de Ventas
                </h3>
                <p className="text-xs text-slate-400">
                  Ingresa la información del producto y mercado
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Product Category */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <ShoppingBag className="w-3.5 h-3.5 inline mr-1" />
                  Categoría de producto
                </Label>
                <Select
                  value={formData.productCategory}
                  onValueChange={(v) => setFormData({ ...formData, productCategory: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moda">Moda y accesorios</SelectItem>
                    <SelectItem value="tecnologia">Tecnología</SelectItem>
                    <SelectItem value="hogar">Hogar y decoración</SelectItem>
                    <SelectItem value="alimentos">Alimentos y bebidas</SelectItem>
                    <SelectItem value="salud">Salud y bienestar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Current Month Sales */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
                  Ventas mes actual (unidades): <span className="font-mono-nums text-blue-600">{formData.currentMonthSales}</span>
                </Label>
                <Slider
                  value={[formData.currentMonthSales]}
                  onValueChange={([v]) => setFormData({ ...formData, currentMonthSales: v })}
                  min={10}
                  max={1000}
                  step={5}
                  className="mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>10 uds</span>
                  <span>1,000 uds</span>
                </div>
              </div>

              {/* Last Month Sales */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Ventas mes anterior (unidades): <span className="font-mono-nums text-blue-600">{formData.lastMonthSales}</span>
                </Label>
                <Slider
                  value={[formData.lastMonthSales]}
                  onValueChange={([v]) => setFormData({ ...formData, lastMonthSales: v })}
                  min={10}
                  max={1000}
                  step={5}
                  className="mt-2"
                />
              </div>

              {/* Season */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  Temporada
                </Label>
                <Select
                  value={formData.season}
                  onValueChange={(v) => setFormData({ ...formData, season: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar temporada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta (Navidad, Black Friday)</SelectItem>
                    <SelectItem value="media">Media (Temporada regular)</SelectItem>
                    <SelectItem value="baja">Baja (Post-temporada)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Marketing Budget */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                  Presupuesto marketing (COP): <span className="font-mono-nums text-blue-600">${formData.marketingBudget.toLocaleString()}</span>
                </Label>
                <Slider
                  value={[formData.marketingBudget]}
                  onValueChange={([v]) => setFormData({ ...formData, marketingBudget: v })}
                  min={500000}
                  max={15000000}
                  step={500000}
                  className="mt-2"
                />
              </div>

              {/* Average Price */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Precio promedio (COP): <span className="font-mono-nums text-blue-600">${formData.avgPrice.toLocaleString()}</span>
                </Label>
                <Slider
                  value={[formData.avgPrice]}
                  onValueChange={([v]) => setFormData({ ...formData, avgPrice: v })}
                  min={10000}
                  max={500000}
                  step={5000}
                  className="mt-2"
                />
              </div>

              {/* Stock Level */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  <Package className="w-3.5 h-3.5 inline mr-1" />
                  Nivel de inventario actual
                </Label>
                <Select
                  value={formData.stockLevel}
                  onValueChange={(v) => setFormData({ ...formData, stockLevel: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alto">Alto (stock suficiente)</SelectItem>
                    <SelectItem value="medio">Medio (stock moderado)</SelectItem>
                    <SelectItem value="bajo">Bajo (stock limitado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Promotion */}
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  ¿Promoción activa?
                </Label>
                <Select
                  value={formData.promotionActive}
                  onValueChange={(v) => setFormData({ ...formData, promotionActive: v })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, hay promoción activa</SelectItem>
                    <SelectItem value="no">No hay promoción</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handlePredict}
                  disabled={!isFormValid || isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Generar Forecast
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
                  <PredictionLoader label="Calculando forecast de ventas..." />
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Main Forecast */}
                  <div className="rounded-2xl p-6 shadow-sm border bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Forecast Próximo Mes
                        </p>
                        <h3 className="font-heading font-bold text-xl text-slate-800 mt-1">
                          Predicción de Ventas
                        </h3>
                      </div>
                      <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        Confianza: {result.confidence}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.3 }}
                          className="text-4xl font-heading font-extrabold text-blue-600 font-mono-nums"
                        >
                          {result.forecastedSales}
                        </motion.div>
                        <p className="text-xs text-slate-500 mt-1">Unidades proyectadas</p>
                      </div>
                      <div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.4 }}
                          className="text-3xl font-heading font-extrabold text-indigo-600 font-mono-nums"
                        >
                          ${(result.forecastedRevenue / 1000000).toFixed(1)}M
                        </motion.div>
                        <p className="text-xs text-slate-500 mt-1">Ingresos proyectados</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {result.growthRate >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-500" />
                      )}
                      <span
                        className={`text-sm font-semibold font-mono-nums ${
                          result.growthRate >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {result.growthRate >= 0 ? "+" : ""}
                        {result.growthRate}%
                      </span>
                      <span className="text-xs text-slate-400">vs mes actual</span>
                    </div>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      icon={Truck}
                      label="Stock Recomendado"
                      value={result.recommendedStock}
                      suffix="uds"
                      color="blue"
                      delay={0.5}
                    />
                    <ResultCard
                      icon={AlertCircle}
                      label="Riesgo de Quiebre"
                      value={result.stockoutRisk}
                      color={result.stockoutRisk === "Alto" ? "rose" : result.stockoutRisk === "Medio" ? "amber" : "emerald"}
                      delay={0.6}
                    />
                  </div>

                  {/* Monthly Breakdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="glass-card rounded-2xl p-5 shadow-sm"
                  >
                    <h4 className="font-heading font-semibold text-sm text-slate-700 mb-3">
                      Proyección Trimestral
                    </h4>
                    <div className="space-y-3">
                      {result.monthlyBreakdown.map((m, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 w-12">{m.month}</span>
                          <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(m.sales / Math.max(...result.monthlyBreakdown.map((x) => x.sales))) * 100}%`,
                              }}
                              transition={{ duration: 0.8, delay: 0.8 + i * 0.15 }}
                              className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg"
                            />
                            <span className="absolute inset-0 flex items-center px-3 text-[11px] font-medium text-slate-700 font-mono-nums">
                              {m.sales} uds — ${(m.revenue / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Insights */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="glass-card rounded-2xl p-5 shadow-sm"
                  >
                    <h4 className="font-heading font-semibold text-sm text-slate-700 mb-3">
                      Insights del Modelo
                    </h4>
                    <div className="space-y-2.5">
                      {result.insights.map((insight, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + i * 0.15 }}
                          className={`flex items-start gap-3 p-3 rounded-xl border ${
                            insight.type === "positive"
                              ? "bg-emerald-50/50 border-emerald-100"
                              : insight.type === "warning"
                              ? "bg-amber-50/50 border-amber-100"
                              : "bg-slate-50/50 border-slate-100"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                              insight.type === "positive"
                                ? "bg-emerald-500"
                                : insight.type === "warning"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                            }`}
                          />
                          <p className="text-xs text-slate-700 leading-relaxed">{insight.text}</p>
                        </motion.div>
                      ))}
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
                    <TrendingUp className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-400 mb-2">
                    Forecast de Ventas
                  </h3>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Ingresa los datos de ventas y mercado para generar una predicción
                    de ventas con recomendaciones de inventario.
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
