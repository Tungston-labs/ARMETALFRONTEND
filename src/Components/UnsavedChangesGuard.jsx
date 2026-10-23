// UnsavedChangesGuard.js
import { useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useNavigate,
  useLocation,
  UNSAFE_NavigationContext,
} from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function useBlocker(blocker, when = true) {
  const { navigator } = useContext(UNSAFE_NavigationContext);
  const pushRef = useRef(navigator.push);
  const replaceRef = useRef(navigator.replace);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    const replace = navigator.replace;

    navigator.push = (...args) => {
      if (blocker(args, push)) return;
      push.apply(navigator, args);
    };
    navigator.replace = (...args) => {
      if (blocker(args, replace)) return;
      replace.apply(navigator, args);
    };

    return () => {
      navigator.push = push;
      navigator.replace = replace;
    };
  }, [blocker, when, navigator]);

  // store original push/replace for bypass
  pushRef.current = navigator.push;
  replaceRef.current = navigator.replace;

  return { forcePush: pushRef.current, forceReplace: replaceRef.current };
}

export default function UnsavedChangesGuard({ children }) {
  const isDirty = useSelector((state) => state.employee.isDirty);
  const location = useLocation();
  const navigate = useNavigate();

  const { forcePush } = useBlocker(
    (args, originalPush) => {
      if (isDirty) {
        const nextPath = args[0]; // attempted path

        MySwal.fire({
          title: "Unsaved Changes",
          text: "Leaving this page will lose your entered data. Continue?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Leave Page",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
        }).then((result) => {
          if (result.isConfirmed) {
            originalPush(nextPath, args[1], args[2]);
          }
        });

        return true; // block navigation
      }
      return false; // allow navigation
    },
    isDirty
  );

  // Browser refresh/tab close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return <>{children}</>;
}
