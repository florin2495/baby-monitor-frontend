import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicationEntry, CreateMedicationDto, UpdateMedicationDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicationService {
  private readonly http = inject(HttpClient);

  private url(babyId: string) {
    return `${environment.apiUrl}/babies/${babyId}/medications`;
  }

  getAll(babyId: string): Observable<MedicationEntry[]> {
    return this.http.get<MedicationEntry[]>(this.url(babyId));
  }

  getById(babyId: string, id: string): Observable<MedicationEntry> {
    return this.http.get<MedicationEntry>(`${this.url(babyId)}/${id}`);
  }

  create(babyId: string, dto: CreateMedicationDto): Observable<MedicationEntry> {
    return this.http.post<MedicationEntry>(this.url(babyId), dto);
  }

  update(babyId: string, id: string, dto: UpdateMedicationDto): Observable<MedicationEntry> {
    return this.http.put<MedicationEntry>(`${this.url(babyId)}/${id}`, dto);
  }

  delete(babyId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.url(babyId)}/${id}`);
  }
}
