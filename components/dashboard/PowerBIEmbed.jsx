import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";

const PowerBIEmbed = ({ embedUrl, filters }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const iframe = iframeRef.current;

    if (!embedUrl) {
      setError("Power BI embed URL is not provided.");
      setIsLoading(false);
      return;
    }
    
    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Failed to load the Power BI report. Please check the URL and network connection.");
    };

    if (iframe) {
      iframe.addEventListener("load", handleLoad);
      iframe.addEventListener("error", handleError);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleLoad);
        iframe.removeEventListener("error", handleError);
      }
    };
  }, [embedUrl]);

  useEffect(() => {
    if (iframeRef.current && !isLoading && !error) {
      console.log("Applying filters to Power BI (simulated):", filters);
    }
  }, [filters, isLoading, error]);

  if (error) {
    return (
      <div className="power-bi-container flex flex-col items-center justify-center bg-card rounded-lg border border-destructive/50 p-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-destructive mb-2">Report Loading Error</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="power-bi-container relative rounded-lg overflow-hidden border border-border/50">
      {isLoading && (
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-card z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-primary">Loading Power BI Report...</p>
          <p className="text-sm text-muted-foreground">Please wait a moment.</p>
        </motion.div>
      )}
      
      <iframe 
        ref={iframeRef}
        title="Power BI Dashboard"
        src={embedUrl}
        allowFullScreen
        className="transition-opacity duration-500"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};

export default PowerBIEmbed;