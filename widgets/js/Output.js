class SpeechVisualizer_Output {


	constructor(uid, widgetId) {
		this.uid = uid;
		this.widgetId = widgetId;
		this.myDiv = document.querySelector(`[data-ref="SpeechVisualizer_Output_${this.uid}"]`);
		this.topics = [
			'hermes/tts/say'
		];
		const self = this;
		setTimeout(() => {
			self.doMqtt();
		}, 1);

	}

	onConnect() {
		for (const topic of this.topics) {
			this.mqtt.subscribe(topic);
		}
		console.log('SpeechVisualizer output connected to MQTT.');
	}

	onMessage(msg) {
		if (!this.topics.includes(msg.destinationName) || !msg.payloadString) {
			return;
		}
		//msg to json, get 'text'
		let json = JSON.parse(msg.payloadString);
		if (msg.destinationName == 'hermes/tts/say') {
			this.myDiv.innerHTML = json['text'];
		}
	}

	doMqtt() {
		this.aliceSettings = JSON.parse(window.sessionStorage.aliceSettings);
		if (!this.aliceSettings['mqttHost']) {
			setTimeout(this.doMqtt, 1);
			return;
		}
		this.mqtt = new Paho.MQTT.Client(this.aliceSettings['mqttHost'], Number(this.aliceSettings['mqttPort']), `widget_${this.uid}`);
		this.mqtt.onMessageArrived = (msg) => {
			this.onMessage(msg);
		};
		this.mqtt.onConnectionFailed = this.onConnectionFailed;
		this.mqtt.connect({
			onSuccess: () => {
				this.onConnect();
			},
			onFailure: () => {
				console.log('Speech Vis couldn\'t mqtt!');
			},
			timeout  : 5
		});
	}

	onConnectionFailed() {
		console.warn('Widget failed connecting to Mqtt');
	}
}
