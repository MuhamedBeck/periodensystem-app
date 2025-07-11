import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Element } from './element/element';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
