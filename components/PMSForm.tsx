import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";
import CallBookingAnimation from "./CallBookingAnimation";
import CheckmarkAnimation from "./CheckmarkAnimation";

interface PMSFormProps {
  clientName: string;
  portfolioValue: string;
}

export default function PMSForm({ clientName, portfolioValue }: PMSFormProps) {
  const [currentField, setCurrentField] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const formData = [
    { label: "Name", value: clientName },
    { label: "Portfolio Value", value: portfolioValue },
    { label: "Mobile Number", value: "9876543210" },
    { label: "Address", value: "Church Street, Bengaluru, India" },
    { label: "PAN Number", value: "ABCDE1234F" },
    { label: "Aadhar Number", value: "1234 5678 9012" }
  ];

  const [displayedValues, setDisplayedValues] = useState(
    formData.map(() => "")
  );

  useEffect(() => {
    if (currentField < formData.length) {
      let currentText = "";
      const targetText = formData[currentField].value;
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex < targetText.length) {
          currentText += targetText[charIndex];
          setDisplayedValues(prev => {
            const newValues = [...prev];
            newValues[currentField] = currentText;
            return newValues;
          });
          charIndex++;
        } else {
          clearInterval(typingInterval);
          if (currentField === formData.length - 1) {
            setShowCheckmark(true);
            setTimeout(() => {
              setShowCheckmark(false);
              setShowBooking(true);
            }, 3000); // Show checkmark for 3 seconds before transitioning
          } else {
            setTimeout(() => setCurrentField(prev => prev + 1), 500);
          }
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [currentField]);

  return (
    <div className="space-y-4">
      {showCheckmark ? (
        <>
          <CheckmarkAnimation />
          <div className="fixed bottom-1/4 left-0 right-0 flex justify-center">
            <p className="text-xl font-semibold text-white animate-fadeIn">
              Form Autofilled and sent to Ops Team
            </p>
          </div>
        </>
      ) : showBooking ? (
        <CallBookingAnimation />
      ) : (
        <>
          <Card className="w-[600px] bg-gradient-to-br from-gray-900 to-black border border-gray-800">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#1f8844] to-[#1f8844] bg-clip-text text-transparent">
                PMS Application Form
              </h2>
              <div className="space-y-4">
                {formData.map((field, index) => (
                  <div key={field.label} className="space-y-2">
                    <label className="text-sm text-gray-400">{field.label}</label>
                    <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                      <p className="text-white">{displayedValues[index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <div className="flex justify-center">
            <p className={`text-sm font-mono bg-gradient-to-r from-cyan-400 to-[#1f8844] bg-clip-text text-transparent ${currentField < formData.length ? 'animate-pulse' : ''}`}>
              System: {currentField < formData.length 
                ? "Auto-populating form fields // Status: In Progress..." 
                : "Form Autofilled and sent to Ops Team"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}