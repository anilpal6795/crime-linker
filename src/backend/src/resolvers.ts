
import { PrismaClient } from '@prisma/client';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

// Define custom scalars
const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value) {
    return value instanceof Date ? value.toISOString() : null;
  },
  parseValue(value) {
    return value ? new Date(value) : null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const jsonScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return Number(ast.value);
      case Kind.OBJECT:
        const obj = {};
        ast.fields.forEach(field => {
          obj[field.name.value] = parseLiteral(field.value);
        });
        return obj;
      case Kind.LIST:
        return ast.values.map(parseLiteral);
      default:
        return null;
    }
  },
});

// Helper function for parsing literals
function parseLiteral(ast) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value);
    case Kind.OBJECT:
      const obj = {};
      ast.fields.forEach(field => {
        obj[field.name.value] = parseLiteral(field.value);
      });
      return obj;
    case Kind.LIST:
      return ast.values.map(parseLiteral);
    default:
      return null;
  }
}

// Resolvers
export const resolvers = {
  DateTime: dateTimeScalar,
  JSON: jsonScalar,
  
  Query: {
    // Person queries
    person: async (_, { id }, { prisma }) => {
      return prisma.person.findUnique({ where: { id } });
    },
    people: async (_, { isPersonOfInterest }, { prisma }) => {
      const where = isPersonOfInterest !== undefined ? { isPersonOfInterest } : {};
      return prisma.person.findMany({ where });
    },
    searchPeople: async (_, { searchTerm }, { prisma }) => {
      const term = searchTerm.toLowerCase();
      return prisma.person.findMany({
        where: {
          OR: [
            { firstName: { contains: term, mode: 'insensitive' } },
            { lastName: { contains: term, mode: 'insensitive' } },
            { alias: { contains: term, mode: 'insensitive' } }
          ]
        }
      });
    },

    // Vehicle queries
    vehicle: async (_, { id }, { prisma }) => {
      return prisma.vehicle.findUnique({ where: { id } });
    },
    vehicles: async (_, { isVehicleOfInterest }, { prisma }) => {
      const where = isVehicleOfInterest !== undefined ? { isVehicleOfInterest } : {};
      return prisma.vehicle.findMany({ where });
    },
    searchVehicles: async (_, { searchTerm }, { prisma }) => {
      const term = searchTerm.toLowerCase();
      return prisma.vehicle.findMany({
        where: {
          OR: [
            { licensePlate: { contains: term, mode: 'insensitive' } },
            { make: { contains: term, mode: 'insensitive' } },
            { model: { contains: term, mode: 'insensitive' } }
          ]
        }
      });
    },

    // Incident queries
    incident: async (_, { id }, { prisma }) => {
      return prisma.incident.findUnique({ where: { id } });
    },
    incidents: async (_, { status, eventType }, { prisma }) => {
      const where = {};
      if (status) where.status = status;
      if (eventType) where.eventType = eventType;
      return prisma.incident.findMany({ where });
    },
    recentIncidents: async (_, { limit = 5 }, { prisma }) => {
      return prisma.incident.findMany({
        orderBy: { dateTime: 'desc' },
        take: limit
      });
    },

    // Case queries
    case: async (_, { id }, { prisma }) => {
      return prisma.case.findUnique({ where: { id } });
    },
    cases: async (_, { status, priority }, { prisma }) => {
      const where = {};
      if (status) where.status = status;
      if (priority) where.priority = priority;
      return prisma.case.findMany({ where });
    },

    // Dashboard queries
    dashboardStats: async (_, __, { prisma }) => {
      // Example implementation - in a real app, this would be more complex
      const incidentCount = await prisma.incident.count();
      const openCaseCount = await prisma.case.count({ where: { status: 'OPEN' } });
      const poiCount = await prisma.person.count({ where: { isPersonOfInterest: true } });
      
      return [
        {
          title: "Total Incidents",
          value: incidentCount.toString(),
          change: 12.3,
          direction: "up",
          period: "last month"
        },
        {
          title: "Open Cases",
          value: openCaseCount.toString(),
          change: 2.1,
          direction: "down",
          period: "last month"
        },
        {
          title: "Persons of Interest",
          value: poiCount.toString(),
          change: 5.7,
          direction: "up",
          period: "last month"
        }
      ];
    },
    
    // Graph queries - these would be more complex in a real implementation
    personConnections: async (_, { personId }, { prisma }) => {
      // Find person and their related incidents
      const person = await prisma.person.findUnique({
        where: { id: personId },
        include: {
          incidentsPeople: {
            include: {
              incident: true
            }
          }
        }
      });
      
      if (!person) {
        throw new Error('Person not found');
      }
      
      // Build graph nodes and edges
      const nodes = [];
      const edges = [];
      
      // Add person node
      const personNode = {
        id: `person-${person.id}`,
        label: `${person.firstName || ''} ${person.lastName || ''}`.trim() || 'Unknown Person',
        type: 'person',
        data: person
      };
      nodes.push(personNode);
      
      // Add incident nodes and connections
      if (person.incidentsPeople) {
        person.incidentsPeople.forEach(ip => {
          const incident = ip.incident;
          const incidentNode = {
            id: `incident-${incident.id}`,
            label: incident.title,
            type: 'incident',
            data: incident
          };
          nodes.push(incidentNode);
          
          // Add edge from person to incident
          edges.push({
            id: `edge-person-${person.id}-incident-${incident.id}`,
            source: `person-${person.id}`,
            target: `incident-${incident.id}`,
            label: 'involved in'
          });
        });
      }
      
      return { nodes, edges };
    },
    
    caseConnections: async (_, { caseId }, { prisma }) => {
      // This would be a more complex implementation in a real app
      return {
        nodes: [],
        edges: []
      };
    },
    
    incidentConnections: async (_, { incidentId }, { prisma }) => {
      // This would be a more complex implementation in a real app
      return {
        nodes: [],
        edges: []
      };
    }
  },
  
  Mutation: {
    // Person mutations
    createPerson: async (_, args, { prisma }) => {
      return prisma.person.create({ data: args });
    },
    updatePerson: async (_, { id, ...data }, { prisma }) => {
      return prisma.person.update({
        where: { id },
        data
      });
    },
    deletePerson: async (_, { id }, { prisma }) => {
      await prisma.person.delete({ where: { id } });
      return true;
    },

    // Vehicle mutations
    createVehicle: async (_, args, { prisma }) => {
      return prisma.vehicle.create({ data: args });
    },
    updateVehicle: async (_, { id, ...data }, { prisma }) => {
      return prisma.vehicle.update({
        where: { id },
        data
      });
    },
    deleteVehicle: async (_, { id }, { prisma }) => {
      await prisma.vehicle.delete({ where: { id } });
      return true;
    },

    // Incident mutations
    createIncident: async (_, { peopleIds, vehicleIds, tagIds, ...data }, { prisma }) => {
      const peopleConnect = peopleIds?.map(personId => ({ personId })) || [];
      const vehiclesConnect = vehicleIds?.map(vehicleId => ({ vehicleId })) || [];
      const tagsConnect = tagIds?.map(tagId => ({ tagId })) || [];
      
      return prisma.incident.create({
        data: {
          ...data,
          people: {
            create: peopleConnect
          },
          vehicles: {
            create: vehiclesConnect
          },
          tags: {
            create: tagsConnect
          }
        }
      });
    },
    updateIncident: async (_, { id, peopleIds, vehicleIds, tagIds, ...data }, { prisma }) => {
      // First update the incident
      const updatedIncident = await prisma.incident.update({
        where: { id },
        data: {
          ...data,
        }
      });
      
      // If people IDs are provided, update the relationships
      if (peopleIds) {
        // Delete existing relationships
        await prisma.incidentPerson.deleteMany({
          where: { incidentId: id }
        });
        
        // Create new relationships
        for (const personId of peopleIds) {
          await prisma.incidentPerson.create({
            data: { incidentId: id, personId }
          });
        }
      }
      
      // Do the same for vehicles
      if (vehicleIds) {
        await prisma.incidentVehicle.deleteMany({
          where: { incidentId: id }
        });
        
        for (const vehicleId of vehicleIds) {
          await prisma.incidentVehicle.create({
            data: { incidentId: id, vehicleId }
          });
        }
      }
      
      // And for tags
      if (tagIds) {
        await prisma.incidentTag.deleteMany({
          where: { incidentId: id }
        });
        
        for (const tagId of tagIds) {
          await prisma.incidentTag.create({
            data: { incidentId: id, tagId }
          });
        }
      }
      
      return updatedIncident;
    },
    deleteIncident: async (_, { id }, { prisma }) => {
      // Delete related records first
      await prisma.incidentPerson.deleteMany({ where: { incidentId: id } });
      await prisma.incidentVehicle.deleteMany({ where: { incidentId: id } });
      await prisma.incidentTag.deleteMany({ where: { incidentId: id } });
      await prisma.caseIncident.deleteMany({ where: { incidentId: id } });
      
      // Then delete the incident
      await prisma.incident.delete({ where: { id } });
      return true;
    },

    // Case mutations
    createCase: async (_, { incidentIds, ...data }, { prisma }) => {
      const incidentsConnect = incidentIds?.map(incidentId => ({ incidentId })) || [];
      
      return prisma.case.create({
        data: {
          ...data,
          incidents: {
            create: incidentsConnect
          }
        }
      });
    },
    updateCase: async (_, { id, incidentIds, ...data }, { prisma }) => {
      // Update case data
      const updatedCase = await prisma.case.update({
        where: { id },
        data: {
          ...data
        }
      });
      
      // If incident IDs are provided, update relationships
      if (incidentIds) {
        // Delete existing relationships
        await prisma.caseIncident.deleteMany({
          where: { caseId: id }
        });
        
        // Create new relationships
        for (const incidentId of incidentIds) {
          await prisma.caseIncident.create({
            data: { caseId: id, incidentId }
          });
        }
      }
      
      return updatedCase;
    },
    deleteCase: async (_, { id }, { prisma }) => {
      // Delete related records first
      await prisma.caseIncident.deleteMany({ where: { caseId: id } });
      await prisma.statusUpdate.deleteMany({ where: { caseId: id } });
      
      // Then delete the case
      await prisma.case.delete({ where: { id } });
      return true;
    },

    // Status update mutations
    addStatusUpdate: async (_, args, { prisma }) => {
      return prisma.statusUpdate.create({ data: args });
    }
  },
  
  // Resolver for nested fields
  Person: {
    incidents: async (parent, _, { prisma }) => {
      const incidentPersons = await prisma.incidentPerson.findMany({
        where: { personId: parent.id },
        include: { incident: true }
      });
      return incidentPersons.map(ip => ip.incident);
    }
  },
  
  Vehicle: {
    incidents: async (parent, _, { prisma }) => {
      const incidentVehicles = await prisma.incidentVehicle.findMany({
        where: { vehicleId: parent.id },
        include: { incident: true }
      });
      return incidentVehicles.map(iv => iv.incident);
    }
  },
  
  Location: {
    incidents: async (parent, _, { prisma }) => {
      return prisma.incident.findMany({
        where: { locationId: parent.id }
      });
    }
  },
  
  Evidence: {
    incident: async (parent, _, { prisma }) => {
      if (!parent.incidentId) return null;
      return prisma.incident.findUnique({
        where: { id: parent.incidentId }
      });
    }
  },
  
  Product: {
    incident: async (parent, _, { prisma }) => {
      if (!parent.incidentId) return null;
      return prisma.incident.findUnique({
        where: { id: parent.incidentId }
      });
    }
  },
  
  Tag: {
    incidents: async (parent, _, { prisma }) => {
      const incidentTags = await prisma.incidentTag.findMany({
        where: { tagId: parent.id },
        include: { incident: true }
      });
      return incidentTags.map(it => it.incident);
    }
  },
  
  Incident: {
    location: async (parent, _, { prisma }) => {
      if (!parent.locationId) return null;
      return prisma.location.findUnique({
        where: { id: parent.locationId }
      });
    },
    people: async (parent, _, { prisma }) => {
      const incidentPersons = await prisma.incidentPerson.findMany({
        where: { incidentId: parent.id },
        include: { person: true }
      });
      return incidentPersons.map(ip => ip.person);
    },
    vehicles: async (parent, _, { prisma }) => {
      const incidentVehicles = await prisma.incidentVehicle.findMany({
        where: { incidentId: parent.id },
        include: { vehicle: true }
      });
      return incidentVehicles.map(iv => iv.vehicle);
    },
    products: async (parent, _, { prisma }) => {
      return prisma.product.findMany({
        where: { incidentId: parent.id }
      });
    },
    evidence: async (parent, _, { prisma }) => {
      return prisma.evidence.findMany({
        where: { incidentId: parent.id }
      });
    },
    tags: async (parent, _, { prisma }) => {
      const incidentTags = await prisma.incidentTag.findMany({
        where: { incidentId: parent.id },
        include: { tag: true }
      });
      return incidentTags.map(it => it.tag);
    },
    reporter: async (parent, _, { prisma }) => {
      if (!parent.reporterId) return null;
      return prisma.person.findUnique({
        where: { id: parent.reporterId }
      });
    },
    cases: async (parent, _, { prisma }) => {
      const caseIncidents = await prisma.caseIncident.findMany({
        where: { incidentId: parent.id },
        include: { case: true }
      });
      return caseIncidents.map(ci => ci.case);
    }
  },
  
  Case: {
    incidents: async (parent, _, { prisma }) => {
      const caseIncidents = await prisma.caseIncident.findMany({
        where: { caseId: parent.id },
        include: { incident: true }
      });
      return caseIncidents.map(ci => ci.incident);
    },
    statusUpdates: async (parent, _, { prisma }) => {
      return prisma.statusUpdate.findMany({
        where: { caseId: parent.id },
        orderBy: { createdAt: 'desc' }
      });
    }
  },
  
  StatusUpdate: {
    case: async (parent, _, { prisma }) => {
      return prisma.case.findUnique({
        where: { id: parent.caseId }
      });
    }
  }
};
