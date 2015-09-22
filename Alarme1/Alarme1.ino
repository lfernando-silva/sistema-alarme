/*
 Name:    Alarme.ino
 Created: 8/27/2015 11:03:19 PM
 Author:  Luiz
*/

//Server Info
#define HOST "200.131.96.47"
#define PORT 3001
#define CONNECTION_TYPE "TCP"

// PIN Number
#define PINNUMBER "8955312029926239533" //19 caracteres

// APN data
#define GPRS_APN       "zap.vivo.com.br" // replace your GPRS APN
#define GPRS_LOGIN     "vivo"    // replace with your GPRS login
#define GPRS_PASSWORD  "vivo" // replace with your GPRS password

//RX TX
#define rx 2
#define tx 3

//LIBRARIES
#include <SoftwareSerial.h>
#include <SIM900.h>
#include "inetGSM.h"

//Global variables

boolean started = false;
InetGSM inet;

//CLIENT CONST
char SERIAL_KEY_NUMBER[7] = "123456";

void setup()
{
  pinMode(rx, INPUT);
  pinMode(tx, OUTPUT);
  //Serial connection.
  Serial.begin(9600);
  Serial.println("GSM Shield testing.");

  if (gsm.begin(9600)) {
    Serial.println("\nstatus=READY");
    //started = true;
    if (inet.attachGPRS(GPRS_APN, GPRS_LOGIN, GPRS_PASSWORD)) {
      Serial.println("status=ATTACHED");
      if (inet.connectTCP(HOST, PORT)) {
        started = true;
      }
    } else {
      Serial.println("status=ERROR");
    }
  }
}

void loop()
{
  if (started) {
    Serial.println("Start");
    submit(SERIAL_KEY_NUMBER);
    Serial.println("Finish");
    endConnection();
  }
};

void endConnection() {
  sendATCommand("AT+CIPCLOSE", 500);
}

void submit(char* message)
{
  sendMessage("AT+CIPSEND=6", message, 2000);
  sendATCommand("AT+CIPSHUT", 100);
}

void sendATCommand(char* command, int d) {
  Serial.println("ENVIANDO COMANDO");
  gsm.SimpleWriteln(command);
  delay(d);
}

void sendMessage(char* command, char* message, int d) {
  Serial.println("ENVIANDO MENSAGEM");
  sendATCommand(command, d);
  gsm.SimpleWriteln(message);
  gsm.SimpleWriteln((char)26);
  char msg[1];
  gsm.read(msg,2);
  Serial.println(msg);
}

