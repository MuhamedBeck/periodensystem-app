import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IElement } from '../models/element.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ElementService {

  private apiUrl = this.getApiUrl();

  constructor(private http: HttpClient) { }

  private getApiUrl(): string {
    // In Production: Render URL, sonst localhost
    const isProduction = window.location.hostname !== 'localhost';
    return isProduction
      ? 'https://periodensystem-backend.onrender.com/api/elements'
      : 'http://localhost:3000/api/elements';
  }

  getAllElements(): Observable<IElement[]> {
    return this.http.get<IElement[]>(this.apiUrl);
  }

  updateElement(ordnungszahl: number, elementData: IElement): Observable<IElement> {
    return this.http.put<IElement>(`${this.apiUrl}/${ordnungszahl}`, elementData);
  }
}