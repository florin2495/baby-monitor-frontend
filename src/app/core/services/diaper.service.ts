import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiaperEntry, CreateDiaperDto, UpdateDiaperDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DiaperService {
  private readonly http = inject(HttpClient);

  private url(babyId: string) {
    return `${environment.apiUrl}/babies/${babyId}/diapers`;
  }

  getAll(babyId: string): Observable<DiaperEntry[]> {
    return this.http.get<DiaperEntry[]>(this.url(babyId));
  }

  getById(babyId: string, id: string): Observable<DiaperEntry> {
    return this.http.get<DiaperEntry>(`${this.url(babyId)}/${id}`);
  }

  create(babyId: string, dto: CreateDiaperDto): Observable<DiaperEntry> {
    return this.http.post<DiaperEntry>(this.url(babyId), dto);
  }

  update(babyId: string, id: string, dto: UpdateDiaperDto): Observable<DiaperEntry> {
    return this.http.put<DiaperEntry>(`${this.url(babyId)}/${id}`, dto);
  }

  delete(babyId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.url(babyId)}/${id}`);
  }
}
