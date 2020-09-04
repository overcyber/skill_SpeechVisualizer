$(function () {
	let topics = [
		'hermes/tts/say'
	]

	function onConnect() {
		for (const topic of topics) {
			MQTT.subscribe(topic);
		}
	}

	function onMessage(msg) {
		if (!topics.includes(msg.topic) || !msg.payloadString) {
			return;
		}
		//msg to json, get 'text'
		let json = JSON.parse(msg.payloadString);
		if (msg.destinationName == 'hermes/tts/say') {
			$('#SV_ASRcontentOutput')[0].innerHTML = json['text'];
		}
	}

	mqttRegisterSelf(onConnect, 'onConnect');
	mqttRegisterSelf(onMessage, 'onMessage');
});
