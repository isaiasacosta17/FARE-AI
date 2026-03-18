/**
 * Neural Canvas Design: Simulation Header with hero image
 */
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SimulationHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  heroImage: string;
  tags: string[];
}

export default function SimulationHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  heroImage,
  tags,
}: SimulationHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8">
      {/* Hero Image */}
      <div className="relative h-48 sm:h-56">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end p-6 sm:p-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </motion.div>
              <div>
                <p className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  {subtitle}
                </p>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {title}
                </h2>
              </div>
            </div>
            <p className="text-sm text-white/70 max-w-xl leading-relaxed">
              {description}
            </p>
            <div className="flex gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/80 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
