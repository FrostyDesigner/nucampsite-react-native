import React, { Component } from 'react';
import { FlatList, ScrollView, Text } from 'react-native';
import { ListItem, Card } from 'react-native-elements';
//*************************************************** */
import { PARTNERS } from '../shared/partners';

class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            partners: PARTNERS
        };
    }


    static navigationOptions = {
        title: 'About Us'
    }

    render() {
        const renderPartner = ({ partner }) => {
            return (
                <ListItem
                    title={partner.name}
                    subtitle={partner.description}
                    leftAvatar={{ source: require('./images/bootstrap-logo.png') }}
                />
            );
        };

        return (
            <Mission></Mission>

        //************************************************************ */
            // <FlatList
            //     Mission
            //     partner={this.state.partners}
            //     renderItem={renderPartner}
            // />
        //***************************************************** */

        );
    }
}

function Mission(props) {
    return (
        <ScrollView>
            <Card wrapperStyle={{ margin: 20 }} title="Mission">

                <Text>We present a curated database of the best
                    campsites in the vast woods and backcountry
                    of the World Wide Web Wilderness. We increase
                    access to adventure for the public while promoting
                    safe and respectful use of resources. The expert
                    wilderness trekkers on our staff personally
                    verify each campsite to make sure that they
                    are up to our standards. We also present a platform
                    for campers to share reviews on campsites they have
                        visited with each other.</Text>
            </Card>
        </ScrollView>
    )
}

export default About;