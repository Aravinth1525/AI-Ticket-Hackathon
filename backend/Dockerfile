# build stage
FROM maven:3.8.7-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -f pom.xml -DskipTests package

# runtime
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar ./backend.jar
EXPOSE 8080
CMD ["java","-jar","backend.jar"]
