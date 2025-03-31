import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStat, GraphData } from "@/types";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import RecentIncidents from "@/components/dashboard/RecentIncidents";
import GraphView from "@/components/ui/GraphView";
import MapView from "@/components/ui/MapView";
import { AlertTriangle, FileText, Map, Network, PieChart, Plus } from "lucide-react";
import { GET_DASHBOARD_STATS, GET_PERSON_CONNECTIONS } from "@/lib/graphql-queries";

const Index = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [mapLocations, setMapLocations] = useState<any[]>([]);

  const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_STATS);
  
  const { data: graphDataResult } = useQuery(GET_PERSON_CONNECTIONS, {
    variables: { personId: "1" },
    skip: !true,
  });

  useEffect(() => {
    if (graphDataResult?.personConnections) {
      setGraphData(graphDataResult.personConnections);
    } else {
      setGraphData({
        nodes: [
          { id: "1", label: "John Doe", type: "person", data: { id: "1" } },
          { id: "2", label: "Jane Smith", type: "person", data: { id: "2" } },
          { id: "3", label: "Shoplifting at Mall", type: "incident", data: { id: "i1" } },
          { id: "4", label: "ABC-123", type: "vehicle", data: { id: "v1" } },
          { id: "5", label: "XYZ-789", type: "vehicle", data: { id: "v2" } },
          { id: "6", label: "Downtown Theft Case", type: "case", data: { id: "c1" } },
        ],
        edges: [
          { id: "e1", source: "1", target: "3", label: "involved in" },
          { id: "e2", source: "2", target: "3", label: "involved in" },
          { id: "e3", source: "1", target: "4", label: "associated with" },
          { id: "e4", source: "2", target: "5", label: "associated with" },
          { id: "e5", source: "3", target: "6", label: "part of" },
        ],
      });
    }

    setMapLocations([
      { latitude: 34.0522, longitude: -118.2437, title: "Shoplifting", type: "theft" },
      { latitude: 34.0622, longitude: -118.2537, title: "Vehicle Break-in", type: "burglary" },
      { latitude: 34.0422, longitude: -118.2337, title: "Suspicious Activity", type: "suspicious-activity" },
      { latitude: 34.0522, longitude: -118.2637, title: "Vandalism", type: "vandalism" },
    ]);
  }, [graphDataResult]);

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of crime intelligence data and recent activities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/report-incident">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Report Incident
              </Button>
            </Link>
          </div>
        </div>

        <DashboardSummary stats={statsData?.dashboardStats || []} loading={statsLoading} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <RecentIncidents />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-primary" />
                  Incident Types
                </CardTitle>
                <CardDescription>Distribution of incident types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                  <PieChart className="h-16 w-16 text-muted" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Active Cases
                </CardTitle>
                <CardDescription>Recently updated cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Downtown Theft Case</p>
                      <p className="text-sm text-muted-foreground">Updated 2 hours ago</p>
                    </div>
                    <div className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded">
                      High
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Westside Burglaries</p>
                      <p className="text-sm text-muted-foreground">Updated 5 hours ago</p>
                    </div>
                    <div className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded">
                      Medium
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mall Shoplifting Ring</p>
                      <p className="text-sm text-muted-foreground">Updated 1 day ago</p>
                    </div>
                    <div className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded">
                      High
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="graph" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="graph" className="flex items-center">
              <Network className="mr-2 h-4 w-4" />
              Connection Graph
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <Map className="mr-2 h-4 w-4" />
              Incident Map
            </TabsTrigger>
          </TabsList>
          <TabsContent value="graph" className="mt-0">
            <GraphView data={graphData} height="500px" />
          </TabsContent>
          <TabsContent value="map" className="mt-0">
            <MapView locations={mapLocations} height="500px" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
