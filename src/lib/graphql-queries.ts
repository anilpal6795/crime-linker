
import { gql } from '@apollo/client';

// Dashboard Queries
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      title
      value
      change
      direction
      period
    }
  }
`;

export const GET_RECENT_INCIDENTS = gql`
  query GetRecentIncidents($limit: Int) {
    recentIncidents(limit: $limit) {
      id
      title
      eventType
      description
      dateTime
      status
      location {
        city
        state
      }
    }
  }
`;

// People Queries
export const GET_PEOPLE = gql`
  query GetPeople($isPersonOfInterest: Boolean) {
    people(isPersonOfInterest: $isPersonOfInterest) {
      id
      firstName
      lastName
      alias
      gender
      age
      ethnicity
      height
      build
      distinguishingFeatures
      isPersonOfInterest
      createdAt
    }
  }
`;

export const SEARCH_PEOPLE = gql`
  query SearchPeople($searchTerm: String!) {
    searchPeople(searchTerm: $searchTerm) {
      id
      firstName
      lastName
      alias
      gender
      age
      ethnicity
      height
      build
      distinguishingFeatures
      isPersonOfInterest
      createdAt
    }
  }
`;

export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      id
      firstName
      lastName
      alias
      gender
      age
      ethnicity
      height
      build
      distinguishingFeatures
      modus
      isPersonOfInterest
      createdAt
    }
  }
`;

export const GET_PERSON_CONNECTIONS = gql`
  query GetPersonConnections($personId: ID!) {
    personConnections(personId: $personId) {
      nodes {
        id
        label
        type
        data
      }
      edges {
        id
        source
        target
        label
      }
    }
  }
`;

// Cases Queries
export const GET_CASES = gql`
  query GetCases($status: Status, $priority: Priority) {
    cases(status: $status, priority: $priority) {
      id
      title
      description
      status
      priority
      assignedTo
      createdAt
    }
  }
`;

export const GET_CASE = gql`
  query GetCase($id: ID!) {
    case(id: $id) {
      id
      title
      description
      status
      priority
      assignedTo
      createdAt
      incidents {
        id
        title
        dateTime
      }
    }
  }
`;

export const GET_CASE_CONNECTIONS = gql`
  query GetCaseConnections($caseId: ID!) {
    caseConnections(caseId: $caseId) {
      nodes {
        id
        label
        type
        data
      }
      edges {
        id
        source
        target
        label
      }
    }
  }
`;

// Incidents Queries
export const GET_INCIDENTS = gql`
  query GetIncidents($status: Status, $eventType: EventType) {
    incidents(status: $status, eventType: $eventType) {
      id
      title
      eventType
      description
      dateTime
      status
      location {
        city
        state
      }
    }
  }
`;

export const GET_INCIDENT = gql`
  query GetIncident($id: ID!) {
    incident(id: $id) {
      id
      title
      eventType
      description
      dateTime
      status
      location {
        address
        city
        state
        zipCode
      }
      people {
        id
        firstName
        lastName
      }
      vehicles {
        id
        licensePlate
        make
        model
      }
      products {
        id
        name
        quantity
        value
      }
      evidence {
        id
        name
        type
        fileUrl
      }
      tags {
        id
        name
        color
      }
    }
  }
`;

// Mutations
export const CREATE_PERSON = gql`
  mutation CreatePerson(
    $firstName: String
    $lastName: String
    $alias: String
    $ethnicity: String
    $gender: Gender
    $age: Int
    $height: String
    $build: String
    $distinguishingFeatures: String
    $modus: String
    $isPersonOfInterest: Boolean
  ) {
    createPerson(
      firstName: $firstName
      lastName: $lastName
      alias: $alias
      ethnicity: $ethnicity
      gender: $gender
      age: $age
      height: $height
      build: $build
      distinguishingFeatures: $distinguishingFeatures
      modus: $modus
      isPersonOfInterest: $isPersonOfInterest
    ) {
      id
      firstName
      lastName
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson(
    $id: ID!
    $firstName: String
    $lastName: String
    $alias: String
    $ethnicity: String
    $gender: Gender
    $age: Int
    $height: String
    $build: String
    $distinguishingFeatures: String
    $modus: String
    $isPersonOfInterest: Boolean
  ) {
    updatePerson(
      id: $id
      firstName: $firstName
      lastName: $lastName
      alias: $alias
      ethnicity: $ethnicity
      gender: $gender
      age: $age
      height: $height
      build: $build
      distinguishingFeatures: $distinguishingFeatures
      modus: $modus
      isPersonOfInterest: $isPersonOfInterest
    ) {
      id
      firstName
      lastName
    }
  }
`;

export const CREATE_INCIDENT = gql`
  mutation CreateIncident(
    $title: String!
    $eventType: EventType!
    $description: String!
    $dateTime: DateTime!
    $locationId: ID
    $peopleIds: [ID!]
    $vehicleIds: [ID!]
    $productIds: [ID!]
    $evidenceIds: [ID!]
    $tagIds: [ID!]
    $reporterId: ID
    $status: Status!
  ) {
    createIncident(
      title: $title
      eventType: $eventType
      description: $description
      dateTime: $dateTime
      locationId: $locationId
      peopleIds: $peopleIds
      vehicleIds: $vehicleIds
      productIds: $productIds
      evidenceIds: $evidenceIds
      tagIds: $tagIds
      reporterId: $reporterId
      status: $status
    ) {
      id
      title
    }
  }
`;

export const CREATE_CASE = gql`
  mutation CreateCase(
    $title: String!
    $description: String!
    $incidentIds: [ID!]
    $assignedTo: ID
    $status: Status!
    $priority: Priority!
  ) {
    createCase(
      title: $title
      description: $description
      incidentIds: $incidentIds
      assignedTo: $assignedTo
      status: $status
      priority: $priority
    ) {
      id
      title
    }
  }
`;

export const ADD_STATUS_UPDATE = gql`
  mutation AddStatusUpdate(
    $caseId: ID!
    $message: String!
    $userId: ID!
  ) {
    addStatusUpdate(
      caseId: $caseId
      message: $message
      userId: $userId
    ) {
      id
      message
      createdAt
    }
  }
`;
