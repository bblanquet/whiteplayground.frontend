import { h, Component } from 'preact';

export default class CircularBtn extends Component<{ onClick: () => void; hasAnimation: boolean }, any> {
	private _btn: any;

	render() {
		return (
			<button
				class="btn btn-primary btn-circle btn-xl"
				ref={(e: any) => {
					this._btn = e;
				}}
				onClick={() => {
					this.props.onClick();
					if (this.props.hasAnimation) {
						this._btn.classList.remove('bounce');
						setTimeout(() => {
							this._btn.classList.add('bounce');
						}, 10);
					}
				}}
			>
				{this.props.children}
			</button>
		);
	}
}
