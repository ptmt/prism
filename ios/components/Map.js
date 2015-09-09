
import React from 'react-native';
const { MapView, View } = React;
import CONSTANTS from './Constants';

export default class Map extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          tilesSource={"http://tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />
      </View>

    );
  }
}

const styles = {
  map: {
    flex: 1,
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT,
  }
}
