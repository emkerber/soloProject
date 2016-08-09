//Code that is flashed to the Particle Photon is below
//This file is not actually linked to the project
//Code here is provided for reference purposes

int button = D2;
int buttonState;

void setup() {

    Particle.variable("buttonState", buttonState);

    pinMode(button, INPUT_PULLUP);

}

void loop() {

    buttonState = digitalRead(button);

    if (buttonState == LOW) {
        Particle.publish("button pressed");
        delay(2000);
    }

}
