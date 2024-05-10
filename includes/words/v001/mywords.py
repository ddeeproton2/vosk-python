class MyWords():
    def __init__(self):
        self.speak = [[]]

    def append(self, arr):
        self.speak[len(self.speak)-1] = arr

    def append_item(self, speak):
        self.speak[len(self.speak)-1].append(speak)

    def next(self):
        self.speak.append([])

    def reset(self):
        self.speak = [[]]

    def _scan(self, arr):
        for a in arr:
            pass

    def find(self, commandJson):
        for cj in commandJson:
            cc = cj.split(" ")
            allFound = []
            for c in cc:
                allFound.append(False)
                for ss in self.speak:
                    for s in ss:
                        if s in c:
                            allFound[len(allFound)-1] = True
                            

            isAllFound = True
            for a in allFound:
                if a == False:
                    isAllFound = False
                    break

            if isAllFound:
                return True
        return False
