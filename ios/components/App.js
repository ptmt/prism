/* @flow */
'use strict';

import React from 'react-native';

const {
  NavigatorIOS,
  View,
  Text,
  StyleSheet,
  TabBarIOS,
  Navigator,
  AppStateIOS
} = React;

class App extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>test</Text>
      </View>);
  }

}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 200,
    flex: 1
  },
});

React.AppRegistry.registerComponent('prism', () => App);
//React.StatusBarIOS.setHidden(true);
