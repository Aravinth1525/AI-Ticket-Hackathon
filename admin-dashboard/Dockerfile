FROM maven:3.8.7-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -f pom.xml -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/admin-dashboard-0.0.1-SNAPSHOT.jar ./admin.jar
EXPOSE 9090
CMD ["java","-jar","admin.jar"]
