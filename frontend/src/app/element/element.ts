import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-element',
  imports: [],
  templateUrl: './element.html',
  styleUrl: './element.scss'
})

export class Element {
  @Input() ordnungszahl!: number;
  @Input() symbol!: string;
  @Input() name!: string;
  @Input() kategorie?: string;
  @Input() gruppe: number | null = null;
  @Input() periode!: number;
  @Input() gruppenFarbe?: string;
  @Input() oxidationszahlen?: [number] | null;

  @Output() elementClicked = new EventEmitter<any>();

  onElementClick() {
    console.log("Element Geklickt: " + this.name)
    this.elementClicked.emit(this.ordnungszahl);
  }

}


