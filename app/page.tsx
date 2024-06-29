'use client'

import React, { useState, forwardRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  step: number;
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

interface DataPoint {
  month: string;
  potentialStudents: number;
  enrolledStudents: number;
  efficiency: number;
  totalStudents: number;
}

const initialData: DataPoint[] = [
  { month: 'Jan', potentialStudents: 100, enrolledStudents: 65, efficiency: 65, totalStudents: 65 },
  { month: 'Feb', potentialStudents: 120, enrolledStudents: 71, efficiency: 59, totalStudents: 136 },
  { month: 'Mar', potentialStudents: 90, enrolledStudents: 72, efficiency: 80, totalStudents: 208 },
  { month: 'Apr', potentialStudents: 110, enrolledStudents: 89, efficiency: 81, totalStudents: 297 },
  { month: 'May', potentialStudents: 130, enrolledStudents: 73, efficiency: 56, totalStudents: 370 },
];

const StudentEnrollmentDashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>(initialData);
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
      const updatedData = [...data.slice(0, -1), {
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
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">Student Enrollment Success Monitoring</h2>

        <div className={'flex gap-3'}>
          {/* Total Students Graph */}
          <div className="mb-2 w-1/2">
            <h3 className="text-xl font-semibold mb-2">Total Students Over Time</h3>
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

          {/* Efficiency Graph */}
          <div className="mb-2 w-1/2">
            <h3 className="text-xl font-semibold mb-2">Student Conversion Efficiency Over Time</h3>
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
          <h3 className="text-lg font-semibold mb-2">Adjust Latest Month&apos;s Data</h3>
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
          <button
              onClick={updateLatestMonth}
              className="bg-green-500 text-white p-2 rounded mr-2"
          >
            Update Latest Month
          </button>
        </div>

        <form onSubmit={handleAddMonth} className="mt-4">
          <input
              type="text"
              value={newMonth}
              onChange={(e) => setNewMonth(e.target.value)}
              placeholder="New Month"
              className="border p-2 mr-2 black"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add New Month
          </button>
        </form>
      </div>
  );
};

export default StudentEnrollmentDashboard;
