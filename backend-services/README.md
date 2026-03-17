# Sight-Sound-Walk :: Microservices Ecosystem

Welcome to the modernized backend of the Sight-Sound-Walk project! This architecture is built with **Quarkus**, designed for massive scalability, low latency, and deep AI integration, following the **Quarkus Super Heroes** pattern.

## 🏗️ Architecture Overview

The system is split into multiple specialized services:

1.  **`narration-service` (Java/OpenAI)**: 
    *   **Role**: Generates immersive "Sound" for the tour.
    *   **Feature**: Implements "Time Travel" mode, narrating monuments in Ancient, Medieval, or Modern settings.
    *   **Tech**: Quarkus LangChain4j + OpenAI.
2.  **`location-service` (Kotlin/gRPC)**: 
    *   **Role**: Manages the "Sight" data.
    *   **Feature**: High-precision 3D coordinates and model assets for the Map Engine.
    *   **Tech**: Kotlin + gRPC + MariaDB.
3.  **`stats-stream` (Kafka/WS)**: 
    *   **Role**: Processes the "Flow".
    *   **Feature**: Real-time crowd density and traffic flow processing for the dashboard.
    *   **Tech**: SmallRye Reactive Messaging + Kafka.

---

## ⚡ Getting Started (Local Development)

### Prerequisites
*   **Java 21+** (You have Java 25.0.2!)
*   **Docker/Podman** (Required for Dev Services)
*   **OpenAI API Key** (Set in `narration-service/src/main/resources/application.properties`)

### Running the services
Each service can be run independently using the Quarkus Dev Mode:

```bash
# Start Narration Service
cd backend-services/narration-service
./mvnw quarkus:dev

# Start Location Hub
cd backend-services/location-service
./mvnw quarkus:dev
```

## ☁️ Deployment Strategy

Each service is ready for **Google Cloud Run** deployment as a **Native Executable**.
*   **Command**: `./mvnw package -Dnative -Dquarkus.native.container-build=true`
*   **Benefit**: Instant startup (< 0.1s) and very low memory consumption.

---
> [!TIP]
> Use the **Swagger UI** to test the services once they are running:
> *   `narration-service`: [http://localhost:8087/q/swagger-ui](http://localhost:8087/q/swagger-ui)
> *   `location-service`: [http://localhost:8081/q/swagger-ui](http://localhost:8081/q/swagger-ui)
