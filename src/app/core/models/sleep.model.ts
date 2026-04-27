export interface SleepEntry {
  id: string;
  clientId: string;
  babyId: string;
  startedAt: string;
  endedAt: string | null;
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSleepDto {
  startedAt: string;
  endedAt?: string | null;
  location?: string | null;
  notes?: string | null;
}

export interface UpdateSleepDto extends CreateSleepDto {}
