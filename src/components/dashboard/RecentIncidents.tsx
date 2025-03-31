
import { useEffect, useState } from "react";
import { Incident } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, MapPin, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentIncidentsProps {
  incidents?: Incident[];
  loading?: boolean;
}

const RecentIncidents = ({ incidents = [], loading = false }: RecentIncidentsProps) => {
  const [mockIncidents, setMockIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    if (incidents.length === 0 && !loading) {
      setMockIncidents([
        {
          id: "1",
          title: "Shoplifting at Central Mall",
          eventType: "theft",
          description: "Two individuals took merchandise from the Electronics store",
          dateTime: new Date(2023, 6, 15, 14, 30),
          status: "open",
          location: { city: "Springfield", state: "IL" },
        },
        {
          id: "2",
          title: "Vehicle Break-in at Downtown Parking",
          eventType: "burglary",
          description: "Car window smashed, items stolen from vehicle",
          dateTime: new Date(2023, 6, 14, 23, 15),
          status: "under-investigation",
          location: { city: "Springfield", state: "IL" },
        },
        {
          id: "3",
          title: "Suspicious Person Reported",
          eventType: "suspicious-activity",
          description: "Individual loitering near school grounds after hours",
          dateTime: new Date(2023, 6, 14, 19, 45),
          status: "under-investigation", 
          location: { city: "Springfield", state: "IL" },
        },
        {
          id: "4",
          title: "Vandalism at City Park",
          eventType: "vandalism",
          description: "Graffiti on playground equipment",
          dateTime: new Date(2023, 6, 13, 8, 30),
          status: "closed",
          location: { city: "Springfield", state: "IL" },
        },
      ]);
    }
  }, [incidents, loading]);

  const displayIncidents = incidents.length > 0 ? incidents : mockIncidents;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "theft":
        return "bg-amber-500/10 text-amber-500";
      case "burglary":
        return "bg-red-500/10 text-red-500";
      case "assault":
        return "bg-red-700/10 text-red-700";
      case "vandalism":
        return "bg-indigo-500/10 text-indigo-500";
      case "suspicious-activity":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-full space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse-slow" />
                  <div className="h-3 w-1/2 rounded bg-muted animate-pulse-slow" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
          Recent Incidents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayIncidents.map((incident) => (
            <div key={incident.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{incident.title}</h3>
                {getStatusBadge(incident.status)}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Badge className={`mr-2 ${getEventTypeColor(incident.eventType)}`}>
                    {incident.eventType.replace("-", " ")}
                  </Badge>
                </div>
                {incident.dateTime && (
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatDistanceToNow(incident.dateTime, { addSuffix: true })}
                  </div>
                )}
                {incident.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" />
                    {incident.location.city}, {incident.location.state}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {incident.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentIncidents;
