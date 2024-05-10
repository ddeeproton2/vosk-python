#!/usr/bin/env python3
import json
import requests
import socket
import base64
import marshal
import pathlib
import urllib.parse
import threading
import time
import ssl
from socketserver import BaseServer
from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler




class MyWeb():
    #def __init__(self):

    def b64e(self, s):
        return base64.b64encode(s.encode()).decode()

    def b64d(self, s):
        return base64.b64decode(s).decode()

    def json_decode(self, datajson):
        return json.loads(datajson)

    def json_encode(self, datajson):
        return json.dumps(datajson, indent=4)

    def json_load(self, filepath):
        if pathlib.Path(filepath).exists():
            return json.load(open(filepath, "rb"))

    def json_save(self, filepath, datajson):
        with open(filepath, "w") as outfile:
            outfile.write(json.dumps(datajson, indent=4))

    def object_load(self, filepath):
        if pathlib.Path(filepath).exists():
            return marshal.load(open(filepath, "rb"))

    def object_save(self, filepath, datajson):
        marshal.dump(datajson, open(filepath, 'wb'))

    def openURLThread(self, url, obj):
        TTSThreadOpenURL(url, obj)

    def openURL(self, url, obj = {}):
        try:
            #obj = urllib.parse.quote(obj)       # URL encode.
            response = requests.post(url, data = obj, verify = False)
            response.raise_for_status()
        except requests.exceptions.HTTPError as errh:
            #print("HTTP Error")
            return {'result': False, 'text': ''}
        except requests.exceptions.ConnectionError as errc:
            print("Connection Error")
            return {'result': False, 'text': ''}
        except requests.exceptions.Timeout as errt:
            print("Timeout Error")
            return {'result': False, 'text': ''}
        except requests.exceptions.RequestException as err:
            print("Other Error")
            return {'result': False, 'text': ''}
        return {'result': True, 'text': response.text}

    """
    url = 'http://127.0.0.1/web/reconaissanceVocale/php/getVoice.php'
    reponse = openURL(url, {'voice': 'STARTED'})
    if reponse['result'] == False:
        print("Verifiez que le lien suivant est valide")
        print(url)
        quit()   


                        #s = s.decode('latin-1')    # (or what the encoding might be …)
                                                   # Now "s" is a unicode object.
                        #s = s.encode('utf-8')      # Encode as UTF-8 string.
                                                   # Now "s" is a str again.
                            s = urllib.parse.quote(s)       # URL encode.
                                                   # Now "s" is encoded the way you need it.
                                                   
                        reponse = openURL(url, {'voice': s})

    """
    def openURLGET(self, url):
        try:
            response = requests.get(url)
            return str(response.content)
        except:
            print("Warning: bad url ["+url+"]")
            pass
    

    def openURLPOST(self, url, data):
        # use : 
        # web.openURLPOST("http...", {'key':'value'})
        try:
            response = requests.post(url, json=data).get(url)
            return str(response.content)
        except:
            print("Warning: bad url ["+url+"]")
            pass
    
    def encodeURI(self, url):
        return urllib.parse.quote(url)
    
    def decodeURI(self, url):
        return urllib.parse.unquote(url)

    def openURLGETCookies(self, url):
        try:
            s = requests.Session() 
            # all cookies received will be stored in the session object
            #payload={'username'=<username>,'password'=<password>}
            #s.post('http://www...',data=payload)

            #cookies = {'cookies_are': 'working'}
            #r = requests.get(url, cookies=cookies)

            #headers = {
            #    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...',
            #    'cookie': '_fbp=fb.1.1654447470850.2143140577; _ga=GA1.2.1...'
            #}
            #response = requests.get(url, headers=headers)

            s.get(url)
            response = requests.get(url)
            print(url)
            print("====heander")
            print(response.headers)
            print("====cookies")
            print(response.cookies)
            print("====content")
            return str(response.content)
        except:
            print("Warning: bad url ["+url+"]")
            pass


    def splitBetween(self, content, start, end):
        result = []
        data = content.split(end)
        print(str(len(data))+" models trouvés")
        for i, index_string in enumerate(data):
            if i == len(data) - 1:
                break
            c = str(data[i])
            zip = c[c.rfind(start):]+end
            result.append(zip)
        return result
    
    def wget(self, url):
        try:
            import wget
        except:
            from myexec import TExec
            exec = TExec()
            exec.pipInstall("wget")
            try:
                import wget
            except:
                print("Error cannot pip install wget")
                return None   
        print("Download model : "+url)
        filename = wget.download(url)
        print("Downloaded : "+filename)
        return filename
    
    def downloadZipExtractToDir(self, url, destination = None, removeZip  = True):
        from myfiles import MyFiles
        files = MyFiles()

        if not 'http' in url:
            print("url is invalid ["+url+"]")
            return None

        if destination == None: 
            destination = files.currentDir()
        
        if not files.isDir(destination):
            print("destination is invalid ["+destination+"]")
            return None
        filename = self.wget(url)
        if not files.isFile(filename):
            print("Error cannot download url ["+url+"]")
            return None
        print("Extracting to.. "+destination)
        files.zip_extract(filename, destination)
        if removeZip:
            files.deleteFile(filename)
        return True

    def webserver(self, host, onrequest, useSSL = False, SSLCERT = "cert.pem", SSLKEY = "key.pem", verbose = False):
        self.webserverThread(host, onrequest, useSSL, SSLCERT, SSLKEY, verbose)

    def webserver_deprecied(self, server = "0.0.0.0:8080", onrequest = None): #cette technique n'a pas de HTTPS
        # Define socket host and port
        if ':' in server:
            host = server.split(":")[0]
            port = int(server.split(":")[1])
        else:
            print('Error. Bad format for server. Must be "ip:port". Exemple 0.0.0.0:8080')
            quit()

        # Create socket
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((host, port))
        server_socket.listen(1)
        print('Listening on port %s ...' % port)

        try:
            while True:
                # Wait for client connections
                client_connection, client_address = server_socket.accept()

                # Get the client request
                request = client_connection.recv(1024).decode()
                #print(request)

                headers = request.replace("\r","").split('\n')
                url = headers[0].split(" ")[1][1:]
                host = headers[1].split(" ")[1]
                self.script = web.decodeURI(url)
                fullurl = "http://"+host+"/"+url

                parsed = urllib.parse.urlparse(headers[0].split(" ")[1])
                # get the query string
                getparams = parsed.query
                # get the request path, this new path does not have the query string
                path = parsed.path


                isPostData = False
                postparams = {}
                for i, istr in enumerate(headers):
                    if isPostData:
                        #print(str(i)+" > "+headers[i])
                        if "=" in headers[i]:
                            d = headers[i].split("=")
                            postparams[d[0]] = d[1]
                    if headers[i] == "":
                        isPostData = True



                if not onrequest is None:
                    response = 'HTTP/1.0 200 OK\nContent-Type: text/javascript\nAccess-Control-Allow-Credentials: true\nAccess-Control-Allow-Methods: *\nAccess-Control-Allow-Origin: *\n\n' + onrequest(request)
                else:
                    # Return an HTTP response
                    response = 'HTTP/1.0 200 OK\n\n' + self.handle_request(request)+'\n\n'
                #print("response="+response)
                client_connection.sendall(response.encode())
                # Close connection
                client_connection.close()
        except:
            pass

        # Close socket
        server_socket.close()
        print("server restarting...")
        self.webserver(server, onrequest)


    def webserverHTTP(self, server = "0.0.0.0:8080", onrequest = None, useSSL = False, SSLCERT = "cert.pem", SSLKEY = "key.pem", verbose = False):

        # Define socket host and port
        if ':' in server:
            host = server.split(":")[0]
            port = int(server.split(":")[1])
        else:
            print('Error. Bad format for server. Must be "ip:port". Exemple 0.0.0.0:8080')
            quit()

        server_address = (host, port) # (address, port)
      
        httpd = SecureHTTPServer(server_address, onrequest, useSSL, SSLCERT, SSLKEY, verbose)

        sa = httpd.socket.getsockname()
        if useSSL:
            protocol ="HTTPS"
        else:
            protocol ="HTTP"

        print("Serving "+protocol+" on", sa[0], "port", sa[1], "...")
        #httpd.serve_forever()
        while True:
            httpd.handle_request()

    def webserverThread(self, host, onrequest, useSSL = False, SSLCERT = "cert.pem", SSLKEY = "key.pem", verbose = False):
        TTSThreadOpenServer(host, onrequest, useSSL, SSLCERT, SSLKEY, verbose)


    def handle_request(self, request):
        headers = request.split('\n')
        filename = headers[0].split(" ")[1]
        
        b = self.b64d(filename[1:])
        data = json.loads(b)
        #print(data["text"])
        #translatedText = argostranslate.translate.translate(data["text"], data["from"], data["to"])
        #print(translatedText)
        #return translatedText
        return "response"
        # Iterating over dictionary
        #for key in data:
        #    print(key," : ",data[key]);    
        #if filename == '/':
        #    filename = '/index.html'

        #try:
        #    fin = open('htdocs' + filename)
        #    content = fin.read()
        #    fin.close()

        #    response = 'HTTP/1.0 200 OK\n\n' + content
        #except FileNotFoundError:
        #    response = 'HTTP/1.0 404 NOT FOUND\n\nFile Not Found'

        #return response


class TTSThreadOpenURL(threading.Thread):
    def __init__(self, url, obj):
        threading.Thread.__init__(self)
        self.url = url
        self.obj = obj

        self.start()
        

    def run(self):
        try:
            #obj = urllib.parse.quote(obj)       # URL encode.
            response = requests.post(self.url, data = self.obj, verify = False)
            response.raise_for_status()
        except requests.exceptions.HTTPError as errh:
            print("HTTP Error")
            return {'result': False, 'text': ''}
        except requests.exceptions.ConnectionError as errc:
            print("Connection Error")
            return {'result': False, 'text': ''}
        except requests.exceptions.Timeout as errt:
            print("Timeout Error")
            return {'result': False, 'text': ''}
        except requests.exceptions.RequestException as err:
            print("Other Error")
            return {'result': False, 'text': ''}
        return {'result': True, 'text': response.text}
    

class TTSThreadOpenServer(threading.Thread):
    def __init__(self, host, onrequest, useSSL = False, SSLCERT = "cert.pem", SSLKEY = "key.pem", verbose = False):
        threading.Thread.__init__(self)
        self.host = host
        self.onrequest = onrequest
        self.useSSL = useSSL
        self.SSLCERT = SSLCERT
        self.SSLKEY = SSLKEY
        self.verbose = verbose
        self.start()

    def onrequest(self, request):
        headers = request.split('\n')
        filename = headers[0].split(" ")[1][1:]

    def run(self):
        self.web = MyWeb()
        self.web.webserverHTTP(self.host, self.onrequest, self.useSSL, self.SSLCERT, self.SSLKEY, self.verbose)


class MyHandlerHTTPS(BaseHTTPRequestHandler):
   
    def __init__(self, request, client_address, server, onquery = None, verbose = False):
        self.verbose = verbose
        self.onquery = onquery
        super().__init__(request, client_address, server)
        pass
    """
    def do_HEAD(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
    """
    def _onQuery(self):
        if self.path == "/favicon.ico":
            return
        # POST
        try:
            content_length = int(self.headers.get("Content-Length"))
            body = self.rfile.read(content_length)
            postparams = {}
            for i, v in urllib.parse.parse_qsl(body):
                postparams[i.decode("utf-8")] = v.decode("utf-8")
        except:
            postparams = {}
            pass
        # GET
        parsed = urllib.parse.urlparse(self.path)
        getparams = {}
        for i, v in urllib.parse.parse_qsl(parsed.query):
            getparams[i] = v

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_header("Access-Control-Allow-Origin", "*")
               
        self.end_headers()

        if not self.onquery is None:
            result = self.onquery({"path":parsed.path,"get":getparams,"post":postparams})
            self.wfile.write(bytes(result, "utf-8"))
        else:
            """
            print(parsed.path)
            print(getparams)
            print(postparams)
            self.wfile.write(bytes("It works", "utf-8"))

            """
            self.wfile.write(bytes("""
                <form method="post">
                    <input type="submit" name="test" value="ok">
                    <textarea name="test2">
                        test
                        test
                    </textarea>
                </form>
            """, "utf-8"))


    def do_GET(self):
        self._onQuery()

    def do_POST(self):
        self._onQuery()

    def do_OPTIONS(self):
        self._onQuery()
        """
        try:
            self._onQuery()
        except:
            pass
        """
        

    def log_message(self, format, *args):
        if self.verbose:
            message = format % args
            print("%s - - [%s] %s\n" %
                            (self.address_string(),
                            self.log_date_time_string(),
                            message.translate(self._control_char_table)))

class SecureHTTPServer(HTTPServer):
    def __init__(self, server_address, onrequest = None, useSSL = False, SSLCERT = "cert.pem", SSLKEY = "key.pem", verbose = False):
        self.onrequest = onrequest
        self.verbose = verbose
        if useSSL:
            BaseServer.__init__(self, server_address, None)
            ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            ctx.load_cert_chain(certfile=SSLCERT, keyfile=SSLKEY)
            self.socket = ctx.wrap_socket(socket.socket(self.address_family, self.socket_type), server_side=True)
            self.server_bind()
            self.server_activate()
        else:
            super().__init__(server_address, None, True)

    def finish_request(self, request, client_address):
        """Finish one request by instantiating RequestHandlerClass."""
        MyHandlerHTTPS(request, client_address, self, self.onrequest, self.verbose)
        pass

"""
print("start")
web = MyWeb()
rep = web.openURLGETCookies("https://ch-fr.indeed.com/viewjob?jk=dc1e72fdbbe883ad&from=vjs&tk=1hjnp99lpjrj9800&viewtype=embedded&advn=7746155536792217&adid=320232334&ad=-6NYlbfkN0CC__Bv3m7_O9THKOXV0EBucqFXQohDs0rEWW9QmAgHqtNqckNOox33JkbIlibPUrX-fafIek4v4Uh0xJqjiw2-EZz54fbhHqHzPNJcMwQAl2iPflH__CCj4pw7hFb8CzyaC07_LUzFHFB5FtPsAm-TT1P8TNZB5oWTnBcBnLuIYDTXouc2jwcpZkdLtEpzJJ7rwmAFdkL0aJH47imH40-Rlxq6KpvXUk1S0G1iwyA3M_2dUtiTgb-Jg_NK7VX4G1aLNqSVQVXBbmWd6z8YHhioSBbpX8ewLnGxHqnYYgsxqcTR9Np7Ahqb8Fwd-z0YK7RNLQqjb-9MBdtyryGCppEvwQjWpb4CX9boN2WkBCxFw85PJjYQA-xr8bFdUb6KeR9OpuBRD6Baro-2ylaNNPoPHjulJ7gxx0H3JS31847Xifb_WgzfMc8hl5nkkoci59Guh07O1HICoDDvch0UlfNkT6Rn0o2wbePOk_-VFVEMHhW6T_Go9Vwe7kdgg3OzbETuU9hGnS6cGmDyjrGpPmE53E2XiFoEsuUhUuQgQspQvr7QbnfFu0oiQQulr3zkm82jmKc4v7HKssOXBm7JsDxd0OjzSyRJEl04XP7mwFtMK63AvYSZz0bF9gfWyMDybBu3jCqaGGoEy8rA3gbzE3DzSziv529WXqfr_IQk4cMtgvxDJqN8MmPyj7MeD8NsrCm2L6DyYOxmzydLZD4Cn3PTa9eqTrojYFnDeL5YYvKRpzgMf8Eq1LDzflY32HVS6lerLWPdl36HZv5iXyYBtJoUDS5NU-Ht-mI0GRtmIRVScDWHZaPatIWePdATZoTE6Nh1eKoM66JMzLdK_RNs1k6M3lzEjGJnmUL2bRTH44E5zBfo_PGm7kJuHgj5eznMVo1c4KEJ4c3MYNh-UNyOS2mXhUzcnaMoDQaLn2K75jwvyKdB_Vap9VUn6l6cc5CN53c%3D&xkcb=SoCs6_M3G36q42SnWZ0LbzkdCdPP&continueUrl=%2Fjobs%3Fq%3Dd%25C3%25A9veloppeur%2Binformatique%26vjk%3Ddc1e72fdbbe883ad%26l%3Dgen%25C3%25A8ve%252C%2Bge&spa=1&hidecmpheader=0")
print("["+rep+"]")
"""

"""
TTSThreadOpenServer("0.0.0.0:12345", req)

"""


"""
def testHandler(params):
    print("cool")
    return "yeeeeee"


if __name__ == '__main__':
    web = MyWeb()
    web.webserverThread("0.0.0.0:8888", testHandler, True, "cert.pem", "key.pem")

    while True:
        time.sleep(5)
        print("tick")

"""
"""
# ====== HTTPS CLIENT ====== #
import socket
import ssl
import certifi
import os

# Create a place holder to consolidate SSL settings
# i.e., Create an SSLContext
contextInstance                 = ssl.SSLContext();
contextInstance.verify_mode     = ssl.CERT_REQUIRED;

# Load the CA certificates used for validating the peer's certificate
contextInstance.load_verify_locations(cafile=os.path.relpath(certifi.where()),
                                    capath=None,
                                    cadata=None);

# Create a client socket
socketInstance = socket.socket();

# Get an instance of SSLSocket
sslSocketInstance  = contextInstance.wrap_socket(socketInstance);

print(type(sslSocketInstance));
# Connect to a server
sslSocketInstance.connect(("example.org", 443));
print("Version of the SSL Protocol:%s"%sslSocketInstance.version());
print("Cipher used:");
print(sslSocketInstance.cipher());

"""

