import { View } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useAuth } from "../../auth/context/useAuth";
import type { Activity } from "../models/activity";
import { ActivityManager } from "../managers/ActivityManager";
import { ActivityRepository } from "../repositories/ActivityRepository";
import { GpsPointRepository } from "../repositories/GpsPointRepository";
import { MockGpsRecorder } from "../gps/MockGpsRecorder";
import ActivityMap from "../components/ActivityMap";
import ActivityPanel from "../components/ActivityPanel";
import type { NewGpsPoint } from "../models/gpsPoint";
import { mockRoute } from "../gps/mockRoute";
import { router } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ActivityScreen() {
  const database = useSQLiteContext();
  const { userId } = useAuth();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const recorderRef = useRef<MockGpsRecorder | null>(null);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [currentPace, setCurrentPace] = useState<number | null>(null);
  const [gpsPoints, setGpsPoints] = useState<NewGpsPoint[]>([]);

  useEffect(() => {
    return () => {
      void recorderRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (activity === null || activity.status !== "active") {
      return;
    }

    const startedAt = Date.parse(activity.startedAt);

    function updateElapsedTime() {
      const seconds = Math.floor((Date.now() - startedAt) / 1000);

      setElapsedSeconds(Math.max(0, seconds));
    }

    updateElapsedTime();

    const intervalId = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(intervalId);
  }, [activity]);

  async function handleStart() {
    if (userId === null) {
      alert("Brugeren kunne ikke identificeres. Log ind igen.");
      return;
    }

    setLoading(true);

    try {
      const repository = new ActivityRepository(database);
      const manager = new ActivityManager(
        repository,
        new GpsPointRepository(database),
      );

      const startedActivity = await manager.startActivity(userId);

      setActivity(startedActivity);

      setDistanceMeters(0);
      setCurrentPace(null);
      setGpsPoints([]);

      const recorder = new MockGpsRecorder(manager);

      recorderRef.current = recorder;

      recorder.start(
        startedActivity.id,
        userId,
        (point, totalDistanceMeters, paceSecondsPerKilometer) => {
          setGpsPoints((previousPoints) => [...previousPoints, point]);
          setDistanceMeters(totalDistanceMeters);
          setCurrentPace(paceSecondsPerKilometer);
        },
        (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "GPS-punktet kunne ikke gemmes.";

          alert(message);
        },
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Aktiviteten kunne ikke startes.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStop() {
    if (activity === null || userId === null) {
      return;
    }

    setLoading(true);

    try {
      const repository = new ActivityRepository(database);
      const manager = new ActivityManager(
        repository,
        new GpsPointRepository(database),
      );

      const finalDistanceMeters = await recorderRef.current?.stop();

      if (finalDistanceMeters !== undefined) {
        setDistanceMeters(finalDistanceMeters);
      }
      const completedActivity = await manager.stopActivity(activity.id, userId);

      setActivity(completedActivity);
      setElapsedSeconds(completedActivity.durationSeconds);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Aktiviteten kunne ikke afsluttes.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ActivityMap initialPosition={mockRoute[0]} points={gpsPoints} />

      <ActivityPanel
        activity={activity}
        elapsedSeconds={elapsedSeconds}
        distanceMeters={distanceMeters}
        currentPace={currentPace}
        loading={loading}
        onStart={handleStart}
        onStop={handleStop}
      />
      {activity?.status !== "active" && (
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={theme.colors.onSurface}
          containerColor={theme.colors.surface}
          mode="contained"
          accessibilityLabel="Tilbage til forsiden"
          disabled={loading}
          onPress={() => router.dismissAll()}
          style={{
            position: "absolute",
            top: insets.top + 12,
            left: insets.left + 12,
            margin: 0,
          }}
        />
      )}
    </View>
  );
}
