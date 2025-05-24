import React from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const KPICard = ({ title, value, change, icon: Icon, trend = "neutral", isLoading = false, small = false }) => {
  const getTrendColor = () => {
    if (trend === "positive") return "text-green-500";
    if (trend === "negative") return "text-red-500";
    return "text-blue-500";
  };

  const getTrendIcon = () => {
    if (trend === "positive") return <ArrowUp className={cn("h-3 w-3", small ? "h-2.5 w-2.5" : "h-4 w-4")} />;
    if (trend === "negative") return <ArrowDown className={cn("h-3 w-3", small ? "h-2.5 w-2.5" : "h-4 w-4")} />;
    return null;
  };

  if (isLoading) {
    return (
      <div className={cn("kpi-card", small && "kpi-card-small p-3")}>
        <div className="animate-pulse flex space-x-3">
          <div className={cn("rounded-full bg-slate-700", small ? "h-8 w-8" : "h-10 w-10")}></div>
          <div className="flex-1 space-y-2 py-1">
            <div className={cn("bg-slate-700 rounded", small ? "h-3 w-2/3" : "h-4 w-3/4")}></div>
            <div className={cn("bg-slate-700 rounded", small ? "h-6 w-1/3" : "h-8 w-1/2")}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={cn("kpi-card", small && "kpi-card-small p-3")}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: small ? 1.03 : 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div className={cn("kpi-label", small && "text-xs")}>{title}</div>
        <div className={cn("p-1.5 rounded-full", 
          small ? "p-1" : "p-2",
          trend === "positive" ? "bg-green-500/10" : 
          trend === "negative" ? "bg-red-500/10" : 
          "bg-blue-500/10"
        )}>
          {Icon && <Icon className={cn(getTrendColor(), small ? "h-4 w-4" : "h-5 w-5")} />}
        </div>
      </div>
      <div className={cn("kpi-value", small && "text-xl mt-0.5")}>{value}</div>
      {change && (
        <div className={cn("flex items-center text-xs", getTrendColor(), small ? "mt-0.5" : "mt-2 text-sm")}>
          {getTrendIcon()}
          <span className="ml-1">{change}</span>
        </div>
      )}
    </motion.div>
  );
};

export default KPICard;