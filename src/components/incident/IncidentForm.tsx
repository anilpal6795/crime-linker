
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User, Users, Car, Package, Tag, Info, Send } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const eventTypes = [
  { value: "theft", label: "Theft" },
  { value: "burglary", label: "Burglary" },
  { value: "robbery", label: "Robbery" },
  { value: "assault", label: "Assault" },
  { value: "vandalism", label: "Vandalism" },
  { value: "fraud", label: "Fraud" },
  { value: "suspicious-activity", label: "Suspicious Activity" },
  { value: "other", label: "Other" },
];

const IncidentForm = () => {
  const [activeTab, setActiveTab] = useState("event");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleNextTab = () => {
    switch (activeTab) {
      case "event":
        setActiveTab("people");
        break;
      case "people":
        setActiveTab("vehicles");
        break;
      case "vehicles":
        setActiveTab("products");
        break;
      case "products":
        setActiveTab("additional");
        break;
      case "additional":
        setActiveTab("reporter");
        break;
      case "reporter":
        handleSubmit();
        break;
    }
  };

  const handlePrevTab = () => {
    switch (activeTab) {
      case "people":
        setActiveTab("event");
        break;
      case "vehicles":
        setActiveTab("people");
        break;
      case "products":
        setActiveTab("vehicles");
        break;
      case "additional":
        setActiveTab("products");
        break;
      case "reporter":
        setActiveTab("additional");
        break;
    }
  };

  const handleSubmit = () => {
    // This would handle the form submission in a real implementation
    console.log("Form submitted");
  };

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Report New Incident</h1>
        <p className="text-muted-foreground">
          Please fill out the information about the incident. All fields marked with * are required.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="event">Event</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
          <TabsTrigger value="reporter">Reporter</TabsTrigger>
        </TabsList>

        <TabsContent value="event">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <Info className="mr-2 h-5 w-5 text-primary" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title *</Label>
                  <Input id="title" placeholder="Brief title of the incident" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-type">Event Type *</Label>
                  <Select>
                    <SelectTrigger id="event-type">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the incident"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date of Incident *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Time of Incident *</Label>
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      type="time"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input placeholder="Address" />
                  <Input placeholder="City" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-2">
                  <Input placeholder="State" />
                  <Input placeholder="Zip Code" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="people">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <Users className="mr-2 h-5 w-5 text-primary" />
                People Involved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Add person involved in the incident</h3>
                  <Button variant="outline" size="sm">
                    Add Person
                  </Button>
                </div>
                
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="First name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Last name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alias">Alias/Nickname</Label>
                        <Input id="alias" placeholder="Alias or nickname" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select>
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age (approx.)</Label>
                        <Input id="age" type="number" placeholder="Age" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ethnicity">Ethnicity</Label>
                        <Input id="ethnicity" placeholder="Ethnicity" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height</Label>
                        <Input id="height" placeholder="Height" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="build">Build</Label>
                        <Input id="build" placeholder="Physical build" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role in Incident</Label>
                        <Select>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="suspect">Suspect</SelectItem>
                            <SelectItem value="victim">Victim</SelectItem>
                            <SelectItem value="witness">Witness</SelectItem>
                            <SelectItem value="person-of-interest">Person of Interest</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="features">Distinguishing Features</Label>
                      <Textarea id="features" placeholder="Tattoos, scars, or other distinctive features" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <Car className="mr-2 h-5 w-5 text-primary" />
                Vehicles Involved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Add vehicle involved in the incident</h3>
                  <Button variant="outline" size="sm">
                    Add Vehicle
                  </Button>
                </div>
                
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="license-plate">License Plate *</Label>
                        <Input id="license-plate" placeholder="License plate number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input id="state" placeholder="State or province" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="make">Make</Label>
                        <Input id="make" placeholder="Vehicle make" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input id="model" placeholder="Vehicle model" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" type="number" placeholder="Vehicle year" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" placeholder="Vehicle color" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Vehicle Type</Label>
                        <Select>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="features">Distinguishing Features</Label>
                      <Textarea id="features" placeholder="Damage, modifications, stickers, or other distinctive features" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <Package className="mr-2 h-5 w-5 text-primary" />
                Products Involved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Add products involved in the incident (stolen, damaged, etc.)</h3>
                  <Button variant="outline" size="sm">
                    Add Product
                  </Button>
                </div>
                
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="product-name">Product Name *</Label>
                        <Input id="product-name" placeholder="Product name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" placeholder="Quantity" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Product description, serial numbers, etc." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="value">Estimated Value</Label>
                      <Input id="value" type="number" placeholder="Value in $" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <Tag className="mr-2 h-5 w-5 text-primary" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="Add tags separated by commas" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Example: theft, electronics, mall, repeat-offender
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="websites">Related Websites</Label>
                  <Input id="websites" placeholder="Add related website URLs" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any additional information that might be relevant" 
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Evidence Attachments</Label>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="evidence" className="sr-only">
                      Upload evidence files
                    </Label>
                    <Input id="evidence" type="file" multiple className="cursor-pointer" />
                    <p className="text-sm text-muted-foreground">
                      Upload photos, videos, or documents related to the incident.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporter">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <User className="mr-2 h-5 w-5 text-primary" />
                Reporter Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reporter-name">Name *</Label>
                    <Input id="reporter-name" placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reporter-id">ID/Badge Number</Label>
                    <Input id="reporter-id" placeholder="Your ID or badge number" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reporter-phone">Phone Number</Label>
                    <Input id="reporter-phone" placeholder="Your phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reporter-email">Email</Label>
                    <Input id="reporter-email" type="email" placeholder="Your email address" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reporter-role">Role/Department</Label>
                  <Input id="reporter-role" placeholder="Your role or department" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevTab}
          disabled={activeTab === "event"}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNextTab}
        >
          {activeTab === "reporter" ? (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Report
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default IncidentForm;
