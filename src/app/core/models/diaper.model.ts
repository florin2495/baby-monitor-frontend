export type DiaperType = 'Unknown' | 'Pee' | 'Poo' | 'Mixed' | 'Dry';

export interface DiaperEntry {
  id: string;
  clientId: string;
  babyId: string;
  occurredAt: string;
  type: DiaperType;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiaperDto {
  occurredAt: string;
  type?: DiaperType;
  notes?: string | null;
}

export interface UpdateDiaperDto extends CreateDiaperDto {}
