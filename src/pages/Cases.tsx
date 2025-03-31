
import { useState } from "react";
import { useQuery } from "@apollo/client";
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
import { GET_CASES, GET_CASE, GET_CASE_CONNECTIONS } from "@/lib/graphql-queries";

const Cases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // Query for all cases
  const { data: casesData, loading: casesLoading } = useQuery(GET_CASES, {
    variables: { 
      status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
      priority: priorityFilter !== "all" ? priorityFilter.toUpperCase() : undefined
    }
  });

  // Query for selected case details
  const { data: caseData, loading: caseLoading } = useQuery(GET_CASE, {
    variables: { id: selectedCase?.id || "" },
    skip: !selectedCase,
  });

  // Query for case connections
  const { data: connectionsData, loading: connectionsLoading } = useQuery(GET_CASE_CONNECTIONS, {
    variables: { caseId: selectedCase?.id || "" },
    skip: !selectedCase,
  });

  const handleCaseSelect = (caseItem: Case) => {
    setSelectedCase(caseItem);
  };

  // Determine which cases to display based on search term and filters
  const allCases = casesData?.cases || [];
  const filteredCases = allCases.filter((caseItem) => {
    if (searchTerm && !caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !caseItem.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
      case "high":
        return <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">High</Badge>;
      case "MEDIUM":
      case "medium":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Medium</Badge>;
      case "LOW":
      case "low":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
      case "open":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Open</Badge>;
      case "CLOSED":
      case "closed":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Closed</Badge>;
      case "UNDER_INVESTIGATION":
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
                        <SelectItem value="under_investigation">Under Investigation</SelectItem>
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
                      {casesLoading ? (
                        Array(3).fill(0).map((_, index) => (
                          <TableRow key={`loading-${index}`}>
                            <TableCell colSpan={5}>
                              <div className="h-4 w-3/4 rounded bg-muted animate-pulse-slow" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredCases.length === 0 ? (
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
                            <TableCell>{caseItem.assignedTo || "Unassigned"}</TableCell>
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
                    <p>{selectedCase.assignedTo || "Unassigned"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                    <p>{selectedCase.createdAt ? new Date(selectedCase.createdAt).toLocaleDateString() : "Unknown"}</p>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Connected Incidents</h4>
                    <div className="space-y-2">
                      {caseLoading ? (
                        <div className="text-center py-2">Loading...</div>
                      ) : caseData?.case?.incidents?.length ? (
                        caseData.case.incidents.map(incident => (
                          <div key={incident.id} className="rounded-md border p-2 text-sm">
                            <div className="font-medium">{incident.title}</div>
                            <div className="text-muted-foreground">
                              {new Date(incident.dateTime).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-2">
                          No connected incidents
                        </div>
                      )}
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
              {connectionsLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-muted-foreground">Loading graph data...</p>
                </div>
              ) : connectionsData?.caseConnections ? (
                <GraphView 
                  data={connectionsData.caseConnections} 
                  title={`Connection Analysis: ${selectedCase.title}`} 
                  height="400px" 
                />
              ) : (
                <GraphView 
                  data={{ nodes: [], edges: [] }} 
                  title={`Connection Analysis: ${selectedCase.title}`} 
                  height="400px" 
                />
              )}
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
                  {caseLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading timeline...</div>
                  ) : caseData?.case?.incidents?.length ? (
                    <div className="space-y-4">
                      {caseData.case.incidents.map((incident, index) => (
                        <div key={incident.id} className="flex">
                          <div className="flex flex-col items-center mr-4">
                            <div className="h-4 w-4 rounded-full bg-primary"></div>
                            {index < caseData.case.incidents.length - 1 && (
                              <div className="w-0.5 h-full bg-border"></div>
                            )}
                          </div>
                          <div className={index < caseData.case.incidents.length - 1 ? "pb-8" : ""}>
                            <p className="text-sm text-muted-foreground">
                              {new Date(incident.dateTime).toLocaleDateString()}
                            </p>
                            <h4 className="text-base font-medium">{incident.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No incidents available to display in the timeline
                    </div>
                  )}
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
