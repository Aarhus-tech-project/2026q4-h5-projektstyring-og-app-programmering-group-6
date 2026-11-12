import { View } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useAuth } from "../../auth/context/useAuth";
import type { Activity } from "../models/activity";
import { ActivityManager } from "../managers/ActivityManager";
import { ActivityRepository } from "../repositories/ActivityRepository";
import { GpsPointRepository } from "../repositories/GpsPointRepository";
import { DeviceGpsSource } from "../gps/DeviceGpsSource";
import { GpsRecorder } from "../gps/GpsRecorder";
import { MockGpsSource } from "../gps/MockGpsSource";
import ActivityMap from "../components/ActivityMap";
import ActivityPanel from "../components/ActivityPanel";
import type { NewGpsPoint } from "../models/gpsPoint";
import { mockRoute } from "../gps/mockRoute";
import { router } from "expo-router";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";

export default function ActivityScreen() {
  const database = useSQLiteContext();
  const { userId, session } = useAuth();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const recorderRef = useRef<GpsRecorder | null>(null);
  const [usesDeviceGps, setUsesDeviceGps] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [currentPace, setCurrentPace] = useState<number | null>(null);
  const [gpsPoints, setGpsPoints] = useState<NewGpsPoint[]>([]);

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;
      recorderRef.current = null;
      void recorder?.stop();
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

  async function handleStart(source: "device" | "mock") {
    if (userId === null) {
      alert("Brugeren kunne ikke identificeres. Log ind igen.");
      return;
    }

    if (recorderRef.current !== null) {
      return;
    }

    const manager = new ActivityManager(
      new ActivityRepository(database),
      new GpsPointRepository(database),
    );
    const deviceSource = source === "device" ? new DeviceGpsSource() : null;
    const recorder = new GpsRecorder(manager, deviceSource ?? new MockGpsSource());
    recorderRef.current = recorder;
    setLoading(true);
    let started = false;

    try {
      if (deviceSource !== null) {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (recorderRef.current !== recorder) {
          return;
        }

        if (!permission.granted) {
          alert("Giv LøbeApp adgang til din placering for at starte en aktivitet.");
          return;
        }

        await deviceSource.start((reason) => alert(reason));
        if (recorderRef.current !== recorder) {
          return;
        }
      }

      const startedActivity = await manager.startActivity(userId);
      if (recorderRef.current !== recorder) {
        return;
      }

      setUsesDeviceGps(source === "device");

      setActivity(startedActivity);

      setDistanceMeters(0);
      setCurrentPace(null);
      setGpsPoints([]);

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
      started = true;
    } catch (error) {
      if (recorderRef.current === recorder) {
        const message =
          error instanceof Error
            ? error.message
            : "Aktiviteten kunne ikke startes.";
        alert(message);
      }
    } finally {
      if (recorderRef.current === recorder) {
        if (!started) {
          recorderRef.current = null;
          void recorder.stop();
        }

        setLoading(false);
      }
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

      if (session === null) {
        throw new Error(
          "Aktiviteten er gemt lokalt, men du skal logge ind igen før upload.",
        );
      }

      await manager.uploadCompletedActivity(
        completedActivity.id,
        userId,
        session.accessToken,
      );

      router.replace({
        pathname: "/activity-details",
        params: { activityId: completedActivity.id },
      });
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
      {usesDeviceGps && gpsPoints.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Venter på GPS-position…</Text>
        </View>
      ) : (
        <ActivityMap
          initialPosition={gpsPoints[0] ?? mockRoute[0]}
          points={gpsPoints}
        />
      )}

      <ActivityPanel
        activity={activity}
        elapsedSeconds={elapsedSeconds}
        distanceMeters={distanceMeters}
        currentPace={currentPace}
        loading={loading}
        onStart={() => handleStart("device")}
        onStartMock={() => handleStart("mock")}
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
