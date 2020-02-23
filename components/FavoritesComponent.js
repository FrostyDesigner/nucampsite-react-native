import React, { Component } from 'react';
import { FlatList, View, Text, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import Swipeout from 'react-native-swipeout';
import { deleteFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        favorites: state.favorites
    };
};

// anytime you want to be able to dispatch an actionCreator from a component
// you need to use a mapDispatchToProps obeject
// mapDispatchToProps also needs to be in the connect function at the bottom
const mapDispatchToProps = {    
    deleteFavorite: campsiteId => (deleteFavorite(campsiteId))
};

class Favorites extends Component {

    // for stack navigator
    static navigationOptions = {
        title: 'My Favorites'
    }

    render() {
        // destructrure the navigation function
        const { navigate } = this.props.navigation;
        // destructure the current item from the array 
        const renderFavoriteItem = ({item}) => {
            // this configures options for the button that is revealed
            // this is set up as an array with several properties
            const rightButton = [
                {
                    text: 'Delete', 
                    type: 'delete',
                    onPress: () => {
                        // alert takes an array of 3 parameters seperated by commas
                        Alert.alert(
                            'Delete Favorite?',
                            'Are you sure you wish to delete the favorite campsite ' + item.name + '?',
                            [
                                { 
                                    text: 'Cancel', 
                                    onPress: () => console.log(item.name + 'Not Deleted'),
                                    style: ' cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => this.props.deleteFavorite(item.id)
                                }
                            ],
                            // optional paramter to disable user clicking outside of alert box
                            { cancelable: false }
                        );
                    }
                }
            ];

            
            return (
                // just wrap what you want to display in the swipeout (or whatever animation)
                <Swipeout right={rightButton} autoClose={true}>
                    <Animatable.View animation='fadeInRightBig' duration={2000}>
                        <ListItem
                            title={item.name}
                            subtitle={item.description}
                            leftAvatar={{source: {uri: baseUrl + item.image}}}
                            onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})}
                        />
                    </Animatable.View>
                </Swipeout>
            );
        };

        if (this.props.campsites.isLoading) {
            return <Loading />;
        }
        if (this.props.campsites.errMess) {
            return (
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            );
        }
        return (
            <FlatList
                // pass array of campsites - then filter out campsites by the id
                data={this.props.campsites.campsites.filter(
                    campsite => this.props.favorites.includes(campsite.id)
                )}
                renderItem={renderFavoriteItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);