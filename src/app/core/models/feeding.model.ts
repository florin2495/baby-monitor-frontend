export type FeedingSource =
  | 'Unknown'
  | 'LeftBreast'
  | 'RightBreast'
  | 'BothBreasts'
  | 'Bottle'
  | 'Formula'
  | 'Solid';

export interface FeedingEntry {
  id: string;
  clientId: string;
  babyId: string;
  occurredAt: string;
  source: FeedingSource;
  amountMl: number | null;
  durationMinutes: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedingDto {
  occurredAt: string;
  source?: FeedingSource;
  amountMl?: number | null;
  durationMinutes?: number | null;
  notes?: string | null;
}

export interface UpdateFeedingDto extends CreateFeedingDto {}
