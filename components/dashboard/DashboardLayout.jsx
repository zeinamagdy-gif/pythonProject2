import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PowerBIEmbed from "@/components/dashboard/PowerBIEmbed";
import { Separator } from "@/components/ui/separator";
import { useUserData } from "@/contexts/UserDataContext";

const DashboardLayout = ({ currentUser, onLogout, powerBIPages, currentPBIPageUrl, setCurrentPBIPageUrl }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { getUserData } = useUserData();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const profile = getUserData(currentUser.username);
      setUserProfile(profile);
    }
  }, [currentUser, getUserData]);

  const handlePageSelect = (pageKey) => {
    setCurrentPBIPageUrl(powerBIPages[pageKey]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        powerBIPages={powerBIPages}
        onPageSelect={handlePageSelect}
        currentPBIPageUrl={currentPBIPageUrl}
      />
      <div className="flex-1 flex flex-col">
        <Header 
          isCollapsed={isCollapsed} 
          onLogout={onLogout} 
          userProfile={userProfile} 
          showSearch={true} 
        />
        
        <main 
          className="flex-1 pt-16 overflow-y-auto"
        >
          <div className="p-6 h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col"
            >
              <div className="bg-card text-card-foreground rounded-lg p-4 border border-border/50 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-1">Power BI: Live Data</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Current view of your selected Power BI report page. Use the sidebar to navigate.
                </p>
                <Separator className="my-2" />
                <div className="flex-1 min-h-[calc(100vh-200px)]">
                  <PowerBIEmbed embedUrl={currentPBIPageUrl} />
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;