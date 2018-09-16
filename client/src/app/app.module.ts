import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { DataService } from './data.service';
import { HttpModule } from '@angular/http';
import { RoomComponent } from './room/room.component';
import { TableComponent } from './table/table/table.component';
import { SocketService } from './socket.service';
import { PlayerComponent } from './table/player/player.component';
import { BoardComponent } from './table/board/board.component';
import { PlayerActionComponent } from './table/player/player-action/player-action.component';
import { CurrentPlayerService } from './current-player.service';
import { MenuComponent } from './menu/menu.component';
import { MenuService } from './menu/menu.service';
import { LobbyService } from './lobby/lobby.service';
import { LoginComponent, LoginModalComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PotComponent } from './table/pot/pot.component';

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
		MenuComponent,
		LoginComponent,
		LoginModalComponent,
		PotComponent
	],
	imports:
	[
		BrowserModule,
		HttpModule,
		AppRoutingModule,
		FormsModule,
		NgbModule.forRoot()
	],
	providers:
	[
		DataService,
		SocketService,
		CurrentPlayerService,
		MenuService,
		LobbyService
	],
	bootstrap: [AppComponent],
	entryComponents:
	[
		LoginComponent,
		LoginModalComponent
	]
})
export class AppModule {}
