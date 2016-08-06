//This file is not actually linked to the project;
//code here is provided for reference purposes.

int button = D2;
int buttonState;

void setup() {

    Particle.variable("buttonState", buttonState);

    Serial.begin(9600);

    pinMode(button, INPUT_PULLUP);

}

void loop() {

    buttonState = digitalRead(button);

    if (buttonState == LOW) {
        Particle.publish("buttonState");
        delay(2000);
    }

}
