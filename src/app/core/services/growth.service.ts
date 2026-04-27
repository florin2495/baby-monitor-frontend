import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrowthEntry, CreateGrowthDto, UpdateGrowthDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GrowthService {
  private readonly http = inject(HttpClient);

  private url(babyId: string) {
    return `${environment.apiUrl}/babies/${babyId}/growth`;
  }

  getAll(babyId: string): Observable<GrowthEntry[]> {
    return this.http.get<GrowthEntry[]>(this.url(babyId));
  }

  getById(babyId: string, id: string): Observable<GrowthEntry> {
    return this.http.get<GrowthEntry>(`${this.url(babyId)}/${id}`);
  }

  create(babyId: string, dto: CreateGrowthDto): Observable<GrowthEntry> {
    return this.http.post<GrowthEntry>(this.url(babyId), dto);
  }

  update(babyId: string, id: string, dto: UpdateGrowthDto): Observable<GrowthEntry> {
    return this.http.put<GrowthEntry>(`${this.url(babyId)}/${id}`, dto);
  }

  delete(babyId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.url(babyId)}/${id}`);
  }
}
