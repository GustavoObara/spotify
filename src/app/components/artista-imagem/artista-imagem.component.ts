import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-artista-imagem',
  templateUrl: './artista-imagem.component.html',
  styleUrls: ['./artista-imagem.component.scss']
})
export class ArtistaImagemComponent implements OnInit {
  darkMode: boolean;
  @Input()
  imagemSrc = '';

  @Output()
  click = new EventEmitter<void>();

  constructor(){ }

  ngOnInit(): void {
    const storedDarkMode = localStorage.getItem('darkMode');
    this.darkMode = storedDarkMode === 'true';
    
    if (this.darkMode) {
      document.querySelectorAll('*').forEach(element => {
        element.classList.add('dark-mode'); 
      });
    } else {
      document.querySelectorAll('*').forEach(element => {
        element.classList.remove('dark-mode');
      });
    }
  }

  onClick() {
    this.click.emit();
  }
}
