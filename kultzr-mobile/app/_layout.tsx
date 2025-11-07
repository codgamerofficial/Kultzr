import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0b0b0d', '#1e1e20']}
        style={{ flex: 1 }}
      >
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0b0b0d',
            },
            headerTintColor: '#f5f5f5',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#a4ff00',
            },
            contentStyle: {
              backgroundColor: '#0b0b0d',
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              title: "[KULTZR]"
            }} 
          />
          <Stack.Screen 
            name="products" 
            options={{ 
              title: "PRODUCTS",
              headerBackTitleVisible: false
            }} 
          />
          <Stack.Screen 
            name="product/[id]" 
            options={{ 
              title: "PRODUCT DETAILS",
              headerBackTitleVisible: false
            }} 
          />
          <Stack.Screen 
            name="cart" 
            options={{ 
              title: "SHOPPING CART",
              headerBackTitleVisible: false
            }} 
          />
          <Stack.Screen 
            name="checkout" 
            options={{ 
              title: "CHECKOUT",
              headerBackTitleVisible: false
            }} 
          />
          <Stack.Screen 
            name="profile" 
            options={{ 
              title: "MY ACCOUNT",
              headerBackTitleVisible: false
            }} 
          />
          <Stack.Screen 
            name="search" 
            options={{ 
              title: "SEARCH",
              headerBackTitleVisible: false
            }} 
          />
        </Stack>
        <StatusBar style="light" />
      </LinearGradient>
    </GestureHandlerRootView>
  );
}