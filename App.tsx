import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, TouchableOpacity, Text, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { Action, ActionComponent } from './ActionComponent';
import Tabs from 'react-native-tabs';
import { useFonts, Lexend_800ExtraBold } from '@expo-google-fonts/lexend';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

export default function App() {

  const [actions, setActions] = useState([
    new Action("15 Second hang", 0, 15),
    new Action("5 Second rest", 15, 20),
    new Action("20 Second hang", 20, 40),
    new Action("5 Second rest", 40, 45),
  ]);

  const [startTime, setStartTime] = useState(Date.now());
  const [paused, setPaused] = useState(true);
  const [pauseTime, setPauseTime] = useState(0);
  const [popup, setPopup] = useState(false);
  const [actionName, setActionName] = useState("");
  const [actionLength, setActionLength] = useState("");

  let [fontsLoaded] = useFonts({
    Lexend_800ExtraBold,
  });
  if (!fontsLoaded) {
    return null;
  }

  const unpause = () => {
    setPaused(!paused);
    if (paused) {
      setStartTime(Date.now()-pauseTime);
    } else {
      setPauseTime(Date.now()-startTime);
    }
  }

  const confirmAdd = () => {
    let lastAction = actions[actions.length - 1];
    if (lastAction === undefined) {
      lastAction = new Action("", 0, 0);
    }
    setActions([...actions, new Action(actionName, lastAction.end, lastAction.end+parseInt(actionLength))]);
    setPopup(false);
  }

  const addAction = () => {
    setActionName("");
    setActionLength("");
    setPopup(true);
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.buttons}>

        <TouchableOpacity style={styles.button} onPress={() => {
          setStartTime(Date.now());
          setPauseTime(0);
        }}>
          <Text style={styles.button_text}>Reset</Text>
        </TouchableOpacity>

       <TouchableOpacity style={styles.button} onPress={() => unpause()}>
          <Text style={styles.button_text}>Pause/Resume</Text>
        </TouchableOpacity>

      </View>

      <ScrollView style={styles.scrollView}>
        {actions.map((item, index) => (
          <ActionComponent
            action={item}
            start={startTime}
            key={index}/>
        ))}
        <TouchableOpacity style={styles.add_button} onPress={addAction}>
          <Text style={styles.button_text}>Add action</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.add_button} onPress={() => {setActions([])}}>
          <Text style={styles.button_text}>Remove actions</Text>
        </TouchableOpacity>
      </ScrollView>

      <Dialog
        visible={popup}
        onTouchOutside={() => {}}
      >
        <DialogContent style={styles.dialog}>

          <TextInput style={styles.input} onChangeText={setActionName} value={actionName} placeholder="Action name"/>
          <TextInput style={styles.input} onChangeText={setActionLength} value={actionLength} placeholder="Action length (Seconds)" keyboardType="numeric"/>

          <View style={styles.modal_buttons}>
           <TouchableOpacity onPress={() => {confirmAdd()}} style={styles.button1}>
              <Text style={styles.button_text}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setPopup(false)}} style={styles.button2}>
              <Text style={styles.button_text}>Close</Text>
            </TouchableOpacity>
          </View>
        </DialogContent>
      </Dialog>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: "100%"
  },
  scrollView: {
    flex: 1,
    width: "100%",
    marginTop: -620
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    marginTop: Constants.statusBarHeight,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    width: "44%",
    height: 65,
  },
  button_text: {
    color: '#000000A1',
    fontFamily: 'Lexend_800ExtraBold'
  },
  add_button: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  dialog: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "35%",
    width: 350
  },
  input: {
    height: 40,
    marginTop: 40,
    borderWidth: 0,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#e2e2e2",
    padding: 5
  },
  modal_buttons: {
    flex: 1,
  },
  button1: {
    position: "absolute",
    top: 50,
    right: -70,
  },
  button2: {
    position: "absolute",
    top: 50,
    right: 40,
  }
});
