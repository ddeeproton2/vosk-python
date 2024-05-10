#!/usr/bin/env python3

import argostranslate.package
import argostranslate.translate

class MyTranslate():
	#def __init__(self):

	def install_argostranslate(self, from_code, to_code):
		# Download and install Argos Translate package
		argostranslate.package.update_package_index()
		available_packages = argostranslate.package.get_available_packages()
		package_to_install = next(
			filter(
				lambda x: x.from_code == from_code and x.to_code == to_code, available_packages
			)
		)
		argostranslate.package.install_from_path(package_to_install.download())

	def translate(self, text, from_code, to_code):
		return argostranslate.translate.translate(text, from_code, to_code)

	#install_argostranslate(from_code, to_code)

# Translate
#from_code = "he"
#to_code = "en" # en (anglais) | he (hebreux) 
#translatedText = argostranslate.translate.translate("עברית", from_code, to_code)
#print(translatedText)
# '¡Hola Mundo!'




"""

[
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "sq",
        "from_name": "Albanian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-sq_en-1_9.argosmodel"
        ],
        "code": "translate-sq_en"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "ar",
        "from_name": "Arabic",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-ar_en-1_0.argosmodel",
            "ipfs://QmV5bmf8iqKpoGoyuTzEppaSWdceuW6zgiePaUr5ThPCpW"
        ],
        "code": "translate-ar_en"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "az",
        "from_name": "Azerbaijani",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-az_en-1_5.argosmodel",
            "ipfs://QmeikEbAZf6BdJC1GQnKJb6X6XtgkXrLUBw7EntinxpEbz"
        ],
        "code": "translate-az_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "bn",
        "from_name": "Bengali",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-bn_en-1_9.argosmodel"
        ],
        "code": "translate-bn_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "bg",
        "from_name": "Bulgarian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-bg_en-1_9.argosmodel"
        ],
        "code": "translate-bg_en"
    },
    {
        "package_version": "1.7",
        "argos_version": "1.5",
        "from_code": "ca",
        "from_name": "Catalan",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-ca_en-1_7.argosmodel"
        ],
        "code": "translate-ca_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "zt",
        "from_name": "Chinese (traditional)",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-zt_en-1_9.argosmodel"
        ],
        "code": "translate-zt_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "zh",
        "from_name": "Chinese",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-zh_en-1_9.argosmodel"
        ],
        "code": "translate-zh_en"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "cs",
        "from_name": "Czech",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-cs_en-1_5.argosmodel",
            "ipfs://QmYbkvGdUorGh4RLXwAqAn37nNbdbBqrG7sp9mjy5dw14S"
        ],
        "code": "translate-cs_en"
    },
    {
        "package_version": "1.3",
        "argos_version": "1.5",
        "from_code": "da",
        "from_name": "Danish",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-da_en-1_3.argosmodel",
            "ipfs://QmQHNmJRqi8n85kbJgFdd61vX74FL5DeQB51WYzBzd98zH"
        ],
        "code": "translate-da_en"
    },
    {
        "package_version": "1.8",
        "argos_version": "1.8",
        "from_code": "nl",
        "from_name": "Dutch",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-nl_en-1_8.argosmodel"
        ],
        "code": "translate-nl_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "sq",
        "to_name": "Albanian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_sq-1_9.argosmodel"
        ],
        "code": "translate-en_sq"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "ar",
        "to_name": "Arabic",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_ar-1_0.argosmodel",
            "ipfs://QmV5bmf8iqKpoGoyuTzEppaSWdceuW6zgiePaUr5ThPCpW"
        ],
        "code": "translate-en_ar"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "az",
        "to_name": "Azerbaijani",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_az-1_5.argosmodel",
            "ipfs://QmNn1rBjRvGjTycGnKq7PoMrro4BvyTHT7nXu3sgqbo1RH"
        ],
        "code": "translate-en_az"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "bn",
        "to_name": "Bengali",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_bn-1_9.argosmodel"
        ],
        "code": "translate-en_bn"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "bg",
        "to_name": "Bulgarian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_bg-1_9.argosmodel"
        ],
        "code": "translate-en_bg"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "ca",
        "to_name": "Catalan",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_ca-1_9.argosmodel"
        ],
        "code": "translate-en_ca"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "zh",
        "to_name": "Chinese",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_zh-1_9.argosmodel"
        ],
        "code": "translate-en_zh"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "zt",
        "to_name": "Chinese (traditional)",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_zt-1_9.argosmodel"
        ],
        "code": "translate-en_zt"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "cs",
        "to_name": "Czech",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_cs-1_5.argosmodel",
            "ifps://QmdPm57RT9LsSx97kudGNK6Tvaq5JuVReZfDUGRvdKSKAP"
        ],
        "code": "translate-en_cs"
    },
    {
        "package_version": "1.3",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "da",
        "to_name": "Danish",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_da-1_3.argosmodel",
            "ifps://QmRmYhBKr4FMgZ2fSYrf8ZRpjdyLRdattzm6tbj5z2wN8X"
        ],
        "code": "translate-en_da"
    },
    {
        "package_version": "1.8",
        "argos_version": "1.8",
        "from_code": "en",
        "from_name": "English",
        "to_code": "nl",
        "to_name": "Dutch",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_nl-1_8.argosmodel"
        ],
        "code": "translate-en_nl"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "eo",
        "to_name": "Esperanto",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_eo-1_5.argosmodel",
            "ipfs://QmQmaqSiFS86qdf3ignt3moiNodEG2EKBjBNfMsJ1CBc8p"
        ],
        "code": "translate-en_eo"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "et",
        "to_name": "Estonian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_et-1_9.argosmodel"
        ],
        "code": "translate-en_et"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "fi",
        "to_name": "Finnish",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_fi-1_5.argosmodel",
            "ifps://QmRDSD2FXE8Nxf9UEuRcNAzQ4azEWiGAHgZv3jWvXau6Y5"
        ],
        "code": "translate-en_fi"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "fr",
        "to_name": "French",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_fr-1_0.argosmodel",
            "ipfs://QmTFDhZVeqDqXQk6DDt6wp9xA4L4yed7zup122Hh8cQtkk"
        ],
        "code": "translate-en_fr"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "de",
        "to_name": "German",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_de-1_0.argosmodel",
            "ipfs://QmfVPk8rZmHwfxMzpnFKZ73CkNbPGzQDDq8wGEvPtcDoyW"
        ],
        "code": "translate-en_de"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "el",
        "to_name": "Greek",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_el-1_9.argosmodel"
        ],
        "code": "translate-en_el"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "he",
        "to_name": "Hebrew",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_he-1_5.argosmodel",
            "ipfs://QmfQoJwfdZJ6ZApHWDGZjNG6EHjtgjEsiQrR1nvk5MCcpx"
        ],
        "code": "translate-en_he"
    },
    {
        "package_version": "1.1",
        "argos_version": "1.1",
        "from_code": "en",
        "from_name": "English",
        "to_code": "hi",
        "to_name": "Hindi",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_hi-1_1.argosmodel",
            "ipfs://QmUwZ5mSRLycPPw6CRqVVqXBMrtEN8Az9UiXH7eTuzMh8n"
        ],
        "code": "translate-en_hi"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "hu",
        "to_name": "Hungarian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_hu-1_5.argosmodel",
            "ipfs://QmZQTGaxRviadGfvixsSjKuhFpD13hjUMN2D3wAKrcctmK"
        ],
        "code": "translate-en_hu"
    },
    {
        "package_version": "1.2",
        "argos_version": "1.2",
        "from_code": "en",
        "from_name": "English",
        "to_code": "id",
        "to_name": "Indonesian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_id-1_2.argosmodel",
            "ipfs://QmRgVwNeuX8wBtwih8Ef1R6Frg8jQv8tVTBJf3rfH2PGn5"
        ],
        "code": "translate-en_id"
    },
    {
        "package_version": "1.1",
        "argos_version": "1.1",
        "from_code": "en",
        "from_name": "English",
        "to_code": "ga",
        "to_name": "Irish",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_ga-1_1.argosmodel",
            "ipfs://Qmb35iKrxS3pJPeTk3xYJuLEDfDXRBehbFNvDiRMnjQGJj"
        ],
        "code": "translate-en_ga"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "it",
        "to_name": "Italian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_it-1_0.argosmodel",
            "ipfs://QmT5LnsNZEf3JKYMoYWvo9aNMwKUyLLUpshCA7hZLQRST4"
        ],
        "code": "translate-en_it"
    },
    {
        "package_version": "1.1",
        "argos_version": "1.1",
        "from_code": "en",
        "from_name": "English",
        "to_code": "ja",
        "to_name": "Japanese",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_ja-1_1.argosmodel",
            "ipfs://QmQjHs8ZhCU6WTV9RRHQMXgy4cDwyjvLUZ4bBp6J9GMCRb"
        ],
        "code": "translate-en_ja"
    },
    {
        "package_version": "1.1",
        "argos_version": "1.1",
        "from_code": "en",
        "from_name": "English",
        "to_code": "ko",
        "to_name": "Korean",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_ko-1_1.argosmodel",
            "ipfs://QmWecr5i4tJNnokusm97rTUyQtUqNNPufGF7ake1hJVu6G"
        ],
        "code": "translate-en_ko"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "lv",
        "to_name": "Latvian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_lv-1_9.argosmodel"
        ],
        "code": "translate-en_lv"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "lt",
        "to_name": "Lithuanian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_lt-1_9.argosmodel"
        ],
        "code": "translate-en_lt"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "ms",
        "to_name": "Malay",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_ms-1_9.argosmodel"
        ],
        "code": "translate-en_ms"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "nb",
        "to_name": "Norwegian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_nb-1_9.argosmodel"
        ],
        "code": "translate-en_nb"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "fa",
        "to_name": "Persian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_fa-1_5.argosmodel",
            "ipfs://QmZ33DueKF3oy3jqaJGayimXDZ5osbHAVmh4C7P9MdEW69"
        ],
        "code": "translate-en_fa"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "pl",
        "to_name": "Polish",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_pl-1_9.argosmodel"
        ],
        "code": "translate-en_pl"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "pt",
        "to_name": "Portuguese",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_pt-1_0.argosmodel",
            "ifps://Qmb6Net4NwQeYf6Q9uCzT1QbA3TZcD7hwXmP89yjVBt6yh"
        ],
        "code": "translate-en_pt"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "ro",
        "to_name": "Romanian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_ro-1_9.argosmodel"
        ],
        "code": "translate-en_ro"
    },
    {
        "package_version": "1.7",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "ru",
        "to_name": "Russian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_ru-1_7.argosmodel",
            "ipfs://QmW847X6RjmiwRLCQKbubtz1DGJgrVCNJ97crNQNZFGe7K"
        ],
        "code": "translate-en_ru"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "sr",
        "to_name": "Serbian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_sr-1_9.argosmodel"
        ],
        "code": "translate-en_sr"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "sk",
        "to_name": "Slovak",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_sk-1_5.argosmodel",
            "ipfs://QmdnA8chM6qnnsZKW7wJEcXumSq6LMsQbq2W2F7RX8tdc1"
        ],
        "code": "translate-en_sk"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "sl",
        "to_name": "Slovenian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_sl-1_9.argosmodel"
        ],
        "code": "translate-en_sl"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "es",
        "to_name": "Spanish",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_es-1_0.argosmodel",
            "ipfs://QmTej992FdB95GyaYjmcZPoxyEqctCvc7mizUeLgyT6dcb"
        ],
        "code": "translate-en_es"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "sv",
        "to_name": "Swedish",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_sv-1_5.argosmodel",
            "ipfs://QmXjLByK6hv3BQmPz1XMAEPLJEBmofYc7uN8AdDobQADZD"
        ],
        "code": "translate-en_sv"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "tl",
        "to_name": "Tagalog",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_tl-1_9.argosmodel"
        ],
        "code": "translate-en_tl"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "en",
        "from_name": "English",
        "to_code": "th",
        "to_name": "Thai",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_th-1_9.argosmodel"
        ],
        "code": "translate-en_th"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "en",
        "from_name": "English",
        "to_code": "tr",
        "to_name": "Turkish",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_tr-1_5.argosmodel",
            "ipfs://QmVfrmu37AjaxyjsdB9AKh2BBBM1q2wur2ewpGeDpqegok"
        ],
        "code": "translate-en_tr"
    },
    {
        "package_version": "1.4",
        "argos_version": "1.4",
        "from_code": "en",
        "from_name": "English",
        "to_code": "uk",
        "to_name": "Ukranian",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-en_uk-1_4.argosmodel",
            "ipfs://QmbXofcXVEPX4kY8WcqHt7WzGACudXKf7VXYsFjDBy1wTs"
        ],
        "code": "translate-en_uk"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "eo",
        "from_name": "Esperanto",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-eo_en-1_5.argosmodel",
            "ipfs://QmU6Z4NvWhQvhSd5r7Mw8fzGjKWx1duPFUAiNdtG418nXL"
        ],
        "code": "translate-eo_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "et",
        "from_name": "Estonian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-et_en-1_9.argosmodel"
        ],
        "code": "translate-et_en"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "fi",
        "from_name": "Finnish",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-fi_en-1_5.argosmodel",
            "ipfs://QmWaSo6N5kXgojkziQCJH1eVSy3wcPusiykLgvAoqS4V9y"
        ],
        "code": "translate-fi_en"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "fr",
        "from_name": "French",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-fr_en-1_0.argosmodel",
            "ipfs://QmRVE85p59QDGZg2CMec3yAt9FwxbZAotjh34XKrzGGVEH"
        ],
        "code": "translate-fr_en"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "de",
        "from_name": "German",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-de_en-1_0.argosmodel",
            "ipfs://QmPRsSinizA4MPNVi4TZrWkhgAKgX4kEKwZ2jkHeghx1Dr"
        ],
        "code": "translate-de_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "el",
        "from_name": "Greek",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-el_en-1_9.argosmodel"
        ],
        "code": "translate-el_en"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "he",
        "from_name": "Hebrew",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-he_en-1_5.argosmodel",
            "ipfs://QmaXuZUv7VL8CqBwmskfh6n5wC8TZKnHTa5a9JS46LVa3v"
        ],
        "code": "translate-he_en"
    },
    {
        "package_version": "1.1",
        "argos_version": "1.1",
        "from_code": "hi",
        "from_name": "Hindi",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-hi_en-1_1.argosmodel",
            "ipfs://QmQrvsyhYywaqgi2yXjPPoRAbudQS7LPEjBkrPJQrdDt1H"
        ],
        "code": "translate-hi_en"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "hu",
        "from_name": "Hungarian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-hu_en-1_5.argosmodel",
            "ipfs://QmfEXxSieewThZ45jvSQXJUJaow6vZmVgyVbhNyXPbwXHr"
        ],
        "code": "translate-hu_en"
    },
    {
        "package_version": "1.2",
        "argos_version": "1.2",
        "from_code": "id",
        "from_name": "Indonesian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-id_en-1_2.argosmodel",
            "ipfs://QmbxUki3VtfzuqX9AL8EzZBTC3LbqzFU1bsj46k5wKsBor"
        ],
        "code": "translate-id_en"
    },
    {
        "package_version": "1.1",
        "argos_version": "1.1",
        "from_code": "ga",
        "from_name": "Irish",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-ga_en-1_1.argosmodel",
            "ipfs://Qmbf88HufkqDk6UhYeWA5uoe7eSgp8ZYRkQqrbXJonyAdY"
        ],
        "code": "translate-ga_en"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "it",
        "from_name": "Italian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-it_en-1_0.argosmodel",
            "ipfs://QmbFjMY6j6u4g4gfqFpATSRrwD3VB3ci2ujnGgHijQGEHG"
        ],
        "code": "translate-it_en"
    },
    {
        "package_version": "1.1",
        "argos_version": "1.1",
        "from_code": "ja",
        "from_name": "Japanese",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-ja_en-1_1.argosmodel",
            "ipfs://QmQDt5mgKgi6vBieC3uHWxZ41XB4JxtEG891os9UFUuzNU"
        ],
        "code": "translate-ja_en"
    },
    {
        "package_version": "1.1",
        "argos_version": "1.1",
        "from_code": "ko",
        "from_name": "Korean",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-ko_en-1_1.argosmodel",
            "ipfs://QmagkMMHshubVk8XT3sXow5Y9vzBoz3rbN2HAAGL9vQsKY"
        ],
        "code": "translate-ko_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "lv",
        "from_name": "Latvian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-lv_en-1_9.argosmodel"
        ],
        "code": "translate-lv_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "lt",
        "from_name": "Lithuanian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-lt_en-1_9.argosmodel"
        ],
        "code": "translate-lt_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "ms",
        "from_name": "Malay",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-ms_en-1_9.argosmodel"
        ],
        "code": "translate-ms_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "nb",
        "from_name": "Norwegian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-nb_en-1_9.argosmodel"
        ],
        "code": "translate-nb_en"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "fa",
        "from_name": "Persian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-fa_en-1_5.argosmodel",
            "ipfs://Qma9SnzpwFPfja6Us9cE8SabSxYK9CH6LzAowq2LVVXXfs"
        ],
        "code": "translate-fa_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "pl",
        "from_name": "Polish",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-pl_en-1_9.argosmodel"
        ],
        "code": "translate-pl_en"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "pt",
        "from_name": "Portuguese",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-pt_en-1_0.argosmodel",
            "ipfs://QmeTuK7ydLqz2UmBHSoxopVQg9rztnLGkNuRDw2MH5gYfL"
        ],
        "code": "translate-pt_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "ro",
        "from_name": "Romanian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-ro_en-1_9.argosmodel"
        ],
        "code": "translate-ro_en"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "ru",
        "from_name": "Russian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-ru_en-1_0.argosmodel",
            "ipfs://QmTEfEov1eifNp2BkieaYzSaaKnL4L5UfG12SuS9n5XzJb"
        ],
        "code": "translate-ru_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "sr",
        "from_name": "Serbian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-sr_en-1_9.argosmodel"
        ],
        "code": "translate-sr_en"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "sk",
        "from_name": "Slovak",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-sk_en-1_5.argosmodel",
            "ipfs://QmVdjFr4jLj4KAGykML4anJsbL61dLtuHnzDF52UEDHRij"
        ],
        "code": "translate-sk_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "sl",
        "from_name": "Slovenian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-sl_en-1_9.argosmodel"
        ],
        "code": "translate-sl_en"
    },
    {
        "package_version": "1.0",
        "argos_version": "1.0",
        "from_code": "es",
        "from_name": "Spanish",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-es_en-1_0.argosmodel",
            "ipfs://Qmcs4RKWoYh9bhkv4fWovnnJ2eQfox52GioYtjyPP3vYSB"
        ],
        "code": "translate-es_en"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "sv",
        "from_name": "Swedish",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-sv_en-1_5.argosmodel",
            "ipfs://QmTusbmKWwVGRkMABcBFNrNrYoAwTzvuUEaqLhzYr5yH36"
        ],
        "code": "translate-sv_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "tl",
        "from_name": "Tagalog",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-tl_en-1_9.argosmodel"
        ],
        "code": "translate-tl_en"
    },
    {
        "package_version": "1.9",
        "argos_version": "1.9.0",
        "from_code": "th",
        "from_name": "Thai",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-th_en-1_9.argosmodel"
        ],
        "code": "translate-th_en"
    },
    {
        "package_version": "1.5",
        "argos_version": "1.5",
        "from_code": "tr",
        "from_name": "Turkish",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-tr_en-1_5.argosmodel",
            "ipfs://QmS6zpzcBmHPqHRBP25trmX8QZm7Tfrb7T7LtLmkCJMSKK"
        ],
        "code": "translate-tr_en"
    },
    {
        "package_version": "1.4",
        "argos_version": "1.4",
        "from_code": "uk",
        "from_name": "Ukranian",
        "to_code": "en",
        "to_name": "English",
        "links": [
            "https://pub-dbae765fb25a4114aac1c88b90e94178.r2.dev/v1/translate-uk_en-1_4.argosmodel",
            "ipfs://QmX4DNcxd1E6uVnD6qyZ1TwVq7569VkJbP6G3kxownM2qx"
        ],
        "code": "translate-uk_en"
    }
]

"""
