@rem Single file
@rem openssl req -new -x509 -keyout localhost.pem -out localhost.pem -days 365 -nodes

@rem Key and Cert file
@rem openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem



C:\OpenSSL\openssl genpkey -algorithm RSA -out private-key.pem
C:\OpenSSL\openssl req -new -key private-key.pem -out server.csr
C:\OpenSSL\openssl x509 -req -days 365 -in server.csr -signkey private-key.pem -out certificate.pem
C:\OpenSSL\openssl genpkey -algorithm RSA -out ca-private-key.pem
C:\OpenSSL\openssl req -x509 -new -key ca-private-key.pem -out ca.pem

pause