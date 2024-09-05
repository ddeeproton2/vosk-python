
openssl genrsa -out private-key.pem 2048
openssl req -new -key private-key.pem -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey private-key.pem -out certificate.pem

openssl genrsa -out ca-private-key.pem 2048
openssl req -x509 -new -key ca-private-key.pem -days 3650 -out ca.pem

