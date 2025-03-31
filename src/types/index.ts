
export interface Person {
  id: string;
  firstName?: string;
  lastName?: string;
  alias?: string;
  ethnicity?: string;
  gender?: string;
  age?: number;
  height?: string;
  build?: string;
  distinguishingFeatures?: string;
  modus?: string;
  isPersonOfInterest?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  state?: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  distinguishingFeatures?: string;
  isVehicleOfInterest?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Location {
  id?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface Evidence {
  id: string;
  name: string;
  type: string;
  description?: string;
  fileUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  quantity?: number;
  value?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Incident {
  id: string;
  title: string;
  eventType: string;
  description: string;
  dateTime: Date;
  location?: Location;
  people?: Person[];
  vehicles?: Vehicle[];
  products?: Product[];
  evidence?: Evidence[];
  tags?: Tag[];
  reporterId?: string;
  reporter?: Person;
  status: 'open' | 'closed' | 'under-investigation';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  incidents?: Incident[];
  assignedTo?: string;
  status: 'open' | 'closed' | 'under-investigation';
  priority: 'low' | 'medium' | 'high';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StatusUpdate {
  id: string;
  caseId: string;
  message: string;
  userId: string;
  createdAt?: Date;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'vehicle' | 'incident' | 'case' | 'location' | 'product';
  data?: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface DashboardStat {
  title: string;
  value: number | string;
  change?: number;
  direction?: 'up' | 'down' | 'neutral';
  period?: string;
}
