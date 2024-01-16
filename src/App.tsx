import 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';
import { Provider } from 'react-native-paper';

import { ThemeProvider } from '@/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ApplicationNavigator from './navigators/Application';
import './translations';

const queryClient = new QueryClient();

export const storage = new MMKV();

// eslint-disable-next-line react/function-component-definition
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider storage={storage}>
				<Provider>
					<ApplicationNavigator />
				</Provider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
