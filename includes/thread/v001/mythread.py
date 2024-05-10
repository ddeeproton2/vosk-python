#!/usr/bin/env python3
import threading

class TThread(threading.Thread):
	def __init__(self, onrun):
		threading.Thread.__init__(self)
		self.onrun = onrun
		self.start()

	def run(self):
		if not self.onrun is None:
			onrun()
