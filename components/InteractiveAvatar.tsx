import type { StartAvatarResponse } from "@heygen/streaming-avatar";

import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents, TaskMode, TaskType, VoiceEmotion,
} from "@heygen/streaming-avatar";
import {
  Button,
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, usePrevious } from "ahooks";

import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";
import PMSForm from "./PMSForm";

import {AVATARS, STT_LANGUAGE_LIST} from "@/app/lib/constants";

// Define your conversation flow
const CONVERSATION_FLOW = {
  start: {
    buttons: [
      { id: 'greeting', text: 'Hello, I need help managing my money and I am looking for a PMS.' },
      { id: 'services', text: 'What are the services you offer?' }
    ],
    responses: {
      greeting: "Hi! I'm Aema. So you are looking for a PMS. That's great! Can you tell me more about your investment portfolio value?",
      services: "I'm an AI assistant specialized in wealth management at Ourmoney corporation. We offer a wide range of services to help you manage your money. We can help you with portfolio management, financial planning, and retirement planning."
    }
  },
  greeting: {
    buttons: [
      { id: 'below50', text: 'My portfolio value is below 50 lakhs' },
      { id: 'above50', text: 'My portfolio value is above 50 lakhs' }
    ],
    responses: {
      below50: "Oh no! You are not eligible for a PMS. SEBI mandates that the minimum portfolio value for a PMS is 50 lakhs. But you can still avail our other services like financial planning, retirement planning, etc.",
      above50: "Great! You are eligible for a PMS. We can help you manage your portfolio and provide you with the best investment options. May I know your details?"
    }
  },
  services: {
    buttons: [
      { id: 'portfolio_management', text: 'Portfolio Management' },
      { id: 'retirement_planning', text: 'Retirement Planning' }
    ],
    responses: {
      portfolio_management: "Great! We can help you with portfolio management. May I know your details?",
      retirement_planning: "Great! We can help you with retirement planning. May I know your details?"
    }
  },
  portfolio_management: {
    buttons: [
      { id: 'portfolio_management_details', text: 'Yes, My name is John Doe and my portfolio value is 80 lakhs' }
    ],
    responses: {
      portfolio_management_details: "Thank you for providing your details. We will get back to you soon."
    }
  },
  retirement_planning: {
    buttons: [
      { id: 'retirement_planning_details', text: 'Yes, My name is John Doe and I have 2 Crore.' }
    ],
    responses: {
      retirement_planning_details: "Thank you for providing your details. We will get back to you soon."
    }
  },
  above50: {
    buttons: [
      { id: 'portfolio_management_details', text: 'Yes, My name is John Doe and my portfolio value is 80 lakhs' }
    ],
    responses: {
      portfolio_management_details: "Thank you for providing your details. We will get back to you soon."
    }
  },
  below50: {
    buttons: [
      {id: 'thanks', text: 'Thank you.'}
    ],
    responses: {
      thanks: "Thank you for your time. We will get back to you soon."
    }
  }
};

// Define a type for the keys of CONVERSATION_FLOW
type ConversationStep = keyof typeof CONVERSATION_FLOW;

// Define a type for the responses of each step
type Responses = typeof CONVERSATION_FLOW[ConversationStep]['responses'];

interface InteractiveAvatarProps {
  onClose: () => void;
}

export default function InteractiveAvatar({ onClose }: InteractiveAvatarProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [data, setData] = useState<StartAvatarResponse>();
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('start');
  const [showForm, setShowForm] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const lastResponseRef = useRef("");

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
    }

    return "";
  }

  async function startSession() {
    setIsLoadingSession(true);
    const newToken = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token: newToken,
    });
    
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log("Avatar started talking", e);
      setIsAvatarSpeaking(true);
    });

    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, async (e) => {
      console.log("Avatar stopped talking", e);
      setIsAvatarSpeaking(false);
      
      console.log("Last response when stopped talking:", lastResponseRef.current);
      
      if (lastResponseRef.current.includes("Thank you for providing your details")) {
        console.log("Showing form...");
        setTimeout(() => {
          setShowForm(true);
        }, 500);
      }
    });
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
      console.log(">>>>> Stream ready:", event.detail);
      setStream(event.detail);
    });

    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: "June_HR_public",
        knowledgeId: "",
        voice: {
          rate: 1.5,
          emotion: VoiceEmotion.EXCITED,
        },
        language: "en",
        disableIdleTimeout: true,
      });

      setData(res);
    } catch (error) {
      console.error("Error starting avatar session:", error);
    } finally {
      setIsLoadingSession(false);
    }
  }
  async function handleSpeak() {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }

    const text = "Your text here"; // Define the text variable

    await avatar.current.speak({ text: text, taskType: TaskType.REPEAT, taskMode: TaskMode.SYNC }).catch((e) => {
      setDebug(e.message);
    });
  }
  async function handleInterrupt() {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current
      .interrupt()
      .catch((e) => {
        setDebug(e.message);
      });
  }
  async function endSession() {
    if (!showForm) {
      await avatar.current?.stopAvatar();
      setStream(undefined);
      onClose();
    }
  }

  async function handleButtonClick(responseKey: string) {
    if (!avatar.current) return;
    
    console.log("Button clicked with responseKey:", responseKey);
    
    setCurrentStep(responseKey as ConversationStep);
    
    // Use type assertion to specify that responseKey is a key of the current step's responses
    const response = CONVERSATION_FLOW[currentStep].responses[responseKey as keyof Responses];
    console.log("Response to speak:", response);
    
    // Store response in ref
    lastResponseRef.current = response;
    
    try {
      await avatar.current.speak({ 
        text: response, 
        taskType: TaskType.REPEAT, 
        taskMode: TaskMode.SYNC 
      });
    } catch (error) {
      console.error("Error in speaking:", error);
    }
  }

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [mediaStream, stream]);

  useEffect(() => {
    console.log("Current step:", currentStep);
    console.log("Show form state:", showForm);
    console.log("Last response ref:", lastResponseRef.current);
  }, [currentStep, showForm]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {!showForm ? (
        <Card className="flex-1 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
          <CardBody className="flex flex-col justify-center items-center">
            {stream ? (
              <div className="w-[900px] h-[500px] justify-center items-center flex rounded-lg overflow-hidden relative">
                <video
                  ref={mediaStream}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                >
                  <track kind="captions" />
                </video>
                <div className="flex flex-col gap-2 absolute top-3 right-3">
                  <Button
                    className="bg-gradient-to-r from-[#1f8844] to-[#1f8844] text-white"
                    size="md"
                    variant="shadow"
                    onClick={handleInterrupt}
                  >
                    Interrupt task
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#1f8844] to-[#1f8844] text-white"
                    size="md"
                    variant="shadow"
                    onClick={endSession}
                  >
                    End session
                  </Button>
                </div>
              </div>
            ) : (
              !isLoadingSession ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <p className="text-lg font-bold text-center mb-2">Disclaimer</p>
                  <p className="text-sm text-gray-400 text-center mb-4" style={{fontSize: '1.2rem'}}>
                  This is a demo to showcase the lead qualification process of Ema. <br/>For demonstration purposes, voice input has been disabled, and button inputs have been added instead. In the final implementation, this will be a fully interactive conversational agent that allows real-time voice interaction.
                  </p>
                 
                  <Button
                    className="bg-gradient-to-r from-[#1f8844] to-[#1f8844] text-white text-lg px-8 py-6 rounded-lg"
                    size="lg"
                    variant="shadow"
                    onClick={startSession}
                  >
                    Start session
                  </Button>
                </div>
                
              ) : (
                <Spinner color="default" size="lg" />
              )
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <PMSForm 
            clientName="John Doe"
            portfolioValue="80 lakhs"
          />
        </div>
      )}
      
      {/* Conversation buttons */}
      {stream && !showForm && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4">
          {CONVERSATION_FLOW[currentStep]?.buttons.map((button) => (
            <Button
              key={button.id}
              className="bg-gradient-to-r from-[#1f8844] to-[#1f8844] text-white text-lg px-6 py-4"
              size="lg"
              onClick={() => handleButtonClick(button.id)}
            >
              {button.text}
            </Button>
          ))}
        </div>
      )}

      {/* Disclaimer and Email Section */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-gray-400 mb-4" style={{fontSize: '0.7rem'}}>
          If the start session button is not working, it probably means that you've tried to start a session immediately after the previous one. Please wait for some time before starting a new session. <br/> Either this, or the credits on the free plan have ran out. :&apos;)<br /> 
          In that case, please contact me on <a href="mailto:f20201976@goa.bits-pilani.ac.in"><b className="text-indigo-300">Email</b></a>
        </p>
      </div>
    </div>
  );
}
