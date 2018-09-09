import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby/lobby.component';
import { DataService } from './data.service';
import { LobbyService } from './lobby/lobby.service';
import { HttpModule } from '@angular/http';

@NgModule
({
	declarations:
	[
		AppComponent,
		LobbyComponent
	],
	imports:
	[
		BrowserModule,
		HttpModule
	],
	providers:
	[
		DataService,
		LobbyService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
