import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/index.css";
import { loadFromStorage } from "./features/auth/authSlice";

const queryClient = new QueryClient();

// Hydrate auth from localStorage BEFORE React renders
store.dispatch(loadFromStorage());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          containerStyle={{
            zIndex: 999999,
            top: 20,
            right: 20,
          }}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0B0B2A',
              color: '#fff',
              border: '1px solid #272744',
            },
          }}
        />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
