
import React from 'react-native';
const {
  Text,
  View,
  Image,
  TouchableOpacity
} = React;

import CONSTANTS from './Constants';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Connect extends React.Component {
  render() {
    return (
      <LinearGradient
        colors={[CONSTANTS.GRADIENT_COLOR_ONE, CONSTANTS.GRADIENT_COLOR_TWO]}
        style={styles.container}>

        <View style={styles.logo}>
          <Image source={{uri: 'icon', isStatic: true }}/>
        </View>
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>Select any social network to start</Text>
        </View>
        <View style={styles.socialRoll}>
          <View style={styles.iconContainer}>
            <Icon name="social-foursquare-outline" size={30} color="white" style={styles.icon} />
            <Text style={styles.iconText}>Foursquare</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon name="social-github-outline" size={30} color="white" style={styles.icon} />
            <Text style={styles.iconText}>Github</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon name="social-instagram-outline" size={30} color="white" style={styles.icon} />
            <Text style={styles.iconText}>Instagram</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon name="social-twitter-outline" size={30} color="white" style={styles.icon} />
            <Text style={styles.iconText}>Twitter</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.props.onNext}>
          <Text style={styles.buttonText}>TRY DEMO</Text>
          <Icon name="ios-arrow-thin-down" size={30} color="white" />
        </TouchableOpacity>


      </LinearGradient>

    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT
  },
  welcome: {
    marginTop: 100
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '200'
  },
  socialRoll: {
    marginTop: 30,
    marginBottom: 0,
    flex: 1,
    flexDirection: 'row',
    width: CONSTANTS.WIDTH,
    justifyContent: 'space-around',
    height: 50
  },
  iconContainer: {
    margin: 10,
    alignItems: 'center',
    opacity: 0.7,
    height: 50
  },
  icon: {
    width: 30,
    height: 30
  },
  iconText: {
    color: 'white'
  },
  button: {
    backgroundColor: '#ff4080',
    margin: 30,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white'
  }
};
