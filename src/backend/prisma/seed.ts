
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed People
  const john = await prisma.person.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      alias: 'Johnny',
      gender: 'MALE',
      age: 32,
      ethnicity: 'Caucasian',
      height: '5\'10"',
      build: 'Medium',
      distinguishingFeatures: 'Tattoo on right arm',
      isPersonOfInterest: true,
    },
  });

  const jane = await prisma.person.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      gender: 'FEMALE',
      age: 28,
      ethnicity: 'African American',
      height: '5\'6"',
      build: 'Slim',
      isPersonOfInterest: true,
    },
  });

  // Seed Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      licensePlate: 'ABC123',
      state: 'CA',
      make: 'Toyota',
      model: 'Camry',
      year: 2018,
      color: 'Silver',
      isVehicleOfInterest: true,
    },
  });

  // Seed Locations
  const location1 = await prisma.location.create({
    data: {
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      latitude: 34.052235,
      longitude: -118.243683,
    },
  });

  // Seed Tags
  const tag1 = await prisma.tag.create({
    data: {
      name: 'Theft',
      color: '#FF5733',
    },
  });

  const tag2 = await prisma.tag.create({
    data: {
      name: 'Suspicious Activity',
      color: '#33A8FF',
    },
  });

  // Seed Incidents
  const incident1 = await prisma.incident.create({
    data: {
      title: 'Theft at Main St Store',
      eventType: 'THEFT',
      description: 'Suspect took items from the shelf and left without paying',
      dateTime: new Date(2023, 5, 10),
      status: 'OPEN',
      location: {
        connect: { id: location1.id },
      },
      reporter: {
        connect: { id: jane.id },
      },
    },
  });

  // Connect people to incidents
  await prisma.incidentPerson.create({
    data: {
      incidentId: incident1.id,
      personId: john.id,
    },
  });

  // Connect vehicles to incidents
  await prisma.incidentVehicle.create({
    data: {
      incidentId: incident1.id,
      vehicleId: vehicle1.id,
    },
  });

  // Connect tags to incidents
  await prisma.incidentTag.create({
    data: {
      incidentId: incident1.id,
      tagId: tag1.id,
    },
  });

  // Seed Products
  await prisma.product.create({
    data: {
      name: 'Smartphone',
      description: 'High-end smartphone',
      quantity: 1,
      value: 999.99,
      incidentId: incident1.id,
    },
  });

  // Seed Evidence
  await prisma.evidence.create({
    data: {
      name: 'Security Camera Footage',
      type: 'video',
      description: 'Footage from store security camera',
      fileUrl: 'https://example.com/footage.mp4',
      incidentId: incident1.id,
    },
  });

  // Seed Case
  const case1 = await prisma.case.create({
    data: {
      title: 'Multiple Thefts Investigation',
      description: 'Investigation into series of thefts in downtown area',
      status: 'OPEN',
      priority: 'HIGH',
    },
  });

  // Connect incidents to cases
  await prisma.caseIncident.create({
    data: {
      caseId: case1.id,
      incidentId: incident1.id,
    },
  });

  // Seed Status Updates
  await prisma.statusUpdate.create({
    data: {
      caseId: case1.id,
      message: 'Initial investigation started',
      userId: 'user-1', // In a real app, this would be an authenticated user ID
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
