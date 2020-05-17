from core.base.model.AliceSkill import AliceSkill


class SpeechVisualizer(AliceSkill):

	def __init__(self):
		super().__init__()


		if not lastScore \
				or biggerIsBetter and score > int(lastScore['score']) \
				or not biggerIsBetter and score < int(lastScore['score']):
			return True
		else:
			return False
