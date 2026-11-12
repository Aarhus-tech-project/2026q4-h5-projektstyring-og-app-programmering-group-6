import { FlatList, View } from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { useAuth } from "../../auth/context/useAuth";
import { useActivityHistory } from "../../activity/hooks/useActivityHistory";
import ActivitySummaryCard from "../../activity/components/ActivitySummaryCard";
import { useState } from "react";

export default function HomeScreen() {
  const { session } = useAuth();
  const theme = useTheme();

  const { activities, loading, error } = useActivityHistory(
    session?.accessToken ?? null,
  );

  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const scrollRange = contentHeight - listHeight;
  const showScrollbar = listHeight > 0 && scrollRange > 0;
  const thumbHeight = showScrollbar
    ? Math.min(
        listHeight,
        Math.max(24, (listHeight / contentHeight) * listHeight),
      )
    : 0;
  const scrollProgress = showScrollbar
    ? Math.min(1, Math.max(0, scrollY / scrollRange))
    : 0;

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      {loading && <ActivityIndicator />}

      {error !== null && (
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      )}

      <View
        style={{ flex: 1, marginRight: -12 }}
        onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
      >
        <FlatList
          style={{ flex: 1 }}
          data={activities}
          keyExtractor={(activity) => activity.id}
          renderItem={({ item }) => (
            <ActivitySummaryCard
              activity={item}
              onPress={() =>
                router.push({
                  pathname: "/activity-details",
                  params: { activityId: item.id },
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, paddingRight: 12 }}
          onContentSizeChange={(_, height) => setContentHeight(height)}
          onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
          ListEmptyComponent={
            !loading && error === null ? (
              <Text>Du har endnu ingen aktiviteter.</Text>
            ) : undefined
          }
        />
        {showScrollbar && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              right: 2,
              top: scrollProgress * (listHeight - thumbHeight),
              width: 3,
              height: thumbHeight,
              borderRadius: 2,
              backgroundColor: "#FFFFFF",
            }}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Button
          mode="contained"
          style={{ flex: 1 }}
          onPress={() => router.push("/activity")}
        >
          Ny aktivitet
        </Button>
        <Button
          mode="outlined"
          style={{ flex: 1 }}
          onPress={() => router.push("/statistic")}
        >
          Statistik
        </Button>
      </View>
    </View>
  );
}
