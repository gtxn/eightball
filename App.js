import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ImageBackground } from 'react-native';
import { ShakeEventExpo } from "./shake_detect";

import { responses } from './responses.js'


import * as Animatable from 'react-native-animatable';
import { bounce } from "react-native/Libraries/Animated/Easing";

// Only class componenets are supported by animatable... thus, the class.
function EightBall(props) {
  let [view, setView] = useState('')

  let handleViewRef = ref => { setView(ref) }

  useEffect(() => {
    if (props.isbounce) {
      view.wobble(800)
    }
  })

  return (
    <>
      <Animatable.View animation='wobble' ref={(r) => { handleViewRef(r) }}>
        <View style={styles.circleBlack}>
          <View style={styles.circleDisplay}>
            <Animatable.Text
              animation={props.textAnimation}
              iterationCount="infinite"
              style={styles.ballText}>
              {props.response}
            </Animatable.Text>
          </View>
        </View>
      </Animatable.View>
    </>
  )
}

export default function App() {
  let [response, setResponse] = useState(responses[Math.floor(Math.random() * 3)])
  let [status, setStatus] = useState('Shake for eightball results')
  let [hasAttachedListener, setHasAttachedListener] = useState(false)
  let [isLoadingAns, setIsLoadingAns] = useState(false)
  let [textAnimation, setTextAnimation] = useState('pulse')
  let [ballBounce, setBallBounce] = useState(false)

  let get_response = () => {
    setStatus('Getting response...')
    setBallBounce(true)
    setTextAnimation('flash')

    setTimeout(() => {
      setResponse(responses[Math.floor(Math.random() * responses.length)])
      setStatus('Shake for eightball results')
      setIsLoadingAns(false)

      setTextAnimation('pulse')
    }, 1000)
  }

  useEffect(() => {
    if (!hasAttachedListener) {
      ShakeEventExpo.addListener(() => {
        if (!isLoadingAns) {
          console.log('Shake Shake Shake')
          setIsLoadingAns(true)
          get_response()
        }
      });
      setHasAttachedListener(true)
    }
  })

  return (
    <>
      <ImageBackground
        source={require('./assets/appbg.jpeg')}
        resizeMode="cover"
        style={styles.bgImg}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Animatable.Text
              animation='tada'
              iterationCount="infinite"
              iterationDelay={5000}
              style={styles.header}>
              {status}
            </Animatable.Text>
          </View>
          <EightBall response={response} textAnimation={textAnimation} isbounce={ballBounce} />

          <StatusBar style="auto" />
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    justifyContent: "center"
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContainer: {
    marginBottom: '30%',
    alignItems: 'center',
  },

  header: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
  },

  circleBlack: {
    height: '100%',
    width: 300,
    height: 300,
    borderRadius: 300 / 2,
    backgroundColor: 'black',
    justifyContent: 'center'
  },

  circleDisplay: {
    textAlign: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginLeft: 100,
  },

  ballText: {
    textAlign: 'center', // <-- the magic
    fontSize: 18,
    backgroundColor: 'blue',
    color: 'white',
  }
});
