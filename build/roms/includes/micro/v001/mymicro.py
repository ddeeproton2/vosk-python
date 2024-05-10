#!/usr/bin/env python3
#import os
import queue
import sounddevice as sd
# Vosk documentation
# https://github.com/alphacep/vosk-api/blob/master/src/vosk_api.h#L187
# https://github.com/alphacep/vosk-api/blob/master/python/vosk/__init__.py
import vosk
import sys
import json
from vosk import Model, KaldiRecognizer, SetLogLevel
#import time

SetLogLevel(-1)



class MyMicro():
	def __init__(self, modelPath, samplerate = None, device = None):
		self.speak = []
		self.samplerate = samplerate
		self.onlisten = None
		self.onstartsuccess = None
		self.onstarterror = None
		self.rec = None
		self.q = queue.Queue()
		self.device = device

		#self.model = vosk.Model("assistant/model") #nom du dossier model
		self.model = vosk.Model(modelPath) #nom du dossier model
		try:
			device_info = sd.query_devices(self.device, 'input')
		except:
			if self.onstarterror is not None:
				self.onstarterror()
			print("Erreur de micro. Redémarrage requis.")
			sys.exit(1)
			return
 
		#time.sleep(3)
		if samplerate is None:
			if not 'default_samplerate' in device_info:
				print("Error Bad source for micro --micro-device")
				sys.exit(1)
			# soundfile expects an int, sounddevice provides a float:
			self.samplerate = int(device_info['default_samplerate'])
			
		if not samplerate is None:
			print("samplerate = "+self.samplerate)

	def reset(self):
		try:
			if self.rec:
				self.rec.Reset()
		except:
			pass

	def stop(self):
		sys.exit(0)


	def start(self):

		result = sd.RawInputStream(samplerate=self.samplerate, blocksize = 8000, device=self.device, dtype='int16', channels=1, callback=self.callback)

		self.rec = vosk.KaldiRecognizer(self.model, self.samplerate)
		# ===
		# self.rec.SetMaxAlternatives(10) 
		# affiche 
		# {'alternatives': [{'confidence': 462.947357, 'text': 'salut'}]} 
		# A la place de 
		# {'text': 'salut'}
		# ===
		self.rec.SetMaxAlternatives(20) 

		# self.rec.SetWords(True) va afficher :
		#  {'alternatives': [{'confidence': 445.617401, 'result': [{'end': 5.800771, 'start': 5.470771, 'word': 'bonjour'}], 'text': 'bonjour'}, {'confidence': 444.354492, 'text': ''}, {'confidence': 443.651093, 'result': [{'end': 5.770771, 'start': 5.500771, 'word': 'enfin'}], 'text': 'enfin'}]}
		# et
		# {'alternatives': [{'confidence': 471.96106, 'text': ''}]}
		self.rec.SetWords(False)

		if self.onstartsuccess is not None:
			self.onstartsuccess()
		return result


	def listen(self):
		try:
			while True:
				parler = self.listen_wait()
				if self.onlisten is not None:
					result = []
					for i, iString in enumerate(parler['alternatives']):
						text = parler['alternatives'][i]['text']
						if text == "":
							continue
						result.append(text)
					if len(result) != 0:		
						self.speak = result			
						arrstr = self.arr_to_str(result)
						#self.onlisten(result, arrstr, parler)
						self.onlisten(result)

			"""
				#s = parler['text']    # (or what the encoding might be …)
				#s = s.decode('latin-1')    # (or what the encoding might be …)
											# Now "s" is a unicode object.
				#s = s.encode('utf-8')      # Encode as UTF-8 string.
											# Now "s" is a str again.
				#s = urllib.parse.quote(s)       # URL encode.
											# Now "s" is encoded the way you need it.
											
				#reponse = openURL(url, {'voice': s})
			"""
			print("Programme termined")
		except KeyboardInterrupt:
			print('\nDone')
			sys.exit(0)

		except Exception as e:
			sys.exit(type(e).__name__ + ': ' + str(e))



	
	def listen_wait(self):
		result = []
		
		while True:
			try:
				data = self.q.get()
				if self.rec.AcceptWaveform(data):
					parler = json.loads(self.rec.FinalResult())
					#parler = json.loads(self.rec.Result())       
					#parler = json.loads(self.rec.PartialResult()) # {'partial': ''}
					"""

					"""
					result = []
					for i, iString in enumerate(parler['alternatives']):
						text = parler['alternatives'][i]['text']
						if text == "":
							continue
						result.append(text)
					if len(result) != 0:
						return parler


			except KeyboardInterrupt:
				print('\nDone')
				sys.exit(0)

			except Exception as e:
				sys.exit(type(e).__name__ + ': ' + str(e))


	def arr_to_str(self, speak):
		t = ""
		for s in speak:
			if t != "":
				t += ", "
			t += s
		return t

	def callback(self, indata, frames, time, status):
		"""This is called (from a separate thread) for each audio block."""
		if status:
			#print(status, file=sys.stderr)
			print("Restarting required...")
			try:
				sys.exit(0)
			except:
				print("Error, can't restart")


		self.q.put(bytes(indata))


	def models_list_online(self, displayResult = True):
		from myweb import MyWeb
		web = MyWeb()
		print("Get models from https://alphacephei.com/vosk/models")
		content = web.openURLGET("https://alphacephei.com/vosk/models")
		list_models = web.splitBetween(content, 'http', '.zip')
		if displayResult: 
			for m in list_models:
				print(m)
		return list_models
	
	def models_download_and_extract(self, url, destination = None, removeZip = True):
		from myweb import MyWeb
		web = MyWeb()
		web.downloadZipExtractToDir(url, destination, removeZip)

	def list_devices(self, displayResult = True):
		import sounddevice as sd
		res = sd.query_devices()
		if displayResult:
			print(res)
		return res
		