export interface MedicationEntry {
  id: string;
  clientId: string;
  babyId: string;
  administeredAt: string;
  name: string;
  doseAmount: number | null;
  doseUnit: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationDto {
  administeredAt: string;
  name: string;
  doseAmount?: number | null;
  doseUnit?: string | null;
  notes?: string | null;
}

export interface UpdateMedicationDto extends CreateMedicationDto {}
