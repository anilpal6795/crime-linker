
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Incident } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { GET_RECENT_INCIDENTS } from "@/lib/graphql-queries";

interface RecentIncidentsProps {
  incidents?: Incident[];
  loading?: boolean;
  limit?: number;
}

const RecentIncidents = ({ incidents = [], loading: propLoading = false, limit = 5 }: RecentIncidentsProps) => {
  // If incidents are passed as props, use them; otherwise fetch from the server
  const { data, loading: queryLoading } = useQuery(GET_RECENT_INCIDENTS, {
    variables: { limit },
    skip: incidents.length > 0,  // Skip query if incidents are provided as props
  });

  const isLoading = propLoading || queryLoading;
  const displayIncidents = incidents.length > 0 ? incidents : (data?.recentIncidents || []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "THEFT":
      case "theft":
        return "bg-amber-500/10 text-amber-500";
      case "BURGLARY":
      case "burglary":
        return "bg-red-500/10 text-red-500";
      case "ASSAULT":
      case "assault":
        return "bg-red-700/10 text-red-700";
      case "VANDALISM":
      case "vandalism":
        return "bg-indigo-500/10 text-indigo-500";
      case "HARASSMENT":
      case "harassment":
        return "bg-purple-500/10 text-purple-500";
      case "FRAUD":
      case "fraud":
        return "bg-orange-500/10 text-orange-500";
      case "TRESPASSING":
      case "trespassing":
        return "bg-green-500/10 text-green-500";
      case "OTHER":
      case "other":
      case "suspicious-activity":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
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

  if (isLoading) {
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
          {displayIncidents.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No recent incidents found.
            </div>
          ) : (
            displayIncidents.map((incident) => (
              <div key={incident.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{incident.title}</h3>
                  {getStatusBadge(incident.status)}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Badge className={`mr-2 ${getEventTypeColor(incident.eventType)}`}>
                      {incident.eventType.replace("_", " ").toLowerCase()}
                    </Badge>
                  </div>
                  {incident.dateTime && (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDistanceToNow(new Date(incident.dateTime), { addSuffix: true })}
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentIncidents;
