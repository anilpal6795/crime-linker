
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  type?: string;
}

interface MapViewProps {
  locations: Location[];
  title?: string;
  height?: string;
}

const MapView = ({ locations, title = "Incident Map", height = "400px" }: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for a real map visualization library
    // In a real implementation, you would use a library like Leaflet, Google Maps, or Mapbox
    const renderMap = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      container.innerHTML = "";
      
      // Mock visualization - In reality, you'd initialize your map library here
      const mockElement = document.createElement("div");
      mockElement.style.height = "100%";
      mockElement.style.display = "flex";
      mockElement.style.flexDirection = "column";
      mockElement.style.alignItems = "center";
      mockElement.style.justifyContent = "center";
      mockElement.style.backgroundColor = "rgba(20, 184, 166, 0.1)";
      mockElement.style.borderRadius = "0.5rem";
      mockElement.style.border = "1px dashed rgba(20, 184, 166, 0.3)";
      
      const icon = document.createElement("div");
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(20, 184, 166, 0.6)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"></circle><path d="M12 21l-8-8c0-5.5 4.5-10 10-10s10 4.5 10 10l-8 8a2 2 0 0 1-4 0z"></path></svg>`;
      mockElement.appendChild(icon);
      
      const text = document.createElement("p");
      text.textContent = `Map with ${locations.length} incident locations`;
      text.style.margin = "1rem 0 0";
      text.style.color = "rgba(20, 184, 166, 0.8)";
      mockElement.appendChild(text);
      
      container.appendChild(mockElement);
    };

    renderMap();
  }, [locations]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef} 
          className="w-full" 
          style={{ height }}
        />
      </CardContent>
    </Card>
  );
};

export default MapView;
