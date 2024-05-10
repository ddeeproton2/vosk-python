@rem Single file
@rem openssl req -new -x509 -keyout localhost.pem -out localhost.pem -days 365 -nodes

@rem Key and Cert file
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem



pause