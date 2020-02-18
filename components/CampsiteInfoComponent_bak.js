import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, View, TextInput } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId))
};

function RenderCampsite(props) {

    const { campsite } = props;

    if (campsite) {
        return (
            <Card
                featuredTitle={campsite.name}
                image={{ uri: baseUrl + campsite.image }}>
                <Text style={{ margin: 10 }}>
                    {campsite.description}
                </Text>
                <View style={styles.cardRow}>
                    <Icon
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        raised
                        reverse
                        onPress={() => props.favorite ?
                            console.log('Already set as a favorite') : props.markFavorite()}
                    />
                    <Icon style={styles.cardItem}
                        name={props.favorite ? 'pencil' : 'pencil-o'}
                        type='font-awesome'
                        color='#5637DD'
                        raised
                        reverse
                        // onPress={() => this.toggleModal()}
                        onPress={() => {
                            this.toggleModal();
                        }}
                    />
                </View>
            </Card>
        );
    }
    return <View />;
}

function RenderComments({ comments }) {

    const renderCommentItem = ({ item }) => {
        return (
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class CampsiteInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorite: false,
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        };
    }

    static navigationOptions = {
        title: 'Campsite Information'
    };

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComment(campsiteId) {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            favorite: false,
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        });
    }

    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>
                        <Text style={styles.textBox}>Submit Your Rating</Text>
                        <Rating
                            showRating
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={rating => this.setState({ rating: rating })}
                            ratingCount={10}
                            style={{ paddingVertical: 10 }}
                        // max={10}
                        // type="rocket"
                        // fractions={1}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon={
                                <Icon
                                    name='user-o'
                                    size={24}
                                    color='black'
                                />
                            }
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={rating => this.setState({ rating: rating })}
                            value={value}
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon={
                                <Icon
                                    name='comment-o'
                                    size={24}
                                    color='black'
                                />
                            }
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={text => onChangeText(text)}
                            value={value}
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create(
    {
        cardRow: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            flexDirection: 'row',
            margin: 20
        },
        cardItem: {
            flex: 1,
            margin: 10
        },
        modal: {
            justifyContent: 'center',
            margin: 20
        }
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);