FROM mcr.microsoft.com/dotnet/sdk:6.0 as build
ARG Configuration=Debug

EXPOSE 80
WORKDIR /usr/shared/app

#restoring dependencies
COPY ./*.sln ./
COPY API/*.csproj ./API/
COPY Application/*.csproj ./Application/
COPY Persistence/*.csproj ./Persistence/
COPY Domain/*.csproj ./Domain/
COPY Infrastructure/*.csproj ./Infrastructure/

RUN --mount=type=cache,id=nuget-cache,target=/root/.nuget/packages \
  dotnet restore

# copying other neccessary data and building application
COPY ./ ./
RUN dotnet build -c $Configuration -o /build

RUN --mount=type=cache,id=nuget-cache,target=/root/.nuget/packages \
  dotnet publish -c $Configuration -o /publish --no-restore

#building a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine as publish
WORKDIR /usr/shared/app

ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:5000

COPY --from=build /publish ./

ENTRYPOINT ["dotnet", "API.dll"]