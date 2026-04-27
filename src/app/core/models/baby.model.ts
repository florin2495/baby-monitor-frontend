export type Sex = 'Unknown' | 'Male' | 'Female';

export interface Baby {
  id: string;
  clientId: string;
  name: string;
  dateOfBirth: string;       // ISO DateOnly string "YYYY-MM-DD"
  sex: Sex;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBabyDto {
  name: string;
  dateOfBirth: string;
  sex?: Sex;
  notes?: string | null;
}

export interface UpdateBabyDto {
  name: string;
  dateOfBirth: string;
  sex?: Sex;
  notes?: string | null;
}
