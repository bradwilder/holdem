import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from "./lobby/lobby/lobby.component";
import { RoomComponent } from "./room/room/room.component";

const appRoutes: Routes =
[
	{path: '', component: LobbyComponent},
	{path: 'room/:id', component: RoomComponent}
]

@NgModule
({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}