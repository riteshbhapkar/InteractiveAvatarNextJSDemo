import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface PMSFormProps {
  clientName: string;
  portfolioValue: string;
}

export default function PMSForm({ clientName, portfolioValue }: PMSFormProps) {
  const [currentField, setCurrentField] = useState(0);
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
          setTimeout(() => setCurrentField(prev => prev + 1), 500);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [currentField]);

  return (
    <Card className="w-[600px] bg-gradient-to-br from-gray-900 to-black border border-gray-800">
      <CardBody className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
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
  );
}