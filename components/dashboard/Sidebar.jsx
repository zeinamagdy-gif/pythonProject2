import React from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  FileText,
  Database,
  TrendingUp,
  Container,
  ListChecks,
  BarChartHorizontalBig,
  LayoutDashboard,
  Package,
  Truck,
  Activity,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import KPICard from "@/components/dashboard/KPICard";

const pageIcons = {
  homepage: Home,
  readme: FileText,
  main_data: LayoutDashboard,
  data_base: Database,
  forecast: TrendingUp,
  container_utilization: Container,
  cor_kpis: ListChecks,
  cor_forecast: BarChartHorizontalBig
};

const Sidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  powerBIPages, 
  onPageSelect,
  currentPBIPageUrl 
}) => {

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" }
  };

  const formatPageName = (pageKey) => {
    return pageKey
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const kpiData = [
    { title: "Total Shipments", value: "15,230", change: "+5.6%", icon: Package, trend: "positive" },
    { title: "Container Utilization", value: "85%", change: "+2.1%", icon: Truck, trend: "positive" },
    { title: "Core KPIs Met", value: "92%", change: "-0.5%", icon: Activity, trend: "negative" },
    { title: "Forecast Accuracy", value: "78%", change: "+1.2%", icon: Zap, trend: "positive" },
  ];

  return (
    <motion.div
      className={cn(
        "sidebar-gradient h-screen fixed left-0 top-0 z-30 flex flex-col border-r border-border/50 shadow-lg",
        isCollapsed ? "items-center" : "items-start"
      )}
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between w-full p-4">
        {!isCollapsed && (
          <motion.h1 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            KPI Collective
          </motion.h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <Separator />

      <div className={cn("w-full overflow-y-auto scrollbar-hide flex-1 py-4", 
        isCollapsed ? "px-0" : "px-4" 
      )}>
        {!isCollapsed && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Key Metrics</h3>
              <div className="space-y-2">
                {kpiData.map((kpi, index) => (
                  <KPICard 
                    key={index}
                    title={kpi.title}
                    value={kpi.value}
                    change={kpi.change}
                    icon={kpi.icon}
                    trend={kpi.trend}
                    small={true}
                  />
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Report Pages</h3>
              <div className="space-y-1">
                {Object.keys(powerBIPages).map((pageKey) => {
                  const Icon = pageIcons[pageKey] || LayoutDashboard;
                  return (
                    <button
                      key={pageKey}
                      onClick={() => onPageSelect(pageKey)}
                      className={cn(
                        "filter-item w-full text-left",
                        powerBIPages[pageKey] === currentPBIPageUrl && "active"
                      )}
                    >
                      <Icon size={18} />
                      <span>{formatPageName(pageKey)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex flex-col items-center space-y-2 mt-4 w-full px-2">
            {Object.keys(powerBIPages).map((pageKey) => {
              const Icon = pageIcons[pageKey] || LayoutDashboard;
              return (
                <Button 
                  key={pageKey}
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-10 w-10",
                    powerBIPages[pageKey] === currentPBIPageUrl && "bg-primary/20 text-primary"
                  )}
                  onClick={() => onPageSelect(pageKey)}
                  title={formatPageName(pageKey)}
                >
                  <Icon size={20} />
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;