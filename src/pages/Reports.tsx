
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapView from "@/components/ui/MapView";

const Reports = () => {
  const [timeRange, setTimeRange] = useState("30days");
  const [reportType, setReportType] = useState("incidents");

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Generate insights from your crime intelligence data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Incidents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+5%</span> from previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Persons of Interest
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">57</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+12%</span> from previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Open Cases
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-rose-500">-8%</span> from previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Solved Cases Rate
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+3%</span> from previous period
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-primary" />
                Incident Type Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of incidents by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                <PieChart className="h-16 w-16 text-muted" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Incidents by Time of Day
              </CardTitle>
              <CardDescription>
                When incidents most frequently occur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                <BarChart className="h-16 w-16 text-muted" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="mr-2 h-5 w-5 text-primary" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              Map view of incident locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapView 
              locations={[
                { latitude: 34.0522, longitude: -118.2437, title: "Theft", type: "theft" },
                { latitude: 34.0622, longitude: -118.2537, title: "Burglary", type: "burglary" },
                { latitude: 34.0422, longitude: -118.2337, title: "Suspicious Activity", type: "suspicious-activity" },
                { latitude: 34.0522, longitude: -118.2637, title: "Vandalism", type: "vandalism" },
              ]} 
              height="400px" 
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="incidents" onValueChange={setReportType} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="incidents" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Incidents
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center">
              <Car className="mr-2 h-4 w-4" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center">
              <FolderOpen className="mr-2 h-4 w-4" />
              Cases
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="incidents" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Incident Analytics</CardTitle>
                <CardDescription>
                  Detailed breakdown of incidents over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                  <BarChart className="h-16 w-16 text-muted" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="people" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>People Analytics</CardTitle>
                <CardDescription>
                  Insights about people in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                  <Users className="h-16 w-16 text-muted" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vehicles" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Analytics</CardTitle>
                <CardDescription>
                  Statistics about vehicles involved in incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                  <Car className="h-16 w-16 text-muted" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cases" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Case Analytics</CardTitle>
                <CardDescription>
                  Metrics and performance of case management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                  <FolderOpen className="h-16 w-16 text-muted" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Import additional icons
import { Download, FileText, User, FolderOpen, CheckCircle, Map, Users, Car } from "lucide-react";

export default Reports;
