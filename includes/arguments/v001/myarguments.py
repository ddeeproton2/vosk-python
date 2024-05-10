#!/usr/bin/env python3
import argparse
import os

class MyArguments():

	def parse(self):
		from includes.files.v001.myfiles import MyFiles
		files = MyFiles()

		parser = argparse.ArgumentParser(add_help=False)
		parser.add_argument('-slv', '--speaker-list-voices', action='store_true', help='show list of voices speaker and exit')
		parser.add_argument('-sc', '--speaker-client', type=str, help='Speaker client "host:port"')
		parser.add_argument('-lsc', '--lazarus-speaker-client', type=str, help='Lazarus Speaker client "host:port"')
		parser.add_argument('-ss', '--speaker-server', type=str, help='Speaker server "host:port"')

		parser.add_argument('-mld', '--micro-list-devices', action='store_true', help='show list of audio devices and exit')
		parser.add_argument('-mlm', '--micro-list-models', action='store_true', help='show list of models and exit')
		parser.add_argument('-mdm', '--micro-download-model', action='store_true', help='no params. Download and unzip the model')
		parser.add_argument('-mdum', '--micro-download-url-model', type=str, help='url (if --micro-download-model is set)')
		parser.add_argument('-mddm', '--micro-download-destination-model', type=str, help='Destination dir (if --micro-download-model is set)')
		parser.add_argument('-mdrm', '--micro-download-remove-model', action='store_true', help='Remove model zip downloaded after extraction  (if --micro-download-model is set)')
		parser.add_argument('-pss', '--playsound-onstartspeaking', type=str, help='Play sound on start speaking')
		parser.add_argument('-pse', '--playsound-onendspeaking', type=str, help='Play sound on end speaking')
		parser.add_argument('-sv', '--speaker-voice', type=int, help='')
		parser.add_argument('-mm', '--micro-model', type=str, help='required - Path to the model')
		parser.add_argument('-md', '--micro-device', type=self.parseArguments_Int_or_str, help='optional - input device (numeric ID or substring). Specify unused channels with -1, default channel with None. Format: input, output. Exemple : None, 4')
		parser.add_argument('-ms', '--micro-samplerate', type=int, help='optional - sampling frequency rate (default 48000)')
		parser.add_argument('-pload', '--python-onload', type=str, help='Python file executed on loading (optional)')
		parser.add_argument('-plistening', '--python-onlistening', type=str, help='Python file executed on listening (optional)')
		


		self.args, remaining = parser.parse_known_args()


		if self.args.speaker_list_voices == True:
			self.args.playsound_onstartspeaking = ""
			self.args.playsound_onendspeaking = ""
			self.args.speaker_voice = 0
			print("List voices...")
			return self.args

		if self.args.micro_list_devices:
			import sounddevice as sd
			print(sd.query_devices())
			parser.exit(0)

		if self.args.micro_list_models:
			from includes.web.v001.myweb import MyWeb
			web = MyWeb()
			print("Get models from https://alphacephei.com/vosk/models")
			content = web.openURLGET("https://alphacephei.com/vosk/models")
			list_models = web.splitBetween(content, 'http', '.zip')
			for m in list_models:
				print(m)
			parser.exit(0)
		
		if self.args.micro_download_model:
			if not 'http' in self.args.micro_download_url_model:
				print("Link is required --micro-download-url-model")
				parser.exit(0)
			if self.args.micro_download_destination_model == None: 
				self.args.micro_download_destination_model = files.currentDir()

			if not files.isDir(self.args.micro_download_destination_model):
				print("Erreur --micro-download-destination-model. Le chemin du dossier est invalide.")
				parser.exit(0)
			from includes.web.v001.myweb import MyWeb
			web = MyWeb()
			web.downloadZipExtractToDir(self.args.micro_download_url_model, self.args.micro_download_destination_model, self.args.micro_download_remove_model)
			parser.exit(0)

		"""
		parser = argparse.ArgumentParser(
			description=__doc__,
			formatter_class=argparse.RawDescriptionHelpFormatter,
			parents=[parser])
		"""


		#self.args = parser.parse_args(remaining)
		#print(self.args)

		if self.args.micro_model == None:
			parser.print_help()
			print("Examples:")
			print("")
			print("--micro-list-devices")
			print("--micro-list-models")
			print("--micro-download-model --micro-download-url-model https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip --micro-download-destination-model model_dir_path --micro-download-remove-model")
			print("--micro-model model_dir_path")
			parser.exit(0)

		if not os.path.isdir(self.args.micro_model):
			print("--micro-model is not dir ["+self.args.micro_model+"]")


		if self.args.playsound_onstartspeaking != "" and not files.isFile(self.args.playsound_onstartspeaking):
			print("is not file "+self.args.playsound_onstartspeaking)
		if self.args.playsound_onendspeaking != "" and not files.isFile(self.args.playsound_onendspeaking):
			print("is not file "+self.args.playsound_onendspeaking)

		#print("playsound_onstartspeaking = "+str(self.args.playsound_onstartspeaking))
		#print("playsound_onendspeaking = "+str(self.args.playsound_onendspeaking))
		#print("speaker-voice = "+str(self.args.speaker_voice))

		return self.args

	def parseArguments_Int_or_str(self, text):
		try:
			return int(text)
		except ValueError:
			return text
