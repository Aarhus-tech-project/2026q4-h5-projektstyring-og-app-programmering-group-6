FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY LoebeApp.csproj ./
RUN dotnet restore LoebeApp.csproj

COPY . ./
RUN dotnet publish LoebeApp.csproj -c Release --no-restore -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

COPY --from=build /app/publish ./

USER $APP_UID
ENTRYPOINT ["sh", "-c", "exec dotnet LoebeApp.dll --urls \"http://0.0.0.0:${PORT:-8080}\""]