export interface GrowthEntry {
  id: string;
  clientId: string;
  babyId: string;
  measuredAt: string;
  weightKg: number | null;
  heightCm: number | null;
  headCircumferenceCm: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGrowthDto {
  measuredAt: string;
  weightKg?: number | null;
  heightCm?: number | null;
  headCircumferenceCm?: number | null;
  notes?: string | null;
}

export interface UpdateGrowthDto extends CreateGrowthDto {}
