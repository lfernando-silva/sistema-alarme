/*
 Name:    Alarme.ino
 Created: 8/27/2015 11:03:19 PM
 Author:  Luiz
*/

//Server Info
#define HOST "200.131.96.47"
#define PORT 3001

// APN data
#define GPRS_APN       "zap.vivo.com.br" // replace your GPRS APN
#define GPRS_LOGIN     "vivo"    // replace with your GPRS login
#define GPRS_PASSWORD  "vivo" // replace with your GPRS password

//LIBRARIES
#include <SoftwareSerial.h>
#include <SIM900.h>
#include "inetGSM.h"

//Global variables
boolean started = false;
InetGSM inet;

//SIM900 IMEI
char SERIAL_KEY_NUMBER[16] = "013950007601108";

void setup()
{
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
    SERIAL_KEY_NUMBER[15] = getYellowStatus();
    submit(SERIAL_KEY_NUMBER);
    endConnection();
  }
};

void endConnection() {
  sendATCommand("AT+CIPCLOSE", 500);
}

void submit(char* message)
{
  sendMessage("AT+CIPSEND=16", message, 1000);
  sendATCommand("AT+CIPSHUT", 100);
}

void sendATCommand(char* command, int d) {
  gsm.SimpleWriteln(command);
  delay(d);
}

void sendMessage(char* command, char* message, int d) {
  sendATCommand(command, d);
  gsm.SimpleWriteln(message);
  gsm.SimpleWriteln((char)26);
  char state;
  int i = 0;
  for (i = 0; i < 15; i++) {
    state = (char)gsm.read();
    if ((state == '1') || (state == '2')) {
      break;
    }
  }
  acendeLed(state);
}

void acendeLed(char state) {
  switch (state) {
    case '1': {
        Serial.println("ACENDE LED VERMELHO");
        break;
      }
    case '2': {
        Serial.println("ACENDE LED VERDE");
        break;
      }
  }
}

char getYellowStatus(){
    return '0';
}

