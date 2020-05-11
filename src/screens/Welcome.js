import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import { Button, Card, CardItem, Input, Item, List, ListItem } from 'native-base';
import * as APIS from './Constants';

console.disableYellowBox = true

class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			asteroidId: "",
			isDisabled: true,
			showRandomList: false,
			asteroidIdData: null,
			asteroidIdList: []
		};
	}

	updateField(itemValue) {
		this.setState({ asteroidId: itemValue, isDisabled: (itemValue == "") ? true : false})
	}

	fetchData(itemValue) {
		if (itemValue == "random") {
			this.setState({
				showRandomList: true
			});
			fetch(APIS.Random_Url).then(response => {
				return response.json();
			}).then(responseJson => {
				if (responseJson != null) {
					let objects = responseJson.near_earth_objects;
					// console.log(objects.length);
					let asteroid_ids = [];
					for (let i = 0; i < objects.length; i++) {
						asteroid_ids.push(
							<ListItem onPress={() => this.updateField(objects[i].id)}>
								<Text>{objects[i].id}</Text>
							</ListItem>);
					}
					this.setState({
						asteroidIdData: null,
						asteroidIdList: asteroid_ids
					});
				}
			}).catch(error => {
				console.error(error);
			});
		} else {
			this.setState({
				showRandomList: false
			});
			fetch(APIS.BASE_URL + this.state.asteroidId + "?api_key=" + APIS.API_KEY).then(response => {
				return (response.status != 404) ? response.json() : null;
			}).then(responseJson => {
				let asteroid_id_data = [];
				if (responseJson != null) {
					asteroid_id_data.push(
						<View>
							<ListItem>
								<Text>name : <Text style={CommonStyle.BoldText}>{responseJson.name}</Text>
								</Text>
							</ListItem>
							<ListItem>
								<Text>nasa_jpl_url : <Text style={CommonStyle.BoldText}>{responseJson.nasa_jpl_url}</Text>
								</Text>
							</ListItem>
							<ListItem>
								<Text>is_potentially_hazardous_asteroid : <Text style={CommonStyle.BoldText}>{responseJson.is_potentially_hazardous_asteroid.toString()}</Text>
								</Text>
							</ListItem>
						</View>)
				} else {
					asteroid_id_data.push(
						<View>
							<ListItem>
								<Text>NO DATA FOUND</Text>
							</ListItem>
						</View>
					);
				}
				this.setState({
					asteroidIdList: [],
					asteroidIdData: asteroid_id_data
				});
			}).catch(error => {
				console.error(error);
			});
		}
	}

	render() {
		return (
			<View style={CommonStyle.Container}>
				<Card style={{ flexGrow: 0.05 }}>
					<CardItem>
						<Item>
							<Input value={this.state.asteroidId} placeholder="Enter Asteroid ID" onChangeText={(value) => this.updateField(value)} />
						</Item>
					</CardItem>
					<CardItem>
						<Button style={[(this.state.isDisabled) ? CommonStyle.DisableButton : CommonStyle.EnableButton]} disabled={this.state.isDisabled} onPress={() => this.fetchData("normal")}>
							<Text style={CommonStyle.ButtonText}>Submit</Text>
						</Button>
					</CardItem>
					<CardItem>
						<Button style={CommonStyle.EnableButton} onPress={() => this.fetchData("random")}>
							<Text style={CommonStyle.ButtonText}>Random Asteroid</Text>
						</Button>
					</CardItem>
				</Card>
				<Card style={{ flex: 0.95 }}>
					<SafeAreaView >
						<ScrollView>
							<List>
								{
									(this.state.showRandomList) ? (
										this.state.asteroidIdList
									) : (
											this.state.asteroidIdData
										)
								}
							</List>
						</ScrollView>
					</SafeAreaView>
				</Card>
			</View>
		);
	}
};

export const CommonStyle = StyleSheet.create({
	Container: {
		flex: 1
	},
	DisableButton: {
		backgroundColor: '#999999'
	},
	EnableButton: {
		backgroundColor: '#054DA1'
	},
	ButtonText: {
		width: '100%',
		textAlign: 'center',
		color: '#FFFFFF',
		textTransform: 'uppercase'
	},
	BoldText: {
		fontWeight: 'bold'
	}
});

export default Welcome;