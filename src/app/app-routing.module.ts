import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { DevicesComponent } from './devices/devices.component';
import { SetupComponent } from './setup/setup.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
    { path: 'player', component: PlayerComponent },
    { path: 'devices', component: DevicesComponent },
    { path: 'setup', component: SetupComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '', redirectTo: '/player', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
