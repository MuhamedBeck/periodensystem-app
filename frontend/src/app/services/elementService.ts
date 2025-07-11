import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IElement } from '../models/element.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ElementService {
  private apiUrl = 'http://localhost:3000/api/elements';

  constructor(private http: HttpClient) { }

  getAllElements(): Observable<IElement[]> {
    return this.http.get<IElement[]>(this.apiUrl);
  }

  updateElement(ordnungszahl: number, elementData: IElement): Observable<IElement> {
    return this.http.put<IElement>(`${this.apiUrl}/${ordnungszahl}`, elementData);
  }
}
