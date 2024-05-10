
import random

import torch
import torch.nn as nn

import numpy as np
import nltk
import os
# nltk.download('punkt')
from nltk.stem.porter import PorterStemmer

class OperationsOnWords():

    def __init__(self) -> None:
        self.stemmer = PorterStemmer()

    def tokenize(self, sentence):
        """
        split sentence into array of words/tokens
        a token can be a word or punctuation character, or number
        """
        return nltk.word_tokenize(sentence)


    def stem(self, word):
        """
        stemming = find the root form of the word
        examples:
        words = ["organize", "organizes", "organizing"]
        words = [stem(w) for w in words]
        -> ["organ", "organ", "organ"]
        """
        return self.stemmer.stem(word.lower())


    def bag_of_words(self, tokenized_sentence, words):
        """
        return bag of words array:
        1 for each known word that exists in the sentence, 0 otherwise
        example:
        sentence = ["hello", "how", "are", "you"]
        words = ["hi", "hello", "I", "you", "bye", "thank", "cool"]
        bog   = [  0 ,    1 ,    0 ,   1 ,    0 ,    0 ,      0]
        """
        # stem each word
        sentence_words = [self.stem(word) for word in tokenized_sentence]
        # initialize bag with 0 for each word
        bag = np.zeros(len(words), dtype=np.float32)
        for idx, w in enumerate(words):
            if w in sentence_words: 
                bag[idx] = 1

        return bag




class NeuralNet(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size) 
        self.l2 = nn.Linear(hidden_size, hidden_size) 
        self.l3 = nn.Linear(hidden_size, num_classes)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        out = self.l1(x)
        out = self.relu(out)
        out = self.l2(out)
        out = self.relu(out)
        out = self.l3(out)
        # no activation and no softmax at the end
        return out


class ChatBot:
    def __init__(self) -> None:
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.operationsOnWords = OperationsOnWords()
        pass

    def compileSpeak(self, wordslist, destfilepth):
        import numpy as np

        from torch.utils.data import Dataset, DataLoader



        #with open(sourcefilejson, 'r') as f:
        #    intents = json.load(f)
        # to accurate command if only one data. We put some ghost data that will never trigger any command. To get the return "no command triggered"
        if len(wordslist) < 2:
            speakData = {}
            speakData['tag'] = "nothing"
            speakData['patterns'] = []
            speakData['patterns'].append('-1') # the char '-' will never be used on vocal chat, and the numbers also
            wordslist.append(speakData)
            speakData = {}
            speakData['tag'] = "nothing"
            speakData['patterns'] = []
            speakData['patterns'].append('-2') # we put unique value then...
            wordslist.append(speakData)


        all_words = []
        tags = []
        xy = []
        # loop through each sentence in our intents patterns
        for intent in wordslist:
            tag = intent['tag']
            # add to tag list
            tags.append(tag)
            for pattern in intent['patterns']:
                # tokenize each word in the sentence
                try:
                    w = self.operationsOnWords.tokenize(pattern)
                except:
                    nltk.download('punkt')
                    w = self.operationsOnWords.tokenize(pattern)

                # add to our words list
                all_words.extend(w)
                # add to xy pair
                xy.append((w, tag))

        # stem and lower each word
        ignore_words = ['?', '.', '!']
        all_words = [self.operationsOnWords.stem(w) for w in all_words if w not in ignore_words]
        # remove duplicates and sort
        all_words = sorted(set(all_words))
        tags = sorted(set(tags))

        print(len(xy), "patterns")
        print(len(tags), "tags:", tags)
        print(len(all_words), "unique stemmed words:", all_words)

        # create training data
        X_train = []
        y_train = []
        for (pattern_sentence, tag) in xy:
            # X: bag of words for each pattern_sentence
            bag = self.operationsOnWords.bag_of_words(pattern_sentence, all_words)
            X_train.append(bag)
            # y: PyTorch CrossEntropyLoss needs only class labels, not one-hot
            label = tags.index(tag)
            y_train.append(label)

        X_train = np.array(X_train)
        y_train = np.array(y_train)

        # Hyper-parameters 
        num_epochs = 1000
        batch_size = 8
        learning_rate = 0.001
        input_size = len(X_train[0])
        hidden_size = 8
        output_size = len(tags)
        print(input_size, output_size)


        class ChatDataset(Dataset):

            def __init__(self):
                self.n_samples = len(X_train)
                self.x_data = X_train
                self.y_data = y_train

            # support indexing such that dataset[i] can be used to get i-th sample
            def __getitem__(self, index):
                return self.x_data[index], self.y_data[index]

            # we can call len(dataset) to return the size
            def __len__(self):
                return self.n_samples

        dataset = ChatDataset()
        train_loader = DataLoader(dataset=dataset,
                                batch_size=batch_size,
                                shuffle=True,
                                num_workers=0)

        #device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        device = self.device

        model = NeuralNet(input_size, hidden_size, output_size).to(device)

        # Loss and optimizer
        criterion = nn.CrossEntropyLoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

        # Train the model
        for epoch in range(num_epochs):
            for (words, labels) in train_loader:
                words = words.to(device)
                labels = labels.to(dtype=torch.long).to(device)
                
                # Forward pass
                outputs = model(words)
                # if y would be one-hot, we must apply
                # labels = torch.max(labels, 1)[1]
                loss = criterion(outputs, labels)
                
                # Backward and optimize
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                
            if (epoch+1) % 100 == 0:
                print (f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')


        print(f'final loss: {loss.item():.4f}')

        data = {
        "model_state": model.state_dict(),
        "input_size": input_size,
        "hidden_size": hidden_size,
        "output_size": output_size,
        "all_words": all_words,
        "tags": tags
        }

        torch.save(data, destfilepth)

        print(f'training complete. file saved to {destfilepth}')


    def getSpeaking(self, filepth, sentenceSpeak):


        #FILE = "data.pth"
        data = torch.load(filepth)

        input_size = data["input_size"]
        hidden_size = data["hidden_size"]
        output_size = data["output_size"]
        all_words = data['all_words']
        tags = data['tags']
        model_state = data["model_state"]

        model = NeuralNet(input_size, hidden_size, output_size).to(self.device)
        model.load_state_dict(model_state)
        model.eval()

        sentence = self.operationsOnWords.tokenize(sentenceSpeak)
        X = self.operationsOnWords.bag_of_words(sentence, all_words)
        X = X.reshape(1, X.shape[0])
        X = torch.from_numpy(X).to(self.device)

        output = model(X)
        _, predicted = torch.max(output, dim=1)

        tag = tags[predicted.item()]

        probs = torch.softmax(output, dim=1)
        prob = probs[0][predicted.item()]
        return (tag, prob.item())
        if prob.item() > 0.75:
            #print(str(prob.item())+"% "+tag)
            return tag
        else:
            #print("I do not understand...")
            return ""

    def words_getSpeaking(self, modelSpeaking, words):
        if not os.path.isfile(modelSpeaking):
            print("Warning: is not file "+modelSpeaking)
            return ""
        res = []
        for s in words:
            (tag, probability) = self.getSpeaking(modelSpeaking, s)
            res.append({'tag':tag,'probability':probability})
            """
            print(tag+" = self.getSpeaking("+modelSpeaking+", "+s+")")
            if not tag == "":
                res = tag
                break
            """
        print(res)
        return res
""" 
#=== Sources
# https://www.youtube.com/watch?v=Da-iHgrmHYg&ab_channel=PatrickLoeber
# https://github.com/patrickloeber/pytorch-chatbot
#=== HOW TO USE: ===

chatbot = ChatBot()
speakList = []
speakData = {}
speakData['tag'] = "cool"
speakData['patterns'] = []
speakData['patterns'].append('salut')
speakList.append(speakData)


speakData = {}
speakData['tag'] = "oui"
speakData['patterns'] = []
speakData['patterns'].append('oui')
speakList.append(speakData)

speakData = {}
speakData['tag'] = "non"
speakData['patterns'] = []
speakData['patterns'].append('non')
speakList.append(speakData)

chatbot.compileSpeak(speakList, 'data.pth')
chatbot.getSpeaking('data.pth', 'hi')
chatbot.getSpeaking('data.pth', 'bye')
chatbot.getSpeaking('data.pth', 'salut')
chatbot.getSpeaking('data.pth', 'et si je te dis non')
#===============
""" 


"""
chatbot = ChatBot()
speakList = []
speakData = {}
speakData['tag'] = "cool"
speakData['patterns'] = []
speakData['patterns'].append('salut')
speakList.append(speakData)

chatbot.compileSpeak(speakList, 'data.pth')
chatbot.getSpeaking('data.pth', 'hi')
chatbot.getSpeaking('data.pth', 'bye')
chatbot.getSpeaking('data.pth', 'salut')
"""


"""
chatbot = ChatBot()
chatbot.getSpeaking('data.pth', 'hi')
chatbot.getSpeaking('data.pth', 'bye')
chatbot.getSpeaking('data.pth', 'salut')
"""