/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState } from "react";
import { observer } from "mobx-react";
import useMedia from "use-media";
import "webrtc-adapter";
import FlipCamera from "./FlipCamera";
import { getDeviceId, FacingMode, getVideoDevices } from "./utils/getDeviceId";
import useStores from "../../hooks/useStores";
import ViewFinder from "./ViewFinder";
import QRcodeWorker from "../../workers/QRcode.worker.ts";

const delay = 500;
const facingMode = FacingMode.REAR;
const resolution = 1200;
type ParseQrcodeProps = { imageData: ImageData };

const CameraPlaceholder = () => (
  <div className="overflow-hidden bg-gray-700 rounded-2xl aspect-h-16 aspect-w-9 sm:aspect-w-1 sm:aspect-h-1">
    <div className="w-full h-full" />
  </div>
);

const QrCamera = () => {
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [deviceSelected, setDeviceSelected] = useState<number>(0);
  const [latestPayload, setLatestPayload] = useState(null);
  const [isPermissionDenied, setPermissionDenied] = useState<boolean>(false);
  const qrCodeReader = useRef<
    Worker & {
      readQRcode: ({ imageData }: ParseQrcodeProps) => Promise<string>;
    }
  >(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { uiStore } = useStores();
  const mobile = useMedia("(max-width: 1023px)");

  const initiateQRcodeWorker = () => {
    if (!qrCodeReader.current) {
      qrCodeReader.current = new QRcodeWorker();
    }
  };

  const boundingRect = videoPreviewRef?.current?.getBoundingClientRect();

  const check = async () => {
    // Get image/video dimensions
    let width = Math.floor(videoPreviewRef?.current?.videoWidth) ?? 1;
    let height = Math.floor(videoPreviewRef?.current?.videoHeight) ?? 2;

    // Canvas draw offsets
    let hozOffset = 0;
    let vertOffset = 0;

    // Scale image to correct resolution
    // Crop image to fit 1:1 aspect ratio
    const smallestSize = width < height ? width : height;
    const ratio = resolution / smallestSize;

    height *= ratio;
    width *= ratio;

    vertOffset = ((height - resolution) / 2) * -1;
    hozOffset = ((width - resolution) / 2) * -1;

    if (canvasRef?.current) {
      canvasRef.current.width = resolution;
      canvasRef.current.height = resolution;
    }
    const previewIsPlaying =
      videoPreviewRef?.current &&
      videoPreviewRef?.current?.readyState ===
        videoPreviewRef?.current?.HAVE_ENOUGH_DATA;

    if (previewIsPlaying) {
      const ctx = canvasRef?.current?.getContext("2d");

      ctx.drawImage(
        videoPreviewRef?.current,
        hozOffset,
        vertOffset,
        width,
        height
      );

      const imageData = ctx.getImageData(
        0,
        0,
        canvasRef?.current?.width,
        canvasRef?.current?.height
      );

      qrCodeReader?.current
        ?.readQRcode({
          imageData
        })
        .then(async qrResults => {
          const { status, payload } = JSON.parse(qrResults);
          if (status === "success") {
            setLatestPayload(payload);
            if (payload?.verification !== latestPayload?.verification) {
              uiStore.setVerificationStatus({ status, payload });
            }
          }
        });
    }
    // Preview not ready -> check later
    if (typeof delay === "number") {
      await new Promise(resolve => {
        setTimeout(resolve, delay);
      });
    }
    check();
  };

  const handleLoadStart = async () => {
    videoPreviewRef?.current?.play();

    if (typeof delay === "number") {
      await new Promise(resolve => {
        setTimeout(resolve, delay);
      });
    }
    check();

    // Some browsers call loadstart continuously
    videoPreviewRef?.current?.removeEventListener("loadstart", handleLoadStart);
  };

  const handleVideo = (stream: any) => {
    // Preview element hasn't been rendered so wait for it.
    if (!videoPreviewRef?.current) {
      return;
    }

    // Handle different browser implementations of MediaStreams as src
    if (videoPreviewRef?.current?.srcObject !== undefined) {
      videoPreviewRef.current.srcObject = stream;
    } else if (window.URL.createObjectURL) {
      videoPreviewRef.current.src = window.URL.createObjectURL(stream);
    } else if (window.webkitURL) {
      videoPreviewRef.current.src = window.webkitURL.createObjectURL(stream);
    } else {
      videoPreviewRef.current.src = stream;
    }

    // IOS play in fullscreen
    videoPreviewRef.current.playsInline = true;
    // Assign `stopCamera` so the track can be stopped once component is cleared

    videoPreviewRef?.current?.addEventListener("loadstart", handleLoadStart);
  };

  const initiateCamera = async () => {
    const supported = navigator?.mediaDevices?.getSupportedConstraints();
    const constraints = { facingMode: null, frameRate: null };

    if (supported?.facingMode) {
      constraints.facingMode = { ideal: facingMode };
    }
    if (supported?.frameRate) {
      constraints.frameRate = { ideal: 25, min: 10 };
      if (navigator?.permissions) {
        const permissionName = "camera" as PermissionName;
        const permitted = await navigator?.permissions
          ?.query({ name: permissionName })
          ?.then(permissionObj => permissionObj.state)
          ?.catch(() => "denied");
        setPermissionDenied(false);

        if (permitted !== "granted") {
          setPermissionDenied(true);
        }

        if (permitted === "denied") {
          return;
        }
      }

      const vConstraintsPromise = getDeviceId({
        deviceId: availableDevices?.[deviceSelected]?.deviceId ?? null
      })
        .then(deviceId => {
          return {
            deviceId
          };
        })
        .catch(() => null);

      vConstraintsPromise
        .then((video: unknown) =>
          navigator?.mediaDevices?.getUserMedia({
            audio: false,
            video: mobile
              ? {
                  facingMode: {
                    exact: "environment"
                  }
                }
              : video
          })
        )
        .then(handleVideo)
        .catch(() => {});
    }
  };

  const checkAvailableDevices = async () => {
    const devices = await getVideoDevices();
    setAvailableDevices(devices);
  };

  useEffect(() => {
    initiateQRcodeWorker();
  }, []);

  useEffect(() => {
    initiateCamera();
  }, [deviceSelected, mobile]);

  useEffect(() => {
    checkAvailableDevices();
  }, []);

  return (
    <div>
      <section className="w-full overflow-hidden bg-gray-700 rounded-2xl">
        <div className="relative">
          <video
            ref={videoPreviewRef}
            playsInline
            className="w-full h-auto overflow-hidden bg-gray-700 rounded-2xl"
          >
            <track kind="captions" />
          </video>
          <div
            className="absolute p-6 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            style={{
              width:
                boundingRect?.width && boundingRect?.height
                  ? Math.min(boundingRect.width, boundingRect.height)
                  : 1
            }}
          >
            <div>
              <ViewFinder className="w-full h-full text-blue-400 animate-pulse" />
            </div>
          </div>
          {availableDevices?.length > 0 && (
            <button
              className="absolute items-center justify-center hidden w-20 h-20 p-2 text-center bg-gray-900 bg-opacity-50 rounded-full shadow-sm right-4 bottom-4 lg:flex hover:bg-gray-800 focus:outline-none"
              type="button"
              onClick={() => {
                setDeviceSelected(deviceSelected + 1);
                if (deviceSelected >= availableDevices.length) {
                  setDeviceSelected(0);
                }
              }}
            >
              <FlipCamera
                aria-hidden="true"
                className="inline-block text-white w-14 h-14"
              />
            </button>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
        {isPermissionDenied && <CameraPlaceholder />}
      </section>
    </div>
  );
};

export default observer(QrCamera);

export { CameraPlaceholder };
