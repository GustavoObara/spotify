import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-artista-imagem',
  templateUrl: './artista-imagem.component.html',
  styleUrls: ['./artista-imagem.component.scss']
})
export class ArtistaImagemComponent implements OnInit {
  
  @Input()
  imagemSrc = '';

  @Output()
  click = new EventEmitter<void>();

  constructor(){ }

  ngOnInit(): void {
    
  }

  onClick() {
    this.click.emit();
  }
}
