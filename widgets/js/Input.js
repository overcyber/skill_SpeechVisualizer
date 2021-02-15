class SpeechVisualizer_Input {

	constructor(uid, widgetId) {
		this.uid = uid;
		this.widgetId = widgetId;
		this.myDiv = document.querySelector(`[data-ref="SpeechVisualizer_Input_${this.uid}"]`);
		this.topics = [
			'hermes/asr/partialTextCaptured',
			'hermes/asr/textCaptured',
			'hermes/nlu/intentParsed',
			'hermes/asr/stopListening',
			'hermes/asr/startListening'
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
		console.log('SpeechVisualizer input connected to MQTT.');
	}

	onMessage(msg) {
		if (!this.topics.includes(msg.destinationName) || !msg.payloadString) {
			return;
		}

		//msg to json, get 'text'
		let json = JSON.parse(msg.payloadString);
		if (msg.destinationName == 'hermes/asr/partialTextCaptured') {
			this.myDiv.querySelector('#input').innerHTML = json['text'] + ' ...';
			this.myDiv.querySelector('#SV_ASRconf').innerHTML = Number.parseFloat(json['likelihood']).toPrecision(2) * 100 + '%';
		} else if (msg.destinationName == 'hermes/asr/textCaptured') {
			this.myDiv.querySelector('#input').innerHTML = json['text'];
			this.myDiv.querySelector('#SV_ASRconf').innerHTML = Number.parseFloat(json['likelihood']).toPrecision(2) * 100 + '%';
		} else if (msg.destinationName == 'hermes/nlu/intentParsed') {
			this.myDiv.querySelector('#input').innerHTML = json['intent']['intentName'];
			this.myDiv.querySelector('#SV_NLUconf').innerHTML = Number.parseFloat(json['intent']['confidenceScore']).toPrecision(2) * 100 + '%';
		} else if (msg.destinationName == 'hermes/asr/stopListening') {
			this.myDiv.querySelector('#SVI_ICON').attr('class', 'fas fa-microphone-slash');
		} else if (msg.destinationName == 'hermes/asr/startListening') {
			this.myDiv.querySelector('#SVI_ICON').attr('class', 'fas fa-microphone');
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
