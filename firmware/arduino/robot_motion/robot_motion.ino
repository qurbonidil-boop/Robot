/*
 * robot_motion.ino
 *
 * "Рефлексҳо"-и робот: моторҳо, сенсори масофа, сари сервомотордор, чашмони LED.
 * Фармонҳоро аз Raspberry Pi тавассути USB Serial (115200 baud) мегирад.
 *
 * Протокол (ҳар фармон бо '\n' тамом мешавад):
 *   MOVE:<left>,<right>   left/right = -255..255
 *   STOP
 *   HEAD:<pan>,<tilt>     кунҷҳо 0..180
 *   EYES:<r>,<g>,<b>      0..255 ҳар як
 *   EYES:MODE:<name>      IDLE | LISTEN | THINK | TALK | BLINK
 *   PING                  -> ҷавоб "PONG"
 *
 * Аз Arduino ба Raspberry Pi фиристода мешавад:
 *   DIST:<cm>             ҳар ~200мс
 *   OBSTACLE              як маротиба, вақте монеа наздик пайдо мешавад
 */

#include <Servo.h>
#include <Adafruit_NeoPixel.h>

// ---------- Pin-ҳо ----------
const uint8_t PIN_L_IN1 = 7,  PIN_L_IN2 = 8,  PIN_L_PWM = 5;   // мотори чап
const uint8_t PIN_R_IN1 = 12, PIN_R_IN2 = 13, PIN_R_PWM = 6;   // мотори рост

const uint8_t PIN_TRIG = A0, PIN_ECHO = A1;                    // HC-SR04

const uint8_t PIN_SERVO_PAN = 9, PIN_SERVO_TILT = 10;

const uint8_t PIN_EYES = 3;
const uint8_t NUM_PIXELS_PER_EYE = 8;
const uint8_t NUM_PIXELS = NUM_PIXELS_PER_EYE * 2;

// ---------- Бехатарӣ ----------
const int OBSTACLE_STOP_CM = 15;   // агар масофа аз ин камтар шавад — мотор бозмеистад
const unsigned long SENSOR_INTERVAL_MS = 200;

// ---------- Объектҳо ----------
Servo servoPan;
Servo servoTilt;
Adafruit_NeoPixel eyes(NUM_PIXELS, PIN_EYES, NEO_GRB + NEO_KHZ800);

// ---------- Ҳолат ----------
int targetLeftSpeed = 0;
int targetRightSpeed = 0;
long lastDistanceCm = -1;
unsigned long lastSensorReadMs = 0;
bool obstacleActive = false;

String eyeMode = "IDLE";
uint8_t eyeR = 0, eyeG = 80, eyeB = 255;
unsigned long lastBlinkMs = 0;
bool blinkOn = true;

String serialBuffer;

// ---------- Мотор ----------
void setMotor(uint8_t inA, uint8_t inB, uint8_t pwmPin, int speed) {
  speed = constrain(speed, -255, 255);
  if (speed >= 0) {
    digitalWrite(inA, HIGH);
    digitalWrite(inB, LOW);
  } else {
    digitalWrite(inA, LOW);
    digitalWrite(inB, HIGH);
    speed = -speed;
  }
  analogWrite(pwmPin, speed);
}

void applyMotors() {
  // агар монеа наздик бошад, ҳаракати ба пеш иҷозат дода намешавад
  int left = targetLeftSpeed;
  int right = targetRightSpeed;
  if (obstacleActive && left > 0 && right > 0) {
    left = 0;
    right = 0;
  }
  setMotor(PIN_L_IN1, PIN_L_IN2, PIN_L_PWM, left);
  setMotor(PIN_R_IN1, PIN_R_IN2, PIN_R_PWM, right);
}

void stopMotors() {
  targetLeftSpeed = 0;
  targetRightSpeed = 0;
  applyMotors();
}

// ---------- Сенсори масофа ----------
long readDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  long duration = pulseIn(PIN_ECHO, HIGH, 25000UL); // timeout ~4м
  if (duration == 0) return -1; // чизе ёфт нашуд
  return duration / 58; // ба сантиметр
}

// ---------- Чашмҳо ----------
void setEyesColor(uint8_t r, uint8_t g, uint8_t b) {
  eyeR = r; eyeG = g; eyeB = b;
  for (uint16_t i = 0; i < NUM_PIXELS; i++) {
    eyes.setPixelColor(i, eyes.Color(r, g, b));
  }
  eyes.show();
}

void updateEyesAnimation() {
  unsigned long now = millis();
  if (eyeMode == "BLINK") {
    if (now - lastBlinkMs > 350) {
      lastBlinkMs = now;
      blinkOn = !blinkOn;
      if (blinkOn) setEyesColor(eyeR, eyeG, eyeB);
      else setEyesColor(0, 0, 0);
    }
  } else if (eyeMode == "THINK") {
    // милтиш зуд = фикр кардан
    if (now - lastBlinkMs > 120) {
      lastBlinkMs = now;
      blinkOn = !blinkOn;
      uint8_t level = blinkOn ? 255 : 40;
      setEyesColor((uint16_t)eyeR * level / 255, (uint16_t)eyeG * level / 255, (uint16_t)eyeB * level / 255);
    }
  }
  // IDLE / LISTEN / TALK — рангашон бо EYES:<r,g,b> ё пешфарзи ҳолат таъин мешавад
}

void setEyeMode(const String &mode) {
  eyeMode = mode;
  if (mode == "LISTEN") setEyesColor(0, 120, 255);      // кабуд
  else if (mode == "THINK") setEyesColor(255, 200, 0);  // зард
  else if (mode == "TALK") setEyesColor(0, 220, 90);    // сабз
  else if (mode == "IDLE") setEyesColor(40, 40, 40);    // хира
  else if (mode == "BLINK") { /* ранги ҷорӣ мемонад */ }
}

// ---------- Коркарди фармонҳо ----------
void handleCommand(String line) {
  line.trim();
  if (line.length() == 0) return;

  if (line == "PING") {
    Serial.println("PONG");
  } else if (line == "STOP") {
    stopMotors();
  } else if (line.startsWith("MOVE:")) {
    int commaIdx = line.indexOf(',');
    if (commaIdx > 0) {
      int l = line.substring(5, commaIdx).toInt();
      int r = line.substring(commaIdx + 1).toInt();
      targetLeftSpeed = constrain(l, -255, 255);
      targetRightSpeed = constrain(r, -255, 255);
      applyMotors();
    }
  } else if (line.startsWith("HEAD:")) {
    int commaIdx = line.indexOf(',');
    if (commaIdx > 0) {
      int pan = line.substring(5, commaIdx).toInt();
      int tilt = line.substring(commaIdx + 1).toInt();
      servoPan.write(constrain(pan, 0, 180));
      servoTilt.write(constrain(tilt, 0, 180));
    }
  } else if (line.startsWith("EYES:MODE:")) {
    setEyeMode(line.substring(10));
  } else if (line.startsWith("EYES:")) {
    String rest = line.substring(5);
    int c1 = rest.indexOf(',');
    int c2 = rest.indexOf(',', c1 + 1);
    if (c1 > 0 && c2 > c1) {
      uint8_t r = rest.substring(0, c1).toInt();
      uint8_t g = rest.substring(c1 + 1, c2).toInt();
      uint8_t b = rest.substring(c2 + 1).toInt();
      eyeMode = "IDLE";
      setEyesColor(r, g, b);
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(PIN_L_IN1, OUTPUT);
  pinMode(PIN_L_IN2, OUTPUT);
  pinMode(PIN_L_PWM, OUTPUT);
  pinMode(PIN_R_IN1, OUTPUT);
  pinMode(PIN_R_IN2, OUTPUT);
  pinMode(PIN_R_PWM, OUTPUT);

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  servoPan.attach(PIN_SERVO_PAN);
  servoTilt.attach(PIN_SERVO_TILT);
  servoPan.write(90);
  servoTilt.write(90);

  eyes.begin();
  setEyeMode("IDLE");

  stopMotors();
  serialBuffer.reserve(64);
}

void loop() {
  // хондани фармонҳо аз Raspberry Pi
  while (Serial.available() > 0) {
    char c = Serial.read();
    if (c == '\n') {
      handleCommand(serialBuffer);
      serialBuffer = "";
    } else if (c != '\r') {
      serialBuffer += c;
    }
  }

  // хондани сенсор ва фиристодани маълумот
  unsigned long now = millis();
  if (now - lastSensorReadMs >= SENSOR_INTERVAL_MS) {
    lastSensorReadMs = now;
    long d = readDistanceCm();
    if (d > 0) {
      lastDistanceCm = d;
      Serial.print("DIST:");
      Serial.println(d);

      bool wasObstacle = obstacleActive;
      obstacleActive = (d < OBSTACLE_STOP_CM);
      if (obstacleActive && !wasObstacle) {
        Serial.println("OBSTACLE");
        applyMotors(); // фавран мотори пешравиро бозмедорад
      }
    }
  }

  updateEyesAnimation();
}
