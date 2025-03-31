
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Eye, FileText, FolderPlus, Network, Plus, Search } from "lucide-react";
import GraphView from "@/components/ui/GraphView";
import { Case, GraphData } from "@/types";

const Cases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // Mock data
  const cases: Case[] = [
    {
      id: "1",
      title: "Downtown Theft Series",
      description: "Series of retail thefts in downtown area",
      status: "open",
      priority: "high",
      assignedTo: "Detective Johnson",
      createdAt: new Date(2023, 5, 10),
    },
    {
      id: "2",
      title: "Westside Burglaries",
      description: "Residential burglaries in the westside neighborhood",
      status: "under-investigation",
      priority: "medium",
      assignedTo: "Detective Smith",
      createdAt: new Date(2023, 5, 15),
    },
    {
      id: "3",
      title: "Mall Shoplifting Ring",
      description: "Organized shoplifting at Central Mall",
      status: "open",
      priority: "high",
      assignedTo: "Detective Williams",
      createdAt: new Date(2023, 5, 20),
    },
    {
      id: "4",
      title: "Vehicle Break-ins",
      description: "Series of vehicle break-ins in parking garages",
      status: "under-investigation",
      priority: "medium",
      assignedTo: "Detective Johnson",
      createdAt: new Date(2023, 5, 25),
    },
    {
      id: "5",
      title: "Park Vandalism",
      description: "Vandalism at multiple city parks",
      status: "closed",
      priority: "low",
      assignedTo: "Detective Davis",
      createdAt: new Date(2023, 5, 30),
    },
  ];

  // Mock graph data for a selected case
  const caseGraphData: Record<string, GraphData> = {
    "1": {
      nodes: [
        { id: "c1", label: "Downtown Theft Series", type: "case", data: { id: "1" } },
        { id: "i1", label: "Theft at Main St Store", type: "incident", data: { id: "i1" } },
        { id: "i2", label: "Theft at Oak Ave Shop", type: "incident", data: { id: "i2" } },
        { id: "p1", label: "John Doe", type: "person", data: { id: "p1" } },
        { id: "p2", label: "Jane Smith", type: "person", data: { id: "p2" } },
        { id: "v1", label: "ABC-123", type: "vehicle", data: { id: "v1" } },
      ],
      edges: [
        { id: "e1", source: "i1", target: "c1", label: "part of" },
        { id: "e2", source: "i2", target: "c1", label: "part of" },
        { id: "e3", source: "p1", target: "i1", label: "involved in" },
        { id: "e4", source: "p2", target: "i2", label: "involved in" },
        { id: "e5", source: "p1", target: "i2", label: "involved in" },
        { id: "e6", source: "v1", target: "p1", label: "associated with" },
      ],
    },
  };

  const handleCaseSelect = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setGraphData(caseGraphData[caseItem.id] || { nodes: [], edges: [] });
  };

  const filteredCases = cases.filter((caseItem) => {
    // Apply text search
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;
    
    // Apply priority filter
    const matchesPriority = priorityFilter === "all" || caseItem.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Open</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Closed</Badge>;
      case "under-investigation":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Under Investigation</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
            <p className="text-muted-foreground">
              Manage and explore case files and connected incidents
            </p>
          </div>
          <div>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Case Management
                </CardTitle>
                <CardDescription>
                  View and manage all cases in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 mb-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search cases..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="under-investigation">Under Investigation</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCases.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No cases found matching the criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCases.map((caseItem) => (
                          <TableRow key={caseItem.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleCaseSelect(caseItem)}>
                            <TableCell className="font-medium">{caseItem.title}</TableCell>
                            <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                            <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                            <TableCell>{caseItem.assignedTo}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View case</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-1/3">
            {selectedCase ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Case Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedCase.title}</h3>
                    <div className="flex gap-2 mt-1">
                      {getStatusBadge(selectedCase.status)}
                      {getPriorityBadge(selectedCase.priority)}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                    <p>{selectedCase.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Assigned To</h4>
                    <p>{selectedCase.assignedTo}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                    <p>{selectedCase.createdAt?.toLocaleDateString()}</p>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Connected Incidents</h4>
                    <div className="space-y-2">
                      <div className="rounded-md border p-2 text-sm">
                        <div className="font-medium">Theft at Main St Store</div>
                        <div className="text-muted-foreground">July 10, 2023</div>
                      </div>
                      <div className="rounded-md border p-2 text-sm">
                        <div className="font-medium">Theft at Oak Ave Shop</div>
                        <div className="text-muted-foreground">July 12, 2023</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex gap-2">
                    <Button size="sm">Update Status</Button>
                    <Button size="sm" variant="outline">Add Incident</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Case Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-80 text-center space-y-4">
                  <FileText className="h-16 w-16 text-muted" />
                  <div>
                    <p className="font-medium">No case selected</p>
                    <p className="text-sm text-muted-foreground">
                      Click on a case to view its details
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {selectedCase && (
          <Tabs defaultValue="graph" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="graph" className="flex items-center">
                <Network className="mr-2 h-4 w-4" />
                Connection Graph
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Incident Timeline
              </TabsTrigger>
            </TabsList>
            <TabsContent value="graph" className="mt-0">
              <GraphView 
                data={graphData} 
                title={`Connection Analysis: ${selectedCase.title}`} 
                height="400px" 
              />
            </TabsContent>
            <TabsContent value="timeline" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-medium">
                    <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
                    Incident Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                        <div className="w-0.5 h-full bg-border"></div>
                      </div>
                      <div className="pb-8">
                        <p className="text-sm text-muted-foreground">July 10, 2023</p>
                        <h4 className="text-base font-medium">Theft at Main St Store</h4>
                        <p className="text-sm mt-1">Two individuals took merchandise from electronics section</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                        <div className="w-0.5 h-full bg-border"></div>
                      </div>
                      <div className="pb-8">
                        <p className="text-sm text-muted-foreground">July 12, 2023</p>
                        <h4 className="text-base font-medium">Theft at Oak Ave Shop</h4>
                        <p className="text-sm mt-1">Similar theft pattern observed at another store</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                        <div className="w-0.5 h-full bg-border"></div>
                      </div>
                      <div className="pb-8">
                        <p className="text-sm text-muted-foreground">July 15, 2023</p>
                        <h4 className="text-base font-medium">Suspect Identified</h4>
                        <p className="text-sm mt-1">John Doe identified from security footage</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">July 18, 2023</p>
                        <h4 className="text-base font-medium">Case Updates</h4>
                        <p className="text-sm mt-1">Investigation ongoing, additional evidence collected</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Cases;
