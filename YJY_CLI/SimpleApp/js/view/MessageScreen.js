//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from './component/NavBar';

// create a component
class MessageScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <NavBar title="消息" showBackButton={true} navigation={this.props.navigation}/>
                <View style={{
                    flex:1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    }}>
                    <Text>MessageScreen</Text>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

//make this component available to the app
export default MessageScreen;
