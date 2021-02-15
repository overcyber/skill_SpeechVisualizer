class SpeechVisualizer_Input extends Widget {

	constructor(uid, widgetId) {
		super(uid, widgetId);
		this.topics = [
			'hermes/asr/partialTextCaptured',
			'hermes/asr/textCaptured',
			'hermes/nlu/intentParsed',
			'hermes/asr/stopListening',
			'hermes/asr/startListening'
		];
		this.subscribe(this.topics, this.onMessage);
	}

	onMessage(msg) {
		if (!msg.payloadString) {
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
}
