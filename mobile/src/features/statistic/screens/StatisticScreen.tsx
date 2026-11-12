import { ScrollView, View } from "react-native";
import { ActivityIndicator, Card, Text, useTheme } from "react-native-paper";
import { formatPace } from "../../../formatting/formatPace";
import { useAuth } from "../../auth/context/useAuth";
import { useActivityStatistics } from "../hooks/useActivityStatistics";

const recordDistancesMeters = [1_000, 3_000, 5_000, 10_000];
const distanceFormatter = new Intl.NumberFormat("da-DK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDuration(seconds: number): string {
  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  const minutesAndSeconds = `${minutes} min ${remainingSeconds} sek`;

  return hours > 0 ? `${hours} t ${minutesAndSeconds}` : minutesAndSeconds;
}

export default function StatisticScreen() {
  const { session } = useAuth();
  const { statistics, error } = useActivityStatistics(
    session?.accessToken ?? null,
  );
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      {error !== null ? (
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      ) : statistics === null ? (
        <ActivityIndicator accessibilityLabel="Henter statistik" />
      ) : (
        <>
          <Card mode="contained" style={{ borderRadius: 16 }}>
            <Card.Content style={{ gap: 8 }}>
              <Text variant="titleMedium">Samlet aktivitet</Text>
              <Text>
                Distance:{" "}
                {distanceFormatter.format(
                  Number(statistics.totalDistanceMeters) / 1000,
                )}{" "}
                km
              </Text>
              <Text>
                Tid: {formatDuration(Number(statistics.totalDurationSeconds))}
              </Text>
            </Card.Content>
          </Card>

          <Text variant="titleLarge">Personlige rekorder</Text>
          {recordDistancesMeters.map((distanceMeters) => {
            const record = statistics.personalRecords.find(
              (candidate) =>
                Number(candidate.distanceMeters) === distanceMeters,
            );

            return (
              <Card
                key={distanceMeters}
                mode="contained"
                style={{ borderRadius: 16 }}
              >
                <Card.Content style={{ gap: 8 }}>
                  <Text variant="titleMedium">{distanceMeters / 1000} km</Text>
                  {record ? (
                    <View style={{ gap: 4 }}>
                      <Text>
                        Tid:{" "}
                        {formatDuration(
                          Number(record.durationMilliseconds) / 1000,
                        )}
                      </Text>
                      <Text>
                        Pace:{" "}
                        {formatPace(Number(record.paceSecondsPerKilometer))}{" "}
                        min/km
                      </Text>
                    </View>
                  ) : (
                    <Text>Ingen rekord endnu</Text>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}
