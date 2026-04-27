import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Baby, CreateBabyDto, UpdateBabyDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BabyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/babies`;

  getAll(): Observable<Baby[]> {
    return this.http.get<Baby[]>(this.baseUrl);
  }

  getById(id: string): Observable<Baby> {
    return this.http.get<Baby>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateBabyDto): Observable<Baby> {
    return this.http.post<Baby>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateBabyDto): Observable<Baby> {
    return this.http.put<Baby>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
