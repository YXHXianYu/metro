import React, { Component } from "react";
import SimplePanel from "./SimplePanel";
import { Row, Col, Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import Tr from "./Locale";

class PracticeTimer extends Component {
	state = {
		minutes: 5,
		secondsRemaining: 0,
		isRunning: false,
		isPaused: false
	};

	timerId = null;

	componentWillUnmount() {
		this.clearTimer();
	}

	clearTimer() {
		if (this.timerId) {
			clearInterval(this.timerId);
			this.timerId = null;
		}
	}

	tick = () => {
		const { secondsRemaining } = this.state;
		if (secondsRemaining <= 1) {
			this.clearTimer();
			this.setState({ secondsRemaining: 0, isRunning: false, isPaused: false });
			this.props.onTimeUp && this.props.onTimeUp();
			return;
		}
		this.setState({ secondsRemaining: secondsRemaining - 1 });
	};

	handleStart = () => {
		const minutes = Math.max(1, Math.min(99, parseInt(this.state.minutes, 10) || 5));
		this.setState({
			minutes,
			secondsRemaining: this.state.isRunning ? this.state.secondsRemaining : minutes * 60,
			isRunning: true,
			isPaused: false
		}, () => {
			if (this.timerId) return;
			this.timerId = setInterval(this.tick, 1000);
		});
	};

	handlePause = () => {
		this.clearTimer();
		this.setState({ isPaused: true });
	};

	handleResume = () => {
		if (!this.state.isRunning || this.state.secondsRemaining <= 0) return;
		this.timerId = setInterval(this.tick, 1000);
		this.setState({ isPaused: false });
	};

	handleReset = () => {
		this.clearTimer();
		const minutes = Math.max(1, Math.min(99, parseInt(this.state.minutes, 10) || 5));
		this.setState({
			minutes,
			secondsRemaining: minutes * 60,
			isRunning: false,
			isPaused: false
		});
	};

	onMinutesChange = (e) => {
		const v = e.target.value;
		if (v === "" || /^\d{1,2}$/.test(v)) {
			this.setState({ minutes: v === "" ? "" : parseInt(v, 10) });
		}
	};

	formatTime(seconds) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s < 10 ? "0" : ""}${s}`;
	}

	render() {
		const { minutes, secondsRemaining, isRunning, isPaused } = this.state;
		const displaySeconds = isRunning || isPaused ? secondsRemaining : (parseInt(minutes, 10) || 5) * 60;

		return (
			<SimplePanel title={Tr("Practice Timer")} className="PracticeTimer">
				<Row>
					<Col>
						<label className="mr-2">{Tr("Minutes")}</label>
						<InputGroup className="mb-2">
							<Input
								type="number"
								min={1}
								max={99}
								value={minutes === "" ? "" : minutes}
								onChange={this.onMinutesChange}
								disabled={isRunning && !isPaused}
								placeholder="5"
							/>
							<InputGroupAddon addonType="append">min</InputGroupAddon>
						</InputGroup>
					</Col>
				</Row>
				<Row>
					<Col>
						<div className="mb-2 font-weight-bold" style={{ fontSize: "1.25rem" }}>
							{this.formatTime(displaySeconds)}
						</div>
					</Col>
				</Row>
				<Row>
					<Col>
						<div className="d-flex flex-wrap">
							{!isRunning ? (
								<Button color="success" size="sm" className="mr-1 mb-1" onClick={this.handleStart}>
									{Tr("Start")}
								</Button>
							) : isPaused ? (
								<Button color="warning" size="sm" className="mr-1 mb-1" onClick={this.handleResume}>
									{Tr("Resume")}
								</Button>
							) : (
								<Button color="warning" size="sm" className="mr-1 mb-1" onClick={this.handlePause}>
									{Tr("Pause")}
								</Button>
							)}
							<Button color="secondary" size="sm" className="mb-1" onClick={this.handleReset}>
								{Tr("Reset")}
							</Button>
						</div>
					</Col>
				</Row>
			</SimplePanel>
		);
	}
}

export default PracticeTimer;
