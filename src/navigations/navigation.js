import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import QuizCompetitionScreen from '../screens/Competition/QuizCompetitionScreen';
import WheelScreen from '../screens/Competition/WheelScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import CoursesScreen from '../screens/Courses/CoursesScreen';
import BottomFormSheet from '../screens/Courses/BottomFormSheet';
import CoursesDetailScreen from '../screens/Courses/CoursesDetailScreen';
import QuizTopicsScreen from '../screens/Courses/QuizTopicsScreen';
import QuizScreen from '../screens/Courses/QuizScreen';
import NotesScreen from '../screens/Courses/NotesScreen';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import MatchupsScreen from '../screens/Competition/MatchupsScreen';
import ReauthenticateScreen from '../screens/Auth/ReauthenticateScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    const { isSignIn, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={60} color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: { backgroundColor: colors.background.primary },
                        headerTintColor: colors.primary,
                    }}
                >
                    {!isSignIn ? (
                        <>
                            <Stack.Screen name="Login"
                                component={LoginScreen}
                                options={{
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen name="SignUp"
                                component={SignUpScreen}
                                options={{
                                    headerShown: false,
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Stack.Screen
                                name="Home"
                                component={HomeScreen}
                                options={{
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="QuizCompetition"
                                component={QuizCompetitionScreen}
                                options={{
                                    title: '',
                                    animation: 'fade',
                                    headerBackVisible: false,
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="WheelScreen"
                                component={WheelScreen}
                                options={{
                                    animation: 'fade',
                                    title: '',
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="Matchups"
                                component={MatchupsScreen}
                                options={{
                                    animation: 'slide_from_bottom',
                                    title: 'Karşılaşmalar'
                                }}
                            />
                            <Stack.Screen
                                name="Settings"
                                component={SettingsScreen}
                                options={{
                                    animation: 'slide_from_bottom',
                                }}
                            />
                            <Stack.Screen
                                name="LeaderBoard"
                                component={LeaderBoardScreen}
                                options={{
                                    animation: 'slide_from_bottom',
                                    title: '',
                                    headerStyle: { backgroundColor: colors.primary },
                                    headerTintColor: colors.background.primary,
                                    headerShadowVisible: false,
                                }}
                            />
                            <Stack.Screen
                                name="EditProfile"
                                component={EditProfileScreen}
                                options={{
                                    animation: 'slide_from_bottom',
                                }}
                            />
                            <Stack.Screen
                                name="Courses"
                                component={CoursesScreen}
                                options={{
                                    animation: 'slide_from_bottom',
                                    headerTitle: 'Dersler',
                                }}
                            />
                            <Stack.Screen
                                name="BottomFormSheet"
                                component={BottomFormSheet}
                                options={{
                                    presentation: 'formSheet',
                                    sheetAllowedDetents: [0.4, 0.4],
                                    sheetCornerRadius: 20,
                                }}
                            />
                            <Stack.Screen
                                name="CoursesDetail"
                                component={CoursesDetailScreen}
                                options={{
                                    animation: 'slide_from_right',
                                    animationDuration: 100,
                                }}
                            />
                            <Stack.Screen
                                name="QuizTopics"
                                component={QuizTopicsScreen}
                                options={{
                                    animation: 'slide_from_right',
                                    animationDuration: 100,
                                }}
                            />
                            <Stack.Screen
                                name="Quiz"
                                component={QuizScreen}
                                options={{
                                    headerTitle: 'Test',
                                }}
                            />
                            <Stack.Screen
                                name="Notes"
                                component={NotesScreen}
                                options={{
                                    headerStyle: { backgroundColor: colors.background.secondary },
                                    animation: 'slide_from_bottom',
                                    headerShadowVisible: false,
                                    headerTitleAlign: 'center',
                                }}
                            />
                            
                            <Stack.Screen name="Reauthenticate"
                                component={ReauthenticateScreen}
                                options={{
                                    headerShown: false,
                                }}
                            />

                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>

    );
}