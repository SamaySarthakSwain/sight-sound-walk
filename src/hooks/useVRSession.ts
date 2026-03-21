import { useState, useEffect } from "react";

/**
 * Detects whether the browser supports WebXR immersive-vr sessions.
 * Works with Meta Quest 2, Quest 3, and modern desktop XR browsers.
 */
export function useVRSession() {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!navigator.xr) {
      setIsVRSupported(false);
      setIsChecking(false);
      return;
    }

    navigator.xr
      .isSessionSupported("immersive-vr")
      .then((supported) => {
        setIsVRSupported(supported);
      })
      .catch(() => {
        setIsVRSupported(false);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, []);

  return { isVRSupported, isChecking };
}
