import 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';
import { Provider } from 'react-native-paper';

import { ThemeProvider } from '@/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthProvider from './auth/AuthProvider/AuthProvider';
import ApplicationNavigator from './navigators/Application';
import './translations';

const queryClient = new QueryClient();

const mmkvStorage = new MMKV();

// eslint-disable-next-line react/function-component-definition
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider storage={mmkvStorage}>
				<ThemeProvider storage={mmkvStorage}>
					<Provider>
						<ApplicationNavigator />
					</Provider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
