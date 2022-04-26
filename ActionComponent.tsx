import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { useFonts, Lexend_800ExtraBold } from '@expo-google-fonts/lexend';

export class Action {

  readonly name: String;
  readonly start: number;
  readonly end: number;
  readonly length: number;

  constructor(name: String, start: number, end: number) {
    this.name = name;
    this.start = start;
    this.end = end;
    this.length = end-start;
  }

  get_progress(current: number): number {
    let passed = current - this.start;
    return passed / this.length;
  }

}

type Props = {
  action: Action;
  start: number;
}

enum RenderMode {
  Done = 1,
  InProgress,
  NotStarted
}

export const ActionComponent: React.FC<Props> = (props: Props) => {

  const [progress, setProgress] = useState(0.0);
  const [time, setTime] = useState(Date.now());
  const [renderMode, setRenderMode] = useState(RenderMode.NotStarted);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 50);
    return () => {
      clearInterval(interval)
    }
  })
  useEffect(() => {
    let elapsed = (time-props.start) / 1000;
    if (props.action.get_progress !== undefined) {
      let progress = props.action.get_progress(elapsed);
      if (progress >= 1) {
        setRenderMode(RenderMode.Done);
      } else if (progress <= 0) {
        setRenderMode(RenderMode.NotStarted);
      } else {
        setRenderMode(RenderMode.InProgress);
      }
      setProgress(progress);
      setTimeLeft(props.action.length-(elapsed-props.action.start))
    }
  }, [time])

  const deleteSelf = () => {
    props.removeAction(props.action.start);
  }

  let [fontsLoaded] = useFonts({
    Lexend_800ExtraBold,
  });
  if (!fontsLoaded) {
    return null;
  }

  if (renderMode == RenderMode.Done) {
    return (
      <View style={{ backgroundColor: "#CAFFCF", padding: 15, margin: 10, borderRadius: 20, flexGrow: 1 }}>
        <Text style={styles.text}>{props.action.name}</Text>
        <ProgressBar
          progress={progress}
          color={"#6ED679"}
          borderWidth={0}
          width={null}
          height={10}
        />
        <Text style={styles.text}>100% Done | 0 Seconds left</Text>
      </View>
    );
  } else if (renderMode == RenderMode.NotStarted) {
    return (
      <View style={{ backgroundColor: "#A5A5A5", padding: 15, margin: 10, borderRadius: 20 }}>
        <Text style={styles.text}>{props.action.name}</Text>
        <ProgressBar
          progress={progress}
          unfilledColor={"#F9F9F9"}
          borderWidth={0}
          width={null}
          height={10}
        />
        <Text style={styles.text}>0% Done | {props.action.length} Seconds left</Text>
      </View>
    );
  } else if (renderMode == RenderMode.InProgress) {
    return (
      <View style={{ backgroundColor: "#CAFCFF", padding: 15, margin: 10, borderRadius: 20 }}>
        <Text style={styles.text}>{props.action.name}</Text>
        <ProgressBar
          progress={progress}
          color={"#60B4B9"}
          unfilledColor={"#F1F1F1"}
          borderWidth={0}
          width={null}
          height={10}
        />
        <Text style={styles.text}>{Math.round(progress*100)}% Done | {Math.round(timeLeft, 1)} Seconds left</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#000000A1',
    fontFamily: 'Lexend_800ExtraBold',
    margin: 10
  },
})
