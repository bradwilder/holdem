import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { CurrentPlayerService } from '../current-player.service';

@Component
({
	selector: 'app-login',
	templateUrl: './login.component.html'
})
export class LoginComponent
{
	constructor(private activeModal: NgbActiveModal, private currentPlayerService: CurrentPlayerService) {}
	
	onSubmit(form: NgForm)
	{
		this.currentPlayerService.login(form.value.name);
		
		this.activeModal.dismiss();
	}
}

@Component
({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html'
})
export class LoginModalComponent
{
	constructor(private modalService: NgbModal) {}
	
	open()
	{
		this.modalService.open(LoginComponent);
	}
}
