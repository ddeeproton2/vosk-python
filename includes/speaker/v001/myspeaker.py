#!/usr/bin/env python3
import threading
import winsound
#from playsound import playsound
from time import sleep
from win32com.client import Dispatch

import pyttsx3 # Doc : https://pyttsx3.readthedocs.io/en/latest/engine.html
#import pygame # Doc : https://www.pygame.org/docs/ref/music.html#pygame.mixer.music.queue
import queue # Doc : https://docs.python.org/3/library/queue.html
import logging # Doc : https://docs.python.org/3/library/logging.html
from multiprocessing.dummy import Process as Thread


logger = logging.getLogger(__name__)
#logging.basicConfig()
#logger.setLevel(logging.DEBUG)


class MySpeaker():
	def __init__(self, playsound_onstartspeaking, playsound_onendspeaking, id_voice = None):
		if playsound_onstartspeaking is None: 
			playsound_onstartspeaking = ""
		if playsound_onendspeaking is None: 
			playsound_onendspeaking = ""
		self.id_voice = id_voice
		self.voicebox = VoiceBox(playsound_onstartspeaking, playsound_onendspeaking, id_voice)
		self.tspeak = None
		self.onstart = playsound_onstartspeaking
		self.onend = playsound_onendspeaking

	def say(self, text, doprint = True):
		if doprint == True:
			print(text)
		self.voicebox.say(text, 0, False)

	def saystop(self, text, doprint = True): # Stop talking and say this
		if doprint == True:
			print(text)
		self.voicebox.say(text, 0, True)

	def stop(self):
		self.voicebox.stop()
		self.voicebox.clearQueue()		

	def pause(self):
		self.voicebox.stop()

	def saywait(self, text, doprint = True): # Wait to stop talking before to continue the next instruction
		if doprint == True:
			print(text)
		try:
			winsound.PlaySound(self.onstart, winsound.SND_FILENAME)
			#playsound("sounds/message-13716.mp3")
			#if self.param == 'none':
			#	return
			tts_engine = pyttsx3.init() # object creation
			tts_engine.stop()
			""" RATE"""
			#rate = tts_engine.getProperty('rate')   # getting details of current speaking rate
			#print(rate)                        #printing current voice rate
			#tts_engine.setProperty('rate', 125)     # setting up new voice rate

			"""VOLUME"""
			#volume = tts_engine.getProperty('volume')   #getting to know current volume level (min=0 and max=1)
			#print(volume)                          #printing current volume level
			#tts_engine.setProperty('volume',1.0)    # setting up volume level  between 0 and 1  

			"""VOICE"""
			if not self.id_voice is None:
				self.voices = tts_engine.getProperty('voices')       #getting details of current voice
				#tts_engine.setProperty('voice', voices[0].id)  #changing index, changes voices. o for male
				tts_engine.setProperty('voice', self.voices[self.id_voice].id)   #changing index, changes voices. 1 for female
				
				#tts_engine.setProperty('voice', voices[0].id)  #changing index, changes voices. o for male
				tts_engine.runAndWait() # to Apply voice
			
			tts_engine.say(text)
			tts_engine.runAndWait()
		except:
			#playsound('sounds\\mixkit-correct-answer-tone-2870.wav')
			print("[xx] "+text)
		TThreadSound(self.onend) #'includes/sounds/audio_4fa75b6720.wav'

	def getVoices(self):
		tts_engine = pyttsx3.init() # object creation
		return tts_engine.getProperty('voices')

# ==== 

class TThreadSound(threading.Thread):
	def __init__(self, filepath):
		threading.Thread.__init__(self)
		self.filepath = filepath
		self.start()

	def run(self):
		try:	
			#winsound.PlaySound(None, winsound.SND_FILENAME)  #winsound.SND_FILENAME, 
			winsound.PlaySound(self.filepath, winsound.SND_ASYNC)  #winsound.SND_FILENAME, 
		except Exception as e:
			logger.exception(e)


# ==== 


class VoiceBox(object):
	def __init__(self, playsound_onstartspeaking, playsound_onendspeaking, id_voice):
		self.onstart = playsound_onstartspeaking
		self.onend = playsound_onendspeaking
		self.id_voice = id_voice
		self.t = None
		self._running = False
		self.engine = pyttsx3.init('sapi5') #pyttsx3.init('espeak') 
		if not self.id_voice is None:
			self.voices = self.engine.getProperty('voices')       #getting details of current voice
			self.engine.setProperty('voice', self.voices[self.id_voice].id)   
			self.engine.runAndWait() # execute runAndWait after SetProperty (to apply the value)

		#pygame.mixer.init()
		#pygame.mixer.music.load('includes/sounds/audio_5634777127.wav')
		#pygame.mixer.music.play()
		self.engine.connect('started-utterance', self._onStart) # must be set here to call the end of the thread
		#self.engine.connect('finished-utterance', self._onEnd) # It don't work. But this issue is fixed in self._onStart
		#self.engine.connect('started-word', self._onWord)		# It don't work too. But I let it, to test it on next library version
		self.engine.connect('error', self._onError)


		self.speed_queue = queue.Queue()

	def _processSpeech(self):
		while self._running:
			try:
				speak = self.speed_queue.get(timeout=1)
				if speak.strip() != "":
					self.engine.say(str(speak.strip()))

					#self.engine.setProperty('voice', 'HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\IVONA 2 Voice Mathieu22')
					try:
						self.engine.runAndWait()
					except:
						pass
				if not self._running:
					logger.debug("Canceled")
					self.engine.stop()
			except queue.Empty:
				#pass
				break
		self._running = False
		self._onEnd()
		
	def say(self, text, noInter=2, stopCurrentSpeach = False):
		
		#pygame.mixer.music.play()
		
		TThreadSound(self.onstart) # 'includes/sounds/audio_5634777127.wav'
		# Solution to interrupt talking is to split in max length word or by "."
		# Then, we replace everything we need, like all specials chars by "."
		t2 = ""
		compteur = 0
		for t in str(text):
			if (t.isalnum() or t == " " or t == "," or t == "'") and compteur < 200:
				t2 += t
				compteur += 1
			else:
				t2 += "." + t
				compteur = 0 

		# cut by "."
		for t3 in str(t2).split("."):
			self.speed_queue.put(t3)


		# check if thread is running
		if self.t and self._running:
			if stopCurrentSpeach:
				logger.debug('Interupting...')
				# stop it if it is
				self.stop()
		if self.t == None or not self._running:
			# iterate speech in a thread
			logger.debug('Talking: %s', text)
			self.t = Thread(target=self._processSpeech, args=())
			self._running = True
			self.t.daemon = True
			self.t.start()
			# give the thread some space
			# without this sleep and repeatitive calls to 'say'
			# the engine may not close properly and errors will start showing up
			sleep(noInter)

	def stop(self):
		self._running = False
		self.sync_thread()
	
	def clearQueue(self):
		while True:
			try:
				self.speed_queue.get(timeout=1)
			except queue.Empty:
				break

	def _onError(self, name, e):
		logger.debug("_onError")

	def _onStart(self, name):
		#sleep(2)
		#playsound('includes/sounds/audio_5634777127.wav')
		#TThreadSound('includes/sounds/audio_5634777127.wav')
		logger.debug("_onStart")

		self.engine.endLoop() # must be here to close the speach properly and call "_onEnd" 
		# otherwise you will stay in a infiniteLoop and the thread will never close until a next call of the thread
		

	def _onEnd(self):
		logger.debug("_onEnd")
		#winsound.PlaySound(None, winsound.SND_FILENAME)
		#playsound('includes/sounds/audio_4fa75b6720.wav')
		TThreadSound(self.onend) # 'includes/sounds/audio_4fa75b6720.wav'


	def sync_thread(self):
		try:
			if not self.t is None and self._running:
				self.t.join()
				logger.debug('Joined Voice thread')
		except Exception as e:
			logger.exception(e)
