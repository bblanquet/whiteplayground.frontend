import { h, Component } from 'preact';

export default class Btn extends Component<{ onClick: () => void }, any> {
	render() {
		return (
			<button
				class="btn btn-primary"
				onClick={() => {
					this.props.onClick();
				}}
			>
				{this.props.children}
			</button>
		);
	}
}
