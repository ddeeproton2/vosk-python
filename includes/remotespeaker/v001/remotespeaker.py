#!/usr/bin/env python3


class LazarusRemoteSpeakerClient():
	def __init__(self, web, url, voiceid = 1):
		self.web = web
		self.url = url
		self.voiceid = voiceid
		pass

	def _openurl(self, data):
		#j = self.web.json_encode(data)
		#b = self.web.b64e(j)
		text = self.web.encodeURI(data['text'])
		if self.voiceid is None:
			print("[WARNING] Voice ID is None. set the value with --speaker-voice 0. Get the value List with --speaker-list-voices on the remote speaker server")
		url = "http://"+self.url+"/?voice="+str(self.voiceid)+"&message="+text
		#print(data['text']+" >> "+url)
		self.web.openURLGET(url)

	def say(self, text, doprint = True):
		if doprint == True:
			print(text)
		self._openurl({
			"function":"parler",
			"text":text,
		})

	def saystop(self, text, doprint = True):
		if doprint == True:
			print(text)
		self._openurl({
			"function":"parlerCouperParole",
			"text":text,
		})

	def stop(self):
		self._openurl({
			"function":"stop"
		})

	def pause(self):
		self._openurl({
			"function":"pause"
		})

	def saywait(self, text, doprint = True):
		if doprint == True:
			print(text)
		self._openurl({
			"function":"parlerAttendre",
			"text":text,
		})




class RemoteSpeakerClient():
	def __init__(self, web, url):
		self.web = web
		self.url = url
		pass

	def _openurl(self, data):
		j = self.web.json_encode(data)
		b = self.web.b64e(j)
		self.web.openURLGET("http://"+self.url+"/"+b)

	def say(self, text, doprint = True):
		if doprint == True:
			print(text)
		self._openurl({
			"function":"parler",
			"text":text,
		})

	def saystop(self, text, doprint = True):
		if doprint == True:
			print(text)
		self._openurl({
			"function":"parlerCouperParole",
			"text":text,
		})

	def stop(self):
		self._openurl({
			"function":"stop"
		})

	def pause(self):
		self._openurl({
			"function":"pause"
		})

	def saywait(self, text, doprint = True):
		if doprint == True:
			print(text)
		self._openurl({
			"function":"parlerAttendre",
			"text":text,
		})


class RemoteSpeakerServer():
	def __init__(self, web, spk, translate, hostport):
		self.web = web
		self.spk = spk
		self.translate = translate
		self.hostport = hostport
		pass

	def startSpeakerServer(self):
		self.web.webserver(self.hostport, self._onrequestSpeak)

	def startTranslateServer(self):
		self.web.webserver(self.hostport, self._onrequestTranslate)

	def _onrequestTranslate(self, request):
		headers = request.split('\n')
		filename = headers[0].split(" ")[1]
		b = self.web.b64d(filename[1:])
		data = self.web.json_decode(b)
		print(data["text"])
		translatedText = self.translate.translate(data["text"], data["from"], data["to"])
		print(translatedText)
		return translatedText


	def _onrequestSpeak(self, request):
		#print("==== DEBUG =====")
		#print(request)
		#print("================")
		b = self.web.b64d(request['path'][1:])
		#print(b)
		data = self.web.json_decode(b)
		#print(data)
		if 'text' in data:
			print(data["text"])
		if data["function"] == "parler":
			self.spk.say(data["text"])
		if data["function"] == "parlerCouperParole":
			self.spk.saystop(data["text"])
		if data["function"] == "parlerAttendre":
			self.spk.saywait(data["text"])
		if data["function"] == "stop":
			self.spk.stop()
		if data["function"] == "pause":
			self.spk.pause()
		return "ok"


# TEST

