FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["src/API/MessagingPlatform.API.csproj", "API/"]
COPY ["src/Application/MessagingPlatform.Application.csproj", "Application/"]
COPY ["src/Domain/MessagingPlatform.Domain.csproj", "Domain/"]
COPY ["src/Infrastructure/MessagingPlatform.Infrastructure.csproj", "Infrastructure/"]

RUN dotnet restore "API/MessagingPlatform.API.csproj"

COPY src/ .
WORKDIR "/src/API"
RUN dotnet build "MessagingPlatform.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MessagingPlatform.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

ENTRYPOINT ["dotnet", "MessagingPlatform.API.dll"]
