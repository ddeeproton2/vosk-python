#!/usr/bin/env python3
import pyautogui as pyautogui
import clipboard
import pygetwindow as gw
import time

class MyPyautogui():
	def __init__(self):
		self.gw = gw
		self.pyautogui = pyautogui
		self.clipboard = clipboard

	def screenshot(self, top, left, width, height):
		return pyautogui.screenshot(region=(top, left, width, height))

	def screenshotall(self):
		return pyautogui.screenshot()

	def screenshottoimage(self, imagepath, top, left, width, height):
		image = pyautogui.screenshot(region=(top, left, width, height))
		image.save(imagepath)
		return image

	def pixelMatchesColor(self, x, y, r, g, b):
		return pyautogui.pixelMatchesColor(x, y, (r, g, b), tolerance=10) # True

	def imagesearch(self, impageToSearch, imageStack):
		return pyautogui.locate(impageToSearch, imageStack, grayscale=False) #  Returns (left, top, width, height)
	
	def imagesearchall(self, impageToSearch, imageStack):
		return pyautogui.locateAll(impageToSearch, imageStack, grayscale=False) #  Returns [(left, top, width, height), (left, top, width, height)]
	
	def screensearch(self, impagePath):
		# Note: You need to have OpenCV installed for the confidence keyword to work
		# The optional confidence keyword argument specifies the accuracy with which the function should locate the image on screen.
		return pyautogui.locateCenterOnScreen(impagePath, confidence=0.9) # Box(left=1416, top=562, width=50, height=41)
		#button7location = Box(left=1416, top=562, width=50, height=41)
		#>>> button7location[0]
		#1416
		#>>> button7location.left
		#>>> button7point = pyautogui.center(button7location)
		#>>> button7point
		#Point(x=1441, y=582)

	def screensearchall(self, impagePath):
		return pyautogui.locateAllOnScreen(impagePath) # returns [(863, 117, 70, 13), (623, 137, 70, 13), (853, 577, 70, 13), (883, 617, 70, 13), (973, 657, 70, 13), (933, 877, 70, 13)]
		#Raises ImageNotFoundException if not found

	def screensize(self):
		return pyautogui.size() # (1920, 1080)

	def mouseposition(self):
		return pyautogui.position() # (111, 111)

	def mousemove(self, x, y):
		pyautogui.moveTo(x, y) # (None, 500)  moves only Y in 500.

	def mousemoverelative(self, x, y):
		pyautogui.move(x, y) # (-30, None) move the mouse left 30 pixels.

	def mousedrag(self, x, y):
		pyautogui.dragTo(x, y, button='left')  # 'left', 'middle', 'right'

	def mousedragrelative(self, x, y):
		pyautogui.drag(x, y, button='left')  # 'left', 'middle', 'right'

	def mouseclick(self):
		pyautogui.click() # click the mouse

	def mouseclickto(self, x, y):
		pyautogui.click(x, y) # click the mouse

	def mousedoubleclick(self):
		pyautogui.doubleClick()

	def mousetripleclick(self):
		pyautogui.click(button='left', clicks=3, interval=0.25) ## triple-click the left mouse button with a quarter second pause in between clicks

	def mousescroll(self, scrollY):
		pyautogui.scroll(scrollY) # (10) # scroll up 10 "clicks"

	def mousescrollto(self, scrollY, x, y):
		pyautogui.scroll(scrollY, x, y) # (10, x=100, y=100) # move mouse cursor to 100, 200, then scroll up 10 "clicks"

	def positiononscreen(self, x, y):
		return pyautogui.onScreen(x, y) # True

	def select_all(self):
		pyautogui.hotkey('ctrl', 'a')

	def control_z(self):
		pyautogui.hotkey('ctrl', 'z')

	def effacer(self):
		pyautogui.hotkey('ctrl', 'a')
		pyautogui.press('delete')

	def backspace(self):
		pyautogui.press('backspace')

	def point(self):
		pyautogui.write('.')

	def virgule(self):
		pyautogui.write(',')

	def envoyer(self):
		pyautogui.press('enter')

	def fin_ligne(self):
		pyautogui.press('end')

	def debut_ligne(self):
		pyautogui.press('home')

	def arrow_left(self):
		pyautogui.press('left')

	def arrow_right(self):
		pyautogui.press('right')

	def arrow_up(self):
		pyautogui.press('up')

	def arrow_down(self):
		pyautogui.press('down')

	def ecrire_le_texte(self, text):
		#temp = clipboard.paste()
		clipboard.copy(text.replace("virgule", ", ").replace("point", ". "))
		time.sleep(1)
		pyautogui.hotkey('ctrl', 'v')
		#clipboard.copy(temp)

	def texte_en_copie(self):
		return clipboard.paste()

	def espace(self):
		pyautogui.press(' ')

	def listWindows(self):
		return gw.getAllTitles()

	def getWindow(self, partoftitle):
		i = 0
		lwin = []
		wi = self.listWindows()
		chiffre = -1
		for w in wi:
			if partoftitle.lower() in w.lower():
				chiffre = i
			if w != "":
				t = str(i)+" - "+w.replace("1", "1 ").replace("2", "2 ").replace("3", "3 ").replace("4", "4 ").replace("5", "5 ").replace("6", "6 ").replace("7", "7 ").replace("8", "8 ").replace("9", "9 ").replace("0", "0 ").replace(".", " point ")+" "
				t = t.split("-")[-1].split("\\")[-1]
			lwin.append(w)
			i = i + 1
		try:
			title = lwin[int(chiffre)]
		except:
			title = ""
		if title == "":
			print("Je ne trouve pas le numero de fenêtre  "+str(chiffre))
		else:
			try:
				mywin = gw.getWindowsWithTitle(title)[0]
				
				mywin.miniimize()
				time.sleep(1)
				mywin.maximize()
				mywin.activate()
			
				print("Vous avez choisi "+str(chiffre)+". "+title)
			except:
				print("Erreur à la sélection de la fenêtre")                
				

	
	def prompt(self, text):
		return pyautogui.prompt(text)
	
	def alert(self, text):
		pyautogui.alert(text)

	def confirm(self, text):
		return pyautogui.confirm(text) == "OK" #return "Cancel" or "OK"

	def prompt(self, text, arr_buttons):
		#return pyautogui.confirm(text, buttons=['Oui', 'Non', "Quitter"]) #return "Oui", "Non", "Quitter"
		return pyautogui.confirm(text, buttons=arr_buttons) #return "Oui", "Non", "Quitter"

"""
>>> notepadWindow = gw.getWindowsWithTitle('Untitled')[0]
>>> notepadWindow.isMaximized
False
>>> notepadWindow.maximize()
>>> notepadWindow.isMaximized
True
>>> notepadWindow.restore()
>>> notepadWindow.minimize()
>>> notepadWindow.restore()
>>> notepadWindow.activate()
>>> notepadWindow.resize(10, 10) # increase by 10, 10
>>> notepadWindow.resizeTo(100, 100) # set size to 100x100
>>> notepadWindow.move(10, 10) # move 10 pixels right and 10 down
>>> notepadWindow.moveTo(10, 10) # move window to 10, 10
>>> notepadWindow.size
(132, 100)
>>> notepadWindow.width
132
>>> notepadWindow.height
100
>>> notepadWindow.topleft
(10, 10)
>>> notepadWindow.top
10
>>> notepadWindow.left
10
>>> notepadWindow.bottomright
(142, 110)
>>> notepadWindow.close()
>>>
"""


#screenWidth, screenHeight = pyautogui.size() # Returns two integers, the width and height of the screen. (The primary monitor, in multi-monitor setups.)
#currentMouseX, currentMouseY = pyautogui.position() # Returns two integers, the x and y of the mouse cursor's current position.
#pyautogui.moveTo(100, 150) # Move the mouse to the x, y coordinates 100, 150.

# pyautogui.click() # Click the mouse at its current location.
#pyautogui.click(200, 220) # Click the mouse at the x, y coordinates 200, 220.
#pyautogui.move(None, 10)  # Move mouse 10 pixels down, that is, move the mouse relative to its current position.
#pyautogui.doubleClick() # Double click the mouse at the
#pyautogui.moveTo(500, 500, duration=2, tween=pyautogui.easeInOutQuad) # Use tweening/easing function to move mouse over 2 seconds.
#pyautogui.write('Hello world!', interval=0.25)  # Type with quarter-second pause in between each key.
#pyautogui.press('esc') # Simulate pressing the Escape key.
#pyautogui.keyDown('shift')
#pyautogui.write(['left', 'left', 'left', 'left', 'left', 'left'])
#pyautogui.keyUp('shift')
#pyautogui.hotkey('ctrl', 'c')

#pyautogui.keyDown('winleft')
#pyautogui.press('r')
#pyautogui.keyUp('winleft')

#pyautogui.scroll(10) # scroll up 10 "clicks"
#pyautogui.scroll(-10) # scroll down 10 "clicks"
#pyautogui.scroll(10, x=100, y=100) # move mouse cursor to 100, 200, then scroll˓up 10 "clicks"
"""
['\t', '\n', '\r', ' ', '!', '"', '#', '$', '%', '&', "'", '(',
')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7',
'8', '9', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`',
'a', 'b', 'c', 'd', 'e','f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~',
'accept', 'add', 'alt', 'altleft', 'altright', 'apps', 'backspace',
'browserback', 'browserfavorites', 'browserforward', 'browserhome',
'browserrefresh', 'browsersearch', 'browserstop', 'capslock', 'clear',
'convert', 'ctrl', 'ctrlleft', 'ctrlright', 'decimal', 'del', 'delete',
'divide', 'down', 'end', 'enter', 'esc', 'escape', 'execute', 'f1', 'f10',
'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f2', 'f20',
'f21', 'f22', 'f23', 'f24', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9',
'final', 'fn', 'hanguel', 'hangul', 'hanja', 'help', 'home', 'insert', 'junja',
'kana', 'kanji', 'launchapp1', 'launchapp2', 'launchmail',
'launchmediaselect', 'left', 'modechange', 'multiply', 'nexttrack',
'nonconvert', 'num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6',
'num7', 'num8', 'num9', 'numlock', 'pagedown', 'pageup', 'pause', 'pgdn',
'pgup', 'playpause', 'prevtrack', 'print', 'printscreen', 'prntscrn',
'prtsc', 'prtscr', 'return', 'right', 'scrolllock', 'select', 'separator',
'shift', 'shiftleft', 'shiftright', 'sleep', 'space', 'stop', 'subtract', 'tab',
'up', 'volumedown', 'volumemute', 'volumeup', 'win', 'winleft', 'winright', 'yen',
'command', 'option', 'optionleft', 'optionright']

>>> import pygetwindow as gw
>>> gw.getAllTitles()
('', 'C:\\WINDOWS\\system32\\cmd.exe - pipenv  shell - python', 'C:\\github\\PyGetWindow\\README.md • - Sublime Text', "asweigart/PyGetWindow: A simple, cross-platform module for obtaining GUI information on application's windows. - Google Chrome", 'Untitled - Notepad', 'C:\\Users\\Al\\Desktop\\xlibkey.py • - Sublime Text', 'https://tronche.com/gui/x/xlib/ - Google Chrome', 'Xlib Programming Manual: XGetWindowAttributes - Google Chrome', 'Generic Ubuntu Box [Running] - Oracle VM VirtualBox', 'Oracle VM VirtualBox Manager', 'Microsoft Edge', 'Microsoft Edge', 'Microsoft Edge', '', 'Microsoft Edge', 'Settings', 'Settings', 'Microsoft Store', 'Microsoft Store', '', '', 'Backup and Sync', 'Google Hangouts - asweigart@gmail.com', 'Downloads', '', '', 'Program Manager')
>>> gw.getAllWindows()
(Win32Window(hWnd=131318), Win32Window(hWnd=1050492), Win32Window(hWnd=67206), Win32Window(hWnd=66754), Win32Window(hWnd=264354), Win32Window(hWnd=329210), Win32Window(hWnd=1114374), Win32Window(hWnd=852550), Win32Window(hWnd=328358), Win32Window(hWnd=66998), Win32Window(hWnd=132508), Win32Window(hWnd=66964), Win32Window(hWnd=66882), Win32Window(hWnd=197282), Win32Window(hWnd=393880), Win32Window(hWnd=66810), Win32Window(hWnd=328466), Win32Window(hWnd=132332), Win32Window(hWnd=262904), Win32Window(hWnd=65962), Win32Window(hWnd=65956), Win32Window(hWnd=197522), Win32Window(hWnd=131944), Win32Window(hWnd=329334), Win32Window(hWnd=395034), Win32Window(hWnd=132928), Win32Window(hWnd=65882))
>>> gw.getWindowsWithTitle('Untitled')
(Win32Window(hWnd=264354),)
>>> gw.getActiveWindow()
Win32Window(hWnd=1050492)
>>> gw.getActiveWindow().title
'C:\\WINDOWS\\system32\\cmd.exe - pipenv  shell - python'
>>> gw.getWindowsAt(10, 10)
(Win32Window(hWnd=67206), Win32Window(hWnd=66754), Win32Window(hWnd=329210), Win32Window(hWnd=1114374), Win32Window(hWnd=852550), Win32Window(hWnd=132508), Win32Window(hWnd=66964), Win32Window(hWnd=66882), Win32Window(hWnd=197282), Win32Window(hWnd=393880), Win32Window(hWnd=66810), Win32Window(hWnd=328466), Win32Window(hWnd=395034), Win32Window(hWnd=132928), Win32Window(hWnd=65882))


>>> notepadWindow = gw.getWindowsWithTitle('Untitled')[0]
>>> notepadWindow.isMaximized
False
>>> notepadWindow.maximize()
>>> notepadWindow.isMaximized
True
>>> notepadWindow.restore()
>>> notepadWindow.minimize()
>>> notepadWindow.restore()
>>> notepadWindow.activate()
>>> notepadWindow.resize(10, 10) # increase by 10, 10
>>> notepadWindow.resizeTo(100, 100) # set size to 100x100
>>> notepadWindow.move(10, 10) # move 10 pixels right and 10 down
>>> notepadWindow.moveTo(10, 10) # move window to 10, 10
>>> notepadWindow.size
(132, 100)
>>> notepadWindow.width
132
>>> notepadWindow.height
100
>>> notepadWindow.topleft
(10, 10)
>>> notepadWindow.top
10
>>> notepadWindow.left
10
>>> notepadWindow.bottomright
(142, 110)
>>> notepadWindow.close()
>>>

=================
>>> pyautogui.hotkey('ctrl', 'shift', 'esc')
. . . is equivalent to this code:
>>> pyautogui.keyDown('ctrl')
>>> pyautogui.keyDown('shift')
>>> pyautogui.keyDown('esc')
>>> pyautogui.keyUp('esc')
>>> pyautogui.keyUp('shift')
>>> pyautogui.keyUp('ctrl')

=================

>>> pyautogui.alert('This is an alert box.')
    'OK'
    >>> pyautogui.confirm('Shall I proceed?')
    'Cancel'
    >>> pyautogui.confirm('Enter option.', buttons=['A', 'B', 'C'])
    'B'
    >>> pyautogui.prompt('What is your name?')
    'Al'
    >>> pyautogui.password('Enter password (text will be hidden)')
    'swordfish'


"""