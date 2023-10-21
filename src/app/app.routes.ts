import { Routes } from "@angular/router";
import { AutenticadoGuard } from './guards/Autenticado.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'player',
    pathMatch: 'full'
  },
  {
    path: 'player',
    loadChildren: () => import ('./pages/player/player.module').then(x => x.PlayerModule),
    canLoad: [AutenticadoGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(x => x.LoginModule)
  }
]
