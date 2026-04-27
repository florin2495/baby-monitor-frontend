import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SleepEntry, CreateSleepDto, UpdateSleepDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SleepService {
  private readonly http = inject(HttpClient);

  private url(babyId: string) {
    return `${environment.apiUrl}/babies/${babyId}/sleep`;
  }

  getAll(babyId: string): Observable<SleepEntry[]> {
    return this.http.get<SleepEntry[]>(this.url(babyId));
  }

  getById(babyId: string, id: string): Observable<SleepEntry> {
    return this.http.get<SleepEntry>(`${this.url(babyId)}/${id}`);
  }

  create(babyId: string, dto: CreateSleepDto): Observable<SleepEntry> {
    return this.http.post<SleepEntry>(this.url(babyId), dto);
  }

  update(babyId: string, id: string, dto: UpdateSleepDto): Observable<SleepEntry> {
    return this.http.put<SleepEntry>(`${this.url(babyId)}/${id}`, dto);
  }

  delete(babyId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.url(babyId)}/${id}`);
  }
}
