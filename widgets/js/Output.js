class SpeechVisualizer_Output extends Widget{

	constructor(uid, widgetId) {
		super(uid, widgetId);
		this.subscribe('hermes/tts/say', this.onMessage)
	}

	onMessage(msg) {
		if (!msg.payloadString) {
			return;
		}
		let json = JSON.parse(msg.payloadString);
		if (msg.destinationName == 'hermes/tts/say') {
			this.myDiv.innerHTML = json['text'];
		}
	}
}
