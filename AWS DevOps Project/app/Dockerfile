# Same image the pipeline produced (Tomcat serving webapp.war at /webapp),
# with a Maven build stage so it can be built from source in one command:
#   docker build -t regapp .   (run from this app/ directory)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /src
COPY pom.xml .
COPY webapp/pom.xml webapp/
RUN mvn -q -B dependency:go-offline
COPY webapp/src webapp/src
RUN mvn -q -B package

FROM tomcat:9.0-jre17-temurin
COPY --from=build /src/webapp/target/webapp.war /usr/local/tomcat/webapps/
EXPOSE 8080
CMD ["catalina.sh", "run"]
