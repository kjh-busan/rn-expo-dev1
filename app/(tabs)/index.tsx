import React, { useRef, useEffect, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { debounce } from "lodash";
import {
  getIndexFromOffset,
  getCenterPositionFromIndex,
  fillEmpty,
} from "@/components/Util";
import {
  MERIDIEM_ITEMS,
  HOUR_ITEMS,
  MINUTE_ITEMS,
  BUTTON_HEIGHT,
  GAP,
} from "@/components/Values";
// import {
//   getCenterPositionFromIndex,
//   getIndexFromOffset,
//   fillEmpty,
// } from "../utils";
// import {
//   MERIDIEM_ITEMS,
//   MINUTE_ITEMS,
//   HOUR_ITEMS,
//   BUTTON_HEIGHT,
//   GAP,
// } from "../values";

interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  width: number;
  buttonHeight: number;
  visibleCount: number;
}

const isPM = (date: Date) => date.getHours() >= 12;

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  width,
  buttonHeight,
  visibleCount,
}) => {
  if (visibleCount % 2 === 0) throw new Error("visibleCount must be odd");

  const ITEMS = [
    { key: "meridiem", items: MERIDIEM_ITEMS },
    { key: "hour", items: HOUR_ITEMS },
    { key: "minute", items: MINUTE_ITEMS },
  ] as const;

  const refs = useRef<(ScrollView | null)[]>(
    Array.from({ length: 3 }).map(() => null)
  );
  const animatedValues = useRef<Animated.Value[]>(
    Array.from({ length: 3 }).map(() => new Animated.Value(0))
  );

  const getScrollProps = (
    index: number,
    key: "meridiem" | "hour" | "minute",
    items: string[]
  ) => {
    const onScrollStop = debounce((offsetY: number) => {
      const date = new Date(value.getTime());
      const itemIdx = getIndexFromOffset(offsetY);

      if (key === "meridiem") {
        const currValueIsPM = isPM(date);
        const nextValueIsPM = MERIDIEM_ITEMS[itemIdx] === "오후";
        if (currValueIsPM !== nextValueIsPM) {
          date.setHours(date.getHours() + (nextValueIsPM ? 12 : -12));
        }
      }
      if (key === "hour") {
        const hour = Number(HOUR_ITEMS[itemIdx]);
        if (isPM(date)) {
          date.setHours(hour === 12 ? 12 : hour + 12);
        } else {
          date.setHours(hour === 12 ? 0 : hour);
        }
      }
      if (key === "minute") {
        date.setMinutes(Number(MINUTE_ITEMS[itemIdx]));
      }

      onChange(date);
    }, 200);

    return {
      key,
      index,
      items,
      showsVerticalScrollIndicator: false,
      contentContainerStyle: styles.scrollView,
      ref: (el: ScrollView | null) => (refs.current[index] = el),
      onScrollBeginDrag: () => onScrollStop.cancel(),
      onScrollEndDrag: (e: any) => {
        onScrollStop.cancel();
        onScrollStop(e.nativeEvent.contentOffset.y);
      },
      onMomentumScrollBegin: () => onScrollStop.cancel(),
      onMomentumScrollEnd: (e: any) => {
        onScrollStop.cancel();
        onScrollStop(e.nativeEvent.contentOffset.y);
      },
      getOnPress: (item: string) => () => {
        const targetIdx = items.indexOf(item);
        if (targetIdx === -1) return;
        const CENTER_POSITION = getCenterPositionFromIndex(targetIdx);
        onScrollStop(CENTER_POSITION);
        onScrollStop.flush();
      },
      animatedValue: animatedValues.current[index],
      scrollEventThrottle: 16,
    };
  };

  const scrollProps = useMemo(() => {
    return ITEMS.map(({ key, items }, index) =>
      getScrollProps(index, key, items)
    );
  }, [value]);

  useEffect(() => {
    const meridiem = isPM(value) ? "오후" : "오전";
    const hour = String(value.getHours() % 12 || 12).padStart(2, "0");
    const minute = String(value.getMinutes()).padStart(2, "0");

    const matchIndex = [
      MERIDIEM_ITEMS.indexOf(meridiem),
      HOUR_ITEMS.indexOf(hour),
      MINUTE_ITEMS.indexOf(minute),
    ];

    scrollProps.forEach((props, index) => {
      refs.current[index]?.scrollTo({
        y: getCenterPositionFromIndex(matchIndex[index]),
      });
    });
  }, [value]);

  return (
    <View
      style={[styles.container, { width, height: visibleCount * buttonHeight }]}
    >
      {scrollProps.map((props) => {
        const renderItems = fillEmpty(visibleCount, props.items);

        return (
          <ScrollView
            {...props}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: props.animatedValue } } }],
              {
                useNativeDriver: false,
              }
            )}
            key={props.key}
          >
            {renderItems.map((item, index) => {
              const position = getCenterPositionFromIndex(
                props.items.indexOf(item)
              );
              const opacity = props.animatedValue.interpolate({
                inputRange: [
                  position - BUTTON_HEIGHT,
                  position,
                  position + BUTTON_HEIGHT,
                ],
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Button
                  key={item}
                  style={{ opacity }}
                  label={item}
                  onPress={props.getOnPress(item)}
                />
              );
            })}
          </ScrollView>
        );
      })}
      <OverlayView />
    </View>
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  style?: object;
  label: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ style, label, onPress }) => {
  return (
    <AnimatedPressable style={style} onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
};

const OverlayView: React.FC = () => {
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.overlay]}
    >
      <View style={styles.overlayVisibleView}>
        <View style={styles.overlayVisibleViewInner} />
        <GapView />
        <View style={styles.overlayVisibleViewInner} />
        <GapView>
          <Text style={{ position: "absolute", textAlign: "center" }}>
            {":"}
          </Text>
        </GapView>
        <View style={styles.overlayVisibleViewInner} />
      </View>
    </View>
  );
};

const GapView: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <View style={styles.gap}>{children}</View>;
};

const styles = StyleSheet.create({
  gap: {
    alignItems: "center",
    justifyContent: "center",
    width: GAP,
  },
  container: {
    borderWidth: 1,
    alignSelf: "center",
    flexDirection: "row",
  },
  scrollView: {
    left: 0,
    right: 0,
    position: "absolute",
  },
  button: {
    height: BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    fontWeight: "bold",
  },
  overlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  overlayVisibleView: {
    width: "100%",
    height: BUTTON_HEIGHT,
    flexDirection: "row",
  },
  overlayVisibleViewInner: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#c8c8c8",
  },
});

export default TimePicker;
