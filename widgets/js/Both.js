$(function () {
	let topics = [
		'hermes/asr/partialTextCaptured',
		'hermes/asr/textCaptured',
		'hermes/tts/say',
		'hermes/nlu/intentParsed',
		'hermes/asr/stopListening',
		'hermes/asr/startListening'
	]

	function onConnect() {
		topics.forEach(function(topic) {
			MQTT.subscribe(topic);
		});
	}

	function onMessage(msg) {
		if (!topics.includes(msg.topic) || !msg.payloadString) {
			return;
		}
		//msg to json, get 'text'
		let json = JSON.parse(msg.payloadString);
		if (msg.topic == 'hermes/asr/partialTextCaptured') {
			$('#SV_ASRcontentBoth')[0].innerHTML = json['text'] + ' ...';
			$('#SV_ASRconf')[0].innerHTML = Number.parseFloat(json['likelihood']).toPrecision(2) * 100 + '%';
		} else if (msg.topic == 'hermes/asr/textCaptured') {
			$('#SV_ASRcontentBoth')[0].innerHTML = json['text'];
			$('#SV_ASRconf')[0].innerHTML = Number.parseFloat(json['likelihood']).toPrecision(2) * 100 + '%';
		} else if (msg.topic == 'hermes/nlu/intentParsed') {
			$('#SV_NLUskill')[0].innerHTML = json['intent']['intentName'];
			$('#SV_NLUconf')[0].innerHTML = Number.parseFloat(json['intent']['confidenceScore']).toPrecision(2) * 100 + '%';
		} else if (msg.topic == 'hermes/asr/stopListening') {
			$('#SVI_ICON').attr('class', 'fas fa-microphone-slash');
		} else if (msg.topic == 'hermes/asr/startListening') {
			$('#SVI_ICON').attr('class', 'fas fa-microphone');
		} else {
			$('#SV_ASRcontentBoth')[0].innerHTML = json['text'];
		}
	}

	mqttRegisterSelf(onConnect, 'onConnect');
	mqttRegisterSelf(onMessage, 'onMessage');
});
