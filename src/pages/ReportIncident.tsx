
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import IncidentForm from "@/components/incident/IncidentForm";
import { GET_RECENT_INCIDENTS } from "@/lib/graphql-queries";

const ReportIncident = () => {
  const navigate = useNavigate();
  
  // We're fetching recent incidents to ensure the cache is populated
  // when we navigate back to the dashboard after submitting
  const { loading } = useQuery(GET_RECENT_INCIDENTS, {
    variables: { limit: 5 },
    fetchPolicy: "network-only"
  });

  return <IncidentForm loading={loading} />;
};

export default ReportIncident;
