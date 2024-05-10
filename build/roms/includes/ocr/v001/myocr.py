#!/usr/bin/env python3
import cv2 # Face detection with openCV : https://www.youtube.com/watch?v=lZAGS4n1Odw&ab_channel=edureka%21
import pytesseract
from PIL import Image

class MyOCR():
	def __init__(self):
		# If you don't have tesseract executable in your PATH, include the following:
		#pytesseract.pytesseract.tesseract_cmd = r'<full_path_to_your_tesseract_executable>'
		# Download https://digi.bib.uni-mannheim.de/tesseract/
		pytesseract.pytesseract.tesseract_cmd = 'D:\\Share\\Programmation\\Python\\ReconnaissanceVOCALE\\reconaissanceVocale\\v2\\reconaissanceVocale\\assistant\\Tesseract-OCR\\tesseract.exe'

	def image_to_string(self, imagepath):
		return pytesseract.image_to_string(imagepath)

	def image_to_boxes(self, imagepath):
		return pytesseract.image_to_boxes(Image.open(imagepath))
