import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MenuBase from "./components/MenuBaseComponent";
import { Provider, useDispatch } from "react-redux";
import { ConfigureStore } from "./redux/configureStore";
import { startAuthListener } from "./redux/ActionCreators";

const store = ConfigureStore();

function AuthBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(startAuthListener());

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch]);

  return <MenuBase />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <AuthBootstrap />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}
