import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// lib
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);

// My component
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { PlayerComponent } from './player/player.component';
import { DevicesComponent } from './devices/devices.component';
import { SetupComponent } from './setup/setup.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { ProgressTimeComponent } from './progress-time/progress-time.component';
import { VolumeControlComponent } from './volume-control/volume-control.component';
import { SettingsComponent } from './settings/settings.component';

// services
import { HttpService } from './services/http.service';
import { LoggerService } from './services/logger.service';
import { StorageService } from './services/storage.service';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        AppComponent,
        LeftMenuComponent,
        PlayerComponent,
        DevicesComponent,
        SetupComponent,
        ControlPanelComponent,
        ProgressTimeComponent,
        VolumeControlComponent,
        SettingsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        NgbModule,
        FontAwesomeModule,
        HttpClientModule
    ],
    providers: [HttpService, LoggerService, StorageService],
    bootstrap: [AppComponent]
})
export class AppModule { }
