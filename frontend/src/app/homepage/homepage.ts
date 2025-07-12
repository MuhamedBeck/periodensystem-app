import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Element } from '../element/element';
import { ElementService } from '../services/elementService';
import { IElement } from '../models/element.interface';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Element, CommonModule, FormsModule],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss']
})
export class Homepage {
  searchValue = '';
  selectedKategorie = 'Alle';
  kategorien: string[] = [];

  elements: IElement[] = [];
  mainElements: IElement[] = [];
  lanthanoide: IElement[] = [];
  actinoide: IElement[] = [];

  selectedElement: IElement | null = null;
  showModal = false;
  editMode = false;
  originalElement: IElement | null = null;

  isLoading = true;

  constructor(
    private router: Router,
    private elementService: ElementService
  ) {
    this.loadElements();
  }

  // Alle Elemente laden
  private loadElements(): void {
    this.isLoading = true;
    this.elementService.getAllElements().subscribe({
      next: (data: IElement[]) => {
        this.elements = data;
        this.mainElements = data.filter(el => el.gruppe !== null);
        this.lanthanoide = data.filter(el => el.ordnungszahl >= 57 && el.ordnungszahl <= 71);
        this.actinoide = data.filter(el => el.ordnungszahl >= 89 && el.ordnungszahl <= 103);
        const alleKategorien = [...new Set(data.map(el => el.kategorie_name).filter(name => !!name))];
        this.kategorien = ['Alle', ...alleKategorien];
      },
      error: (error: any) => {
        console.error('Fehler beim Laden:', error);
      },
      complete: () => {
        this.isLoading = false;
        console.log('Ladevorgang abgeschlossen');
      }
    });

  }

  // Fitlern der Elemente
  get gefilterteElements(): IElement[] {
    return this.mainElements.filter(el => {
      const kat = el.kategorie_name || '';
      const name = el.name.toLowerCase();
      const symbol = el.symbol.toLowerCase();

      const kategoriePasst = this.selectedKategorie === 'Alle' || kat === this.selectedKategorie;
      const searchValuePasst = this.searchValue === '' ||
        name.includes(this.searchValue.toLowerCase()) ||
        symbol.includes(this.searchValue.toLowerCase());

      return kategoriePasst && searchValuePasst;
    });
  }

  // Show Modal wenn ein Element gewählt wird
  onElementSelected(ordnungszahl: number): void {
    this.selectedElement = this.elements.find(el => el.ordnungszahl === ordnungszahl) || null;
    this.showModal = !!this.selectedElement;
  }

  // Close Modal
  closeModal(): void {
    this.showModal = false;
    this.selectedElement = null;
    this.editMode = false;
  }

  // Bearbeitungsmodus aktivieren
  toggleEditMode(): void {
    if (this.selectedElement) {
      this.editMode = true;
      this.originalElement = { ...this.selectedElement };
    }
  }

  // Änderungen speicheren
  saveChanges(): void {
    if (!this.selectedElement) return;

    console.log('Speichere Änderungen...');

    this.elementService.updateElement(
      this.selectedElement.ordnungszahl,
      this.selectedElement
    ).subscribe({
      next: (updatedElement) => {
        console.log('Erfolgreich gespeichert!', updatedElement);
        const index = this.elements.findIndex(
          el => el.ordnungszahl === updatedElement.ordnungszahl
        );
        if (index !== -1) {
          this.elements[index] = updatedElement;
        }
        this.editMode = false;
      },
      error: (error) => {
        console.error('Fehler beim Speichern:', error);
      }
    });
  }

  // Änderungen verwerfen
  cancelEdit(): void {
    if (this.originalElement) {
      this.selectedElement = { ...this.originalElement };
    }
    this.editMode = false;
  }

  // Die Gruppe herauslesen und die Gruppenfarbe zuweisen
  getGruppenFarbe(gruppe: number | null, ordnungszahl: number): string {
    if ([57, 71, 89, 103].includes(ordnungszahl)) return '#e0e0e0';
    if (gruppe === null) return '#e0e0e0';
    switch (gruppe) {
      case 1: return '#ff6b6b';
      case 2: return '#ffd93d';
      case 18: return '#a29bfe';
      case 17: return '#55efc4';
      case 16: return '#fdcb6e';
      case 15: return '#74b9ff';
      case 14: return '#81ecec';
      case 13: return '#00b894';
      default: return (gruppe >= 3 && gruppe <= 12) ? '#0984e3' : '#dfe6e9';
    }
  }
}
