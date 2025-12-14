import type { User, Project } from '@/lib/types';

export const coreMembers: User[] = [
  {
    id: 'harsha-sai',
    name: 'HARSHA SAI',
    designation: 'Founder, Hardware Specialist',
    photoUrl: 'https://picsum.photos/seed/101/400/400',
    projectsCount: 5,
    likesCount: 35,
  },
  {
    id: 'hemanth-venkat',
    name: 'HEMANTH VENKAT',
    designation: 'Circuit Designer, IoT Specialist',
    photoUrl: 'https://picsum.photos/seed/102/400/400',
    projectsCount: 4,
    likesCount: 28,
  },
  {
    id: 'kanishk-k',
    name: 'KANISHK K',
    designation: 'Co-Founder, Software Specialist',
    photoUrl: 'https://picsum.photos/seed/103/400/400',
    projectsCount: 6,
    likesCount: 42,
  },
  {
    id: 'shalini',
    name: 'SHALINI',
    designation: 'Chip Designer, Exhibitor',
    photoUrl: 'https://picsum.photos/seed/104/400/400',
    projectsCount: 3,
    likesCount: 22,
  },
  {
    id: 'shivani',
    name: 'SHIVANI',
    designation: 'Research Specialist, Marketing',
    photoUrl: 'https://picsum.photos/seed/105/400/400',
    projectsCount: 2,
    likesCount: 18,
  },
];

export const allUsers: User[] = [
  ...coreMembers,
  {
    id: 'rahul-verma',
    name: 'Rahul Verma',
    designation: 'Embedded Systems Intern',
    photoUrl: 'https://picsum.photos/seed/106/400/400',
    projectsCount: 1,
    likesCount: 10,
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    designation: 'PCB Designer',
    photoUrl: 'https://picsum.photos/seed/107/400/400',
    projectsCount: 2,
    likesCount: 15,
  },
];

export const projects: Project[] = [
  {
    id: 'esp32-dht11-temperature-control',
    title: 'ESP32 to DHT11 Temperature Control',
    description: 'A comprehensive project detailing the integration of an ESP32 microcontroller with a DHT11 sensor to monitor and control ambient temperature. The system reads temperature and humidity data, displays it on an LCD, and can trigger a fan or heater based on set thresholds. This project is a great introduction to IoT and environmental monitoring.',
    sourceCode: `
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>

#define DHTPIN 4     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11   // DHT 11

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(9600);
  Serial.println(F("DHT11 test!"));
  
  dht.begin();
  
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.setCursor(0, 1);
  lcd.print("Humidity: ");
}

void loop() {
  // Wait a few seconds between measurements.
  delay(2000);

  // Reading temperature or humidity takes about 250 milliseconds!
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  lcd.setCursor(6, 0);
  lcd.print(t);
  lcd.print(" C");
  
  lcd.setCursor(10, 1);
  lcd.print(h);
  lcd.print(" %");

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.println(F("°C "));
}
    `,
    components: ['ESP32', 'DHT11 Sensor', '16x2 I2C LCD', 'Jumper Wires', 'Breadboard', 'Resistor'],
    doneBy: ['HARSHA SAI', 'HEMANTH VENKAT'],
    circuitDiagramUrl: 'https://picsum.photos/seed/201/800/600',
    circuitDiagramImageHint: 'circuit diagram'
  },
  {
    id: 'iot-smart-lighting',
    title: 'IoT Smart Lighting System',
    description: 'Control your home lighting from anywhere using a web interface. This project uses an ESP8266 and a relay module to toggle lights on and off. The web server on the ESP8266 provides a simple UI for control.',
    sourceCode: `
// Complete source code for a web-based smart lighting system...
    `,
    components: ['ESP8266', 'Relay Module', 'Power Supply', 'Light Bulb'],
    doneBy: ['KANISHK K'],
    circuitDiagramUrl: 'https://picsum.photos/seed/202/800/600',
    circuitDiagramImageHint: 'iot circuit'
  },
];

export const allData = {
  users: allUsers,
  projects: projects,
  coreMembers: coreMembers
}
