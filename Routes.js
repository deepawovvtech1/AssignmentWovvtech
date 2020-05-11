import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Welcome from './src/screens/Welcome';

const Project = createStackNavigator({
	Welcome: {
		screen: Welcome,
		navigationOptions: {
			title: 'Assignment',
			headerTintColor: '#ffffff',
			headerStyle: {
				backgroundColor: '#054DA1'
			}
		}
	}
});

export default createAppContainer(Project);