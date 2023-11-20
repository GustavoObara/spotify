import { Component, OnInit } from '@angular/core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { IUsuario } from 'src/app/Interfaces/IUsuario';
import { IUsuarioDetalhado } from 'src/app/Interfaces/IUsuarioDetalhado';
import { SpotifyService } from 'src/app/services/spotify.service';
import { FormControl, FormGroup } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-rodape-usuario',
  templateUrl: './rodape-usuario.component.html',
  styleUrls: ['./rodape-usuario.component.scss']
})
export class RodapeUsuarioComponent implements OnInit {
  formGroup: FormGroup | undefined;
  darkMode: boolean ;
  checked: boolean = false;
  exitIcon = faSignOutAlt;
  user: IUsuario = null;
  userDetalhado: IUsuarioDetalhado = null;

  constructor(
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
    this.user = this.spotifyService.usuario;
    this.userDetalhado = this.spotifyService.usuarioDetalhado; 

    this.formGroup = new FormGroup({
        checked: new FormControl<boolean>(false)
    });

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

    const isDarkModeClassPresent = document.body.classList.contains('dark-mode');
    if (isDarkModeClassPresent) {
      this.checked = true;
      
    }
  }

  logout() {
    this.spotifyService.logout();
  }

  visible: boolean = false;

  showDialog() {
        this.visible = true;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.querySelectorAll('*').forEach(element => {
        element.classList.add('dark-mode'); 
      });
    } else {
      document.querySelectorAll('*').forEach(element => {
        element.classList.remove('dark-mode');
      });
    }
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

}