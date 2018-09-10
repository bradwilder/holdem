import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby/lobby.component';
import { DataService } from './data.service';
import { HttpModule } from '@angular/http';
import { RoomComponent } from './room/room/room.component';
import { TableComponent } from './table/table/table.component';
import { SocketService } from './socket.service';

@NgModule
({
	declarations:
	[
		AppComponent,
		LobbyComponent,
		RoomComponent,
		TableComponent
	],
	imports:
	[
		BrowserModule,
		HttpModule,
		AppRoutingModule
	],
	providers:
	[
		DataService,
		SocketService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
