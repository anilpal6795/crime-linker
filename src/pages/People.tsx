
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, FileText, Network, Plus, Search, User, Users } from "lucide-react";
import { Person } from "@/types";
import GraphView from "@/components/ui/GraphView";
import { GET_PEOPLE, SEARCH_PEOPLE, GET_PERSON_CONNECTIONS, UPDATE_PERSON } from "@/lib/graphql-queries";
import { useToast } from "@/components/ui/use-toast";

const People = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personFilter, setPersonFilter] = useState("all");

  // Query for all people
  const { data: peopleData, loading: peopleLoading, refetch } = useQuery(GET_PEOPLE, {
    variables: { 
      isPersonOfInterest: personFilter === "poi" ? true : 
                         personFilter === "non-poi" ? false : undefined 
    }
  });

  // Query for searching people
  const { data: searchData, loading: searchLoading } = useQuery(SEARCH_PEOPLE, {
    variables: { searchTerm },
    skip: !searchTerm, // Skip this query if searchTerm is empty
  });

  // Query for person connections
  const { data: graphData } = useQuery(GET_PERSON_CONNECTIONS, {
    variables: { personId: selectedPerson?.id || "" },
    skip: !selectedPerson,
  });

  // Mutation for updating a person
  const [updatePerson] = useMutation(UPDATE_PERSON, {
    onCompleted: () => {
      toast({
        title: "Person updated",
        description: "The person's details have been updated successfully.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error updating person",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Determine which people data to show based on search or filter
  const people = searchTerm ? searchData?.searchPeople || [] : peopleData?.people || [];
  const isLoading = peopleLoading || searchLoading;

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const togglePersonOfInterestStatus = (person: Person) => {
    updatePerson({
      variables: {
        id: person.id,
        isPersonOfInterest: !person.isPersonOfInterest,
      }
    });
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">People</h1>
            <p className="text-muted-foreground">
              Manage and explore people profiles and their connections
            </p>
          </div>
          <div>
            <Button>
              <User className="mr-2 h-4 w-4" />
              Add Person
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  People Database
                </CardTitle>
                <CardDescription>
                  View and manage all people in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 mb-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or alias..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Tabs value={personFilter} onValueChange={setPersonFilter} className="w-[240px]">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="poi">POI</TabsTrigger>
                        <TabsTrigger value="non-poi">Non-POI</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age/Gender</TableHead>
                        <TableHead>Physical Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(3).fill(0).map((_, index) => (
                          <TableRow key={`loading-${index}`}>
                            <TableCell colSpan={5}>
                              <div className="h-4 w-3/4 rounded bg-muted animate-pulse-slow" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : people.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No people found matching the criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        people.map((person) => (
                          <TableRow key={person.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handlePersonSelect(person)}>
                            <TableCell>
                              <div className="font-medium">{person.firstName} {person.lastName}</div>
                              {person.alias && <div className="text-xs text-muted-foreground">Alias: {person.alias}</div>}
                            </TableCell>
                            <TableCell>
                              <div>{person.age || "N/A"} yrs</div>
                              <div className="text-xs text-muted-foreground capitalize">{person.gender?.toLowerCase() || "Unknown"}</div>
                            </TableCell>
                            <TableCell>
                              <div>{person.ethnicity || "Unknown"}, {person.build || "Unknown"}</div>
                              <div className="text-xs text-muted-foreground">{person.height || "Unknown"}</div>
                            </TableCell>
                            <TableCell>
                              {person.isPersonOfInterest ? (
                                <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                                  Person of Interest
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                  Witness/Victim
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View profile</span>
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
            {selectedPerson ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Person Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedPerson.firstName} {selectedPerson.lastName}</h3>
                    {selectedPerson.alias && (
                      <p className="text-sm text-muted-foreground">Alias: {selectedPerson.alias}</p>
                    )}
                    <div className="mt-1">
                      {selectedPerson.isPersonOfInterest ? (
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                          Person of Interest
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          Witness/Victim
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Age</h4>
                      <p>{selectedPerson.age || "Unknown"} years</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Gender</h4>
                      <p className="capitalize">{selectedPerson.gender?.toLowerCase() || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Ethnicity</h4>
                      <p>{selectedPerson.ethnicity || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Height</h4>
                      <p>{selectedPerson.height || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Build</h4>
                      <p>{selectedPerson.build || "Unknown"}</p>
                    </div>
                  </div>
                  
                  {selectedPerson.distinguishingFeatures && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Distinguishing Features</h4>
                      <p>{selectedPerson.distinguishingFeatures}</p>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Connected Incidents</h4>
                    <div className="space-y-2">
                      {/* In a full implementation, this would show data from person.incidents */}
                      <div className="text-center text-muted-foreground py-2">
                        No connected incidents found.
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex gap-2">
                    <Button size="sm">Update Profile</Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => togglePersonOfInterestStatus(selectedPerson)}
                    >
                      {selectedPerson.isPersonOfInterest ? "Remove POI Status" : "Mark as POI"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Person Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-80 text-center space-y-4">
                  <User className="h-16 w-16 text-muted" />
                  <div>
                    <p className="font-medium">No person selected</p>
                    <p className="text-sm text-muted-foreground">
                      Click on a person to view their profile
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {selectedPerson && graphData?.personConnections && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <Network className="mr-2 h-5 w-5 text-primary" />
                Connection Analysis: {selectedPerson.firstName} {selectedPerson.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GraphView 
                data={graphData.personConnections} 
                height="400px" 
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default People;
