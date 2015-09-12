/*
 Name:    Alarme.ino
 Created: 8/27/2015 11:03:19 PM
 Author:  Luiz
*/

//Server Info
#define HOST "200.131.96.47"
#define PORT "1000"
#define CONNECTION_TYPE "TCP"

// PIN Number
#define PINNUMBER "8955312029926239533"

// APN data
#define GPRS_APN       "zap.vivo.com.br" // replace your GPRS APN
#define GPRS_LOGIN     "vivo"    // replace with your GPRS login
#define GPRS_PASSWORD  "vivo" // replace with your GPRS password

//RX TX
#define rx 2
#define tx 3

#include <SoftwareSerial.h>
#include <SIM900.h>

SoftwareSerial client = SoftwareSerial(rx, tx); // configure software serial port
boolean started = false;

String attachedAPN = concatenate("AT+CSTT=", GPRS_APN, GPRS_LOGIN, GPRS_PASSWORD);
String connection = concatenate("AT+CIPSTART=", CONNECTION_TYPE, HOST, PORT);

void setup()
{
  pinMode(rx, INPUT);
  pinMode(tx, OUTPUT);
  //Serial connection.
  client.begin(9600);
  Serial.begin(9600);
  Serial.println("GSM Shield testing.");

  if (gsm.begin(9600)) {
    Serial.println("\nstatus=READY");
    started = true;
  } else {
    Serial.println("\nstatus=IDLE");
  };
}

void loop()
{
  if (started) {
    Serial.println("Start" );
    getConnection();
    submit("01");
    Serial.println("Finish" );
    endConnection();
    delay(10000);
  }
};

void getConnection() {
  sendATCommand("AT+CREG?", 1000);
  showSerialData();
  sendATCommand("AT+CGATT=1", 1000);
  sendATCommand("AT+CIPSHUT", 1000);
  sendATCommand("AT+CIPSTATUS", 1000);
  sendATCommand("AT+CIPMUX=0", 1000);
  sendATCommand(attachedAPN, 1000);
  sendATCommand("AT+CIICR", 1000);
  sendATCommand("AT+CIFSR", 1000);
  sendATCommand(connection, 1000);
}

void endConnection() {
  sendATCommand("AT+CIPCLOSE", 1000);
}

void submit(String message)
{
  sendMessage("AT+CIPSEND=2", message, 1000);
  sendATCommand("AT+CIPSHUT", 1000);
}

void sendATCommand(String command, int d) {
  client.println(command);
  delay(d);
}

void sendMessage(String command, String message, int d) {
  Serial.println("ENVIANDO COMANDO");
  sendATCommand(command, d);
  client.println(message);
  client.println((char)26, 2000);
  delay(500);
}

String concatenate(String command, String p1, String p2, String p3) {

  String s = command + "\"" + p1 + "\",\"" + p2 + "\",\"" + p3 + "\""; //AT... = "p1","p2","p3"
  return s;
}

void showSerialData()
{
  Serial.println("SERIAL CONTÉM: ");
  while (client.available() != 0)
    Serial.write(char (client.read()));
}
