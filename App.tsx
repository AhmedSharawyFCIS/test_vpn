/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  DeviceEventEmitter,
  NativeModules,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NativeEventEmitter} from 'react-native';
import RNVPNDetect from 'react-native-vpn-detect';
import NetInfo, {NetInfoStateType} from '@react-native-community/netinfo';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const [vpnState, setVPNState] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const isIos = Platform.OS === 'ios';

    const iosDetectVPNHandler = () => {
      const RNVPNDetectEmitter = new NativeEventEmitter(RNVPNDetect);

      const vpnListener = RNVPNDetectEmitter.addListener(
        'RNVPNDetect.vpnStateDidChange',
        vpnState => {
          console.log('vpnStatevpnState ios', vpnState);
          alert('state: ' + vpnState);
        },
      );

      RNVPNDetect.startTimer(3000);

      return {
        remove: () => {
          vpnListener.remove();
          RNVPNDetect.stopTimer();
        },
      };
    };

    const androidDetectVPNHandler = () => {
      // NativeModules.VPNModule.isVPNConnected((isVPNConnected: boolean) => {
      //   alert('is android using VPN from native module ' + isVPNConnected);
      // });

      // const vpnManagerEmitter = new NativeEventEmitter(NativeModules.VPNModule);
      // const listener = vpnManagerEmitter.addListener(
      //   'onVPNConnectionChanged',
      //   state => {
      //     console.log('ssssss', state.vpnState);
      //     alert('state: ' + state.vpnState);
      //   },
      // );

      // NativeModules.VPNModule.startListening();

      const vpnManagerEmitter = new NativeEventEmitter(NativeModules.VPNModule);

      const vpnStatusListener = vpnManagerEmitter.addListener(
        'VPNStatus',
        status => {
          setVPNState(status.isVpnActive);
          Alert.alert('status', JSON.stringify(status));
          if (status.isVpnActive) {
            // VPN is active
            alert('VPN is active');
          } else {
            // VPN is not active
            alert('VPN is not active');
          }
        },
      );

      return {
        remove: () => {
          vpnStatusListener.remove();
          // NativeModules.VPNModule.stopListening();
        },
      };
    };

    const VPNHandler = isIos
      ? iosDetectVPNHandler()
      : androidDetectVPNHandler();

    return () => {
      VPNHandler.remove();
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>{vpnState ? 'Connected' : 'DisConnected'}</Text>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
