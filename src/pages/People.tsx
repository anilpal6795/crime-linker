
import { useState } from "react";
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

const People = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personFilter, setPersonFilter] = useState("all");

  // Mock data
  const people: Person[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      alias: "Johnny",
      gender: "male",
      age: 32,
      ethnicity: "Caucasian",
      height: "5'10\"",
      build: "Medium",
      distinguishingFeatures: "Tattoo on right arm",
      isPersonOfInterest: true,
      createdAt: new Date(2023, 5, 10),
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      gender: "female",
      age: 28,
      ethnicity: "African American",
      height: "5'6\"",
      build: "Slim",
      isPersonOfInterest: true,
      createdAt: new Date(2023, 5, 12),
    },
    {
      id: "3",
      firstName: "Michael",
      lastName: "Johnson",
      gender: "male",
      age: 42,
      ethnicity: "Hispanic",
      height: "6'0\"",
      build: "Athletic",
      distinguishingFeatures: "Scar on cheek",
      isPersonOfInterest: false,
      createdAt: new Date(2023, 5, 15),
    },
    {
      id: "4",
      firstName: "Sarah",
      lastName: "Williams",
      gender: "female",
      age: 35,
      ethnicity: "Asian",
      height: "5'4\"",
      build: "Slim",
      isPersonOfInterest: false,
      createdAt: new Date(2023, 5, 18),
    },
    {
      id: "5",
      firstName: "Robert",
      lastName: "Davis",
      alias: "Bobby",
      gender: "male",
      age: 45,
      ethnicity: "Caucasian",
      height: "5'11\"",
      build: "Heavy",
      distinguishingFeatures: "Full sleeve tattoos on both arms",
      isPersonOfInterest: true,
      createdAt: new Date(2023, 5, 20),
    },
  ];

  // Mock connection data for a person
  const personConnections = {
    "1": {
      nodes: [
        { id: "p1", label: "John Doe", type: "person", data: { id: "1" } },
        { id: "i1", label: "Theft at Main St Store", type: "incident", data: { id: "i1" } },
        { id: "i2", label: "Theft at Oak Ave Shop", type: "incident", data: { id: "i2" } },
        { id: "v1", label: "ABC-123", type: "vehicle", data: { id: "v1" } },
        { id: "p2", label: "Jane Smith", type: "person", data: { id: "2" } },
      ],
      edges: [
        { id: "e1", source: "p1", target: "i1", label: "involved in" },
        { id: "e2", source: "p1", target: "i2", label: "involved in" },
        { id: "e3", source: "p1", target: "v1", label: "associated with" },
        { id: "e4", source: "p1", target: "p2", label: "associated with" },
        { id: "e5", source: "p2", target: "i2", label: "involved in" },
      ],
    }
  };

  const filteredPeople = people.filter((person) => {
    // Apply text search
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          (person.alias?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Apply person of interest filter
    const matchesFilter = personFilter === "all" || 
                         (personFilter === "poi" && person.isPersonOfInterest) || 
                         (personFilter === "non-poi" && !person.isPersonOfInterest);
    
    return matchesSearch && matchesFilter;
  });

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
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
                      {filteredPeople.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No people found matching the criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPeople.map((person) => (
                          <TableRow key={person.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handlePersonSelect(person)}>
                            <TableCell>
                              <div className="font-medium">{person.firstName} {person.lastName}</div>
                              {person.alias && <div className="text-xs text-muted-foreground">Alias: {person.alias}</div>}
                            </TableCell>
                            <TableCell>
                              <div>{person.age} yrs</div>
                              <div className="text-xs text-muted-foreground capitalize">{person.gender}</div>
                            </TableCell>
                            <TableCell>
                              <div>{person.ethnicity}, {person.build}</div>
                              <div className="text-xs text-muted-foreground">{person.height}</div>
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
                      <p>{selectedPerson.age} years</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Gender</h4>
                      <p className="capitalize">{selectedPerson.gender}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Ethnicity</h4>
                      <p>{selectedPerson.ethnicity}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Height</h4>
                      <p>{selectedPerson.height}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Build</h4>
                      <p>{selectedPerson.build}</p>
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
                    <Button size="sm">Update Profile</Button>
                    <Button size="sm" variant="outline">
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

        {selectedPerson && personConnections[selectedPerson.id] && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <Network className="mr-2 h-5 w-5 text-primary" />
                Connection Analysis: {selectedPerson.firstName} {selectedPerson.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GraphView 
                data={personConnections[selectedPerson.id]} 
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
