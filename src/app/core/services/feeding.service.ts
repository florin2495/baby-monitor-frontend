import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedingEntry, CreateFeedingDto, UpdateFeedingDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedingService {
  private readonly http = inject(HttpClient);

  private url(babyId: string) {
    return `${environment.apiUrl}/babies/${babyId}/feedings`;
  }

  getAll(babyId: string): Observable<FeedingEntry[]> {
    return this.http.get<FeedingEntry[]>(this.url(babyId));
  }

  getById(babyId: string, id: string): Observable<FeedingEntry> {
    return this.http.get<FeedingEntry>(`${this.url(babyId)}/${id}`);
  }

  create(babyId: string, dto: CreateFeedingDto): Observable<FeedingEntry> {
    return this.http.post<FeedingEntry>(this.url(babyId), dto);
  }

  update(babyId: string, id: string, dto: UpdateFeedingDto): Observable<FeedingEntry> {
    return this.http.put<FeedingEntry>(`${this.url(babyId)}/${id}`, dto);
  }

  delete(babyId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.url(babyId)}/${id}`);
  }
}
