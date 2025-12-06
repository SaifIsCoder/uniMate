import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/AppNavigator";
import { UserProvider } from "./src/context/UserContext";
export default function App() {

  return (
      <UserProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
   
  );
}
