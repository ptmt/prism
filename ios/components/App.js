/* @flow */
'use strict';

import React from 'react-native';
import Map from './Map';
import Connect from './Connect';

const {
  View,
  Text,
  StyleSheet,
  Navigator
} = React;

const ROUTES = {
  CONNECT: 1,
  MAP: 2
};

class App extends React.Component {

  constructor() {
      super();
      this.state = {};
  }

  render() {
      return (
        <Navigator
            initialRoute={{id: ROUTES.CONNECT}}
            renderScene={this.renderScene}
            configureScene={this.configureScene}
        />
      );
  }

  renderScene(route, navigator) {
    if (route.id === ROUTES.CONNECT) {
      return <Connect onNext={() => navigator.push({id: ROUTES.MAP})}/>;
    }
    if (route.id === ROUTES.MAP) {
      return <Map/>;
    }
  }

  configureScene(route) {
    console.log('configure')
    if (route.id === ROUTES.CONNECT) {
      return {
        ...Navigator.SceneConfigs.VerticalUpSwipeJump,
        gestures: {
          jumpBack: {
            ...Navigator.SceneConfigs.VerticalUpSwipeJump.gestures.jumpBack,
          },
          jumpForward: {
            ...Navigator.SceneConfigs.VerticalUpSwipeJump.gestures.jumpBack
          },
        },
      }
    }
    if (route.id === ROUTES.MAP) {
      return {
        ...Navigator.SceneConfigs.VerticalUpSwipeJump,
        // gestures: {
        //   ...Navigator.SceneConfigs.HorizontalSwipeJump.gestures,
        //   jumpForward: route.id === CAMERA_ROUTE && this.state.hasResult ? Navigator.SceneConfigs.HorizontalSwipeJump.gestures.jumpForward : null,
        //   jumpBack: route.id === RESULT_ROUTE ? Navigator.SceneConfigs.HorizontalSwipeJump.gestures.jumpBack : null
        // }
      }
    }
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
