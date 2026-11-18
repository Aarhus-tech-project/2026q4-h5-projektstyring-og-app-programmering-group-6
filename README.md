# LøbeApp

H5-projekt af Mikkel Jepsen. LøbeApp registrerer løbe- og gåture med telefonens GPS i forgrunden eller med en simuleret rute. Under turen vises tid, distance, aktuel pace og rute. Afsluttede ture gemmes gennem et REST API og kan åbnes fra historikken. Statistik viser samlet distance, aktivitetstid og personlige rekorder på 1, 3, 5 og 10 km.

## Projektstruktur

```text
Backend/LoebeApp/
  LoebeApp.slnx             Solution
  LoebeApp/                 ASP.NET Core API
  LoebeApp.Tests/           Automatiske backendtests
mobile/                     React Native-app med Expo og TypeScript
docker/compose.yml          Lokal PostgreSQL-container
Dokumentation/              Projektgrundlag, diagrammer og rapportmateriale
```

Kommandoerne nedenfor er skrevet til PowerShell på Windows. Åbn terminalen i repositoryets rod, medmindre et andet sted er angivet. `npm.cmd` og `npx.cmd` kan bruges uden at ændre PowerShells execution policy.

## Teknologier og forudsætninger

| Del | Anvendte teknologier | Nødvendigt ved lokal opstart |
| --- | --- | --- |
| Mobilapp | Expo SDK 58, React Native 0.88, React 19, TypeScript 6 | Node.js og npm. Projektet er udviklet med Node.js 22. Android Studio med en startet emulator eller en fysisk Android-telefon med en kompatibel Expo Go. |
| API | C#, ASP.NET Core og .NET 10 | .NET 10 SDK |
| Databaseadgang | Entity Framework Core 10 og Npgsql | EF Core-værktøj ved anvendelse af migrationer |
| Lokal database | PostgreSQL 18 | Docker Desktop med Linux-containere og Docker Compose |
| Tests | xUnit, NSubstitute og Testcontainers | .NET 10 SDK. Integrationstests kræver kørende Docker Desktop. |

Mobilappen er afprøvet på Android. iOS er endnu ikke verificeret. Versionsangivelser og afhængigheder findes i [package.json](mobile/package.json), [API-projektfilen](Backend/LoebeApp/LoebeApp/LoebeApp.csproj) og [testprojektfilen](Backend/LoebeApp/LoebeApp.Tests/LoebeApp.Tests.csproj). Brug `package-lock.json` gennem `npm.cmd ci` til at installere mobilafhængighederne.

## Hurtig opstart af mobilappen

Mobilens API-adresse er angivet i [mobile/src/config/api.ts](mobile/src/config/api.ts). Ved README-filens udarbejdelse peger den på det hostede API på [https://loebeapp-api.hostless.app](https://loebeapp-api.hostless.app). Tilgængeligheden og den deployede version afhænger af Hostless-installationen. Lokal opstart af hele løsningen er beskrevet nedenfor.

Start en Android-emulator fra Android Studios Device Manager, og kør fra projektets rod:

```powershell
Set-Location mobile
npm.cmd ci
npx.cmd expo start --go --android
```

Expo skal bruge en Expo Go-version, som understøtter projektets SDK. Tryk `a` i Expo-terminalen, hvis appen ikke åbnes automatisk. Ved problemer med en gammel Metro-cache kan opstarten gentages med:

```powershell
npx.cmd expo start --go --clear --android
```

På en fysisk telefon kan Expo Go åbne QR-koden fra `npx.cmd expo start --go`, når telefonen kan nå udviklingscomputeren. En selvstændig Android-build beskrives længere nede.

### Afprøv et brugerforløb

1. Opret en konto med en ubrugt e-mailadresse. Adgangskoden skal have mindst 10 tegn samt et stort bogstav, et lille bogstav, et tal og et specialtegn.
2. Log ind med kontoen.
3. Åbn en ny aktivitet og vælg mockregistrering for at bruge kendte GPS-data. Telefonens GPS kræver placeringstilladelse og registrerer i forgrunden.
4. Kontroller tid, distance, pace og rute. Mockruten er cirka 1,15 km og kan bruges til en længere demonstration af en 1 km-rekord.
5. Afslut turen. Appen forsøger at overføre den til API'et og åbner detaljerne efter vellykket upload og lokal oprydning.
6. Find turen i historikken og åbn statistik fra forsiden.

Der følger ingen fælles testkonto med. Statistikfunktionerne findes i kildekoden; den tidligere dokumenterede Hostless-deployment bekræfter ikke, at den nyeste statistikfunktion og migration er deployet. Brug den lokale backend, hvis cloudversionen mangler funktioner.

## Start hele løsningen lokalt

### 1. Start PostgreSQL

Opret filen `docker/.env` med dit eget lokale databasepassword:

```dotenv
POSTGRES_PASSWORD=ERSTAT_MED_DIT_LOKALE_PASSWORD
```

Start Docker Desktop, og kør fra repositoryets rod:

```powershell
docker compose --env-file docker/.env -f docker/compose.yml up -d
docker compose --env-file docker/.env -f docker/compose.yml ps
docker compose --env-file docker/.env -f docker/compose.yml exec postgres pg_isready -U loebeapp -d loebeapp
```

Databasen hedder `loebeapp`, brugeren hedder `loebeapp`, og porten er `127.0.0.1:5432`. Data ligger i et navngivet Docker-volume. Passwordet i API'ets forbindelse skal matche værdien, containeren blev initialiseret med. En senere ændring i `.env` ændrer ikke automatisk passwordet i et eksisterende database-volume.

### 2. Konfigurer API'et

Kør følgende fra repositoryets rod. Erstat password og JWT-nøgle inden kørsel. JWT-nøglen skal være en tilfældig, hemmelig værdi på mindst 32 bytes. Eksemplerne er pladsholdere.

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=127.0.0.1;Port=5432;Database=loebeapp;Username=loebeapp;Password=ERSTAT_MED_DIT_LOKALE_PASSWORD" --project Backend/LoebeApp/LoebeApp
dotnet user-secrets set "Jwt:Issuer" "LoebeApp" --project Backend/LoebeApp/LoebeApp
dotnet user-secrets set "Jwt:Audience" "LoebeApp.Mobile" --project Backend/LoebeApp/LoebeApp
dotnet user-secrets set "Jwt:Key" "ERSTAT_MED_EN_TILFAELDIG_HEMMELIG_NOEGLE_PAA_MINDST_32_BYTES" --project Backend/LoebeApp/LoebeApp
dotnet user-secrets set "Jwt:ExpirationMinutes" "60" --project Backend/LoebeApp/LoebeApp
```

API-projektet har allerede et User Secrets-id. User Secrets bruges til lokal udvikling. Filen `docker/.env` og værdier som password og JWT-nøgle skal holdes uden for repositoryet.

### 3. Installer værktøj og anvend migrationer

```powershell
dotnet restore Backend/LoebeApp/LoebeApp.slnx
dotnet tool install --global dotnet-ef --version 10.0.14
dotnet ef database update --project Backend/LoebeApp/LoebeApp --startup-project Backend/LoebeApp/LoebeApp -- --environment Development
```

Hvis `dotnet-ef` allerede er installeret, kontroller versionen med `dotnet ef --version`. Brug `dotnet tool update --global dotnet-ef --version 10.0.14`, hvis den skal tilpasses. I Visual Studios Package Manager Console kan migrationerne alternativt anvendes med `Update-Database`, når API'et er valgt som startprojekt og standardprojekt.

De eksisterende migrationer opretter Users, Activities og PersonalRecords. Opret ikke en ny migration alene for at starte projektet.

### 4. Start API'et

```powershell
dotnet run --project Backend/LoebeApp/LoebeApp --launch-profile http
```

API'et lytter på `http://localhost:5248` i Development. Åbn [Swagger](http://localhost:5248/swagger) for at afprøve endpoints. OpenAPI-kontrakten findes på [http://localhost:5248/openapi/v1.json](http://localhost:5248/openapi/v1.json). Swagger og OpenAPI aktiveres kun i Development. Den lokale HTTP-profil kræver ikke et udviklingscertifikat.

### 5. Forbind mobilappen til det lokale API

Ret den aktive eksport i [mobile/src/config/api.ts](mobile/src/config/api.ts) til:

```typescript
export const API_BASE_URL = "http://10.0.2.2:5248";
```

`10.0.2.2` giver Android Studios emulator adgang til udviklingscomputeren. Start derefter Expo som beskrevet ovenfor. Behold API-terminalen åben.

En alternativ USB-/emulatoropsætning bruger ADB-viderestilling:

```powershell
adb reverse tcp:5248 tcp:5248
adb reverse tcp:8081 tcp:8081
```

Brug i den opsætning `http://localhost:5248` som mobilens API-adresse og start Expo med `npx.cmd expo start --go --localhost`. Telefonen skal være tilsluttet med godkendt USB-debugging. `adb` følger med Android SDK Platform Tools. Ved flere tilsluttede enheder vælges den relevante enhed med `adb -s ENHEDS_ID reverse ...`. Viderestilling kan skulle sættes op igen efter genstart.

## Hvor sker tingene i koden?

### Mobilapp

Stierne i tabellen er relative til `mobile/src/`.

| Ansvar | Filer og mapper |
| --- | --- |
| Indgangspunkt og navigation | [app/_layout.tsx](mobile/src/app/_layout.tsx) opretter tema-, SQLite- og auth-providers. [app/index.tsx](mobile/src/app/index.tsx) vælger login eller forside efter sessionen. De øvrige rutefiler åbner deres respektive skærme. Det aktive indgangspunkt er Expo Router som angivet i `package.json`. |
| Konto og login | [features/auth/screens](mobile/src/features/auth/screens) indeholder formularerne. [authApi.ts](mobile/src/features/auth/api/authApi.ts) sender login og registrering til API'et. |
| Fælles loginstatus | [AuthProvider.tsx](mobile/src/features/auth/context/AuthProvider.tsx) indlæser og deler sessionen. [useAuth.ts](mobile/src/features/auth/context/useAuth.ts) læser bruger-id fra tokenet til lokal tilknytning. Backend validerer tokenet ved beskyttede kald. |
| Tokenlagring og logout | [sessionStorage.ts](mobile/src/features/auth/storage/sessionStorage.ts) gemmer token og udløbstid i SecureStore og kontrollerer udløbstiden ved indlæsning. [AccountMenu.tsx](mobile/src/features/auth/components/AccountMenu.tsx) giver adgang til logout. |
| Forside og historik | [HomeScreen.tsx](mobile/src/features/home/screens/HomeScreen.tsx) viser historikken. [useActivityHistory.ts](mobile/src/features/activity/hooks/useActivityHistory.ts) henter listen ved fokus på skærmen. |
| Start og afslutning af tur | [ActivityScreen.tsx](mobile/src/features/activity/screens/ActivityScreen.tsx) forbinder knapper, tilladelse, tidtagning og optager. [ActivityManager.ts](mobile/src/features/activity/managers/ActivityManager.ts) opretter og afslutter aktiviteter lokalt samt uploader før lokal sletning. |
| Telefonens GPS | [DeviceGpsSource.ts](mobile/src/features/activity/gps/DeviceGpsSource.ts) abonnerer på forgrundspositioner og filtrerer koordinater, usikkerhed over 20 meter og bevægelse under 5 meter fra sidst accepterede position. |
| Simuleret GPS | [MockGpsSource.ts](mobile/src/features/activity/gps/MockGpsSource.ts) leverer den faste rute fra [mockRoute.ts](mobile/src/features/activity/gps/mockRoute.ts). |
| Fælles optager | [GpsRecorder.ts](mobile/src/features/activity/gps/GpsRecorder.ts) gemmer punkter sekventielt gennem manageren, summerer distance og beregner pace i et cirka 10-sekunders vindue. Den venter cirka to sekunder mellem registreringsforsøg. |
| Beregninger | [calculations](mobile/src/features/activity/calculations) indeholder distance via Turf, pace og kortretning. [formatPace.ts](mobile/src/formatting/formatPace.ts) formaterer sekunder pr. kilometer til min:sek. |
| Lokal database | [initializeDatabase.ts](mobile/src/data/initializeDatabase.ts) opretter tabeller og aktiverer fremmednøgler. [repositories](mobile/src/features/activity/repositories) udfører parameteriserede SQLite-kald. |
| Aktivitetsupload | [activityModelToDto.ts](mobile/src/features/activity/mappers/activityModelToDto.ts) danner requesten. [activityApi.ts](mobile/src/features/activity/api/activityApi.ts) uploader med token og kræver HTTP 201. |
| Fælles GET-kald | [getAuthenticatedData.ts](mobile/src/api/getAuthenticatedData.ts) håndterer token, timeout og fejl ved hentning af historik, detaljer og statistik. |
| Kort og detaljer | [components](mobile/src/features/activity/components) indeholder kort, positionspil, kontrolpanel og historikkort. [ActivityDetailsScreen.tsx](mobile/src/features/activity/screens/ActivityDetailsScreen.tsx) henter turens data og viser ruten. |
| Statistik | [features/statistic](mobile/src/features/statistic) indeholder API-kald, hook og skærm til samlet tid, distance og rekorder. |
| Tema og API-adresse | [theme.ts](mobile/src/theme/theme.ts) samler appens mørke tema. [api.ts](mobile/src/config/api.ts) vælger backendadressen. |

### Backend

Stierne er relative til `Backend/LoebeApp/LoebeApp/`.

| Ansvar | Filer og mapper |
| --- | --- |
| Opstart og afhængigheder | [Program.cs](Backend/LoebeApp/LoebeApp/Program.cs) registrerer EF Core, managers, repositories, passwordhasher, JWT-validering, fejlhåndtering og Swagger. |
| API-kald | [AuthController](Backend/LoebeApp/LoebeApp/Controllers/Auth/AuthController.cs) modtager register/login. [ActivitiesController](Backend/LoebeApp/LoebeApp/Controllers/Activities/ActivityController.cs) kræver JWT og læser ejer-id fra tokenets `sub`. |
| Indgående og udgående data | [DTOs](Backend/LoebeApp/LoebeApp/DTOs) beskriver API-kontrakten. Valideringsattributter på requests kontrollerer blandt andet koordinater og ikke-negative værdier. |
| Konto, hashing og login | [AuthManager.cs](Backend/LoebeApp/LoebeApp/Managers/Auth/AuthManager.cs) normaliserer e-mail, kontrollerer passwordkrav, bruger PasswordHasher og kalder TokenProvider ved login. |
| Aktivitetslogik | [ActivityManager.cs](Backend/LoebeApp/LoebeApp/Managers/Activities/ActivityManager.cs) validerer id og tidsrækkefølge, beregner gennemsnitstempo og kalder mapper, rekordberegning og repository. |
| Rekorder | [PersonalRecordCalculator.cs](Backend/LoebeApp/LoebeApp/Calculations/Activities/PersonalRecordCalculator.cs) søger efter hurtigste delstrækninger på de fire rekorddistancer og estimerer tidspunkter mellem GPS-punkter. [GpsDistance.cs](Backend/LoebeApp/LoebeApp/Calculations/Activities/GpsDistance.cs) beregner afstand mellem punkter. |
| Mapping | [Mappers](Backend/LoebeApp/LoebeApp/Mappers) omformer requests til modeller og modeller til historik-, detalje- og statistiksvar. Starttid normaliseres til UTC ved aktivitetsupload. |
| Databasekald | [UserRepository.cs](Backend/LoebeApp/LoebeApp/Repositories/Users/UserRepository.cs) henter/gemmer brugere. [ActivityRepository.cs](Backend/LoebeApp/LoebeApp/Repositories/Activities/ActivityRepository.cs) gemmer aktiviteter og rekorder i en transaktion og henter ejerfiltrerede aktiviteter og statistik. |
| Datamodel og relationer | [Models](Backend/LoebeApp/LoebeApp/Models), [AppDbContext.cs](Backend/LoebeApp/LoebeApp/Data/AppDbContext.cs) og [Migrations](Backend/LoebeApp/LoebeApp/Migrations) beskriver modeller, tabeller, relationer, unikt e-mailindeks og JSONB-konvertering. |
| JWT | [TokenProvider.cs](Backend/LoebeApp/LoebeApp/Security/Tokens/TokenProvider.cs) signerer tokens med HMAC-SHA256. [JwtOptions.cs](Backend/LoebeApp/LoebeApp/Configuration/JwtOptions.cs) beskriver konfigurationen; `Program.cs` validerer den ved opstart og opsætter tokenvalidering. |
| Fejlsvar | [ApiExceptionHandler.cs](Backend/LoebeApp/LoebeApp/ErrorHandling/ApiExceptionHandler.cs) omsætter kendte exceptions til HTTP-status og ProblemDetails. |
| Containerbuild | [Dockerfile](Backend/LoebeApp/LoebeApp/Dockerfile) bygger API'et med .NET 10 SDK og kører det med ASP.NET-runtime på miljøvariablen `PORT`, med 8080 som standard. |

## Dataflow og lagring

1. Ved login returnerer API'et et JWT og udløbstid. Appen gemmer sessionen i SecureStore.
2. Ved start dannes aktivitetens UUID på telefonen. SQLite-tabellen `Activity` gemmer id, bruger-id, starttid, varighed og status.
3. Punkter gemmes løbende i `GpsPoint` med reference til aktiviteten, koordinater, positionsusikkerhed og tid siden start i millisekunder. Distance og aktuel pace beregnes i appen.
4. Ved stop fjernes GPS-abonnementet, og en igangværende punktskrivning afventes. Aktiviteten afsluttes lokalt med endelig varighed og status `completed`.
5. Appen læser de gemte punkter, beregner turens distance og sender samlet JSON med Bearer-token til API'et. Lokale punkt-id'er og bruger-id sendes ikke som en del af aktivitetsrequesten.
6. Backend bruger ejer-id fra det validerede token, validerer requesten og beregner gennemsnitstempo ud fra fuld varighed og indsendt distance. En værdi på nul for distance eller varighed giver `null` for gennemsnitstempo.
7. Aktivitet og rekordopdateringer gemmes i samme transaktion. GPS-listen gemmes som JSONB på aktiviteten. Kun hurtigere rekordtider erstatter eksisterende rekorder.
8. Efter HTTP 201 sletter appen den lokale aktivitet. GPS-punkterne slettes via `ON DELETE CASCADE`. Detaljeskærmen henter derefter turen fra API'et.
9. Ved uploadfejl bevares dataene i SQLite. En status som `completed` betyder afsluttet lokalt og er ikke en bekræftelse på serverlagring.

### Id'er og enheder

| Felt | SQLite / mobilapp | Backend / PostgreSQL |
| --- | --- | --- |
| Bruger-id | INTEGER / number | int / integer |
| Aktivitets-id | UUID-værdi gemt som TEXT / string | Guid / uuid |
| GPS-punktets eget id | INTEGER, kun lokalt | Sendes ikke til API'et |
| Varighed | DurationSeconds, sekunder | DurationSeconds, sekunder |
| Tid for GPS-punkt | ElapsedMilliseconds, millisekunder siden start | Samme enhed i JSONB |
| Distance | Meter i beregninger, kilometer i visning | DistanceMeters |
| Pace | Sekunder pr. kilometer, formateret som min:sek | AveragePaceSeconds, sekunder pr. kilometer |

Personlige rekorder har den sammensatte primærnøgle `UserId + DistanceMeters` og en fremmednøgle til aktiviteten via `ActivityId`. Rekordvarighed gemmes i millisekunder.

## API-oversigt

| Metode | Endpoint | Formål | Token |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Opret konto, HTTP 201 ved succes | Nej |
| POST | `/api/auth/login` | Returner token og udløbstid | Nej |
| POST | `/api/activities` | Gem aktivitet og GPS-punkter, HTTP 201 ved succes | Ja |
| GET | `/api/activities` | Egne aktiviteter, nyeste først, uden rutepunkter | Ja |
| GET | `/api/activities/{activityId}` | Egen aktivitet med GPS-punkter | Ja |
| GET | `/api/activities/statistics` | Samlet tid, distance og rekorder | Ja |

Beskyttede kald sender `Authorization: Bearer TOKEN`. I lokal Swagger oprettes en konto, hvorefter login giver `accessToken`. Indsæt tokenet i Authorize-dialogen. Uden gyldigt token giver beskyttede kald HTTP 401. Et detaljeopslag på en anden brugers aktivitet giver HTTP 404.

## Automatiske tests og typekontrol

Kør fra repositoryets rod med Docker Desktop startet:

```powershell
dotnet test Backend/LoebeApp/LoebeApp.slnx
```

Kun unit tests:

```powershell
dotnet test Backend/LoebeApp/LoebeApp.slnx --filter "FullyQualifiedName~LoebeApp.Tests.Unit"
```

Kun integrationstests:

```powershell
dotnet test Backend/LoebeApp/LoebeApp.slnx --filter "FullyQualifiedName~LoebeApp.Tests.Integration"
```

Testkoden findes i [LoebeApp.Tests](Backend/LoebeApp/LoebeApp.Tests). Unit tests bruger NSubstitute til udvalgte afhængigheder. Integrationstestene kalder managers med rigtige repositories og en PostgreSQL 18-container, som [PostgresFixture](Backend/LoebeApp/LoebeApp.Tests/Setup/PostgresFixture.cs) starter og anvender migrationer på. De bruger deres egen testdatabase. Testprojektet indeholder ingen automatiske controller-/HTTP-tests.

Typekontrol køres fra `mobile/` efter installation af afhængigheder:

```powershell
node node_modules/typescript/bin/tsc --noEmit
```

Der er ingen opsat ESLint-konfiguration eller automatiske mobiltests i projektet. Manuelle afprøvninger udføres med Swagger, emulator og fysisk Android. Rapportens testoversigt angiver gennemførte og manglende afprøvninger.

## Opdater mobilens API-typer

Start den lokale backend med HTTP-profilen, og kør fra `mobile/`:

```powershell
Invoke-WebRequest -Uri 'http://localhost:5248/openapi/v1.json' -OutFile 'openapi/loebeapp.json'
npm.cmd run generate:api
```

Scriptet genererer [src/api/generated/schema.ts](mobile/src/api/generated/schema.ts) fra den gemte OpenAPI-kontrakt. Det bruger openapi-typescript 7.13.0 med en separat TypeScript 5-installation via npx. Appens egen TypeScript-version er 6. Kør typekontrollen efter ændringer i kontrakten. De genererede typer skal opdateres gennem scriptet.

## Inspicer databaserne

SQLite kan åbnes gennem Expo-terminalens `Shift+M` og valget `expo-sqlite`. Vælg databasen `loebeapp.db`. Start en mocktur og opdater tabellerne `Activity` og `GpsPoint`, mens den kører. Efter vellykket upload slettes de lokale rækker.

Den lokale PostgreSQL kan åbnes i eksempelvis DBeaver med host `127.0.0.1`, port `5432`, database `loebeapp`, bruger `loebeapp` og password fra din egen `.env`. Tabellerne hedder `Users`, `Activities` og `PersonalRecords`. EF Core registrerer anvendte migrationer i `__EFMigrationsHistory`.

## Hosting og selvstændig Android-build

API'et pakkes med [Dockerfile](Backend/LoebeApp/LoebeApp/Dockerfile) og hostes på Hostless. PostgreSQL 17 på Hostless er en separat database. Lokal Docker Compose starter PostgreSQL 18; API'et startes lokalt med .NET.

Hostless konfigureres med `ConnectionStrings__DefaultConnection`, `Jwt__Issuer`, `Jwt__Audience`, `Jwt__Key` og `Jwt__ExpirationMinutes` i miljøvariablerne. `PORT` leveres af platformen. Databaseforbindelsen skal bruge de forbindelsesoplysninger og TLS-indstillinger, Hostless angiver. Databasemigrationer køres særskilt; API'et anvender dem ikke automatisk ved opstart. Eksempelvis kan et idempotent SQL-script genereres fra repositoryets rod:

```powershell
dotnet ef migrations script --idempotent --project Backend/LoebeApp/LoebeApp --startup-project Backend/LoebeApp/LoebeApp --output hostless-migrations.sql -- --environment Development
```

Gennemgå scriptet og anvend det på den tilsigtede database. Nye backendfunktioner kræver både deployment af koden og de nødvendige migrationer.

Mobilprojektets [eas.json](mobile/eas.json) indeholder en intern `preview`-profil, som er brugt til en selvstændig Android-APK. En ny build kræver adgang til det tilknyttede Expo/EAS-projekt eller opsætning under egen konto. Google Maps SDK for Android skal være konfigureret med en passende API-nøgle. [app.config.js](mobile/app.config.js) læser `GOOGLE_MAPS_API_KEY` under build og giver den til react-native-maps-pluginet. Nøglen begrænses til Android-pakken `dk.loebeapp.mobile` og buildets signeringscertifikat. Konfigurationen af release-minificering ligger i [app.json](mobile/app.json).

## Kendte begrænsninger og fejlfinding

| Situation | Forklaring eller handling |
| --- | --- |
| Token er udløbet, mens appen er åben | API'et afviser beskyttede kald. Log ud og ind igen. Automatisk fornyelse og automatisk viderestilling til login mangler. Logout sletter den lokale session; udstedte tokens tilbagekaldes ikke på serveren. |
| Upload fejler | Appen viser en besked og bevarer lokale data. Automatisk genforsøg og en brugerfunktion til at genoverføre de bevarede ture er endnu ikke implementeret. |
| Timeout efter upload | Serveren kan allerede have gemt turen. Idempotent upload af samme id er endnu ikke implementeret, så det kan ikke antages, at et gentaget kald lykkes. |
| Lokal oprydning fejler efter HTTP 201 | Turen er gemt på serveren, men lokal sletning kunne ikke gennemføres. Appen viser en særskilt fejlbesked. |
| Ingen GPS-punkter | Kontroller placeringstilladelse og at appen er i forgrunden. Målinger med ugyldige koordinater eller usikkerhed over 20 m afvises. 5-meterfilteret kan også frasortere punkter ved stilstand/kort bevægelse. Intervallet er et forsøg, ikke en garanti for et gemt punkt hvert andet sekund. |
| Låst telefon / lukket aktivitetsskærm | Baggrundsregistrering og automatisk genoptagelse er endnu ikke implementeret. Optageren stoppes ved afmontering af aktivitetsskærmen. |
| Emulator kan ikke nå API'et | Kontroller at lokal backend kører, og at API-adressen er `10.0.2.2:5248`, eller brug ADB-opsætningen ovenfor. Emulatorens `localhost` er ellers emulatoren selv. |
| Emulator fryser eller viser sort skærm | Stop emulatoren og vælg Cold Boot i Android Studios Device Manager. Genstart derefter Expo med ryddet cache ved behov. |
| SQLite-skema ændres under udvikling | Initialiseringen bruger `CREATE TABLE IF NOT EXISTS`. Den ændrer ikke eksisterende tabeller. Versionsstyrede lokale SQLite-migrationer er endnu ikke implementeret. |
| Statistik mangler gamle rekorder | Rekorder beregnes ved upload. Efterberegning af rekorder for tidligere gemte ture er endnu ikke implementeret. |

Grafer, kilometertider og GPS-registrering med låst telefon er endnu ikke implementeret. HTTPS bruges til det hostede API. SecureStore beskytter den gemte session. Der er ingen særskilt databasekryptering konfigureret for den lokale SQLite-database.
