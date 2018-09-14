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
import { PlayerComponent } from './table/player/player.component';
import { BoardComponent } from './table/board/board.component';
import { PlayerActionComponent } from './table/player/player-action/player-action.component';
import { CurrentPlayerService } from './current-player.service';
import { MenuComponent } from './menu/menu.component';
import { MenuService } from './menu/menu.service';
import { LobbyService } from './lobby/lobby.service';

@NgModule
({
	declarations:
	[
		AppComponent,
		LobbyComponent,
		RoomComponent,
		TableComponent,
		PlayerComponent,
		BoardComponent,
		PlayerActionComponent,
		MenuComponent
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
		SocketService,
		CurrentPlayerService,
		MenuService,
		LobbyService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
