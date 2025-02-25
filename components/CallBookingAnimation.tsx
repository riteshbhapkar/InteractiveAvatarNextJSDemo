import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function CallBookingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingStatus, setBookingStatus] = useState("Initializing booking process...");

  useEffect(() => {
    // Generate random date (within next 3 days)
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 1);
    setSelectedDate(date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Generate random time (between 10 AM and 5 PM)
    const hour = Math.floor(Math.random() * 8) + 10;
    const minute = Math.random() < 0.5 ? "00" : "30";
    setSelectedTime(`${hour}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`);

    // Animate through different steps
    const steps = [
      "Analyzing calendar availability...",
      "Checking RM schedules...",
      "Optimizing time slots...",
      "Finalizing appointment...",
      "Booking confirmed!"
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setBookingStatus(steps[stepIndex]);
        setCurrentStep(stepIndex);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="w-[600px] bg-gradient-to-br from-gray-900 to-black border border-gray-800">
        <CardBody className="p-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Scheduling Your Call
            </h2>
            
            {/* Animated circles */}
            <div className="flex justify-center space-x-4">
              {[0, 1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    step <= currentStep 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 scale-110' 
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            {/* Status message */}
            <div className="text-center">
              <p className="text-gray-400 font-mono animate-pulse">
                {bookingStatus}
              </p>
            </div>

            {/* Calendar visualization */}
            {currentStep >= 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <p className="text-gray-400 mb-2">Selected Date:</p>
                  <p className="text-white font-mono">{selectedDate}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <p className="text-gray-400 mb-2">Selected Time:</p>
                  <p className="text-white font-mono">{selectedTime}</p>
                </div>
              </div>
            )}

            {/* Success message */}
            {currentStep === 4 && (
              <div className="text-center animate-fadeIn">
                <p className="text-green-400 font-semibold">
                  Your call has been scheduled successfully!
                </p>
                <p className="text-gray-400 mt-2">
                  A calendar invite has been sent to your email.
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Animated status bar */}
      <div className="w-[600px] h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(currentStep + 1) * 20}%` }}
        />
      </div>
    </div>
  );
}