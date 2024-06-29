'use client'

import React, { useState, forwardRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types
interface DataPoint {
  month: string;
  potentialStudents: number;
  enrolledStudents: number;
  efficiency: number;
  totalStudents: number;
}

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  step: number;
}

interface AccordionProps {
  children: React.ReactNode;
}

interface AccordionItemProps {
  children: React.ReactNode;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  onClick: () => void;
  isOpen: boolean;
}

interface AccordionContentProps {
  children: React.ReactNode;
  isOpen: boolean;
}

interface ProgressProps {
  value: number;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

interface Strategy {
  id: string;
  title: string;
  description: string;
  impact: number;
}

interface EfficiencyImprovementGuideProps {
  efficiency: number;
}

// Slider component
const Slider = forwardRef<HTMLInputElement, SliderProps>(({ value, onValueChange, max, step, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    onValueChange([newValue]);
  };

  return (
      <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={value ? value[0] : 0}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          ref={ref}
          {...props}
      />
  );
});

Slider.displayName = 'Slider';

// Accordion components
const Accordion: React.FC<AccordionProps> = ({ children, ...props }) => {
  return (
      <div className="divide-y divide-gray-200" {...props}>
        {children}
      </div>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({ children, ...props }) => {
  return <div className="py-2" {...props}>{children}</div>;
};

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, onClick, isOpen }) => {
  return (
      <button
          className="flex justify-between w-full py-2 text-left font-medium text-gray-900"
          onClick={onClick}
      >
        {children}
        <span className="ml-6 flex items-center">
        {isOpen ? (
            <svg className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        )}
      </span>
      </button>
  );
};

const AccordionContent: React.FC<AccordionContentProps> = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return <div className="mt-2 pr-12">{children}</div>;
};

// Progress component
const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-300">
        <div
            className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
            style={{ width: `${value}%` }}
        ></div>
      </div>
  );
};

// Button component
const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "default", ...props }) => {
  const baseClasses = "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500",
  };

  return (
      <button
          className={`${baseClasses} ${variantClasses[variant]}`}
          onClick={onClick}
          {...props}
      >
        {children}
      </button>
  );
};

interface StudentAmountImprovementGuideProps {
  currentStudents: number;
}

const StudentAmountImprovementGuide: React.FC<StudentAmountImprovementGuideProps> = ({ currentStudents }) => {
  const [implementedStrategies, setImplementedStrategies] = useState<Record<string, boolean>>({
    onlineCourses: false,
    internationalRecruitment: false,
    corporatePartnerships: false,
    scholarships: false,
  });
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const strategies: Strategy[] = [
    {
      id: "onlineCourses",
      title: "Expand Online Course Offerings",
      description: "Develop and promote more online courses to attract students who prefer remote learning or have scheduling constraints.",
      impact: 50,
    },
    {
      id: "internationalRecruitment",
      title: "Enhance International Recruitment",
      description: "Increase efforts to recruit international students through targeted marketing and partnerships with overseas institutions.",
      impact: 75,
    },
    {
      id: "corporatePartnerships",
      title: "Establish Corporate Partnerships",
      description: "Partner with local businesses to offer employee education programs, increasing enrollment through corporate sponsorships.",
      impact: 60,
    },
    {
      id: "scholarships",
      title: "Introduce New Scholarship Programs",
      description: "Create new merit-based and need-based scholarship opportunities to attract high-performing students and increase accessibility.",
      impact: 40,
    },
  ];

  const toggleStrategy = (id: string) => {
    setImplementedStrategies(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const calculateProjectedStudents = () => {
    const implementedImpact = strategies.reduce((total, strategy) => {
      if (implementedStrategies[strategy.id]) {
        return total + strategy.impact;
      }
      return total;
    }, 0);
    return currentStudents + implementedImpact;
  };

  return (
      <div className="p-6 mt-28 h-screen bg-slate-100">
        <div className={'mb-12'}>
          <h3 className="text-2xl font-bold mb-4 text-black">Lead Generation Improvement Guide</h3>
          <p className="mb-4 text-slate-600 font-bold">Current Students: {currentStudents}</p>
          <p className="mb-4 text-slate-600 font-bold">Projected: {calculateProjectedStudents()}</p>
          <Progress value={(calculateProjectedStudents() / (currentStudents * 2)) * 100} />
        </div>

        <Accordion>
          {strategies.map((strategy) => (
              <AccordionItem key={strategy.id}>
                <div className={'bg-white px-2 rounded-md'}>
                  <AccordionTrigger
                      onClick={() => setOpenItemId(openItemId === strategy.id ? null : strategy.id)}
                      isOpen={openItemId === strategy.id}
                  >
                    <p className="text-black font-bold">{strategy.title}</p>
                  </AccordionTrigger>
                  <AccordionContent isOpen={openItemId === strategy.id}>
                    <div className={'bg-white m-3 rounded-md mb-6'}>
                      <p className="mb-2 text-black">{strategy.description}</p>
                      <p className="text-black">Potential Impact: +{strategy.impact} students</p>
                    </div>
                    <Button
                        onClick={() => toggleStrategy(strategy.id)}
                        variant={implementedStrategies[strategy.id] ? "outline" : "default"}
                    >
                      {implementedStrategies[strategy.id] ? "Done!" : "Let's do it!"}
                    </Button>
                  </AccordionContent>
                </div>
              </AccordionItem>
          ))}
        </Accordion>
      </div>
  );
};

// EfficiencyImprovementGuide component
const EfficiencyImprovementGuide: React.FC<EfficiencyImprovementGuideProps> = ({ efficiency }) => {
  const [implementedStrategies, setImplementedStrategies] = useState<Record<string, boolean>>({
    socialMedia: false,
    referralProgram: false,
    openHouse: false,
    targetedAds: false,
  });
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const strategies: Strategy[] = [
    {
      id: "training",
      title: "Create online training sessions with recruiters",
      description: "The initial training sessions with recruiters may not be enough, we should have scheduled training sessions to keep our partners up-to-speed on the process , especially if there have been any changes which could decrease our efficiency in enrolling students.",
      impact: 18,
    },
    {
      id: "workflow",
      title: "Consider improvements to workflow",
      description: "If there are logistical or other improvements we could make to improve the system, we should consider them, then contact the relevant person to discuss a way forward.",
      impact: 10,
    },
    {
      id: "meetings",
      title: "Make in-person meetings with Agents",
      description: "Making in-person meetings with our partners would keep us up-to-date on the current market. We would also use this time to discuss ways to improve our performance and total output.",
      impact: 15,
    },
    {
      id: "requirements",
      title: "Review student requirements with recruiters",
      description: "Reviewing the student requirements with recruiters regarding the student's educational documents as well as their VISA documents would help to improve the efficiency by avoiding lost time due to incorrect documents being sent for review.",
      impact: 25,
    },
    {
      id: "questionnaire",
      title: "Email questionnaires to find recruiter's problems",
      description: "Creating a questionnaire to source the problems encountered by recruiters could help us to help them. This would increase the overall efficiency of student recruitment.",
      impact: 10,
    },
  ];

  const toggleStrategy = (id: string) => {
    setImplementedStrategies(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const calculateProjectedEfficiency = () => {
    const baseEfficiency = efficiency;
    const implementedImpact = strategies.reduce((total, strategy) => {
      if (implementedStrategies[strategy.id]) {
        return total + strategy.impact;
      }
      return total;
    }, 0);
    return Math.min(100, baseEfficiency + implementedImpact);
  };

  return (
      <div className="p-6 mt-28 h-screen bg-slate-100">
        <div className={'mb-12'}>
        <h3 className="text-2xl font-bold mb-4 text-black">Efficiency Improvement Guide</h3>
        <p className="mb-4 text-slate-600 font-bold">Efficiency this Month: {efficiency}%</p>
        <p className="mb-4 text-slate-600 font-bold">Projected: {calculateProjectedEfficiency()}%</p>
        <Progress value={calculateProjectedEfficiency()} />
        </div>

        <Accordion>
          {strategies.map((strategy) => (
              <AccordionItem key={strategy.id}>
                <div className={'bg-white px-2 rounded-md'}>
                <AccordionTrigger
                    onClick={() => setOpenItemId(openItemId === strategy.id ? null : strategy.id)}
                    isOpen={openItemId === strategy.id}
                ><p className="text-black font-bold">{strategy.title}</p>
                </AccordionTrigger>
                <AccordionContent isOpen={openItemId === strategy.id}>
                  <div className={'bg-white m-3 rounded-md mb-6'}>
                    <p className="mb-2 text-black">{strategy.description}</p>
                    <p className="text-black font-bold">Potential Impact: +{strategy.impact}%</p>
                  </div>
                  <Button
                      onClick={() => toggleStrategy(strategy.id)}
                      variant={implementedStrategies[strategy.id] ? "outline" : "default"}
                  >
                    {implementedStrategies[strategy.id] ? "Done!" : "Let's do it!"}
                  </Button>
                </AccordionContent>
              </div>
              </AccordionItem>
          ))}
        </Accordion>
      </div>
  );
};

// Main StudentEnrollmentDashboard component
const StudentEnrollmentDashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([
    { month: 'Jan', potentialStudents: 100, enrolledStudents: 65, efficiency: 65, totalStudents: 65 },
    { month: 'Feb', potentialStudents: 120, enrolledStudents: 71, efficiency: 59, totalStudents: 136 },
    { month: 'Mar', potentialStudents: 90, enrolledStudents: 72, efficiency: 80, totalStudents: 208 },
    { month: 'Apr', potentialStudents: 110, enrolledStudents: 89, efficiency: 81, totalStudents: 297 },
    { month: 'May', potentialStudents: 130, enrolledStudents: 73, efficiency: 56, totalStudents: 370 },
  ]);
  const [newMonth, setNewMonth] = useState('');
  const [potentialStudents, setPotentialStudents] = useState(100);
  const [enrolledStudents, setEnrolledStudents] = useState(50);

  const handleAddMonth = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMonth) {
      const efficiency = Math.round((enrolledStudents / potentialStudents) * 100);
      const lastTotalStudents = data[data.length - 1].totalStudents;
      const newDataPoint: DataPoint = {
        month: newMonth,
        potentialStudents,
        enrolledStudents,
        efficiency,
        totalStudents: lastTotalStudents + enrolledStudents
      };
      setData([...data, newDataPoint]);
      setNewMonth('');
    }
  };

  const updateLatestMonth = () => {
    if (data.length > 0) {
      const efficiency = Math.round((enrolledStudents / potentialStudents) * 100);
      const previousTotalStudents = data.length > 1 ? data[data.length - 2].totalStudents : 0;
      const updatedData: DataPoint[] = [...data.slice(0, -1), {
        ...data[data.length - 1],
        potentialStudents,
        enrolledStudents,
        efficiency,
        totalStudents: previousTotalStudents + enrolledStudents
      }];
      setData(updatedData);
    }
  };

  return (
      <div className="p-4 max-w-4xl mx-auto mb-12 h-screen">
        <h2 className="text-2xl font-bold mb-4 text-black">Student Enrollment Success Monitoring</h2>

        <div className="flex gap-3">
          <div className="mb-2 w-1/2">
            <h3 className="text-xl font-semibold mb-2 text-slate-600">Total Students Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalStudents" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-2 w-1/2">
            <h3 className="text-xl font-semibold mb-2 text-slate-600">Student Conversion Efficiency Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-lg font-semibold mb-2 text-slate-600">Adjust Current Month's Data</h3>
          <div className="mb-4">
            <label className="block mb-2 text-black">Potential Students: {potentialStudents}</label>
            <Slider
                value={[potentialStudents]}
                onValueChange={(value) => setPotentialStudents(value[0])}
                max={200}
                step={1}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black">Enrolled Students: {enrolledStudents}</label>
            <Slider
                value={[enrolledStudents]}
                onValueChange={(value) => setEnrolledStudents(Math.min(value[0], potentialStudents))}
                max={potentialStudents}
                step={1}
            />
          </div>
          <Button onClick={updateLatestMonth}>
            Update Latest Month
          </Button>
        </div>

        <form onSubmit={handleAddMonth} className="mt-4">
          <input
              type="text"
              value={newMonth}
              onChange={(e) => setNewMonth(e.target.value)}
              placeholder="New Month"
              className="border p-2 mr-2 text-black"
          />
          <Button type="submit">
            Add New Month
          </Button>
        </form>

        <EfficiencyImprovementGuide efficiency={data[data.length - 1].efficiency} />
        <StudentAmountImprovementGuide currentStudents={data[data.length - 1].totalStudents} />

      </div>
  );
};

export default StudentEnrollmentDashboard;
