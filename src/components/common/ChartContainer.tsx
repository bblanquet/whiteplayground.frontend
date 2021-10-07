import { Component, h } from 'preact';

export default class ChartContainer extends Component<{ canvas: HTMLCanvasElement; height: number }, {}> {
	private _container: HTMLDivElement;
	constructor() {
		super();
	}

	componentDidMount() {
		this.Inject();
	}

	componentDidUpdate() {
		this.Inject();
	}

	private Inject() {
		if (this._container && this.props.canvas) {
			this._container.innerHTML = '';
			this._container.appendChild(this.props.canvas);
		}
	}

	render() {
		return (
			<div
				style={`width:100%;height:${this.props.height !== null ? `${this.props.height}vh` : '100%'};`}
				ref={(e) => {
					this._container = e as HTMLDivElement;
				}}
			/>
		);
	}
}
