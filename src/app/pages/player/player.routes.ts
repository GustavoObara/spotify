import { Routes } from "@angular/router";
import { PlayerComponent } from "./player.component"
import { HomeComponent } from "../home/home.component";
import { ListaMusicasComponent } from "../lista-musicas/lista-musicas.component";
import { DashboardComponent } from "../dashboard/dashboard.component";

export const PlayerRotas: Routes = [
    {
        path: '',
        component: PlayerComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'lista/:tipo/:id',
                component: ListaMusicasComponent
            }
        ]
    }
]