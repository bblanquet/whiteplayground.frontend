import { h, Component } from 'preact';
import { useState } from 'preact/hooks';
import Icon from '../common/Icon';
import Line from '../common/Line';
import Switch from '../common/Switch';
import { LoginHook } from '../hook/LoginHook';
import { LoginState } from '../model/LoginState';
import { HookedComponent } from '../utils/HookedComponent';

export default class Login extends HookedComponent<{}, LoginHook, LoginState> {
	public rendering(): h.JSX.Element {
		return (
			<Switch
				isLeft={!this.hook.hasToken()}
				left={
					<form
						onSubmit={(e) => {
							e.preventDefault();
							return false;
						}}
					>
						<Line>
							<div class="col-md-4 mb-3">
								<label>Username</label>
								<input
									type="text"
									class="form-control"
									placeholder="First name"
									value={this.hook.state.username}
									onInput={(e: any) => this.hook.setUsername(e.target.value)}
									required
								/>
							</div>
							<div class="col-md-4 mb-3">
								<label>Password</label>
								<input
									type="password"
									class="form-control"
									placeholder="Last name"
									value={this.hook.state.password}
									onInput={(e: any) => this.hook.setPassword(e.target.value)}
									required
								/>
							</div>
						</Line>
						<Line>
							<button
								class="btn btn-secondary sm-m"
								onClick={(e) => {
									this.hook.signUp();
								}}
							>
								<Icon value={'fas fa-file-signature'} />
								Sign up
							</button>
							<button
								class="btn btn-primary sm-m"
								onClick={(e) => {
									this.hook.signIn();
								}}
							>
								<Icon value={'fas fa-sign-in-alt'} />
								Sign in
							</button>
						</Line>
					</form>
				}
				right={
					<div>
						<div>
							<Icon value={'fas fa-user'} /> username: {this.hook.getName()}.
						</div>
						<button
							class="btn btn-secondary sm-m"
							onClick={(e) => {
								this.hook.logOut();
							}}
						>
							<Icon value={'fas fa-sign-in-alt'} />
							Log out
						</button>
					</div>
				}
			/>
		);
	}
	public getDefaultHook(): LoginHook {
		return new LoginHook(useState(LoginHook.defaultState()));
	}
}
