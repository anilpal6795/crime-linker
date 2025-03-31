
import { useEffect, useRef } from "react";
import { GraphData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";

interface GraphViewProps {
  data: GraphData;
  title?: string;
  height?: string;
}

const GraphView = ({ data, title = "Connection Analysis", height = "400px" }: GraphViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for a real graph visualization library
    // In a real implementation, you would use a library like vis.js, cytoscape.js, or d3.js
    const renderGraph = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      container.innerHTML = "";
      
      // Mock visualization - In reality, you'd initialize your graph library here
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
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(20, 184, 166, 0.6)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"></circle><circle cx="19" cy="11" r="2"></circle><circle cx="5" cy="11" r="2"></circle><circle cx="12" cy="19" r="2"></circle><line x1="12" y1="7" x2="12" y2="17"></line><line x1="7" y1="11" x2="17" y2="11"></line><line x1="14" y1="7" x2="17" y2="9"></line><line x1="10" y1="7" x2="7" y2="9"></line><line x1="14" y1="17" x2="17" y2="13"></line><line x1="10" y1="17" x2="7" y2="13"></line></svg>`;
      mockElement.appendChild(icon);
      
      const text = document.createElement("p");
      text.textContent = `Network graph with ${data.nodes.length} nodes and ${data.edges.length} connections`;
      text.style.margin = "1rem 0 0";
      text.style.color = "rgba(20, 184, 166, 0.8)";
      mockElement.appendChild(text);
      
      container.appendChild(mockElement);
    };

    renderGraph();
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Network className="mr-2 h-5 w-5 text-primary" />
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

export default GraphView;
