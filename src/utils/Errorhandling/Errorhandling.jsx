import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Banner,
  RetryButton,
  Page,
  Code,
  Title,
  Text,
  Actions,
  PageButton,
} from "./Errorhandling.styles";

/* =====================================================
   1. Online / offline hook
===================================================== */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return isOnline;
}

/* =====================================================
   2. Offline banner
===================================================== */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [showBackOnline, setShowBackOnline] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      setShowBackOnline(false);
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      setShowBackOnline(true);
      const timer = setTimeout(() => setShowBackOnline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!isOnline) {
    return (
      <Banner $online={false} role="alert">
        <span>
          You're offline. Please check your internet connection. Your changes
          may not be saved.
        </span>
        <RetryButton onClick={() => window.location.reload()}>Retry</RetryButton>
      </Banner>
    );
  }

  if (showBackOnline) {
    return (
      <Banner $online role="status">
        You're back online.
      </Banner>
    );
  }

  return null;
}

/* =====================================================
   3. Friendly API error messages
   Returns null when no global popup should be shown
   (cancelled requests, and 400/422 form validation errors).
===================================================== */
export const getFriendlyError = (error) => {
  if (error?.code === "ERR_CANCELED") return null;

  // No response from the server at all
  if (!error?.response) {
    if (!navigator.onLine) {
      return {
        title: "No internet connection",
        message: "Please check your internet connection and try again.",
      };
    }
    if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
      return {
        title: "Request timed out",
        message:
          "The server is taking too long to respond. Please try again in a moment.",
      };
    }
    return {
      title: "Can't reach the server",
      message:
        "We couldn't connect to the server. Please check your internet connection or try again shortly.",
    };
  }

  // Server responded with an error status
  const status = error.response.status;

  switch (status) {
    case 400:
    case 422:
      return null; // forms show these themselves

    case 401:
      return {
        title: "Session expired",
        message: "Your session has expired. Please log in again.",
      };
    case 403:
      return {
        title: "Access denied",
        message: "You don't have permission to do this.",
      };
    case 404:
      return {
        title: "Not found",
        message:
          "We couldn't find what you were looking for. The link may be wrong or the item may have been removed.",
      };
    case 408:
      return {
        title: "Request timed out",
        message: "The request took too long. Please try again.",
      };
    case 429:
      return {
        title: "Too many requests",
        message:
          "You're doing that too quickly. Please wait a moment and try again.",
      };
    default:
      if (status >= 500) {
        return {
          title: "Something went wrong",
          message:
            "Something went wrong on our side. Please try again in a few minutes.",
        };
      }
      return null;
  }
};

/* =====================================================
   4. Axios interceptor (call once: setupErrorInterceptor(API))
   Skip for one request:  API.get(url, { skipGlobalError: true })
===================================================== */
let isShowing = false; // avoids a stack of popups when many requests fail

export const setupErrorInterceptor = (api) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.config?.skipGlobalError) return Promise.reject(error);

      const friendly = getFriendlyError(error);

      if (friendly && !isShowing) {
        isShowing = true;
        Swal.fire({
          icon: "error",
          title: friendly.title,
          text: friendly.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#304EB0",
        }).finally(() => {
          isShowing = false;
        });
      }

      return Promise.reject(error);
    },
  );
};

/* =====================================================
   5. 404 page
===================================================== */
export function NotFound() {
  const navigate = useNavigate();

  return (
    <Page>
      <Code>404</Code>
      <Title>Page not found</Title>
      <Text>
        Sorry, we couldn't find the page you're looking for. The link may be
        wrong or the page may have been moved.
      </Text>
      <Actions>
        <PageButton onClick={() => navigate(-1)}>Go Back</PageButton>
        <PageButton $primary onClick={() => navigate("/")}>
          Go to Home
        </PageButton>
      </Actions>
    </Page>
  );
}

/* =====================================================
   6. Error boundary (catches UI crashes)
===================================================== */
export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("UI crash:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Page>
        <Title>Something went wrong</Title>
        <Text>
          An unexpected error occurred. Please refresh the page. If the problem
          continues, contact support.
        </Text>
        <Actions>
          <PageButton $primary onClick={() => window.location.reload()}>
            Refresh Page
          </PageButton>
        </Actions>
      </Page>
    );
  }
}