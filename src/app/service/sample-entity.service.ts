import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SampleEntity } from '../dto/sample-entity.model';
@Injectable({
  providedIn: 'root'
})
export class SampleEntityService {

  private apiUrl = '/api/sample-entities';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SampleEntity[]> {
    return this.http.get<SampleEntity[]>(this.apiUrl);
  }

  getById(id: string): Observable<SampleEntity> {
    return this.http.get<SampleEntity>(`${this.apiUrl}/${id}`);
  }

  create(entity: SampleEntity): Observable<SampleEntity> {
    return this.http.post<SampleEntity>(this.apiUrl, entity);
  }

  update(id: string, entity: SampleEntity): Observable<SampleEntity> {
    return this.http.put<SampleEntity>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
